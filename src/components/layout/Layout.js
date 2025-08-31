import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useTheme } from '../../contexts/ThemeContext';

const Layout = ({ children }) => {
  const { theme } = useTheme();
  
  // Apply theme class to document body
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <div className={`flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout; 