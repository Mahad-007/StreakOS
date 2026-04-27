import { START_DATE, CYCLES, TOTAL_DAYS } from './constants';
import { DayStatus, DailyEntry } from '@/types';

export function getDayNumber(date: Date = new Date()): number {
  const start = new Date(START_DATE);
  start.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diffMs = target.getTime() - start.getTime();
  const day = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, Math.min(day, TOTAL_DAYS));
}

export function getDateForDay(dayNumber: number): Date {
  const date = new Date(START_DATE);
  date.setDate(date.getDate() + dayNumber - 1);
  return date;
}

export function getCycleForDay(day: number) {
  return CYCLES.find((c) => day >= c.start_day && day <= c.end_day) || CYCLES[0];
}

export function getCurrentCycle() {
  return getCycleForDay(getDayNumber());
}

export function isToday(dayNumber: number): boolean {
  return getDayNumber() === dayNumber;
}

export function isFuture(dayNumber: number): boolean {
  return dayNumber > getDayNumber();
}

export function isPast(dayNumber: number): boolean {
  return dayNumber < getDayNumber();
}

export function getCompletionCount(entry: DailyEntry | null): number {
  if (!entry) return 0;
  let count = 0;
  if (entry.fitness_completed) count++;
  if (entry.deep_work_completed) count++;
  if (entry.learning_completed) count++;
  if (entry.journal_completed) count++;
  return count;
}

export function getDayStatus(dayNumber: number, entry: DailyEntry | null): DayStatus {
  if (isFuture(dayNumber)) return 'future';
  if (isToday(dayNumber)) return 'today';
  if (!entry) return 'missed';
  const count = getCompletionCount(entry);
  if (count === 4) return 'complete';
  if (count > 0) return 'partial';
  return 'missed';
}

export function getCompletionPercentage(entry: DailyEntry | null): number {
  return (getCompletionCount(entry) / 4) * 100;
}

export function getNextFriday(): Date {
  const now = new Date();
  const day = now.getDay();
  const daysUntilFriday = (5 - day + 7) % 7 || 7;
  const nextFriday = new Date(now);
  nextFriday.setDate(now.getDate() + daysUntilFriday);
  nextFriday.setHours(21, 0, 0, 0); // 9 PM
  return nextFriday;
}

export function getTimeUntil(target: Date): { days: number; hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const diff = Math.max(0, target.getTime() - now.getTime());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function getDayOfWeek(dayNumber: number): string {
  const date = getDateForDay(dayNumber);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

export function getProgressPercentage(): number {
  const currentDay = getDayNumber();
  return Math.min((currentDay / TOTAL_DAYS) * 100, 100);
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
