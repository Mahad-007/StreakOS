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
  const [supabase] = useState(createClient);

  const loadEntries = useCallback(async (): Promise<JournalEntry[] | null> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) return null;

      const { data } = await supabase
        .from('daily_entries')
        .select('id, day_number, entry_date, journal_content, updated_at')
        .eq('user_id', userId)
        .not('journal_content', 'is', null)
        .neq('journal_content', '')
        .order('day_number', { ascending: true });

      return (data as JournalEntry[] | null) ?? null;
    } catch (err) {
      console.error('Journal entries fetch error:', err);
      return null;
    }
  }, [supabase]);

  useEffect(() => {
    let cancelled = false;
    loadEntries().then((data) => {
      if (cancelled) return;
      if (data) setEntries(data);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [loadEntries]);

  const fetchEntries = useCallback(async () => {
    const data = await loadEntries();
    if (data) setEntries(data);
    setLoading(false);
  }, [loadEntries]);

  const updateEntry = async (id: string, content: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('daily_entries')
        .update({ journal_content: content, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('id, day_number, entry_date, journal_content, updated_at')
        .single();

      if (error) {
        console.error('Journal save error:', error);
        return false;
      }

      if (data) {
        setEntries((prev) =>
          prev.map((e) => (e.id === id ? (data as JournalEntry) : e))
        );
      }

      return true;
    } catch (err) {
      console.error('Journal update error:', err);
      return false;
    }
  };

  return { entries, loading, updateEntry, refetch: fetchEntries };
}
