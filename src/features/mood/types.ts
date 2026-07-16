export type MoodId = 'calm' | 'happy' | 'tired' | 'low' | 'excited';

export interface MoodOption {
  id: MoodId;
  emoji: string;
  label: string;
}

export interface MoodDayEntry {
  dateKey: string;
  label: string;
  moodId: MoodId | null;
  isToday: boolean;
}
