import React, { useMemo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card } from '@/components/cards/Card';
import { Title, Body, Caption } from '@/components/common/Type';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/tokens';
import { useDailyArchive } from '../store/DailyArchiveProvider';
import { getLookbackTargets } from '../utils';
import { MemoryRow } from './MemoryRow';

export function OnThisDayCard({ onSeeAll }: { onSeeAll: () => void }) {
  const { theme } = useAppTheme();
  const { getEntry, loggedDayCount } = useDailyArchive();

  const lookbacks = useMemo(
    () => getLookbackTargets().map((t) => ({ ...t, entry: getEntry(t.dateKey) })),
    [getEntry]
  );

  // Show whichever is closest and actually has something to remember.
  const nearest = lookbacks.find((l) => l.entry) ?? null;

  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Feather name="sunrise" size={16} color={theme.accent} />
          <Title style={{ marginLeft: 8 }}>On This Day</Title>
        </View>
        <Pressable onPress={onSeeAll} hitSlop={8}>
          <Caption color={theme.accent}>See all</Caption>
        </Pressable>
      </View>

      {nearest ? (
        <MemoryRow lookback={nearest} />
      ) : (
        <View style={{ marginTop: spacing.xs }}>
          <Body>
            {loggedDayCount <= 1
              ? "You're just getting started — memories will start showing up here soon."
              : `Day ${loggedDayCount} of your journal. Check back in a few more days for your first memory.`}
          </Body>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
