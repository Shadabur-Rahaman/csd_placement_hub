import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// A utility function to conditionally join class names
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Animation utility for staggered animations
export function stagger(delayChildren = 0.1, staggerChildren = 0.1) {
  return {
    animate: {
      transition: {
        delayChildren,
        staggerChildren,
      },
    },
  };
}

// Text animation variants
export const textAnimationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Line animation variants for text reveal
export const lineAnimationVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}; 