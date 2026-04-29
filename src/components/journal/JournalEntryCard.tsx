'use client';

import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import { JournalEntry } from '@/hooks/useJournalEntries';
import { getDateForDay, formatDate, getCycleForDay, getDayOfWeek } from '@/lib/utils';
import { staggerChild } from '@/lib/animations/variants';

interface JournalEntryCardProps {
  entry: JournalEntry;
  onSelect: (entry: JournalEntry) => void;
}

export function JournalEntryCard({ entry, onSelect }: JournalEntryCardProps) {
  const date = getDateForDay(entry.day_number);

  return (
    <motion.div
      variants={staggerChild}
      className="group relative flex flex-col w-[240px] min-w-[240px] h-[220px] rounded-xl border border-border bg-surface hover:border-accent/30 transition-all cursor-pointer overflow-hidden"
      whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 107, 44, 0.15)' }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(entry)}
    >
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-accent to-accent-hover opacity-60 group-hover:opacity-100 transition-opacity" />

      {/* Header */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold font-mono text-accent">Day {entry.day_number}</span>
          <span className="w-1 h-1 rounded-full bg-text-muted" />
          <span className="text-[10px] text-text-muted truncate">
            {formatDate(date)}
          </span>
        </div>
      </div>

      {/* Truncated content */}
      <div className="flex-1 px-4 overflow-hidden">
        <p className="text-xs text-text-secondary leading-relaxed line-clamp-5">
          {entry.journal_content}
        </p>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-border/50">
        <span className="text-[10px] text-text-muted">
          {entry.journal_content?.split(/\s+/).length || 0} words
        </span>
        <div className="flex items-center gap-1 text-[11px] font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">
          <Eye className="w-3 h-3" />
          View
        </div>
      </div>
    </motion.div>
  );
}
