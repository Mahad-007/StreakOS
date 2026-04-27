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
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from('daily_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('day_number', targetDay)
        .single();

      setEntry(data);
    } catch (err) {
      console.error('Daily entry fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [targetDay]);

  useEffect(() => {
    fetchEntry();
  }, [fetchEntry]);

  const toggleTask = async (task: TaskType) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const field = `${task}_completed` as keyof DailyEntry;
      const newValue = !entry?.[field];

      if (entry) {
        const { data } = await supabase
          .from('daily_entries')
          .update({ [field]: newValue, updated_at: new Date().toISOString() })
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
            [field]: newValue,
          })
          .select()
          .single();
        if (data) setEntry(data);
      }
    } catch (err) {
      console.error('Toggle task error:', err);
    }
  };

  const toggleDiscipline = async (rule: string) => {
    try {
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
    } catch (err) {
      console.error('Toggle discipline error:', err);
    }
  };

  const updateNotes = async (field: 'journal_content' | 'learning_topic' | 'notes', value: string) => {
    try {
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
    } catch (err) {
      console.error('Update notes error:', err);
    }
  };

  const updateDeepWorkHours = async (hours: number) => {
    try {
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
    } catch (err) {
      console.error('Update deep work hours error:', err);
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
