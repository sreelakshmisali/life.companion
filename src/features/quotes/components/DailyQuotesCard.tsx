import React, { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card } from '@/components/cards/Card';
import { Title, Body, Caption } from '@/components/common/Type';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing, radius } from '@/theme/tokens';
import { QuoteItem } from '../types';

/**
 * Read-only browsing surface for Mind — editing quotes still lives in
 * Settings (QuotesEditableList). This just shows today's pick and lets
 * the person page back through the ones they've saved.
 */
export function DailyQuotesCard({ quoteOfTheDay, quotes }: { quoteOfTheDay: QuoteItem | null; quotes: QuoteItem[] }) {
  const { theme } = useAppTheme();
  const [expanded, setExpanded] = useState(false);
  const others = quotes.filter((q) => q.id !== quoteOfTheDay?.id);

  return (
    <Card>
      <View style={styles.header}>
        <Title>Daily quotes</Title>
        {others.length > 0 && (
          <Pressable onPress={() => setExpanded((e) => !e)} hitSlop={8} style={styles.seeAll}>
            <Caption color={theme.accent}>{expanded ? 'Show less' : 'Browse all'}</Caption>
            <Feather
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={14}
              color={theme.accent}
              style={{ marginLeft: 2 }}
            />
          </Pressable>
        )}
      </View>

      {quoteOfTheDay ? (
        <View style={[styles.quoteWrap, { backgroundColor: theme.surfaceAlt }]}>
          <Body style={{ fontStyle: 'italic' }}>“{quoteOfTheDay.quote}”</Body>
          <Caption style={{ marginTop: spacing.xs }}>— {quoteOfTheDay.author}</Caption>
        </View>
      ) : (
        <Caption style={{ marginTop: spacing.sm }}>Add a few favorite quotes in Settings.</Caption>
      )}

      {expanded && (
        <View style={styles.list}>
          {others.map((q) => (
            <View key={q.id} style={[styles.quoteWrap, { backgroundColor: theme.surfaceAlt }]}>
              <Body style={{ fontStyle: 'italic' }}>“{q.quote}”</Body>
              <Caption style={{ marginTop: spacing.xs }}>— {q.author}</Caption>
            </View>
          ))}
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
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quoteWrap: {
    padding: spacing.sm,
    marginTop: spacing.sm,
    borderRadius: radius.lg,
  },
  list: {
    gap: spacing.xs,
  },
});
