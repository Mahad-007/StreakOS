'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Check, X, Loader2 } from 'lucide-react';
import { JournalEntry } from '@/hooks/useJournalEntries';
import { getDateForDay, formatDate, getCycleForDay, getDayOfWeek } from '@/lib/utils';
import { staggerChild } from '@/lib/animations/variants';

interface JournalEntryCardProps {
  entry: JournalEntry;
  onUpdate: (id: string, content: string) => Promise<boolean>;
}

export function JournalEntryCard({ entry, onUpdate }: JournalEntryCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localContent, setLocalContent] = useState(entry.journal_content);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const savingRef = useRef(false);

  useEffect(() => {
    if (!isEditing) {
      setLocalContent(entry.journal_content);
    }
  }, [entry.journal_content, isEditing]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [isEditing]);

  const handleSave = useCallback(async () => {
    // Prevent double-save from blur + click
    if (savingRef.current) return;

    const trimmed = localContent.trim();
    if (trimmed === entry.journal_content.trim()) {
      setIsEditing(false);
      return;
    }

    savingRef.current = true;
    setSaving(true);
    setSaveError(false);

    const success = await onUpdate(entry.id, trimmed);

    setSaving(false);
    savingRef.current = false;

    if (success) {
      setIsEditing(false);
    } else {
      setSaveError(true);
    }
  }, [localContent, entry.id, entry.journal_content, onUpdate]);

  const handleCancel = () => {
    if (saving) return;
    setLocalContent(entry.journal_content);
    setIsEditing(false);
    setSaveError(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') handleCancel();
  };

  const date = getDateForDay(entry.day_number);
  const cycle = getCycleForDay(entry.day_number);

  return (
    <motion.div
      variants={staggerChild}
      className="group relative p-5 rounded-xl border border-border bg-surface hover:border-border transition-all"
    >
      {/* Date line */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold font-mono text-accent">Day {entry.day_number}</span>
          <span className="text-xs text-text-muted">
            {getDayOfWeek(entry.day_number)}, {formatDate(date)}
          </span>
          <span className="text-[10px] text-text-muted px-1.5 py-0.5 rounded bg-elevated">
            Cycle {cycle.id}
          </span>
        </div>

        {!isEditing && (
          <motion.button
            onClick={() => setIsEditing(true)}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-text-muted hover:text-accent hover:bg-elevated transition-all"
            whileTap={{ scale: 0.9 }}
            title="Edit entry"
          >
            <Pencil className="w-3.5 h-3.5" />
          </motion.button>
        )}

        {isEditing && (
          <div className="flex items-center gap-1">
            {saving ? (
              <div className="flex items-center gap-1.5 px-2 py-1 text-xs text-accent">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving...
              </div>
            ) : (
              <>
                <motion.button
                  onClick={handleSave}
                  className="p-1.5 rounded-md text-success hover:bg-success/10 transition-colors"
                  whileTap={{ scale: 0.9 }}
                  title="Save"
                >
                  <Check className="w-3.5 h-3.5" />
                </motion.button>
                <motion.button
                  onClick={handleCancel}
                  className="p-1.5 rounded-md text-text-muted hover:bg-elevated transition-colors"
                  whileTap={{ scale: 0.9 }}
                  title="Cancel"
                >
                  <X className="w-3.5 h-3.5" />
                </motion.button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Save error */}
      {saveError && (
        <div className="mb-2 px-3 py-2 rounded-lg bg-danger/10 border border-danger/20 text-xs text-danger">
          Failed to save. Your text is still in the editor — try again.
        </div>
      )}

      {/* Content */}
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={localContent}
          onChange={(e) => {
            setLocalContent(e.target.value);
            setSaveError(false);
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          disabled={saving}
          className="w-full min-h-[80px] p-3 rounded-lg border border-accent/30 bg-bg text-text-primary text-sm leading-relaxed resize-none focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all disabled:opacity-50"
        />
      ) : (
        <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
          {entry.journal_content}
        </p>
      )}
    </motion.div>
  );
}
