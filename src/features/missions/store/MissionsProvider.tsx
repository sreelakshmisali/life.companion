import React, { createContext, useContext, useMemo, useState } from 'react';
import { getLastNDays, toDateKey, getWeekdayLabel } from '@/utils/date';
import { mockMissions, MOCK_PAST_ALL_MISSIONS_DONE } from '../constants';
import { Mission, MissionDayEntry } from '../types';

interface MissionsContextValue {
  missions: Mission[];
  toggleMission: (id: string) => void;
  addMission: (label: string) => void;
  editMission: (id: string, label: string) => void;
  removeMission: (id: string) => void;
  replaceAll: (missions: Mission[]) => void;
  weekHistory: MissionDayEntry[];
  currentStreak: number;
}

const MissionsContext = createContext<MissionsContextValue | undefined>(undefined);

export function MissionsProvider({ children }: { children: React.ReactNode }) {
  const [missions, setMissions] = useState<Mission[]>(mockMissions);

  const value = useMemo<MissionsContextValue>(() => {
    const todayAllDone = missions.length > 0 && missions.every((m) => m.done);

    const days = getLastNDays(7); // includes today, oldest first
    const weekHistory: MissionDayEntry[] = days.map((d, i) => {
      const isToday = i === days.length - 1;
      return {
        dateKey: toDateKey(d),
        label: getWeekdayLabel(d),
        allDone: isToday ? todayAllDone : MOCK_PAST_ALL_MISSIONS_DONE[i] ?? false,
        isToday,
      };
    });

    // Consecutive fully-completed days, most recent first. Today doesn't
    // break the streak until it's actually incomplete at day's end.
    let currentStreak = 0;
    for (let i = weekHistory.length - 1; i >= 0; i--) {
      const day = weekHistory[i];
      if (day.allDone) {
        currentStreak += 1;
      } else if (!day.isToday) {
        break;
      }
    }

    return {
      missions,
      toggleMission: (id: string) =>
        setMissions((prev) => prev.map((m) => (m.id === id ? { ...m, done: !m.done } : m))),
      addMission: (label: string) => {
        const trimmed = label.trim();
        if (!trimmed) return;
        setMissions((prev) => [...prev, { id: Date.now().toString(), label: trimmed, done: false }]);
      },
      editMission: (id: string, label: string) => {
        const trimmed = label.trim();
        if (!trimmed) return;
        setMissions((prev) => prev.map((m) => (m.id === id ? { ...m, label: trimmed } : m)));
      },
      removeMission: (id: string) => setMissions((prev) => prev.filter((m) => m.id !== id)),
      replaceAll: (next: Mission[]) => setMissions(next),
      weekHistory,
      currentStreak,
    };
  }, [missions]);

  return <MissionsContext.Provider value={value}>{children}</MissionsContext.Provider>;
}

export function useMissions() {
  const ctx = useContext(MissionsContext);
  if (!ctx) throw new Error('useMissions must be used within a MissionsProvider');
  return ctx;
}
