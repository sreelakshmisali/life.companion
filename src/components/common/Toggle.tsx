import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { useAppTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/tokens';

const WIDTH = 46;
const HEIGHT = 26;
const KNOB = 20;

export function Toggle({
  value,
  onChange,
  disabled,
}: {
  value: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
}) {
  const { theme } = useAppTheme();
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, { toValue: value ? 1 : 0, useNativeDriver: false, speed: 24, bounciness: 6 }).start();
  }, [value]);

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [3, WIDTH - KNOB - 3] });
  const trackColor = anim.interpolate({ inputRange: [0, 1], outputRange: [theme.border, theme.accent] });

  return (
    <Pressable onPress={() => !disabled && onChange(!value)} hitSlop={8} disabled={disabled}>
      <Animated.View style={[styles.track, { backgroundColor: trackColor, opacity: disabled ? 0.5 : 1 }]}>
        <Animated.View style={[styles.knob, { backgroundColor: theme.surface, transform: [{ translateX }] }]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: WIDTH,
    height: HEIGHT,
    borderRadius: radius.pill,
    justifyContent: 'center',
  },
  knob: {
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    shadowColor: '#8B8378',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
