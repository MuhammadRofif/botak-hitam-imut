/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface MascotProps {
  mood?: 'idle' | 'happy' | 'thinking' | 'correct' | 'wrong' | 'sleeping' | 'focus';
  size?: number;
  speechBubble?: string;
}

export default function Mascot({ mood = 'idle', size = 160, speechBubble }: MascotProps) {
  const [isBlinking, setIsBlinking] = useState(false);
  
  // Custom theme colors for "Botak Hitam Imut"
  const skinColor = '#3A3644'; // Rich cozy charcoal/black skin
  const strokeColor = '#FFFDF0'; // Crisp white outline for outstanding visual contrast

  // Trigger natural blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Mascot colors and variations based on mood
  const getCheekColor = () => {
    if (mood === 'wrong') return '#F43F5E'; // Redder
    if (mood === 'sleeping') return '#93C5FD'; // Blueish sleeping glow
    return '#FDA4AF'; // Rose pastel
  };

  const getMouthShape = () => {
    switch (mood) {
      case 'happy':
      case 'correct':
        // Big happy mouth wide open
        return (
          <path
            d="M 45 62 Q 50 72 55 62 Z"
            fill="#E11D48"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
        );
      case 'wrong':
        // Sad wavy or inverted arch mouth
        return (
          <path
            d="M 45 65 Q 50 60 55 65"
            fill="none"
            stroke={strokeColor}
            strokeWidth="3"
            strokeLinecap="round"
          />
        );
      case 'sleeping':
        // Cute sleeping "o" mouth or line
        return (
          <circle
            cx="50"
            cy="63"
            r="3"
            fill="none"
            stroke={strokeColor}
            strokeWidth="2"
          />
        );
      case 'thinking':
        // Straight line or sideways dot
        return (
          <path
            d="M 46 63 L 54 63"
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        );
      case 'focus':
        // Small determined line
        return (
          <path
            d="M 47 62 Q 50 65 53 62"
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        );
      case 'idle':
      default:
        // Kawaii cat mouth
        return (
          <path
            d="M 44 62 Q 47 65 50 62 Q 53 65 56 62"
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center select-none" style={{ minHeight: `${size + 40}px` }}>
      {/* Balloon Speech Bubble if provided */}
      {speechBubble && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative mb-3 max-w-[200px] border-3 border-[#6D6875] bg-white px-3 py-2 text-center text-xs font-bold text-[#6D6875] rounded-2xl shadow-[4px_4px_0px_#6D6875]"
        >
          {speechBubble}
          <div className="absolute -bottom-2.5 left-1/2 h-0 w-0 -translate-x-1/2 border-x-8 border-t-[10px] border-x-transparent border-t-[#6D6875]"></div>
          <div className="absolute -bottom-1.5 left-1/2 h-0 w-0 -translate-x-1/2 border-x-6 border-t-[8px] border-x-transparent border-t-white"></div>
        </motion.div>
      )}

      {/* Main Mascot body */}
      <motion.div
        animate={
          mood === 'sleeping'
            ? { y: [0, 4, 0], scale: [1, 0.98, 1] }
            : mood === 'happy' || mood === 'correct'
            ? { y: [0, -12, 0], rotate: [0, -4, 4, 0] }
            : { y: [0, -4, 0] }
        }
        transition={
          mood === 'sleeping'
            ? { repeat: Infinity, duration: 3, ease: 'easeInOut' }
            : mood === 'happy' || mood === 'correct'
            ? { repeat: 2, duration: 0.6, ease: 'easeOut' }
            : { repeat: Infinity, duration: 4, ease: 'easeInOut' }
        }
        style={{ width: size, height: size }}
        className="cursor-pointer"
      >
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* DEFINITIONS & PATTERNS */}
          <defs>
            {/* Soft shadow for the mascot base */}
            <radialGradient id="shadowGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1E293B" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#1E293B" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* BASE SHADOW */}
          <ellipse cx="50" cy="95" rx="30" ry="4" fill="url(#shadowGlow)" />

          {/* NO EARS -> HE IS CUTE, SLEEK & BALD ("BOTAK") */}

          {/* MAIN BODY / HEAD - Colored charcoal black skin */}
          <rect
            x="15"
            y="25"
            width="70"
            height="62"
            rx="30"
            ry="26"
            fill={skinColor}
            stroke={strokeColor}
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* CUTE CHEEKS */}
          {/* Left Cheek */}
          <motion.ellipse
            cx="27"
            cy="65"
            rx="6"
            ry="4"
            fill={getCheekColor()}
            animate={mood === 'sleeping' ? { opacity: [0.5, 0.9, 0.5] } : { opacity: 0.8 }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          {/* Right Cheek */}
          <motion.ellipse
            cx="73"
            cy="65"
            rx="6"
            ry="4"
            fill={getCheekColor()}
            animate={mood === 'sleeping' ? { opacity: [0.5, 0.9, 0.5] } : { opacity: 0.8 }}
            transition={{ repeat: Infinity, duration: 2 }}
          />

          {/* EYES */}
          {/* Left Eye */}
          <g>
            {isBlinking || mood === 'sleeping' ? (
              // Closed blinking/sleeping eye
              <path
                d="M 26 55 Q 32 59 38 55"
                fill="none"
                stroke={strokeColor}
                strokeWidth="3"
                strokeLinecap="round"
              />
            ) : mood === 'wrong' ? (
              // Dizzy/Sad/Wrong 'x' eye
              <g>
                <path d="M 28 51 L 36 59" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
                <path d="M 36 51 L 28 59" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
              </g>
            ) : mood === 'happy' || mood === 'correct' ? (
              // Ecstatic happy eye (inverted arch)
              <path
                d="M 26 57 Q 32 49 38 57"
                fill="none"
                stroke={strokeColor}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            ) : mood === 'focus' ? (
              // Determined narrow eyes
              <g>
                <path d="M 26 53 L 38 53" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
                <circle cx="32" cy="55" r="2.5" fill={strokeColor} />
              </g>
            ) : (
              // Standard Sparkly Kawaii Eye - highlights matching skin tone
              <g>
                <circle cx="32" cy="54" r="5" fill={strokeColor} />
                <circle cx="30.5" cy="51.5" r="1.8" fill={skinColor} />
                <circle cx="33.5" cy="55.5" r="0.8" fill={skinColor} />
              </g>
            )}
          </g>

          {/* Right Eye */}
          <g>
            {isBlinking || mood === 'sleeping' ? (
              // Closed blinking/sleeping eye
              <path
                d="M 62 55 Q 68 59 74 55"
                fill="none"
                stroke={strokeColor}
                strokeWidth="3"
                strokeLinecap="round"
              />
            ) : mood === 'wrong' ? (
              // Dizzy/Sad/Wrong 'x' eye
              <g>
                <path d="M 64 51 L 72 59" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
                <path d="M 72 51 L 64 59" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
              </g>
            ) : mood === 'happy' || mood === 'correct' ? (
              // Ecstatic happy eye
              <path
                d="M 62 57 Q 68 49 74 57"
                fill="none"
                stroke={strokeColor}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            ) : mood === 'focus' ? (
              // Determined narrow eyes
              <g>
                <path d="M 62 53 L 74 53" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
                <circle cx="68" cy="55" r="2.5" fill={strokeColor} />
              </g>
            ) : (
              // Standard Sparkly Kawaii Eye - highlights matching skin tone
              <g>
                <circle cx="68" cy="54" r="5" fill={strokeColor} />
                <circle cx="66.5" cy="51.5" r="1.8" fill={skinColor} />
                <circle cx="69.5" cy="55.5" r="0.8" fill={skinColor} />
              </g>
            )}
          </g>

          {/* NOSE */}
          <polygon
            points="48,58 52,58 50,60"
            fill="#FDA4AF"
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* MOUTH */}
          {getMouthShape()}

          {/* INTELLIGENT GLASSES (always wearing cute thin yellow study glasses for adorable look) */}
          <g>
            {/* Left rim */}
            <circle
              cx="32"
              cy="54"
              r="10"
              fill="none"
              stroke="#D97706" // Amber study glass
              strokeWidth="2.5"
            />
            {/* Right rim */}
            <circle
              cx="68"
              cy="54"
              r="10"
              fill="none"
              stroke="#D97706"
              strokeWidth="2.5"
            />
            {/* Glasses bridge */}
            <path
              d="M 42 54 L 58 54"
              fill="none"
              stroke="#D97706"
              strokeWidth="2.5"
            />
          </g>

          {/* SIGNATURE STUDY GRADUATION CAP */}
          <g>
            {mood === 'correct' || mood === 'happy' ? (
              // Small yellow cute star pin wiggling
              <motion.path
                d="M 80 28 L 83 31"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            ) : null}

            {/* Tiny cute purple graduation cap on the side */}
            <path
              d="M 40 22 L 55 17 L 60 22 L 45 27 Z"
              fill="#6366F1"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Cap base */}
            <path
              d="M 46 22 L 46 25 Q 50 28 54 25 L 54 22"
              fill="#4F46E5"
              stroke={strokeColor}
              strokeWidth="2"
            />
            {/* Cap tassel */}
            <path
              d="M 50 20 L 59 28 L 59 31"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>

          {/* HANDS HOLDING A CUTE PASTEL LEARNING NOTEBOOK */}
          <g>
            {mood === 'sleeping' ? (
              // Sleep posture: hands under chin
              <g>
                <ellipse cx="40" cy="81" rx="4" ry="3" fill={skinColor} stroke={strokeColor} strokeWidth="2" />
                <ellipse cx="60" cy="81" rx="4" ry="3" fill={skinColor} stroke={strokeColor} strokeWidth="2" />
              </g>
            ) : mood === 'correct' ? (
              // Raised paws of achievement!
              <g>
                <motion.ellipse
                  cx="24"
                  cy="70"
                  rx="4.5"
                  ry="4.5"
                  fill={skinColor}
                  stroke={strokeColor}
                  strokeWidth="2"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                />
                <motion.ellipse
                  cx="76"
                  cy="70"
                  rx="4.5"
                  ry="4.5"
                  fill={skinColor}
                  stroke={strokeColor}
                  strokeWidth="2"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                />
              </g>
            ) : (
              // Default holding an educational book
              <g>
                {/* Book background */}
                <rect
                  x="36"
                  y="74"
                  width="28"
                  height="16"
                  rx="4"
                  fill="#F472B6" // cute pink book
                  stroke={strokeColor}
                  strokeWidth="1.5"
                />
                {/* Cute Pages lines inside book */}
                <line x1="40" y1="78" x2="48" y2="78" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="40" y1="82" x2="46" y2="82" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="40" y1="86" x2="49" y2="86" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="52" y1="78" x2="60" y2="78" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="52" y1="82" x2="58" y2="82" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="52" y1="86" x2="60" y2="86" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />

                {/* Left paw clutching book */}
                <ellipse cx="34" cy="81" rx="4" ry="4" fill={skinColor} stroke={strokeColor} strokeWidth="1.5" />
                {/* Right paw clutching book */}
                <ellipse cx="66" cy="81" rx="4" ry="4" fill={skinColor} stroke={strokeColor} strokeWidth="1.5" />
              </g>
            )}
          </g>
        </svg>
      </motion.div>
    </div>
  );
}
