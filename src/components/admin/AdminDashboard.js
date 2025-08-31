import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/client';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const sidebarItems = [
    { name: 'Dashboard', path: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Notifications', path: '/admin/notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { name: 'Certifications', path: '/admin/certifications', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'Achievements', path: '/admin/achievements', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
    { name: 'Research Papers', path: '/admin/research', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { name: 'Placements', path: '/admin/placements', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { name: 'Events', path: '/admin/events', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: 'Students', path: '/admin/students', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { name: 'Faculty', path: '/admin/faculty', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  ];

  return (
    <div className={`min-h-screen flex overflow-x-hidden relative ${
      isLight 
        ? 'bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100' 
        : 'bg-[#030014] bg-grid-pattern'
    }`}>
      {/* Background Elements */}
      <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden">
        <div className={`absolute top-0 -right-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob ${
          isLight ? 'bg-pink-400' : 'bg-purple-500'
        }`}></div>
        <div className={`absolute bottom-0 left-0 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000 ${
          isLight ? 'bg-blue-400' : 'bg-cyan-500'
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000 ${
          isLight ? 'bg-violet-400' : 'bg-pink-500'
        }`}></div>
      </div>

      {/* Mobile Header - Fixed at top */}
      <div className={`fixed top-0 left-0 right-0 z-50 md:hidden transition-all duration-300 ${
        isScrolled 
          ? isLight 
            ? 'bg-white/90 shadow-lg backdrop-blur-xl'
            : 'bg-gray-900/90 shadow-lg backdrop-blur-xl'
          : 'bg-transparent'
      }`}>
        <div className="px-3 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className={`p-2 rounded-xl transition-all active:scale-95 ${
              isLight 
                ? 'text-gray-600 hover:bg-gray-100 active:bg-gray-200' 
                : 'text-gray-400 hover:bg-gray-800 active:bg-gray-700'
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className={`text-lg font-bold bg-gradient-to-r ${
            isLight 
              ? 'from-pink-500 to-violet-500' 
              : 'from-violet-400 to-cyan-400'
          } text-transparent bg-clip-text`}>
            Faculty&nbsp;Panel
          </span>
          <button
            onClick={handleLogout}
            className={`p-2 rounded-xl transition-all active:scale-95 ${
              isLight
                ? 'text-gray-600 hover:bg-red-50 hover:text-red-600 active:bg-red-100'
                : 'text-gray-400 hover:bg-red-500/10 hover:text-red-400 active:bg-red-500/20'
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Sidebar - Slide from left */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden touch-none"
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              className={`fixed inset-y-0 left-0 z-50 w-[280px] max-w-[90vw] ${
                isLight 
                  ? 'bg-white/90 backdrop-blur-xl border-r border-gray-200' 
                  : 'bg-gray-900/90 backdrop-blur-xl border-r border-white/10'
              } overflow-hidden`}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-gray-200/10">
                  <span className={`text-xl font-bold bg-gradient-to-r ${
                    isLight 
                      ? 'from-pink-500 to-violet-500' 
                      : 'from-violet-400 to-cyan-400'
                  } text-transparent bg-clip-text`}>
                    Faculty&nbsp;Panel
                  </span>
                  <button
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className={`p-2.5 rounded-xl transition-all active:scale-95 ${
                      isLight 
                        ? 'text-gray-600 hover:bg-gray-100 active:bg-gray-200' 
                        : 'text-gray-400 hover:bg-gray-800 active:bg-gray-700'
                    }`}
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
              </div>

                <nav className="flex-1 overflow-y-auto overscroll-contain py-2 px-2 space-y-1">
                {sidebarItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 active:scale-98 ${
                      location.pathname === item.path
                          ? isLight 
                            ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg shadow-pink-500/25' 
                            : 'bg-violet-500/20 text-violet-400 shadow-lg shadow-violet-500/10'
                          : isLight
                            ? 'text-gray-700 hover:bg-pink-50 active:bg-pink-100'
                            : 'text-gray-300 hover:bg-violet-500/10 active:bg-violet-500/20'
                      }`}
                  >
                    <svg
                        className="w-5 h-5 mr-3 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                    </svg>
                      <span className="truncate">{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.div
        initial={false}
        animate={{ 
          width: isSidebarOpen ? (isHovered ? '280px' : '64px') : '0px',
          transition: { duration: 0.3, ease: "easeInOut" }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`hidden md:block sticky top-0 h-screen ${
          isLight 
            ? 'bg-white/80 backdrop-blur-xl border-r border-gray-200' 
            : 'bg-gray-900/80 backdrop-blur-xl border-r border-white/10'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-3">
            {isHovered && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`text-xl font-bold bg-gradient-to-r ${
                  isLight 
                    ? 'from-pink-500 to-violet-500' 
                    : 'from-violet-400 to-cyan-400'
                } text-transparent bg-clip-text`}
              >
                Faculty&nbsp;Panel
              </motion.span>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-2 rounded-xl transition-all active:scale-95 ${
                isLight 
                  ? 'text-gray-600 hover:bg-gray-100 active:bg-gray-200' 
                  : 'text-gray-400 hover:bg-gray-800 active:bg-gray-700'
              }`}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 px-2 space-y-1 py-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-xl transition-all duration-200 ${
                  location.pathname === item.path
                    ? isLight 
                      ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg shadow-pink-500/25' 
                      : 'bg-violet-500/20 text-violet-400 shadow-lg shadow-violet-500/10'
                    : isLight
                      ? 'text-gray-700 hover:bg-pink-50 active:bg-pink-100'
                      : 'text-gray-300 hover:bg-violet-500/10 active:bg-violet-500/20'
                }`}
              >
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                </svg>
                {isHovered && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="ml-3 whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </Link>
            ))}
          </nav>

          <div className="p-3">
            <button
              onClick={handleLogout}
              className={`flex items-center justify-center w-full px-3 py-2 rounded-xl transition-all duration-200 ${
                isLight
                  ? 'text-gray-700 hover:bg-red-50 hover:text-red-600 active:bg-red-100'
                  : 'text-gray-300 hover:bg-red-500/10 hover:text-red-400 active:bg-red-500/20'
              }`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {isHovered && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="ml-3"
                >
                  Sign&nbsp;Out
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        
        {/* Content */}
        <main className="flex-1 p-3 md:p-4 pt-16 md:pt-4">
              {children}
        </main>
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;