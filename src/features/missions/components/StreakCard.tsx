import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card } from '@/components/cards/Card';
import { Title, Body, Caption, Greeting } from '@/components/common/Type';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing, radius } from '@/theme/tokens';
import { useStreak } from '@/features/streak/store/StreakProvider';
import { useDailyArchive } from '@/features/onThisDay/store/DailyArchiveProvider';
import { toDateKey } from '@/utils/date';

export function StreakCard({ onOpenSettings }: { onOpenSettings: () => void }) {
  const { theme } = useAppTheme();
  const { currentStreak } = useStreak();
  const { getEntry } = useDailyArchive();
  
  const todayEntry = getEntry(toDateKey(new Date()));

  // If no entry exists yet (e.g. fresh install today and no features set up)
  // we fallback to everything being incomplete and relying on DailyRoutine config?
  // But wait! todayEntry is constructed globally in DailyArchiveProvider based on live data!
  // It is guaranteed to exist for today as long as the provider is mounted.

  const items = [];
  
  if (todayEntry) {
    if (todayEntry.missionsEnabled) {
      const isDone = todayEntry.missionsTotal > 0 && todayEntry.missionsDone >= todayEntry.missionsTotal;
      items.push({ id: 'missions', icon: 'check-circle' as const, label: 'Missions', done: isDone });
    }
    if (todayEntry.waterEnabled) {
      const isDone = todayEntry.waterGoal > 0 && todayEntry.waterCups >= todayEntry.waterGoal;
      items.push({ id: 'water', icon: 'droplet' as const, label: 'Water', done: isDone });
    }
    if (todayEntry.sleepEnabled) {
      const isDone = todayEntry.sleepTotal > 0 && todayEntry.sleepCompleted >= todayEntry.sleepTotal;
      items.push({ id: 'sleep', icon: 'moon' as const, label: 'Sleep Ritual', done: isDone });
    }
  }

  const total = items.length;
  const done = items.filter(i => i.done).length;
  const isAllDone = total > 0 && done === total;

  return (
    <Card>
      <View style={{ marginBottom: spacing.md }}>
        <Greeting style={{ fontSize: 22 }}>🔥 {currentStreak} Day Streak</Greeting>
      </View>
      
      <Caption color={theme.textSecondary} style={{ marginBottom: spacing.xs }}>
        Today's Streak
      </Caption>
      
      {total === 0 ? (
        <Caption style={{ marginBottom: spacing.sm }}>No daily routine configured.</Caption>
      ) : (
        <View style={styles.list}>
          {items.map(item => (
            <View key={item.id} style={styles.row}>
              <View style={styles.labelWrap}>
                <Feather name={item.icon} size={16} color={theme.textPrimary} style={{ marginRight: spacing.xs }} />
                <Body>{item.label}</Body>
              </View>
              <View style={[styles.box, { 
                borderColor: item.done ? theme.accent : theme.border,
                backgroundColor: item.done ? theme.accent : 'transparent' 
              }]}>
                {item.done && <Feather name="check" size={12} color={theme.textOnAccent} />}
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={[styles.summary, { backgroundColor: isAllDone ? theme.accentSoft : theme.surfaceAlt }]}>
        {isAllDone && total > 0 ? (
          <Body color={theme.accent}>🎉 Today's streak is secured!</Body>
        ) : (
          <Body>{done} of {total} completed</Body>
        )}
      </View>

      <Pressable onPress={onOpenSettings} style={styles.customizeBtn} hitSlop={8}>
        <Caption color={theme.accent}>⚙️ Customize Daily Routine</Caption>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summary: {
    padding: spacing.sm,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  customizeBtn: {
    marginTop: spacing.md,
    alignSelf: 'center',
  },
});
