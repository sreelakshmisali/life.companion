import { SleepChecklistItem } from './types';

export const DEFAULT_SLEEP_CHECKLIST: SleepChecklistItem[] = [
  { id: 'sl1', label: 'Brush Teeth' },
  { id: 'sl2', label: 'Journal' },
  { id: 'sl3', label: 'Read' },
  { id: 'sl4', label: 'Meditation' },
  { id: 'sl5', label: 'Lights Off' },
];

/** Fraction of the checklist completed each of the 6 nights before today, oldest first. */
export const MOCK_PAST_SLEEP_COMPLETION: number[] = [1, 0.6, 1, 0.8, 1, 1];
