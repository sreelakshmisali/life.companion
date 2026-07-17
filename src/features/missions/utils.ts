import { toDateKey } from '@/utils/date';

/** Stable 0..1 pseudo-value from a string seed — same input always gives
 * the same output, so a mission's "history" looks consistent across
 * renders and screens without needing anything stored. */
function seededRatio(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  return (Math.abs(h) % 1000) / 1000;
}

/**
 * Whether a mission was done on a given past day. There's no real
 * persistence yet, so days before today are backed by this deterministic
 * mock (skewed toward "done" so streaks feel earned) — this keeps every
 * mission, including ones just created, looking like it has a history for
 * the streak and calendar views. Today always uses the mission's real
 * `done` flag instead of this.
 */
export function mockMissionDoneOnDay(missionId: string, dateKey: string): boolean {
  return seededRatio(`${missionId}:${dateKey}`) < 0.72;
}

const HISTORY_WINDOW_DAYS = 35;

export interface MissionStats {
  /** dateKey -> done, oldest first, covering the streak window through today. */
  doneByDate: Record<string, boolean>;
  currentStreak: number;
  bestStreak: number;
}

/** Builds the completion map, current streak, and best streak for one mission. */
export function computeMissionStats(missionId: string, doneToday: boolean): MissionStats {
  const days: Date[] = [];
  for (let i = 0; i < HISTORY_WINDOW_DAYS; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d);
  }

  const doneByDate: Record<string, boolean> = {};
  days.forEach((d, i) => {
    const key = toDateKey(d);
    doneByDate[key] = i === 0 ? doneToday : mockMissionDoneOnDay(missionId, key);
  });

  let currentStreak = 0;
  for (const d of days) {
    if (doneByDate[toDateKey(d)]) currentStreak += 1;
    else break;
  }

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
