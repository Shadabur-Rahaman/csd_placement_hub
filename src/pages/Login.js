import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/client';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = useCallback((e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }, []);

  // Function to handle test admin login
  const handleTestAdmin = useCallback((e) => {
    e && e.preventDefault();
    setFormData({
      email: 'testadmin@example.com',
      password: 'test886747'
    });
    // Auto-submit the form after setting the test credentials
    setTimeout(() => {
      document.querySelector('form')?.requestSubmit();
    }, 100);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Test admin credentials
    const testCredentials = {
      email: 'testadmin@example.com',
      password: 'test886747'
    };

    try {
      // If using test credentials, create admin user if not exists
      if (formData.email === testCredentials.email && formData.password === testCredentials.password) {
        console.log('Test admin login successful');
        
        // Set test admin flag in localStorage
        localStorage.setItem('isTestAdmin', 'true');
        
        // Create a mock auth state for test admin
        const mockUser = {
          uid: 'test-admin-uid',
          email: testCredentials.email,
          emailVerified: true,
          isAnonymous: false,
          accessToken: 'test-access-token',
          metadata: {},
          providerData: [{
            providerId: 'password',
            uid: testCredentials.email,
            displayName: 'Test Admin',
            email: testCredentials.email,
            phoneNumber: null,
            photoURL: null
          }],
          refreshToken: 'test-refresh-token',
          stsTokenManager: {
            accessToken: 'test-access-token',
            refreshToken: 'test-refresh-token',
            expirationTime: Date.now() + 3600 * 1000
          },
          delete: async () => {},
          getIdToken: async () => 'test-id-token',
          getIdTokenResult: async () => ({
            token: 'test-id-token',
            expirationTime: new Date(Date.now() + 3600 * 1000).toISOString(),
            issuedAtTime: new Date().toISOString(),
            signInProvider: 'password',
            claims: { role: 'admin' }
          }),
          reload: async () => {},
          toJSON: () => ({
            uid: 'test-admin-uid',
            email: testCredentials.email,
            emailVerified: true,
            isAnonymous: false,
            providerData: [{
              providerId: 'password',
              email: testCredentials.email
            }]
          })
        };
        
        // For Firebase v9+, we'll use a different approach
        // Set the test admin flag in sessionStorage for immediate use
        sessionStorage.setItem('testAdmin', 'true');
        
        // Create a mock auth state
        const mockAuth = {
          currentUser: mockUser,
          onAuthStateChanged: (callback) => {
            // Call immediately with mock user
            callback(mockUser);
            // Return unsubscribe function
            return () => {};
          },
          signOut: async () => {
            localStorage.removeItem('isTestAdmin');
            sessionStorage.removeItem('testAdmin');
            window.location.href = '/admin/login';
          }
        };
        
        // Replace the auth instance methods
        Object.keys(mockAuth).forEach(key => {
          auth[key] = mockAuth[key];
        });
        
        // Force update any auth state listeners
        if (typeof auth.onAuthStateChanged === 'function') {
          auth.onAuthStateChanged(() => {});
        }
        
        // Try to create admin user in Firestore (non-blocking)
        (async () => {
          try {
            const { setDoc, doc, serverTimestamp } = await import('firebase/firestore');
            const { db } = await import('../firebase/client');
            
            await setDoc(doc(db, 'users', 'test-admin-uid'), {
              email: testCredentials.email,
              role: 'admin',
              name: 'Test Admin',
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp()
            }, { merge: true });
            
            console.log('Admin user created/updated in Firestore');
          } catch (firestoreError) {
            console.error('Error creating admin user:', firestoreError);
          }
        })();
        
        // Redirect to admin panel
        navigate('/admin', { replace: true });
        return;
      }
      
      // Regular login for other users
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate('/admin');
    } catch (error) {
      console.error('Error signing in:', error);
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  }, [formData, navigate]);

  const handleResetPassword = useCallback(async (e) => {
    e.preventDefault();
    setResetLoading(true);

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast.success('Password reset email sent!');
      setShowResetModal(false);
      setResetEmail('');
    } catch (error) {
      console.error('Error sending reset email:', error);
      toast.error(error.message);
    } finally {
      setResetLoading(false);
    }
  }, [resetEmail]);

  const togglePassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Image/Pattern */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-600 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <FaGraduationCap className="text-8xl mx-auto" />
            </motion.div>
            <h1 className="text-4xl font-bold mb-4">PESITM</h1>
            <p className="text-xl opacity-90">Computer Science and Design</p>
            <p className="text-lg opacity-80 mt-2">Department Admin Portal</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="text-white opacity-75 text-sm">
            <p>PES Institute of Technology and Management</p>
            <p>NH 206, Sagar Road, Shivamogga – 577 204</p>
            <p>© 2024 PESITM. All rights reserved.</p>
          </div>
        </div>
      </motion.div>

      {/* Right side - Login Form */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8"
      >
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="lg:hidden mb-6"
            >
              <FaGraduationCap className="text-6xl mx-auto text-indigo-600" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">PESITM CSD</h2>
            <p className="text-gray-600">Sign in to access the department admin dashboard</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
                  placeholder="admin@department.edu"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors mb-4 ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>
              
              <button
                onClick={handleTestAdmin}
                className="w-full py-3 px-4 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                Use Test Admin Account
              </button>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition duration-150"
              >
                Forgot password?
              </button>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
            >
              {loading ? (
                <>
                  <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </motion.button>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/admin/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Create admin account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Password Reset Modal */}
      <AnimatePresence>
        {showResetModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Reset Password</h3>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="resetEmail"
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowResetModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={resetLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {resetLoading ? 'Sending...' : 'Send Reset Link'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login; 