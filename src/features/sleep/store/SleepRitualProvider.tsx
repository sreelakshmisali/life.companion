import React, { createContext, useContext, useMemo, useState } from 'react';
import { getLastNDays, toDateKey, getWeekdayLabel } from '@/utils/date';
import { DEFAULT_SLEEP_CHECKLIST, MOCK_PAST_SLEEP_COMPLETION } from '../constants';
import { SleepChecklistItem, SleepNightEntry } from '../types';

interface SleepContextValue {
  checklist: SleepChecklistItem[];
  addItem: (label: string) => void;
  editItem: (id: string, label: string) => void;
  removeItem: (id: string) => void;
  replaceAll: (items: SleepChecklistItem[]) => void;
  completedTonight: string[];
  toggleTonightItem: (id: string) => void;
  replaceCompletedTonight: (ids: string[]) => void;
  weekHistory: SleepNightEntry[];
  currentStreak: number;
}

const SleepContext = createContext<SleepContextValue | undefined>(undefined);

export function SleepRitualProvider({ children }: { children: React.ReactNode }) {
  const [checklist, setChecklist] = useState<SleepChecklistItem[]>(DEFAULT_SLEEP_CHECKLIST);
  const [completedTonight, setCompletedTonight] = useState<string[]>([]);

  const value = useMemo<SleepContextValue>(() => {
    const days = getLastNDays(7); // includes today, oldest first
    const tonightRatio = checklist.length > 0 ? completedTonight.length / checklist.length : 0;

    const weekHistory: SleepNightEntry[] = days.map((d, i) => {
      const isToday = i === days.length - 1;
      const ratio = isToday ? tonightRatio : MOCK_PAST_SLEEP_COMPLETION[i] ?? 0;
      return {
        dateKey: toDateKey(d),
        label: getWeekdayLabel(d),
        completedCount: Math.round(ratio * checklist.length),
        totalCount: checklist.length,
        isToday,
      };
    });

    // Count consecutive fully-completed nights, most recent first (today doesn't
    // break the streak until it's actually incomplete at ritual time).
    let currentStreak = 0;
    for (let i = weekHistory.length - 1; i >= 0; i--) {
      const night = weekHistory[i];
      if (night.totalCount > 0 && night.completedCount >= night.totalCount) {
        currentStreak += 1;
      } else if (!night.isToday) {
        break;
      }
    }

    return {
      checklist,
      addItem: (label: string) => {
        const trimmed = label.trim();
        if (!trimmed) return;
        setChecklist((prev) => [...prev, { id: Date.now().toString(), label: trimmed }]);
      },
      editItem: (id: string, label: string) => {
        const trimmed = label.trim();
        if (!trimmed) return;
        setChecklist((prev) => prev.map((i) => (i.id === id ? { ...i, label: trimmed } : i)));
      },
      removeItem: (id: string) => {
        setChecklist((prev) => prev.filter((i) => i.id !== id));
        setCompletedTonight((prev) => prev.filter((cid) => cid !== id));
      },
      replaceAll: (next: SleepChecklistItem[]) => setChecklist(next),
      completedTonight,
      toggleTonightItem: (id: string) =>
        setCompletedTonight((prev) => (prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id])),
      replaceCompletedTonight: (ids: string[]) => setCompletedTonight(ids),
      weekHistory,
      currentStreak,
    };
  }, [checklist, completedTonight]);

  return <SleepContext.Provider value={value}>{children}</SleepContext.Provider>;
}

export function useSleepRitual() {
  const ctx = useContext(SleepContext);
  if (!ctx) throw new Error('useSleepRitual must be used within a SleepRitualProvider');
  return ctx;
}
