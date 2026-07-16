import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { Caption } from './Type';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing, radius } from '@/theme/tokens';

export interface BarChartDatum {
  label: string;
  value: number;
  isToday?: boolean;
}

const CHART_HEIGHT = 96;

function Bar({ datum, maxValue }: { datum: BarChartDatum; maxValue: number }) {
  const { theme } = useAppTheme();
  const height = useRef(new Animated.Value(0)).current;
  const pct = maxValue > 0 ? Math.min(datum.value / maxValue, 1) : 0;

  useEffect(() => {
    Animated.timing(height, {
      toValue: pct,
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [pct]);

  const animatedHeight = height.interpolate({
    inputRange: [0, 1],
    outputRange: [4, CHART_HEIGHT],
  });

  return (
    <View style={styles.barCol}>
      <View style={styles.barTrack}>
        <Animated.View
          style={[
            styles.bar,
            {
              height: animatedHeight,
              backgroundColor: datum.isToday ? theme.accent : theme.accentSoft,
            },
          ]}
        />
      </View>
      <Caption
        style={{ marginTop: 6, fontFamily: undefined }}
        color={datum.isToday ? theme.accent : theme.textSecondary}
      >
        {datum.label}
      </Caption>
    </View>
  );
}

export function WeeklyBarChart({ data, maxValue }: { data: BarChartDatum[]; maxValue: number }) {
  return (
    <View style={styles.row}>
      {data.map((d, i) => (
        <Bar key={i} datum={d} maxValue={maxValue} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    height: CHART_HEIGHT,
    width: 18,
    justifyContent: 'flex-end',
  },
  bar: {
    width: 18,
    borderRadius: radius.sm / 2,
  },
});
