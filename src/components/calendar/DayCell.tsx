'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { DayStatus } from '@/types';
import { cn } from '@/lib/utils';
import { calendarCellVariants } from '@/lib/animations/variants';

interface DayCellProps {
  dayNumber: number;
  status: DayStatus;
  completionPercent: number;
  index: number;
  onClick: (day: number) => void;
}

const statusStyles: Record<DayStatus, string> = {
  complete: 'bg-success/15 border-success/40 text-success',
  partial: 'bg-warning/10 border-warning/30 text-warning',
  missed: 'bg-danger/10 border-danger/30 text-danger',
  today: 'border-accent bg-accent/10 text-accent ring-2 ring-accent/20',
  future: 'bg-elevated/50 border-border/50 text-text-muted',
  rest: 'bg-info/10 border-info/30 text-info',
};

export function DayCell({ dayNumber, status, completionPercent, index, onClick }: DayCellProps) {
  return (
    <motion.button
      custom={index}
      variants={calendarCellVariants}
      initial="hidden"
      animate="visible"
      onClick={() => onClick(dayNumber)}
      className={cn(
        'relative flex flex-col items-center justify-center aspect-square rounded-lg border text-xs font-semibold transition-all',
        statusStyles[status],
        status !== 'future' && 'cursor-pointer hover:scale-105',
        status === 'future' && 'cursor-default opacity-50'
      )}
      whileHover={status !== 'future' ? { scale: 1.08 } : undefined}
      whileTap={status !== 'future' ? { scale: 0.95 } : undefined}
    >
      <span className="font-mono text-xs">{dayNumber}</span>

      {/* Status icon */}
      {status === 'complete' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: index * 0.01 }}
        >
          <Check className="w-3 h-3 mt-0.5" />
        </motion.div>
      )}
      {status === 'missed' && (
        <X className="w-3 h-3 mt-0.5 opacity-60" />
      )}
      {status === 'partial' && (
        <div className="flex gap-0.5 mt-0.5">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-1 h-1 rounded-full',
                i < Math.round(completionPercent / 25)
                  ? 'bg-warning'
                  : 'bg-border'
              )}
            />
          ))}
        </div>
      )}

      {/* Today pulse */}
      {status === 'today' && (
        <motion.div
          className="absolute inset-0 rounded-lg border-2 border-accent"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.02, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}
