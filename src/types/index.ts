export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  role: 'admin' | 'member';
  joined_at: string;
}

export interface DailyEntry {
  id: string;
  user_id: string;
  day_number: number;
  entry_date: string;
  fitness_completed: boolean;
  deep_work_completed: boolean;
  learning_completed: boolean;
  journal_completed: boolean;
  no_fast_food: boolean;
  no_late_scrolling: boolean;
  sleep_on_time: boolean;
  proper_grooming: boolean;
  deep_work_hours: number;
  learning_topic: string | null;
  journal_content: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Cycle {
  id: number;
  title: string;
  theme: string;
  start_day: number;
  end_day: number;
  start_date: string;
  end_date: string;
  goals: string[];
  key_deliverables: string[];
  reward: string;
  warnings: string[];
}

export interface Streak {
  id: string;
  user_id: string;
  streak_type: 'fitness' | 'deep_work' | 'learning' | 'journal' | 'perfect_day';
  current_streak: number;
  longest_streak: number;
  last_completed_day: number | null;
}

export interface Achievement {
  id: string;
  user_id: string;
  badge_type: string;
  day_earned: number;
  earned_at: string;
}

export interface WeeklyMeeting {
  id: string;
  week_number: number;
  meeting_date: string;
  attendees: string[];
  notes: string | null;
}

export type TaskType = 'fitness' | 'deep_work' | 'learning' | 'journal';

export interface TaskDefinition {
  id: TaskType;
  label: string;
  icon: string;
  time: string;
  description: string;
  color: string;
}

export type DayStatus = 'complete' | 'partial' | 'missed' | 'today' | 'future' | 'rest';
