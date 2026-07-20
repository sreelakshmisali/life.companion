import { useCallback, useMemo } from 'react';
import { useAppTheme } from '@/theme/ThemeProvider';
import { useMissions } from '@/features/missions/store/MissionsProvider';
import { useWater } from '@/features/water/store/WaterProvider';
import { DEFAULT_REMINDER_INTERVAL_MINUTES, WATER_GOAL_CUPS } from '@/features/water/constants';
import { useTodos } from '@/features/todo/store/TodoProvider';
import { useQuotes } from '@/features/quotes/store/QuotesProvider';
import { useSpark } from '@/features/spark/store/SparkProvider';
import { useSleepRitual } from '@/features/sleep/store/SleepRitualProvider';
import { useNotificationPrefs, DEFAULT_NOTIFICATION_PREFS } from '@/features/notifications/store/NotificationsProvider';
import { useDailyArchive } from '@/features/onThisDay/store/DailyArchiveProvider';
import { useDailyRoutine } from '@/features/settings/store/DailyRoutineProvider';
import { toDateKey } from '@/utils/date';

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
  const todos = useTodos();
  const quotes = useQuotes();
  const spark = useSpark();
  const sleep = useSleepRitual();
  const notifications = useNotificationPrefs();
  const dailyArchive = useDailyArchive();
  const dailyRoutine = useDailyRoutine();

  const data = useMemo(
    () => ({
      themeId,
      missions: missions.missions,
      water: {
        cups: water.cups,
        goal: water.goal,
        lastResetDate: toDateKey(new Date()),
        reminderEnabled: water.reminderEnabled,
        reminderIntervalMinutes: water.reminderIntervalMinutes,
        reminderMessages: water.reminderMessages,
      },
      todos: todos.todos,
      quotes: quotes.quotes,
      sparkIdeas: spark.ideas,
      sparkRerolledIdeaId: spark.rerolledIdeaId,
      sleepChecklist: sleep.checklist,
      sleepCompletedTonight: sleep.completedTonight,
      notifications: {
        allEnabled: notifications.allEnabled,
        morningEnabled: notifications.morningEnabled,
        morningTime: notifications.morningTime,
        waterEnabled: notifications.waterEnabled,
        waterStartTime: notifications.waterStartTime,
        waterEndTime: notifications.waterEndTime,
        missionsEnabled: notifications.missionsEnabled,
        missionsTime: notifications.missionsTime,
        sleepEnabled: notifications.sleepEnabled,
        sleepTime: notifications.sleepTime,
        streakEnabled: notifications.streakEnabled,
        streakTime: notifications.streakTime,
      },
      dailyArchive: dailyArchive.archive,
      dailyRoutine: {
        missionsEnabled: dailyRoutine.missionsEnabled,
        waterEnabled: dailyRoutine.waterEnabled,
        sleepEnabled: dailyRoutine.sleepEnabled,
      },
    }),
    [
      themeId,
      missions.missions,
      water.cups,
      water.goal,
      water.reminderEnabled,
      water.reminderIntervalMinutes,
      water.reminderMessages,
      todos.todos,
      quotes.quotes,
      spark.ideas,
      spark.rerolledIdeaId,
      sleep.checklist,
      sleep.completedTonight,
      notifications.allEnabled,
      notifications.morningEnabled,
      notifications.morningTime,
      notifications.waterEnabled,
      notifications.waterStartTime,
      notifications.waterEndTime,
      notifications.missionsEnabled,
      notifications.missionsTime,
      notifications.sleepEnabled,
      notifications.sleepTime,
      notifications.streakEnabled,
      notifications.streakTime,
      dailyArchive.archive,
      dailyRoutine.missionsEnabled,
      dailyRoutine.waterEnabled,
      dailyRoutine.sleepEnabled,
    ]
  );

  const hydrateAll = useCallback(
    (d: any) => {
      if (!d || typeof d !== 'object') return;
      if (typeof d.themeId === 'string') setThemeId(d.themeId);
      if (d.missions) missions.replaceAll(d.missions);
      if (d.water) water.hydrate(d.water);
      if (d.todos) todos.replaceAll(d.todos);
      if (d.quotes) quotes.replaceAll(d.quotes);
      if (d.sparkIdeas) spark.replaceAll(d.sparkIdeas);
      if (d.sparkRerolledIdeaId !== undefined) spark.replaceRerollState(d.sparkRerolledIdeaId);
      if (d.sleepChecklist) sleep.replaceAll(d.sleepChecklist);
      if (d.sleepCompletedTonight) sleep.replaceCompletedTonight(d.sleepCompletedTonight);
      if (d.notifications) notifications.replaceAll(d.notifications);
      if (d.dailyArchive) dailyArchive.replaceArchive(d.dailyArchive);
      if (d.dailyRoutine) dailyRoutine.replaceAll(d.dailyRoutine);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setThemeId, missions, water, todos, quotes, spark, sleep, notifications, dailyArchive, dailyRoutine]
  );

  const resetAll = useCallback(() => {
    missions.replaceAll([]);
    water.hydrate({
      cups: 0,
      goal: WATER_GOAL_CUPS,
      lastResetDate: toDateKey(new Date()),
      reminderEnabled: true,
      reminderIntervalMinutes: DEFAULT_REMINDER_INTERVAL_MINUTES,
      reminderMessages: [],
    });
    todos.replaceAll([]);
    quotes.replaceAll([]);
    spark.replaceAll([]);
    spark.replaceRerollState(null);
    sleep.replaceAll([]);
    sleep.replaceCompletedTonight([]);
    notifications.replaceAll(DEFAULT_NOTIFICATION_PREFS);
    dailyArchive.replaceArchive({});
    dailyRoutine.replaceAll({
      missionsEnabled: true,
      waterEnabled: true,
      sleepEnabled: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missions, water, todos, quotes, spark, sleep, notifications, dailyArchive, dailyRoutine]);

  return { data, hydrateAll, resetAll };
}
