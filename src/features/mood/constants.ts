import { MoodId, MoodOption } from './types';

export const MOODS: MoodOption[] = [
  { id: 'calm', emoji: '😌', label: 'Calm' },
  { id: 'happy', emoji: '🙂', label: 'Happy' },
  { id: 'tired', emoji: '😴', label: 'Tired' },
  { id: 'low', emoji: '🌧️', label: 'Low' },
  { id: 'excited', emoji: '✨', label: 'Excited' },
];

/** Mood logged each morning for the 6 days before today, oldest first. */
export const MOCK_PAST_MORNING_MOODS: MoodId[] = ['happy', 'calm', 'tired', 'excited', 'calm', 'happy'];

/** Mood logged each night for the 6 days before today, oldest first. */
export const MOCK_PAST_NIGHT_MOODS: MoodId[] = ['calm', 'happy', 'calm', 'tired', 'excited', 'calm'];

export function moodOptionFor(id: MoodId | null): MoodOption | undefined {
  if (!id) return undefined;
  return MOODS.find((m) => m.id === id);
}
