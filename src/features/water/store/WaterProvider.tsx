import React, { createContext, useContext, useMemo, useState } from 'react';
import { getLastNDays, toDateKey, getWeekdayLabel } from '@/utils/date';
import {
  DEFAULT_REMINDER_INTERVAL_MINUTES,
  DEFAULT_WATER_REMINDER_MESSAGES,
  WATER_GOAL_CUPS,
} from '../constants';
import { WaterDayEntry, WaterReminderMessage } from '../types';

interface WaterContextValue {
  cups: number;
  goal: number;
  setGoal: (goal: number) => void;
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
    goal: number;
    lastResetDate: string;
    reminderEnabled: boolean;
    reminderIntervalMinutes: number;
    reminderMessages: WaterReminderMessage[];
  }) => void;
}

const WaterContext = createContext<WaterContextValue | undefined>(undefined);

export function WaterProvider({ children }: { children: React.ReactNode }) {
  const todayKey = toDateKey(new Date());

  const [cups, setCups] = useState(0);
  const [goal, setGoalState] = useState(WATER_GOAL_CUPS);
  const [lastResetDate, setLastResetDate] = useState(todayKey);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderIntervalMinutes, setReminderIntervalMinutes] = useState(DEFAULT_REMINDER_INTERVAL_MINUTES);
  const [reminderMessages, setReminderMessages] = useState<WaterReminderMessage[]>(DEFAULT_WATER_REMINDER_MESSAGES);

  const value = useMemo<WaterContextValue>(() => {
    // Daily reset: if we haven't seen today's date yet, cups go back to 0.
    // This happens transparently — the hydrate call from PersistenceGate
    // sets lastResetDate from storage; if it's a past date the first
    // setCups(0) below fires and autosave picks it up naturally.
    const effectiveCups = lastResetDate === todayKey ? cups : 0;

    const days = getLastNDays(7);
    const weekHistory: WaterDayEntry[] = days.map((d, i) => {
      const isToday = i === days.length - 1;
      return {
        dateKey: toDateKey(d),
        label: getWeekdayLabel(d),
        cups: isToday ? effectiveCups : 0,
        isToday,
      };
    });

    return {
      cups: effectiveCups,
      goal,
      setGoal: (g: number) => setGoalState(Math.max(1, Math.min(g, 20))),
      weekHistory,
      addCup: () => {
        if (lastResetDate !== todayKey) {
          // First tap of a new day — reset first, then add
          setLastResetDate(todayKey);
          setCups(1);
        } else {
          setCups((c) => Math.min(c + 1, 20));
        }
      },
      removeCup: () => {
        if (lastResetDate !== todayKey) {
          setLastResetDate(todayKey);
          setCups(0);
        } else {
          setCups((c) => Math.max(c - 1, 0));
        }
      },

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
        const isToday = snapshot.lastResetDate === todayKey;
        setCups(isToday ? snapshot.cups : 0);
        setGoalState(snapshot.goal ?? WATER_GOAL_CUPS);
        setLastResetDate(todayKey); // always stamp today on hydrate
        setReminderEnabled(snapshot.reminderEnabled);
        setReminderIntervalMinutes(snapshot.reminderIntervalMinutes);
        setReminderMessages(snapshot.reminderMessages);
      },
    };
  }, [cups, goal, lastResetDate, reminderEnabled, reminderIntervalMinutes, reminderMessages, todayKey]);

  return <WaterContext.Provider value={value}>{children}</WaterContext.Provider>;
}

export function useWater() {
  const ctx = useContext(WaterContext);
  if (!ctx) throw new Error('useWater must be used within a WaterProvider');
  return ctx;
}
