import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

const DetailModal = ({ event, isOpen, onClose, isLight }) => {
  if (!event) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 text-white hover:bg-black/30 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image */}
            <div className="relative h-64 sm:h-80">
              {event.imageBase64 ? (
                <img
                  src={event.imageBase64}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white/20">
                    {event.eventType}
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
                  {event.eventType}
                </span>
                {event.date && (
                  <span className={isLight ? 'text-gray-500' : 'text-gray-400'}>
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                )}
              </div>

              <h3 className={`text-2xl font-bold mb-4 ${
                isLight ? 'text-gray-900' : 'text-white'
              }`}>
                {event.title}
              </h3>

              <p className={`mb-6 ${
                isLight ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {event.description}
              </p>

              {event.location && (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.location}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DetailModal; 