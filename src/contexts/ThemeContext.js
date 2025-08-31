import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [systemTheme, setSystemTheme] = useState('light');

  // Check system preference on mount
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateSystemTheme = (e) => {
      const newTheme = e.matches ? 'dark' : 'light';
      setSystemTheme(newTheme);
      setTheme(newTheme); // Auto-switch to system theme
    };

    // Set initial theme based on system preference
    updateSystemTheme(mediaQuery);

    // Listen for changes in system theme preference
    mediaQuery.addEventListener('change', updateSystemTheme);
    
    return () => {
      mediaQuery.removeEventListener('change', updateSystemTheme);
    };
  }, []);

  // Toggle theme manually
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Set theme to system preference
  const useSystemTheme = () => {
    setTheme(systemTheme);
  };

  const value = {
    theme,
    systemTheme,
    toggleTheme,
    useSystemTheme,
    isSystemTheme: theme === systemTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
} 