import React, { createContext, useContext, useMemo } from 'react';
import { useDailyArchive } from '@/features/onThisDay/store/DailyArchiveProvider';
import { toDateKey } from '@/utils/date';
import { calculateGlobalStreak } from '../utils/streakCalculator';

interface StreakContextValue {
  currentStreak: number;
}

const StreakContext = createContext<StreakContextValue | undefined>(undefined);

export function StreakProvider({ children }: { children: React.ReactNode }) {
  const { archive } = useDailyArchive();
  const todayKey = toDateKey(new Date());

  const currentStreak = useMemo(() => {
    return calculateGlobalStreak(archive, todayKey);
  }, [archive, todayKey]);

  return (
    <StreakContext.Provider value={{ currentStreak }}>
      {children}
    </StreakContext.Provider>
  );
}

export function useStreak() {
  const ctx = useContext(StreakContext);
  if (!ctx) throw new Error('useStreak must be used within a StreakProvider');
  return ctx;
}
