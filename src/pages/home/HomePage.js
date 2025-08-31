import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/client';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import FacultySection from '../../components/sections/FacultySection';
import { ContainerScroll } from '../../components/ui/container-scroll-animation';
import { AnimatedTestimonials } from '../../components/ui/animated-testimonials';
import { TextHoverEffect } from '../../components/ui/text-hover-effect';
import Footer from '../../components/layout/Footer';

// Animation variants for text slide (kept if you reuse elsewhere)
const textSlideVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

const HomePage = () => {
  // notifications
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [currentNotificationIndex, setCurrentNotificationIndex] = useState(0);

  // faculty
  const [facultyData, setFacultyData] = useState([]);
  const [facultyLoading, setFacultyLoading] = useState(true);

  const videoRef = useRef(null);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    fetchActiveNotifications();
    fetchFacultyData();
  }, []);

  // Notification auto-rotation
  useEffect(() => {
    if (notifications.length > 0) {
      setShowNotification(true);
      const interval = setInterval(() => {
        setCurrentNotificationIndex((prev) => {
          return prev === notifications.length - 1 ? 0 : prev + 1;
        });
      }, 5000); // Rotate every 5 seconds
      return () => clearInterval(interval);
    } else {
      setShowNotification(false);
    }
  }, [notifications]);

  const fetchActiveNotifications = async () => {
    try {
      const now = Timestamp.now();
      const notificationsRef = collection(db, 'notifications');

      try {
        const q = query(
          notificationsRef,
          where('active', '==', true),
          where('startDate', '<=', now),
          where('endDate', '>=', now)
        );

        const querySnapshot = await getDocs(q);
        const activeNotifications = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return { id: doc.id, ...data };
        });

        // Sort by priority
        activeNotifications.sort((a, b) => {
          const priorityOrder = { high: 3, normal: 2, low: 1 };
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        });

        setNotifications(activeNotifications);
      } catch (indexError) {
        // fallback (client-side)
        const q = query(notificationsRef, where('active', '==', true));
        const querySnapshot = await getDocs(q);
        const nowDate = now.toDate();
        const activeNotifications = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(notification => {
            const start = notification.startDate?.toDate() || new Date(0);
            const end = notification.endDate?.toDate() || new Date();
            return start <= nowDate && end >= nowDate;
          })
          .sort((a, b) => {
            const priorityOrder = { high: 3, normal: 2, low: 1 };
            return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
          });

        setNotifications(activeNotifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Fetch faculty data
  const fetchFacultyData = async () => {
    setFacultyLoading(true);
    try {
      const facultyCollection = collection(db, 'faculty');
      const facultySnapshot = await getDocs(facultyCollection);

      if (facultySnapshot.empty) {
        setFacultyData(getFallbackFacultyData());
      } else {
        const facultyList = facultySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'Faculty Member',
            designation: data.position || data.designation || 'Faculty',
            education: data.education || 'Education not specified',
            quote: data.quote || data.specialization || 'Faculty member in the Department of Computer Science & Design',
            src: data.imageUrl || null
          };
        });

        setFacultyData(facultyList);
      }
    } catch (error) {
      console.error('Error fetching faculty data:', error);
      setFacultyData(getFallbackFacultyData());
    } finally {
      setFacultyLoading(false);
    }
  };

  const getFallbackFacultyData = () => ([
    {
      id: "1",
      quote: "Dedicated to advancing computer science education and research, with a focus on artificial intelligence and machine learning.",
      name: "Dr. Sarah Chen",
      designation: "Associate Professor",
      src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2376&auto=format&fit=crop"
    },
    {
      id: "2",
      quote: "Passionate about teaching programming fundamentals and developing the next generation of software engineers.",
      name: "Michael Rodriguez",
      designation: "Assistant Professor",
      src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop"
    },
    {
      id: "3",
      quote: "Research interests include human-computer interaction, UI/UX design, and accessibility in technology.",
      name: "Dr. Emily Watson",
      designation: "Professor",
      src: "https://images.unsplash.com/photo-1573497019418-b400bb3ab074?q=80&w=2574&auto=format&fit=crop"
    },
    {
      id: "4",
      quote: "Specializing in cybersecurity and network systems with over 15 years of industry experience.",
      name: "Dr. James Kim",
      designation: "Professor",
      src: "https://images.unsplash.com/photo-1577880216142-8549e9488dad?q=80&w=2670&auto=format&fit=crop"
    },
    {
      id: "5",
      quote: "Focused on data science and analytics, bringing real-world projects into the classroom.",
      name: "Lisa Thompson",
      designation: "Associate Professor",
      src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2522&auto=format&fit=crop"
    }
  ]);

  // Notification visual style helper
  const getNotificationStyles = (type) => {
    switch (type) {
      case 'success':
        return isLight
          ? 'border-l-4 border-emerald-500 text-emerald-800 bg-gradient-to-r from-emerald-50/80 to-teal-50/90'
          : 'border-l-4 border-emerald-500 text-emerald-300 bg-gradient-to-r from-gray-900/80 to-gray-800/90';
      case 'warning':
        return isLight
          ? 'border-l-4 border-amber-500 text-amber-800 bg-gradient-to-r from-amber-50/80 to-yellow-50/90'
          : 'border-l-4 border-amber-500 text-amber-300 bg-gradient-to-r from-gray-900/80 to-gray-800/90';
      case 'error':
        return isLight
          ? 'border-l-4 border-rose-500 text-rose-800 bg-gradient-to-r from-rose-50/80 to-red-50/90'
          : 'border-l-4 border-rose-500 text-rose-300 bg-gradient-to-r from-gray-900/80 to-gray-800/90';
      default: // info
        return isLight
          ? 'border-l-4 border-violet-500 text-violet-800 bg-gradient-to-r from-violet-50/80 to-indigo-50/90'
          : 'border-l-4 border-violet-500 text-violet-300 bg-gradient-to-r from-gray-900/80 to-gray-800/90';
    }
  };

  return (
    <div className={`${isLight ? 'bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100' : 'bg-[#030014] bg-grid-pattern'}`}>
      {/* Notification Banner */}
      <AnimatePresence>
        {showNotification && notifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-4 pointer-events-none"
          >
            {(() => {
              try {
                const currentNotification = notifications[currentNotificationIndex];

                return (
                  <motion.div
                    className="pointer-events-auto"
                    initial={{ y: 100, scale: 0.8, opacity: 0 }}
                    animate={{
                      y: 0,
                      scale: 1,
                      opacity: 1,
                      transition: { type: "spring", stiffness: 300, damping: 24, mass: 0.9 }
                    }}
                    exit={{ y: 20, scale: 0.9, opacity: 0, transition: { duration: 0.3 } }}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div
                      className={`relative overflow-hidden max-w-md w-full rounded-3xl shadow-2xl ${isLight ? 'bg-white/90 text-gray-800 backdrop-blur-lg' : 'bg-black/60 text-gray-100 backdrop-blur-lg'}`}
                      style={{
                        boxShadow: isLight
                          ? '0 10px 40px -10px rgba(124, 58, 237, 0.3)'
                          : '0 10px 40px -10px rgba(0,0,0,0.5)'
                      }}
                    >
                      <div className="absolute top-0 left-0 w-32 h-32 -translate-x-16 -translate-y-16">
                        <motion.div className="absolute inset-0 bg-violet-500 rounded-full mix-blend-screen opacity-30 blur-xl" animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.2, 0.3] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
                      </div>

                      <div className="relative p-7">
                        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

                        <div className="flex items-center justify-between mb-5">
                          <div className="flex space-x-1.5">
                            {notifications.map((_, index) => (
                              <motion.div
                                key={index}
                                className={`w-2 h-2 rounded-full ${index === currentNotificationIndex ? 'bg-gradient-to-r from-violet-500 to-cyan-500' : isLight ? 'bg-gray-200' : 'bg-gray-700'}`}
                                animate={index === currentNotificationIndex ? { scale: [1, 1.4, 1], boxShadow: ['0 0 0 0 rgba(139, 92, 246, 0)', '0 0 0 3px rgba(139, 92, 246, 0.3)', '0 0 0 0 rgba(139, 92, 246, 0)'] } : {}}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                              />
                            ))}
                          </div>

                          <div className="flex-1 mx-4 h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-700 rounded-full overflow-hidden">
                            <motion.div className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 5, ease: "linear" }} key={currentNotificationIndex} style={{ boxShadow: '0 0 8px rgba(139,92,246,0.5)' }} />
                          </div>

                          <motion.button
                            onClick={() => setShowNotification(false)}
                            className={`relative rounded-full p-1.5 flex items-center justify-center overflow-hidden ${isLight ? 'bg-gray-100/50 hover:bg-gray-100' : 'bg-gray-800/50 hover:bg-gray-800'} backdrop-blur-sm transition-colors group`}
                            whileHover={{ rotate: 90, scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-violet-500/20 to-cyan-500/20" initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
                            <svg className="w-4 h-4 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </motion.button>
                        </div>

                        <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }} className="relative">
                          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-violet-500/30 to-transparent" />
                          <div className="pl-4">
                            <motion.h3 className="text-xl font-medium mb-3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }}>
                              {notifications[currentNotificationIndex]?.title}
                            </motion.h3>
                            <motion.p className="text-sm opacity-85 leading-relaxed font-light" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }}>
                              {notifications[currentNotificationIndex]?.message}
                            </motion.p>

                            <motion.div className="mt-4 flex items-center text-xs text-gray-500 dark:text-gray-400" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut", delay: 0.1 } }}>
                              <div className={`w-3 h-3 rounded-full ${isLight ? 'bg-violet-100' : 'bg-violet-900'} mr-2 flex items-center justify-center`}>
                                <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                              </div>
                              <span>Just now</span>
                            </motion.div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                );
              } catch (error) {
                console.error('Error rendering notification:', error);
                return null;
              }
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center">
            {/* Logo */}
            <div className="w-full max-w-3xl mb-12">
              <div className="relative">
                <img 
                  src="/csd_logo.png" 
                  alt="CSD Department Logo" 
                  className="w-full h-auto max-h-[60vh] object-contain mx-auto"
                  draggable={false}
                  onError={(e) => {
                    e.target.src = '/icon.png';
                    e.target.alt = 'CSD Department Icon';
                  }}
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 rounded-full blur-3xl opacity-50 scale-110"></div>
              </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`inline-block px-6 py-2 rounded-full text-sm font-medium mb-6 ${isLight ? 'bg-violet-100 text-violet-800' : 'bg-violet-500/10 text-violet-400 border border-violet-500/20'}`}
              >
                Department of Computer Science & Design
              </motion.div>

              <motion.h1 
                className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 ${isLight ? 'text-gray-900' : 'text-white'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <span className="block">Empowering Students to</span>
                <span className={`block ${isLight ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-transparent bg-clip-text' : 'bg-gradient-to-r from-violet-400 to-cyan-400 text-transparent bg-clip-text'}`}>
                  Code, Create & Innovate
                </span>
              </motion.h1>

              <motion.p 
                className={`text-lg md:text-xl mb-12 max-w-2xl mx-auto ${isLight ? 'text-gray-600' : 'text-gray-300'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Training the next generation of tech leaders in Computer Science and Design
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">
                  PESITM
                </h2>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute top-40 -right-20 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-1000"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
          <div className="absolute top-20 left-60 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-3000"></div>
        </div>

        <div className="relative z-10 w-full">
          <div className="container mx-auto px-4 py-20">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="text-center mb-16">
              <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${isLight ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-transparent bg-clip-text' : 'bg-gradient-to-r from-violet-400 to-cyan-400 text-transparent bg-clip-text'}`}>
                Our Faculty
              </h2>
              <p className={`text-xl ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
                Meet the brilliant minds shaping the future of computer science and design
              </p>
            </motion.div>

            {facultyLoading ? (
              <div className="flex justify-center py-12">
                <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isLight ? 'border-violet-600' : 'border-violet-400'}`}></div>
              </div>
            ) : facultyData.length === 0 ? (
              <div className="text-center py-12">
                <p className={isLight ? 'text-gray-500' : 'text-gray-400'}>No faculty information available at the moment.</p>
              </div>
            ) : (
              <AnimatedTestimonials testimonials={facultyData} autoplay={true} />
            )}
          </div>
        </div>
      </section>

      {/* Modal removed (no events/achievements cards anymore) */}

      {/* Animation styles */}
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
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .bg-size-200 { background-size: 200% 100%; }
        .animate-gradient-x { animation: gradient-x 3s linear infinite; }
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
