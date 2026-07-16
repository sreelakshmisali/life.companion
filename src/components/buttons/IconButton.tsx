import React from 'react';
import { Pressable, View, StyleSheet, ViewStyle, GestureResponderEvent } from 'react-native';
import { radius } from '@/theme/tokens';

interface IconButtonProps {
  children: React.ReactNode;
  onPress?: (e: GestureResponderEvent) => void;
  size?: number;
  backgroundColor?: string;
  borderColor?: string;
  style?: ViewStyle;
  hitSlop?: number;
}

/**
 * A circular icon button used across features (water +/-, missions add,
 * navigation back). Keeps hit-target and radius consistent with the
 * design system rather than each feature reinventing it.
 */
export function IconButton({
  children,
  onPress,
  size = 40,
  backgroundColor = 'transparent',
  borderColor,
  style,
  hitSlop = 8,
}: IconButtonProps) {
  return (
    <Pressable onPress={onPress} hitSlop={hitSlop}>
      <View
        style={[
          styles.base,
          {
            width: size,
            height: size,
            borderRadius: radius.pill,
            backgroundColor,
            borderColor,
            borderWidth: borderColor ? 1.5 : 0,
          },
          style,
        ]}
      >
        {children}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
