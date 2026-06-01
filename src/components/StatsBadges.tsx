/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserStats, Badge } from '../types';
import { ALL_BADGES } from '../data/defaultData';
import { Award, Zap, Trophy, Calendar, CheckCircle2, Heart } from 'lucide-react';
import { motion } from 'motion/react';

interface StatsBadgesProps {
  stats: UserStats;
  onClearProgress: () => void;
  dbStatus: 'connected' | 'local_only' | 'loading' | 'error';
}

export default function StatsBadges({ stats, onClearProgress, dbStatus }: StatsBadgesProps) {
  // Let's calculate requirements for next level
  // Level up curve: level * 120 XP
  const xpNeededForNextLevel = stats.level * 120;
  const xpProgressPercentage = Math.min(100, Math.floor((stats.xp / xpNeededForNextLevel) * 100));

  return (
    <div className="space-y-6">
      {/* Overview Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Level & XP */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-amber-50 border-3 border-[#6D6875] rounded-3xl p-5 shadow-[4px_4px_0px_#6D6875] relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 translate-x-2 -translate-y-2 opacity-10">
            <Trophy size={110} />
          </div>

          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 bg-[#FFDAC1] text-[#6D6875] rounded-2xl border-2 border-[#6D6875] shadow-[2px_2px_0px_#6D6875]">
              <Trophy size={20} className="stroke-[2.5]" />
            </span>
            <span className="font-sans font-bold text-lg text-amber-800">Tingkat Kemampuan</span>
          </div>

          <div className="mb-4">
            <div className="text-4xl font-sans font-black text-amber-600 flex items-baseline gap-2">
              Lvl {stats.level}
              <span className="text-xs font-mono text-amber-700 bg-amber-200/50 px-2.5 py-0.5 rounded-full">
                Pemula Cerdas
              </span>
            </div>
            <p className="text-xs text-amber-700 mt-1 font-sans">
              Belajar setiap hari untuk membuka lencana eksklusif lainnya!
            </p>
          </div>

          {/* XP Progress Bar */}
          <div>
            <div className="flex justify-between text-xs font-mono font-bold text-amber-800 mb-1.5">
              <span>XP: {stats.xp} / {xpNeededForNextLevel}</span>
              <span>{xpProgressPercentage}%</span>
            </div>
            <div className="w-full bg-amber-200 border-2.5 border-amber-600 rounded-full h-5 overflow-hidden p-0.5 shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgressPercentage}%` }}
                className="bg-amber-500 h-full rounded-full flex justify-end items-center pr-2"
                transition={{ duration: 1, ease: 'easeOut' }}
              >
                <span className="text-[9px] font-mono font-black text-white px-1">✨</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Streak & Activity */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-rose-50 border-3 border-[#6D6875] rounded-3xl p-5 shadow-[4px_4px_0px_#6D6875] relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 translate-x-3 -translate-y-2 opacity-10">
            <Zap size={110} />
          </div>

          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 bg-[#FF9AA2] text-white rounded-2xl border-2 border-[#6D6875] shadow-[2px_2px_0px_#6D6875]">
              <Zap size={20} className="stroke-[2.5]" />
            </span>
            <span className="font-sans font-bold text-lg text-rose-800">Streak Belajar</span>
          </div>

          <div className="mb-4">
            <div className="text-4xl font-sans font-black text-rose-600 flex items-baseline gap-1.5">
              🔥 {stats.streak} <span className="text-lg font-sans font-bold text-rose-500">Hari</span>
            </div>
            <p className="text-xs text-rose-700 mt-1.5 font-sans">
              {stats.streak > 0
                ? 'Luar biasa! Pertahankan semangat belajarmu, jangan padam ya!'
                : 'Mulai belajarmu hari ini untuk memulai rantai semangat menyala! (streak)'}
            </p>
          </div>

          <div className="flex gap-1.5 pt-1">
            {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day, idx) => {
              // Highlight some mock active days for visualization based on current streak
              const isActive = stats.streak > 0 && idx < Math.min(stats.streak, 7);
              return (
                <div
                  key={day}
                  className={`flex-1 text-center py-1 rounded-lg border-2 text-[10px] font-bold ${
                    isActive
                      ? 'bg-rose-500 border-rose-700 text-white'
                      : 'bg-rose-100 border-rose-300 text-rose-400'
                  }`}
                >
                  <div>{day}</div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Card 3: Statistik Belajar */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-purple-50 border-3 border-[#6D6875] rounded-3xl p-5 shadow-[4px_4px_0px_#6D6875] relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 translate-x-3 -translate-y-2 opacity-10">
            <Award size={110} />
          </div>

          <div className="flex items-center gap-3 mb-2.5">
            <span className="p-2 bg-[#C7CEEA] text-[#6D6875] rounded-2xl border-2 border-[#6D6875] shadow-[2px_2px_0px_#6D6875]">
              <Award size={20} className="stroke-[2.5]" />
            </span>
            <span className="font-sans font-bold text-lg text-purple-800">Akademik Buku</span>
          </div>

          <div className="space-y-2 font-sans font-semibold text-xs text-purple-900 mt-3">
            <div className="flex justify-between items-center bg-white/70 border-2 border-purple-200 rounded-xl px-3 py-1.5">
              <span>🎮 Mini Games:</span>
              <span className="font-bold text-purple-700">{stats.totalGamesPlayed}x</span>
            </div>
            <div className="flex justify-between items-center bg-white/70 border-2 border-purple-200 rounded-xl px-3 py-1.5">
              <span>✍️ Kuis Selesai:</span>
              <span className="font-bold text-purple-700">{stats.totalQuizzesPlayed}x</span>
            </div>
            <div className="flex justify-between items-center bg-white/70 border-2 border-purple-200 rounded-xl px-3 py-1.5">
              <span>🎯 Jawaban Benar:</span>
              <span className="font-bold text-purple-700">{stats.totalCorrectAnswers} Soal</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lencana Penghargaan (Badges Grid) */}
      <div className="bg-white border-3 border-[#6D6875] rounded-3xl p-6 shadow-[6px_6px_0px_#6D6875]">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl animate-bounce">🎖️</span>
            <div>
              <h3 className="text-xl font-sans font-black text-slate-800">Lencana Pencapaian</h3>
              <p className="text-xs text-slate-500">Kumpulkan sticker super lucu dengan menyelesaikan target belajarmu!</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-white border-2 border-[#6D6875] px-3 py-1 rounded-xl shadow-[2px_2px_0px_#6D6875]">
            {stats.badges.length} / {ALL_BADGES.length} Terbuka
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {ALL_BADGES.map((badge) => {
            const isUnlocked = stats.badges.includes(badge.id);
            return (
              <motion.div
                key={badge.id}
                whileHover={{ scale: 1.03 }}
                className={`flex flex-col items-center text-center p-4 rounded-2xl border-3 transition-colors duration-300 relative ${
                  isUnlocked
                    ? 'bg-[#FFDAC1] border-[#6D6875] shadow-[3px_3px_0px_#6D6875]'
                    : 'bg-white border-slate-200 opacity-60 filter grayscale'
                }`}
              >
                {/* Ribbon Tag for Unlocked lencana */}
                {isUnlocked && (
                  <span className="absolute top-1 right-2 text-[9px] font-sans font-black text-amber-600 tracking-wide uppercase bg-amber-200/50 px-1.5 rounded">
                    TERBUKA!
                  </span>
                )}

                {/* Big Emoji Icon */}
                <div className={`text-4xl mb-2.5 p-2 rounded-full ${isUnlocked ? 'bg-white shadow-md scale-105' : 'bg-slate-100'}`}>
                  {badge.icon}
                </div>

                <h4 className="text-sm font-sans font-bold text-slate-800 leading-tight mb-1">
                  {badge.name}
                </h4>

                <p className="text-[10px] text-slate-600 line-clamp-2 leading-relaxed min-h-[30px] px-1">
                  {badge.description}
                </p>

                {/* Requirement guide */}
                <div className="mt-3 w-full border-t border-slate-200/60 pt-2 text-[9px] font-mono font-semibold text-slate-400">
                  {isUnlocked ? '🔓 Berhasil diraih!' : `🔒 ${badge.requirement}`}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Supabase Connection Setup Guide Card */}
      <div className="bg-white border-3 border-[#6D6875] rounded-2xl p-5 shadow-[4px_4px_0px_#6D6875] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-dashed border-slate-200 pb-3">
          <div>
            <h4 className="font-sans font-black text-slate-700 text-sm flex items-center gap-2">
              🔌 Integrasi Database Supabase
            </h4>
            <p className="text-[11px] text-slate-500">
              Sinkronisasikan seluruh catatan materi, flashcards, dan tingkat level belajarmu secara real-time!
            </p>
          </div>
          <div className="shrink-0">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black border-2 shadow-[2px_2px_0px_#6D6875] ${
              dbStatus === 'connected'
                ? 'bg-[#B5EAD7] border-[#6D6875] text-[#6D6875]'
                : dbStatus === 'local_only'
                ? 'bg-amber-100 border-[#6D6875] text-[#6D6875]'
                : dbStatus === 'loading'
                ? 'bg-blue-100 border-[#6D6875] text-[#6D6875] animate-pulse'
                : 'bg-red-100 border-red-500 text-red-700'
            }`}>
              {dbStatus === 'connected'
                ? '☁️ Cloud Terkoneksi'
                : dbStatus === 'local_only'
                ? '💾 Penyimpanan Lokal'
                : dbStatus === 'loading'
                ? '⌛ Menghubungkan...'
                : '⚠️ Gagal Terkoneksi'}
            </span>
          </div>
        </div>

        {dbStatus !== 'connected' && (
          <div className="text-xs text-slate-600 space-y-2.5 leading-relaxed font-sans bg-slate-50/50 p-4.5 rounded-xl border border-slate-200">
            <div>
              <p className="font-sans font-bold text-slate-705 mb-1 text-[11px]">
                💡 Cara menghubungkan aplikasi ini dengan Supabase-mu:
              </p>
              <ol className="list-decimal pl-4 space-y-1 text-[11px] text-slate-600">
                <li>
                  Buka akun <strong>Supabase</strong>-mu dan buat project baru.
                </li>
                <li>
                  Buka menu <strong>SQL Editor</strong> di Supabase dashboard, paste/jalankan script di bawah ini untuk membuat tabel kustom berserta kebijakan keamanannya (RLS).
                </li>
                <li>
                  Buka menu <strong>Secrets manager</strong> di platform AI Studio (ikon gerigi / Settings), lalu tambahkan variable berikut:
                  <div className="font-mono bg-slate-900 text-pink-300 text-[10px] py-1 px-2.5 rounded mt-1 overflow-x-auto select-all">
                    VITE_SUPABASE_URL = &quot;URL_SUPABASE_ANDA&quot;
                    <br />
                    VITE_SUPABASE_ANON_KEY = &quot;ANON_KEY_SUPABASE_ANDA&quot;
                  </div>
                </li>
              </ol>
            </div>

            <details className="mt-2 border border-slate-200 rounded-lg overflow-hidden bg-white">
              <summary className="bg-slate-100 px-3 py-1.5 font-bold text-[10px] cursor-pointer text-slate-700 select-none">
                📜 Tampilkan SQL Setup Script
              </summary>
              <pre className="p-3 bg-slate-950 text-emerald-400 text-[9px] font-mono overflow-x-auto max-h-[160px] select-all">
{`-- 1. Tabel Subjects
create table if not exists subjects (
  id text primary key,
  name text not null,
  icon text not null,
  color text not null,
  description text not null,
  "createdAt" text not null default now()
);

alter table subjects enable row level security;
create policy "Public Read" on subjects for select using (true);
create policy "Public Write" on subjects for insert with check (true);
create policy "Public Update" on subjects for update using (true);
create policy "Public Delete" on subjects for delete using (true);

-- 2. Tabel Materials
create table if not exists materials (
  id text primary key,
  "subjectId" text not null,
  title text not null,
  content text not null,
  points text[] not null default '{}',
  formulas text[] not null default '{}',
  flashcards jsonb not null default '[]',
  "createdAt" text not null default now()
);

alter table materials enable row level security;
create policy "Public Read" on materials for select using (true);
create policy "Public Write" on materials for insert with check (true);
create policy "Public Update" on materials for update using (true);
create policy "Public Delete" on materials for delete using (true);

-- 3. Tabel User Stats
create table if not exists user_stats (
  id text primary key,
  xp integer not null default 0,
  level integer not null default 1,
  streak integer not null default 0,
  "lastStudyDate" text,
  badges text[] not null default '{}',
  "totalQuizzesPlayed" integer not null default 0,
  "totalCorrectAnswers" integer not null default 0,
  "totalGamesPlayed" integer not null default 0,
  "pomodoroStudyMinutes" integer not null default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table user_stats enable row level security;
create policy "Public Read" on user_stats for select using (true);
create policy "Public Write" on user_stats for insert with check (true);
create policy "Public Update" on user_stats for update using (true);
create policy "Public Delete" on user_stats for delete using (true);`}
              </pre>
            </details>
          </div>
        )}

        {dbStatus === 'connected' && (
          <div className="bg-[#B5EAD7]/10 border border-[#B5EAD7] rounded-xl p-3 flex items-center gap-2.5 text-xs text-slate-700">
            <span className="text-xl">🌟</span>
            <div>
              <p className="font-sans font-bold">Koneksi Cloud Aktif dan Lancar!</p>
              <p className="text-[11px] text-slate-500">Semua progress belajarmu tersimpan dengan andal di database cloud Supabase.</p>
            </div>
          </div>
        )}
      </div>

      {/* Reset Progress Section (Cute warning box) */}
      <div className="bg-red-50 border-3 border-[#6D6875] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[4px_4px_0px_#6D6875]">
        <div>
          <h4 className="font-bold text-sm text-red-800 flex items-center gap-1.5">
            ⚠️ Pengaturan Pengguna
          </h4>
          <p className="text-[11px] text-red-600">
            Aksi ini akan menghapus semua XP, Level, Materi hasil buatanmu sendiri, dan meluncurkan ulang aplikasi.
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm('Apakah Endut yakin ingin mereset seluruh progress belajarmu? Semua materi yang Endut buat akan ikut terhapus.')) {
              onClearProgress();
            }
          }}
          className="bg-red-500 hover:bg-red-600 text-white font-sans font-bold text-xs px-4 py-2 rounded-xl border-2 border-[#6D6875] shadow-[3px_3px_0px_#6D6875] cursor-pointer active:translate-y-0.5"
        >
          Hapus Semua Progress
        </button>
      </div>
    </div>
  );
}
