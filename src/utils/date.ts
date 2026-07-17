export function getGreeting(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function getFormattedDate(date: Date) {
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

export function getWeekdayLabel(date: Date) {
  return date.toLocaleDateString('en-US', { weekday: 'short' }); // 'Mon'
}

/** Returns the last `count` days including today, oldest first. */
export function getLastNDays(count: number): Date[] {
  const days: Date[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  return days;
}

/** 0-indexed day of the current year — used to deterministically pick
 * "one thing per day" (quote of the day, today's spark) without needing
 * any stored "last shown" state. */
export function getDayOfYear(): number {
  return Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
}
