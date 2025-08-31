import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { TextHoverEffect } from '../../components/ui/text-hover-effect';
import { ContainerScroll } from '../../components/ui/container-scroll-animation';

const AboutPage = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

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

  return (
    <div className={`min-h-screen ${
      isLight 
        ? 'bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100' 
        : 'bg-[#030014] bg-grid-pattern'
    }`}>
      {/* Hero Section */}
    
      {/* Program Overview Section */}
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
              Program Overview
            </h2>
            <p className={`text-xl ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
              A comprehensive program combining Computer Science and Design principles
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-8 lg:grid-cols-2"
          >
            <motion.div
              variants={itemVariants}
              className={`rounded-2xl p-8 transition-all duration-300 ${
                isLight 
                  ? 'bg-white/80 hover:bg-white shadow-lg hover:shadow-xl backdrop-blur-sm' 
                  : 'bg-white/5 hover:bg-white/10 backdrop-blur-lg'
              }`}
            >
              <h3 className={`text-2xl font-bold mb-6 ${
                isLight ? 'text-violet-800' : 'text-violet-300'
              }`}>Program Focus</h3>
              <ul className={`space-y-4 ${
                isLight ? 'text-gray-600' : 'text-gray-300'
              }`}>
                <li className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    isLight ? 'bg-violet-500' : 'bg-violet-400'
                  }`} />
                  Computing approaches and methodologies
                </li>
                <li className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    isLight ? 'bg-violet-500' : 'bg-violet-400'
                  }`} />
                  Advanced design tools and techniques
                </li>
                <li className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    isLight ? 'bg-violet-500' : 'bg-violet-400'
                  }`} />
                  Modern design approaches and principles
                </li>
                <li className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    isLight ? 'bg-violet-500' : 'bg-violet-400'
                  }`} />
                  Cutting-edge digital media technologies
                </li>
              </ul>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className={`rounded-2xl p-8 transition-all duration-300 ${
                isLight 
                  ? 'bg-white/80 hover:bg-white shadow-lg hover:shadow-xl backdrop-blur-sm' 
                  : 'bg-white/5 hover:bg-white/10 backdrop-blur-lg'
              }`}
            >
              <h3 className={`text-2xl font-bold mb-6 ${
                isLight ? 'text-cyan-800' : 'text-cyan-300'
              }`}>Career Opportunities</h3>
              <ul className={`space-y-4 ${
                isLight ? 'text-gray-600' : 'text-gray-300'
              }`}>
                <li className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    isLight ? 'bg-cyan-500' : 'bg-cyan-400'
                  }`} />
                  IT industry and software development
                </li>
                <li className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    isLight ? 'bg-cyan-500' : 'bg-cyan-400'
                  }`} />
                  Digital media and creative industries
                </li>
                <li className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    isLight ? 'bg-cyan-500' : 'bg-cyan-400'
                  }`} />
                  Game development and interactive media
                </li>
                <li className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    isLight ? 'bg-cyan-500' : 'bg-cyan-400'
                  }`} />
                  Virtual and Augmented Reality
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Faculty Section */}
      <section className={`relative overflow-hidden py-20 ${isLight ? 'bg-transparent' : 'bg-[#030014]/50'}`}>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              isLight 
                ? 'text-indigo-700' 
                : 'bg-gradient-to-r from-violet-300 to-cyan-300 text-transparent bg-clip-text'
            }`}>
              Our Faculty
            </h2>
            <p className={`text-xl ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
              Meet our experienced and dedicated faculty members
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Faculty 1 */}
            <motion.div 
              variants={itemVariants}
              className={`rounded-lg p-6 transition-all duration-300 ${
                isLight 
                  ? 'bg-white/80 hover:bg-white shadow-lg hover:shadow-xl backdrop-blur-sm' 
                  : 'bg-white/5 hover:bg-white/10 backdrop-blur-lg border border-white/5'
              }`}
            >
              <h3 className={`text-xl font-bold mb-2 ${
                isLight 
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-transparent bg-clip-text' 
                  : 'bg-gradient-to-r from-violet-400 to-cyan-400 text-transparent bg-clip-text'
              }`}>
                Dr. Pramod
              </h3>
              <p className="text-cyan-500 mb-3">Professor & HOD</p>
              <p className="text-sm text-gray-400 mb-4">Ph.D. in Computer Science</p>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700 my-4"></div>
              <p className="text-sm text-gray-500">
                <span className="block">Email: hodcsd@pestrust.edu.in</span>
              </p>
            </motion.div>

            {/* Faculty 2 */}
            <motion.div 
              variants={itemVariants}
              className={`rounded-lg p-6 transition-all duration-300 ${
                isLight 
                  ? 'bg-white/80 hover:bg-white shadow-lg hover:shadow-xl backdrop-blur-sm' 
                  : 'bg-white/5 hover:bg-white/10 backdrop-blur-lg border border-white/5'
              }`}
            >
              <h3 className={`text-xl font-bold mb-2 ${
                isLight 
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-transparent bg-clip-text' 
                  : 'bg-gradient-to-r from-violet-400 to-cyan-400 text-transparent bg-clip-text'
              }`}>Mrs. Ayisha Khanum</h3>
              <p className="text-cyan-500 mb-3">Assistant Professor</p>
              <p className="text-sm text-gray-400 mb-4">M.Tech in Computer Science</p>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700 my-4"></div>
              <p className="text-sm text-gray-500">
                <span className="block">Email: ayisha.khanum@pestrust.edu.in</span>
              </p>
            </motion.div>

            {/* Faculty 3 */}
            <motion.div 
              variants={itemVariants}
              className={`rounded-lg p-6 transition-all duration-300 ${
                isLight 
                  ? 'bg-white/80 hover:bg-white shadow-lg hover:shadow-xl backdrop-blur-sm' 
                  : 'bg-white/5 hover:bg-white/10 backdrop-blur-lg border border-white/5'
              }`}
            >
              <h3 className={`text-xl font-bold mb-2 ${
                isLight 
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-transparent bg-clip-text' 
                  : 'bg-gradient-to-r from-violet-400 to-cyan-400 text-transparent bg-clip-text'
              }`}>Mr. Manjunatha G</h3>
              <p className="text-cyan-500 mb-3">Assistant Professor</p>
              <p className="text-sm text-gray-400 mb-4">M.Tech in Computer Science</p>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700 my-4"></div>
              <p className="text-sm text-gray-500">
                <span className="block">Email: manjunatha.g@pestrust.edu.in</span>
              </p>
            </motion.div>

            {/* Faculty 4 */}
            <motion.div 
              variants={itemVariants}
              className={`rounded-lg p-6 transition-all duration-300 ${
                isLight 
                  ? 'bg-white/80 hover:bg-white shadow-lg hover:shadow-xl backdrop-blur-sm' 
                  : 'bg-white/5 hover:bg-white/10 backdrop-blur-lg border border-white/5'
              }`}
            >
              <h3 className={`text-xl font-bold mb-2 ${
                isLight 
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-transparent bg-clip-text' 
                  : 'bg-gradient-to-r from-violet-400 to-cyan-400 text-transparent bg-clip-text'
              }`}>Mrs. Kavya S</h3>
              <p className="text-cyan-500 mb-3">Assistant Professor</p>
              <p className="text-sm text-gray-400 mb-4">M.Tech in Computer Science</p>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700 my-4"></div>
              <p className="text-sm text-gray-500">
                <span className="block">Email: kavya.s@pestrust.edu.in</span>
              </p>
            </motion.div>

            {/* Faculty 5 */}
            <motion.div 
              variants={itemVariants}
              className={`rounded-lg p-6 transition-all duration-300 ${
                isLight 
                  ? 'bg-white/80 hover:bg-white shadow-lg hover:shadow-xl backdrop-blur-sm' 
                  : 'bg-white/5 hover:bg-white/10 backdrop-blur-lg border border-white/5'
              }`}
            >
              <h3 className={`text-xl font-bold mb-2 ${
                isLight 
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-transparent bg-clip-text' 
                  : 'bg-gradient-to-r from-violet-400 to-cyan-400 text-transparent bg-clip-text'
              }`}>Mr. Harish M</h3>
              <p className="text-cyan-500 mb-3">Assistant Professor</p>
              <p className="text-sm text-gray-400 mb-4">M.Tech in Computer Science</p>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700 my-4"></div>
              <p className="text-sm text-gray-500">
                <span className="block">Email: harish.m@pestrust.edu.in</span>
              </p>
            </motion.div>

            {/* Non-Teaching Staff */}
            <motion.div 
              variants={itemVariants}
              className={`rounded-lg p-6 transition-all duration-300 ${
                isLight 
                  ? 'bg-white/80 hover:bg-white shadow-lg hover:shadow-xl backdrop-blur-sm' 
                  : 'bg-white/5 hover:bg-white/10 backdrop-blur-lg border border-white/5'
              }`}
            >
              <h3 className={`text-xl font-bold mb-2 ${
                isLight 
                  ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-transparent bg-clip-text' 
                  : 'bg-gradient-to-r from-amber-400 to-yellow-400 text-transparent bg-clip-text'
              }`}>Mr. Shivakumar S V</h3>
              <p className="text-amber-500 mb-3">Lab Instructor</p>
              <p className="text-sm text-gray-400 mb-4">M.Tech in Computer Science</p>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700 my-4"></div>
              <p className="text-sm text-gray-500">
                <span className="block">Email: shivakumar.sv@pestrust.edu.in</span>
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
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
              Our Facilities
            </h2>
            <p className={`text-xl ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
              State-of-the-art infrastructure for practical learning
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <motion.div
              variants={itemVariants}
              className={`rounded-2xl p-8 transition-all duration-300 ${
                isLight 
                  ? 'bg-white/80 hover:bg-white shadow-lg hover:shadow-xl backdrop-blur-sm' 
                  : 'bg-white/5 hover:bg-white/10 backdrop-blur-lg'
              }`}
            >
              <h3 className={`text-2xl font-bold mb-6 text-center ${
                isLight ? 'text-violet-800' : 'text-violet-300'
              }`}>Facilities</h3>
              <div className="flex flex-col items-center">
                <div className="text-center">
                  <h4 className={`text-lg font-semibold mb-4 ${
                    isLight ? 'text-gray-900' : 'text-white'
                  }`}>Computer Lab Equipment</h4>
                  <ul className={`space-y-2 text-center ${
                    isLight ? 'text-gray-600' : 'text-gray-300'
                  }`}>
                  <li className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      isLight ? 'bg-violet-500' : 'bg-violet-400'
                    }`} />
                    ACER Desktop M200 Core 15-12th Generation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      isLight ? 'bg-violet-500' : 'bg-violet-400'
                    }`} />
                    8 GB RAM
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      isLight ? 'bg-violet-500' : 'bg-violet-400'
                    }`} />
                    256 GB SSD + 1TB HDD
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      isLight ? 'bg-violet-500' : 'bg-violet-400'
                    }`} />
                    20" TFT Monitor
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      isLight ? 'bg-violet-500' : 'bg-violet-400'
                    }`} />
                    Networking Equipment
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
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
              Contact Us
            </h2>
            <p className={`text-xl ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
              Get in touch with our department
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <motion.div
              variants={itemVariants}
              className={`rounded-2xl p-8 transition-all duration-300 ${
                isLight 
                  ? 'bg-white/80 hover:bg-white shadow-lg hover:shadow-xl backdrop-blur-sm' 
                  : 'bg-white/5 hover:bg-white/10 backdrop-blur-lg'
              }`}
            >
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className={`text-2xl font-bold mb-6 ${
                    isLight ? 'text-violet-800' : 'text-violet-300'
                  }`}>Department Head</h3>
                  <div className={`space-y-4 ${
                    isLight ? 'text-gray-600' : 'text-gray-300'
                  }`}>
                    <p className={`font-semibold ${
                      isLight ? 'text-gray-900' : 'text-white'
                    }`}>Dr. Pramod</p>
                    <p>Associate Professor and Head of Department</p>
                    <p>Computer Science & Design</p>
                    <p>Email: hodcsd@pestrust.edu.in</p>
                    <p>Phone: 9886890174</p>
                  </div>
                </div>
                <div>
                  <h3 className={`text-2xl font-bold mb-6 ${
                    isLight ? 'text-cyan-800' : 'text-cyan-300'
                  }`}>Address</h3>
                  <div className={`space-y-4 ${
                    isLight ? 'text-gray-600' : 'text-gray-300'
                  }`}>
                    <p>PES Institute of Technology and Management</p>
                    <p>NH 206, Sagar Road</p>
                    <p>Shivamogga – 577 204</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
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

export default AboutPage; 