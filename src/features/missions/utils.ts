import { toDateKey } from '@/utils/date';

const HISTORY_WINDOW_DAYS = 35;

export interface MissionStats {
  /** dateKey -> done, covering the streak window through today. */
  doneByDate: Record<string, boolean>;
  currentStreak: number;
  bestStreak: number;
}

/**
 * Builds completion map, current streak, and best streak for one mission.
 * Uses the mission's own completedDates array — no fake data generated.
 */
export function computeMissionStats(completedDates: string[]): MissionStats {
  const completedSet = new Set(completedDates);
  const days: Date[] = [];
  for (let i = 0; i < HISTORY_WINDOW_DAYS; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d);
  }

  const doneByDate: Record<string, boolean> = {};
  days.forEach((d) => {
    const key = toDateKey(d);
    doneByDate[key] = completedSet.has(key);
  });

  // Current streak: consecutive days from today going backward
  let currentStreak = 0;
  for (const d of days) {
    if (doneByDate[toDateKey(d)]) currentStreak += 1;
    else break;
  }

  // Best streak over the window
  let bestStreak = 0;
  let run = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    const key = toDateKey(days[i]);
    if (doneByDate[key]) {
      run += 1;
      bestStreak = Math.max(bestStreak, run);
    } else {
      run = 0;
    }
  }

  return { doneByDate, currentStreak, bestStreak: Math.max(bestStreak, currentStreak) };
}
