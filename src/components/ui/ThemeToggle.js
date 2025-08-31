import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';

const ThemeToggle = () => {
  const { theme, toggleTheme, useSystemTheme, isSystemTheme } = useTheme();
  const isLight = theme === 'light';
  
  return (
    <div className={`flex items-center gap-2 p-2 rounded-lg ${isLight 
      ? 'bg-gray-50 shadow-md relative overflow-hidden before:absolute before:w-12 before:h-12 before:content-[\'\'] before:right-0 before:bg-violet-500 before:rounded-full before:blur-lg before:opacity-30 before:[box-shadow:-30px_10px_10px_5px_#F9B0B9]' 
      : 'bg-gray-800'}`}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => theme !== 'light' && toggleTheme()}
        className={`p-2 rounded-md transition-colors relative z-10 ${
          theme === 'light' && !isSystemTheme
            ? 'bg-white text-yellow-500 shadow-md'
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        aria-label="Light mode"
      >
        <FiSun className="w-5 h-5" />
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => theme !== 'dark' && toggleTheme()}
        className={`p-2 rounded-md transition-colors relative z-10 ${
          theme === 'dark' && !isSystemTheme
            ? 'bg-gray-700 text-blue-400 shadow-md'
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        aria-label="Dark mode"
      >
        <FiMoon className="w-5 h-5" />
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={useSystemTheme}
        className={`p-2 rounded-md transition-colors relative z-10 ${
          isSystemTheme
            ? isLight ? 'bg-white text-pink-400 shadow-md' : 'bg-gray-700 text-blue-400 shadow-md'
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        aria-label="System preference"
      >
        <FiMonitor className="w-5 h-5" />
      </motion.button>
    </div>
  );
};

export default ThemeToggle; 