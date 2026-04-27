'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Flame, CheckSquare, CalendarDays, BarChart3, Users, Zap, ArrowRight } from 'lucide-react';
import { staggerContainer, staggerChild } from '@/lib/animations/variants';

const features = [
  { icon: CheckSquare, title: 'Daily Tracking', description: 'Mark your tasks complete with satisfying animations' },
  { icon: CalendarDays, title: '100-Day Calendar', description: 'Visual grid showing your entire journey at a glance' },
  { icon: BarChart3, title: 'Analytics', description: 'See consistency metrics, streaks, and performance data' },
  { icon: Users, title: 'Team Progress', description: 'Track together, compete friendly, stay accountable' },
  { icon: Zap, title: 'Streak System', description: 'Build momentum with streak tracking and achievements' },
  { icon: Flame, title: '7 Cycles', description: 'Structured 14-day cycles with goals and rewards' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 mb-6"
        >
          <Flame className="w-8 h-8 text-accent" />
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Streak<span className="text-accent">OS</span>
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-text-secondary mt-4 max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          100 Days of Disciplined Execution.
          <br />
          <span className="text-text-muted">Track. Streak. Succeed.</span>
        </motion.p>

        <motion.div
          className="mt-3 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs font-medium text-accent">
            &quot;These 100 days will decide the next 10 years of our lives.&quot;
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-8 flex gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/login">
            <motion.button
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20"
              whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(255, 107, 44, 0.3)' }}
              whileTap={{ scale: 0.97 }}
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Features grid */}
      <section className="px-4 pb-20">
        <motion.div
          className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={staggerChild}
              className="p-5 rounded-xl border border-border bg-surface hover:border-accent/20 transition-all group"
            >
              <feature.icon className="w-8 h-8 text-accent mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-text-primary text-sm">{feature.title}</h3>
              <p className="text-xs text-text-muted mt-1">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center">
        <p className="text-xs text-text-muted">
          StreakOS — Built for the founders who refuse to stay comfortable.
        </p>
      </footer>
    </div>
  );
}
