import React from 'react';
import { motion } from 'motion/react';

export default function WhatsAppCommunitySlider() {
  const telegramLink = 'https://t.me/cga_help';

  return (
    <div className="relative select-none flex justify-end">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes custom-telegram-glow {
          0% { box-shadow: 0 0 0 0 rgba(34, 158, 217, 0.5); }
          70% { box-shadow: 0 0 0 12px rgba(34, 158, 217, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 158, 217, 0); }
        }
      `}} />

      {/* Realistic 3D Telegram Button pointing directly to @cga_help */}
      <motion.a
        href={telegramLink}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          y: [0, -4, 0]
        }}
        transition={{
          opacity: { duration: 0.3 },
          scale: { duration: 0.3 },
          y: {
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center cursor-pointer relative shadow-[0_8px_24px_rgba(34, 158, 217, 0.35),inset_0_2px_4px_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.2)] border border-[#1e96c8]/40"
        style={{
          background: 'radial-gradient(circle at 35% 25%, #54c5f8 0%, #229ed9 50%, #1e96c8 100%)',
          animation: 'custom-telegram-glow 2.5s infinite ease-in-out',
        }}
        title="Contact Telegram Support"
      >
        {/* Glossy top reflection layer for realistic 3D appearance */}
        <div 
          className="absolute top-0.5 left-0.5 right-0.5 h-[40%] rounded-t-full pointer-events-none opacity-35"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 100%)',
          }}
        />

        {/* Clean crisp white Telegram logo */}
        <svg 
          className="w-6 h-6 md:w-7 md:h-7 text-white filter drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.35)]" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-1-.65-.35-1 .22-1.58.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.24-5.54 3.65-.52.36-.97.53-1.33.52-.4-.01-1.17-.23-1.74-.41-.7-.23-1.26-.35-1.21-.74.03-.2.29-.41.79-.62 3.09-1.34 5.15-2.23 6.19-2.67 2.94-1.24 3.55-1.45 3.95-1.46.09 0 .28.02.4.12.1.08.13.19.14.28-.01.07.01.21 0 .31z" />
        </svg>
      </motion.a>
    </div>
  );
}
