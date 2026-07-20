import { DailyArchive, DailyArchiveEntry } from '@/features/onThisDay/types';

export function isDayComplete(entry: DailyArchiveEntry): boolean {
  // If a user has absolutely no features enabled, they cannot build a streak.
  if (!entry.missionsEnabled && !entry.waterEnabled && !entry.sleepEnabled) {
    return false;
  }

  // Only enabled features count towards the streak.
  // If a feature is enabled, it must be fully completed.
  if (entry.missionsEnabled && entry.missionsTotal > 0 && entry.missionsDone < entry.missionsTotal) return false;
  if (entry.waterEnabled && entry.waterGoal > 0 && entry.waterCups < entry.waterGoal) return false;
  if (entry.sleepEnabled && entry.sleepTotal > 0 && entry.sleepCompleted < entry.sleepTotal) return false;

  return true;
}

export function calculateGlobalStreak(archive: DailyArchive, todayKey: string): number {
  let streak = 0;
  const todayEntry = archive[todayKey];
  
  let date = new Date(todayKey);
  
  // If today is complete, it counts towards the current streak.
  // If today is NOT complete, the streak isn't broken yet (the day isn't over),
  // we just start counting the contiguous completed days from yesterday.
  if (todayEntry && isDayComplete(todayEntry)) {
    streak++;
  }
  
  date.setDate(date.getDate() - 1);
  let checkKey = date.toISOString().slice(0, 10);
  
  // Walk backwards day by day as long as the days are complete
  while (archive[checkKey]) {
    if (isDayComplete(archive[checkKey])) {
      streak++;
      date.setDate(date.getDate() - 1);
      checkKey = date.toISOString().slice(0, 10);
    } else {
      break;
    }
  }
  
  return streak;
}
