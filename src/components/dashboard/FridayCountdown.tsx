'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, Clock } from 'lucide-react';
import { getNextFriday, getTimeUntil } from '@/lib/utils';

export function FridayCountdown() {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    setTimeLeft(getTimeUntil(getNextFriday()));
    const interval = setInterval(() => {
      setTimeLeft(getTimeUntil(getNextFriday()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="p-5 rounded-xl border border-border bg-surface"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Video className="w-4 h-4 text-info" />
        <h3 className="text-sm font-semibold text-text-primary">Friday Meeting</h3>
      </div>

      <p className="text-xs text-text-muted mb-3">Weekly presentation at 9:00 PM</p>

      <div className="grid grid-cols-4 gap-2">
        {[
          { value: timeLeft?.days ?? 0, label: 'Days' },
          { value: timeLeft?.hours ?? 0, label: 'Hrs' },
          { value: timeLeft?.minutes ?? 0, label: 'Min' },
          { value: timeLeft?.seconds ?? 0, label: 'Sec' },
        ].map((item) => (
          <div key={item.label} className="text-center p-2 rounded-lg bg-elevated">
            <motion.p
              className="text-lg font-bold font-mono text-text-primary"
              key={item.value}
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {String(item.value).padStart(2, '0')}
            </motion.p>
            <p className="text-[10px] text-text-muted">{item.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
