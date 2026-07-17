export type MoodId = 'calm' | 'happy' | 'tired' | 'low' | 'excited';

export type MoodPeriod = 'morning' | 'night';

export interface MoodOption {
  id: MoodId;
  emoji: string;
  label: string;
}

export interface MoodDayEntry {
  dateKey: string;
  label: string;
  morningMoodId: MoodId | null;
  nightMoodId: MoodId | null;
  isToday: boolean;
}

export interface MoodExportShape {
  morningMood: MoodId | null;
  nightMood: MoodId | null;
}
