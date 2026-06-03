/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, CheckSquare, Bell, Smartphone, Timer, AlertCircle, MapPin, Search } from 'lucide-react';
import { Subject } from '../types';

interface ScheduleChecklistsProps {
  subjects: Subject[];
  onSelectSubject: (id: string) => void;
  onGoToMateri: () => void;
}

export default function ScheduleChecklists({ subjects, onSelectSubject, onGoToMateri }: ScheduleChecklistsProps) {
  // Checklists saved in local storage for persistent task tracking
  const [uasChecked, setUasChecked] = useState<string[]>([]);
  const [quizLockChecked, setQuizLockChecked] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Checklist items based on user criteria
  const uasChecklistItems = [
    { id: 'u1', label: 'Bawa KRS (Kartu Rencana Studi)' },
    { id: 'u2', label: 'Hadir minimal 10 menit sebelum ujian dimulai' },
    { id: 'u3', label: 'Hanya boleh membawa 1 HP' },
    { id: 'u4', label: 'Smartwatch dilarang keras' },
    { id: 'u5', label: 'Cek ruang ujian sebelum masuk agar tidak salah masuk' },
    { id: 'u6', label: 'Nomor kursi harus sesuai dengan presensi STAR' },
  ];

  const quizLockItems = [
    { id: 'q1', label: 'Install aplikasi Quiz Lock di HP' },
    { id: 'q2', label: 'Aktifkan semua permission / izin akses yang diperlukan' },
    { id: 'q3', label: 'Volume HP disetel 100% penuh' },
    { id: 'q4', label: 'Baterai HP terisi penuh (100% atau bawa powerbank)' },
    { id: 'q5', label: 'Siapkan paket internet pribadi yang stabil' },
    { id: 'q6', label: 'Jangan gunakan split screen / screen recorder selama ujian' },
    { id: 'q7', label: 'Kode QR ujian hanya bisa digunakan satu kali saja' },
  ];

  // Specific deadlines
  const deadlines = [
    { date: '19 Juni 2026', title: 'Batas pelaporan sakit / tidak ikut ujian', type: 'danger' },
    { date: '02-19 Juni 2026', title: 'Pengajuan keberatan nilai', type: 'warning' },
    { date: '26 Juni 2026', title: 'Pengumuman resmi nilai UAS', type: 'success' },
  ];

  // Detailed Exam Schedule list
  const examSchedules = [
    {
      date: '02 Juni 2026',
      time: '10:00–11:40',
      subjectName: 'Aplikasi Skrining',
      subjectId: 'aplikasi-skrining',
      room: 'Ruang K',
      color: 'bg-emerald-50 border-emerald-350 text-emerald-800'
    },
    {
      date: '02 Juni 2026',
      time: '13:00–14:40',
      subjectName: 'Survei Cepat Epidemiologi',
      subjectId: 'survei-cepat-epi',
      room: 'Ruang J',
      color: 'bg-blue-50 border-blue-350 text-blue-800'
    },
    {
      date: '03 Juni 2026',
      time: '10:00–11:40',
      subjectName: 'Praktikum Surveilans Epidemiologi',
      subjectId: 'p-surveilans-epi',
      room: 'Ruang B',
      color: 'bg-[#C7CEEA]/30 border-[#C7CEEA] text-[#6D6875]'
    },
    {
      date: '03 Juni 2026',
      time: '13:00–14:40',
      subjectName: 'Manajemen dan Analisis Data Epidemiologi',
      subjectId: 'manajemen-analisis-data',
      room: 'Ruang I',
      color: 'bg-[#93C5FD]/20 border-purple-400 text-purple-900'
    },
    {
      date: '04 Juni 2026',
      time: '08:00–09:40',
      subjectName: 'Telaah Ilmiah Epidemiologi',
      subjectId: 'telaah-ilmiah',
      room: 'Ruang E',
      color: 'bg-pink-50 border-pink-300 text-pink-900'
    },
    {
      date: '04 Juni 2026',
      time: '10:00–11:40',
      subjectName: 'Epidemiologi Penyakit Tropis',
      subjectId: 'epi-penyakit-tropis',
      room: 'Ruang D',
      color: 'bg-amber-50 border-amber-300 text-amber-900'
    },
    {
      date: '05 Juni 2026',
      time: '08:00–09:40',
      subjectName: 'Praktik Investigasi Wabah',
      subjectId: 'praktik-investigasi-wabah',
      room: 'Ruang E',
      color: 'bg-red-50 border-red-350 text-red-950'
    }
  ];

  // Load selections on mount
  useEffect(() => {
    try {
      const storedUas = localStorage.getItem('checked_uas_items');
      const storedQuiz = localStorage.getItem('checked_quiz_lock_items');
      if (storedUas) setUasChecked(JSON.parse(storedUas));
      if (storedQuiz) setQuizLockChecked(JSON.parse(storedQuiz));
    } catch (e) {}
  }, []);

  const isPastDate = (dateStr: string) => {
    const match = dateStr.match(/^(\d+)\s+Juni\s+(\d+)$/);
    if (!match) return false;
    
    const day = parseInt(match[1], 10);
    const year = parseInt(match[2], 10);
    
    // Create Date object representing end of the exam day (11:59:59 PM)
    const examDate = new Date(year, 5, day, 23, 59, 59);
    
    const today = new Date();
    return examDate < today;
  };

  const toggleUasItem = (id: string) => {
    const updated = uasChecked.includes(id)
      ? uasChecked.filter((item) => item !== id)
      : [...uasChecked, id];
    setUasChecked(updated);
    localStorage.setItem('checked_uas_items', JSON.stringify(updated));
  };

  const toggleQuizLockItem = (id: string) => {
    const updated = quizLockChecked.includes(id)
      ? quizLockChecked.filter((item) => item !== id)
      : [...quizLockChecked, id];
    setQuizLockChecked(updated);
    localStorage.setItem('checked_quiz_lock_items', JSON.stringify(updated));
  };

  const filteredExams = examSchedules.filter((exam) =>
    exam.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exam.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exam.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. THREE-COLUMN QUICK HIGHLIGHT FOR DEADLINES & STREAKS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {deadlines.map((dl, index) => {
          let themeColor = 'border-amber-400 bg-amber-50 text-amber-900';
          if (dl.type === 'danger') themeColor = 'border-red-400 bg-red-50 text-red-900';
          if (dl.type === 'success') themeColor = 'border-emerald-400 bg-emerald-50 text-emerald-900';

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border-3 p-4 rounded-2xl shadow-[3px_3px_0px_#6D6875] flex items-center gap-3.5 ${themeColor}`}
            >
              <div className="p-3 bg-white border-2 border-[#6D6875] rounded-xl text-lg flex items-center justify-center shadow-[1px_1px_0px_#6D6875] shrink-0">
                {dl.type === 'danger' ? '🚨' : dl.type === 'warning' ? '📅' : '🎉'}
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase text-[#6D6875] tracking-wider block">
                  {dl.date}
                </span>
                <p className="font-sans font-black text-xs leading-snug">
                  {dl.title}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 2. DOUBLE-COLUMN INTERACTIVE REMINDER & QUIZ LOCK PLANNER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Checklist Wajib UAS */}
        <div className="bg-white border-4 border-[#6D6875] rounded-3xl p-6 shadow-[5px_5px_0px_#6D6875] space-y-4">
          <div className="flex items-center gap-3 border-b-2 border-[#6D6875] pb-3">
            <span className="text-2xl">📢</span>
            <div>
              <h3 className="font-sans font-black text-[#6D6875] text-md">
                CHECKLIST WAJIB UAS
              </h3>
              <p className="text-[10px] text-slate-500 font-medium">
                Patuhi semua aturan ujian STAR demi kelancaran administrasi nilai
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {uasChecklistItems.map((item) => {
              const isChecked = uasChecked.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleUasItem(item.id)}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-emerald-50 border-emerald-450 text-[#6D6875] opacity-80'
                      : 'bg-slate-50 hover:bg-slate-100 border-[#6D6875]/40 text-[#6D6875] hover:border-[#6D6875]'
                  }`}
                >
                  <div className={`mt-0.5 h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 ${
                    isChecked ? 'bg-emerald-500 border-emerald-600 text-white' : 'bg-white border-[#6D6875]/80'
                  }`}>
                    {isChecked && '✓'}
                  </div>
                  <span className={`text-xs font-bold leading-normal ${isChecked ? 'line-through text-slate-400' : ''}`}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Checklist Quiz Lock */}
        <div className="bg-white border-4 border-[#6D6875] rounded-3xl p-6 shadow-[5px_5px_0px_#6D6875] space-y-4">
          <div className="flex items-center gap-3 border-b-2 border-[#6D6875] pb-3">
            <span className="text-2xl">🔐</span>
            <div>
              <h3 className="font-sans font-black text-[#6D6875] text-md">
                CHECKLIST QUIZ LOCK
              </h3>
              <p className="text-[10px] text-slate-500 font-medium">
                Persiapan teknis gadget sebelum memasuki ruang ujian daring
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {quizLockItems.map((item) => {
              const isChecked = quizLockChecked.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleQuizLockItem(item.id)}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-blue-50 border-blue-400 text-[#6D6875] opacity-80'
                      : 'bg-[#FFFDF0] hover:bg-[#FFFDF0]/80 border-[#6D6875]/40 text-[#6D6875] hover:border-[#6D6875]'
                  }`}
                >
                  <div className={`mt-0.5 h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 ${
                    isChecked ? 'bg-blue-500 border-blue-600 text-white' : 'bg-white border-[#6D6875]/80'
                  }`}>
                    {isChecked && '✓'}
                  </div>
                  <span className={`text-xs font-bold leading-normal ${isChecked ? 'line-through text-slate-400' : ''}`}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 3. DYNAMIC TIMETABLE / JADWAL UAS WITH COURSE DECK SHORTCUTS */}
      <div className="bg-white border-4 border-[#6D6875] rounded-3xl p-6 shadow-[6px_6px_0px_#6D6875] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-dashed border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📅</div>
            <div>
              <h3 className="font-sans font-black text-[#6D6875] text-lg">
                Jadwal Ujian Akhir Semester (UAS)
              </h3>
              <p className="text-[11px] text-slate-500">
                Lengkap dengan asisten kelas, jam pelaksanaan, dan ruang ujian fisik Anda
              </p>
            </div>
          </div>

          {/* Timetable Search Filter */}
          <div className="relative">
            <input
              type="text"
              placeholder="Cari matkul, ruang, atau tanggal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 font-sans text-xs bg-slate-50 border-2 border-[#6D6875] rounded-xl py-2 px-3 pl-8 text-[#6D6875] focus:outline-none focus:ring-1 focus:ring-[#FF9AA2]"
            />
            <Search size={14} className="absolute left-2.5 top-3 text-[#6D6875]" />
          </div>
        </div>

        {/* Timetable Grid cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredExams.map((exam, i) => {
            const isPast = isPastDate(exam.date);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`group relative border-3 rounded-2xl p-5 hover:scale-[1.01] transition-transform duration-200 flex flex-col justify-between shadow-[4px_4px_0px_#6D6875] overflow-hidden ${
                  isPast
                    ? 'bg-slate-900/10 border-slate-500 text-slate-400 opacity-60 filter grayscale'
                    : 'bg-[#FFFDF0] border-[#6D6875] text-[#6D6875]'
                }`}
              >
                {/* Visual marker ribbon */}
                {isPast ? (
                  <div className="absolute top-0 right-0 py-1 px-3 text-[10px] font-black border-l-2 border-b-2 border-slate-700 bg-slate-800 text-slate-300 rounded-bl-xl uppercase tracking-wider flex items-center gap-1">
                    <span>✓</span>
                    SELESAI ({exam.room})
                  </div>
                ) : (
                  <div className="absolute top-0 right-0 py-1 px-3 text-[10px] font-black border-l-2 border-b-2 border-[#6D6875] bg-[#E2F0CB] text-[#6D6875] rounded-bl-xl uppercase tracking-wider flex items-center gap-1">
                    <span>📍</span>
                    {exam.room}
                  </div>
                )}

                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold">
                      <Calendar size={12} />
                      {exam.date}
                      <span className="text-slate-400">•</span>
                      <Timer size={12} />
                      {exam.time}
                    </div>
                    <h4 className={`font-sans font-black text-sm pr-16 transition-colors ${
                      isPast ? 'text-slate-400' : 'text-[#6D6875] group-hover:text-amber-700'
                    }`}>
                      {isPast && <span className="text-emerald-500 mr-1 font-extrabold">✓</span>}
                      {exam.subjectName}
                    </h4>
                  </div>
                  
                  <p className="text-[11px] text-slate-550 leading-normal">
                    {subjects.find((s) => s.id === exam.subjectId)?.description ||
                      'Mata kuliah epidemiologi terapan yang wajib dikuasai dengan tuntas.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-5 pt-4 border-t border-dashed border-slate-200">
                  <button
                    onClick={() => {
                      onSelectSubject(exam.subjectId);
                      onGoToMateri();
                    }}
                    className={`flex-1 text-center font-black text-[10px] py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#6D6875] cursor-pointer transition-all active:translate-y-0.5 active:shadow-[1px_1px_0px_#6D6875] ${
                      isPast
                        ? 'bg-slate-200 hover:bg-slate-300 border-2 border-slate-700 text-slate-600'
                        : 'bg-[#FFDAC1] hover:bg-[#FFC6A5] border-2 border-[#6D6875] text-[#6D6875]'
                    }`}
                  >
                    <span>📓</span>
                    Buka Rangkuman
                  </button>

                  <button
                    onClick={() => {
                      onSelectSubject(exam.subjectId);
                      onSelectSubject(exam.subjectId);
                      // Custom event trigger to navigate to play game
                      window.dispatchEvent(new CustomEvent('change_nav_tab', { detail: 'games' }));
                    }}
                    className={`flex-1 text-center font-black text-[10px] py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#6D6875] cursor-pointer transition-all active:translate-y-0.5 active:shadow-[1px_1px_0px_#6D6875] ${
                      isPast
                        ? 'bg-slate-300 hover:bg-slate-400 border-2 border-slate-700 text-slate-700'
                        : 'bg-[#C7CEEA] hover:bg-[#B1BADF] border-2 border-[#6D6875] text-[#6D6875]'
                    }`}
                  >
                    <span>🎮</span>
                    Main Kuis Game
                  </button>
                </div>
              </motion.div>
            );
          })}

          {filteredExams.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 space-y-2">
              <span className="text-3xl">🔍</span>
              <p className="text-xs font-sans font-extrabold text-slate-500">Mata kuliah tidak ditemukan</p>
              <p className="text-[11px] text-slate-400">Silakan masukkan filter kata pencarian yang berbeda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
