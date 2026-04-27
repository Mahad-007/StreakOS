'use client';

import { motion } from 'framer-motion';
import { Repeat, Gift } from 'lucide-react';
import { getCurrentCycle, getDayNumber } from '@/lib/utils';

export function CycleProgress() {
  const cycle = getCurrentCycle();
  const currentDay = getDayNumber();
  const daysIntoCycle = currentDay - cycle.start_day + 1;
  const cycleDays = cycle.end_day - cycle.start_day + 1;
  const cycleProgress = (daysIntoCycle / cycleDays) * 100;

  return (
    <motion.div
      className="p-5 rounded-xl border border-border bg-surface"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Repeat className="w-4 h-4 text-accent" />
        <h3 className="text-sm font-semibold text-text-primary">
          Cycle {cycle.id}: {cycle.title}
        </h3>
      </div>

      <p className="text-xs text-text-muted mb-3">{cycle.theme}</p>

      {/* Progress bar */}
      <div className="relative h-2 rounded-full bg-elevated overflow-hidden mb-2">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-accent progress-shimmer"
          initial={{ width: '0%' }}
          animate={{ width: `${Math.min(cycleProgress, 100)}%` }}
          transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1], delay: 0.5 }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-text-muted">
        <span>Day {daysIntoCycle} of {cycleDays}</span>
        <span className="flex items-center gap-1">
          <Gift className="w-3 h-3" />
          {cycle.reward}
        </span>
      </div>

      {/* Warnings */}
      {cycle.warnings.length > 0 && (
        <div className="mt-3 p-2 rounded-lg bg-warning/5 border border-warning/20">
          <p className="text-xs text-warning">
            {cycle.warnings[0]}
          </p>
        </div>
      )}
    </motion.div>
  );
}
