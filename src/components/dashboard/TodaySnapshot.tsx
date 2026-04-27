'use client';

import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useDailyEntry } from '@/hooks/useDailyEntry';
import { TASKS } from '@/lib/constants';
import { getCompletionCount } from '@/lib/utils';
import { staggerContainer, staggerChild } from '@/lib/animations/variants';

export function TodaySnapshot() {
  const { entry, loading, toggleTask } = useDailyEntry();
  const completionCount = getCompletionCount(entry);

  return (
    <motion.div
      className="p-5 rounded-xl border border-border bg-surface"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Today&apos;s Progress</h3>
          <p className="text-xs text-text-muted">{completionCount}/4 tasks complete</p>
        </div>
        <Link
          href="/today"
          className="flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-hover transition-colors"
        >
          Details <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Mini progress bar */}
      <div className="relative h-1.5 rounded-full bg-elevated overflow-hidden mb-4">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-accent"
          animate={{ width: `${(completionCount / 4) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Quick task toggles */}
      <motion.div
        className="grid grid-cols-2 gap-2"
        variants={staggerContainer(0.05)}
        initial="hidden"
        animate="visible"
      >
        {TASKS.map((task) => {
          const completed = entry?.[`${task.id}_completed` as keyof typeof entry] === true;
          return (
            <motion.button
              key={task.id}
              variants={staggerChild}
              onClick={() => toggleTask(task.id)}
              className={`flex items-center gap-2 p-2.5 rounded-lg border transition-all ${
                completed
                  ? 'border-success/30 bg-success/5'
                  : 'border-border bg-bg hover:bg-elevated'
              }`}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                  completed ? 'border-success bg-success/20' : 'border-border'
                }`}
              >
                {completed && <Check className="w-3 h-3 text-success" />}
              </div>
              <span
                className={`text-xs font-medium ${
                  completed ? 'text-text-muted line-through' : 'text-text-primary'
                }`}
              >
                {task.label}
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
