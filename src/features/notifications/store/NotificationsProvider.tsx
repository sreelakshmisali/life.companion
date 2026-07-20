import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { NotificationPrefs } from '../types';
import { NotificationService } from '../NotificationService';
import { useMissions } from '@/features/missions/store/MissionsProvider';
import { useWater } from '@/features/water/store/WaterProvider';
import { useSleepRitual } from '@/features/sleep/store/SleepRitualProvider';
import { useDailyRoutine } from '@/features/settings/store/DailyRoutineProvider';
import { useDailyArchive } from '@/features/onThisDay/store/DailyArchiveProvider';
import { isDayComplete } from '@/features/streak/utils/streakCalculator';
import { toDateKey } from '@/utils/date';

interface NotificationsContextValue extends NotificationPrefs {
  setPref: <K extends keyof NotificationPrefs>(key: K, value: NotificationPrefs[K]) => void;
  replaceAll: (prefs: NotificationPrefs) => void;
  systemPermissionEnabled: boolean;
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

export const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  allEnabled: false,
  morningEnabled: true,
  morningTime: '08:00',
  waterEnabled: true,
  waterStartTime: '08:00',
  waterEndTime: '20:00',
  missionsEnabled: true,
  missionsTime: '18:00',
  sleepEnabled: true,
  sleepTime: '21:00',
  streakEnabled: true,
  streakTime: '22:00',
};

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_NOTIFICATION_PREFS);
  const [systemPermissionEnabled, setSystemPermissionEnabled] = useState(true);

  // App state dependencies for sync
  const { missions } = useMissions();
  const { cups, goal, reminderIntervalMinutes } = useWater();
  const { checklist, completedTonight } = useSleepRitual();
  const dailyRoutine = useDailyRoutine();
  const { getEntry } = useDailyArchive();
  
  const todayEntry = getEntry(toDateKey(new Date()));
  const streakIsSafe = todayEntry ? isDayComplete(todayEntry) : false;

  useEffect(() => {
    // Check permission on mount and when allEnabled changes
    const checkPerms = async () => {
      const isEnabled = await NotificationService.checkPermissions();
      setSystemPermissionEnabled(isEnabled);
    };
    checkPerms();
  }, [prefs.allEnabled]);

  useEffect(() => {
    // App lifecycle sync
    const sub = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        NotificationService.syncDailySchedule(prefs, {
          dailyRoutine,
          missions: { list: missions, todayKey: toDateKey(new Date()) },
          water: { cups, goal, intervalMinutes: reminderIntervalMinutes },
          sleep: { checklist, completedTonight },
          streakIsSafe,
        });
      }
    });
    return () => sub.remove();
  }, [prefs, missions, cups, goal, reminderIntervalMinutes, checklist, completedTonight, dailyRoutine, streakIsSafe]);

  // Sync whenever relevant state changes (live updates)
  useEffect(() => {
    NotificationService.syncDailySchedule(prefs, {
      dailyRoutine,
      missions: { list: missions, todayKey: toDateKey(new Date()) },
      water: { cups, goal, intervalMinutes: reminderIntervalMinutes },
      sleep: { checklist, completedTonight },
      streakIsSafe,
    });
  }, [prefs, missions, cups, goal, reminderIntervalMinutes, checklist, completedTonight, dailyRoutine, streakIsSafe]);

  const value = useMemo<NotificationsContextValue>(() => ({
    ...prefs,
    setPref: (key, val) => setPrefs((p) => ({ ...p, [key]: val })),
    replaceAll: (newPrefs) => setPrefs(newPrefs),
    systemPermissionEnabled,
  }), [prefs, systemPermissionEnabled]);

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotificationPrefs() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotificationPrefs must be used within a NotificationsProvider');
  return ctx;
}
