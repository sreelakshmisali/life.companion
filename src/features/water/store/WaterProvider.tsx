import React, { createContext, useContext, useMemo, useState } from 'react';
import { getLastNDays, toDateKey, getWeekdayLabel } from '@/utils/date';
import {
  DEFAULT_REMINDER_INTERVAL_MINUTES,
  DEFAULT_TODAY_CUPS,
  DEFAULT_WATER_REMINDER_MESSAGES,
  MOCK_PAST_WATER_CUPS,
  WATER_GOAL_CUPS,
} from '../constants';
import { WaterDayEntry, WaterReminderMessage } from '../types';

interface WaterContextValue {
  cups: number;
  goal: number;
  addCup: () => void;
  removeCup: () => void;
  weekHistory: WaterDayEntry[];

  // Reminders (preferences only — no push scheduling wired up yet)
  reminderEnabled: boolean;
  setReminderEnabled: (enabled: boolean) => void;
  reminderIntervalMinutes: number;
  setReminderIntervalMinutes: (minutes: number) => void;
  reminderMessages: WaterReminderMessage[];
  addReminderMessage: (text: string) => void;
  editReminderMessage: (id: string, text: string) => void;
  removeReminderMessage: (id: string) => void;
  hydrate: (snapshot: {
    cups: number;
    reminderEnabled: boolean;
    reminderIntervalMinutes: number;
    reminderMessages: WaterReminderMessage[];
  }) => void;
}

const WaterContext = createContext<WaterContextValue | undefined>(undefined);

export function WaterProvider({ children }: { children: React.ReactNode }) {
  const [cups, setCups] = useState(DEFAULT_TODAY_CUPS);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderIntervalMinutes, setReminderIntervalMinutes] = useState(DEFAULT_REMINDER_INTERVAL_MINUTES);
  const [reminderMessages, setReminderMessages] = useState<WaterReminderMessage[]>(DEFAULT_WATER_REMINDER_MESSAGES);

  const value = useMemo<WaterContextValue>(() => {
    const days = getLastNDays(7); // includes today, oldest first
    const weekHistory: WaterDayEntry[] = days.map((d, i) => {
      const isToday = i === days.length - 1;
      return {
        dateKey: toDateKey(d),
        label: getWeekdayLabel(d),
        cups: isToday ? cups : MOCK_PAST_WATER_CUPS[i] ?? 0,
        isToday,
      };
    });

    return {
      cups,
      goal: WATER_GOAL_CUPS,
      addCup: () => setCups((c) => Math.min(c + 1, 12)),
      removeCup: () => setCups((c) => Math.max(c - 1, 0)),
      weekHistory,

      reminderEnabled,
      setReminderEnabled,
      reminderIntervalMinutes,
      setReminderIntervalMinutes,
      reminderMessages,
      addReminderMessage: (text: string) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        setReminderMessages((prev) => [...prev, { id: Date.now().toString(), text: trimmed }]);
      },
      editReminderMessage: (id: string, text: string) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        setReminderMessages((prev) => prev.map((m) => (m.id === id ? { ...m, text: trimmed } : m)));
      },
      removeReminderMessage: (id: string) => setReminderMessages((prev) => prev.filter((m) => m.id !== id)),
      hydrate: (snapshot) => {
        setCups(snapshot.cups);
        setReminderEnabled(snapshot.reminderEnabled);
        setReminderIntervalMinutes(snapshot.reminderIntervalMinutes);
        setReminderMessages(snapshot.reminderMessages);
      },
    };
  }, [cups, reminderEnabled, reminderIntervalMinutes, reminderMessages]);

  return <WaterContext.Provider value={value}>{children}</WaterContext.Provider>;
}

export function useWater() {
  const ctx = useContext(WaterContext);
  if (!ctx) throw new Error('useWater must be used within a WaterProvider');
  return ctx;
}
