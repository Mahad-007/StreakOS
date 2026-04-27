'use client';

import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Flame, Target } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { PageTransition } from '@/components/animations/PageTransition';
import { useAnalytics } from '@/hooks/useAnalytics';
import { staggerContainer, staggerChild } from '@/lib/animations/variants';
import { TOTAL_DAYS } from '@/lib/constants';

const TASK_COLORS = {
  fitness: '#F87171',
  deep_work: '#60A5FA',
  learning: '#A78BFA',
  journal: '#6EE7B7',
};

export default function AnalyticsPage() {
  const { data, loading } = useAnalytics();

  if (loading) {
    return (
      <PageTransition>
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="h-8 w-48 bg-surface rounded animate-pulse" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-surface border border-border rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="h-64 bg-surface border border-border rounded-xl animate-pulse" />
        </div>
      </PageTransition>
    );
  }

  if (!data) return null;

  const pieData = [
    { name: 'Fitness', value: data.taskRates.fitness, color: TASK_COLORS.fitness },
    { name: 'Deep Work', value: data.taskRates.deep_work, color: TASK_COLORS.deep_work },
    { name: 'Learning', value: data.taskRates.learning, color: TASK_COLORS.learning },
    { name: 'Journal', value: data.taskRates.journal, color: TASK_COLORS.journal },
  ];

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-accent" />
            Analytics
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Your consistency metrics and performance data
          </p>
        </motion.div>

        {/* Stat cards */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
          variants={staggerContainer(0.1)}
          initial="hidden"
          animate="visible"
        >
          {[
            { label: 'Overall Consistency', value: `${Math.round(data.overallConsistency)}%`, icon: Target, color: 'text-accent' },
            { label: 'Perfect Days', value: data.completedDays.toString(), icon: TrendingUp, color: 'text-success' },
            { label: 'Best Streak', value: `${data.bestStreak} days`, icon: Flame, color: 'text-warning' },
            { label: 'Days Tracked', value: `${data.totalDays}/${TOTAL_DAYS}`, icon: BarChart3, color: 'text-info' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={staggerChild}
              className="p-4 rounded-xl border border-border bg-surface"
            >
              <stat.icon className={`w-4 h-4 ${stat.color} mb-2`} />
              <p className="text-2xl font-bold font-mono text-text-primary">{stat.value}</p>
              <p className="text-xs text-text-muted mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Consistency over time */}
        <motion.div
          className="p-5 rounded-xl border border-border bg-surface"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-semibold text-text-primary mb-4">Daily Consistency</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.dailyData}>
                <defs>
                  <linearGradient id="completionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B2C" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF6B2C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#141822',
                    border: '1px solid #2A3042',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: '#F1F5F9' }}
                />
                <Area
                  type="monotone"
                  dataKey="completion"
                  stroke="#FF6B2C"
                  strokeWidth={2}
                  fill="url(#completionGradient)"
                  name="Completion %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Task breakdown + Cycle comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Task breakdown pie */}
          <motion.div
            className="p-5 rounded-xl border border-border bg-surface"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-sm font-semibold text-text-primary mb-4">Task Completion Rates</h3>
            <div className="flex items-center gap-4">
              <div className="w-32 h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={55}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 flex-1">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-text-secondary flex-1">{item.name}</span>
                    <span className="text-xs font-mono font-bold text-text-primary">
                      {Math.round(item.value)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Cycle comparison */}
          <motion.div
            className="p-5 rounded-xl border border-border bg-surface"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-sm font-semibold text-text-primary mb-4">Cycle Comparison</h3>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.cycleData}>
                  <XAxis dataKey="cycle" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#141822',
                      border: '1px solid #2A3042',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="rate" fill="#FF6B2C" radius={[4, 4, 0, 0]} name="Completion %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Heatmap */}
        <motion.div
          className="p-5 rounded-xl border border-border bg-surface"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-sm font-semibold text-text-primary mb-4">100-Day Heatmap</h3>
          <div className="grid grid-cols-10 gap-1">
            {data.dailyData.map((day, i) => (
              <motion.div
                key={day.day}
                className="aspect-square rounded-sm"
                style={{
                  backgroundColor:
                    day.completion === 100 ? '#34D399' :
                    day.completion >= 50 ? '#FBBF24' :
                    day.completion > 0 ? '#EF4444' + '60' :
                    '#1C2130',
                  opacity: day.completion > 0 ? 0.4 + (day.completion / 100) * 0.6 : 0.3,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.01, duration: 0.2 }}
                title={`Day ${day.day}: ${Math.round(day.completion)}%`}
              />
            ))}
            {/* Future days placeholder */}
            {Array.from({ length: TOTAL_DAYS - data.dailyData.length }, (_, i) => (
              <div
                key={`future-${i}`}
                className="aspect-square rounded-sm bg-elevated/30"
              />
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-text-muted">
            <span>Less</span>
            <div className="flex gap-0.5">
              {[0.2, 0.4, 0.6, 0.8, 1].map((opacity) => (
                <div
                  key={opacity}
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: '#34D399', opacity }}
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
