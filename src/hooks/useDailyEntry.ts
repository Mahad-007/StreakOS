'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { DailyEntry, TaskType } from '@/types';
import { getDayNumber, getDateForDay } from '@/lib/utils';

export function useDailyEntry(dayNumber?: number) {
  const targetDay = dayNumber ?? getDayNumber();
  const [entry, setEntry] = useState<DailyEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchEntry = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('daily_entries')
      .select('*')
      .eq('user_id', user.id)
      .eq('day_number', targetDay)
      .single();

    setEntry(data);
    setLoading(false);
  }, [targetDay]);

  useEffect(() => {
    fetchEntry();
  }, [fetchEntry]);

  const toggleTask = async (task: TaskType) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const field = `${task}_completed` as keyof DailyEntry;
    const newValue = !entry?.[field];

    if (entry) {
      // Update existing entry
      const { data } = await supabase
        .from('daily_entries')
        .update({ [field]: newValue, updated_at: new Date().toISOString() })
        .eq('id', entry.id)
        .select()
        .single();
      if (data) setEntry(data);
    } else {
      // Create new entry
      const entryDate = getDateForDay(targetDay).toISOString().split('T')[0];
      const { data } = await supabase
        .from('daily_entries')
        .insert({
          user_id: user.id,
          day_number: targetDay,
          entry_date: entryDate,
          [field]: newValue,
        })
        .select()
        .single();
      if (data) setEntry(data);
    }
  };

  const toggleDiscipline = async (rule: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const newValue = !entry?.[rule as keyof DailyEntry];

    if (entry) {
      const { data } = await supabase
        .from('daily_entries')
        .update({ [rule]: newValue, updated_at: new Date().toISOString() })
        .eq('id', entry.id)
        .select()
        .single();
      if (data) setEntry(data);
    } else {
      const entryDate = getDateForDay(targetDay).toISOString().split('T')[0];
      const { data } = await supabase
        .from('daily_entries')
        .insert({
          user_id: user.id,
          day_number: targetDay,
          entry_date: entryDate,
          [rule]: newValue,
        })
        .select()
        .single();
      if (data) setEntry(data);
    }
  };

  const updateNotes = async (field: 'journal_content' | 'learning_topic' | 'notes', value: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (entry) {
      const { data } = await supabase
        .from('daily_entries')
        .update({ [field]: value, updated_at: new Date().toISOString() })
        .eq('id', entry.id)
        .select()
        .single();
      if (data) setEntry(data);
    } else {
      const entryDate = getDateForDay(targetDay).toISOString().split('T')[0];
      const { data } = await supabase
        .from('daily_entries')
        .insert({
          user_id: user.id,
          day_number: targetDay,
          entry_date: entryDate,
          [field]: value,
        })
        .select()
        .single();
      if (data) setEntry(data);
    }
  };

  const updateDeepWorkHours = async (hours: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (entry) {
      const { data } = await supabase
        .from('daily_entries')
        .update({ deep_work_hours: hours, updated_at: new Date().toISOString() })
        .eq('id', entry.id)
        .select()
        .single();
      if (data) setEntry(data);
    } else {
      const entryDate = getDateForDay(targetDay).toISOString().split('T')[0];
      const { data } = await supabase
        .from('daily_entries')
        .insert({
          user_id: user.id,
          day_number: targetDay,
          entry_date: entryDate,
          deep_work_hours: hours,
        })
        .select()
        .single();
      if (data) setEntry(data);
    }
  };

  return {
    entry,
    loading,
    toggleTask,
    toggleDiscipline,
    updateNotes,
    updateDeepWorkHours,
    refetch: fetchEntry,
  };
}
