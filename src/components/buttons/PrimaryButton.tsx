import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { useAppTheme } from '@/theme/ThemeProvider';
import { buttonHeight, radius } from '@/theme/tokens';
import { Body } from '@/components/common/Type';

interface PrimaryButtonProps {
  label: string;
  onPress?: () => void;
  size?: keyof typeof buttonHeight;
  style?: ViewStyle;
  disabled?: boolean;
  backgroundColor?: string;
}

/**
 * The standard filled action button. Height is pinned to the design
 * system's 52-56px range so every primary action across features
 * feels the same to tap.
 */
export function PrimaryButton({ label, onPress, size = 'default', style, disabled, backgroundColor }: PrimaryButtonProps) {
  const { theme } = useAppTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.base,
        {
          height: buttonHeight[size],
          backgroundColor: disabled ? theme.accentSoft : backgroundColor ?? theme.accent,
          borderRadius: radius.pill,
        },
        style,
      ]}
    >
      <Body color={theme.textOnAccent} style={{ fontFamily: undefined, fontWeight: '600' }}>
        {label}
      </Body>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});
