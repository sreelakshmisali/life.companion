import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { NotificationType, NotificationPrefs } from './types';
import { Mission } from '@/features/missions/types';
import { SleepChecklistItem } from '@/features/sleep/types';
import { DailyRoutineConfig } from '@/features/settings/store/DailyRoutineProvider';

// Configure how notifications behave when the app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('default', {
    name: 'Routine Reminders',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF231F7C',
  });
}

export interface AppSyncState {
  dailyRoutine: DailyRoutineConfig;
  missions: {
    list: Mission[];
    todayKey: string;
  };
  water: {
    cups: number;
    goal: number;
    intervalMinutes: number;
  };
  sleep: {
    checklist: SleepChecklistItem[];
    completedTonight: string[];
  };
  streakIsSafe: boolean; // True if today's required features are all done
}

export class NotificationService {
  static async checkPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === 'granted';
  }

  static async cancelAllForType(type: NotificationType) {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const toCancel = scheduled.filter(n => n.identifier.startsWith(type));
    await Promise.all(toCancel.map(n => Notifications.cancelScheduledNotificationAsync(n.identifier)));
  }

  static async cancelAll() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  /**
   * Parse HH:mm and return a Date object for TODAY at that time.
   */
  static getTodayTime(hhmm: string): Date {
    const [h, m] = hhmm.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  }

  static async syncDailySchedule(prefs: NotificationPrefs, state: AppSyncState) {
    if (!prefs.allEnabled) {
      await this.cancelAll();
      return;
    }

    const hasPerm = await this.checkPermissions();
    if (!hasPerm) {
      // Permission denied at OS level, clear schedules
      await this.cancelAll();
      return;
    }

    const now = new Date();

    // 1. Morning Reminder
    await this.cancelAllForType(NotificationType.MORNING);
    if (prefs.morningEnabled) {
      const time = this.getTodayTime(prefs.morningTime);
      // If time has passed today, we don't schedule it (daily sync means we only care about today).
      // Wait, morning reminder should happen tomorrow if it passed today?
      // "Do not schedule long-running future reminders that cannot react to user progress changes."
      // For morning, it doesn't depend on progress, but to keep the strategy simple, we only schedule for today.
      // If the app is opened tomorrow, it will schedule for tomorrow. 
      // But if the user never opens the app, they don't get the morning reminder tomorrow!
      // For daily reminders, we CAN schedule a daily repeating trigger.
      // But the user said: "Do not schedule long-running future reminders that cannot react to user progress changes. Schedule only remaining notifications for today."
      // I will strictly follow: only schedule if time > now.
      if (time > now) {
        await Notifications.scheduleNotificationAsync({
          content: { title: "☀️ Good morning", body: "Your daily routine is ready." },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: time },
          identifier: `${NotificationType.MORNING}-today`,
        });
      }
      
      // Always schedule for tomorrow as well, so if they don't open the app, they still get a gentle nudge tomorrow
      const tomorrow = new Date(time);
      tomorrow.setDate(tomorrow.getDate() + 1);
      await Notifications.scheduleNotificationAsync({
        content: { title: "☀️ Good morning", body: "Your daily routine is ready." },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: tomorrow },
        identifier: `${NotificationType.MORNING}-tomorrow`,
      });
    }

    // 2. Water Reminders
    await this.cancelAllForType(NotificationType.WATER);
    if (prefs.waterEnabled && state.dailyRoutine.waterEnabled && state.water.cups < state.water.goal) {
      const start = this.getTodayTime(prefs.waterStartTime);
      const end = this.getTodayTime(prefs.waterEndTime);
      
      let nextTime = new Date(Math.max(now.getTime(), start.getTime()));
      let i = 0;
      
      // Schedule intervals from max(now, start) until end
      while (nextTime <= end) {
        // If nextTime is in the future, schedule it
        if (nextTime > now) {
          await Notifications.scheduleNotificationAsync({
            content: { title: "💧 Time for water", body: "Take a moment to hydrate." },
            trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: new Date(nextTime) },
            identifier: `${NotificationType.WATER}-today-${i}`,
          });
        }
        
        // Schedule for tomorrow as well
        const tomorrowNext = new Date(nextTime);
        tomorrowNext.setDate(tomorrowNext.getDate() + 1);
        await Notifications.scheduleNotificationAsync({
          content: { title: "💧 Time for water", body: "Take a moment to hydrate." },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: tomorrowNext },
          identifier: `${NotificationType.WATER}-tomorrow-${i}`,
        });
        nextTime = new Date(nextTime.getTime() + state.water.intervalMinutes * 60000);
        i++;
        if (i > 24) break; // sanity limit
      }
    }

    // 3. Missions Reminder
    await this.cancelAllForType(NotificationType.MISSIONS);
    const missionsTotal = state.missions.list.length;
    const missionsDone = state.missions.list.filter(m => m.completedDates.includes(state.missions.todayKey)).length;
    if (prefs.missionsEnabled && state.dailyRoutine.missionsEnabled && missionsTotal > 0 && missionsDone < missionsTotal) {
      const time = this.getTodayTime(prefs.missionsTime);
      if (time > now) {
        await Notifications.scheduleNotificationAsync({
          content: { title: "🎯 Missions waiting", body: "You still have missions waiting today." },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: time },
          identifier: `${NotificationType.MISSIONS}-today`,
        });
      }
      
      const tomorrow = new Date(this.getTodayTime(prefs.missionsTime));
      tomorrow.setDate(tomorrow.getDate() + 1);
      await Notifications.scheduleNotificationAsync({
        content: { title: "🎯 Missions waiting", body: "Don't forget to check your missions today!" },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: tomorrow },
        identifier: `${NotificationType.MISSIONS}-tomorrow`,
      });
    }

    // 4. Sleep Ritual Reminder
    await this.cancelAllForType(NotificationType.SLEEP);
    const sleepTotal = state.sleep.checklist.length;
    const sleepDone = state.sleep.completedTonight.length;
    if (prefs.sleepEnabled && state.dailyRoutine.sleepEnabled && sleepTotal > 0 && sleepDone < sleepTotal) {
      const time = this.getTodayTime(prefs.sleepTime);
      if (time > now) {
        await Notifications.scheduleNotificationAsync({
          content: { title: "🌙 Wind down", body: "Your evening ritual is waiting." },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: time },
          identifier: `${NotificationType.SLEEP}-today`,
        });
      }
      
      const tomorrow = new Date(this.getTodayTime(prefs.sleepTime));
      tomorrow.setDate(tomorrow.getDate() + 1);
      await Notifications.scheduleNotificationAsync({
        content: { title: "🌙 Wind down", body: "Your evening ritual is waiting." },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: tomorrow },
        identifier: `${NotificationType.SLEEP}-tomorrow`,
      });
    }

    // 5. Streak Protection
    await this.cancelAllForType(NotificationType.STREAK);
    if (prefs.streakEnabled && !state.streakIsSafe) {
      const time = this.getTodayTime(prefs.streakTime);
      if (time > now) {
        await Notifications.scheduleNotificationAsync({
          content: { title: "🔥 Streak at risk", body: "Finish your remaining routine before today ends." },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: time },
          identifier: `${NotificationType.STREAK}-today`,
        });
      }
      
      const tomorrow = new Date(this.getTodayTime(prefs.streakTime));
      tomorrow.setDate(tomorrow.getDate() + 1);
      await Notifications.scheduleNotificationAsync({
        content: { title: "🔥 Daily Routine", body: "Keep your streak going today!" },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: tomorrow },
        identifier: `${NotificationType.STREAK}-tomorrow`,
      });
    }
  }
}
