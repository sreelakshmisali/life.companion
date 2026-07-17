import React, { createContext, useContext, useMemo, useState } from 'react';
import { getLastNDays, toDateKey, getWeekdayLabel } from '@/utils/date';
import { MOCK_PAST_MORNING_MOODS, MOCK_PAST_NIGHT_MOODS } from '../constants';
import { MoodDayEntry, MoodExportShape, MoodId, MoodPeriod } from '../types';

interface MoodContextValue {
  morningMood: MoodId | null;
  nightMood: MoodId | null;
  setMood: (period: MoodPeriod, id: MoodId) => void;
  weekHistory: MoodDayEntry[];
  exportShape: MoodExportShape;
  replaceAll: (shape: MoodExportShape | null) => void;
}

const MoodContext = createContext<MoodContextValue | undefined>(undefined);

export function MoodProvider({ children }: { children: React.ReactNode }) {
  const [morningMood, setMorningMood] = useState<MoodId | null>(null);
  const [nightMood, setNightMood] = useState<MoodId | null>(null);

  const value = useMemo<MoodContextValue>(() => {
    const days = getLastNDays(7); // includes today, oldest first
    const weekHistory: MoodDayEntry[] = days.map((d, i) => {
      const isToday = i === days.length - 1;
      return {
        dateKey: toDateKey(d),
        label: getWeekdayLabel(d),
        morningMoodId: isToday ? morningMood : MOCK_PAST_MORNING_MOODS[i] ?? null,
        nightMoodId: isToday ? nightMood : MOCK_PAST_NIGHT_MOODS[i] ?? null,
        isToday,
      };
    });

    return {
      morningMood,
      nightMood,
      setMood: (period: MoodPeriod, id: MoodId) => {
        if (period === 'morning') setMorningMood(id);
        else setNightMood(id);
      },
      weekHistory,
      exportShape: { morningMood, nightMood },
      replaceAll: (shape: MoodExportShape | null) => {
        setMorningMood(shape?.morningMood ?? null);
        setNightMood(shape?.nightMood ?? null);
      },
    };
  }, [morningMood, nightMood]);

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
}

export function useMood() {
  const ctx = useContext(MoodContext);
  if (!ctx) throw new Error('useMood must be used within a MoodProvider');
  return ctx;
}
