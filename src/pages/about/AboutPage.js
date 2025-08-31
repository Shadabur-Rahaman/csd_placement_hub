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
              Our Faculty
            </h2>
            <p className={`text-xl ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
              Meet our experienced and dedicated faculty members
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-8 lg:grid-cols-2"
          >
            {/* Teaching Faculty */}
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
              }`}>Teaching Faculty</h3>
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className={`w-20 h-20 rounded-xl flex items-center justify-center ${
                    isLight 
                      ? 'bg-violet-100' 
                      : 'bg-violet-900/30'
                  }`}>
                    <span className={`text-2xl font-bold ${
                      isLight ? 'text-violet-600' : 'text-violet-300'
                    }`}>DP</span>
                  </div>
                  <div>
                    <h4 className={`text-xl font-semibold mb-2 ${
                      isLight ? 'text-gray-900' : 'text-white'
                    }`}>Dr. Pramod</h4>
                    <p className={`mb-2 ${
                      isLight ? 'text-gray-600' : 'text-gray-300'
                    }`}>Associate Professor and Head of Department</p>
                    <p className={`text-sm ${
                      isLight ? 'text-gray-500' : 'text-gray-400'
                    }`}>Contact: hodcsd@pestrust.edu.in</p>
                    <p className={`text-sm ${
                      isLight ? 'text-gray-500' : 'text-gray-400'
                    }`}>Phone: 9886890174</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className={`w-20 h-20 rounded-xl flex items-center justify-center ${
                    isLight 
                      ? 'bg-violet-100' 
                      : 'bg-violet-900/30'
                  }`}>
                    <span className={`text-2xl font-bold ${
                      isLight ? 'text-violet-600' : 'text-violet-300'
                    }`}>AK</span>
                  </div>
                  <div>
                    <h4 className={`text-xl font-semibold mb-2 ${
                      isLight ? 'text-gray-900' : 'text-white'
                    }`}>Mrs. Ayisha Khanum</h4>
                    <p className={`mb-2 ${
                      isLight ? 'text-gray-600' : 'text-gray-300'
                    }`}>Assistant Professor</p>
                    <p className={`text-sm ${
                      isLight ? 'text-gray-500' : 'text-gray-400'
                    }`}>Lab In-charge: Programming C LAB</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Non-Teaching Faculty */}
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
              }`}>Non-Teaching Faculty</h3>
              <div className="flex items-start gap-6">
                <div className={`w-20 h-20 rounded-xl flex items-center justify-center ${
                  isLight 
                    ? 'bg-cyan-100' 
                    : 'bg-cyan-900/30'
                }`}>
                  <span className={`text-2xl font-bold ${
                    isLight ? 'text-cyan-600' : 'text-cyan-300'
                  }`}>SS</span>
                </div>
                <div>
                  <h4 className={`text-xl font-semibold mb-2 ${
                    isLight ? 'text-gray-900' : 'text-white'
                  }`}>Mr. Shivakumar S V</h4>
                  <p className={`mb-2 ${
                    isLight ? 'text-gray-600' : 'text-gray-300'
                  }`}>Lab Instructor</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
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
              <h3 className={`text-2xl font-bold mb-6 ${
                isLight ? 'text-violet-800' : 'text-violet-300'
              }`}>Programming C LAB</h3>
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <p className={`mb-4 ${
                    isLight ? 'text-gray-600' : 'text-gray-300'
                  }`}>
                    <span className={`font-semibold ${
                      isLight ? 'text-gray-900' : 'text-white'
                    }`}>Lab In-charge:</span> Mrs. Ayisha Khanum
                  </p>
                  <p className={`mb-4 ${
                    isLight ? 'text-gray-600' : 'text-gray-300'
                  }`}>
                    <span className={`font-semibold ${
                      isLight ? 'text-gray-900' : 'text-white'
                    }`}>Lab Area:</span> 180.27 SQ Meters
                  </p>
                </div>
                <div>
                  <h4 className={`text-lg font-semibold mb-4 ${
                    isLight ? 'text-gray-900' : 'text-white'
                  }`}>Equipment Details:</h4>
                  <ul className={`space-y-2 ${
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
                      256 GB SSD
                    </li>
                    <li className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        isLight ? 'bg-violet-500' : 'bg-violet-400'
                      }`} />
                      1TB HDD
                    </li>
                    <li className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        isLight ? 'bg-violet-500' : 'bg-violet-400'
                      }`} />
                      20" TFT Monitor /DOS
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