import { BreathPhase, MeditationDurationOption } from './types';

/**
 * A gentle box-breathing style cycle: in, hold, out, hold.
 * targetScale is what the orb eases toward during that phase.
 */
export const BREATH_CYCLE: BreathPhase[] = [
  { label: 'Breathe in', durationMs: 4000, targetScale: 1.18 },
  { label: 'Hold', durationMs: 2000, targetScale: 1.18 },
  { label: 'Breathe out', durationMs: 4000, targetScale: 0.85 },
  { label: 'Hold', durationMs: 2000, targetScale: 0.85 },
];

export const BREATH_CYCLE_TOTAL_MS = BREATH_CYCLE.reduce((sum, p) => sum + p.durationMs, 0);

export const MEDITATION_DURATIONS: MeditationDurationOption[] = [
  { minutes: 3, label: '3 min' },
  { minutes: 5, label: '5 min' },
  { minutes: 10, label: '10 min' },
  { minutes: 20, label: '20 min' },
];

export const DEFAULT_MEDITATION_MINUTES = 5;

export const MEDITATION_CLOSING_MESSAGES = [
  'Well done. Carry this calm with you.',
  'A little stillness goes a long way.',
  'You showed up for yourself today.',
];
