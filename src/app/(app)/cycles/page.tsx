'use client';

import { motion } from 'framer-motion';
import { Repeat, Gift, AlertTriangle, Check, Lock, ClipboardList, Target, Dumbbell, Laptop, BookOpen, PenLine, UtensilsCrossed, Moon, Sparkles, Smartphone, DollarSign, Briefcase, TrendingUp } from 'lucide-react';
import { PageTransition } from '@/components/animations/PageTransition';
import { CYCLES } from '@/lib/constants';
import { getDayNumber, getCycleForDay } from '@/lib/utils';
import { staggerContainer, staggerChild } from '@/lib/animations/variants';
import { cn } from '@/lib/utils';

export default function CyclesPage() {
  const currentDay = getDayNumber();
  const currentCycle = getCycleForDay(currentDay);

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Repeat className="w-6 h-6 text-accent" />
            Cycles
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            7 cycles of focused execution. Each one builds on the last.
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          className="space-y-4"
          variants={staggerContainer(0.1)}
          initial="hidden"
          animate="visible"
        >
          {CYCLES.map((cycle) => {
            const isActive = cycle.id === currentCycle.id;
            const isComplete = currentDay > cycle.end_day;
            const isLocked = currentDay < cycle.start_day;
            const daysIntoCycle = isActive ? currentDay - cycle.start_day + 1 : 0;
            const cycleDays = cycle.end_day - cycle.start_day + 1;
            const progress = isComplete ? 100 : isActive ? (daysIntoCycle / cycleDays) * 100 : 0;

            return (
              <motion.div
                key={cycle.id}
                variants={staggerChild}
                className={cn(
                  'p-5 rounded-xl border transition-all',
                  isActive && 'border-accent/40 bg-accent/5 ring-1 ring-accent/10',
                  isComplete && 'border-success/30 bg-success/5',
                  isLocked && 'border-border bg-surface opacity-60'
                )}
              >
                {/* Cycle header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold',
                        isActive && 'bg-accent/20 text-accent',
                        isComplete && 'bg-success/20 text-success',
                        isLocked && 'bg-elevated text-text-muted'
                      )}
                    >
                      {isComplete ? <Check className="w-4 h-4" /> : isLocked ? <Lock className="w-3.5 h-3.5" /> : cycle.id}
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary text-sm">{cycle.title}</h3>
                      <p className="text-xs text-text-muted">
                        Day {cycle.start_day}–{cycle.end_day} • {cycle.start_date} → {cycle.end_date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-warning" />
                    <span className="text-xs font-medium text-text-secondary">{cycle.reward}</span>
                  </div>
                </div>

                {/* Theme */}
                <p className="text-xs text-text-secondary mb-3">{cycle.theme}</p>

                {/* Progress bar (active only) */}
                {(isActive || isComplete) && (
                  <div className="relative h-1.5 rounded-full bg-elevated overflow-hidden mb-3">
                    <motion.div
                      className={cn(
                        'absolute inset-y-0 left-0 rounded-full',
                        isComplete ? 'bg-success' : 'bg-accent progress-shimmer'
                      )}
                      initial={{ width: '0%' }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
                    />
                  </div>
                )}

                {/* Goals */}
                {cycle.goals.length > 0 && (
                  <div className="space-y-1.5 mb-3">
                    <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1">
                      <Target className="w-3 h-3" /> Goals
                    </p>
                    {cycle.goals.map((goal, i) => (
                      <p key={i} className="text-xs text-text-secondary pl-3 border-l-2 border-accent/30">
                        {goal}
                      </p>
                    ))}
                  </div>
                )}

                {/* Key Deliverables */}
                {cycle.key_deliverables.length > 0 && (
                  <div className="space-y-1.5 mb-3">
                    <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1">
                      <ClipboardList className="w-3 h-3" /> Key Deliverables
                    </p>
                    {cycle.key_deliverables.map((item, i) => (
                      <p key={i} className="text-xs text-text-secondary pl-3 border-l-2 border-success/30">
                        {item}
                      </p>
                    ))}
                  </div>
                )}

                {/* Warnings */}
                {cycle.warnings.length > 0 && (
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-warning/5 border border-warning/20">
                    <AlertTriangle className="w-3.5 h-3.5 text-warning mt-0.5 shrink-0" />
                    <div className="space-y-1">
                      {cycle.warnings.map((warning, i) => (
                        <p key={i} className="text-xs text-warning">{warning}</p>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* ===== PPT PLAN DATA ===== */}

        {/* Mission */}
        <motion.div
          className="p-5 rounded-xl border border-accent/20 bg-accent/5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-sm font-semibold text-accent mb-2">Mission</h3>
          <p className="text-xs text-text-secondary italic">
            &quot;These 100 days will transform our professional life, financial stability, personality, fitness, and team coordination.&quot;
          </p>
          <p className="text-xs text-accent font-semibold mt-2">
            &quot;These 100 days will decide the next 10 years of our lives.&quot;
          </p>
        </motion.div>

        {/* Daily Execution Model */}
        <motion.div
          className="p-5 rounded-xl border border-border bg-surface"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-sm font-semibold text-text-primary mb-3">Daily Execution Model</h3>
          <div className="space-y-2">
            {[
              { icon: Dumbbell, time: '7:30 – 8:15 PM', label: 'Fitness', desc: 'Strength training and conditioning', color: '#F87171' },
              { icon: Laptop, time: '8:30 – 10:30 PM', label: 'Deep Work', desc: 'Focused client work and project development', color: '#60A5FA' },
              { icon: BookOpen, time: '10:30 – 11:30 PM', label: 'Learning', desc: 'Skill development and continuous improvement', color: '#A78BFA' },
              { icon: PenLine, time: 'Before Sleep', label: 'Daily Journal', desc: 'Reflect on achievements and challenges', color: '#6EE7B7' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-2.5 rounded-lg bg-bg">
                <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: item.color + '15' }}>
                  <item.icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-text-primary">{item.label}</p>
                  <p className="text-[10px] text-text-muted">{item.desc}</p>
                </div>
                <span className="text-[10px] font-mono text-text-muted">{item.time}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-text-muted">
            <p><span className="font-medium text-text-secondary">Weekdays:</span> 4 hours daily</p>
            <p><span className="font-medium text-text-secondary">Weekends:</span> 12 hours</p>
          </div>
        </motion.div>

        {/* Personal Discipline Code */}
        <motion.div
          className="p-5 rounded-xl border border-border bg-surface"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-sm font-semibold text-text-primary mb-3">Personal Discipline Code</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {[
              { icon: UtensilsCrossed, label: 'No Fast Food', desc: 'Eat clean. Your body is your engine.' },
              { icon: Smartphone, label: 'No Late-Night Scrolling', desc: 'Control screen time. No wasted hours.' },
              { icon: Moon, label: 'Sleep Discipline', desc: 'Consistent sleep schedule. Rest to perform.' },
              { icon: Dumbbell, label: 'Daily Fitness', desc: 'Exercise is mandatory. Physical = mental.' },
              { icon: Sparkles, label: 'Professional Standards', desc: 'Clean grooming, confident presence.' },
              { icon: Target, label: 'Daily Progress Tracking', desc: 'Document every day. Build the book.' },
            ].map((item) => (
              <div key={item.label} className="p-2.5 rounded-lg bg-bg border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <item.icon className="w-3.5 h-3.5 text-accent" />
                  <span className="text-xs font-semibold text-text-primary">{item.label}</span>
                </div>
                <p className="text-[10px] text-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Financial Targets */}
        <motion.div
          className="p-5 rounded-xl border border-border bg-surface"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-success" /> Financial Targets
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">Revenue Goals</p>
              <ul className="space-y-1.5">
                {[
                  'Deliver $12,000 CAD project successfully',
                  'Maintain $11/hour US client consistently',
                  'Close 3–5 new projects',
                  'Target total revenue: $15,000–$20,000 CAD',
                ].map((item, i) => (
                  <li key={i} className="text-xs text-text-secondary pl-3 border-l-2 border-success/30">{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">Savings Goals</p>
              <ul className="space-y-1.5">
                {[
                  'Save at least 50% of earnings',
                  'Build 3–4 months emergency backup',
                  'Maintain clear expense tracking',
                ].map((item, i) => (
                  <li key={i} className="text-xs text-text-secondary pl-3 border-l-2 border-info/30">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Startup Readiness Milestones */}
        <motion.div
          className="p-5 rounded-xl border border-border bg-surface"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-info" /> Startup Readiness Milestones
          </h3>
          <p className="text-xs text-text-muted mb-3">What &quot;ready to leave job&quot; actually means — checkpoints before making the leap.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { label: 'Financial Security', desc: 'Minimum 3–4 months financial backup ready before quitting' },
              { label: 'Client Base', desc: 'At least 2 recurring clients secured with consistent work' },
              { label: 'Portfolio Strength', desc: 'Portfolio with 5–7 strong projects demonstrating capability' },
              { label: 'Operational Foundation', desc: 'Company profile fully created with workflow system stabilized' },
            ].map((item) => (
              <div key={item.label} className="p-3 rounded-lg bg-bg border border-border">
                <p className="text-xs font-semibold text-text-primary mb-0.5">{item.label}</p>
                <p className="text-[10px] text-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Accountability System */}
        <motion.div
          className="p-5 rounded-xl border border-border bg-surface"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent" /> Accountability System
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-bg border border-border">
              <p className="text-xs font-semibold text-accent mb-1">Weekly Friday Meeting (9 PM)</p>
              <p className="text-[10px] text-text-muted">
                Work completed, hours tracked, challenges faced, lessons learned, next week&apos;s goals.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-bg border border-border">
              <p className="text-xs font-semibold text-accent mb-1">Tracking System: The Book</p>
              <p className="text-[10px] text-text-muted">
                Document each day: work, fitness, learning, achievements, challenges, and lessons. After 100 days: a real book of our journey.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-bg border border-border">
              <p className="text-xs font-semibold text-accent mb-1">Recognition & Rewards</p>
              <p className="text-[10px] text-text-muted">
                Per-cycle rewards. Titles: Top Performer, Most Consistent, Best Learner. Day 100: Founder of Discipline Award.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Cost of Failure */}
        <motion.div
          className="p-5 rounded-xl border border-border bg-surface"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-danger/5 border border-danger/20">
              <p className="text-xs font-semibold text-danger mb-2">If We Fail</p>
              <ul className="space-y-1">
                {['We stay stuck in jobs', 'No startup launch', 'No financial independence', 'Lost time and opportunities', 'Confidence decreases'].map((item) => (
                  <li key={item} className="text-[10px] text-text-muted">- {item}</li>
                ))}
              </ul>
            </div>
            <div className="p-3 rounded-lg bg-success/5 border border-success/20">
              <p className="text-xs font-semibold text-success mb-2">If We Succeed</p>
              <ul className="space-y-1">
                {['Startup begins', 'Financial stability', 'Freedom from job', 'Strong professional identity', 'Founder of Discipline Award'].map((item) => (
                  <li key={item} className="text-[10px] text-text-muted">- {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
