import React, { createContext, useContext, useMemo, useState } from 'react';

export interface DailyRoutineConfig {
  missionsEnabled: boolean;
  waterEnabled: boolean;
  sleepEnabled: boolean;
}

interface DailyRoutineContextValue extends DailyRoutineConfig {
  setMissionsEnabled: (val: boolean) => void;
  setWaterEnabled: (val: boolean) => void;
  setSleepEnabled: (val: boolean) => void;
  replaceAll: (config: DailyRoutineConfig) => void;
}

const DailyRoutineContext = createContext<DailyRoutineContextValue | undefined>(undefined);

export function DailyRoutineProvider({ children }: { children: React.ReactNode }) {
  const [missionsEnabled, setMissionsEnabled] = useState(true);
  const [waterEnabled, setWaterEnabled] = useState(true);
  const [sleepEnabled, setSleepEnabled] = useState(false);

  const value = useMemo<DailyRoutineContextValue>(() => ({
    missionsEnabled,
    waterEnabled,
    sleepEnabled,
    setMissionsEnabled,
    setWaterEnabled,
    setSleepEnabled,
    replaceAll: (config) => {
      setMissionsEnabled(config.missionsEnabled);
      setWaterEnabled(config.waterEnabled);
      setSleepEnabled(config.sleepEnabled);
    },
  }), [missionsEnabled, waterEnabled, sleepEnabled]);

  return (
    <DailyRoutineContext.Provider value={value}>
      {children}
    </DailyRoutineContext.Provider>
  );
}

export function useDailyRoutine() {
  const ctx = useContext(DailyRoutineContext);
  if (!ctx) throw new Error('useDailyRoutine must be used within a DailyRoutineProvider');
  return ctx;
}
