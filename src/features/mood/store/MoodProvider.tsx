import React, { createContext, useContext, useMemo, useState } from 'react';
import { getLastNDays, toDateKey, getWeekdayLabel } from '@/utils/date';
import { DEFAULT_TODAY_MOOD, MOCK_PAST_MOODS } from '../constants';
import { MoodDayEntry, MoodId } from '../types';

interface MoodContextValue {
  mood: MoodId | null;
  setMood: (id: MoodId) => void;
  weekHistory: MoodDayEntry[];
  replaceAll: (mood: MoodId | null) => void;
}

const MoodContext = createContext<MoodContextValue | undefined>(undefined);

export function MoodProvider({ children }: { children: React.ReactNode }) {
  const [mood, setMood] = useState<MoodId | null>(DEFAULT_TODAY_MOOD);

  const value = useMemo<MoodContextValue>(() => {
    const days = getLastNDays(7); // includes today, oldest first
    const weekHistory: MoodDayEntry[] = days.map((d, i) => {
      const isToday = i === days.length - 1;
      return {
        dateKey: toDateKey(d),
        label: getWeekdayLabel(d),
        moodId: isToday ? mood : MOCK_PAST_MOODS[i] ?? null,
        isToday,
      };
    });

    return { mood, setMood, weekHistory, replaceAll: setMood };
  }, [mood]);

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
}

export function useMood() {
  const ctx = useContext(MoodContext);
  if (!ctx) throw new Error('useMood must be used within a MoodProvider');
  return ctx;
}
