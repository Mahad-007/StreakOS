'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, X, Check } from 'lucide-react';
import { HundredDayGrid } from '@/components/calendar/HundredDayGrid';
import { PageTransition } from '@/components/animations/PageTransition';
import { useDailyEntry } from '@/hooks/useDailyEntry';
import { TASKS } from '@/lib/constants';
import { getDateForDay, formatDate, getCycleForDay, getDayOfWeek, getDayNumber, getCompletionCount } from '@/lib/utils';

export default function CalendarPage() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const { entry } = useDailyEntry(selectedDay ?? getDayNumber());

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-accent" />
            100-Day Calendar
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Your journey at a glance. Click any day to see details.
          </p>
        </div>

        {/* Grid */}
        <div className="p-4 rounded-xl border border-border bg-surface">
          <HundredDayGrid onDayClick={(day) => setSelectedDay(day)} />
        </div>

        {/* Day detail modal */}
        <AnimatePresence>
          {selectedDay !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setSelectedDay(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="w-full max-w-md p-6 rounded-2xl border border-border bg-surface shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">
                      Day {selectedDay}
                    </h3>
                    <p className="text-sm text-text-muted">
                      {formatDate(getDateForDay(selectedDay))} • {getDayOfWeek(selectedDay)} • Cycle {getCycleForDay(selectedDay).id}
                    </p>
                  </div>
                  <motion.button
                    onClick={() => setSelectedDay(null)}
                    className="p-2 rounded-lg hover:bg-elevated transition-colors"
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5 text-text-muted" />
                  </motion.button>
                </div>

                {/* Tasks status */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                    Tasks ({getCompletionCount(entry)}/4)
                  </p>
                  {TASKS.map((task) => {
                    const completed = entry?.[`${task.id}_completed` as keyof typeof entry] === true;
                    return (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border bg-bg"
                      >
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center ${
                            completed ? 'bg-success/20' : 'bg-elevated'
                          }`}
                        >
                          {completed ? (
                            <Check className="w-3.5 h-3.5 text-success" />
                          ) : (
                            <X className="w-3.5 h-3.5 text-text-muted opacity-50" />
                          )}
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            completed ? 'text-text-muted line-through' : 'text-text-primary'
                          }`}
                        >
                          {task.label}
                        </span>
                        <span className="ml-auto text-xs text-text-muted">{task.time}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Journal content */}
                {entry?.journal_content && (
                  <div className="mt-4 p-3 rounded-lg bg-bg border border-border">
                    <p className="text-xs font-semibold text-text-secondary mb-1">Notes</p>
                    <p className="text-sm text-text-primary">{entry.journal_content}</p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
