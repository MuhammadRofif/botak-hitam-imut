/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

interface MascotProps {
  mood?: 'idle' | 'happy' | 'thinking' | 'correct' | 'wrong' | 'sleeping' | 'focus';
  size?: number;
  speechBubble?: string;
}

export default function Mascot({ mood = 'idle', size = 160, speechBubble }: MascotProps) {
  
  // Custom styling based on mood
  const getEffects = () => {
    switch (mood) {
      case 'sleeping':
        return {
          filter: 'hue-rotate(20deg) brightness(0.8) contrast(0.95)',
          borderColor: '#93C5FD',
          glowColor: 'rgba(147, 197, 253, 0.4)',
        };
      case 'wrong':
        return {
          filter: 'hue-rotate(-45deg) saturate(1.5) brightness(0.85)',
          borderColor: '#F43F5E',
          glowColor: 'rgba(244, 63, 94, 0.6)',
        };
      case 'happy':
      case 'correct':
        return {
          filter: 'brightness(1.05) saturate(1.2)',
          borderColor: '#34D399',
          glowColor: 'rgba(52, 211, 153, 0.6)',
        };
      case 'thinking':
        return {
          filter: 'hue-rotate(15deg) brightness(0.95)',
          borderColor: '#FBBF24',
          glowColor: 'rgba(251, 191, 36, 0.4)',
        };
      case 'focus':
        return {
          filter: 'brightness(1.1) contrast(1.1)',
          borderColor: '#10B981',
          glowColor: 'rgba(16, 185, 129, 0.7)',
        };
      case 'idle':
      default:
        return {
          filter: 'none',
          borderColor: '#FFFDF0',
          glowColor: 'rgba(109, 104, 117, 0.2)',
        };
    }
  };

  const effects = getEffects();

  // Animations based on mood
  const getAnimation = () => {
    switch (mood) {
      case 'sleeping':
        return {
          y: [0, 4, 0],
          scale: [1, 0.97, 1],
          rotate: [-2, 2, -2],
        };
      case 'happy':
      case 'correct':
        return {
          y: [0, -18, 0],
          scale: [1, 1.06, 0.95, 1.02, 1],
          rotate: [0, -8, 8, -4, 4, 0],
        };
      case 'wrong':
        return {
          x: [0, -8, 8, -6, 6, -3, 3, 0],
          rotate: [0, -3, 3, -2, 2, 0],
        };
      case 'thinking':
        return {
          y: [0, -4, 0],
          rotate: [0, 2, -2, 0],
        };
      case 'focus':
        return {
          scale: [1, 1.03, 1],
          y: [0, -2, 0],
        };
      case 'idle':
      default:
        return {
          y: [0, -6, 0],
        };
    }
  };

  const getTransition = () => {
    switch (mood) {
      case 'sleeping':
        return {
          repeat: Infinity,
          duration: 3.5,
          ease: 'easeInOut',
        } as const;
      case 'happy':
      case 'correct':
        return {
          repeat: Infinity,
          repeatDelay: 1,
          duration: 1.2,
          ease: 'easeInOut',
        } as const;
      case 'wrong':
        return {
          repeat: Infinity,
          repeatDelay: 1.5,
          duration: 0.6,
          ease: 'easeInOut',
        } as const;
      case 'thinking':
        return {
          repeat: Infinity,
          duration: 4,
          ease: 'easeInOut',
        } as const;
      case 'focus':
        return {
          repeat: Infinity,
          duration: 2,
          ease: 'easeInOut',
        } as const;
      case 'idle':
      default:
        return {
          repeat: Infinity,
          duration: 4.5,
          ease: 'easeInOut',
        } as const;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center select-none" style={{ minHeight: `${size + 40}px` }}>
      {/* Balloon Speech Bubble if provided */}
      {speechBubble && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative mb-4 max-w-[220px] border-3 border-[#6D6875] bg-white px-4 py-2.5 text-center text-xs font-bold text-[#6D6875] rounded-2xl shadow-[4px_4px_0px_#6D6875] z-10"
        >
          {speechBubble}
          <div className="absolute -bottom-2.5 left-1/2 h-0 w-0 -translate-x-1/2 border-x-8 border-t-[10px] border-x-transparent border-t-[#6D6875]"></div>
          <div className="absolute -bottom-1.5 left-1/2 h-0 w-0 -translate-x-1/2 border-x-6 border-t-[8px] border-x-transparent border-t-white"></div>
        </motion.div>
      )}

      {/* Mascot Wrapper */}
      <div className="relative flex items-center justify-center">
        {/* Soft shadow below the mascot */}
        <motion.div
          animate={{
            scale: mood === 'sleeping' ? [1, 0.95, 1] : [1, 0.9, 1],
            opacity: mood === 'sleeping' ? [0.3, 0.15, 0.3] : [0.3, 0.1, 0.3],
          }}
          transition={{
            repeat: Infinity,
            duration: mood === 'sleeping' ? 3.5 : 4.5,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-2 w-4/5 h-2 bg-[#1E293B] rounded-full blur-sm pointer-events-none"
        />

        {/* Main Mascot body (The Green Mascot Image) */}
        <motion.div
          animate={getAnimation()}
          transition={getTransition()}
          style={{
            width: size,
            height: size,
          }}
          className="cursor-pointer relative z-0"
        >
          {/* Neon Glow outer border with rounded stickers design */}
          <div
            className="w-full h-full rounded-full overflow-hidden border-4 transition-all duration-300"
            style={{
              borderColor: effects.borderColor,
              boxShadow: `0 0 16px ${effects.glowColor}, 4px 4px 0px rgba(109, 104, 117, 0.3)`,
            }}
          >
            <img
              src="/green-mascot.png"
              alt="Mascot"
              className="w-full h-full object-cover transition-all duration-300 scale-110"
              style={{
                filter: effects.filter,
              }}
            />
          </div>

          {/* Decorative Elements Overlay based on Mood */}
          {mood === 'sleeping' && (
            <div className="absolute -top-3 -right-3 text-xl font-bold select-none pointer-events-none text-blue-400 flex flex-col gap-1">
              <motion.span
                animate={{ y: [0, -10, 0], x: [0, 5, 0], opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0 }}
              >
                💤
              </motion.span>
              <motion.span
                animate={{ y: [0, -12, 0], x: [0, 8, 0], opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.6 }}
                className="text-sm scale-75"
              >
                zZ
              </motion.span>
            </div>
          )}

          {(mood === 'happy' || mood === 'correct') && (
            <div className="absolute -top-4 -left-4 text-xl select-none pointer-events-none text-emerald-500">
              <motion.span
                animate={{ scale: [0.8, 1.3, 0.8], rotate: [0, 15, -15, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="block"
              >
                ✨
              </motion.span>
            </div>
          )}
          {(mood === 'happy' || mood === 'correct') && (
            <div className="absolute -top-4 -right-4 text-xl select-none pointer-events-none text-yellow-500">
              <motion.span
                animate={{ scale: [0.8, 1.3, 0.8], rotate: [0, -15, 15, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
                className="block"
              >
                🎉
              </motion.span>
            </div>
          )}

          {mood === 'wrong' && (
            <div className="absolute -top-4 -right-3 text-2xl select-none pointer-events-none text-rose-500 flex flex-col gap-1">
              <motion.span
                animate={{ rotate: [0, 360], scale: [0.8, 1.2, 0.8] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                💢
              </motion.span>
            </div>
          )}

          {mood === 'thinking' && (
            <div className="absolute -top-5 -right-3 text-xl select-none pointer-events-none">
              <motion.span
                animate={{ y: [0, -5, 0], scale: [0.9, 1.1, 0.9] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="block"
              >
                ❓
              </motion.span>
            </div>
          )}

          {mood === 'focus' && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-lg select-none pointer-events-none">
              <motion.span
                animate={{ scale: [0.9, 1.2, 0.9], opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="block bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-300 shadow-sm"
              >
                FOCUS
              </motion.span>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
