/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';
import { Subject, Material, UserStats } from '../types';

// Supabase Database Table Schemas for references:
/*
========================================================================
SQL TABLE SETUP TEMPLATE (Run this in Supabase SQL Editor to setup):
========================================================================

-- Enable UUID extension if needed
create extension if not exists "uuid-ossp";

-- 1. Subjects Table
create table if not exists subjects (
  id text primary key,
  name text not null,
  icon text not null,
  color text not null,
  description text not null,
  "createdAt" text not null default now()
);

-- Enable RLS & Select/Insert/Update/Delete permissions for everyone (Anon)
alter table subjects enable row level security;
create policy "Allow public read subjects" on subjects for select using (true);
create policy "Allow public write subjects" on subjects for insert with check (true);
create policy "Allow public update subjects" on subjects for update using (true);
create policy "Allow public delete subjects" on subjects for delete using (true);

-- 2. Materials Table
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
create policy "Allow public read materials" on materials for select using (true);
create policy "Allow public write materials" on materials for insert with check (true);
create policy "Allow public update materials" on materials for update using (true);
create policy "Allow public delete materials" on materials for delete using (true);

-- 3. User Stats Table
create table if not exists user_stats (
  id text primary key, -- usually 'default_user'
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
create policy "Allow public read user_stats" on user_stats for select using (true);
create policy "Allow public write user_stats" on user_stats for insert with check (true);
create policy "Allow public update user_stats" on user_stats for update using (true);
create policy "Allow public delete user_stats" on user_stats for delete using (true);

========================================================================
*/

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'MY_SUPABASE_URL');

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Fetch all subjects from Supabase
 */
export async function getSupabaseSubjects(): Promise<Subject[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching subjects from Supabase:', error);
      return null;
    }
    return data as Subject[];
  } catch (err) {
    console.error('Supabase getSubjects failed:', err);
    return null;
  }
}

/**
 * Save / Upsert a single subject in Supabase
 */
export async function saveSupabaseSubject(subject: Subject): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('subjects')
      .upsert({
        id: subject.id,
        name: subject.name,
        icon: subject.icon,
        color: subject.color,
        description: subject.description,
        createdAt: subject.createdAt
      });

    if (error) {
      console.error('Error saving subject to Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase saveSubject failed:', err);
    return false;
  }
}

/**
 * Delete a subject and its associated materials
 */
export async function deleteSupabaseSubject(subjectId: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    // Delete materials associated with subject
    await supabase.from('materials').delete().eq('subjectId', subjectId);
    
    // Delete subject
    const { error } = await supabase.from('subjects').delete().eq('id', subjectId);
    if (error) {
      console.error('Error deleting subject from Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase deleteSubject failed:', err);
    return false;
  }
}

/**
 * Fetch all materials from Supabase
 */
export async function getSupabaseMaterials(): Promise<Material[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching materials from Supabase:', error);
      return null;
    }
    return data as Material[];
  } catch (err) {
    console.error('Supabase getMaterials failed:', err);
    return null;
  }
}

/**
 * Save / Upsert a material in Supabase
 */
export async function saveSupabaseMaterial(material: Material): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('materials')
      .upsert({
        id: material.id,
        subjectId: material.subjectId,
        title: material.title,
        content: material.content,
        points: material.points || [],
        formulas: material.formulas || [],
        flashcards: material.flashcards || [],
        createdAt: material.createdAt
      });

    if (error) {
      console.error('Error saving material to Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase saveMaterial failed:', err);
    return false;
  }
}

/**
 * Delete a material from Supabase
 */
export async function deleteSupabaseMaterial(materialId: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('materials').delete().eq('id', materialId);
    if (error) {
      console.error('Error deleting material from Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase deleteMaterial failed:', err);
    return false;
  }
}

/**
 * Fetch user stats from Supabase
 */
export async function getSupabaseUserStats(userId = 'default_user'): Promise<UserStats | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching stats from Supabase:', error);
      return null;
    }
    if (!data) return null;

    // Map database fields to application fields
    return {
      xp: data.xp,
      level: data.level,
      streak: data.streak,
      lastStudyDate: data.lastStudyDate,
      badges: data.badges || [],
      totalQuizzesPlayed: data.totalQuizzesPlayed || 0,
      totalCorrectAnswers: data.totalCorrectAnswers || 0,
      totalGamesPlayed: data.totalGamesPlayed || 0,
      pomodoroStudyMinutes: data.pomodoroStudyMinutes || 0
    };
  } catch (err) {
    console.error('Supabase getUserStats failed:', err);
    return null;
  }
}

/**
 * Save / Upsert user stats in Supabase
 */
export async function saveSupabaseUserStats(stats: UserStats, userId = 'default_user'): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('user_stats')
      .upsert({
        id: userId,
        xp: stats.xp,
        level: stats.level,
        streak: stats.streak,
        lastStudyDate: stats.lastStudyDate,
        badges: stats.badges,
        totalQuizzesPlayed: stats.totalQuizzesPlayed,
        totalCorrectAnswers: stats.totalCorrectAnswers,
        totalGamesPlayed: stats.totalGamesPlayed,
        pomodoroStudyMinutes: stats.pomodoroStudyMinutes,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error saving user stats to Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase saveUserStats failed:', err);
    return false;
  }
}

/**
 * Seed all local storage data into Supabase (Runs on first migration)
 */
export async function seedLocalStorageToSupabase(
  localSubjects: Subject[],
  localMaterials: Material[],
  localStats: UserStats
): Promise<boolean> {
  if (!supabase) return false;
  try {
    console.log('Seeding local storage data to Supabase...');
    
    // 1. Seed Subjects
    for (const sub of localSubjects) {
      await saveSupabaseSubject(sub);
    }

    // 2. Seed Materials
    for (const mat of localMaterials) {
      await saveSupabaseMaterial(mat);
    }

    // 3. Seed Stats
    await saveSupabaseUserStats(localStats);

    console.log('Seeding completed successfully!');
    return true;
  } catch (err) {
    console.error('Error seeding data to Supabase:', err);
    return false;
  }
}
