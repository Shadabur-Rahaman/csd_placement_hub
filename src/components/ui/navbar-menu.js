import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

export const Menu = ({ children }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <nav className={`relative rounded-lg overflow-hidden ${isLight 
      ? 'bg-gray-50 border border-neutral-200 before:absolute before:w-12 before:h-12 before:content-[\'\'] before:right-0 before:bg-violet-500 before:rounded-full before:blur-lg before:opacity-70 before:[box-shadow:-30px_10px_10px_5px_#F9B0B9]' 
      : 'bg-black/90 border border-white/20'} backdrop-blur-md`}>
      <ul className="flex items-center justify-center gap-2 px-6 py-2 relative z-10">
        {children}
      </ul>
    </nav>
  );
};

export const MenuItem = ({ item, href }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <li className="relative flex items-center justify-center">
      <Link
        to={href}
        className={`group relative overflow-hidden rounded-lg px-4 py-2 ${isLight 
          ? 'bg-gray-50 text-pink-400 hover:text-violet-600 before:absolute before:w-12 before:h-12 before:content-[\'\'] before:right-0 before:bg-violet-500 before:rounded-full before:blur-lg before:opacity-0 hover:before:opacity-70 before:[box-shadow:-30px_10px_10px_5px_#F9B0B9]' 
          : 'text-white/80 hover:text-white'} cursor-pointer transition-all duration-300`}
      >
        <span className="text-sm font-medium relative z-10">{item}</span>
      </Link>
    </li>
  );
};

export const HoveredLink = ({ children, href, className }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <Link
      to={href}
      className={`group relative overflow-hidden rounded-lg px-4 py-2 ${isLight 
        ? 'bg-gray-50 text-pink-400 hover:text-violet-600 before:absolute before:w-12 before:h-12 before:content-[\'\'] before:right-0 before:bg-violet-500 before:rounded-full before:blur-lg before:opacity-0 hover:before:opacity-70 before:[box-shadow:-30px_10px_10px_5px_#F9B0B9]' 
        : 'text-white/80 hover:text-white hover:bg-white/10'} transition-all duration-300 ${className}`}
    >
      <span className="relative z-10">{children}</span>
    </Link>
  );
};

export const ProductItem = ({ title, description, href, src }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <Link 
      to={href} 
      className={`group relative overflow-hidden rounded-lg p-2 ${isLight 
        ? 'bg-gray-50 hover:text-violet-600 before:absolute before:w-12 before:h-12 before:content-[\'\'] before:right-0 before:bg-violet-500 before:rounded-full before:blur-lg before:opacity-0 hover:before:opacity-70 before:[box-shadow:-30px_10px_10px_5px_#F9B0B9]' 
        : 'hover:bg-white/10'} transition-all duration-300 flex gap-4`}
    >
      <div className="h-12 w-12 overflow-hidden rounded-lg relative z-10">
        <img
          src={src}
          alt={title}
          width={50}
          height={50}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="relative z-10">
        <h3 className={`text-sm font-medium ${isLight ? 'text-pink-400' : 'text-white'}`}>{title}</h3>
        <p className={`text-xs ${isLight ? 'text-gray-600' : 'text-white/70'}`}>{description}</p>
      </div>
    </Link>
  );
}; 