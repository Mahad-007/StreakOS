'use client';

import { motion } from 'framer-motion';
import { UtensilsCrossed, Smartphone, Moon, Sparkles, Check } from 'lucide-react';
import { DISCIPLINE_RULES } from '@/lib/constants';
import { DailyEntry } from '@/types';
import { cn } from '@/lib/utils';
import { staggerContainer, staggerChild } from '@/lib/animations/variants';

const iconMap = {
  UtensilsCrossed,
  SmartphoneOff: Smartphone,
  Moon,
  Sparkles,
};

interface DisciplineRulesProps {
  entry: DailyEntry | null;
  onToggle: (rule: string) => void;
}

export function DisciplineRules({ entry, onToggle }: DisciplineRulesProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-text-secondary mb-3">Discipline Code</h3>
      <motion.div
        className="grid grid-cols-2 gap-2"
        variants={staggerContainer(0.05)}
        initial="hidden"
        animate="visible"
      >
        {DISCIPLINE_RULES.map((rule) => {
          const Icon = iconMap[rule.icon as keyof typeof iconMap];
          const isChecked = entry?.[rule.id as keyof DailyEntry] === true;

          return (
            <motion.button
              key={rule.id}
              variants={staggerChild}
              onClick={() => onToggle(rule.id)}
              className={cn(
                'flex items-center gap-2.5 p-3 rounded-lg border text-left transition-all duration-200',
                isChecked
                  ? 'border-success/30 bg-success/5'
                  : 'border-border bg-surface hover:bg-elevated'
              )}
              whileTap={{ scale: 0.97 }}
            >
              <div
                className={cn(
                  'flex items-center justify-center w-6 h-6 rounded-md border transition-all',
                  isChecked ? 'border-success bg-success/20' : 'border-border'
                )}
              >
                {isChecked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <Check className="w-3.5 h-3.5 text-success" />
                  </motion.div>
                )}
              </div>
              {Icon && <Icon className="w-4 h-4 text-text-muted" />}
              <span
                className={cn(
                  'text-xs font-medium',
                  isChecked ? 'text-text-muted line-through' : 'text-text-primary'
                )}
              >
                {rule.label}
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
