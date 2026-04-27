'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DayCell } from './DayCell';
import { createClient } from '@/lib/supabase/client';
import { DailyEntry, DayStatus } from '@/types';
import { getDayNumber, getDayStatus, getCompletionPercentage } from '@/lib/utils';
import { CYCLES, TOTAL_DAYS } from '@/lib/constants';

interface HundredDayGridProps {
  onDayClick: (day: number) => void;
}

export function HundredDayGrid({ onDayClick }: HundredDayGridProps) {
  const [entries, setEntries] = useState<Record<number, DailyEntry>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const user = session.user;

      const { data } = await supabase
        .from('daily_entries')
        .select('*')
        .eq('user_id', user.id);

      if (data) {
        const entryMap: Record<number, DailyEntry> = {};
        data.forEach((e) => { entryMap[e.day_number] = e; });
        setEntries(entryMap);
      }
      setLoading(false);
    };

    fetchEntries();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-10 gap-1.5">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-lg bg-surface border border-border animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Cycle labels */}
      <div className="grid grid-cols-10 gap-1.5">
        {Array.from({ length: TOTAL_DAYS }, (_, i) => {
          const dayNumber = i + 1;
          const entry = entries[dayNumber] || null;
          const status: DayStatus = getDayStatus(dayNumber, entry);
          const completionPercent = getCompletionPercentage(entry);

          return (
            <DayCell
              key={dayNumber}
              dayNumber={dayNumber}
              status={status}
              completionPercent={completionPercent}
              index={i}
              onClick={onDayClick}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-success/15 border border-success/40" />
          <span>Complete</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-warning/10 border border-warning/30" />
          <span>Partial</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-danger/10 border border-danger/30" />
          <span>Missed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-accent/10 border border-accent ring-1 ring-accent/20" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-elevated/50 border border-border/50" />
          <span>Future</span>
        </div>
      </div>

      {/* Cycle markers */}
      <div className="flex flex-wrap gap-2">
        {CYCLES.map((cycle) => (
          <div
            key={cycle.id}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-elevated border border-border text-xs"
          >
            <span className="font-medium text-accent">C{cycle.id}</span>
            <span className="text-text-muted">
              Day {cycle.start_day}–{cycle.end_day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
