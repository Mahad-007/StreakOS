-- StreakOS: 100 Days of Success Tracking Tool
-- Initial database schema

-- Profiles table (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  avatar_url text,
  role text not null default 'member' check (role in ('admin', 'member')),
  joined_at timestamptz not null default now()
);

-- Daily entries (core tracking table)
create table if not exists public.daily_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  day_number int not null check (day_number between 1 and 100),
  entry_date date not null,
  -- Task completion
  fitness_completed boolean not null default false,
  deep_work_completed boolean not null default false,
  learning_completed boolean not null default false,
  journal_completed boolean not null default false,
  -- Discipline flags
  no_fast_food boolean not null default false,
  no_late_scrolling boolean not null default false,
  sleep_on_time boolean not null default false,
  proper_grooming boolean not null default false,
  -- Notes and extras
  deep_work_hours numeric(3,1) not null default 0,
  learning_topic text,
  journal_content text,
  notes text,
  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Constraints
  unique(user_id, day_number)
);

-- Cycles table (pre-seeded)
create table if not exists public.cycles (
  id int primary key,
  title text not null,
  theme text,
  start_day int not null,
  end_day int not null,
  start_date date not null,
  end_date date not null,
  goals jsonb default '[]'::jsonb,
  key_deliverables jsonb default '[]'::jsonb,
  reward text,
  warnings jsonb default '[]'::jsonb
);

-- Streaks (cached, updated on entry changes)
create table if not exists public.streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  streak_type text not null check (streak_type in ('fitness', 'deep_work', 'learning', 'journal', 'perfect_day')),
  current_streak int not null default 0,
  longest_streak int not null default 0,
  last_completed_day int,
  updated_at timestamptz not null default now(),
  unique(user_id, streak_type)
);

-- Achievements / badges
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  badge_type text not null,
  day_earned int not null,
  earned_at timestamptz not null default now(),
  unique(user_id, badge_type)
);

-- Weekly meeting logs
create table if not exists public.weekly_meetings (
  id uuid primary key default gen_random_uuid(),
  week_number int not null,
  meeting_date date not null,
  attendees jsonb default '[]'::jsonb,
  notes text,
  created_at timestamptz not null default now()
);

-- ===== ROW LEVEL SECURITY =====

alter table public.profiles enable row level security;
alter table public.daily_entries enable row level security;
alter table public.cycles enable row level security;
alter table public.streaks enable row level security;
alter table public.achievements enable row level security;
alter table public.weekly_meetings enable row level security;

-- Profiles: all authenticated can read, own can update
create policy "Anyone can view profiles" on public.profiles
  for select using (true);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Daily entries: all authenticated can read, own can write
create policy "Anyone can view daily entries" on public.daily_entries
  for select using (true);

create policy "Users can insert own entries" on public.daily_entries
  for insert with check (auth.uid() = user_id);

create policy "Users can update own entries" on public.daily_entries
  for update using (auth.uid() = user_id);

-- Cycles: all can read (pre-seeded, admin-managed)
create policy "Anyone can view cycles" on public.cycles
  for select using (true);

-- Streaks: all can read, own can write
create policy "Anyone can view streaks" on public.streaks
  for select using (true);

create policy "Users can manage own streaks" on public.streaks
  for all using (auth.uid() = user_id);

-- Achievements: all can read, own can write
create policy "Anyone can view achievements" on public.achievements
  for select using (true);

create policy "Users can insert own achievements" on public.achievements
  for insert with check (auth.uid() = user_id);

-- Weekly meetings: all can read and write
create policy "Anyone can view meetings" on public.weekly_meetings
  for select using (true);

create policy "Authenticated can manage meetings" on public.weekly_meetings
  for all using (auth.role() = 'authenticated');

-- ===== SEED CYCLES DATA =====

insert into public.cycles (id, title, theme, start_day, end_day, start_date, end_date, goals, key_deliverables, reward, warnings) values
(1, 'Foundation & Ignition', 'Build the engine. Establish discipline. Prove we can execute.', 1, 14, '2026-04-27', '2026-05-10',
 '["Open the revenue pipeline — 30 quality Contra applications, 10–12% response rate, ≥1 discovery call booked.", "Ship one product publicly — MVP live with ≥3 active users giving feedback by Day 14.", "Establish the discipline floor — zero misses on daily fitness and deep-work blocks across days 1–7."]'::jsonb,
 '["Contra application tracker with 30 logged apps, ≥3 responses, ≥1 booked call.", "Live public product URL with ≥3 real users and written feedback captured.", "Cycle 1 retro doc covering wins, misses, and Cycle 2 priorities."]'::jsonb,
 'Movie Night',
 '["First cycle — habit formation is fragile. No exceptions in days 1–7."]'::jsonb),
