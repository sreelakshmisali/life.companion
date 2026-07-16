import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/theme/ThemeProvider';
import { BreathPhase } from '../types';

export function BreathingOrb({
  scale,
  glow,
  size = 220,
}: {
  scale: Animated.Value;
  glow: Animated.Value;
  size?: number;
}) {
  const { theme } = useAppTheme();

  const glowScale = glow.interpolate({ inputRange: [0.5, 0.9], outputRange: [1, 1.25] });

  return (
    <View style={[styles.wrap, { width: size * 1.6, height: size * 1.6 }]}>
      {/* Outer soft glow halo */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.halo,
          {
            width: size * 1.3,
            height: size * 1.3,
            borderRadius: (size * 1.3) / 2,
            backgroundColor: theme.accentSoft,
            opacity: glow.interpolate({ inputRange: [0.5, 0.9], outputRange: [0.35, 0.6] }),
            transform: [{ scale: Animated.multiply(scale, glowScale) }],
          },
        ]}
      />
      {/* Core orb */}
      <Animated.View
        style={[
          styles.core,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ scale }],
          },
        ]}
      >
        <LinearGradient
          colors={theme.orbGradient}
          start={{ x: 0.2, y: 0.1 }}
          end={{ x: 0.85, y: 0.9 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

export function phaseLabelText(phase: BreathPhase) {
  return phase.label;
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
  },
  core: {
    overflow: 'hidden',
    shadowColor: '#8B8378',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 6,
  },
});
