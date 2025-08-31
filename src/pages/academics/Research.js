import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/client';
import { useTheme } from '../../contexts/ThemeContext';

const Research = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      const papersCollection = collection(db, 'research_papers');
      const papersSnapshot = await getDocs(papersCollection);
      const papersData = papersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      papersData.sort((a, b) => new Date(b.publicationDate) - new Date(a.publicationDate));
      setPapers(papersData);
    } catch (error) {
      console.error('Error fetching research papers:', error);
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
        duration: 0.5
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

  // Card component for research papers
  const PaperCard = ({ paper }) => {
    return (
      <motion.div
        variants={itemVariants}
        onClick={() => {
          setSelectedPaper(paper);
          setIsModalOpen(true);
        }}
        className={`rounded-2xl p-6 transition-all duration-300 cursor-pointer ${
          isLight 
            ? 'bg-white/80 hover:bg-white shadow-lg hover:shadow-xl backdrop-blur-sm' 
            : 'bg-white/5 hover:bg-white/10 backdrop-blur-lg'
        }`}
      >
        <div className="flex flex-col h-full">
          <h3 className={`text-2xl font-bold mb-4 ${
            isLight ? 'text-violet-800' : 'text-violet-300'
          }`}>{paper.title}</h3>
          
          <div className="flex justify-between items-center mb-4">
            <span className={`px-3 py-1 rounded-full text-sm ${
              isLight
                ? 'bg-violet-100 text-violet-800'
                : 'bg-violet-900/30 text-violet-300'
            }`}>
              {paper.journal}
            </span>
            {paper.publicationDate && (
              <span className={`text-sm ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
                {new Date(paper.publicationDate).toLocaleDateString()}
              </span>
            )}
          </div>
          
          <p className={`mb-6 line-clamp-3 flex-grow ${
            isLight ? 'text-gray-600' : 'text-gray-300'
          }`}>
            {paper.abstract}
          </p>

          <div className="flex items-center mt-3">
            <div className="flex-shrink-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isLight 
                  ? 'bg-violet-100' 
                  : 'bg-gradient-to-br from-violet-500/20 to-cyan-500/20'
              }`}>
                <span className={`text-sm font-medium ${
                  isLight ? 'text-violet-800' : 'text-white'
                }`}>
                  {(paper.author || "").split(" ").map(n => n[0]).join("")}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${
                isLight ? 'text-gray-900' : 'text-white'
              }`}>
                {paper.author}
              </p>
              <p className={`text-xs ${
                isLight ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {paper.department || "Computer Science & Design"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Modal Component
  const DetailModal = () => {
    if (!selectedPaper) return null;

    return (
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              className={`relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl ${
                isLight ? 'bg-white' : 'bg-gray-900'
              }`}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 text-white hover:bg-black/30 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Image */}
              <div className="relative h-64 sm:h-80">
                {selectedPaper.imageBase64 ? (
                  <img
                    src={selectedPaper.imageBase64}
                    alt={selectedPaper.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white/20">
                      Research Paper
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative p-6 sm:p-8">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    isLight
                      ? 'bg-violet-100 text-violet-800'
                      : 'bg-violet-500/20 text-violet-400'
                  }`}>
                    {selectedPaper.journal}
                  </span>
                  {selectedPaper.publicationDate && (
                    <span className={isLight ? 'text-gray-500' : 'text-gray-400'}>
                      {new Date(selectedPaper.publicationDate).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <h3 className={`text-2xl font-bold mb-4 ${
                  isLight ? 'text-gray-900' : 'text-white'
                }`}>
                  {selectedPaper.title}
                </h3>

                <p className={`mb-6 ${
                  isLight ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {selectedPaper.abstract}
                </p>

                <div className="flex items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isLight
                        ? 'bg-violet-100'
                        : 'bg-gradient-to-br from-violet-500/20 to-cyan-500/20'
                    }`}>
                      <span className={`text-lg font-medium ${
                        isLight ? 'text-violet-800' : 'text-white'
                      }`}>
                        {(selectedPaper.author || "").split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className={`font-medium ${
                      isLight ? 'text-gray-900' : 'text-white'
                    }`}>
                      {selectedPaper.author}
                    </p>
                    <p className={`text-sm ${
                      isLight ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      {selectedPaper.department || "Computer Science & Design"}
                    </p>
                  </div>
                </div>

                {selectedPaper.doi && (
                  <div className="mt-6">
                    <a
                      href={`https://doi.org/${selectedPaper.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 ${
                        isLight
                          ? 'text-violet-600 hover:text-violet-700'
                          : 'text-violet-400 hover:text-violet-300'
                      } font-medium transition-colors`}
                    >
                      View Paper
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className={`min-h-screen ${
      isLight 
        ? 'bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100' 
        : 'bg-[#030014] bg-grid-pattern'
    }`}>
      {/* Research Papers Section */}
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
              Research Papers
            </h2>
            <p className={`text-xl ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
              Explore the latest research contributions from our department
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
                isLight ? 'border-violet-600' : 'border-violet-400'
              }`}></div>
            </div>
          ) : papers.length === 0 ? (
            <div className="text-center py-12">
              <p className={isLight ? 'text-gray-500' : 'text-gray-400'}>No research papers found.</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {papers.map((paper) => (
                <PaperCard key={paper.id} paper={paper} />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Modal */}
      <DetailModal />

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

export default Research; 