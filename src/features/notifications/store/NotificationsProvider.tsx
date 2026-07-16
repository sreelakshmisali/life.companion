import React, { createContext, useContext, useMemo, useState } from 'react';
import { NotificationPrefs } from '../types';

/**
 * These toggles capture the user's *preference* for which reminders they
 * want. They intentionally don't schedule any real push notifications yet —
 * that needs expo-notifications, permission prompts, and background
 * scheduling, which is a meaningfully separate chunk of work. Wiring actual
 * delivery on top of these stored preferences is a clean follow-up phase.
 */
interface NotificationsContextValue extends NotificationPrefs {
  allEnabled: boolean;
  setAllEnabled: (enabled: boolean) => void;
  setMissionsEnabled: (enabled: boolean) => void;
  setWaterEnabled: (enabled: boolean) => void;
  setMeditationEnabled: (enabled: boolean) => void;
  setSleepEnabled: (enabled: boolean) => void;
  replaceAll: (prefs: NotificationPrefs) => void;
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [missionsEnabled, setMissionsEnabled] = useState(true);
  const [waterEnabled, setWaterEnabled] = useState(true);
  const [meditationEnabled, setMeditationEnabled] = useState(true);
  const [sleepEnabled, setSleepEnabled] = useState(true);

  const value = useMemo<NotificationsContextValue>(() => {
    const allEnabled = missionsEnabled && waterEnabled && meditationEnabled && sleepEnabled;
    return {
      missionsEnabled,
      waterEnabled,
      meditationEnabled,
      sleepEnabled,
      allEnabled,
      setAllEnabled: (enabled: boolean) => {
        setMissionsEnabled(enabled);
        setWaterEnabled(enabled);
        setMeditationEnabled(enabled);
        setSleepEnabled(enabled);
      },
      setMissionsEnabled,
      setWaterEnabled,
      setMeditationEnabled,
      setSleepEnabled,
      replaceAll: (prefs: NotificationPrefs) => {
        setMissionsEnabled(prefs.missionsEnabled);
        setWaterEnabled(prefs.waterEnabled);
        setMeditationEnabled(prefs.meditationEnabled);
        setSleepEnabled(prefs.sleepEnabled);
      },
    };
  }, [missionsEnabled, waterEnabled, meditationEnabled, sleepEnabled]);

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotificationPrefs() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotificationPrefs must be used within a NotificationsProvider');
  return ctx;
}
