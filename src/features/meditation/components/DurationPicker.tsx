import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { Caption } from '@/components/common/Type';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing, radius } from '@/theme/tokens';
import { MEDITATION_DURATIONS } from '../constants';

export function DurationPicker({
  selectedMinutes,
  onSelect,
  disabled,
}: {
  selectedMinutes: number;
  onSelect: (minutes: number) => void;
  disabled?: boolean;
}) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.row}>
      {MEDITATION_DURATIONS.map((d) => {
        const active = d.minutes === selectedMinutes;
        return (
          <Pressable key={d.minutes} disabled={disabled} onPress={() => onSelect(d.minutes)}>
            <View
              style={[
                styles.chip,
                {
                  backgroundColor: active ? theme.accent : theme.surface,
                  borderColor: active ? theme.accent : theme.border,
                  opacity: disabled && !active ? 0.5 : 1,
                },
              ]}
            >
              <Caption color={active ? theme.textOnAccent : theme.textSecondary}>{d.label}</Caption>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
  },
  chip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 10,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
});
