import React, { createContext, useContext, useMemo, useState } from 'react';
import { toDateKey } from '@/utils/date';
import { Mission } from '../types';

interface MissionsContextValue {
  missions: Mission[];
  /** Toggle today's completion on/off for a mission. */
  toggleMission: (id: string) => void;
  addMission: (title: string) => void;
  editMission: (id: string, title: string) => void;
  removeMission: (id: string) => void;
  replaceAll: (missions: Mission[]) => void;
  /** Whether every mission is completed today. */
  allDoneToday: boolean;
}

const MissionsContext = createContext<MissionsContextValue | undefined>(undefined);

export function MissionsProvider({ children }: { children: React.ReactNode }) {
  const [missions, setMissions] = useState<Mission[]>([]);

  const value = useMemo<MissionsContextValue>(() => {
    const todayKey = toDateKey(new Date());

    const allDoneToday = missions.length > 0 && missions.every((m) => m.completedDates.includes(todayKey));

    return {
      missions,
      toggleMission: (id: string) =>
        setMissions((prev) =>
          prev.map((m) => {
            if (m.id !== id) return m;
            const already = m.completedDates.includes(todayKey);
            return {
              ...m,
              completedDates: already
                ? m.completedDates.filter((d) => d !== todayKey)
                : [...m.completedDates, todayKey],
            };
          })
        ),
      addMission: (title: string) => {
        const trimmed = title.trim();
        if (!trimmed) return;
        setMissions((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            title: trimmed,
            createdAt: todayKey,
            completedDates: [],
          },
        ]);
      },
      editMission: (id: string, title: string) => {
        const trimmed = title.trim();
        if (!trimmed) return;
        setMissions((prev) => prev.map((m) => (m.id === id ? { ...m, title: trimmed } : m)));
      },
      removeMission: (id: string) => setMissions((prev) => prev.filter((m) => m.id !== id)),
      replaceAll: (next: Mission[]) => setMissions(next),
      allDoneToday,
    };
  }, [missions]);

  return <MissionsContext.Provider value={value}>{children}</MissionsContext.Provider>;
}

export function useMissions() {
  const ctx = useContext(MissionsContext);
  if (!ctx) throw new Error('useMissions must be used within a MissionsProvider');
  return ctx;
}
