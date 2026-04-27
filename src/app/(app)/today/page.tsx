'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Flame, Trophy } from 'lucide-react';
import { TaskItem } from '@/components/checklist/TaskItem';
import { DisciplineRules } from '@/components/checklist/DisciplineRules';
import { ConfettiExplosion } from '@/components/animations/ConfettiExplosion';
import { PageTransition } from '@/components/animations/PageTransition';
import { useDailyEntry } from '@/hooks/useDailyEntry';
import { TASKS } from '@/lib/constants';
import { getDayNumber, getDateForDay, formatDate, getCycleForDay, getCompletionCount } from '@/lib/utils';
import { TaskType } from '@/types';

export default function TodayPage() {
  const [selectedDay, setSelectedDay] = useState(getDayNumber());
  const { entry, loading, toggleTask, toggleDiscipline, updateNotes } = useDailyEntry(selectedDay);
  const [showConfetti, setShowConfetti] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  const completionCount = getCompletionCount(entry);
  const isAllComplete = completionCount === 4;
  const currentCycle = getCycleForDay(selectedDay);
  const isToday = selectedDay === getDayNumber();

  useEffect(() => {
    if (isAllComplete && !justCompleted) {
      setShowConfetti(true);
      setJustCompleted(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    if (!isAllComplete) {
      setJustCompleted(false);
    }
  }, [isAllComplete, justCompleted]);

  const handleToggleTask = async (taskId: TaskType) => {
    await toggleTask(taskId);
  };

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto space-y-6">
        <ConfettiExplosion trigger={showConfetti} />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              {isToday ? "Today's Tasks" : `Day ${selectedDay}`}
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              <Calendar className="w-3.5 h-3.5 inline mr-1" />
              {formatDate(getDateForDay(selectedDay))} • Cycle {currentCycle.id}
            </p>
          </div>

          {/* Day navigator */}
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setSelectedDay((d) => Math.max(1, d - 1))}
              className="p-2 rounded-lg border border-border hover:bg-elevated transition-colors"
              whileTap={{ scale: 0.9 }}
              disabled={selectedDay <= 1}
            >
              <ChevronLeft className="w-4 h-4 text-text-secondary" />
            </motion.button>
            <div className="px-3 py-1.5 rounded-lg bg-elevated border border-border">
              <span className="text-sm font-mono font-bold text-accent">
                Day {selectedDay}
              </span>
            </div>
            <motion.button
              onClick={() => setSelectedDay((d) => Math.min(getDayNumber(), d + 1))}
              className="p-2 rounded-lg border border-border hover:bg-elevated transition-colors"
              whileTap={{ scale: 0.9 }}
              disabled={selectedDay >= getDayNumber()}
            >
              <ChevronRight className="w-4 h-4 text-text-secondary" />
            </motion.button>
          </div>
        </div>

        {/* Progress indicator */}
        <motion.div
          className="relative h-2 rounded-full bg-elevated overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent to-success progress-shimmer"
            initial={{ width: '0%' }}
            animate={{ width: `${(completionCount / 4) * 100}%` }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          />
        </motion.div>

        {/* Completion banner */}
        <AnimatePresence>
          {isAllComplete && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="flex items-center gap-3 p-4 rounded-xl border border-success/30 bg-success/5"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-success/20">
                <Trophy className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="font-semibold text-success text-sm">Day Complete!</p>
                <p className="text-xs text-text-muted">All tasks crushed. Keep the streak alive.</p>
              </div>
              <Flame className="w-6 h-6 text-accent ml-auto animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tasks */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
            Daily Tasks ({completionCount}/4)
          </h2>
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-[72px] rounded-xl bg-surface border border-border animate-pulse"
                />
              ))}
            </div>
          ) : (
            TASKS.map((task, index) => (
              <TaskItem
                key={task.id}
                task={task}
                completed={entry?.[`${task.id}_completed` as keyof typeof entry] === true}
                onToggle={handleToggleTask}
                index={index}
              />
            ))
          )}
        </div>

        {/* Discipline rules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <DisciplineRules entry={entry} onToggle={toggleDiscipline} />
        </motion.div>

        {/* Journal section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <h3 className="text-sm font-semibold text-text-secondary">Quick Notes</h3>
          <textarea
            placeholder="What did you learn today? Any reflections..."
            defaultValue={entry?.journal_content || ''}
            onBlur={(e) => {
              if (e.target.value !== (entry?.journal_content || '')) {
                updateNotes('journal_content', e.target.value);
              }
            }}
            className="w-full h-24 p-3 rounded-xl border border-border bg-surface text-text-primary text-sm placeholder:text-text-muted resize-none focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
          />
        </motion.div>
      </div>
    </PageTransition>
  );
}
