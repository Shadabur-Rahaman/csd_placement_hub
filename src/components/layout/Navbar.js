// src/components/Navbar.jsx
import React, { useState, useEffect, useRef, createContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HoveredLink } from '../ui/navbar-menu';
import { cn } from '../../lib/utils';
import { useTheme } from '../../contexts/ThemeContext';
import {
  HomeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CalendarIcon,
  UserIcon,
  PhoneIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import { RiMenu3Fill, RiCloseFill } from 'react-icons/ri';
import { MdKeyboardArrowDown } from 'react-icons/md';

const DropdownContext = createContext({
  activeDropdown: null,
  setActiveDropdown: () => {},
  isClosing: false
});

const Navbar = () => {
  const [active, setActive] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const timeoutRef = useRef(null);
  const dropdownRef = useRef({});

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleDropdownToggle = (name, isOpen) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (isOpen) setActive(name);
    else {
      timeoutRef.current = setTimeout(() => setActive(null), 100);
    }
  };

  const dropdownContextValue = {
    activeDropdown: active,
    setActiveDropdown: handleDropdownToggle,
    handleDropdownClose: () => handleDropdownToggle(null, false),
    isClosing: false
  };

  // helper to detect external urls
  const isExternal = (url) => /^https?:\/\//.test(String(url));

  const navLinks = [
    { name: 'Home', icon: HomeIcon, path: '/' },
    { name: 'About', icon: UserGroupIcon, path: '/about' },
    { name: 'Placements', icon: AcademicCapIcon, path: 'https://staging-student-visual-tool-amti.frontend.encr.app' },
    { name: 'Resume Analyzer', icon: UserIcon, path: 'https://screenify-two.vercel.app/' },
    { name: 'Interview Prep', icon: CalendarIcon, path: 'https://interview-prep-green.vercel.app/sign-in' }
  ];

  return (
    <DropdownContext.Provider value={dropdownContextValue}>
      <header className={`${isScrolled
        ? isLight ? 'bg-gray-50/95 backdrop-blur-md' : 'bg-black/95 backdrop-blur-md'
        : isLight ? 'bg-gray-50 relative overflow-hidden before:absolute before:w-12 before:h-12 before:content-[\'\'] before:right-0 before:top-0 before:bg-violet-500 before:rounded-full before:blur-lg before:opacity-70 before:[box-shadow:-30px_10px_10px_5px_#F9B0B9]' : 'bg-black'}
        w-full z-[90] transition-all duration-300`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 relative z-10 rounded-full">
          <div className="flex justify-center items-center">
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2.5 rounded-xl ${isLight
                  ? 'bg-white/70 text-pink-500 hover:bg-pink-50/50'
                  : 'bg-white/10 text-white hover:bg-white/20'} backdrop-blur-sm transition-all duration-300`}
              >
                {isMobileMenuOpen ? <RiCloseFill className="w-6 h-6" /> : <RiMenu3Fill className="w-6 h-6" />}
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3">
              <nav className={`rounded-full px-3 py-1 relative ${isLight
                ? 'bg-gray-50 border border-pink-200 hover:border-violet-300'
                : 'bg-white/5 border border-white/20 hover:border-white/40'} transition-all duration-300`}>
                <ul className="flex gap-2 lg:gap-3 items-center">
                  {navLinks.map((link) => (
                    <li key={link.name} className="relative">
                      {/* Use anchor for external links, Link for internal */}
                      {link.hasSubmenu ? (
                        <div
                          ref={el => dropdownRef.current[link.name.toLowerCase()] = el}
                          className="dropdown-container"
                          onMouseEnter={() => handleDropdownToggle(link.name.toLowerCase(), true)}
                          onMouseLeave={() => handleDropdownToggle(link.name.toLowerCase(), false)}
                        >
                          <div
                            className={`group relative overflow-visible rounded-full px-4 py-1.5 ${isLight
                              ? 'text-pink-400 hover:text-violet-600 before:absolute before:w-12 before:h-12 before:content-[\'\'] before:right-0 before:bg-violet-500 before:rounded-full before:blur-lg before:opacity-0 hover:before:opacity-70 before:[box-shadow:-30px_10px_10px_5px_#F9B0B9]'
                              : 'text-white/80 hover:text-white'} font-medium text-sm tracking-wide cursor-pointer transition-all duration-300 flex items-center`}
                          >
                            <span className="relative z-10">{link.name}</span>
                            <svg className="ml-1.5 w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        isExternal(link.path) ? (
                          <a
                            href={link.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group relative overflow-hidden rounded-full px-4 py-1.5 ${isLight
                              ? 'text-pink-400 hover:text-violet-600 before:absolute before:w-12 before:h-12 before:content-[\'\'] before:right-0 before:bg-violet-500 before:rounded-full before:blur-lg before:opacity-0 hover:before:opacity-70 before:[box-shadow:-30px_10px_10px_5px_#F9B0B9]'
                              : 'text-white/80 hover:text-white'} font-medium text-sm tracking-wide transition-all duration-300`}
                          >
                            <span className="relative z-10">{link.name}</span>
                          </a>
                        ) : (
                          <Link
                            to={link.path}
                            className={`group relative overflow-hidden rounded-full px-4 py-1.5 ${isLight
                              ? 'text-pink-400 hover:text-violet-600 before:absolute before:w-12 before:h-12 before:content-[\'\'] before:right-0 before:bg-violet-500 before:rounded-full before:blur-lg before:opacity-0 hover:before:opacity-70 before:[box-shadow:-30px_10px_10px_5px_#F9B0B9]'
                              : 'text-white/80 hover:text-white'} font-medium text-sm tracking-wide transition-all duration-300`}
                          >
                            <span className="relative z-10">{link.name}</span>
                          </Link>
                        )
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`md:hidden mt-4 rounded-2xl ${isLight
                  ? 'bg-white/70 backdrop-blur-xl border border-white/20'
                  : 'bg-black/70 backdrop-blur-xl border border-white/10'} overflow-hidden`}
              >
                <nav className="p-3">
                  <div className="space-y-2">
                    {navLinks.map((link) => (
                      <div key={link.name}>
                        {link.hasSubmenu ? (
                          <div>
                            <button
                              onClick={() => setActiveSubmenu(activeSubmenu === link.name ? null : link.name)}
                              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl ${isLight
                                ? 'bg-white/50 text-pink-500 hover:bg-pink-50/50'
                                : 'bg-white/5 text-white hover:bg-white/10'} backdrop-blur-sm transition-all duration-300`}
                            >
                              <span className="font-medium">{link.name}</span>
                              <MdKeyboardArrowDown
                                className={`w-5 h-5 transition-transform ${activeSubmenu === link.name ? 'rotate-180' : ''}`}
                              />
                            </button>
                            <AnimatePresence>
                              {activeSubmenu === link.name && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="mt-2 ml-4 space-y-2"
                                >
                                  {link.submenu?.map((subItem) => (
                                    <Link
                                      key={subItem.name}
                                      to={subItem.path}
                                      className={`block px-4 py-3 rounded-xl ${isLight
                                        ? 'bg-white/30 text-pink-500 hover:bg-pink-50/50'
                                        : 'bg-white/5 text-white/90 hover:bg-white/10'} backdrop-blur-sm transition-all duration-300`}
                                      onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      {subItem.name}
                                    </Link>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ) : (
                          isExternal(link.path) ? (
                            <a
                              href={link.path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center justify-between px-4 py-3 rounded-xl ${isLight
                                ? 'bg-white/50 text-pink-500 hover:bg-pink-50/50'
                                : 'bg-white/5 text-white hover:bg-white/10'} backdrop-blur-sm transition-all duration-300`}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <span className="font-medium">{link.name}</span>
                            </a>
                          ) : (
                            <Link
                              to={link.path}
                              className={`flex items-center justify-between px-4 py-3 rounded-xl ${isLight
                                ? 'bg-white/50 text-pink-500 hover:bg-pink-50/50'
                                : 'bg-white/5 text-white hover:bg-white/10'} backdrop-blur-sm transition-all duration-300`}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <span className="font-medium">{link.name}</span>
                            </Link>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Mega menus (unchanged) */}
      {/* ... your mega menu code unchanged ... */}

      {/* Scrolled Mobile Navigation (unchanged, omitted for brevity) */}

      {/* Desktop Sticky Sidebar */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ width: "60px" }}
            animate={{ width: isHovered ? "240px" : "60px" }}
            exit={{ width: "60px" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`fixed left-0 top-1/2 -translate-y-1/2 h-auto ${isLight
              ? 'bg-gray-50/95 backdrop-blur-xl border-r border-y border-neutral-200'
              : 'bg-black/95 backdrop-blur-xl border-r border-y border-white/10'} rounded-r-xl overflow-hidden z-[100] hidden md:block`}
          >
            <nav className="p-2">
              {navLinks.map((link) => (
                <div key={link.name} className="relative">
                  {/* choose anchor or Link for destination */}
                  {isExternal(link.path) ? (
                    <a
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 mb-1 last:mb-0 ${isLight
                        ? 'bg-gray-50 text-pink-400 hover:text-violet-600 before:absolute before:w-12 before:h-12 before:content-[\'\'] before:right-0 before:bg-violet-500 before:rounded-full before:blur-lg before:opacity-0 hover:before:opacity-70 before:[box-shadow:-30px_10px_10px_5px_#F9B0B9]'
                        : 'text-white/80 hover:text-white hover:bg-white/10'} transition-all duration-300 relative overflow-hidden whitespace-nowrap`}
                      onClick={(e) => {
                        if (link.hasSubmenu) {
                          e.preventDefault();
                          setActiveSubmenu(activeSubmenu === link.name ? null : link.name);
                        }
                      }}
                    >
                      {/* only render icon if present; fallback to AcademicCapIcon for spacing */}
                      {link.icon ? (
                        <link.icon className="w-5 h-5 min-w-[20px]" />
                      ) : (
                        <AcademicCapIcon className="w-5 h-5 min-w-[20px] opacity-60" />
                      )}

                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="relative z-10 flex-1"
                      >
                        {link.name}
                      </motion.span>

                      {link.hasSubmenu && isHovered && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                          <MdKeyboardArrowDown className={`w-5 h-5 transition-transform ${activeSubmenu === link.name ? 'rotate-180' : ''}`} />
                        </motion.div>
                      )}
                    </a>
                  ) : (
                    <Link
                      to={link.path}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 mb-1 last:mb-0 ${isLight
                        ? 'bg-gray-50 text-pink-400 hover:text-violet-600 before:absolute before:w-12 before:h-12 before:content-[\'\'] before:right-0 before:bg-violet-500 before:rounded-full before:blur-lg before:opacity-0 hover:before:opacity-70 before:[box-shadow:-30px_10px_10px_5px_#F9B0B9]'
                        : 'text-white/80 hover:text-white hover:bg-white/10'} transition-all duration-300 relative overflow-hidden whitespace-nowrap`}
                      onClick={(e) => {
                        if (link.hasSubmenu) {
                          e.preventDefault();
                          setActiveSubmenu(activeSubmenu === link.name ? null : link.name);
                        }
                      }}
                    >
                      {link.icon ? (
                        <link.icon className="w-5 h-5 min-w-[20px]" />
                      ) : (
                        <AcademicCapIcon className="w-5 h-5 min-w-[20px] opacity-60" />
                      )}

                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: isHovered ? 1 : 0 }} transition={{ duration: 0.2 }} className="relative z-10 flex-1">
                        {link.name}
                      </motion.span>

                      {link.hasSubmenu && isHovered && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                          <MdKeyboardArrowDown className={`w-5 h-5 transition-transform ${activeSubmenu === link.name ? 'rotate-180' : ''}`} />
                        </motion.div>
                      )}
                    </Link>
                  )}

                  {/* Sidebar Submenu (unchanged logic) */}
                  <AnimatePresence>
                    {link.hasSubmenu && activeSubmenu === link.name && isHovered && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="ml-3 mt-1 mb-2 overflow-hidden">
                        <div className="space-y-1">
                          {link.submenu?.map((item) => (
                            <Link key={item.name} to={item.path} className={`block px-3 py-2 rounded-lg text-sm ${isLight ? 'text-pink-400 hover:text-violet-600 hover:bg-violet-50/50' : 'text-white/70 hover:text-white hover:bg-white/10'} transition-all duration-300`}>
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </DropdownContext.Provider>
  );
};

export default Navbar;
