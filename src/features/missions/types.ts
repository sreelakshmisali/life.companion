export interface Mission {
  id: string;
  label: string;
  done: boolean;
}

/** One day's overall mission completion, for the streak calculation. */
export interface MissionDayEntry {
  dateKey: string;
  label: string;
  allDone: boolean;
  isToday: boolean;
}
