/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Subject, Material, Flashcard } from '../types';
import { DEFAULT_SUBJECTS } from '../data/defaultData';
import {
  BookOpen,
  Plus,
  Compass,
  Calculator,
  Leaf,
  Languages,
  Tag,
  Calendar,
  AlertCircle,
  Sparkles,
  HelpCircle,
  Brain,
  ChevronRight,
  GraduationCap,
  Search,
  Zap,
  Activity,
  Database,
  Shield,
  Flame,
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import MarkdownRenderer from './MarkdownRenderer';

interface MateriDashboardProps {
  subjects: Subject[];
  materials: Material[];
  onAddMaterial: (newMaterial: Material) => void;
  onEditMaterial: (updatedMaterial: Material) => void;
  onAddSubject: (newSubject: Subject) => void;
  onSelectSubject: (subjectId: string) => void;
  selectedSubjectId: string;
}

export default function MateriDashboard({
  subjects,
  materials,
  onAddMaterial,
  onEditMaterial,
  onAddSubject,
  onSelectSubject,
  selectedSubjectId
}: MateriDashboardProps) {
  // Navigation states
  const [activeTab, setActiveTab] = useState<'view' | 'add-materi' | 'add-mapel'>('view');
  
  // New Material form state
  const [matTitle, setMatTitle] = useState('');
  const [matSubject, setMatSubject] = useState(subjects[0]?.id || '');
  const [matContent, setMatContent] = useState('');
  
  const [matPointsStr, setMatPointsStr] = useState('');
  const [matFormulasStr, setMatFormulasStr] = useState('');
  const [editingMaterialId, setEditingMaterialId] = useState<string | null>(null);

  // Helper to trigger edit mode
  const handleEditClick = (mat: Material) => {
    setEditingMaterialId(mat.id);
    setMatTitle(mat.title);
    setMatSubject(mat.subjectId);
    setMatContent(mat.content);
    setMatPointsStr(mat.points.join(', '));
    setMatFormulasStr(mat.formulas.join(', '));
    setMatFlashcards(mat.flashcards.map(fc => ({ id: fc.id, question: fc.question, answer: fc.answer })));
    setActiveTab('add-materi');
  };

  // Helper to cancel add or edit mode
  const handleCancelAddEdit = () => {
    setEditingMaterialId(null);
    setMatTitle('');
    setMatContent('');
    setMatPointsStr('');
    setMatFormulasStr('');
    setMatFlashcards([{ id: '1', question: '', answer: '' }]);
    setActiveTab('view');
  };

  // Flashcards builder for new Material
  const [matFlashcards, setMatFlashcards] = useState<{ question: string; answer: string; id: string }[]>([
    { id: '1', question: '', answer: '' }
  ]);

  // New Subject form state
  const [subName, setSubName] = useState('');
  const [subColor, setSubColor] = useState<'pink' | 'purple' | 'amber' | 'emerald' | 'sky' | 'rose' | 'indigo'>('sky');
  const [subIcon, setSubIcon] = useState('BookOpen');
  const [subDesc, setSubDesc] = useState('');

  // Flashcard list helpers
  const handleAddFlashcardRow = () => {
    setMatFlashcards([
      ...matFlashcards,
      { id: Date.now().toString() + Math.random().toString(), question: '', answer: '' }
    ]);
  };

  const handleRemoveFlashcardRow = (idx: number) => {
    if (matFlashcards.length === 1) return;
    setMatFlashcards(matFlashcards.filter((_, i) => i !== idx));
  };

  const handleUpdateFlashcard = (idx: number, field: 'question' | 'answer', val: string) => {
    const updated = [...matFlashcards];
    updated[idx][field] = val;
    setMatFlashcards(updated);
  };

  // Helper to resolve icon from string
  const renderSubjectIcon = (iconName: string, size = 18) => {
    switch (iconName) {
      case 'Calculator':
        return <Calculator size={size} />;
      case 'Leaf':
        return <Leaf size={size} />;
      case 'Compass':
        return <Compass size={size} />;
      case 'Languages':
        return <Languages size={size} />;
      case 'Brain':
        return <Brain size={size} />;
      case 'Search':
        return <Search size={size} />;
      case 'Zap':
        return <Zap size={size} />;
      case 'Activity':
        return <Activity size={size} />;
      case 'Database':
        return <Database size={size} />;
      case 'Shield':
        return <Shield size={size} />;
      case 'Flame':
        return <Flame size={size} />;
      case 'Volume2':
        return <Volume2 size={size} />;
      case 'BookOpen':
      default:
        return <BookOpen size={size} />;
    }
  };

  // Resolve pastel BG color classes
  const getSubjectColorClasses = (color: string) => {
    switch (color) {
      case 'pink':
        return {
          bg: 'bg-[#FF9AA2]/15 hover:bg-[#FF9AA2]/25',
          border: 'border-[#6D6875]',
          badge: 'bg-[#FF9AA2] text-white shadow-[2px_2px_0px_#6D6875] border border-[#6D6875]',
          text: 'text-[#6D6875]',
          accent: 'text-[#FF9AA2]',
          card: 'bg-[#FF9AA2]/10'
        };
      case 'rose':
        return {
          bg: 'bg-[#FFB7B2]/15 hover:bg-[#FFB7B2]/25',
          border: 'border-[#6D6875]',
          badge: 'bg-[#FFB7B2] text-white shadow-[2px_2px_0px_#6D6875] border border-[#6D6875]',
          text: 'text-[#6D6875]',
          accent: 'text-[#FFB7B2]',
          card: 'bg-[#FFB7B2]/10'
        };
      case 'purple':
        return {
          bg: 'bg-[#C7CEEA]/15 hover:bg-[#C7CEEA]/25',
          border: 'border-[#6D6875]',
          badge: 'bg-[#C7CEEA] text-[#6D6875] shadow-[2px_2px_0px_#6D6875] border border-[#6D6875]',
          text: 'text-[#6D6875]',
          accent: 'text-[#C7CEEA]',
          card: 'bg-[#C7CEEA]/10'
        };
      case 'amber':
        return {
          bg: 'bg-[#FFDAC1]/20 hover:bg-[#FFDAC1]/30',
          border: 'border-[#6D6875]',
          badge: 'bg-[#FFDAC1] text-[#6D6875] shadow-[2px_2px_0px_#6D6875] border border-[#6D6875]',
          text: 'text-[#6D6875]',
          accent: 'text-[#FFDAC1]',
          card: 'bg-[#FFDAC1]/15'
        };
      case 'emerald':
        return {
          bg: 'bg-[#B5EAD7]/15 hover:bg-[#B5EAD7]/25',
          border: 'border-[#6D6875]',
          badge: 'bg-[#B5EAD7] text-[#6D6875] shadow-[2px_2px_0px_#6D6875] border border-[#6D6875]',
          text: 'text-[#6D6875]',
          accent: 'text-[#B5EAD7]',
          card: 'bg-[#B5EAD7]/10'
        };
      case 'indigo':
        return {
          bg: 'bg-[#C7CEEA]/20 hover:bg-[#C7CEEA]/30',
          border: 'border-[#6D6875]',
          badge: 'bg-[#C7CEEA] text-[#6D6875] shadow-[2px_2px_0px_#6D6875] border border-[#6D6875]',
          text: 'text-[#6D6875]',
          accent: 'text-[#C7CEEA]',
          card: 'bg-[#C7CEEA]/15'
        };
      case 'sky':
      default:
        return {
          bg: 'bg-[#E2F0CB]/20 hover:bg-[#E2F0CB]/30',
          border: 'border-[#6D6875]',
          badge: 'bg-[#E2F0CB] text-[#6D6875] shadow-[2px_2px_0px_#6D6875] border border-[#6D6875]',
          text: 'text-[#6D6875]',
          accent: 'text-[#E2F0CB]',
          card: 'bg-[#E2F0CB]/15'
        };
    }
  };

  const handleMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matTitle.trim() || !matContent.trim()) {
      alert('Tolong isi Judul Materi dan Penjelasan ya!');
      return;
    }

    // Process valid flashcards
    const flashcardsList: Flashcard[] = matFlashcards
      .filter((fc) => fc.question.trim() && fc.answer.trim())
      .map((fc) => ({
        id: fc.id,
        question: fc.question.trim(),
        answer: fc.answer.trim(),
        level: 0
      }));

    if (flashcardsList.length === 0) {
      alert('Tolong isi minimal 1 pasang Flashcard (Pertanyaan & Jawaban) agar materi ini bisa dipelajari dengan game!');
      return;
    }

    const cleanPoints = matPointsStr.split(',').map((p) => p.trim()).filter((p) => p !== '');
    const cleanFormulas = matFormulasStr.split(',').map((f) => f.trim()).filter((f) => f !== '');

    if (editingMaterialId) {
      const updatedMat: Material = {
        id: editingMaterialId,
        subjectId: matSubject,
        title: matTitle.trim(),
        content: matContent.trim(),
        points: cleanPoints,
        formulas: cleanFormulas,
        flashcards: flashcardsList,
        createdAt: materials.find((m) => m.id === editingMaterialId)?.createdAt || new Date().toISOString()
      };
      onEditMaterial(updatedMat);
      alert(`Yeay! Materi "${matTitle}" berhasil diperbarui! 🌟`);
    } else {
      const newMat: Material = {
        id: 'm-' + Date.now(),
        subjectId: matSubject,
        title: matTitle.trim(),
        content: matContent.trim(),
        points: cleanPoints,
        formulas: cleanFormulas,
        flashcards: flashcardsList,
        createdAt: new Date().toISOString()
      };
      onAddMaterial(newMat);
      alert(`Yeay! Materi "${matTitle}" berhasil ditambahkan! 🌟`);
    }
    
    // Reset inputs
    setMatTitle('');
    setMatContent('');
    setMatPointsStr('');
    setMatFormulasStr('');
    setMatFlashcards([{ id: '1', question: '', answer: '' }]);
    setEditingMaterialId(null);
    setActiveTab('view');
  };

  const handleSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim()) {
      alert('Tolong isi Nama Mata Pelajaran terlebih dahulu!');
      return;
    }

    const newSub: Subject = {
      id: 'sub-' + Date.now(),
      name: subName.trim(),
      icon: subIcon,
      color: subColor,
      description: subDesc.trim() || `Kumpulan materi seru mengenai laskar ${subName}.`,
      createdAt: new Date().toISOString()
    };

    onAddSubject(newSub);
    alert(`Mata Pelajaran "${subName}" siap dipelajari sekarang! ✨`);
    
    // Reset subject input states
    setSubName('');
    setSubDesc('');
    setSubIcon('BookOpen');
    setActiveTab('view');
  };

  // Filter materials for currently active subject
  const activeSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
  const activeMaterials = materials.filter((m) => m.subjectId === selectedSubjectId);

  return (
    <div className="space-y-6">
      {/* Mini Segmented Navigation Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b-2 border-slate-150 pb-4">
        {/* Navigation buttons */}
        <div className="flex gap-2.5">
          <button
            onClick={() => setActiveTab('view')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-sans font-black border-2.5 transition-all cursor-pointer ${
              activeTab === 'view'
                ? 'bg-indigo-600 border-indigo-800 text-white shadow-[2.5px_2.5px_0px_0px_#1E3A8A]'
                : 'bg-white hover:bg-slate-100 border-slate-250 text-slate-700'
            }`}
          >
            📚 Lihat Materi
          </button>
          <button
            onClick={() => {
              setEditingMaterialId(null);
              setMatTitle('');
              setMatContent('');
              setMatPointsStr('');
              setMatFormulasStr('');
              setMatFlashcards([{ id: '1', question: '', answer: '' }]);
              setActiveTab('add-materi');
              if (activeSubject) setMatSubject(activeSubject.id);
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-sans font-black border-2.5 transition-all cursor-pointer ${
              activeTab === 'add-materi'
                ? 'bg-rose-500 border-rose-700 text-white shadow-[2.5px_2.5px_0px_0px_#881337]'
                : 'bg-white hover:bg-slate-100 border-slate-250 text-slate-700'
            }`}
          >
            ➕ Tambah Catatan Materi
          </button>
          <button
            onClick={() => setActiveTab('add-mapel')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-sans font-black border-2.5 transition-all cursor-pointer ${
              activeTab === 'add-mapel'
                ? 'bg-amber-500 border-amber-700 text-white shadow-[2.5px_2.5px_0px_0px_#78350F]'
                : 'bg-white hover:bg-slate-100 border-slate-250 text-slate-700'
            }`}
          >
            ✨ Buat Mata Pelajaran Baru
          </button>
        </div>

        {/* Floating study buddy description */}
        <div className="text-[11px] font-medium text-slate-500 bg-slate-50 border-2 border-slate-200 px-3 py-1.5 rounded-xl hidden sm:flex items-center gap-1">
          <Sparkles size={11} className="text-amber-500 animate-pulse" />
          Endut bisa membuat materi tak terbatas untuk bahan uji UAS!
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* VIEW ALL MATERIALS & SUBJECTS TAB */}
        {activeTab === 'view' && (
          <motion.div
            key="view-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            {/* Left Subject Sidebar List (Desktop: grid columns 5, Mobile: stack top) */}
            <div className="lg:col-span-4 space-y-3">
              <h4 className="font-sans font-black text-sm text-slate-700 uppercase tracking-widest pl-1">
                📌 Mata Pelajaran UAS
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {subjects.map((sub) => {
                  const subTheme = getSubjectColorClasses(sub.color);
                  const isSelected = sub.id === selectedSubjectId;
                  const count = materials.filter((m) => m.subjectId === sub.id).length;

                  return (
                    <motion.button
                      key={sub.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onSelectSubject(sub.id)}
                      className={`w-full text-left p-4 rounded-3xl border-3 transition-all duration-300 relative overflow-hidden flex items-center justify-between cursor-pointer ${subTheme.bg} ${subTheme.border} ${
                        isSelected
                          ? `shadow-[3.5px_3.5px_0px_0px_#1E293B] scale-[1.01] ${subTheme.card}`
                          : 'shadow-[1.5px_1.5px_0px_0px_#E2E8F0]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`p-2.5 rounded-2xl ${subTheme.badge}`}>
                          {renderSubjectIcon(sub.icon, 20)}
                        </span>
                        <div>
                          <h5 className="font-sans font-extrabold text-sm text-slate-800 leading-tight">
                            {sub.name}
                          </h5>
                          <p className="text-[10px] text-slate-550 line-clamp-1 mt-0.5 mt-0.5 leading-normal max-w-[150px]">
                            {sub.description}
                          </p>
                        </div>
                      </div>

                      {/* Pill Badge of Materials Counter */}
                      <span className="text-[10px] font-mono font-black border-2 border-slate-700 bg-white px-2 py-0.5 rounded-full text-slate-800 shadow-[1px_1px_0px_0px_#1E293B]">
                        {count} Catatan
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Right Material Viewer (Desktop: grid columns 8) */}
            <div className="lg:col-span-8 space-y-4">
              {activeSubject && (
                <div className={`p-5 rounded-3xl border-3 ${getSubjectColorClasses(activeSubject.color).border} ${getSubjectColorClasses(activeSubject.color).bg} flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm`}>
                  <div className="flex items-center gap-3.5">
                    <span className={`p-3 rounded-2.5xl ${getSubjectColorClasses(activeSubject.color).badge} animate-bounce`}>
                      {renderSubjectIcon(activeSubject.icon, 22)}
                    </span>
                    <div>
                      <h3 className="text-xl font-sans font-black text-slate-850">
                        Mapel: {activeSubject.name}
                      </h3>
                      <p className="text-xs text-slate-600 font-sans leading-relaxed">
                        {activeSubject.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Summary Status of Subject */}
                  <span className="text-xs font-bold bg-white border-2 border-slate-800 rounded-xl px-3 py-1.5 shadow-[2px_2px_0px_0px_#1E293B] block shrink-0 text-slate-700">
                    📖 Ada {activeMaterials.length} bahan uji
                  </span>
                </div>
              )}

              {/* List of Materials items */}
              {activeMaterials.length === 0 ? (
                <div className="bg-slate-50 border-3 border-dashed border-slate-200 rounded-3xl p-10 text-center flex flex-col items-center justify-center">
                  <div className="text-4xl mb-3">📭</div>
                  <h4 className="font-sans font-black text-slate-700 text-md">Belum Ada Catatan Belajar</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 leading-relaxed">
                    Mata pelajaran ini belum memiliki catatan materi persiapan. Tekan tombol <strong>Tambah Catatan Materi</strong> di atas untuk membuat rangkuman belajarmu sendiri!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeMaterials.map((mat) => (
                    <motion.div
                      key={mat.id}
                      initial={{ scale: 0.98, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-white border-3 border-[#6D6875] rounded-3xl p-5 shadow-[4px_4px_0px_#6D6875] hover:shadow-[6px_6px_0px_#6D6875] transition-all"
                    >
                      <div className="flex items-center justify-between border-b-2 border-slate-100 pb-2.5 mb-3 gap-2">
                        <h4 className="text-md font-sans font-black text-slate-800 flex items-center gap-1.5 min-w-0 flex-1">
                          <GraduationCap className="text-indigo-600 text-indigo-500 shrink-0" size={18} />
                          <span className="truncate">{mat.title}</span>
                        </h4>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-mono font-bold bg-pink-100 border-2 border-pink-700 text-pink-700 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-[1.5px_1.5px_0px_0px_#BE123C]">
                            ✨ {mat.flashcards.length} Flashcard
                          </span>
                          <button
                            onClick={() => handleEditClick(mat)}
                            className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border-2 border-slate-700 bg-amber-100 hover:bg-amber-200 text-slate-800 transition-all cursor-pointer shadow-[1.5px_1.5px_0px_0px_#1E293B] active:translate-y-0.5 flex items-center gap-1"
                          >
                            ✏️ Edit
                          </button>
                        </div>
                      </div>

                      {/* Content text */}
                      <div className="bg-slate-50/50 p-3.5 rounded-2xl border-1.5 border-slate-150 mb-3.5">
                        <MarkdownRenderer content={mat.content} />
                      </div>

                      {/* Bullet point lists if available */}
                      {mat.points.length > 0 && (
                        <div className="mb-3.5">
                          <span className="text-[10px] font-black text-indigo-700 uppercase tracking-wider block mb-1">
                            🌸 Poin-Poin Penting (Memorize):
                          </span>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {mat.points.map((p, idx) => (
                              <li
                                key={idx}
                                className="text-xs text-slate-700 bg-emerald-50/40 border border-emerald-250 rounded-xl px-2.5 py-1.5 flex items-start gap-1.5"
                              >
                                <span className="text-emerald-500 font-bold shrink-0">✔</span>
                                <span className="leading-tight">{p}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Formula list if available */}
                      {mat.formulas.length > 0 && (
                        <div>
                          <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider block mb-1">
                            📐 Rumus / Definisi Kunci:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {mat.formulas.map((f, idx) => (
                              <code
                                key={idx}
                                className="text-xs font-mono font-bold text-amber-800 bg-amber-50 border border-amber-300 rounded-xl px-3 py-1 bg-amber-500/5 tracking-tightest leading-relaxed block"
                              >
                                {f}
                              </code>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ADD NEW MATERIAL FORM TAB */}
        {activeTab === 'add-materi' && (
          <motion.form
            key="add-materi-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleMaterialSubmit}
            className="bg-white border-3 border-[#6D6875] rounded-3xl p-6 shadow-[6px_6px_0px_#6D6875] max-w-2xl mx-auto space-y-5"
          >
            <div className="flex items-center gap-2 border-b-2 border-slate-100 pb-3 mb-1">
              <span className="text-2xl">{editingMaterialId ? '✏️' : '📝'}</span>
              <div>
                <h3 className="text-lg font-sans font-black text-slate-800">
                  {editingMaterialId ? 'Edit Rangkuman UAS' : 'Catat Rangkuman UAS'}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingMaterialId 
                    ? 'Ubah catatan rangkumanmu, sistem otomatis menyiapkannya ke mini-game.'
                    : 'Buat rangkuman catatanmu, sistem otomatis menyiapkannya ke mini-game.'}
                </p>
              </div>
            </div>

            {/* Title & Subject Select */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  Judul Materi pembelajaran
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rumus Cepat Luas Lingkaran"
                  value={matTitle}
                  onChange={(e) => setMatTitle(e.target.value)}
                  className="w-full bg-slate-50 border-2.5 border-slate-300 focus:border-indigo-500 hover:border-slate-400 font-sans text-xs px-3 py-2 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  Pilih Mata Pelajaran
                </label>
                <select
                  value={matSubject}
                  onChange={(e) => setMatSubject(e.target.value)}
                  className="w-full bg-slate-50 border-2.5 border-slate-300 focus:border-indigo-500 hover:border-slate-400 font-sans text-xs px-3 py-2 rounded-xl outline-none cursor-pointer"
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Paragraph / main explanation Content */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Isi Penjelasan Singkat (Deskripsi)
              </label>
              <textarea
                required
                rows={3}
                placeholder="Tuliskan intisari materi di sini agar mudah dibaca berulang kali..."
                value={matContent}
                onChange={(e) => setMatContent(e.target.value)}
                className="w-full bg-slate-50 border-2.5 border-slate-300 focus:border-indigo-500 hover:border-slate-400 font-sans text-xs px-3 py-2 rounded-xl outline-none resize-none"
              />
            </div>

            {/* Key Pointers Sub-list (Separated by comma or multiline) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  Poin Penting (Pisahkan Koma)
                </label>
                <span className="text-[10px] text-slate-400 leading-tight block mb-1.5">
                  Poin ingatan penting untuk dicocokkan di mini-game.
                </span>
                <input
                  type="text"
                  placeholder="Contoh: Hipotenusa, Sudut Siku-Siku"
                  value={matPointsStr}
                  onChange={(e) => setMatPointsStr(e.target.value)}
                  className="w-full bg-slate-50 border-2.5 border-slate-300 focus:border-indigo-500 hover:border-slate-400 font-sans text-xs px-3 py-2 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  Rumus / Singkatan Pintar (Koma)
                </label>
                <span className="text-[10px] text-slate-400 leading-tight block mb-1.5">
                  Poin rumus rahasia yang butuh dihafalkan tajam.
                </span>
                <input
                  type="text"
                  placeholder="Contoh: c2 = a2 + b2, a2 = c2 - b2"
                  value={matFormulasStr}
                  onChange={(e) => setMatFormulasStr(e.target.value)}
                  className="w-full bg-slate-50 border-2.5 border-slate-300 focus:border-indigo-500 hover:border-slate-400 font-sans text-xs px-3 py-2 rounded-xl outline-none"
                />
              </div>
            </div>

            {/* Custom Flashcards deck creater */}
            <div className="border-t-2 border-slate-100 pt-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-sans font-black text-slate-800">🎴 Kartu Flashcard Mandiri</h4>
                  <p className="text-[10px] text-slate-400 leading-snug">Sistem menggunakan tanya-jawab ini dalam game Flashcards & Quiz mengingat!</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddFlashcardRow}
                  className="bg-pink-100 hover:bg-pink-200 border-2 border-pink-500 text-pink-700 text-[11px] font-sans font-extrabold px-3 py-1.5 rounded-xl cursor-pointer transition-all flex items-center gap-1"
                >
                  <Plus size={12} /> Baris Baru
                </button>
              </div>

              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {matFlashcards.map((fc, idx) => (
                  <div key={fc.id} className="flex gap-2 items-center bg-slate-50 p-2.5 border-2 border-slate-200 rounded-xl">
                    <span className="text-xs font-mono font-bold text-slate-400 w-5 text-center">
                      #{idx + 1}
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="Masukkan pertanyaan jitu..."
                      value={fc.question}
                      onChange={(e) => handleUpdateFlashcard(idx, 'question', e.target.value)}
                      className="flex-1 bg-white border border-slate-300 focus:border-indigo-500 px-2.5 py-1.5 rounded-lg text-xs outline-none"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Jawaban ringkas..."
                      value={fc.answer}
                      onChange={(e) => handleUpdateFlashcard(idx, 'answer', e.target.value)}
                      className="flex-1 bg-white border border-slate-300 focus:border-indigo-500 px-2.5 py-1.5 rounded-lg text-xs outline-none"
                    />
                    <button
                      type="button"
                      disabled={matFlashcards.length === 1}
                      onClick={() => handleRemoveFlashcardRow(idx)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg disabled:opacity-30 cursor-pointer"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Finish submit material button */}
            <div className="pt-3 flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleCancelAddEdit}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-sans font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-300 cursor-pointer"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="bg-rose-500 hover:bg-rose-600 border-2 border-rose-700 text-white font-sans font-extrabold text-xs px-6 py-2.5 rounded-xl cursor-pointer shadow-[3px_3px_0px_0px_#881337] active:translate-y-0.5"
              >
                {editingMaterialId ? 'Simpan Perubahan! 🌟' : 'Simpan Materi & Cetak Flashcard! 🎉'}
              </button>
            </div>
          </motion.form>
        )}

        {/* ADD NEW SUBJECT TAB */}
        {activeTab === 'add-mapel' && (
          <motion.form
            key="add-mapel-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubjectSubmit}
            className="bg-white border-3 border-[#6D6875] rounded-3xl p-6 shadow-[6px_6px_0px_#6D6875] max-w-md mx-auto space-y-5"
          >
            <div className="flex items-center gap-2 border-b-2 border-slate-100 pb-3 mb-1">
              <span className="text-2xl">⭐</span>
              <div>
                <h3 className="text-lg font-sans font-black text-slate-800">Mapel Baru</h3>
                <p className="text-xs text-slate-500">Mata Pelajaran kustomisasi sesuka hatimu!</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Nama Mata Pelajaran
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Fisika Dasar, Sastra Jepang"
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                className="w-full bg-slate-50 border-2.5 border-slate-300 focus:border-indigo-500 hover:border-slate-400 font-sans text-xs px-3 py-2 rounded-xl outline-none"
              />
            </div>

            {/* Custom Icon pickers */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Pilih Icon Representatif
              </label>
              <div className="flex gap-2 flex-wrap">
                {[
                  { name: 'BookOpen', icon: <BookOpen size={16} /> },
                  { name: 'Search', icon: <Search size={16} /> },
                  { name: 'Zap', icon: <Zap size={16} /> },
                  { name: 'Activity', icon: <Activity size={16} /> },
                  { name: 'Database', icon: <Database size={16} /> },
                  { name: 'Shield', icon: <Shield size={16} /> },
                  { name: 'Flame', icon: <Flame size={16} /> },
                  { name: 'Brain', icon: <Brain size={16} /> },
                  { name: 'Volume2', icon: <Volume2 size={16} /> }
                ].map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setSubIcon(item.name)}
                    className={`p-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                      subIcon === item.name
                        ? 'bg-amber-100 border-amber-600 text-amber-800 scale-103 shadow-inner'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    {item.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom pastel Color selection */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Pilih Nuansa Warna Pastel
              </label>
              <div className="flex gap-2 flex-wrap">
                {(['pink', 'purple', 'amber', 'emerald', 'sky', 'rose', 'indigo'] as const).map((color) => {
                  const sampleThemes = getSubjectColorClasses(color);
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSubColor(color)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-sans font-black border-2 cursor-pointer transition-all ${
                        subColor === color
                          ? `${sampleThemes.badge} scale-103 shadow-md`
                          : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600'
                      }`}
                    >
                      {color.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description list */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Slogan / Deskripsi Singkat Mapel
              </label>
              <input
                type="text"
                placeholder="Contoh: Jurusan kimia kovalen bermuatan positif"
                value={subDesc}
                onChange={(e) => setSubDesc(e.target.value)}
                className="w-full bg-slate-50 border-2.5 border-slate-300 focus:border-indigo-500 hover:border-slate-400 font-sans text-xs px-3 py-2 rounded-xl outline-none"
              />
            </div>

            <div className="pt-3 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setActiveTab('view')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-sans font-bold text-xs px-4 py-2 rounded-xl border border-slate-300 cursor-pointer"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 border-2 border-amber-700 text-white font-sans font-extrabold text-xs px-5 py-2.5 rounded-xl cursor-pointer shadow-[3px_3px_0px_0px_#78350F] active:translate-y-0.5"
              >
                Buat Mapel Baru! 🌟
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
