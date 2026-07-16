import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Caption } from '@/components/common/Type';
import { spacing, radius } from '@/theme/tokens';
import { priorityOptionFor } from '../constants';
import { TodoPriority } from '../types';

export function PriorityDot({ priority, size = 8 }: { priority: TodoPriority; size?: number }) {
  const option = priorityOptionFor(priority);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: option.color,
      }}
    />
  );
}

export function PriorityTag({ priority }: { priority: TodoPriority }) {
  const option = priorityOptionFor(priority);
  return (
    <View style={[styles.tag, { backgroundColor: option.softColor }]}>
      <PriorityDot priority={priority} size={6} />
      <Caption style={{ marginLeft: 5, fontFamily: undefined }} color={option.color}>
        {option.label}
      </Caption>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
});
