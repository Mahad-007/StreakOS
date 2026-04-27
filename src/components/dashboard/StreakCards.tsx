'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Dumbbell, Laptop, BookOpen, PenLine, Zap } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Streak } from '@/types';
import { staggerContainer, staggerChild } from '@/lib/animations/variants';

const streakConfig = {
  fitness: { label: 'Fitness', icon: Dumbbell, color: '#F87171' },
  deep_work: { label: 'Deep Work', icon: Laptop, color: '#60A5FA' },
  learning: { label: 'Learning', icon: BookOpen, color: '#A78BFA' },
  journal: { label: 'Journal', icon: PenLine, color: '#6EE7B7' },
  perfect_day: { label: 'Perfect Day', icon: Zap, color: '#FF6B2C' },
};

export function StreakCards() {
  const [streaks, setStreaks] = useState<Streak[]>([]);

  useEffect(() => {
    const fetchStreaks = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const user = session.user;

      const { data } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', user.id);

      if (data) setStreaks(data);
    };

    fetchStreaks();
  }, []);

  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
      variants={staggerContainer(0.08)}
      initial="hidden"
      animate="visible"
    >
      {Object.entries(streakConfig).map(([type, config]) => {
        const streak = streaks.find((s) => s.streak_type === type);
        const current = streak?.current_streak || 0;
        const longest = streak?.longest_streak || 0;
        const Icon = config.icon;

        return (
          <motion.div
            key={type}
            variants={staggerChild}
            className="relative p-4 rounded-xl border border-border bg-surface overflow-hidden group hover:border-border transition-all"
          >
            {/* Background glow for active streaks */}
            {current > 0 && (
              <div
                className="absolute inset-0 opacity-5"
                style={{ backgroundColor: config.color }}
              />
            )}

            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4" style={{ color: config.color }} />
                <span className="text-xs font-medium text-text-muted">{config.label}</span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-text-primary">
                  {current}
                </span>
                {current >= 3 && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Flame className="w-4 h-4 text-accent" />
                  </motion.div>
                )}
              </div>

              <p className="text-[10px] text-text-muted mt-1">
                Best: {longest}
              </p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
