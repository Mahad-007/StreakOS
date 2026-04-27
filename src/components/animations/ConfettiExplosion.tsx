'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiExplosionProps {
  trigger: boolean;
}

export function ConfettiExplosion({ trigger }: ConfettiExplosionProps) {
  useEffect(() => {
    if (!trigger) return;

    const taskColors = ['#F87171', '#60A5FA', '#A78BFA', '#6EE7B7'];

    // Center burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: taskColors,
      disableForReducedMotion: true,
    });

    // Left burst
    setTimeout(() => {
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: taskColors,
        disableForReducedMotion: true,
      });
    }, 200);

    // Right burst
    setTimeout(() => {
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: taskColors,
        disableForReducedMotion: true,
      });
    }, 400);
  }, [trigger]);

  return null;
}