(2, 'Cycle 2', 'TBD — fill in as cycle approaches.', 15, 28, '2026-05-11', '2026-05-24', '[]'::jsonb, '[]'::jsonb, 'Team Dinner', '[]'::jsonb),
(3, 'Cycle 3 — Eid Cycle', 'TBD — heavy holiday load. Plan reduced output.', 29, 42, '2026-05-25', '2026-06-07', '[]'::jsonb, '[]'::jsonb, 'Fun Activity',
 '["Eid-ul-Azha falls May 27–29. Three holidays + Friday meeting collision.", "Plan only essential client work in last 4 days."]'::jsonb),
(4, 'Cycle 4', 'TBD', 43, 56, '2026-06-08', '2026-06-21', '[]'::jsonb, '[]'::jsonb, 'Movie Night',
 '["Cycle ends right before Muharram. Build buffer for next cycle''s slow start."]'::jsonb),
(5, 'Cycle 5', 'TBD', 57, 70, '2026-06-22', '2026-07-05', '[]'::jsonb, '[]'::jsonb, 'Team Dinner',
 '["Opens with Muharram (Jun 24–25). Low-output start expected."]'::jsonb),
(6, 'Cycle 6', 'TBD', 71, 84, '2026-07-06', '2026-07-19', '[]'::jsonb, '[]'::jsonb, 'Fun Activity', '[]'::jsonb),
(7, 'Cycle 7 — The Final Push', 'TBD — 16 days. Land the runway. Day 100 = Aug 4.', 85, 100, '2026-07-20', '2026-08-04', '[]'::jsonb, '[]'::jsonb, 'Founder of Discipline Award',
 '["16 days, not 14. Don''t peak too early.", "Independence Day (Aug 14) follows Day 100 — symbolic finish line."]'::jsonb);

-- ===== FUNCTION: Auto-create profile on signup =====

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ===== FUNCTION: Update streaks on entry change =====

create or replace function public.update_streaks()
returns trigger as $$
declare
  streak_types text[] := array['fitness', 'deep_work', 'learning', 'journal'];
  stype text;
  completed boolean;
  cur_streak int;
  max_streak int;
  prev_day int;
begin
  foreach stype in array streak_types loop
    -- Check if this task was completed
    execute format('select ($1).%I_completed', stype) into completed using new;

    -- Get previous streak
    select current_streak, longest_streak, last_completed_day
    into cur_streak, max_streak, prev_day
    from public.streaks
    where user_id = new.user_id and streak_type = stype;

    if completed then
      if prev_day is not null and new.day_number = prev_day + 1 then
        cur_streak := cur_streak + 1;
      else
        cur_streak := 1;
      end if;
      max_streak := greatest(coalesce(max_streak, 0), cur_streak);

      insert into public.streaks (user_id, streak_type, current_streak, longest_streak, last_completed_day)
      values (new.user_id, stype, cur_streak, max_streak, new.day_number)
      on conflict (user_id, streak_type)
      do update set current_streak = cur_streak, longest_streak = max_streak, last_completed_day = new.day_number, updated_at = now();
    end if;
  end loop;

  -- Perfect day streak
  if new.fitness_completed and new.deep_work_completed and new.learning_completed and new.journal_completed then
    select current_streak, longest_streak, last_completed_day
    into cur_streak, max_streak, prev_day
    from public.streaks
    where user_id = new.user_id and streak_type = 'perfect_day';

    if prev_day is not null and new.day_number = prev_day + 1 then
      cur_streak := coalesce(cur_streak, 0) + 1;
    else
      cur_streak := 1;
    end if;
    max_streak := greatest(coalesce(max_streak, 0), cur_streak);

    insert into public.streaks (user_id, streak_type, current_streak, longest_streak, last_completed_day)
    values (new.user_id, 'perfect_day', cur_streak, max_streak, new.day_number)
    on conflict (user_id, streak_type)
    do update set current_streak = cur_streak, longest_streak = max_streak, last_completed_day = new.day_number, updated_at = now();
  end if;

  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_daily_entry_upsert
  after insert or update on public.daily_entries
  for each row execute procedure public.update_streaks();
