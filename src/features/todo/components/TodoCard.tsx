import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Card } from '@/components/cards/Card';
import { Title, Body, Caption } from '@/components/common/Type';
import { EmptyState } from '@/components/common/EmptyState';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing, radius } from '@/theme/tokens';
import { PriorityDot } from './PriorityTag';
import { TodoItem } from '../types';

const PREVIEW_COUNT = 3;

export function TodoCard({
  activeTodos,
  totalCount,
  onToggle,
  onSeeAll,
}: {
  activeTodos: TodoItem[];
  totalCount: number;
  onToggle: (id: string) => void;
  onSeeAll: () => void;
}) {
  const { theme } = useAppTheme();
  const preview = activeTodos.slice(0, PREVIEW_COUNT);
  const remaining = activeTodos.length - preview.length;

  return (
    <Card>
      <View style={styles.header}>
        <Title>To-do</Title>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={[styles.pill, { backgroundColor: theme.accentSoft }]}>
            <Caption color={theme.accent} style={{ fontFamily: undefined }}>
              {activeTodos.length} open
            </Caption>
          </View>
          <Pressable onPress={onSeeAll} hitSlop={8}>
            <Caption color={theme.accent}>See all</Caption>
          </Pressable>
        </View>
      </View>

      {totalCount === 0 ? (
        <EmptyState emoji="📝" message={"Nothing on your list yet.\nAdd your first to-do."} />
      ) : preview.length === 0 ? (
        <View style={styles.doneWrap}>
          <Body>All caught up ✨</Body>
        </View>
      ) : (
        <View style={{ marginTop: spacing.xs }}>
          {preview.map((t) => (
            <Pressable key={t.id} style={styles.row} onPress={() => onToggle(t.id)}>
              <PriorityDot priority={t.priority} />
              <Body style={{ flex: 1, marginLeft: spacing.xs }} numberOfLines={1}>
                {t.label}
              </Body>
            </Pressable>
          ))}
          {remaining > 0 && <Caption style={{ marginTop: 4 }}>+{remaining} more</Caption>}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pill: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  doneWrap: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
});
