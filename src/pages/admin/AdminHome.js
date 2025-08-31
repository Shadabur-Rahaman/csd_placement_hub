import React, { useState, useEffect } from 'react';
import { collection, getDocs, getCountFromServer } from 'firebase/firestore';
import { db } from '../../firebase/client';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';

const AdminHome = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [stats, setStats] = useState({
    certifications: 0,
    achievements: 0,
    researchPapers: 0,
    placements: 0,
    events: 0,
    students: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const collections = [
        'certifications',
        'achievements',
        'researchPapers',
        'placements',
        'events',
        'students',
      ];

      const statsData = {};

      for (const collectionName of collections) {
        try {
          const snapshot = await getCountFromServer(collection(db, collectionName));
          statsData[collectionName] = snapshot.data().count;
        } catch (error) {
          console.error(`Error fetching count for ${collectionName}:`, error);
          statsData[collectionName] = 0;
        }
      }

      setStats(statsData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const adminSections = [
    {
      title: 'Notifications',
      description: 'Manage notifications and announcements',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      link: '/admin/notifications',
      stat: stats.notifications || 0
    },
    {
      title: 'Faculty',
      description: 'Manage faculty profiles and information',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      link: '/admin/faculty',
      stat: stats.faculty || 0
    },
    {
      title: 'Students',
      description: 'Manage student records and information',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      link: '/admin/students',
      stat: stats.students || 0
    },
    {
      title: 'Events',
      description: 'Manage department events and activities',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      link: '/admin/events',
      stat: stats.events || 0
    },
    {
      title: 'Achievements',
      description: 'Manage student and faculty achievements',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      link: '/admin/achievements',
      stat: stats.achievements || 0
    },
    {
      title: 'Research',
      description: 'Manage research publications and projects',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      link: '/admin/research',
      stat: stats.researchPapers || 0
    },
    {
      title: 'Placements',
      description: 'Manage placement records and statistics',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      link: '/admin/placements',
      stat: stats.placements || 0
    },
    {
      title: 'Certifications',
      description: 'Manage certification programs and courses',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      link: '/admin/certifications',
      stat: stats.certifications || 0
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <div className="p-6">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`text-3xl font-bold mb-8 ${
          isLight 
            ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-transparent bg-clip-text' 
            : 'bg-gradient-to-r from-violet-400 to-cyan-400 text-transparent bg-clip-text'
        }`}
      >
        Admin Dashboard
      </motion.h1>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {adminSections.map((section, index) => (
          <motion.div
            key={section.title}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to={section.link}
              className={`block h-full relative overflow-hidden rounded-2xl transition-all duration-300 ${
                isLight
                  ? 'bg-white/80 hover:bg-white/90 shadow-lg hover:shadow-xl backdrop-blur-sm'
                  : 'bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10'
              }`}
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 opacity-20 ${
                isLight 
                  ? 'bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10' 
                  : 'bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10'
              }`} />

              <div className="relative p-6">
                <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${
                  isLight
                    ? 'bg-gradient-to-br from-violet-500 to-cyan-500 text-white shadow-lg shadow-violet-500/25'
                    : 'bg-gradient-to-br from-violet-500/20 to-cyan-500/20 text-violet-400 shadow-lg shadow-violet-500/10'
                }`}>
                  {section.icon}
                </div>

                <h3 className={`text-lg font-semibold mb-2 ${
                  isLight ? 'text-gray-900' : 'text-white'
                }`}>
                  {section.title}
                </h3>

                <p className={`text-sm ${
                  isLight ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {section.description}
                </p>

                {section.stat > 0 && (
                  <div className={`mt-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isLight
                      ? 'bg-violet-100 text-violet-800'
                      : 'bg-violet-500/20 text-violet-400'
                  }`}>
                    {section.stat} {section.stat === 1 ? 'item' : 'items'}
                  </div>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default AdminHome; 