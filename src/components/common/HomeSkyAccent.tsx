import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Defs, RadialGradient, Stop, ClipPath, Rect } from 'react-native-svg';
import { useAppTheme } from '@/theme/ThemeProvider';
import { Theme } from '@/theme/themes';

/**
 * The signature moment of the home screen, reimagined as a small living
 * sky. HomeSkyAccent looks at the current local hour and shows a
 * sunrise, a floating daytime sun, a lower afternoon sun, a setting
 * sun, or a crescent moon with twinkling stars — occupying the exact
 * spot the AmbientOrb used to. It never changes the app's theme; it
 * only borrows the active theme's palette so it always feels native
 * to Sage Garden, Sakura Morning, Moonlight, or any theme to come.
 */

type SkyPeriod = 'sunrise' | 'day' | 'afternoon' | 'sunset' | 'night';

// Hour boundaries where the sky period changes.
const PERIOD_BOUNDARIES = [5, 8, 16, 18, 20] as const;

function getSkyPeriod(hour: number): SkyPeriod {
  if (hour >= 5 && hour < 8) return 'sunrise';
  if (hour >= 8 && hour < 16) return 'day';
  if (hour >= 16 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 20) return 'sunset';
  return 'night';
}

// Milliseconds until the next period boundary, so the component only
// ever schedules a single timer for the next real change instead of
// polling every second.
function msUntilNextBoundary(now: Date): number {
  const hour = now.getHours();
  const nextHour = PERIOD_BOUNDARIES.find((b) => b > hour);
  const target = new Date(now);
  if (nextHour !== undefined) {
    target.setHours(nextHour, 0, 0, 0);
  } else {
    target.setDate(target.getDate() + 1);
    target.setHours(PERIOD_BOUNDARIES[0], 0, 0, 0);
  }
  return Math.max(target.getTime() - now.getTime(), 1000);
}

const SIZE = 260;
const CENTER = SIZE / 2;

interface SkyPalette {
  glowStops: [string, string, string];
  bodyFill: string;
  bodyStroke: string;
  starColor: string;
}

function getSkyPalette(period: SkyPeriod, theme: Theme): SkyPalette {
  // The glow always borrows the theme's own orb gradient so it blends
  // naturally with whichever theme is active.
  const glowStops = theme.orbGradient;

  switch (period) {
    case 'sunrise':
      return {
        glowStops,
        bodyFill: '#FFD9A6',
        bodyStroke: '#F3A65E',
        starColor: theme.textSecondary,
      };
    case 'day':
      return {
        glowStops,
        bodyFill: '#FFEFC2',
        bodyStroke: '#F3C86A',
        starColor: theme.textSecondary,
      };
    case 'afternoon':
      return {
        glowStops,
        bodyFill: '#FFDDA0',
        bodyStroke: '#E89A52',
        starColor: theme.textSecondary,
      };
    case 'sunset':
      return {
        glowStops,
        bodyFill: '#F6B27C',
        bodyStroke: '#D97B4F',
        starColor: theme.textSecondary,
      };
    case 'night':
    default:
      return {
        glowStops,
        bodyFill: theme.isDark ? '#F0EFF6' : '#F5F1E6',
        bodyStroke: theme.accent,
        starColor: theme.isDark ? '#F0EFF6' : theme.accent,
      };
  }
}

