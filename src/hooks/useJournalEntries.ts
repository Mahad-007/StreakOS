'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface JournalEntry {
  id: string;
  day_number: number;
  entry_date: string;
  journal_content: string;
  updated_at: string;
}

export function useJournalEntries() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchEntries = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from('daily_entries')
        .select('id, day_number, entry_date, journal_content, updated_at')
        .eq('user_id', user.id)
        .not('journal_content', 'is', null)
        .neq('journal_content', '')
        .order('day_number', { ascending: true });

      if (data) setEntries(data as JournalEntry[]);
    } catch (err) {
      console.error('Journal entries fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const updateEntry = async (id: string, content: string) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, journal_content: content, updated_at: new Date().toISOString() } : e
      )
    );

    try {
      const { error } = await supabase
        .from('daily_entries')
        .update({ journal_content: content, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) fetchEntries();
    } catch (err) {
      console.error('Journal update error:', err);
      fetchEntries();
    }
  };

  return { entries, loading, updateEntry, refetch: fetchEntries };
}
