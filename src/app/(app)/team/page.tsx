'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Flame, Trophy, BookOpen, Zap, TrendingUp } from 'lucide-react';
import { PageTransition } from '@/components/animations/PageTransition';
import { createClient } from '@/lib/supabase/client';
import { Profile, Streak, DailyEntry } from '@/types';
import { getDayNumber, getCompletionCount } from '@/lib/utils';
import { TASKS } from '@/lib/constants';
import { staggerContainer, staggerChild } from '@/lib/animations/variants';

interface MemberStats {
  profile: Profile;
  todayEntry: DailyEntry | null;
  streaks: Streak[];
  overallRate: number;
}

export default function TeamPage() {
  const [members, setMembers] = useState<MemberStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      const supabase = createClient();

      const { data: profiles } = await supabase.from('profiles').select('*');
      if (!profiles) return;

      const currentDay = getDayNumber();
      const memberStats: MemberStats[] = [];

      for (const profile of profiles) {
        // Get today's entry
        const { data: todayEntry } = await supabase
          .from('daily_entries')
          .select('*')
          .eq('user_id', profile.id)
          .eq('day_number', currentDay)
          .single();

        // Get streaks
        const { data: streaks } = await supabase
          .from('streaks')
          .select('*')
          .eq('user_id', profile.id);

        // Get overall rate
        const { data: allEntries } = await supabase
          .from('daily_entries')
          .select('*')
          .eq('user_id', profile.id);

        let totalTasks = 0;
        let completedTasks = 0;
        allEntries?.forEach((e) => {
          totalTasks += 4;
          if (e.fitness_completed) completedTasks++;
          if (e.deep_work_completed) completedTasks++;
          if (e.learning_completed) completedTasks++;
          if (e.journal_completed) completedTasks++;
        });

        memberStats.push({
          profile,
          todayEntry: todayEntry || null,
          streaks: streaks || [],
          overallRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
        });
      }

      setMembers(memberStats);
      setLoading(false);
    };

    fetchTeam();
  }, []);

  if (loading) {
    return (
      <PageTransition>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-8 w-48 bg-surface rounded animate-pulse" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-48 bg-surface border border-border rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Users className="w-6 h-6 text-accent" />
            Team
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            See how everyone is doing
          </p>
        </motion.div>

        {/* Member cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={staggerContainer(0.15)}
          initial="hidden"
          animate="visible"
        >
          {members.map((member) => {
            const todayCount = getCompletionCount(member.todayEntry);
            const perfectStreak = member.streaks.find((s) => s.streak_type === 'perfect_day');

            return (
              <motion.div
                key={member.profile.id}
                variants={staggerChild}
                className="p-5 rounded-xl border border-border bg-surface"
              >
                {/* Avatar + Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-accent">
                      {member.profile.full_name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">{member.profile.full_name}</h3>
                    <p className="text-xs text-text-muted capitalize">{member.profile.role}</p>
                  </div>
                  {(perfectStreak?.current_streak ?? 0) >= 3 && (
                    <Flame className="w-5 h-5 text-accent ml-auto animate-pulse" />
                  )}
                </div>

                {/* Today's status */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-text-muted">Today:</span>
                  <div className="flex gap-1">
                    {TASKS.map((task) => {
                      const done = member.todayEntry?.[`${task.id}_completed` as keyof DailyEntry] === true;
                      return (
                        <div
                          key={task.id}
                          className={`w-5 h-5 rounded-md flex items-center justify-center text-[8px] font-bold ${
                            done ? 'bg-success/20 text-success' : 'bg-elevated text-text-muted'
                          }`}
                          title={task.label}
                        >
                          {done ? '✓' : task.label[0]}
                        </div>
                      );
                    })}
                  </div>
                  <span className="text-xs font-mono font-bold text-text-primary ml-auto">
                    {todayCount}/4
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 rounded-lg bg-bg text-center">
                    <p className="text-lg font-bold font-mono text-accent">
                      {Math.round(member.overallRate)}%
                    </p>
                    <p className="text-[10px] text-text-muted">Overall</p>
                  </div>
                  <div className="p-2 rounded-lg bg-bg text-center">
                    <p className="text-lg font-bold font-mono text-text-primary">
                      {perfectStreak?.current_streak || 0}
                    </p>
                    <p className="text-[10px] text-text-muted">Streak</p>
                  </div>
                  <div className="p-2 rounded-lg bg-bg text-center">
                    <p className="text-lg font-bold font-mono text-text-primary">
                      {perfectStreak?.longest_streak || 0}
                    </p>
                    <p className="text-[10px] text-text-muted">Best</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Head-to-head comparison */}
        {members.length >= 2 && (
          <motion.div
            className="p-5 rounded-xl border border-border bg-surface"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-warning" />
              Head to Head
            </h3>
            <div className="space-y-3">
              {['Overall', ...TASKS.map(t => t.label)].map((label) => {
                const val1 = label === 'Overall' ? members[0].overallRate : 0;
                const val2 = label === 'Overall' ? members[1].overallRate : 0;
                const max = Math.max(val1, val2, 1);

                return (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-xs text-text-muted w-16 text-right">{members[0].profile.full_name?.split(' ')[0]}</span>
                    <div className="flex-1 flex items-center gap-1">
                      <motion.div
                        className="h-4 rounded-sm bg-accent/60"
                        initial={{ width: 0 }}
                        animate={{ width: `${(val1 / max) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                      />
                      <span className="text-[10px] font-mono text-text-muted min-w-[30px]">
                        {Math.round(val1)}%
                      </span>
                    </div>
                    <span className="text-xs font-medium text-text-secondary w-16 text-center">{label}</span>
                    <div className="flex-1 flex items-center gap-1 flex-row-reverse">
                      <motion.div
                        className="h-4 rounded-sm bg-info/60"
                        initial={{ width: 0 }}
                        animate={{ width: `${(val2 / max) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                      />
                      <span className="text-[10px] font-mono text-text-muted min-w-[30px] text-right">
                        {Math.round(val2)}%
                      </span>
                    </div>
                    <span className="text-xs text-text-muted w-16">{members[1].profile.full_name?.split(' ')[0]}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
