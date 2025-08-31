import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';

const GradientSelect = ({ options, defaultValue, onChange, className }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div
      className={`relative group rounded-lg w-64 ${isLight ? 'bg-gray-50' : 'bg-gray-800'} overflow-hidden ${className}
        ${isLight ? 'before:absolute before:w-12 before:h-12 before:content-[\'\'] before:right-0 before:bg-violet-500 before:rounded-full before:blur-lg before:[box-shadow:-60px_20px_10px_10px_#F9B0B9]' : ''}
      `}
    >
      <svg
        y="0"
        xmlns="http://www.w3.org/2000/svg"
        x="0"
        width="100"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        height="100"
        className={`w-8 h-8 absolute right-0 -rotate-45 top-1.5 group-hover:rotate-0 duration-300 ${
          isLight ? 'stroke-pink-300' : 'stroke-violet-400'
        }`}
      >
        <path
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
          d="M60.7,53.6,50,64.3m0,0L39.3,53.6M50,64.3V35.7m0,46.4A32.1,32.1,0,1,1,82.1,50,32.1,32.1,0,0,1,50,82.1Z"
          className="svg-stroke-primary"
        ></path>
      </svg>
      
      <motion.select
        whileHover={{ scale: 1.01 }}
        onChange={onChange}
        defaultValue={defaultValue}
        className={`appearance-none relative ring-0 outline-none border text-sm font-bold rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5 transition-colors ${
          isLight 
            ? 'text-pink-400 bg-transparent border-neutral-500 text-neutral-900 placeholder-violet-700 hover:placeholder-shown:bg-emerald-500' 
            : 'text-violet-300 bg-transparent border-neutral-600 text-neutral-200 placeholder-violet-400'
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </motion.select>
    </div>
  );
};

export default GradientSelect; 