const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, updateDoc, doc } = require('firebase/firestore');
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fixFacultyData() {
  try {
    console.log('Fetching faculty data from Firestore...');
    const querySnapshot = await getDocs(collection(db, 'faculty'));
    
    if (querySnapshot.empty) {
      console.log('No faculty documents found in Firestore.');
      return;
    }
    
    console.log('\nFound', querySnapshot.size, 'faculty members to update');
    console.log('==========================================');
    
    for (const docSnapshot of querySnapshot.docs) {
      const docRef = doc(db, 'faculty', docSnapshot.id);
      const data = docSnapshot.data();
      
      // Skip if already updated
      if (data.imageUrl && data.position) {
        console.log(`\nSkipping ${data.name} - already has correct fields`);
        continue;
      }
      
      // Prepare updates
      const updates = {};
      
      // Update position from designation if needed
      if (data.designation && !data.position) {
        updates.position = data.designation;
        console.log(`Updating position for ${data.name}: ${data.designation}`);
      }
      
      // Update education from qualification if needed
      if (data.qualification && !data.education) {
        updates.education = data.qualification;
      }
      
      // Ensure imageUrl is set correctly
      if (!data.imageUrl && data.imageBase64) {
        // If we have base64 but no URL, we need to handle this case
        console.log(`Warning: ${data.name} has imageBase64 but no imageUrl`);
      }
      
      // Only update if we have changes to make
      if (Object.keys(updates).length > 0) {
        console.log(`Updating ${data.name} with:`, updates);
        await updateDoc(docRef, updates);
        console.log(`✅ Updated ${data.name}`);
      } else {
        console.log(`No updates needed for ${data.name}`);
      }
      
      console.log('------------------------------------------');
    }
    
    console.log('\nUpdate process completed!');
    
  } catch (error) {
    console.error('Error updating faculty data:', error);
  } finally {
    process.exit(0);
  }
}

fixFacultyData();
