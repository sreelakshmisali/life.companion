import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Card } from '@/components/cards/Card';
import { Title, Greeting, Caption } from '@/components/common/Type';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/tokens';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const SIZE = 88;
const STROKE = 9;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function StreakCard({ streakDays, weeklyGoal = 7 }: { streakDays: number; weeklyGoal?: number }) {
  const { theme } = useAppTheme();
  const progress = useRef(new Animated.Value(0)).current;
  const pct = Math.min(streakDays / weeklyGoal, 1);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: pct,
      duration: 900,
      useNativeDriver: true,
    }).start();
  }, [pct]);

  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, 0],
  });

  return (
    <Card style={styles.card}>
      <View style={{ flex: 1 }}>
        <Caption>Current streak</Caption>
        <Greeting style={{ fontSize: 26, lineHeight: 32, marginTop: 2 }}>{streakDays} days</Greeting>
        <Caption style={{ marginTop: spacing.xs }}>Keep the little flame going 🔥</Caption>
      </View>
      <View style={{ width: SIZE, height: SIZE }}>
        <Svg width={SIZE} height={SIZE}>
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={theme.accentSoft}
            strokeWidth={STROKE}
            fill="none"
          />
          <AnimatedCircle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={theme.accent}
            strokeWidth={STROKE}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            rotation="-90"
            origin={`${SIZE / 2}, ${SIZE / 2}`}
          />
        </Svg>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
