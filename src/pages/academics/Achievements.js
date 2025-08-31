import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/client';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

const Achievements = () => {
  const { type } = useParams();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(type?.toUpperCase() || 'ALL');
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    fetchAchievements();
  }, [activeTab]);

  useEffect(() => {
    if (type) {
      setActiveTab(type.toUpperCase());
    }
  }, [type]);

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      let achievementsQuery;
      
      if (activeTab === 'ALL') {
        achievementsQuery = collection(db, 'achievements');
      } else {
        achievementsQuery = query(
          collection(db, 'achievements'),
          where('achievementType', '==', activeTab)
        );
      }
      
      const achievementsSnapshot = await getDocs(achievementsQuery);
      const achievementsData = achievementsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort by date (newest first)
      achievementsData.sort((a, b) => {
        return new Date(b.date || b.timestamp) - new Date(a.date || a.timestamp);
      });
      
      setAchievements(achievementsData);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants for staggered children
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const tabs = [
    { id: 'ALL', label: 'All' },
    { id: 'STUDENTS', label: 'Students' },
    { id: 'FACULTY', label: 'Faculty' },
  ];

  return (
    <div className={`min-h-screen ${
      isLight 
        ? 'bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100' 
        : 'bg-[#030014] bg-grid-pattern'
    }`}>
      {/* Achievements Section */}
      <section className={`relative overflow-hidden min-h-screen flex items-center ${isLight ? 'bg-transparent' : 'bg-[#030014]/50'}`}>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              isLight 
                ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-transparent bg-clip-text' 
                : 'bg-gradient-to-r from-violet-400 to-cyan-400 text-transparent bg-clip-text'
            }`}>
              Department Achievements
            </h2>
            <p className={`text-xl ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
              Showcasing the accomplishments of our students and faculty
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex justify-center mb-12"
          >
            <nav className={`flex space-x-2 p-1 rounded-lg ${
              isLight ? 'bg-white/80 shadow-md' : 'bg-white/5 backdrop-blur-lg'
            }`} aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-6 py-2.5 text-sm font-medium rounded-md transition-all duration-300
                    ${activeTab === tab.id
                      ? isLight 
                          ? 'bg-violet-100 text-violet-800 shadow-sm' 
                          : 'bg-white/10 text-white shadow-lg'
                      : isLight
                          ? 'text-gray-600 hover:text-violet-700 hover:bg-violet-50' 
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </motion.div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
                isLight ? 'border-violet-600' : 'border-violet-400'
              }`}></div>
            </div>
          ) : achievements.length === 0 ? (
            <div className="text-center py-12">
              <p className={isLight ? 'text-gray-500' : 'text-gray-400'}>No achievements found for this category.</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {achievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  variants={itemVariants}
                  className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                    isLight 
                      ? 'bg-white/80 hover:bg-white shadow-lg hover:shadow-xl backdrop-blur-sm' 
                      : 'bg-white/5 hover:bg-white/10 backdrop-blur-lg'
                  }`}
                >
                  {achievement.imageBase64 && (
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={achievement.imageBase64} 
                        alt={achievement.title}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        achievement.achievementType === 'FACULTY' 
                          ? isLight
                              ? 'bg-violet-100 text-violet-800'
                              : 'bg-violet-900/20 text-violet-300'
                          : isLight
                              ? 'bg-cyan-100 text-cyan-800'
                              : 'bg-cyan-900/20 text-cyan-300'
                      }`}>
                        {achievement.achievementType}
                      </span>
                      {achievement.date && (
                        <span className={`text-xs ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
                          {new Date(achievement.date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    
                    <h3 className={`text-xl font-bold mb-3 ${
                      isLight ? 'text-gray-900' : 'text-white'
                    }`}>{achievement.title}</h3>
                    
                    {achievement.description && (
                      <p className={`mb-4 line-clamp-3 ${
                        isLight ? 'text-gray-600' : 'text-gray-300'
                      }`}>{achievement.description}</p>
                    )}
                    
                    <div className="flex items-center mt-6">
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isLight 
                            ? 'bg-violet-100' 
                            : 'bg-gradient-to-br from-violet-500/20 to-cyan-500/20'
                        }`}>
                          <span className={`text-sm font-medium ${
                            isLight ? 'text-violet-800' : 'text-white'
                          }`}>
                            {(achievement.studentName || achievement.facultyName || "").split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className={`text-sm font-medium ${
                          isLight ? 'text-gray-900' : 'text-white'
                        }`}>
                          {achievement.studentName || achievement.facultyName}
                        </p>
                        <p className={`text-xs ${
                          isLight ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          {achievement.branch || "Computer Science & Design"}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Add styles for animations */}
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

export default Achievements; 