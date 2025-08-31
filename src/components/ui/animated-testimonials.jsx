"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false
}) => {
  const [active, setActive] = useState(0);
  const [imageErrors, setImageErrors] = useState({});

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  useEffect(() => {
    // Reset active index when testimonials change
    setActive(0);
    setImageErrors({});
  }, [testimonials]);

  const handleImageError = (index) => {
    console.error(`Failed to load image for faculty: ${testimonials[index]?.name || 'Unknown'}`);
    console.error(`Image URL: ${testimonials[index]?.src}`);
    setImageErrors(prev => ({...prev, [index]: true}));
  };

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };
  
  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No testimonial data available.</p>
      </div>
    );
  }

  return (
    <div
      className="mx-auto max-w-sm px-4 py-20 font-sans antialiased md:max-w-4xl md:px-8 lg:px-12">
      <div className="relative grid grid-cols-1 gap-20 md:grid-cols-2">
        <div>
          <div className="relative h-80 w-full">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id || testimonial.src || index}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: randomRotateY(),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : randomRotateY(),
                    zIndex: isActive(index)
                      ? 40
                      : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -80, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: randomRotateY(),
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom">
                  {!imageErrors[index] ? (
                    <img
                      src={testimonial.src}
                      alt={testimonial.name || `Faculty ${index + 1}`}
                      width={900}
                      height={900}
                      draggable={false}
                      onError={() => handleImageError(index)}
                      onLoad={() => console.log(`Successfully loaded image: ${testimonial.src}`)}
                      className="h-full w-full rounded-3xl object-cover object-center" 
                    />
                  ) : (
                    <div className="h-full w-full rounded-3xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center">
                      <span className="text-5xl font-bold text-white/50">
                        {testimonial.name?.charAt(0) || "F"}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex flex-col justify-between py-4">
          <motion.div
            key={active}
            initial={{
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -20,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-cyan-500 dark:from-violet-400 dark:to-cyan-400 text-transparent bg-clip-text">
                {testimonials[active]?.name || "Faculty Member"}
              </h3>
              <div className="space-y-1">
                <p className={`text-sm font-medium ${testimonials[active]?.designation ? 'text-violet-600 dark:text-violet-400' : 'text-gray-500 dark:text-neutral-500'}`}>
                  {testimonials[active]?.designation || "Faculty Member"}
                </p>
                {testimonials[active]?.education && (
                  <div className="flex items-start">
                    <svg className="w-4 h-4 mt-0.5 mr-2 text-gray-500 dark:text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {testimonials[active]?.education}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <motion.p className="mt-8 text-lg text-gray-500 dark:text-neutral-300">
              {(testimonials[active]?.quote || "No biography available").split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{
                    filter: "blur(10px)",
                    opacity: 0,
                    y: 5,
                  }}
                  animate={{
                    filter: "blur(0px)",
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    delay: 0.02 * index,
                  }}
                  className="inline-block">
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>
          </motion.div>
          <div className="flex gap-4 pt-12 md:pt-0">
            <button
              onClick={handlePrev}
              className="group/button flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:rotate-12 dark:text-neutral-400"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={5} 
                  d="M15 19l-7-7 7-7" 
                />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="group/button flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:-rotate-12 dark:text-neutral-400"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={5} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 