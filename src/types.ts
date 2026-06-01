/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  level: number; // For spaced repetition (0 = new, 1 = learning, 2 = review, 3 = mastered)
  nextReviewDate?: string; // ISO String
}

export interface Material {
  id: string;
  subjectId: string;
  title: string;
  content: string;
  points: string[];
  formulas: string[];
  flashcards: Flashcard[];
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  icon: string; // Lucide icon name string
  color: 'pink' | 'purple' | 'amber' | 'emerald' | 'sky' | 'rose' | 'indigo';
  description: string;
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji or Lucide icon name
  unlockedAt?: string; // If undefined, it is locked
  requirement: string;
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  lastStudyDate: string | null;
  badges: string[]; // List of unlocked badge IDs
  totalQuizzesPlayed: number;
  totalCorrectAnswers: number;
  totalGamesPlayed: number;
  pomodoroStudyMinutes: number;
}

export interface MatchCard {
  id: string;
  content: string; // Can be a core concept or its definition/explanation
  matchId: string; // Points to the other card that matches this
  isTerm: boolean; // True if it is a main concept, False if it is a definition/formula
  colorClass: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  subjectId: string;
  materialId?: string;
}
