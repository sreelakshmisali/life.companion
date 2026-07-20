import { WaterReminderMessage } from './types';

export const WATER_GOAL_CUPS = 8;

export const DEFAULT_REMINDER_INTERVAL_MINUTES = 90;

export const REMINDER_INTERVAL_OPTIONS = [30, 60, 90, 120, 180];

export const DEFAULT_WATER_REMINDER_MESSAGES: WaterReminderMessage[] = [
  { id: 'w1', text: "Psst. Your water glass is judging you." },
  { id: 'w2', text: "Hydration check! Your plants aren't the only ones who need water." },
  { id: 'w3', text: "A little sip never hurt anyone. Go on." },
  { id: 'w4', text: "This is your glass of water, reminding you that it exists." },
];
