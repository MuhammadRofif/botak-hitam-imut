/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import Mascot from './Mascot';
import { Play, Pause, RotateCcw, Volume2, Timer, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FocusModeProps {
  onFocusComplete: (minutes: number) => void;
  addXp: (amount: number, reason: string) => void;
}

export default function FocusMode({ onFocusComplete, addXp }: FocusModeProps) {
  // Timer options in minutes
  const TIMER_OPTIONS = [
    { label: '⚡ Kilat (1 m)', value: 1 },
    { label: '🌱 Santai (5 m)', value: 5 },
    { label: '🧸 Standar (15 m)', value: 15 },
    { label: '🔥 Mendalam (25 m)', value: 25 },
  ];

  const [selectedDuration, setSelectedDuration] = useState(5); // Default 5 minutes
  const [secondsLeft, setSecondsLeft] = useState(5 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [focusQuote, setFocusQuote] = useState('Mari matikan semua notifikasi HP dan mulailah belajar tenang bersama Bubu!');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Cute quotes list
  const QUOTES = [
    'Sssttt.. Bubu sedang membantumu mencatat poin-poin penting!',
    'Hirup nafas dalam-dalam.. Buang perlahan.. Kurangi panik UAS ya!',
    'Setiap menit fokus membawamu lebih dekat ke nilai impian!',
    'Kelincimu bangga sekali melihatmu tekun membaca materi ini.',
    'Satu lembar lagi, satu rumus lagi! Endut adalah bintang kecil hebat.',
    'Fokus menyala! Ayo letakkan segala rintangan dan mulailah mengingat.',
  ];

  // Rotate quotes during active timers
  useEffect(() => {
    if (isActive) {
      const quoteInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * QUOTES.length);
        setFocusQuote(QUOTES[randomIndex]);
      }, 15000);
      return () => clearInterval(quoteInterval);
    }
  }, [isActive]);

  // Handle timer countdown
  useEffect(() => {
    if (isActive && secondsLeft > 0) {
      timerRef.current = setTimeout(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      handleTimerComplete();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isActive, secondsLeft]);

  // Synchronize initial seconds when duration changes
  const handleDurationChange = (minutes: number) => {
    setIsActive(false);
    setSelectedDuration(minutes);
    setSecondsLeft(minutes * 60);
    setFocusQuote('Mari bersiap-siap untuk sesi konsentrasi penuh!');
  };

  // Sound Synthesizer using Web Audio API (Extremely clean, no external links!)
  const playSynthesisSound = (type: 'tick' | 'complete' | 'start') => {
    if (isMuted) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      if (type === 'start') {
        // Double sweet synthesizer tone
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(440, ctx.currentTime); // A4
        osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(220, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);

        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.5);
        osc2.stop(ctx.currentTime + 0.5);
      } else if (type === 'tick') {
        // High soft clock click
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.02, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'complete') {
        // Magical study success fanfare chime (C major arpeggio)
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

          gainNode.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.12);
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.5);

          osc.connect(gainNode);
          gainNode.connect(ctx.destination);

          osc.start(ctx.currentTime + idx * 0.12);
          osc.stop(ctx.currentTime + idx * 0.12 + 0.6);
        });
      }
    } catch (e) {
      console.warn('Web Audio API is blocked by frame interaction safeguards:', e);
    }
  };

  const handleStartPause = () => {
    if (!isActive) {
      playSynthesisSound('start');
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setSecondsLeft(selectedDuration * 60);
    setFocusQuote('Waktu diubah kembali ke awal. Siap kapanpun Endut mau memulai!');
  };

  const handleTimerComplete = () => {
    setIsActive(false);
    playSynthesisSound('complete');
    
    // Reward points for focused learning!
    const earnedXp = selectedDuration * 12; // 12 XP per focused minute
    addXp(earnedXp, `Berhasil menyelesaikan sesi belajar Mode Fokus selama ${selectedDuration} Menit! 🎉`);
    onFocusComplete(selectedDuration);
    
    setFocusQuote(`Yeay! Hebat sekali materi berhasil ditelaah dengan tenang selama ${selectedDuration} Menit! Ambil istirahat pendek dulu bersama Bubu.`);
    setSecondsLeft(selectedDuration * 60);
  };

  // Helper format seconds to mm:ss
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Play natural soft click clocks during timer active
  useEffect(() => {
    if (isActive && secondsLeft > 0) {
      // Tick every second
      playSynthesisSound('tick');
    }
  }, [secondsLeft, isActive]);

  return (
    <div className={`relative px-4 py-8 rounded-3xl border-3 border-[#6D6875] transition-all duration-300 overflow-hidden shadow-[8px_8px_0px_#6D6875] ${
      isActive
        ? 'bg-[#6D6875] text-white'
        : 'bg-white text-[#6D6875]'
    }`}>
      {/* Decorative Floating Sparkles on Focus Mode is active */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ y: [0, -100, 0], opacity: [0, 0.4, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
            className="absolute left-10 top-full text-indigo-300 text-lg"
          >
            ⭐
          </motion.div>
          <motion.div
            animate={{ y: [0, -120, 0], opacity: [0, 0.6, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: 'linear', delay: 2 }}
            className="absolute right-12 top-full text-pink-300 text-sm"
          >
            ✨
          </motion.div>
          <motion.div
            animate={{ y: [0, -150, 0], opacity: [0, 0.5, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: 'linear', delay: 4 }}
            className="absolute left-1/3 top-full text-amber-300 text-md"
          >
            📓
          </motion.div>
        </div>
      )}

      {/* Mode Title Header */}
      <div className="flex flex-col items-center text-center max-w-md mx-auto mb-6">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 border-[#6D6875] ${
          isActive
            ? 'bg-[#FFDAC1] text-[#6D6875]'
            : 'bg-[#E2F0CB] text-[#6D6875]'
        }`}>
          <Timer size={14} className="animate-spin-slow" />
          Mode Fokus (Pomodoro Ceria)
        </span>
        <h2 className="text-2xl font-sans font-black mt-2">
          {isActive ? '🤫 Sshh.. Sesi Fokus Dimulai' : '🧸 Belajar Tanpa Distraksi'}
        </h2>
        <p className={`text-xs mt-1.5 leading-relaxed ${isActive ? 'text-slate-400' : 'text-slate-500'}`}>
          Mode ini dirancang khusus agar mata terhindar dari lelah, menyembunyikan navigasi ramai, dan memberimu ketenangan saat membaca catatan penting.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center max-w-3xl mx-auto">
        {/* Left Side: Mascot reaction */}
        <div className="md:col-span-5 flex flex-col items-center">
          <Mascot
            mood={isActive ? 'focus' : secondsLeft === 0 ? 'happy' : 'sleeping'}
            size={140}
            speechBubble={focusQuote}
          />
        </div>

        {/* Right Side: Circular Timer view */}
        <div className="md:col-span-7 flex flex-col items-center">
          {/* Main big timer container */}
          <div className={`relative w-60 h-60 rounded-full border-4 flex flex-col items-center justify-center p-8 transition-all duration-300 shadow-md ${
            isActive
              ? 'bg-[#6D6875] border-white text-white shadow-none'
              : 'bg-white border-[#6D6875] text-[#6D6875] shadow-none'
          }`}>
            <span className="font-mono text-5xl font-black tracking-tight select-all">
              {formatTime(secondsLeft)}
            </span>
            <span className={`text-[10px] font-bold mt-1 uppercase tracking-widest ${isActive ? 'text-indigo-400' : 'text-indigo-500'}`}>
              {isActive ? '🔥 Berpikir tajam' : '⏸️ Jeda tenang'}
            </span>

            {/* Minute indicator bars */}
            <div className="absolute inset-4 rounded-full border-1 border-dashed border-slate-300 opacity-40"></div>
          </div>

          {/* Time Picker Controls if NOT active */}
          {!isActive && (
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {TIMER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleDurationChange(opt.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-sans font-bold border-2 transition-all cursor-pointer ${
                    selectedDuration === opt.value
                      ? 'bg-[#FF9AA2] border-[#6D6875] text-white shadow-[2px_2px_0px_#6D6875] scale-[1.03]'
                      : 'bg-white hover:bg-[#E2F0CB]/35 border-[#6D6875] text-[#6D6875]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Player controls */}
          <div className="mt-6 flex items-center gap-4">
            {/* Reset Button */}
            <button
              onClick={handleReset}
              className={`p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#6D6875]/20 border-[#6D6875] text-white/70 hover:text-white'
                  : 'bg-white hover:bg-slate-100 border-[#6D6875] text-[#6D6875]'
              }`}
              title="Reset Timer"
            >
              <RotateCcw size={18} />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={handleStartPause}
              className={`px-6 py-3 rounded-2xl font-sans font-extrabold text-sm flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_#6D6875] border-2 border-[#6D6875] transition-all scale-103 hover:scale-105 active:scale-97 ${
                isActive
                  ? 'bg-[#FF9AA2] text-white'
                  : 'bg-[#B5EAD7] text-[#6D6875]'
              }`}
            >
              {isActive ? (
                <>
                  <Pause size={18} fill="currentColor" /> Tahan Dulu
                </>
              ) : (
                <>
                  <Play size={18} fill="currentColor" /> Mulai Berkonsentrasi
                </>
              )}
            </button>

            {/* Mute button */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#6D6875]/20 border-[#6D6875] text-white/70'
                  : 'bg-white hover:bg-slate-100 border-[#6D6875] text-[#6D6875]'
              }`}
              title={isMuted ? 'Nyalakan Suara Chime' : 'Matikan Suara Chime'}
            >
              <Volume2 size={18} className={isMuted ? 'line-through opacity-40' : 'opacity-100'} />
            </button>
          </div>
        </div>
      </div>

      {/* Focus guide tip */}
      <div className={`mt-8 max-w-xl mx-auto border-2 border-[#6D6875] rounded-2xl p-4 text-center text-xs leading-relaxed ${
        isActive
          ? 'bg-[#6D6875]/20 text-white/90'
          : 'bg-white text-[#6D6875]'
      }`}>
        <p className="font-bold flex items-center justify-center gap-1.5 mb-1 text-xs">
          <Sparkles size={14} className="text-amber-400" /> Tahukah Endut? Spaced Repetition & Fokus
        </p>
        Belajar intensif selama 5-25 menit yang diimbangi istirahat 5 menit terbukti mempercepat otak menyerap pelajaran baru 3x lipat dibanding belajar SKS (Sistem Kebut Semalam) menjelang UAS!
      </div>
    </div>
  );
}
