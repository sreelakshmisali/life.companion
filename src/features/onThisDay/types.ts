/** A frozen summary of one real day, written once that day happens and
 * never rewritten afterward (except to keep "today"'s own slot current). */
export interface DailyArchiveEntry {
  dateKey: string;
  missionsEnabled: boolean;
  missionsTotal: number;
  missionsDone: number;
  waterEnabled: boolean;
  waterCups: number;
  waterGoal: number;
  sleepEnabled: boolean;
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
