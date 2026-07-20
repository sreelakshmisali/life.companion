export interface Mission {
  id: string;
  title: string;
  createdAt: string; // ISO date string "YYYY-MM-DD"
  completedDates: string[]; // ISO date strings of completion days
}

/** One day's overall mission completion, for the streak calculation. */
export interface MissionDayEntry {
  dateKey: string;
  label: string;
  allDone: boolean;
  isToday: boolean;
}
