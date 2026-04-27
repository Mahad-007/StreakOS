'use client';

import { motion } from 'framer-motion';
import { Dumbbell, Laptop, BookOpen, PenLine, Check } from 'lucide-react';
import { TaskType, TaskDefinition } from '@/types';
import { cn } from '@/lib/utils';

const iconMap = {
  Dumbbell,
  Laptop,
  BookOpen,
  PenLine,
};

interface TaskItemProps {
  task: TaskDefinition;
  completed: boolean;
  onToggle: (taskId: TaskType) => void;
  index: number;
}

export function TaskItem({ task, completed, onToggle, index }: TaskItemProps) {
  const Icon = iconMap[task.icon as keyof typeof iconMap];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.button
        onClick={() => onToggle(task.id)}
        className={cn(
          'w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-300',
          completed
            ? 'border-success/30 bg-success/5'
            : 'border-border bg-surface hover:border-border hover:bg-elevated'
        )}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        animate={completed ? {
          boxShadow: [
            '0 0 0 0 rgba(52, 211, 153, 0)',
            '0 0 20px 4px rgba(52, 211, 153, 0.15)',
            '0 0 0 0 rgba(52, 211, 153, 0)',
          ],
        } : {}}
        transition={{ duration: 0.6 }}
      >
        {/* Checkbox */}
        <div
          className={cn(
            'relative flex items-center justify-center w-10 h-10 rounded-lg border-2 transition-all duration-300',
            completed
              ? 'border-success bg-success/20'
              : 'border-border'
          )}
          style={{ borderColor: completed ? undefined : task.color + '40' }}
        >
          {completed ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <Check className="w-5 h-5 text-success" />
            </motion.div>
          ) : (
            <div
              className="w-3 h-3 rounded-sm opacity-30"
              style={{ backgroundColor: task.color }}
            />
          )}
        </div>

        {/* Icon */}
        <div
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300',
            completed ? 'opacity-50' : 'opacity-100'
          )}
          style={{ backgroundColor: task.color + '15' }}
        >
          {Icon && <Icon className="w-5 h-5" style={{ color: task.color }} />}
        </div>

        {/* Content */}
        <div className="flex-1 text-left">
          <p
            className={cn(
              'font-semibold text-sm transition-all duration-300',
              completed ? 'text-text-muted line-through' : 'text-text-primary'
            )}
          >
            {task.label}
          </p>
          <p className="text-xs text-text-muted mt-0.5">{task.time}</p>
        </div>

        {/* Description */}
        <p className="hidden sm:block text-xs text-text-muted max-w-48 text-right">
          {task.description}
        </p>
      </motion.button>
    </motion.div>
  );
}
