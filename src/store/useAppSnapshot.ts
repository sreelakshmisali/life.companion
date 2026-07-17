import { useCallback, useMemo } from 'react';
import { useAppTheme } from '@/theme/ThemeProvider';
import { useMissions } from '@/features/missions/store/MissionsProvider';
import { useWater } from '@/features/water/store/WaterProvider';
import { DEFAULT_REMINDER_INTERVAL_MINUTES } from '@/features/water/constants';
import { useMood } from '@/features/mood/store/MoodProvider';
import { useTodos } from '@/features/todo/store/TodoProvider';
import { useQuotes } from '@/features/quotes/store/QuotesProvider';
import { useSpark } from '@/features/spark/store/SparkProvider';
import { useSleepRitual } from '@/features/sleep/store/SleepRitualProvider';
import { useNotificationPrefs } from '@/features/notifications/store/NotificationsProvider';
import { useDailyArchive } from '@/features/onThisDay/store/DailyArchiveProvider';

/**
 * Single source of truth for "everything that should survive a restart."
 * Reused by:
 *  - PersistenceGate (autosave to AsyncStorage + hydrate on launch)
 *  - SettingsScreen (manual JSON export / import)
 *  - SettingsScreen (reset all data)
 *
 * Adding a new persisted field only means touching this file, not every
 * call site that reads or writes a snapshot.
 */
export function useAppSnapshot() {
  const { themeId, setThemeId } = useAppTheme();
  const missions = useMissions();
  const water = useWater();
  const mood = useMood();
  const todos = useTodos();
  const quotes = useQuotes();
  const spark = useSpark();
  const sleep = useSleepRitual();
  const notifications = useNotificationPrefs();
  const dailyArchive = useDailyArchive();

  const data = useMemo(
    () => ({
      themeId,
      missions: missions.missions,
      water: {
        cups: water.cups,
        reminderEnabled: water.reminderEnabled,
        reminderIntervalMinutes: water.reminderIntervalMinutes,
        reminderMessages: water.reminderMessages,
      },
      mood: mood.exportShape,
      todos: todos.todos,
      quotes: quotes.quotes,
      sparkIdeas: spark.ideas,
      sparkRerolledIdeaId: spark.rerolledIdeaId,
      sleepChecklist: sleep.checklist,
      sleepCompletedTonight: sleep.completedTonight,
      notifications: {
        missionsEnabled: notifications.missionsEnabled,
        waterEnabled: notifications.waterEnabled,
        meditationEnabled: notifications.meditationEnabled,
        sleepEnabled: notifications.sleepEnabled,
      },
      dailyArchive: dailyArchive.archive,
    }),
    [
      themeId,
      missions.missions,
      water.cups,
      water.reminderEnabled,
      water.reminderIntervalMinutes,
      water.reminderMessages,
      mood.exportShape,
      todos.todos,
      quotes.quotes,
      spark.ideas,
      spark.rerolledIdeaId,
      sleep.checklist,
      sleep.completedTonight,
      notifications.missionsEnabled,
      notifications.waterEnabled,
      notifications.meditationEnabled,
      notifications.sleepEnabled,
      dailyArchive.archive,
    ]
  );

  const hydrateAll = useCallback(
    (d: any) => {
      if (!d || typeof d !== 'object') return;
      if (typeof d.themeId === 'string') setThemeId(d.themeId);
      if (d.missions) missions.replaceAll(d.missions);
      if (d.water) water.hydrate(d.water);
      if (d.mood !== undefined) mood.replaceAll(d.mood);
      if (d.todos) todos.replaceAll(d.todos);
      if (d.quotes) quotes.replaceAll(d.quotes);
      if (d.sparkIdeas) spark.replaceAll(d.sparkIdeas);
      if (d.sparkRerolledIdeaId !== undefined) spark.replaceRerollState(d.sparkRerolledIdeaId);
      if (d.sleepChecklist) sleep.replaceAll(d.sleepChecklist);
      if (d.sleepCompletedTonight) sleep.replaceCompletedTonight(d.sleepCompletedTonight);
      if (d.notifications) notifications.replaceAll(d.notifications);
      if (d.dailyArchive) dailyArchive.replaceArchive(d.dailyArchive);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setThemeId, missions, water, mood, todos, quotes, spark, sleep, notifications, dailyArchive]
  );

  const resetAll = useCallback(() => {
    missions.replaceAll([]);
    water.hydrate({
      cups: 0,
      reminderEnabled: true,
      reminderIntervalMinutes: DEFAULT_REMINDER_INTERVAL_MINUTES,
      reminderMessages: [],
    });
    mood.replaceAll(null);
    todos.replaceAll([]);
    quotes.replaceAll([]);
    spark.replaceAll([]);
    spark.replaceRerollState(null);
    sleep.replaceAll([]);
    sleep.replaceCompletedTonight([]);
    notifications.replaceAll({
      missionsEnabled: true,
      waterEnabled: true,
      meditationEnabled: true,
      sleepEnabled: true,
    });
    dailyArchive.replaceArchive({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missions, water, mood, todos, quotes, spark, sleep, notifications, dailyArchive]);

  return { data, hydrateAll, resetAll };
}
