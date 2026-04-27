import { Variants, Transition } from 'framer-motion';

// Page transitions
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -10, filter: 'blur(4px)' },
};

export const pageTransitionConfig: Transition = {
  duration: 0.4,
  ease: [0.22, 1, 0.36, 1],
};

// Stagger container
export const staggerContainer = (staggerDelay = 0.08): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: staggerDelay, delayChildren: 0.1 },
  },
});

// Stagger child
export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
};

// Scale spring for interactive elements
export const scaleSpring = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.97 },
  transition: { type: 'spring' as const, stiffness: 400, damping: 17 },
};

// Checkmark draw animation
export const checkmarkDraw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

// Card glow on completion
export const cardGlow: Variants = {
  idle: { boxShadow: '0 0 0 0 rgba(52, 211, 153, 0)' },
  glow: {
    boxShadow: [
      '0 0 0 0 rgba(52, 211, 153, 0)',
      '0 0 20px 4px rgba(52, 211, 153, 0.3)',
      '0 0 0 0 rgba(52, 211, 153, 0)',
    ],
    transition: { duration: 0.6, times: [0, 0.4, 1] },
  },
};

// Card hover
export const cardHover: Variants = {
  rest: {
    scale: 1,
    boxShadow: '0 0 0 1px rgba(42, 48, 66, 0.5)',
  },
  hover: {
    scale: 1.01,
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 107, 44, 0.2)',
    transition: { duration: 0.2 },
  },
};

// Progress bar fill
export const progressFill = (percent: number, delay = 0.3): Variants => ({
  initial: { scaleX: 0 },
  animate: {
    scaleX: percent / 100,
    transition: { duration: 1, ease: [0.34, 1.56, 0.64, 1], delay },
  },
});

// Glow pulse (for today/active elements)
export const glowPulse = (color: string): Variants => ({
  animate: {
    boxShadow: [
      `0 0 0 0 ${color}00`,
      `0 0 12px 2px ${color}40`,
      `0 0 0 0 ${color}00`,
    ],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
});

// Counter spring config
export const counterSpring = {
  type: 'spring' as const,
  stiffness: 100,
  damping: 30,
  mass: 1,
};

// Shake animation (for missed/error states)
export const shake: Variants = {
  shake: {
    x: [0, -4, 4, -4, 4, 0],
    transition: { duration: 0.4 },
  },
};

// Float animation (decorative)
export const float: Variants = {
  animate: {
    y: [0, -6, 0],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
};

// Streak fire animation
export const streakFire: Variants = {
  idle: { scale: 1, opacity: 0.7 },
  active: {
    scale: [1, 1.15, 1],
    opacity: [0.7, 1, 0.7],
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
  },
};

// Calendar cell stagger
export const calendarCellVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.015,
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

// Day mark animation (when marking a day complete)
export const dayMark: Variants = {
  unmarked: { scale: 0, rotate: -180 },
  marked: {
    scale: 1,
    rotate: 0,
    transition: { type: 'spring', stiffness: 200, damping: 15 },
  },
};

// Celebration overlay
export const celebrationOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3, delay: 0.2 },
  },
};

// Celebration content
export const celebrationContent: Variants = {
  hidden: { scale: 0.5, opacity: 0, y: 50 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 200, damping: 20, delay: 0.1 },
  },
  exit: {
    scale: 0.8,
    opacity: 0,
    y: -30,
    transition: { duration: 0.2 },
  },
};
