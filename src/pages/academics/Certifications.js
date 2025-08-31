import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/client';
import { useParams } from 'react-router-dom';
import PDFViewer from '../../components/ui/PDFViewer';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

const Certifications = () => {
  const { type } = useParams();
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [activeTab, setActiveTab] = useState(type?.toUpperCase() || 'ALL');
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    fetchCertifications();
  }, [activeTab]);

  useEffect(() => {
    if (type) {
      setActiveTab(type.toUpperCase());
    }
  }, [type]);

  const fetchCertifications = async () => {
    setLoading(true);
    try {
      let certificationsQuery;
      
      if (activeTab === 'ALL') {
        certificationsQuery = collection(db, 'certifications');
      } else {
        certificationsQuery = query(
          collection(db, 'certifications'),
          where('certType', '==', activeTab)
        );
      }
      
      const certificationsSnapshot = await getDocs(certificationsQuery);
      const certificationsData = certificationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      certificationsData.sort((a, b) => {
        return new Date(b.date || b.timestamp) - new Date(a.date || a.timestamp);
      });
      
      setCertifications(certificationsData);
    } catch (error) {
      console.error('Error fetching certifications:', error);
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

  const tabs = [
    { id: 'ALL', label: 'All' },
    { id: 'NPTEL', label: 'NPTEL' },
    { id: 'UDEMY', label: 'Udemy' },
    { id: 'SPRINGBOOT', label: 'SpringBoot' },
  ];

  return (
    <div className={`min-h-screen ${
      isLight 
        ? 'bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100' 
        : 'bg-[#030014] bg-grid-pattern'
    }`}>
      {/* Certifications Section */}
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
              Student Certifications
            </h2>
            <p className={`text-xl ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
              Showcasing the achievements and skills acquired by our students
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
          ) : certifications.length === 0 ? (
            <div className="text-center py-12">
              <p className={isLight ? 'text-gray-500' : 'text-gray-400'}>No certifications found for this category.</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {certifications.map((cert) => (
                <motion.div
                  key={cert.id}
                  variants={itemVariants}
                  className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                    isLight 
                      ? 'bg-white/80 hover:bg-white shadow-lg hover:shadow-xl backdrop-blur-sm' 
                      : 'bg-white/5 hover:bg-white/10 backdrop-blur-lg'
                  }`}
                >
                  {cert.imageBase64 ? (
                    <div className="aspect-video">
                      <img
                        src={cert.imageBase64}
                        alt={cert.title}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className={`aspect-video flex items-center justify-center ${
                      isLight
                        ? 'bg-gradient-to-br from-violet-100 to-cyan-100'
                        : 'bg-gradient-to-br from-violet-500/20 to-cyan-500/20'
                    }`}>
                      <span className={`text-4xl font-bold ${
                        isLight ? 'text-violet-300' : 'text-white/30'
                      }`}>{cert.certType}</span>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isLight
                          ? 'bg-cyan-100 text-cyan-800'
                          : 'bg-cyan-900/20 text-cyan-300'
                      }`}>
                        {cert.certType}
                      </span>
                      {cert.date && (
                        <span className={`text-xs ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
                          {new Date(cert.date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    
                    <h3 className={`text-xl font-bold mb-3 ${
                      isLight ? 'text-gray-900' : 'text-white'
                    }`}>{cert.title}</h3>
                    
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
                            {cert.studentName ? cert.studentName.charAt(0).toUpperCase() : 'S'}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className={`text-sm font-medium ${
                          isLight ? 'text-gray-900' : 'text-white'
                        }`}>{cert.studentName}</p>
                        <p className={`text-xs ${
                          isLight ? 'text-gray-500' : 'text-gray-400'
                        }`}>Computer Science & Design</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setSelectedCertification(cert)}
                      className={`mt-6 w-full px-4 py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                        isLight 
                          ? 'bg-violet-100 text-violet-800 hover:bg-violet-200' 
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      <span>View Certificate</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H3a1 1 0 110-2h9.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedCertification && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              className={`relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl ${
                isLight ? 'bg-white' : 'bg-gray-900'
              }`}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCertification(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 text-white hover:bg-black/30 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* PDF Viewer */}
              <div className="h-screen max-h-[80vh]">
                {selectedCertification.pdfBase64 ? (
                  <PDFViewer pdfData={selectedCertification.pdfBase64} />
                ) : selectedCertification.imageBase64 ? (
                  <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <img
                      src={selectedCertification.imageBase64}
                      alt={selectedCertification.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className={`h-full flex flex-col items-center justify-center ${
                    isLight ? 'bg-gray-100' : 'bg-gray-800'
                  }`}>
                    <div className={`w-24 h-24 rounded-full mb-6 flex items-center justify-center ${
                      isLight 
                        ? 'bg-violet-100' 
                        : 'bg-gradient-to-br from-violet-500/20 to-cyan-500/20'
                    }`}>
                      <span className={`text-4xl font-bold ${
                        isLight ? 'text-violet-400' : 'text-white/40'
                      }`}>
                        {selectedCertification.certType?.charAt(0) || 'C'}
                      </span>
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${
                      isLight ? 'text-gray-900' : 'text-white'
                    }`}>
                      {selectedCertification.title}
                    </h3>
                    <p className={isLight ? 'text-gray-500' : 'text-gray-400'}>
                      No certificate image available
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

export default Certifications; 