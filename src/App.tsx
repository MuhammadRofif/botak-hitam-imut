/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Subject, Material, UserStats, Badge } from './types';
import { DEFAULT_SUBJECTS, DEFAULT_MATERIALS, ALL_BADGES } from './data/defaultData';
import MateriDashboard from './components/MateriDashboard';
import Minigames from './components/Minigames';
import FocusMode from './components/FocusMode';
import StatsBadges from './components/StatsBadges';
import ScheduleChecklists from './components/ScheduleChecklists';
import Mascot from './components/Mascot';
import { BookOpen, Gamepad2, Timer, Award, Sparkles, Flame, Volume2, ShieldAlert, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  isSupabaseConfigured,
  getSupabaseSubjects,
  getSupabaseMaterials,
  getSupabaseUserStats,
  saveSupabaseSubject,
  saveSupabaseMaterial,
  saveSupabaseUserStats,
  seedLocalStorageToSupabase
} from './lib/supabase';

export default function App() {
  // --- CORE STATE ---
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('aplikasi-skrining');
  const [stats, setStats] = useState<UserStats>({
    xp: 0,
    level: 1,
    streak: 0,
    lastStudyDate: null,
    badges: [],
    totalQuizzesPlayed: 0,
    totalCorrectAnswers: 0,
    totalGamesPlayed: 0,
    pomodoroStudyMinutes: 0
  });

  // DB Link Connection Status: 'connected' | 'local_only' | 'loading' | 'error'
  const [dbStatus, setDbStatus] = useState<'connected' | 'local_only' | 'loading' | 'error'>('loading');

  // Navigation tab: 'dashboard' | 'games' | 'focus' | 'stats' | 'jadwal'
  const [activeNav, setActiveNav] = useState<'dashboard' | 'games' | 'focus' | 'stats' | 'jadwal'>('jadwal');

  // Achievement Celebration Overlay State
  const [unlockedBadgeCelebration, setUnlockedBadgeCelebration] = useState<Badge | null>(null);

  // Load state from Supabase or Fallback LocalStorage on mount
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        // 1. Instantly parse from LocalStorage to achieve zero-layout-shift preview
        const storedSubjects = localStorage.getItem('uas_subjects');
        const storedMaterials = localStorage.getItem('uas_materials');
        const storedStats = localStorage.getItem('uas_user_stats');

        let initialSubjects = DEFAULT_SUBJECTS;
        let initialMaterials = DEFAULT_MATERIALS;
        let initialStats: UserStats = {
          xp: 0,
          level: 1,
          streak: 1, // Start streak on day 1
          lastStudyDate: new Date().toISOString().split('T')[0],
          badges: ['first-step'], // unlock Petualang Pertama initially
          totalQuizzesPlayed: 0,
          totalCorrectAnswers: 0,
          totalGamesPlayed: 0,
          pomodoroStudyMinutes: 0
        };

        if (storedSubjects) initialSubjects = JSON.parse(storedSubjects);
        if (storedMaterials) initialMaterials = JSON.parse(storedMaterials);
        if (storedStats) initialStats = JSON.parse(storedStats);

        // Pre-fill immediately
        setSubjects(initialSubjects);
        setMaterials(initialMaterials);
        setStats(initialStats);

        if (isSupabaseConfigured) {
          setDbStatus('loading');
          
          // Fetch remote datasets
          const sbSubjects = await getSupabaseSubjects();
          const sbMaterials = await getSupabaseMaterials();
          const sbStats = await getSupabaseUserStats();

          if (sbSubjects !== null && sbMaterials !== null) {
            // If the database is completely empty (new Supabase connection),
            // seed the configuration using current client storage states!
            if (sbSubjects.length === 0 && sbMaterials.length === 0) {
              const seeded = await seedLocalStorageToSupabase(initialSubjects, initialMaterials, initialStats);
              if (seeded) {
                setDbStatus('connected');
              } else {
                setDbStatus('error');
              }
            } else {
              // Remote tables have existing values; load them and refresh local caches
              setSubjects(sbSubjects);
              setMaterials(sbMaterials);
              localStorage.setItem('uas_subjects', JSON.stringify(sbSubjects));
              localStorage.setItem('uas_materials', JSON.stringify(sbMaterials));

              if (sbStats) {
                setStats(sbStats);
                localStorage.setItem('uas_user_stats', JSON.stringify(sbStats));
              }
              setDbStatus('connected');
            }
          } else {
            setDbStatus('error');
          }
        } else {
          setDbStatus('local_only');
          // If local storage didn't exist, set initial default values
          if (!storedSubjects || !storedMaterials) {
            localStorage.setItem('uas_subjects', JSON.stringify(DEFAULT_SUBJECTS));
            localStorage.setItem('uas_materials', JSON.stringify(DEFAULT_MATERIALS));
          }
          if (!storedStats) {
            localStorage.setItem('uas_user_stats', JSON.stringify(initialStats));
          }
        }
      } catch (e) {
        console.error('Initialization failure:', e);
        setDbStatus('error');
      }
    };

    initializeDatabase();
  }, []);

  // Listen for programmatic tab layout changes (e.g. from the schedule shortcuts)
  useEffect(() => {
    const handleTabChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setActiveNav(customEvent.detail);
      }
    };
    window.addEventListener('change_nav_tab', handleTabChange);
    return () => {
      window.removeEventListener('change_nav_tab', handleTabChange);
    };
  }, []);

  // Save changes to LocalStorage and Supabase whenever state modifies
  const saveStatsToLocalStorage = async (updatedStats: UserStats) => {
    setStats(updatedStats);
    localStorage.setItem('uas_user_stats', JSON.stringify(updatedStats));
    
    if (isSupabaseConfigured) {
      await saveSupabaseUserStats(updatedStats);
    }
    
    // Proactively check if new badges are unlockable
    checkAndUnlockBadges(updatedStats);
  };

  // --- ACTIONS & MUTATORS ---

  // Add Subject
  const handleAddSubject = async (newSubject: Subject) => {
    const updated = [newSubject, ...subjects];
    setSubjects(updated);
    localStorage.setItem('uas_subjects', JSON.stringify(updated));
    
    if (isSupabaseConfigured) {
      await saveSupabaseSubject(newSubject);
    }
    
    // Reward XP
    addXp(20, `Membuat mata pelajaran baru: ${newSubject.name}! 📚`);
  };

  // Add Material
  const handleAddMaterial = async (newMaterial: Material) => {
    const updated = [newMaterial, ...materials];
    setMaterials(updated);
    localStorage.setItem('uas_materials', JSON.stringify(updated));

    if (isSupabaseConfigured) {
      await saveSupabaseMaterial(newMaterial);
    }

    // Update user stats material count trigger XP
    addXp(35, `Berhasil mencatat rangkuman materi baru: "${newMaterial.title}"! 🎉`);
  };

  // Sound Synth for Celebration
  const playMilestoneSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C major pentatonic celebration
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.1);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.1);
        osc.stop(ctx.currentTime + i * 0.1 + 0.5);
      });
    } catch(e) {}
  };

  // XP addition engine with level up calculations
  const addXp = (amount: number, reason: string) => {
    const currentStats = { ...stats };
    let newXp = currentStats.xp + amount;
    let newLevel = currentStats.level;
    
    // Level up thresholds: Level * 120 XP
    let xpNeeded = newLevel * 120;
    let leveledUp = false;

    while (newXp >= xpNeeded) {
      newXp -= xpNeeded;
      newLevel += 1;
      xpNeeded = newLevel * 120;
      leveledUp = true;
    }

    const updatedStats: UserStats = {
      ...currentStats,
      xp: newXp,
      level: newLevel,
      // Track last active date
      lastStudyDate: new Date().toISOString().split('T')[0]
    };

    if (leveledUp) {
      playMilestoneSound();
      // Show short pop alert of Level up
      setTimeout(() => {
        alert(`🎉 SELAMAT! Endut naik ke Level ${newLevel}! Kemampuan belajarmu semakin mengesankan! Keep up the great work. ✨`);
      }, 500);
    }

    saveStatsToLocalStorage(updatedStats);
  };

  // Mini games increments
  const handleIncrementGamesPlayed = () => {
    const updatedStats: UserStats = {
      ...stats,
      totalGamesPlayed: stats.totalGamesPlayed + 1
    };
    saveStatsToLocalStorage(updatedStats);
  };

  const handleIncrementQuizzesPlayed = (isAllCorrect: boolean) => {
    const updatedStats: UserStats = {
      ...stats,
      totalQuizzesPlayed: stats.totalQuizzesPlayed + 1
    };
    saveStatsToLocalStorage(updatedStats);
  };

  const handleIncrementCorrectAnswersCount = (amount: number) => {
    const updatedStats: UserStats = {
      ...stats,
      totalCorrectAnswers: stats.totalCorrectAnswers + amount
    };
    saveStatsToLocalStorage(updatedStats);
  };

  const handleFocusComplete = (minutes: number) => {
    const updatedStats: UserStats = {
      ...stats,
      pomodoroStudyMinutes: stats.pomodoroStudyMinutes + minutes
    };
    saveStatsToLocalStorage(updatedStats);
  };

  // --- STREAK CALCULATOR ON RUN TIME ---
  useEffect(() => {
    if (stats.lastStudyDate) {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      if (stats.lastStudyDate === yesterday) {
        // Increment streak since user studied yesterday too!
        const updatedStats: UserStats = {
          ...stats,
          streak: stats.streak + 1,
          lastStudyDate: today
        };
        saveStatsToLocalStorage(updatedStats);
      } else if (stats.lastStudyDate !== today) {
        // Reset streak to 1 since they skipped a day
        const updatedStats: UserStats = {
          ...stats,
          streak: 1,
          lastStudyDate: today
        };
        saveStatsToLocalStorage(updatedStats);
      }
    }
  }, [stats.lastStudyDate]);

  // --- COGNITIVE BADGE UNLOCK CHECKER ---
  const checkAndUnlockBadges = (currentStats: UserStats) => {
    const userBadges = [...currentStats.badges];
    let newlyUnlocked: Badge | null = null;

    ALL_BADGES.forEach((badge) => {
      if (userBadges.includes(badge.id)) return; // already unlocked

      let shouldUnlock = false;

      switch (badge.id) {
        case 'material-creator':
          // Created at least 1 custom material over the prebuilt 4
          if (materials.length > 4) shouldUnlock = true;
          break;
        case 'quiz-master':
          // Correct answer is equal/perfect inside stats
          if (currentStats.totalCorrectAnswers >= 5) shouldUnlock = true;
          break;
        case 'xp-warrior':
          // Acc XP exceeds 150
          if (currentStats.level > 1 || currentStats.xp >= 150) shouldUnlock = true;
          break;
        case 'focus-expert':
          // Finished at least 5 mins
          if (currentStats.pomodoroStudyMinutes >= 5) shouldUnlock = true;
          break;
        case 'streak-keeper':
          // streak >= 2 days
          if (currentStats.streak >= 2) shouldUnlock = true;
          break;
        case 'game-champion':
          // Played games
          if (currentStats.totalGamesPlayed >= 1) shouldUnlock = true;
          break;
        case 'level-up-pioneer':
          // Reach level 3
          if (currentStats.level >= 3) shouldUnlock = true;
          break;
        default:
          break;
      }

      if (shouldUnlock) {
        userBadges.push(badge.id);
        newlyUnlocked = badge;
      }
    });

    if (newlyUnlocked) {
      // Trigger celebration!
      playMilestoneSound();
      setUnlockedBadgeCelebration(newlyUnlocked);
      
      // Update actual db state
      const nextStats = {
        ...currentStats,
        badges: userBadges
      };
      setStats(nextStats);
      localStorage.setItem('uas_user_stats', JSON.stringify(nextStats));
      
      if (isSupabaseConfigured) {
        saveSupabaseUserStats(nextStats).catch(console.error);
      }
    }
  };

  // Hard Reset All Data (Clear Progress)
  const handleResetAllData = async () => {
    const confirmed = confirm('Apakah Endut yakin ingin mereset seluruh progress belajarmu? Semua materi yang Endut buat akan ikut terhapus.');
    if (!confirmed) return;

    localStorage.removeItem('uas_subjects');
    localStorage.removeItem('uas_materials');
    localStorage.removeItem('uas_user_stats');
    
    // Reload state
    setSubjects(DEFAULT_SUBJECTS);
    setMaterials(DEFAULT_MATERIALS);
    setSelectedSubjectId('aplikasi-skrining');
    
    const initialStats: UserStats = {
      xp: 0,
      level: 1,
      streak: 1,
      lastStudyDate: new Date().toISOString().split('T')[0],
      badges: ['first-step'],
      totalQuizzesPlayed: 0,
      totalCorrectAnswers: 0,
      totalGamesPlayed: 0,
      pomodoroStudyMinutes: 0
    };
    setStats(initialStats);
    setActiveNav('jadwal');

    if (isSupabaseConfigured) {
      setDbStatus('loading');
      try {
        await seedLocalStorageToSupabase(DEFAULT_SUBJECTS, DEFAULT_MATERIALS, initialStats);
        setDbStatus('connected');
      } catch (err) {
        setDbStatus('error');
      }
    }
    
    alert('Progress belajarmu telah diatur kembali ke kondisi awal (default) dengan sukses!');
  };

  return (
    <div className="min-h-screen bg-[#FFFDF0] text-[#6D6875] pb-20 selection:bg-[#FFB7B2] selection:text-[#6D6875]">
      {/* 1. APP HERO HEADER BRAND */}
      <header className="bg-white border-b-4 border-[#FF9AA2] py-4 px-6 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Glowing mascot logo & app name */}
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-2xl bg-[#FFB7B2] border-2 border-[#6D6875] flex items-center justify-center shadow-[3px_3px_0px_#6D6875]">
              <span className="text-2xl animate-bounce">🧑‍🦲</span>
              <div className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-[#FF9AA2] border-2 border-white animate-pulse"></div>
            </div>
            
            <div>
              <h1 className="text-xl font-sans font-black text-[#FF9AA2] tracking-tight flex items-center gap-2">
                Botak Hitam Imut <span className="text-xs bg-[#B5EAD7] text-[#6D6875] px-2 py-0.5 rounded-full font-bold">Ver. Gembira</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-sans leading-tight">
                Menyulap rintangan UAS menjadi Arena Bermain yang Mengasyikkan!
              </p>
            </div>
          </div>

          {/* Quick Header Mini Status Indicator & DB Badge */}
          <div className="flex items-center gap-3">
            {/* Supabase / Local Storage Sync Badge */}
            <div
              title={
                dbStatus === 'connected'
                  ? 'Tersinkronisasi secara real-time dengan Supabase database!'
                  : dbStatus === 'local_only'
                  ? 'Menggunakan penyimpanan LocalStorage offline.'
                  : dbStatus === 'loading'
                  ? 'Sedang mengunduh/menyinkronkan data...'
                  : 'Gagal menghubungkan ke Supabase. Kembali ke local cache.'
              }
              className={`border-2 rounded-xl px-2.5 py-1 text-center shadow-[2px_2px_0px_#6D6875] text-[10px] font-black flex items-center gap-1.5 transition-all ${
                dbStatus === 'connected'
                  ? 'bg-[#B5EAD7] border-[#6D6875] text-[#6D6875]'
                  : dbStatus === 'loading'
                  ? 'bg-[#C7CEEA]/40 border-[#6D6875] text-[#6D6875] animate-pulse'
                  : dbStatus === 'local_only'
                  ? 'bg-amber-100 border-[#6D6875] text-[#6D6875]'
                  : 'bg-red-100 border-red-500 text-red-700'
              }`}
            >
              <span className="text-xs">
                {dbStatus === 'connected' ? '☁️' : dbStatus === 'local_only' ? '💾' : dbStatus === 'loading' ? '⌛' : '⚠️'}
              </span>
              <span>
                {dbStatus === 'connected'
                  ? 'CLOUD'
                  : dbStatus === 'local_only'
                  ? 'LOKAL'
                  : dbStatus === 'loading'
                  ? 'SYNC...'
                  : 'ERROR'}
              </span>
            </div>

            {/* Level bubble */}
            <div className="bg-[#E2F0CB] border-2 border-[#6D6875] rounded-xl px-3 py-1 text-center shadow-[2px_2px_0px_#6D6875]">
              <span className="text-[10px] font-black text-[#6D6875] uppercase block leading-none">TINGKAT</span>
              <span className="text-xs font-black text-[#6D6875]">Lvl {stats.level}</span>
            </div>

            {/* XP Bubble bar progress */}
            <div className="bg-[#FFDAC1] border-2 border-[#6D6875] rounded-xl px-3 py-1 text-center shadow-[2px_2px_0px_#6D6875]">
              <span className="text-[10px] font-black text-[#6D6875] uppercase block leading-none">XP</span>
              <span className="text-xs font-black text-[#6D6875]">{stats.xp} XP</span>
            </div>

            {/* Streak flame badge */}
            <div className={`border-2 rounded-xl px-3 py-1 text-center flex items-center gap-1.5 shadow-[2px_2px_0px_#6D6875] ${
              stats.streak > 0
                ? 'bg-[#FF9AA2]/20 border-[#6D6875] text-[#6D6875] animate-pulse'
                : 'bg-white border-[#6D6875] text-slate-400'
            }`}>
              <Flame size={14} className={stats.streak > 0 ? 'fill-[#FF9AA2] stroke-[#6D6875]' : ''} />
              <div className="text-left">
                <span className="text-[9px] font-black block leading-none text-[#6D6875]">STREAK</span>
                <span className="text-xs font-black leading-none">{stats.streak} Hari</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN HUB CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 pt-8 md:pt-10">
        
        {/* Floating Sticker Mascot Greeting Board */}
        <div className="bg-white border-4 border-[#6D6875] rounded-3xl p-5 mb-8 shadow-[6px_6px_0px_#6D6875] relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
          <div className="absolute top-1 right-2 translate-x-2 -translate-y-2 opacity-5 pointer-events-none text-[#6D6875]">
            <BookOpen size={180} />
          </div>
          
          <div className="shrink-0">
            <Mascot
              mood={activeNav === 'focus' ? 'focus' : activeNav === 'games' ? 'happy' : 'idle'}
              size={120}
              speechBubble="Hai calon bintang kelas! 🌟 Sudah siap mengalahkan soal-soal UAS hari ini? Yuk pilih petualangan belajarmu!"
            />
          </div>

          <div className="space-y-2 text-center md:text-left max-w-xl">
            <h2 className="text-xl font-sans font-black text-[#6D6875]">
              Ujian Akhir Semester? Siapa Takut! 🧸
            </h2>
            <p className="text-xs text-[#6D6875]/90 leading-relaxed font-sans">
              Selamat datang di portal belajar persiapan UAS interaktif tercepat. Di sini, Endut bisa menginput materi ujianmu sendiri, mencetak flashcards canggih otomatis, menantang dirimu di ruang game puzzle, melatih pernapasan jernih di Mode Fokus Pomodoro, dan mengoleksi lencana piala sticker super imut!
            </p>
          </div>
        </div>

        {/* CUTE PILL-SHAPED FLOATING CONTAINER NAVIGATION BAR */}
        <nav className="flex justify-center mb-8">
          <div className="bg-white border-3 border-[#6D6875] p-1.5 rounded-2xl md:rounded-3xl shadow-[4px_4px_0px_#6D6875] flex flex-wrap gap-1.5 justify-center">
            <button
              onClick={() => setActiveNav('jadwal')}
              className={`px-4 py-2.5 rounded-xl md:rounded-2xl text-xs font-sans font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeNav === 'jadwal'
                  ? 'bg-[#E2F0CB] border-2 border-[#6D6875] text-[#6D6875] shadow-[2px_2px_0px_#6D6875] scale-[1.03]'
                  : 'text-[#6D6875] hover:bg-[#E2F0CB]/40'
              }`}
            >
              <Calendar size={16} /> 📅 Jadwal & Aturan
            </button>

            <button
              onClick={() => setActiveNav('dashboard')}
              className={`px-4 py-2.5 rounded-xl md:rounded-2xl text-xs font-sans font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeNav === 'dashboard'
                  ? 'bg-[#FF9AA2] border-2 border-[#6D6875] text-white shadow-[2px_2px_0px_#6D6875] scale-[1.03]'
                  : 'text-[#6D6875] hover:bg-[#E2F0CB]/40'
              }`}
            >
              <BookOpen size={16} /> 📚 Rangkuman Materi
            </button>

            <button
              onClick={() => setActiveNav('games')}
              className={`px-4 py-2.5 rounded-xl md:rounded-2xl text-xs font-sans font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeNav === 'games'
                  ? 'bg-[#C7CEEA] border-2 border-[#6D6875] text-[#6D6875] shadow-[2px_2px_0px_#6D6875] scale-[1.03]'
                  : 'text-[#6D6875] hover:bg-[#E2F0CB]/40'
              }`}
            >
              <Gamepad2 size={16} /> 🎮 Game Mengingat
            </button>

            <button
              onClick={() => setActiveNav('focus')}
              className={`px-4 py-2.5 rounded-xl md:rounded-2xl text-xs font-sans font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeNav === 'focus'
                  ? 'bg-[#B5EAD7] border-2 border-[#6D6875] text-[#6D6875] shadow-[2px_2px_0px_#6D6875] scale-[1.03]'
                  : 'text-[#6D6875] hover:bg-[#E2F0CB]/40'
              }`}
            >
              <Timer size={16} /> ⏱️ Mode Fokus
            </button>

            <button
              onClick={() => setActiveNav('stats')}
              className={`px-4 py-2.5 rounded-xl md:rounded-2xl text-xs font-sans font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeNav === 'stats'
                  ? 'bg-[#FFDAC1] border-2 border-[#6D6875] text-[#6D6875] shadow-[2px_2px_0px_#6D6875] scale-[1.03]'
                  : 'text-[#6D6875] hover:bg-[#E2F0CB]/40'
              }`}
            >
              <Award size={16} /> 🎖️ Kampiun & Lencana
            </button>
          </div>
        </nav>

        {/* 3. ACTIVE SCENE CONTENT VIEWER */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeNav}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {activeNav === 'jadwal' && (
              <ScheduleChecklists
                subjects={subjects}
                onSelectSubject={setSelectedSubjectId}
                onGoToMateri={() => setActiveNav('dashboard')}
              />
            )}

            {activeNav === 'dashboard' && (
              <MateriDashboard
                subjects={subjects}
                materials={materials}
                onAddMaterial={handleAddMaterial}
                onAddSubject={handleAddSubject}
                onSelectSubject={setSelectedSubjectId}
                selectedSubjectId={selectedSubjectId}
              />
            )}

            {activeNav === 'games' && (
              <Minigames
                currentSubjectId={selectedSubjectId}
                subjects={subjects}
                materials={materials}
                addXp={addXp}
                incrementGamesPlayed={handleIncrementGamesPlayed}
                incrementQuizzesPlayed={handleIncrementQuizzesPlayed}
                incrementCorrectAnswersCount={handleIncrementCorrectAnswersCount}
              />
            )}

            {activeNav === 'focus' && (
              <FocusMode
                onFocusComplete={handleFocusComplete}
                addXp={addXp}
              />
            )}

            {activeNav === 'stats' && (
              <StatsBadges
                stats={stats}
                onClearProgress={handleResetAllData}
                dbStatus={dbStatus}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* --- ACHIEVEMENT STICKER CELEBRATION MODAL OVERLAY --- */}
      <AnimatePresence>
        {unlockedBadgeCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm select-none"
          >
            <motion.div
              initial={{ scale: 0.8, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 40 }}
              className="bg-white border-4 border-slate-800 max-w-sm w-full p-6 rounded-3xl text-center shadow-[10px_10px_0px_0px_#1E293B] relative"
            >
              {/* Confetti sparkle background */}
              <div className="absolute inset-0 pointer-events-none opacity-20 text-3xl">
                <span className="absolute top-4 left-6 animate-pulse">🌟</span>
                <span className="absolute top-8 right-8 animate-bounce">✨</span>
                <span className="absolute bottom-6 left-10">💮</span>
                <span className="absolute bottom-10 right-4 animate-ping">🎨</span>
              </div>

              <div className="text-6xl mb-4 p-4 rounded-full bg-amber-50 border-3 border-amber-300 w-24 h-24 flex items-center justify-center mx-auto shadow-md">
                {unlockedBadgeCelebration.icon}
              </div>

              <span className="text-[10px] font-sans font-black tracking-widest text-[#B45309] uppercase bg-amber-100 px-3 py-1 rounded-full border border-amber-250">
                🎖️ NEW ACHIEVEMENT UNLOCKED! 🎖️
              </span>

              <h3 className="text-xl font-sans font-black text-slate-800 mt-4 mb-2">
                Piala "{unlockedBadgeCelebration.name}" Berhasil Diraih!
              </h3>
              
              <p className="text-xs text-slate-500 leading-relaxed px-4 mb-6">
                {unlockedBadgeCelebration.description}
                <br />
                <span className="text-[10px] font-mono font-bold text-slate-400 mt-2 block">
                  Syarat: {unlockedBadgeCelebration.requirement}
                </span>
              </p>

              <button
                onClick={() => setUnlockedBadgeCelebration(null)}
                className="w-full bg-[#10B981] hover:bg-[#059669] border-2.5 border-[#047857] text-white font-sans font-black text-xs py-3 rounded-2xl cursor-pointer shadow-[3px_3px_0px_0px_#065F46] transition-all"
              >
                Klaim & Tempel Sticker Lencana! 🏆
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer credits with clean design */}
      <footer className="mt-16 text-center text-xs text-slate-400 space-y-1 py-8 border-t border-slate-200/50">
        <p className="font-sans font-bold flex items-center justify-center gap-1">
          Made with 💖 as your ultimate UAS Study Buddy
        </p>
        <p className="font-sans text-[10.5px]">
          Nikmati metode belajar Active Recall & Spaced Repetition yang asyik bebas pusing!
        </p>
      </footer>
    </div>
  );
}
