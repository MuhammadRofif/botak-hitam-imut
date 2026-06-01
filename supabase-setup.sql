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
