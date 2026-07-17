import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Caption, Body } from '@/components/common/Type';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing, radius } from '@/theme/tokens';
import { moodOptionFor } from '../constants';
import { MoodDayEntry } from '../types';

export function MoodWeekTimeline({ days }: { days: MoodDayEntry[] }) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.row}>
      {days.map((d) => {
        const morning = moodOptionFor(d.morningMoodId);
        const night = moodOptionFor(d.nightMoodId);
        return (
          <View key={d.dateKey} style={styles.col}>
            <View style={styles.stack}>
              <View
                style={[
                  styles.bubble,
                  {
                    backgroundColor: d.isToday ? theme.accentSoft : theme.surfaceAlt,
                    borderColor: d.isToday ? theme.accent : 'transparent',
                  },
                ]}
              >
                <Body style={{ fontSize: 15 }}>{morning?.emoji ?? '·'}</Body>
              </View>
              <View
                style={[
                  styles.bubble,
                  {
                    backgroundColor: d.isToday ? theme.accentSoft : theme.surfaceAlt,
                    borderColor: d.isToday ? theme.accent : 'transparent',
                  },
                ]}
              >
                <Body style={{ fontSize: 15 }}>{night?.emoji ?? '·'}</Body>
              </View>
            </View>
            <Caption
              style={{ marginTop: 6, fontFamily: undefined }}
              color={d.isToday ? theme.accent : theme.textSecondary}
            >
              {d.label}
            </Caption>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  col: {
    alignItems: 'center',
  },
  stack: {
    gap: 4,
  },
  bubble: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
