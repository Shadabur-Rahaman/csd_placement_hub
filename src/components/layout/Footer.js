import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../ui/ThemeToggle';

const Footer = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <footer className={`relative overflow-hidden ${
      isLight 
        ? 'bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100' 
        : 'bg-[#030014] bg-grid-pattern'
    }`}>
      {/* Background Elements */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-0 -left-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-0 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Department Info */}
          <div className={`${isLight ? 'bg-white/50' : 'bg-white/5'} backdrop-blur-lg rounded-2xl p-6 border ${
            isLight ? 'border-gray-200/50' : 'border-white/10'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              isLight 
                ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-transparent bg-clip-text' 
                : 'bg-gradient-to-r from-violet-400 to-cyan-400 text-transparent bg-clip-text'
            }`}>
              Department Portal
            </h3>
            <p className={`${isLight ? 'text-gray-600' : 'text-gray-300'} text-sm mb-6`}>
              Empowering students through education, innovation, and research excellence.
            </p>
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
          
          {/* Quick Links */}
          <div className={`${isLight ? 'bg-white/50' : 'bg-white/5'} backdrop-blur-lg rounded-2xl p-6 border ${
            isLight ? 'border-gray-200/50' : 'border-white/10'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              isLight 
                ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-transparent bg-clip-text' 
                : 'bg-gradient-to-r from-violet-400 to-cyan-400 text-transparent bg-clip-text'
            }`}>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { to: "https://staging-student-visual-tool-amti.frontend.encr.app", text: "Placements", external: true },
                { to: "https://screenify-two.vercel.app/", text: "Resume Analyzer", external: true },
                { to: "https://interview-prep-green.vercel.app/sign-in", text: "Interview Prep", external: true },
                { to: "/faculty", text: "Faculty", external: false }
              ].map((link) => (
                <li key={link.to}>
                  {link.external ? (
                    <a 
                      href={link.to}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm group flex items-center transition-colors ${
                        isLight 
                          ? 'text-gray-600 hover:text-violet-600' 
                          : 'text-gray-300 hover:text-violet-400'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 transition-colors ${
                        isLight 
                          ? 'bg-gray-300 group-hover:bg-violet-600' 
                          : 'bg-gray-600 group-hover:bg-violet-400'
                      }`} />
                      {link.text}
                    </a>
                  ) : (
                    <Link 
                      to={link.to}
                      className={`text-sm group flex items-center transition-colors ${
                        isLight 
                          ? 'text-gray-600 hover:text-violet-600' 
                          : 'text-gray-300 hover:text-violet-400'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 transition-colors ${
                        isLight 
                          ? 'bg-gray-300 group-hover:bg-violet-600' 
                          : 'bg-gray-600 group-hover:bg-violet-400'
                      }`} />
                      {link.text}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className={`${isLight ? 'bg-white/50' : 'bg-white/5'} backdrop-blur-lg rounded-2xl p-6 border ${
            isLight ? 'border-gray-200/50' : 'border-white/10'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              isLight 
                ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-transparent bg-clip-text' 
                : 'bg-gradient-to-r from-violet-400 to-cyan-400 text-transparent bg-clip-text'
            }`}>
              Contact Us
            </h3>
            <ul className="space-y-3">
              {[
                "Department of Computer Science & Design",
                "PESITM, Shivamogga",
                "Email: info@pesitm.edu"
              ].map((item, index) => (
                <li 
                  key={index}
                  className={`text-sm flex items-center ${
                    isLight ? 'text-gray-600' : 'text-gray-300'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                    isLight ? 'bg-gray-300' : 'bg-gray-600'
                  }`} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className={`mt-12 pt-8 ${
          isLight ? 'border-t border-gray-200/50' : 'border-t border-white/10'
        }`}>
          <p className={`text-center text-sm ${
            isLight ? 'text-gray-500' : 'text-gray-400'
          }`}>
            © {new Date().getFullYear()} Department of Computer Science & Design, PESITM. All rights reserved.
          </p>
        </div>
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
    </footer>
  );
};

export default Footer; 