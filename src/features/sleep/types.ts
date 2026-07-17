export interface SleepChecklistItem {
  id: string;
  label: string;
}

/** One night's ritual completion, for the week timeline / history. */
export interface SleepNightEntry {
  dateKey: string;
  label: string;
  completedCount: number;
  totalCount: number;
  isToday: boolean;
}
