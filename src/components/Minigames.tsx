/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Subject, Material, Flashcard, MatchCard, QuizQuestion } from '../types';
import Mascot from './Mascot';
import { Play, RotateCcw, AlertCircle, HelpCircle, CheckCircle, Sparkles, Smile, GraduationCap, ArrowRight, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MinigamesProps {
  currentSubjectId: string;
  subjects: Subject[];
  materials: Material[];
  addXp: (amount: number, reason: string) => void;
  incrementGamesPlayed: () => void;
  incrementQuizzesPlayed: (isAllCorrect: boolean) => void;
  incrementCorrectAnswersCount: (amount: number) => void;
}

export default function Minigames({
  currentSubjectId,
  subjects,
  materials,
  addXp,
  incrementGamesPlayed,
  incrementQuizzesPlayed,
  incrementCorrectAnswersCount
}: MinigamesProps) {
  // Tabs: 'flashcard' | 'matching' | 'quiz'
  const [activeGame, setActiveGame] = useState<'flashcard' | 'matching' | 'quiz'>('flashcard');

  // Load active materials
  const activeMaterials = materials.filter((m) => m.subjectId === currentSubjectId);
  const activeFlashcards = activeMaterials.flatMap((m) => m.flashcards);

  // Sound Synth via Web Audio API 
  const playCuteSound = (type: 'correct' | 'wrong' | 'flip' | 'win') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      if (type === 'correct') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'wrong') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(140, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'flip') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(350, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.07, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'win') {
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // Sweet chord arpeggio
        notes.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.08);
          gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.08);
          osc.stop(ctx.currentTime + i * 0.08 + 0.5);
        });
      }
    } catch (e) {
      // Ignored
    }
  };

  // ==========================================
  // GAME A: FLASHCARD VIEWER (SPACED REPETITION)
  // ==========================================
  const [currentFcIdx, setCurrentFcIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [fcFeedback, setFcFeedback] = useState<string | null>(null);

  const activeFc = activeFlashcards[currentFcIdx] || null;

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
    playCuteSound('flip');
  };

  const handleGradeFlashcard = (remembered: boolean) => {
    playCuteSound(remembered ? 'correct' : 'wrong');
    
    if (remembered) {
      addXp(10, 'Berhasil mengingat 1 kartu Flashcard! 🧠');
      setFcFeedback('✨ Wow, ingatan tajam terkonfirmasi!');
    } else {
      addXp(2, 'Belajar lagi adalah bagian dari proses mengingat! Keep it up!');
      setFcFeedback('🧸 Dicatat kembali ke bank memori.');
    }

    setTimeout(() => {
      setFcFeedback(null);
      setIsFlipped(false);
      // Next card
      if (currentFcIdx < activeFlashcards.length - 1) {
        setCurrentFcIdx((prev) => prev + 1);
      } else {
        setCurrentFcIdx(0); // Loop back
        playCuteSound('win');
        addXp(15, 'Menyelesaikan seluruh deck Flashcards pelajaran ini! 🏆');
        alert('Deck flashcards selesai dipelajari! Bubu bangga sekali padamu.');
      }
    }, 1800);
  };

  // ==========================================
  // GAME B: MATCHING CARDS TERM-DEFINITION
  // ==========================================
  const [matchCards, setMatchCards] = useState<MatchCard[]>([]);
  const [selectedMatchIds, setSelectedMatchIds] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]); // holds matched card.id values
  const [matchGameStatus, setMatchGameStatus] = useState<'idle' | 'playing' | 'won'>('idle');

  const startMatchingGame = () => {
    if (activeMaterials.length === 0) return;
    
    // Pick pairs from points/formulas
    const poolOfTerms: { term: string; definition: string }[] = [];
    
    // Pull from bullet points
    activeMaterials.forEach((m) => {
      // Create questions if points exist
      m.points.forEach((point) => {
        if (point.length > 5) {
          // split keyword from explanation if has colons or just simple chunk
          const parts = point.split(':');
          if (parts.length > 1) {
            poolOfTerms.push({ term: parts[0].trim(), definition: parts[1].trim() });
          } else {
            // grab first 2 words as terms and rest as defs
            const words = point.split(' ');
            if (words.length > 3) {
              poolOfTerms.push({
                term: words.slice(0, 2).join(' '),
                definition: words.slice(2).join(' ')
              });
            }
          }
        }
      });
      // Also pull directly from flashcards
      m.flashcards.forEach((fc) => {
        poolOfTerms.push({ term: fc.question, definition: fc.answer });
      });
    });

    // Take max 4 pairs to make a clean 4x2 grid of 8 cards
    const slicePairs = poolOfTerms.slice(0, 4);
    if (slicePairs.length < 2) {
      // Fail-safe default matching card content if list is empty
      slicePairs.push(
        { term: 'Pythagoras', definition: 'c² = a² + b²' },
        { term: 'Klorofil', definition: 'Zat hijau daun penyerap matahari' }
      );
    }

    const cardsArray: MatchCard[] = [];
    slicePairs.forEach((pair, index) => {
      const matchId = `pair-${index}`;
      
      // Card 1: Term
      cardsArray.push({
        id: `term-${index}`,
        content: pair.term,
        matchId: matchId,
        isTerm: true,
        colorClass: 'bg-[#FFDAC1] border-2 border-[#6D6875] hover:bg-[#FFDAC1]/80 text-[#6D6875]'
      });

      // Card 2: Definition
      cardsArray.push({
        id: `def-${index}`,
        content: pair.definition,
        matchId: matchId,
        isTerm: false,
        colorClass: 'bg-[#C7CEEA] border-2 border-[#6D6875] hover:bg-[#C7CEEA]/80 text-[#6D6875]'
      });
    });

    // Shuffle the cards
    const shuffled = [...cardsArray].sort(() => Math.random() - 0.5);
    setMatchCards(shuffled);
    setMatchedPairs([]);
    setSelectedMatchIds([]);
    setMatchGameStatus('playing');
    playCuteSound('flip');
  };

  const handleSelectMatchingCard = (card: MatchCard) => {
    if (selectedMatchIds.includes(card.id) || matchedPairs.includes(card.id)) return;
    
    playCuteSound('flip');

    if (selectedMatchIds.length === 1) {
      const firstCardId = selectedMatchIds[0];
      const firstCard = matchCards.find((c) => c.id === firstCardId)!;

      if (firstCard.matchId === card.matchId && firstCard.id !== card.id) {
        // MATCH DETECTED!
        playCuteSound('correct');
        setMatchedPairs((prev) => [...prev, firstCard.id, card.id]);
        setSelectedMatchIds([]);
        addXp(15, `Berhasil mencocokkan istilah: "${firstCard.content.slice(0, 15)}..."!`);
        
        // Check if all cards matched
        if (matchedPairs.length + 2 === matchCards.length) {
          setTimeout(() => {
            setMatchGameStatus('won');
            playCuteSound('win');
            addXp(30, 'Luar biasa! Menyelesaikan puzzle pencocokkan materi dengan gemilang! 🃏');
            incrementGamesPlayed();
          }, 600);
        }
      } else {
        // MISMATCH!
        setSelectedMatchIds([...selectedMatchIds, card.id]);
        playCuteSound('wrong');
        setTimeout(() => {
          setSelectedMatchIds([]);
        }, 1200);
      }
    } else {
      setSelectedMatchIds([card.id]);
    }
  };

  // ==========================================
  // GAME C: MULTIPLE CHOICE AUTOGENERATED QUIZ
  // ==========================================
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [isAnsweredQuiz, setIsAnsweredQuiz] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [quizGameStatus, setQuizGameStatus] = useState<'idle' | 'quiz-running' | 'score-screen'>('idle');

  const startQuizGame = () => {
    if (activeFlashcards.length < 2) {
      alert('Tolong buat minimal 2 materi atau pastikan di mapel ini sudah terisi beberapa flashcard/buku materi agar kuis otomatis bisa mengacak jawaban distorsi!');
      return;
    }

    // Generate dynamic quiz questions based on Flashcards
    const generatedQuestions: QuizQuestion[] = activeFlashcards.map((fc, currentIdx) => {
      // Correct answer is the flashcard answer
      const correctAns = fc.answer;
      
      // Pull distracting wrong answers from other flashcards
      const wrongAnswers = activeFlashcards
        .filter((_, idx) => idx !== currentIdx)
        .map((itm) => itm.answer);

      // Shuffle wrong answers, take up to 3 distractors
      const shuffledWrongs = wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 3);
      
      // Combine correct and incorrect ones, then shuffle
      const combinedOptions = [correctAns, ...shuffledWrongs].sort(() => Math.random() - 0.5);

      return {
        question: fc.question,
        options: combinedOptions,
        correctAnswer: correctAns,
        explanation: 'Kunci jawaban diambil langsung dari catatan flashcard belajarmu!',
        subjectId: currentSubjectId
      };
    });

    // Shuffle questions order
    setQuizQuestions(generatedQuestions.sort(() => Math.random() - 0.5));
    setQuizIdx(0);
    setSelectedQuizOption(null);
    setIsAnsweredQuiz(false);
    setCorrectAnswersCount(0);
    setQuizGameStatus('quiz-running');
  };

  const handleSelectQuizAnswer = (option: string) => {
    if (isAnsweredQuiz) return;
    
    setSelectedQuizOption(option);
    setIsAnsweredQuiz(true);
    
    const isCorrect = option === quizQuestions[quizIdx].correctAnswer;
    playCuteSound(isCorrect ? 'correct' : 'wrong');
    
    if (isCorrect) {
      setCorrectAnswersCount((prev) => prev + 1);
      addXp(12, 'Skor Jitu! Jawaban kuis benar! 🎯');
    } else {
      addXp(1, 'Hampir tepat! Jadikan kesalahan sebagai kawan mengingat.');
    }
  };

  const handleNextQuizQuestion = () => {
    setSelectedQuizOption(null);
    setIsAnsweredQuiz(false);

    if (quizIdx < quizQuestions.length - 1) {
      setQuizIdx((prev) => prev + 1);
    } else {
      // Completed last question of quiz
      setQuizGameStatus('score-screen');
      playCuteSound('win');
      
      const isPerfect = correctAnswersCount === quizQuestions.length;
      const gameBonusXp = isPerfect ? 40 : 15;
      addXp(gameBonusXp, isPerfect ? 'Piala Bintang! Semua kuis dijawab sempurna! 👑' : 'Selesai kuis, peningkatan daya simpan memori 2x lipat!');
      
      incrementQuizzesPlayed(isPerfect);
      incrementCorrectAnswersCount(correctAnswersCount);
    }
  };

  return (
    <div className="space-y-6">
      {/* Subject Tab Selection header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-sans font-black text-slate-800 flex items-center gap-1.5 leading-tight">
            🎮 Pusat Arena Game Menghafal
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Metode Active Recall & Spaced Repetition yang dibalut imut, membuat hafalan UAS terserap secepat kilat!
          </p>
        </div>

        {/* Tab Buttons for Game Mode */}
        <div className="flex border-3 border-[#6D6875] bg-white p-1 rounded-2xl shadow-[3px_3px_0px_#6D6875]">
          <button
            onClick={() => {
              setActiveGame('flashcard');
              setIsFlipped(false);
              setFcFeedback(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-sans font-black transition-all cursor-pointer ${
              activeGame === 'flashcard' ? 'bg-[#FF9AA2] text-white shadow-sm' : 'text-[#6D6875] hover:bg-slate-50'
            }`}
          >
            🎴 Flashcard 3D
          </button>
          <button
            onClick={() => {
              setActiveGame('matching');
              setMatchGameStatus('idle');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-sans font-black transition-all cursor-pointer ${
              activeGame === 'matching' ? 'bg-[#C7CEEA] text-[#6D6875] shadow-sm' : 'text-[#6D6875] hover:bg-slate-50'
            }`}
          >
            🃏 Pilah Kartu
          </button>
          <button
            onClick={() => {
              setActiveGame('quiz');
              setQuizGameStatus('idle');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-sans font-black transition-all cursor-pointer ${
              activeGame === 'quiz' ? 'bg-[#FFDAC1] text-[#6D6875] shadow-sm' : 'text-[#6D6875] hover:bg-slate-50'
            }`}
          >
            🎯 Kuis Pintar
          </button>
        </div>
      </div>

      {/* RENDER FALLBACK IF CURRENT SUBJECT CONTAINS ZERO FLASHCARDS */}
      {activeFlashcards.length === 0 ? (
        <div className="bg-white border-3 border-[#6D6875] p-8 text-center rounded-3xl max-w-md mx-auto shadow-[4px_4px_0px_#6D6875]">
          <Mascot mood="wrong" size={110} speechBubble="Wah, lemari kartu bimbingan belajarmu kosong!" />
          <h4 className="font-sans font-black text-slate-800 text-md mt-4">Belum Ada Materi Terisi</h4>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Peralatan game mengingat memerlukan minimal <strong>1 Catatan Materi</strong> yang memiliki baris kuis flashcard. Silahkan masuk ke tab <strong>Tambah Catatan Materi</strong> terlebih dahulu untuk menuliskannya.
          </p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {/* ========================================================== */}
          {/* GAME 1: FLASHCARDS VIEWER (SPACED REPETITION) */}
          {/* ========================================================== */}
          {activeGame === 'flashcard' && activeFc && (
            <motion.div
              key="game-flashcard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto space-y-6"
            >
              {/* Deck progress status bar */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>🎴 Deck Belajar: {currentFcIdx + 1} / {activeFlashcards.length} Kartu</span>
                <span className="font-mono bg-pink-50 border border-pink-200 px-2 py-0.5 rounded-full text-pink-600">
                  Kemampuan Teruji
                </span>
              </div>

              {/* Interactive Flippable 3D Card Box */}
              <div className="perspective-1000 h-64 w-full cursor-pointer relative" onClick={handleFlipCard}>
                <motion.div
                  className="w-full h-full duration-500 transform-style-3d relative"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                  {/* CARD FRONT SIDE */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rounded-3xl border-3 border-[#6D6875] p-6 flex flex-col items-center justify-center text-center shadow-[6px_6px_0px_#6D6875] bg-[#FFDAC1]">
                    <span className="text-xs font-black text-[#6D6875] uppercase tracking-widest mb-4 flex items-center gap-1">
                      <Layers size={12} /> TANYA (ACTIVE RECALL)
                    </span>
                    <h3 className="text-lg font-sans font-black text-[#6D6875] leading-snug px-3 mb-6">
                      {activeFc.question}
                    </h3>
                    <span className="text-[10px] font-bold text-[#6D6875] animate-pulse bg-white/80 border border-[#6D6875] px-3 py-1 rounded-full">
                      Tap Kartu untuk Balik & Lihat Jawaban! 👆
                    </span>
                  </div>

                  {/* CARD BACK SIDE */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rounded-3xl border-3 border-[#6D6875] p-6 flex flex-col items-center justify-center text-center shadow-[6px_6px_0px_#6D6875] bg-[#B5EAD7] transform rotate-y-180">
                    <span className="text-xs font-black text-[#6D6875] uppercase tracking-widest mb-4 flex items-center gap-1">
                      <CheckCircle size={12} /> KUNCI JAWABAN
                    </span>
                    <h3 className="text-md font-sans font-extrabold text-[#6D6875] leading-relaxed px-2 mb-6">
                      {activeFc.answer}
                    </h3>
                    <span className="text-[10px] font-bold text-[#6D6875] bg-white border border-[#6D6875] px-3 py-1 rounded-full">
                      Tap Kartu untuk melihat kembali pertanyaan!
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Interactive Self-Evaluator buttons (Active Recall Scoring) */}
              <AnimatePresence>
                {fcFeedback ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="bg-indigo-50 border-2 border-indigo-400 p-3 rounded-2xl text-center text-xs font-bold text-indigo-800"
                  >
                    {fcFeedback}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-4 justify-center"
                  >
                    <button
                      onClick={() => handleGradeFlashcard(false)}
                      className="flex-1 bg-red-100 hover:bg-red-200 border-2.5 border-red-500 text-red-700 font-sans font-black text-xs px-4 py-3 rounded-2xl cursor-pointer shadow-[3px_3px_0px_0px_#991B1B] active:translate-y-0.5 transition-all text-center flex justify-center items-center gap-1"
                    >
                      😭 Belum Hafal
                    </button>
                    <button
                      onClick={() => handleGradeFlashcard(true)}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 border-2.5 border-emerald-700 text-white font-sans font-black text-xs px-4 py-3 rounded-2xl cursor-pointer shadow-[3px_3px_0px_0px_#047857] active:translate-y-0.5 transition-all text-center flex justify-center items-center gap-1 animate-bounce"
                    >
                      🤩 Sudah Hafal!
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom Buddy Help */}
              <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3 text-center text-[10px] text-amber-800 leading-relaxed">
                <strong>Spaced repetition:</strong> Sistem akan mengulang deck ini secara dinamis hingga Endut menghafal seluruh konsep dengan sempurna.
              </div>
            </motion.div>
          )}

          {/* ========================================================== */}
          {/* GAME 2: MATCHING CARD GAME */}
          {/* ========================================================== */}
          {activeGame === 'matching' && (
            <motion.div
              key="game-matching"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto space-y-6"
            >
              {matchGameStatus === 'idle' && (
                <div className="bg-slate-50 border-2.5 border-slate-300 rounded-3xl p-8 text-center max-w-sm mx-auto space-y-4">
                  <span className="text-4xl">🃏</span>
                  <h3 className="text-md font-sans font-black text-slate-800">Cari Jodoh Kartu Materi</h3>
                  <p className="text-xs text-slate-550 leading-relaxed px-2">
                    Cari dan cocokkan kata istilah di sebelah kiri dengan deskripsi makna yang tepat di sebelah kanan!
                  </p>
                  <button
                    onClick={startMatchingGame}
                    className="bg-indigo-600 hover:bg-indigo-700 border-2 border-indigo-800 text-white text-xs font-sans font-black px-6 py-2.5 rounded-2xl cursor-pointer shadow-[3px_3px_0px_0px_#1E3A8A]"
                  >
                    Mulai Permainan Pilah! 🚀
                  </button>
                </div>
              )}

              {matchGameStatus === 'playing' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500 px-1">
                    <span>💡 Tap satu istilah cerah lalu disusul penjelasan pengertiannya yang tepat!</span>
                    <span>🧩 Pasangan Terbuka: {matchedPairs.length / 2} / {matchCards.length / 2}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    {matchCards.map((card) => {
                      const isSelected = selectedMatchIds.includes(card.id);
                      const isMatched = matchedPairs.includes(card.id);

                      return (
                        <motion.div
                          key={card.id}
                          whileHover={!isMatched ? { y: -2, scale: 1.01 } : {}}
                          onClick={() => !isMatched && handleSelectMatchingCard(card)}
                          className={`min-h-[110px] p-3 rounded-2xl border-2.5 flex flex-col justify-between cursor-pointer text-center select-none shadow-sm relative overflow-hidden transition-all duration-300 ${
                            isMatched
                              ? 'bg-slate-100 border-slate-200 opacity-40 filter scale-95 hover:shadow-none'
                              : isSelected
                              ? 'bg-pink-100 border-pink-500 text-pink-900 shadow-md ring-2 ring-pink-300'
                              : card.colorClass
                          }`}
                        >
                          {/* Checked completed badge on top */}
                          {isMatched && (
                            <span className="absolute top-1.5 right-1.5 text-xs text-emerald-500">
                              ✔️ MATCH!
                            </span>
                          )}

                          <span className="text-[10px] font-sans font-black uppercase text-slate-400 tracking-wider">
                            {card.isTerm ? '🏷️ Istilah' : '💡 Definisi / Jawaban'}
                          </span>

                          <p className="text-xs font-bold text-slate-800 font-sans leading-tight hyphens-auto break-words min-h-[50px] flex items-center justify-center p-1">
                            {card.content}
                          </p>

                          <div></div>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="text-center">
                    <button
                      onClick={startMatchingGame}
                      className="bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-600 hover:text-slate-800 text-[11px] font-sans font-bold px-4 py-2 rounded-xl cursor-pointer"
                    >
                      Acak Ulang Kartu 🔄
                    </button>
                  </div>
                </div>
              )}

              {matchGameStatus === 'won' && (
                <div className="bg-emerald-50 border-3 border-emerald-400 rounded-3xl p-8 text-center max-w-sm mx-auto space-y-4">
                  <span className="text-5xl animate-bounce inline-block">👑</span>
                  <h3 className="text-lg font-sans font-black text-emerald-800">Hebat! Semua Terpasang Sempurna</h3>
                  <p className="text-xs text-emerald-700 leading-relaxed px-2">
                    Ingatanmu sangat tajam dan melesat luar biasa! Bubu memberikanmu <strong>+30 XP bonus pahlawan belajar</strong>!
                  </p>
                  <div className="flex gap-3 justify-center pt-2">
                    <button
                      onClick={startMatchingGame}
                      className="bg-emerald-500 hover:bg-emerald-600 border-2 border-emerald-700 text-white text-xs font-sans font-black px-5 py-2.5 rounded-2xl cursor-pointer shadow-[3px_3px_0px_0px_#065F46]"
                    >
                      Main Lagi 🎉
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ========================================================== */}
          {/* GAME 3: QUICK MULTIPLE CHOICE QUIZ */}
          {/* ========================================================== */}
          {activeGame === 'quiz' && (
            <motion.div
              key="game-quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-lg mx-auto space-y-6"
            >
              {quizGameStatus === 'idle' && (
                <div className="bg-slate-50 border-2.5 border-slate-300 rounded-3xl p-8 text-center max-w-sm mx-auto space-y-4">
                  <span className="text-4xl text-amber-500">🏆</span>
                  <h3 className="text-md font-sans font-black text-slate-800">Quiz Petualangan UAS</h3>
                  <p className="text-xs text-slate-550 leading-relaxed px-2">
                    Uji pemahamanmu secara komprehensif menggunakan kuis interaktif 4 pilihan otomatis dari bank materimu sendiri.
                  </p>
                  <button
                    onClick={startQuizGame}
                    className="bg-amber-500 hover:bg-amber-600 border-2 border-amber-700 text-white text-xs font-sans font-black px-6 py-2.5 rounded-2xl cursor-pointer shadow-[3px_3px_0px_0px_#78350F]"
                  >
                    Mulai Ujian Ceria! 🎯
                  </button>
                </div>
              )}

              {quizGameStatus === 'quiz-running' && quizQuestions[quizIdx] && (
                <div className="space-y-4">
                  {/* Progress quiz indicators */}
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500 px-1 mb-1">
                    <span>📋 Soal Kuis: {quizIdx + 1} / {quizQuestions.length}</span>
                    <span>⭐ Benar: {correctAnswersCount}</span>
                  </div>

                  {/* Question Box */}
                  <div className="bg-white border-3 border-slate-800 rounded-3xl p-6 shadow-[4px_4px_0px_0px_#1E293B] relative overflow-hidden">
                    <span className="absolute top-2 right-3 opacity-15">
                      <HelpCircle size={45} />
                    </span>
                    <span className="text-[10px] font-sans font-black uppercase text-amber-600 tracking-wider flex items-center gap-1 mb-2">
                      <GraduationCap size={12} /> SOAL EVALUASI UAS
                    </span>
                    <h3 className="text-sm font-sans font-extrabold text-slate-850 leading-relaxed pr-8">
                      {quizQuestions[quizIdx].question}
                    </h3>
                  </div>

                  {/* Multiple Choice Options */}
                  <div className="grid grid-cols-1 gap-3 pt-2">
                    {quizQuestions[quizIdx].options.map((option, idx) => {
                      const isSelected = selectedQuizOption === option;
                      const isCorrectAnswer = option === quizQuestions[quizIdx].correctAnswer;
                      
                      let optionStyle = 'bg-white border-slate-200 hover:border-slate-400 hover:bg-slate-50/50';
                      
                      if (isAnsweredQuiz) {
                        if (isCorrectAnswer) {
                          optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-300';
                        } else if (isSelected) {
                          optionStyle = 'bg-red-50 border-red-500 text-red-950 ring-2 ring-red-300';
                        } else {
                          optionStyle = 'bg-slate-50 border-slate-200 opacity-65';
                        }
                      }

                      return (
                        <motion.button
                          key={idx}
                          whileHover={!isAnsweredQuiz ? { x: 3 } : {}}
                          disabled={isAnsweredQuiz}
                          onClick={() => handleSelectQuizAnswer(option)}
                          className={`w-full text-left p-4 rounded-2xl border-2.5 transition-all outline-none font-sans font-semibold text-xs flex justify-between items-center cursor-pointer ${optionStyle}`}
                        >
                          <span>{option}</span>
                          
                          {/* Indicators inside choices */}
                          {isAnsweredQuiz && (
                            <span>
                              {isCorrectAnswer ? '🟢 BENAR' : isSelected ? '🔴 SALAH' : ''}
                            </span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Feedback explanation / Next Question action button */}
                  {isAnsweredQuiz && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-4 mt-4 flex items-center justify-between gap-4"
                    >
                      <div className="text-xs">
                        <h4 className="font-bold text-indigo-900 flex items-center gap-1">
                          🎈 Penjelasan Guru Bubu:
                        </h4>
                        <p className="text-indigo-700 leading-normal mt-0.5">
                          {selectedQuizOption === quizQuestions[quizIdx].correctAnswer
                            ? 'Luar biasa sekali jitu cerdas! Jawabanmu sangat akurat.'
                            : `Hampir! Kunci jawaban yang tepat adalah "${quizQuestions[quizIdx].correctAnswer}". Jangan berkecil hati ya.`}
                        </p>
                      </div>

                      <button
                        onClick={handleNextQuizQuestion}
                        className="bg-indigo-600 hover:bg-indigo-700 border-2 border-indigo-800 text-white font-sans font-black text-xs px-4 py-2.5 rounded-xl shrink-0 cursor-pointer shadow-[2px_2px_0px_0px_#1E3A8A] flex items-center gap-1 active:translate-y-0.5"
                      >
                        Lanjut <ArrowRight size={14} />
                      </button>
                    </motion.div>
                  )}
                </div>
              )}

              {quizGameStatus === 'score-screen' && (
                <div className="bg-white border-3 border-slate-800 rounded-3xl p-6 text-center max-w-sm mx-auto shadow-[5px_5px_0px_0px_#1E293B] space-y-4">
                  <Mascot
                    mood={correctAnswersCount === quizQuestions.length ? 'happy' : 'thinking'}
                    size={110}
                    speechBubble={`Endut berhasil menjawab ${correctAnswersCount} dengan tepat dari total ${quizQuestions.length} Soal UAS!`}
                  />
                  
                  <div className="pt-2">
                    <span className="text-[10px] font-mono font-black uppercase text-amber-500 block">
                      PETUALANGAN KUIS SELESAI
                    </span>
                    <h3 className="text-xl font-sans font-black text-slate-800">
                      Rangkuman Skor Belajar
                    </h3>
                  </div>

                  <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 inline-block font-sans">
                    <div className="text-4xl font-extrabold text-indigo-600">
                      {Math.round((correctAnswersCount / quizQuestions.length) * 100)}%
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 leading-none">Skor Kelulusan UAS</p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed px-1">
                    {correctAnswersCount === quizQuestions.length
                      ? 'Nilai Sempurna! Endut pantas mendapatkan gelar "Bintang Utama Kelas" UAS!'
                      : 'Petualangan kuis yang mantap! Baca kembali rangkuman materi lalu coba lagi untuk meningkatkan skormu.'}
                  </p>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setQuizGameStatus('idle')}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-slate-700 text-xs font-sans font-black py-2.5 rounded-xl cursor-pointer"
                    >
                      Keluar
                    </button>
                    <button
                      onClick={startQuizGame}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 border-2 border-amber-800 text-white text-xs font-sans font-black py-2.5 rounded-xl cursor-pointer shadow-[3px_3px_0px_0px_#78350F]"
                    >
                      Acak Kuis Lagi 🔄
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
