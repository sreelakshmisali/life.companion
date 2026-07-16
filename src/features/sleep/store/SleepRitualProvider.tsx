import React, { createContext, useContext, useMemo, useState } from 'react';
import { DEFAULT_SLEEP_CHECKLIST } from '../constants';
import { SleepChecklistItem } from '../types';

interface SleepContextValue {
  checklist: SleepChecklistItem[];
  addItem: (label: string) => void;
  editItem: (id: string, label: string) => void;
  removeItem: (id: string) => void;
  replaceAll: (items: SleepChecklistItem[]) => void;
}

const SleepContext = createContext<SleepContextValue | undefined>(undefined);

export function SleepRitualProvider({ children }: { children: React.ReactNode }) {
  const [checklist, setChecklist] = useState<SleepChecklistItem[]>(DEFAULT_SLEEP_CHECKLIST);

  const value = useMemo<SleepContextValue>(
    () => ({
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
      removeItem: (id: string) => setChecklist((prev) => prev.filter((i) => i.id !== id)),
      replaceAll: (next: SleepChecklistItem[]) => setChecklist(next),
    }),
    [checklist]
  );

  return <SleepContext.Provider value={value}>{children}</SleepContext.Provider>;
}

export function useSleepRitual() {
  const ctx = useContext(SleepContext);
  if (!ctx) throw new Error('useSleepRitual must be used within a SleepRitualProvider');
  return ctx;
}
