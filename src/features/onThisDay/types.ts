import { MoodId } from '@/features/mood/types';

/** A frozen summary of one real day, written once that day happens and
 * never rewritten afterward (except to keep "today"'s own slot current). */
export interface DailyArchiveEntry {
  dateKey: string;
  missionsTotal: number;
  missionsDone: number;
  morningMoodId: MoodId | null;
  nightMoodId: MoodId | null;
  waterCups: number;
  waterGoal: number;
  sleepCompleted: number;
  sleepTotal: number;
  quote: { quote: string; author: string } | null;
  spark: string | null;
}

export type DailyArchive = Record<string, DailyArchiveEntry>;

/** One "On This Day" row — a target date in the past, and whatever real
 * archive entry (if any) exists for it. */
export interface OnThisDayLookback {
  key: string;
  label: string;
  dateKey: string;
  dateLabel: string;
  entry: DailyArchiveEntry | null;
}
