'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { DailyEntry } from '@/types';
import { getDayNumber } from '@/lib/utils';

export interface AnalyticsData {
  totalDays: number;
  completedDays: number;
  overallConsistency: number;
  taskRates: {
    fitness: number;
    deep_work: number;
    learning: number;
    journal: number;
  };
  dailyData: { day: number; completion: number; fitness: boolean; deep_work: boolean; learning: boolean; journal: boolean }[];
  cycleData: { cycle: number; rate: number }[];
  bestStreak: number;
}

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        const { data: entries } = await supabase
          .from('daily_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('day_number');

        if (!entries) {
          setLoading(false);
          return;
        }

        const currentDay = getDayNumber();
        const totalDays = currentDay;

        let fitnessCount = 0;
        let deepWorkCount = 0;
        let learningCount = 0;
        let journalCount = 0;
        let completedDays = 0;

        const dailyData: { day: number; completion: number; fitness: boolean; deep_work: boolean; learning: boolean; journal: boolean }[] = [];
        const entryMap: Record<number, DailyEntry> = {};
        entries.forEach((e) => { entryMap[e.day_number] = e; });

        for (let d = 1; d <= currentDay; d++) {
          const entry = entryMap[d];
          let completion = 0;
          let fitness = false, deep_work = false, learning = false, journal = false;

          if (entry) {
            if (entry.fitness_completed) { fitnessCount++; fitness = true; completion++; }
            if (entry.deep_work_completed) { deepWorkCount++; deep_work = true; completion++; }
            if (entry.learning_completed) { learningCount++; learning = true; completion++; }
            if (entry.journal_completed) { journalCount++; journal = true; completion++; }
            if (completion === 4) completedDays++;
          }

          dailyData.push({ day: d, completion: (completion / 4) * 100, fitness, deep_work, learning, journal });
        }

        const cycleRanges = [
          [1, 14], [15, 28], [29, 42], [43, 56], [57, 70], [71, 84], [85, 100],
        ];
        const cycleData = cycleRanges.map(([start, end], idx) => {
          const cycleDays = dailyData.filter((d) => d.day >= start && d.day <= end);
          const total = cycleDays.length * 4;
          const completed = cycleDays.reduce((sum, d) => {
            let count = 0;
            if (d.fitness) count++;
            if (d.deep_work) count++;
            if (d.learning) count++;
            if (d.journal) count++;
            return sum + count;
          }, 0);
          return { cycle: idx + 1, rate: total > 0 ? (completed / total) * 100 : 0 };
        }).filter((c) => c.rate > 0);

        const { data: streaks } = await supabase
          .from('streaks')
          .select('longest_streak')
          .eq('user_id', user.id)
          .eq('streak_type', 'perfect_day')
          .single();

        setData({
          totalDays,
          completedDays,
          overallConsistency: totalDays > 0 ? ((fitnessCount + deepWorkCount + learningCount + journalCount) / (totalDays * 4)) * 100 : 0,
          taskRates: {
            fitness: totalDays > 0 ? (fitnessCount / totalDays) * 100 : 0,
            deep_work: totalDays > 0 ? (deepWorkCount / totalDays) * 100 : 0,
            learning: totalDays > 0 ? (learningCount / totalDays) * 100 : 0,
            journal: totalDays > 0 ? (journalCount / totalDays) * 100 : 0,
          },
          dailyData,
          cycleData,
          bestStreak: streaks?.longest_streak || 0,
        });
      } catch (err) {
        console.error('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return { data, loading };
}
