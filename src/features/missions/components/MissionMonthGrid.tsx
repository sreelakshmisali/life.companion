import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Caption } from '@/components/common/Type';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/tokens';
import { toDateKey } from '@/utils/date';

const WEEKDAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/**
 * Current-month grid, weekday-aligned. Past/today cells reflect the
 * mission's completion map; future days render as empty outlines so the
 * month reads as "in progress," not "failed."
 */
export function MissionMonthGrid({ doneByDate }: { doneByDate: Record<string, boolean> }) {
  const { theme } = useAppTheme();
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(new Date(year, month, day));

  const monthLabel = today.toLocaleDateString('en-US', { month: 'long' });

  return (
    <View>
      <Caption style={{ marginBottom: spacing.xs }}>{monthLabel}</Caption>
      <View style={styles.weekdayRow}>
        {WEEKDAY_LETTERS.map((l, i) => (
          <Caption key={i} style={styles.weekdayLabel}>
            {l}
          </Caption>
        ))}
      </View>
      <View style={styles.grid}>
        {cells.map((date, i) => {
          if (!date) return <View key={i} style={styles.cell} />;
          const key = toDateKey(date);
          const isFuture = date > today && key !== toDateKey(today);
          const done = !isFuture && !!doneByDate[key];
          const isToday = key === toDateKey(today);
          return (
            <View key={i} style={styles.cell}>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: done ? theme.accent : isFuture ? 'transparent' : theme.surfaceAlt,
                    borderColor: isToday ? theme.accent : 'transparent',
                    borderWidth: isToday ? 1.5 : 0,
                  },
                ]}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const CELL_SIZE = 28;

const styles = StyleSheet.create({
  weekdayRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  weekdayLabel: {
    width: `${100 / 7}%`,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    height: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});
