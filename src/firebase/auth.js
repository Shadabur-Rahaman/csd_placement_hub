import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { auth, db } from './client';

/**
 * Sign up a new user with email, password, and name
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} name - User display name
 * @returns {Promise<object>} - Success status and message
 */
export async function signUp(email, password, name) {
  try {
    // Create the user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    
    // Store additional user data in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      name,
      email,
      role: 'user', // Default role
      createdAt: new Date().toISOString()
    });
    
    return {
      success: true,
      message: 'Account created successfully. Please sign in.',
      user: userCredential.user
    };
  } catch (error) {
    console.error('Error creating user:', error);
    
    if (error.code === 'auth/email-already-in-use') {
      return {
        success: false,
        message: 'This email is already in use.'
      };
    }
    
    return {
      success: false,
      message: 'Failed to create an account.'
    };
  }
}

/**
 * Sign in an existing user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<object>} - Success status and message
 */
export async function signIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Check if user exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    
    if (!userDoc.exists()) {
      // Create user document if it doesn't exist (fallback)
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: userCredential.user.displayName || email.split('@')[0],
        email,
        role: 'user',
        createdAt: new Date().toISOString()
      });
    }

    // Find and associate any guest bookings with this email
    const bookingsRef = collection(db, 'bookings');
    const guestBookingsQuery = query(
      bookingsRef,
      where('userEmail', '==', email),
      where('isGuestBooking', '==', true)
    );

    const guestBookingsSnapshot = await getDocs(guestBookingsQuery);
    
    // Update each guest booking to be associated with the user
    const updatePromises = guestBookingsSnapshot.docs.map(async (bookingDoc) => {
      const bookingData = bookingDoc.data();
      const bookingRef = doc(db, 'bookings', bookingDoc.id);
      
      // Update the main booking document
      await updateDoc(bookingRef, {
        userId: userCredential.user.uid,
        isGuestBooking: false
      });

      // Create a copy in the user's bookings collection
      await setDoc(doc(db, 'users', userCredential.user.uid, 'bookings', bookingDoc.id), {
        ...bookingData,
        userId: userCredential.user.uid,
        isGuestBooking: false
      });
    });

    await Promise.all(updatePromises);
    
    return {
      success: true,
      message: 'Successfully signed in.',
      user: userCredential.user
    };
  } catch (error) {
    console.error('Error signing in:', error);
    
    if (error.code === 'auth/user-not-found') {
      return {
        success: false,
        message: 'User does not exist. Create an account instead.'
      };
    }
    
    if (error.code === 'auth/wrong-password') {
      return {
        success: false,
        message: 'Incorrect password. Please try again.'
      };
    }
    
    return {
      success: false,
      message: 'Failed to sign in. Please check your credentials.'
    };
  }
}

/**
 * Sign out the currently authenticated user
 * @returns {Promise<object>} - Success status and message
 */
export async function logOut() {
  try {
    await signOut(auth);
    return {
      success: true,
      message: 'Successfully signed out.'
    };
  } catch (error) {
    console.error('Error signing out:', error);
    return {
      success: false,
      message: 'Failed to sign out.'
    };
  }
}

/**
 * Reset user password
 * @param {string} email - User email
 * @returns {Promise<object>} - Success status and message
 */
export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: 'Password reset email sent. Check your inbox and spam folder for instructions.'
    };
  } catch (error) {
    console.error('Error resetting password:', error);
    
    // Handle specific Firebase Auth error codes
    if (error.code === 'auth/user-not-found') {
      return {
        success: false,
        message: 'We could not find an account with that email address. Please check or create a new account.'
      };
    }
    
    if (error.code === 'auth/invalid-email') {
      return {
        success: false,
        message: 'Please enter a valid email address.'
      };
    }
    
    if (error.code === 'auth/too-many-requests') {
      return {
        success: false,
        message: 'Too many password reset attempts. Please try again later.'
      };
    }
    
    // Generic error message as fallback
    return {
      success: false,
      message: 'Failed to send password reset email. Please try again later.'
    };
  }
}

/**
 * Get the current user's role from Firestore
 * @param {string} uid - User ID
 * @returns {Promise<string>} - User role
 */
export async function getUserRole(uid) {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (userDoc.exists()) {
      return userDoc.data().role || 'user';
    }
    
    return 'user';
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'user';
  }
}

/**
 * Check if the current user is authenticated
 * @returns {boolean} - True if user is authenticated
 */
export function isAuthenticated() {
  return !!auth.currentUser;
}

/**
 * Get the current user object
 * @returns {object|null} - Current user or null
 */
export function getCurrentUser() {
  return auth.currentUser;
}

/**
 * Make a user an admin
 * @param {string} uid - User ID to make admin
 * @returns {Promise<object>} - Success status and message
 */
export async function makeUserAdmin(uid) {
  try {
    await setDoc(doc(db, 'users', uid), {
      role: 'admin',
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    return {
      success: true,
      message: 'User has been made an admin successfully.'
    };
  } catch (error) {
    console.error('Error making user admin:', error);
    return {
      success: false,
      message: 'Failed to make user an admin.'
    };
  }
} 