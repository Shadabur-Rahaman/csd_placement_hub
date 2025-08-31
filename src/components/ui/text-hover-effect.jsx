"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

export const TextHoverEffect = ({
  text,
  duration
}) => {
  const svgRef = useRef(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Start animation cycles even when not hovering
    const interval = setInterval(() => {
      if (!hovered) {
        setMaskPosition(prev => ({
          cx: `${Math.random() * 100}%`,
          cy: `${Math.random() * 100}%`,
        }));
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [hovered]);

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  // Animation for the gradient rotation
  useEffect(() => {
    setIsAnimating(true);
    return () => setIsAnimating(false);
  }, []);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className="select-none">
      <defs>
        <motion.linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          animate={isAnimating ? {
            rotate: [0, 180, 360],
          } : {}}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "linear"
          }}>
          {/* Enhanced colors for better visibility */}
          <stop offset="0%" stopColor={hovered ? "#eab308" : "#eab30880"} />
          <stop offset="25%" stopColor={hovered ? "#ef4444" : "#ef444480"} />
          <stop offset="50%" stopColor={hovered ? "#3b82f6" : "#3b82f680"} />
          <stop offset="75%" stopColor={hovered ? "#06b6d4" : "#06b6d480"} />
          <stop offset="100%" stopColor={hovered ? "#8b5cf6" : "#8b5cf680"} />
        </motion.linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r={hovered ? "35%" : "25%"}
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ 
            duration: hovered ? (duration ?? 0.3) : 1.5, 
            ease: hovered ? "easeOut" : "easeInOut" 
          }}>
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect x="0" y="0" width="100%" height="100%" fill="url(#revealMask)" />
        </mask>
      </defs>
      
      {/* Background outline text */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="1"
        className="fill-transparent stroke-neutral-300 font-[helvetica] text-7xl font-bold dark:stroke-neutral-700"
        style={{ opacity: hovered ? 0.7 : 0.6 }}>
        {text}
      </text>
      
      {/* Animated outline text */}
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="1"
        className="fill-transparent stroke-neutral-300 font-[helvetica] text-7xl font-bold dark:stroke-neutral-700"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{
          strokeDashoffset: [1000, 0, 1000],
        }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop"
        }}>
        {text}
      </motion.text>
      
      {/* Color fill text */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="1.2"
        mask="url(#textMask)"
        className="fill-transparent font-[helvetica] text-7xl font-bold">
        {text}
      </text>
    </svg>
  );
}; 