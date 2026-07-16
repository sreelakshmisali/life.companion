import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { useAppTheme } from '@/theme/ThemeProvider';
import { cardPadding, radius, shadow } from '@/theme/tokens';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: keyof typeof cardPadding;
}

/**
 * The shared surface for every feature on the home screen.
 * Large radius, subtle shadow, gentle lift on press — never a hard tap state.
 */
export function Card({ children, onPress, style, padding = 'default' }: CardProps) {
  const { theme } = useAppTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.98, useNativeDriver: true, speed: 40, bounciness: 4 }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 6 }).start();

  const content = (
    <Animated.View
      style={[
        styles.base,
        shadow.soft,
        {
          backgroundColor: theme.surface,
          borderRadius: radius.lg,
          padding: cardPadding[padding],
          transform: [{ scale }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );

  if (!onPress) return content;

  return (
    <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
  },
});
