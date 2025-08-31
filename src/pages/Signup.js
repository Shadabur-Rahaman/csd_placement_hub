import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signUp, getUserRole } from '../firebase/auth';
import { motion } from 'framer-motion';
import { GiCupcake, GiKnifeFork } from 'react-icons/gi';
import { FiUserPlus, FiMail, FiLock, FiUser } from 'react-icons/fi';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    // Validate form data
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters long');
    }

    try {
      setError('');
      setSuccessMessage('');
      setLoading(true);
      
      // First use our enhanced signUp function for better error handling
      const result = await signUp(formData.email, formData.password, formData.name);
      
      if (!result.success) {
        setError(result.message);
        return;
      }
      
      // If successful, also update the auth context
      await signup(formData.email, formData.password, formData.name);
      
      // Check user role - normally new users are just 'user' but check in case
      const userRole = await getUserRole(result.user.uid);
      const redirectPath = userRole === 'admin' ? '/admin' : '/dashboard';
      
      setSuccessMessage(`Account created successfully! Redirecting to ${userRole} dashboard...`);
      
      // Navigate after a brief delay to show the success message
      setTimeout(() => {
        navigate(redirectPath);
      }, 1500);
    } catch (error) {
      let errorMessage = 'Failed to create an account.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already in use. Please try logging in instead.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Please choose a stronger password.';
      } else if (error.message) {
        errorMessage += ' ' + error.message;
      }
      
      setError(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen food-pattern-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="flex justify-center mb-4">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: 2, repeatDelay: 3 }}
        >
          <GiKnifeFork className="text-5xl" style={{ color: 'var(--primary)' }} />
        </motion.div>
      </div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center font-display" style={{ textShadow: '2px 2px 0px rgba(231, 76, 60, 0.15)' }}>
          Create Your Account
        </h1>
        <p className="mt-2 text-center" style={{ color: 'var(--text-secondary)' }}>
          Or{' '}
          <Link to="/login" className="font-medium" style={{ color: 'var(--primary)' }}>
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card-funky py-8 px-6">
          <div className="flex justify-center mb-6">
            <div className="food-icon icon-pizza"></div>
            <div className="food-icon icon-burger"></div>
            <div className="food-icon icon-ice-cream"></div>
          </div>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-lg"
              style={{ backgroundColor: 'rgba(231, 76, 60, 0.1)', border: '1px solid var(--error)', color: 'var(--error)' }}
            >
              <span className="block sm:inline">{error}</span>
            </motion.div>
          )}
          
          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-lg"
              style={{ backgroundColor: 'rgba(39, 174, 96, 0.1)', border: '1px solid var(--success)', color: 'var(--success)' }}
            >
              <span className="block sm:inline">{successMessage}</span>
            </motion.div>
          )}
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Full Name
              </label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FiUser style={{ color: 'var(--text-tertiary)' }} />
                </span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  style={{ borderRadius: 'var(--radius-md)' }}
                  className="appearance-none block w-full pl-10 p-3 border placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Email address
              </label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FiMail style={{ color: 'var(--text-tertiary)' }} />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  style={{ borderRadius: 'var(--radius-md)' }}
                  className="appearance-none block w-full pl-10 p-3 border placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FiLock style={{ color: 'var(--text-tertiary)' }} />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  style={{ borderRadius: 'var(--radius-md)' }}
                  className="appearance-none block w-full pl-10 p-3 border placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm"
                />
              </div>
              <p className="mt-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>Password must be at least 6 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FiLock style={{ color: 'var(--text-tertiary)' }} />
                </span>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{ borderRadius: 'var(--radius-md)' }}
                  className="appearance-none block w-full pl-10 p-3 border placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex justify-center items-center py-3 px-4 border-0 rounded-full shadow-sm text-white text-sm font-medium ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                style={{ 
                  backgroundColor: 'var(--primary)',
                  boxShadow: 'var(--btn-shadow)'
                }}
              >
                {loading ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <FiUserPlus className="mr-2" />
                    Sign up
                  </>
                )}
              </motion.button>
            </div>
          </form>

          <div className="mt-8 relative">
            <div className="divider-dots"></div>
            <div className="relative flex justify-center">
              <span className="px-4 text-sm bg-white" style={{ color: 'var(--text-tertiary)' }}>
                Already have an account?
              </span>
            </div>
          </div>

          <div className="mt-6">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link 
                to="/login"
                className="w-full flex justify-center items-center py-3 px-4 border-2 rounded-full shadow-sm text-sm font-medium"
                style={{ 
                  borderColor: 'var(--primary)',
                  color: 'var(--primary)'
                }}
              >
                <GiCupcake className="mr-2" />
                Sign in instead
              </Link>
            </motion.div>
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm" style={{ color: 'var(--text-tertiary)' }}>
          By signing up, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
} 