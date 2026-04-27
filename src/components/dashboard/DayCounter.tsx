'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import { getDayNumber, getProgressPercentage } from '@/lib/utils';
import { TOTAL_DAYS } from '@/lib/constants';

export function DayCounter() {
  const currentDay = getDayNumber();
  const progress = getProgressPercentage();

  const springValue = useSpring(0, { stiffness: 50, damping: 20 });
  const displayDay = useTransform(springValue, (v) => Math.round(v));

  useEffect(() => {
    springValue.set(currentDay);
  }, [currentDay, springValue]);

  return (
    <motion.div
      className="relative p-6 rounded-2xl border border-border bg-surface overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent" />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm text-text-secondary font-medium">Current Day</p>
          <div className="flex items-baseline gap-1 mt-1">
            <motion.span className="text-5xl font-bold font-mono text-accent">
              {currentDay}
            </motion.span>
            <span className="text-lg text-text-muted font-medium">/ {TOTAL_DAYS}</span>
          </div>
          <p className="text-xs text-text-muted mt-2">
            {TOTAL_DAYS - currentDay} days remaining
          </p>
        </div>

        {/* Circular progress */}
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="35"
              className="fill-none stroke-border"
              strokeWidth="6"
            />
            <motion.circle
              cx="40"
              cy="40"
              r="35"
              className="fill-none stroke-accent"
              strokeWidth="6"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress / 100 }}
              transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1], delay: 0.3 }}
              style={{
                strokeDasharray: '220',
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-accent font-mono">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative mt-4 h-1.5 rounded-full bg-elevated overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent to-accent-hover progress-shimmer"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1], delay: 0.5 }}
        />
      </div>
    </motion.div>
  );
}
