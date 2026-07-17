import React, { useRef } from 'react';
import { Animated, Pressable, View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card } from '@/components/cards/Card';
import { Title, Body, Caption } from '@/components/common/Type';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing, radius } from '@/theme/tokens';
import { SleepChecklistItem } from '../types';

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

/**
 * The bedtime checklist itself — separate from Settings' template editor,
 * this is what the user actually taps through each night. Lives on the
 * Home screen (evening) and in Mind.
 */
export function SleepRitualCard({
  checklist,
  completedTonight,
  onToggleItem,
  currentStreak,
}: {
  checklist: SleepChecklistItem[];
  completedTonight: string[];
  onToggleItem: (id: string) => void;
  currentStreak: number;
}) {
  const { theme } = useAppTheme();
  const done = completedTonight.length;
  const total = checklist.length;
  const allDone = total > 0 && done === total;

  return (
    <Card>
      <View style={styles.header}>
        <View>
          <Title>Sleep ritual</Title>
          <Caption style={{ marginTop: 2 }}>
            {allDone ? 'All set for a cozy night 🌙' : `${done} of ${total} done`}
          </Caption>
        </View>
        {currentStreak > 0 && (
          <View style={[styles.streakChip, { backgroundColor: theme.accentSoft }]}>
            <Caption color={theme.accent}>🔥 {currentStreak}</Caption>
          </View>
        )}
      </View>

      {total === 0 ? (
        <Caption style={{ marginTop: spacing.sm }}>Add ritual items in Settings to get started.</Caption>
      ) : (
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
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  streakChip: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  list: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
