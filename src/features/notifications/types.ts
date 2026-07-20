export enum NotificationType {
  MORNING = 'morning',
  WATER = 'water',
  MISSIONS = 'missions',
  SLEEP = 'sleep',
  STREAK = 'streak',
}

export interface NotificationPrefs {
  allEnabled: boolean;
  morningEnabled: boolean;
  morningTime: string; // HH:mm
  waterEnabled: boolean;
  waterStartTime: string;
  waterEndTime: string;
  missionsEnabled: boolean;
  missionsTime: string;
  sleepEnabled: boolean;
  sleepTime: string;
  streakEnabled: boolean;
  streakTime: string;
}
