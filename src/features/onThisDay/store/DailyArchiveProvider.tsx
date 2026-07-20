import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { toDateKey } from '@/utils/date';
import { useMissions } from '@/features/missions/store/MissionsProvider';
import { useWater } from '@/features/water/store/WaterProvider';
import { useSleepRitual } from '@/features/sleep/store/SleepRitualProvider';
import { useQuotes } from '@/features/quotes/store/QuotesProvider';
import { useSpark } from '@/features/spark/store/SparkProvider';
import { useDailyRoutine } from '@/features/settings/store/DailyRoutineProvider';
import { DailyArchive, DailyArchiveEntry } from '../types';

interface DailyArchiveContextValue {
  archive: DailyArchive;
  replaceArchive: (archive: DailyArchive) => void;
  getEntry: (dateKey: string) => DailyArchiveEntry | null;
  loggedDayCount: number;
}

const DailyArchiveContext = createContext<DailyArchiveContextValue | undefined>(undefined);

function sameEntry(a: DailyArchiveEntry | undefined, b: DailyArchiveEntry): boolean {
  if (!a) return false;
  return (
    a.missionsEnabled === b.missionsEnabled &&
    a.missionsTotal === b.missionsTotal &&
    a.missionsDone === b.missionsDone &&
    a.waterEnabled === b.waterEnabled &&
    a.waterCups === b.waterCups &&
    a.waterGoal === b.waterGoal &&
    a.sleepEnabled === b.sleepEnabled &&
    a.sleepCompleted === b.sleepCompleted &&
    a.sleepTotal === b.sleepTotal &&
    a.quote?.quote === b.quote?.quote &&
    a.spark === b.spark
  );
}

/**
 * Every day this app is used, today's real snapshot gets frozen into the
 * archive under today's date key. Nothing here is invented or backfilled —
 * a day with no entry simply means the app wasn't used that day, and "On
 * This Day" is honest about that rather than making something up.
 *
 * Must be mounted inside Missions/Water/Sleep/Quotes/Spark providers
 * and outside PersistenceGate (so its archive state is included in the
 * snapshot that gets hydrated/autosaved).
 */
export function DailyArchiveProvider({ children }: { children: React.ReactNode }) {
  const [archive, setArchive] = useState<DailyArchive>({});
  const missions = useMissions();
  const water = useWater();
  const sleep = useSleepRitual();
  const quotes = useQuotes();
  const spark = useSpark();
  const dailyRoutine = useDailyRoutine();

  const todayKey = toDateKey(new Date());

  const todayEntry = useMemo<DailyArchiveEntry>(
    () => ({
      dateKey: todayKey,
      missionsEnabled: dailyRoutine.missionsEnabled,
      missionsTotal: missions.missions.length,
      missionsDone: missions.missions.filter((m) => m.completedDates.includes(todayKey)).length,
      waterEnabled: dailyRoutine.waterEnabled,
      waterCups: water.cups,
      waterGoal: water.goal,
      sleepEnabled: dailyRoutine.sleepEnabled,
      sleepCompleted: sleep.completedTonight.length,
      sleepTotal: sleep.checklist.length,
      quote: quotes.quoteOfTheDay
        ? { quote: quotes.quoteOfTheDay.quote, author: quotes.quoteOfTheDay.author }
        : null,
      spark: spark.todaysSpark?.text ?? null,
    }),
    [
      todayKey,
      missions.missions,
      water.cups,
      water.goal,
      sleep.completedTonight,
      sleep.checklist,
      quotes.quoteOfTheDay,
      spark.todaysSpark,
      dailyRoutine.missionsEnabled,
      dailyRoutine.waterEnabled,
      dailyRoutine.sleepEnabled,
    ]
  );

  // Keep only today's slot in sync — every earlier day's entry, once
  // written, stays exactly as it was that day.
  useEffect(() => {
    setArchive((prev) => (sameEntry(prev[todayKey], todayEntry) ? prev : { ...prev, [todayKey]: todayEntry }));
  }, [todayEntry, todayKey]);

  const value = useMemo<DailyArchiveContextValue>(
    () => ({
      archive,
      replaceArchive: (next) => setArchive(next && typeof next === 'object' ? next : {}),
      getEntry: (dateKey: string) => archive[dateKey] ?? null,
      loggedDayCount: Object.keys(archive).length,
    }),
    [archive]
  );

  return <DailyArchiveContext.Provider value={value}>{children}</DailyArchiveContext.Provider>;
}

export function useDailyArchive() {
  const ctx = useContext(DailyArchiveContext);
  if (!ctx) throw new Error('useDailyArchive must be used within a DailyArchiveProvider');
  return ctx;
}
