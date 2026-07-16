import React, { createContext, useContext, useMemo, useState } from 'react';
import { mockMissions } from '../constants';
import { Mission } from '../types';

interface MissionsContextValue {
  missions: Mission[];
  toggleMission: (id: string) => void;
  addMission: (label: string) => void;
  editMission: (id: string, label: string) => void;
  removeMission: (id: string) => void;
  replaceAll: (missions: Mission[]) => void;
}

const MissionsContext = createContext<MissionsContextValue | undefined>(undefined);

export function MissionsProvider({ children }: { children: React.ReactNode }) {
  const [missions, setMissions] = useState<Mission[]>(mockMissions);

  const value = useMemo(
    () => ({
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
    }),
    [missions]
  );

  return <MissionsContext.Provider value={value}>{children}</MissionsContext.Provider>;
}

export function useMissions() {
  const ctx = useContext(MissionsContext);
  if (!ctx) throw new Error('useMissions must be used within a MissionsProvider');
  return ctx;
}
