import React, { useRef } from 'react';
import { Animated, Pressable, View, StyleSheet } from 'react-native';
import { Card } from '@/components/cards/Card';
import { Title, Caption } from '@/components/common/Type';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing, radius } from '@/theme/tokens';
import { MOODS } from '../constants';
import { MoodId, MoodPeriod } from '../types';

function MoodBubble({
  emoji,
  selected,
  onPress,
}: {
  emoji: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { theme } = useAppTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.18, useNativeDriver: true, speed: 30, bounciness: 12 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 8 }),
    ]).start();
    onPress();
  };

  return (
    <Pressable onPress={handlePress} hitSlop={6}>
      <Animated.View
        style={[
          styles.bubble,
          {
            backgroundColor: selected ? theme.accentSoft : 'transparent',
            borderColor: selected ? theme.accent : theme.border,
            transform: [{ scale }],
          },
        ]}
      >
        <Title style={{ fontSize: 22, lineHeight: 26 }}>{emoji}</Title>
      </Animated.View>
    </Pressable>
  );
}

const PERIOD_TITLES: Record<MoodPeriod, string> = {
  morning: 'Morning mood',
  night: 'Night mood',
};

export function MoodPicker({
  selected,
  onSelect,
  onSeeAll,
  period,
}: {
  selected: MoodId | null;
  onSelect: (id: MoodId) => void;
  onSeeAll?: () => void;
  period?: MoodPeriod;
}) {
  const { theme } = useAppTheme();
  return (
    <Card>
      <View style={styles.header}>
        <Title>{period ? PERIOD_TITLES[period] : 'How are you feeling?'}</Title>
        {onSeeAll && (
          <Pressable onPress={onSeeAll} hitSlop={8}>
            <Caption color={theme.accent}>See trends</Caption>
          </Pressable>
        )}
      </View>
      <View style={styles.row}>
        {MOODS.map((m) => (
          <MoodBubble
            key={m.id}
            emoji={m.emoji}
            selected={selected === m.id}
            onPress={() => onSelect(m.id)}
          />
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  bubble: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
