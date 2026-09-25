import React from 'react';
import { motion } from 'motion/react';

export default function PremiumLoader() {
  return (
    <div className="fixed inset-0 bg-[#050608] flex items-center justify-center z-[9999] select-none overflow-hidden">
      {/* Ambient Radial Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#009e42]/5 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-500/5 blur-[90px] rounded-full pointer-events-none" />

      {/* Perfectly Centered Circle and Logo */}
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Outer Segmented Ring */}
        <motion.svg 
          className="absolute inset-0 w-full h-full" 
          viewBox="0 0 100 100"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
        >
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="#009e42"
            strokeWidth="1.5"
            strokeDasharray="10 25 40 25"
            strokeOpacity="0.3"
          />
        </motion.svg>

        {/* Middle Dotted Ring (rotating in opposite direction) */}
        <motion.svg 
          className="absolute inset-0 w-full h-full" 
          viewBox="0 0 100 100"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#02d147"
            strokeWidth="1"
            strokeDasharray="2 6"
            strokeOpacity="0.5"
          />
        </motion.svg>

        {/* Inner Glowing Scanning Ring */}
        <motion.svg 
          className="absolute inset-0 w-full h-full" 
          viewBox="0 0 100 100"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        >
          <circle
            cx="50"
            cy="50"
            r="34"
            fill="none"
            stroke="#009e42"
            strokeWidth="2"
            strokeDasharray="60 120"
            strokeLinecap="round"
            strokeOpacity="0.8"
            style={{ filter: 'drop-shadow(0px 0px 8px rgba(0, 158, 66, 0.5))' }}
          />
        </motion.svg>

        {/* Logo Container with Breathing Pulse Effect - Transparent background & Proportional sizing */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          animate={{ 
            scale: [1, 1.04, 1]
          }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        >
          <img 
            src="https://i.imgur.com/nRbbYnS.png" 
            alt="CGA Logo" 
            referrerPolicy="no-referrer"
            className="w-20 h-20 sm:w-[84px] sm:h-[84px] object-contain drop-shadow-[0_0_16px_rgba(0,158,66,0.35)]"
          />
        </motion.div>
      </div>
    </div>
  );
}
