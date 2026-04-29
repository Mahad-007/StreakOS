'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Download, Loader2 } from 'lucide-react';
import { PageTransition } from '@/components/animations/PageTransition';
import { JournalEntryCard } from '@/components/journal/JournalEntryCard';
import { JournalModal } from '@/components/journal/JournalModal';
import { useJournalEntries, JournalEntry } from '@/hooks/useJournalEntries';
import { useAuth } from '@/hooks/useAuth';
import { CYCLES } from '@/lib/constants';
import { staggerContainer } from '@/lib/animations/variants';

export default function JournalPage() {
  const { entries, loading, updateEntry } = useJournalEntries();
  const { profile } = useAuth();
  const [generating, setGenerating] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  // Group entries by cycle
  const groupedByCycle = CYCLES.map((cycle) => ({
    cycle,
    entries: entries.filter(
      (e) => e.day_number >= cycle.start_day && e.day_number <= cycle.end_day
    ),
  })).filter((group) => group.entries.length > 0);

  const totalWords = entries.reduce(
    (sum, e) => sum + (e.journal_content?.split(/\s+/).length || 0),
    0
  );

  const handleDownloadPDF = async () => {
    if (entries.length === 0) return;
    setGenerating(true);
    try {
      const { pdf } = await import('@react-pdf/renderer');
      const { JournalPDFDocument } = await import('@/components/journal/JournalPDF');

      const blob = await pdf(
        JournalPDFDocument({ entries, userName: profile?.full_name || 'Unknown' })
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'my-100-day-journal.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="h-8 w-48 bg-surface rounded animate-pulse" />
          <div className="flex gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-[240px] h-[220px] bg-surface border border-border rounded-xl animate-pulse shrink-0" />
            ))}
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-accent" />
              My Journal
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Your 100-day journey, in your own words.
            </p>
            {entries.length > 0 && (
              <p className="text-xs text-text-muted mt-1">
                {entries.length} {entries.length === 1 ? 'entry' : 'entries'} &middot; {totalWords.toLocaleString()} words
              </p>
            )}
          </motion.div>

          {entries.length > 0 && (
            <motion.button
              onClick={handleDownloadPDF}
              disabled={generating}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download PDF
                </>
              )}
            </motion.button>
          )}
        </div>

        {/* Empty state */}
        {entries.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center py-20 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-elevated flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="font-semibold text-text-primary">No journal entries yet</h3>
            <p className="text-sm text-text-muted mt-1 max-w-sm">
              Start writing in the Quick Notes section on the Today page. Your reflections will appear here as a formal journal.
            </p>
          </motion.div>
        )}

        {/* Entries grouped by cycle */}
        {groupedByCycle.map(({ cycle, entries: cycleEntries }) => (
          <div key={cycle.id}>
            {/* Cycle divider */}
            <motion.div
              className="flex items-center gap-3 mb-4 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="h-px flex-1 bg-border" />
              <div className="text-center">
                <p className="text-xs font-bold text-accent">Cycle {cycle.id}: {cycle.title}</p>
                <p className="text-[10px] text-text-muted">{cycle.theme}</p>
              </div>
              <div className="h-px flex-1 bg-border" />
            </motion.div>

            {/* Horizontal card row */}
            <motion.div
              className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin"
              variants={staggerContainer(0.06)}
              initial="hidden"
              animate="visible"
            >
              {cycleEntries.map((entry) => (
                <JournalEntryCard
                  key={entry.id}
                  entry={entry}
                  onSelect={setSelectedEntry}
                />
              ))}
            </motion.div>
          </div>
        ))}
      </div>

      {/* Detail modal */}
      <JournalModal
        entry={selectedEntry}
        onClose={() => setSelectedEntry(null)}
        onUpdate={updateEntry}
      />
    </PageTransition>
  );
}
