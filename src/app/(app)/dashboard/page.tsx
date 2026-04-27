'use client';

import { PageTransition } from '@/components/animations/PageTransition';
import { DayCounter } from '@/components/dashboard/DayCounter';
import { TodaySnapshot } from '@/components/dashboard/TodaySnapshot';
import { StreakCards } from '@/components/dashboard/StreakCards';
import { CycleProgress } from '@/components/dashboard/CycleProgress';
import { FridayCountdown } from '@/components/dashboard/FridayCountdown';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

export default function DashboardPage() {
  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Welcome header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Flame className="w-6 h-6 text-accent" />
            Dashboard
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Your 100-day journey at a glance
          </p>
        </motion.div>

        {/* Day counter + Today snapshot */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <DayCounter />
          <TodaySnapshot />
        </div>

        {/* Streak cards */}
        <div>
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
            Current Streaks
          </h2>
          <StreakCards />
        </div>

        {/* Cycle + Friday meeting */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CycleProgress />
          <FridayCountdown />
        </div>
      </div>
    </PageTransition>
  );
}
