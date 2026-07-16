import React from 'react';
import { Text, TextProps } from 'react-native';
import { useAppTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';

interface Props extends TextProps {
  children: React.ReactNode;
  color?: string;
}

export function Greeting({ children, style, color, ...rest }: Props) {
  const { theme } = useAppTheme();
  return (
    <Text
      style={[
        {
          fontFamily: typography.fontFamily.display,
          fontSize: typography.size.greeting,
          lineHeight: typography.lineHeight.greeting,
          color: color ?? theme.textPrimary,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}

export function Title({ children, style, color, ...rest }: Props) {
  const { theme } = useAppTheme();
  return (
    <Text
      style={[
        {
          fontFamily: typography.fontFamily.display,
          fontSize: typography.size.title,
          lineHeight: typography.lineHeight.title,
          color: color ?? theme.textPrimary,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}

export function Subtitle({ children, style, color, ...rest }: Props) {
  const { theme } = useAppTheme();
  return (
    <Text
      style={[
        {
          fontFamily: typography.fontFamily.bodyMedium,
          fontSize: typography.size.subtitle,
          lineHeight: typography.lineHeight.subtitle,
          color: color ?? theme.textSecondary,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}

export function Body({ children, style, color, ...rest }: Props) {
  const { theme } = useAppTheme();
  return (
    <Text
      style={[
        {
          fontFamily: typography.fontFamily.body,
          fontSize: typography.size.body,
          lineHeight: typography.lineHeight.body,
          color: color ?? theme.textPrimary,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}

export function Caption({ children, style, color, ...rest }: Props) {
  const { theme } = useAppTheme();
  return (
    <Text
      style={[
        {
          fontFamily: typography.fontFamily.body,
          fontSize: typography.size.caption,
          lineHeight: typography.lineHeight.caption,
          color: color ?? theme.textSecondary,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}
