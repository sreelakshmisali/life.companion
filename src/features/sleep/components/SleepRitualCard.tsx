import React, { useRef, useState } from 'react';
import { Animated, Pressable, View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card } from '@/components/cards/Card';
import { Title, Body, Caption } from '@/components/common/Type';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing, radius } from '@/theme/tokens';
import { SleepChecklistItem, SleepNightEntry } from '../types';
import { WeeklyBarChart } from '@/components/common/WeeklyBarChart';

function CheckRow({
  item,
  checked,
  onToggle,
}: {
  item: SleepChecklistItem;
  checked: boolean;
  onToggle: () => void;
}) {
  const { theme } = useAppTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.08, useNativeDriver: true, speed: 30, bounciness: 10 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 8 }),
    ]).start();
    onToggle();
  };

  return (
    <Pressable onPress={handlePress} style={styles.row} hitSlop={4}>
      <Animated.View
        style={[
          styles.checkbox,
          {
            backgroundColor: checked ? theme.accent : 'transparent',
            borderColor: checked ? theme.accent : theme.border,
            transform: [{ scale }],
          },
        ]}
      >
        {checked && <Feather name="check" size={13} color={theme.textOnAccent} />}
      </Animated.View>
      <Body style={{ marginLeft: spacing.xs, textDecorationLine: checked ? 'line-through' : 'none' }} color={checked ? theme.textSecondary : theme.textPrimary}>
        {item.label}
      </Body>
    </Pressable>
  );
}

export function SleepRitualCard({
  checklist,
  completedTonight,
  onToggleItem,
  weekHistory,
}: {
  checklist: SleepChecklistItem[];
  completedTonight: string[];
  onToggleItem: (id: string) => void;
  weekHistory: SleepNightEntry[];
}) {
  const { theme } = useAppTheme();
  const [trendsExpanded, setTrendsExpanded] = useState(false);
  
  const done = completedTonight.length;
  const total = checklist.length;
  const allDone = total > 0 && done === total;

  const isEvening = new Date().getHours() >= 18;
  const title = isEvening ? 'Sleep ritual' : "Tonight's ritual";
  
  let subtitle = '';
  if (total === 0) {
    subtitle = 'Add ritual items in Settings to get started.';
  } else if (allDone) {
    subtitle = 'All set for a cozy night 🌙';
  } else if (isEvening) {
    subtitle = `Your evening ritual is ready 🌙 (${done}/${total})`;
  } else {
    subtitle = `${done} of ${total} done`;
  }

  return (
    <Card>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Title>{title}</Title>
          <Caption style={{ marginTop: 2 }}>{subtitle}</Caption>
        </View>
      </View>

      {total > 0 && (
        <View style={styles.list}>
          {checklist.map((item) => (
            <CheckRow
              key={item.id}
              item={item}
              checked={completedTonight.includes(item.id)}
              onToggle={() => onToggleItem(item.id)}
            />
          ))}
        </View>
      )}

      {total > 0 && (
        <View style={{ marginTop: spacing.md }}>
          {trendsExpanded ? (
            <View style={styles.trendsPanel}>
              <View style={styles.trendsHeader}>
                <Caption color={theme.accent}>Sleep trends</Caption>
                <Pressable onPress={() => setTrendsExpanded(false)} hitSlop={8}>
                  <Feather name="chevron-up" size={18} color={theme.textSecondary} />
                </Pressable>
              </View>
              <WeeklyBarChart
                data={weekHistory.map((d) => ({
                  label: d.label,
                  value: d.completedCount,
                  isToday: d.isToday,
                }))}
                maxValue={Math.max(1, ...weekHistory.map((d) => d.totalCount))}
              />
            </View>
          ) : (
            <Pressable onPress={() => setTrendsExpanded(true)} hitSlop={8} style={{ alignSelf: 'flex-end' }}>
              <Caption color={theme.accent}>See sleep trends</Caption>
            </Pressable>
          )}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  list: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendsPanel: {
    paddingTop: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5E5', // approximate, or use theme.border if accessible in styles
  },
  trendsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
});
