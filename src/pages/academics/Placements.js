import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

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

const Placements = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPlacements: 0,
    averagePackage: 0,
    highestPackage: 0,
    companies: 0
  });
  const [selectedPlacement, setSelectedPlacement] = useState(null);

  useEffect(() => {
    fetchPlacements();
  }, []);

  const fetchPlacements = async () => {
    setLoading(true);
    try {
      const placementsCollection = collection(db, 'placements');
      const placementsSnapshot = await getDocs(placementsCollection);
      const placementsData = placementsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Convert package to number if it's a string
      const processedData = placementsData.map(placement => ({
        ...placement,
        package: placement.package ? parseFloat(placement.package) : 0
      }));
      
      // Sort by package (highest first)
      processedData.sort((a, b) => {
        return (b.package || 0) - (a.package || 0);
      });
      
      setPlacements(processedData);
      
      if (processedData.length > 0) {
        const totalPlacements = processedData.length;
        const totalPackage = processedData.reduce((sum, placement) => sum + (placement.package || 0), 0);
        const averagePackage = totalPackage / totalPlacements;
        const highestPackage = Math.max(...processedData.map(placement => placement.package || 0));
        const uniqueCompanies = new Set(processedData.map(placement => placement.company)).size;
        
        setStats({
          totalPlacements,
          averagePackage,
          highestPackage,
          companies: uniqueCompanies
        });
      }
    } catch (error) {
      console.error('Error fetching placements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePlacementModal = () => {
    setSelectedPlacement(null);
  };

  // Modal animation variants
  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className={`min-h-screen ${isLight ? 'bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100' : 'bg-[#030014] bg-grid-pattern'} py-24 relative overflow-hidden`}>
      {/* Background Elements */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 right-0 w-72 h-72 sm:w-96 sm:h-96 sm:-right-20 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-1000"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 sm:w-80 sm:h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-20 left-10 sm:left-60 w-60 h-60 sm:w-72 sm:h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-3000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className={`text-5xl font-bold mb-6 ${isLight ? 'text-gray-900' : 'text-white'}`}>Placements</h1>
          <p className={`text-xl max-w-2xl mx-auto ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
            Explore the career achievements of our students.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-16"
        >
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div
              variants={itemVariants}
              className={`group rounded-xl p-6 shadow-lg transition-all duration-300 ${
                isLight
                  ? 'bg-white hover:shadow-xl'
                  : 'bg-white/5 backdrop-blur-lg hover:bg-white/10'
              }`}
            >
              <dt className={`text-sm font-medium ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
                Total Placements
              </dt>
              <dd className={`mt-2 text-4xl font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>
                {stats.totalPlacements}
              </dd>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className={`group rounded-xl p-6 shadow-lg transition-all duration-300 ${
                isLight
                  ? 'bg-white hover:shadow-xl'
                  : 'bg-white/5 backdrop-blur-lg hover:bg-white/10'
              }`}
            >
              <dt className={`text-sm font-medium ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
                Average Package
              </dt>
              <dd className={`mt-2 text-4xl font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>
                ₹{typeof stats.averagePackage === 'number' ? stats.averagePackage.toFixed(2) : '0.00'} <span className="text-lg">LPA</span>
              </dd>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className={`group rounded-xl p-6 shadow-lg transition-all duration-300 ${
                isLight
                  ? 'bg-white hover:shadow-xl'
                  : 'bg-white/5 backdrop-blur-lg hover:bg-white/10'
              }`}
            >
              <dt className={`text-sm font-medium ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
                Highest Package
              </dt>
              <dd className={`mt-2 text-4xl font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>
                ₹{typeof stats.highestPackage === 'number' ? stats.highestPackage.toFixed(2) : '0.00'} <span className="text-lg">LPA</span>
              </dd>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className={`group rounded-xl p-6 shadow-lg transition-all duration-300 ${
                isLight
                  ? 'bg-white hover:shadow-xl'
                  : 'bg-white/5 backdrop-blur-lg hover:bg-white/10'
              }`}
            >
              <dt className={`text-sm font-medium ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
                Companies
              </dt>
              <dd className={`mt-2 text-4xl font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>
                {stats.companies}
              </dd>
            </motion.div>
          </dl>
        </motion.div>

        {/* Placements List */}
        <div className="mt-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`text-3xl font-bold mb-8 ${isLight ? 'text-gray-900' : 'text-white'}`}
          >
            Placement Records
          </motion.h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
                isLight ? 'border-violet-600' : 'border-violet-400'
              }`}></div>
            </div>
          ) : placements.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <p className={isLight ? 'text-gray-500' : 'text-gray-400'}>No placement records found.</p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={`rounded-xl overflow-hidden shadow-lg ${
                isLight ? 'bg-white' : 'bg-white/5 backdrop-blur-lg'
              }`}
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
                  <thead className={isLight ? 'bg-gray-50' : 'bg-white/5'}>
                    <tr>
                      <th scope="col" className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                        isLight ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        Student
                      </th>
                      <th scope="col" className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                        isLight ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        Company
                      </th>
                      <th scope="col" className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                        isLight ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        Role
                      </th>
                      <th scope="col" className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                        isLight ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        Package (LPA)
                      </th>
                      <th scope="col" className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                        isLight ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        Batch
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isLight ? 'divide-gray-200' : 'divide-white/10'}`}>
                    {placements.map((placement, index) => (
                      <motion.tr
                        key={placement.id}
                        variants={itemVariants}
                        className={`cursor-pointer transition-colors ${
                          isLight ? 'hover:bg-gray-50' : 'hover:bg-white/10'
                        }`}
                        onClick={() => setSelectedPlacement(placement)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {placement.imageBase64 ? (
                              <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden ring-2 ring-offset-2 ring-violet-500/30">
                                <img 
                                  className="h-10 w-10 object-cover" 
                                  src={placement.imageBase64} 
                                  alt={placement.studentName || "Student"} 
                                />
                              </div>
                            ) : (
                              <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                                isLight 
                                  ? 'bg-gradient-to-br from-violet-500/20 to-cyan-500/20' 
                                  : 'bg-gradient-to-br from-purple-500/20 to-blue-500/20'
                              }`}>
                                <span className={isLight ? 'text-violet-700 font-medium' : 'text-white font-medium'}>
                                  {placement.studentName ? placement.studentName.charAt(0).toUpperCase() : 'S'}
                                </span>
                              </div>
                            )}
                            <div className="ml-4">
                              <div className={`text-sm font-medium ${isLight ? 'text-gray-900' : 'text-white'}`}>
                                {placement.studentName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${isLight ? 'text-gray-900' : 'text-white'}`}>{placement.company}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${isLight ? 'text-gray-900' : 'text-white'}`}>{placement.position || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${
                            isLight 
                              ? placement.package > 10 ? 'text-green-600' : 'text-blue-600'
                              : placement.package > 10 ? 'text-green-400' : 'text-blue-400'
                          }`}>
                            ₹{typeof placement.package === 'number' ? placement.package.toFixed(2) : '0.00'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {placement.year || '-'}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedPlacement && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
            <div className="min-h-screen flex items-center">
              <motion.div
                className={`relative w-[90%] sm:w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl ${
                  isLight ? 'bg-white' : 'bg-gray-900'
                } ml-5 mr-auto sm:mx-auto`}
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Close Button */}
                <button
                  onClick={handleClosePlacementModal}
                  className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/20 text-white hover:bg-black/30 transition-colors"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Photo section */}
                <div className={`w-full p-4 flex items-center justify-center ${
                  isLight
                    ? 'bg-gradient-to-r from-violet-500 to-cyan-500'
                    : 'bg-gradient-to-r from-violet-700 to-cyan-800'
                }`}>
                  {selectedPlacement.imageBase64 ? (
                    <div className="h-20 w-20 sm:h-28 sm:w-28 md:h-32 md:w-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                      <img
                        src={selectedPlacement.imageBase64}
                        alt={selectedPlacement.studentName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className={`h-20 w-20 sm:h-28 sm:w-28 md:h-32 md:w-32 rounded-full flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-bold shadow-xl ${
                      isLight 
                        ? 'bg-gradient-to-br from-violet-500 to-cyan-500 text-white' 
                        : 'bg-gradient-to-br from-purple-700 to-blue-700 text-white'
                    } border-4 border-white`}>
                      {selectedPlacement.studentName ? selectedPlacement.studentName.charAt(0).toUpperCase() : 'S'}
                    </div>
                  )}
                </div>

                {/* Details section */}
                <div className="w-full p-4 sm:p-5">
                  <h3 className={`text-lg sm:text-xl font-bold text-center ${isLight ? 'text-gray-900' : 'text-white'}`}>
                    {selectedPlacement.studentName}
                  </h3>
                  
                  <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="flex flex-col">
                      <span className={`text-xs sm:text-sm ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>Company</span>
                      <span className={`text-sm sm:text-base font-medium ${isLight ? 'text-gray-900' : 'text-white'}`}>
                        {selectedPlacement.company}
                      </span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className={`text-xs sm:text-sm ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>Position</span>
                      <span className={`text-sm sm:text-base font-medium ${isLight ? 'text-gray-900' : 'text-white'}`}>
                        {selectedPlacement.position || 'Not specified'}
                      </span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className={`text-xs sm:text-sm ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>Package</span>
                      <span className={`text-sm sm:text-base font-medium ${
                        isLight 
                          ? selectedPlacement.package > 10 ? 'text-green-600' : 'text-blue-600'
                          : selectedPlacement.package > 10 ? 'text-green-400' : 'text-blue-400'
                      }`}>
                        ₹{typeof selectedPlacement.package === 'number' ? selectedPlacement.package.toFixed(2) : '0.00'} LPA
                      </span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className={`text-xs sm:text-sm ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>Batch</span>
                      <span className={`text-sm sm:text-base font-medium ${isLight ? 'text-gray-900' : 'text-white'}`}>
                        {selectedPlacement.year || 'Not specified'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className={`text-xs text-center ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
                      Achieved placement on {selectedPlacement.createdAt 
                        ? new Date(selectedPlacement.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long'
                          })
                        : 'an unspecified date'}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Add styles for animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(20px, -30px) scale(1.1); }
          66% { transform: translate(-15px, 15px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Placements; 