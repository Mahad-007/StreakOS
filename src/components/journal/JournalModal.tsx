'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Pencil, Check, Loader2, Calendar, Hash } from 'lucide-react';
import { JournalEntry } from '@/hooks/useJournalEntries';
import { getDateForDay, formatDate, getCycleForDay, getDayOfWeek } from '@/lib/utils';

interface JournalModalProps {
  entry: JournalEntry | null;
  onClose: () => void;
  onUpdate: (id: string, content: string) => Promise<boolean>;
}

export function JournalModal({ entry, onClose, onUpdate }: JournalModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localContent, setLocalContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const savingRef = useRef(false);

  useEffect(() => {
    if (entry) {
      setLocalContent(entry.journal_content);
      setIsEditing(false);
      setSaveError(false);
    }
  }, [entry]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [isEditing]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isEditing) {
          handleCancel();
        } else {
          onClose();
        }
      }
    };
    if (entry) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [entry, isEditing]);

  const handleSave = useCallback(async () => {
    if (savingRef.current || !entry) return;

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
  }, [localContent, entry, onUpdate]);

  const handleCancel = () => {
    if (saving) return;
    if (entry) setLocalContent(entry.journal_content);
    setIsEditing(false);
    setSaveError(false);
  };

  if (!entry) return null;

  const date = getDateForDay(entry.day_number);
  const cycle = getCycleForDay(entry.day_number);
  const wordCount = entry.journal_content?.split(/\s+/).length || 0;

  return (
    <AnimatePresence>
      {entry && (
        <motion.div
          className="fixed inset-x-0 top-16 bottom-0 z-50 flex items-center justify-center px-4 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop — covers full viewport including behind the header */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-2xl max-h-full bg-surface border border-border rounded-2xl shadow-lg overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10">
                  <span className="text-sm font-bold font-mono text-accent">{entry.day_number}</span>
                </div>
                <div>
                  <h2 className="text-base font-semibold text-text-primary">
                    Day {entry.day_number}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {getDayOfWeek(entry.day_number)}, {formatDate(date)}
                    </span>
                    <span className="text-border">|</span>
                    <span>Cycle {cycle.id}</span>
                    <span className="text-border">|</span>
                    <span>{wordCount} words</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {!isEditing && (
                  <motion.button
                    onClick={() => setIsEditing(true)}
                    className="p-2 rounded-lg text-text-muted hover:text-accent hover:bg-elevated transition-all"
                    whileTap={{ scale: 0.9 }}
                    title="Edit entry"
                  >
                    <Pencil className="w-4 h-4" />
                  </motion.button>
                )}

                {isEditing && (
                  <>
                    {saving ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-accent">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Saving...
                      </div>
                    ) : (
                      <>
                        <motion.button
                          onClick={handleSave}
                          className="p-2 rounded-lg text-success hover:bg-success/10 transition-colors"
                          whileTap={{ scale: 0.9 }}
                          title="Save"
                        >
                          <Check className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={handleCancel}
                          className="p-2 rounded-lg text-text-muted hover:bg-elevated transition-colors"
                          whileTap={{ scale: 0.9 }}
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </>
                    )}
                  </>
                )}

                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-elevated transition-all ml-1"
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Save error */}
            {saveError && (
              <div className="mx-6 mt-4 px-3 py-2 rounded-lg bg-danger/10 border border-danger/20 text-xs text-danger">
                Failed to save. Your text is still in the editor — try again.
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
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
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') handleCancel();
                  }}
                  disabled={saving}
                  className="w-full min-h-[200px] p-4 rounded-xl border border-accent/30 bg-bg text-text-primary text-sm leading-relaxed resize-none focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all disabled:opacity-50"
                />
              ) : (
                <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
                  {entry.journal_content}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
