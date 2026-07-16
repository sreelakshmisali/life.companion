import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Body } from './Type';
import { spacing } from '@/theme/tokens';

export function EmptyState({ emoji = '🌱', message }: { emoji?: string; message: string }) {
  return (
    <View style={styles.wrap}>
      <Body style={{ fontSize: 28, marginBottom: spacing.xs }}>{emoji}</Body>
      <Body style={{ textAlign: 'center' }}>{message}</Body>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
});
