import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Body, Caption } from '@/components/common/Type';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing, radius } from '@/theme/tokens';

export function QuoteChip({ quote, author }: { quote: string; author: string }) {
  const { theme } = useAppTheme();
  return (
    <View style={[styles.quoteWrap, { backgroundColor: theme.surfaceAlt, borderRadius: radius.lg }]}>
      <Body style={{ fontStyle: 'italic' }}>“{quote}”</Body>
      <Caption style={{ marginTop: spacing.xs }}>— {author}</Caption>
    </View>
  );
}

const styles = StyleSheet.create({
  quoteWrap: {
    padding: spacing.sm,
    marginTop: spacing.sm,
  },
});