export function HomeSkyAccent() {
  const { theme } = useAppTheme();
  const [period, setPeriod] = useState<SkyPeriod>(() => getSkyPeriod(new Date().getHours()));

  // Re-check the hour only when the current period is about to end.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setPeriod(getSkyPeriod(new Date().getHours()));
    }, msUntilNextBoundary(new Date()));
    return () => clearTimeout(timeout);
  }, [period]);

  const palette = useMemo(() => getSkyPalette(period, theme), [period, theme]);

  // Shared gentle breathing pulse for the glow — same 4s sine cycle
  // the rest of the app already uses for the ambient orb.
  const breathe = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breathe, {
          toValue: 0,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [breathe]);

  // A slower drift used for sunrise/floating/sunset motion. Reset and
  // re-tuned whenever the period changes so each moment has its own feel.
  const drift = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    drift.setValue(0);
    if (period === 'night') return;
    const duration = period === 'day' ? 5000 : period === 'afternoon' ? 5500 : period === 'sunrise' ? 6000 : 7000;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [drift, period]);

  // Star twinkle drivers, only active at night.
  const twinkleA = useRef(new Animated.Value(0.3)).current;
  const twinkleB = useRef(new Animated.Value(0.3)).current;
  const twinkleC = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    if (period !== 'night') return;
    const makeTwinkle = (value: Animated.Value, duration: number, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: 1,
            duration,
            delay,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0.3,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );
    const loops = [
      makeTwinkle(twinkleA, 1900, 0),
      makeTwinkle(twinkleB, 2300, 500),
      makeTwinkle(twinkleC, 2700, 1000),
    ];
    loops.forEach((loop) => loop.start());
    return () => loops.forEach((loop) => loop.stop());
  }, [period, twinkleA, twinkleB, twinkleC]);

  const scale = breathe.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1.04] });
  const glowOpacity = breathe.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0.85] });

  // Vertical travel range per period: a soft rise, a light float, and
  // a slow set. Night stays still — only the stars move.
  const driftRange: [number, number] =
    period === 'sunrise'
      ? [10, -6]
      : period === 'day'
      ? [-6, 6]
      : period === 'afternoon'
      ? [-4, 4]
      : period === 'sunset'
      ? [-6, 10]
      : [0, 0];
  const translateY = drift.interpolate({ inputRange: [0, 1], outputRange: driftRange });

  const gradientId = `skyGlow-${period}`;
  const clipId = `skyHorizon-${period}`;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.wrap,
        {
          width: SIZE,
          height: SIZE,
          opacity: glowOpacity,
          transform: [{ scale }],
        },
      ]}
    >
      <Animated.View style={[styles.driftLayer, { transform: [{ translateY }] }]}>
        <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <Defs>
            <RadialGradient id={gradientId} cx="50%" cy="45%" r="65%">
              <Stop offset="0%" stopColor={palette.glowStops[0]} stopOpacity={0.85} />
              <Stop offset="55%" stopColor={palette.glowStops[1]} stopOpacity={0.5} />
              <Stop offset="100%" stopColor={palette.glowStops[2]} stopOpacity={0} />
            </RadialGradient>
            {period === 'sunrise' && (
              <ClipPath id={clipId}>
                <Rect x={0} y={0} width={SIZE} height={182} />
              </ClipPath>
            )}
          </Defs>

          <Circle cx={CENTER} cy={CENTER} r={120} fill={`url(#${gradientId})`} />

          {period === 'sunrise' && (
            <>
              <Circle
                cx={CENTER}
                cy={196}
                r={46}
                fill={palette.bodyFill}
                stroke={palette.bodyStroke}
                strokeWidth={1.5}
                clipPath={`url(#${clipId})`}
              />
              <Path
                d="M60,182 H200"
                stroke={theme.border}
                strokeWidth={2}
                strokeLinecap="round"
                opacity={0.6}
              />
            </>
          )}

          {(period === 'day' || period === 'afternoon') && (
            <Circle
              cx={CENTER}
              cy={period === 'day' ? 118 : 150}
              r={period === 'day' ? 46 : 42}
              fill={palette.bodyFill}
              stroke={palette.bodyStroke}
              strokeWidth={1.5}
            />
          )}

          {period === 'sunset' && (
            <Circle
              cx={CENTER}
              cy={168}
              r={44}
              fill={palette.bodyFill}
              stroke={palette.bodyStroke}
              strokeWidth={1.5}
            />
          )}

          {period === 'night' && (
            <Path
              d="M148,74 a38,38 0 1 0 0,76 a30,30 0 1 1 0,-76 Z"
              fill={palette.bodyFill}
              stroke={palette.bodyStroke}
              strokeWidth={1}
            />
          )}
        </Svg>

        {period === 'night' && (
          <>
            <AnimatedStar top={54} left={76} anim={twinkleA} color={palette.starColor} />
            <AnimatedStar top={96} left={186} anim={twinkleB} color={palette.starColor} />
            <AnimatedStar top={156} left={64} anim={twinkleC} color={palette.starColor} />
          </>
        )}
      </Animated.View>
    </Animated.View>
  );
}

function AnimatedStar({
  top,
  left,
  anim,
  color,
}: {
  top: number;
  left: number;
  anim: Animated.Value;
  color: string;
}) {
  return (
    <Animated.View style={[styles.star, { top, left, opacity: anim }]}>
      <Svg width={9} height={9} viewBox="0 0 9 9">
        <Path
          d="M4.5,0 L5.6,3.4 L9,4.5 L5.6,5.6 L4.5,9 L3.4,5.6 L0,4.5 L3.4,3.4 Z"
          fill={color}
        />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: -60,
    alignSelf: 'center',
  },
  driftLayer: {
    width: SIZE,
    height: SIZE,
  },
  star: {
    position: 'absolute',
  },
});
