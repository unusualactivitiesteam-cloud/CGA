import React from 'react';
import { motion } from 'motion/react';

export default function WhatsAppCommunitySlider() {
  const phoneNumber = '19376002568';
  const prefilledMessage = 'Hello, I would like to speak with customer service. Please assist me.';
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(prefilledMessage)}`;

  return (
    <div className="relative select-none flex justify-end">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes custom-whatsapp-glow {
          0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.5); }
          70% { box-shadow: 0 0 0 12px rgba(37, 211, 102, 0); }
          100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
        }
      `}} />

      {/* Realistic 3D WhatsApp Button pointing directly to customer service */}
      <motion.a
        href={whatsappLink}
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
        className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center cursor-pointer relative shadow-[0_8px_24px_rgba(37,211,102,0.35),inset_0_2px_4px_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.2)] border border-[#25d366]/40"
        style={{
          background: 'radial-gradient(circle at 35% 25%, #4ade80 0%, #25d366 50%, #128c7e 100%)',
          animation: 'custom-whatsapp-glow 2.5s infinite ease-in-out',
        }}
        title="Contact WhatsApp Support"
        aria-label="Contact WhatsApp Support"
      >
        {/* Glossy top reflection layer for realistic 3D appearance */}
        <div 
          className="absolute top-0.5 left-0.5 right-0.5 h-[40%] rounded-t-full pointer-events-none opacity-35"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 100%)',
          }}
        />

        {/* Clean crisp white WhatsApp logo */}
        <svg 
          className="w-6 h-6 md:w-7 md:h-7 text-white filter drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.35)]" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M12.004 2C6.48 2 2 6.48 2 12c0 1.76.46 3.48 1.33 5L2 22l5.15-1.35c1.5.82 3.19 1.25 4.85 1.25 5.52 0 10-4.48 10-10S17.52 2 12.004 2zm3.96 13.9c-.21.58-.81 1.07-1.38 1.25-.57.18-1.31.29-3.7-.7a11.9 11.9 0 01-5-4.43c-.87-1.15-1.38-2.54-1.38-3.95 0-1.72.89-2.54 1.25-2.91.24-.25.54-.34.78.34.19.55.77 1.88.84 2.01.07.14.07.29-.02.48l-.51.64c-.16.19-.34.4-.14.73.53.88 1.15 1.57 1.95 2.21.75.6 1.48.96 1.87 1.15.34.16.54.1.73-.13.2-.23.83-.97 1.05-1.3s.44-.27.73-.16c.3.11 1.88.89 2.21 1.05.32.16.54.24.62.38.08.14.08.82-.13 1.4z" />
        </svg>
      </motion.a>
    </div>
  );
}
