import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing, radius } from '@/theme/tokens';
import { Title, Body, Caption } from '@/components/common/Type';
import { moodOptionFor } from '@/features/mood/constants';
import { OnThisDayLookback } from '../types';

export function MemoryRow({ lookback }: { lookback: OnThisDayLookback }) {
  const { theme } = useAppTheme();
  const { entry } = lookback;

  return (
    <View style={[styles.wrap, { borderColor: theme.border }]}>
      <View style={styles.header}>
        <Title style={{ fontSize: 16, lineHeight: 22 }}>{lookback.label}</Title>
        <Caption>{lookback.dateLabel}</Caption>
      </View>

      {!entry ? (
        <Caption style={{ marginTop: spacing.xs }}>
          Nothing logged this day yet — keep journaling and this will fill in.
        </Caption>
      ) : (
        <View style={{ marginTop: spacing.xs }}>
          <View style={styles.chipsRow}>
            {entry.morningMoodId && (
              <View style={[styles.chip, { backgroundColor: theme.accentSoft }]}>
                <Body style={{ fontSize: 14 }}>{moodOptionFor(entry.morningMoodId)?.emoji}</Body>
                <Caption style={{ marginLeft: 4 }}>morning</Caption>
              </View>
            )}
            {entry.nightMoodId && (
              <View style={[styles.chip, { backgroundColor: theme.accentSoft }]}>
                <Body style={{ fontSize: 14 }}>{moodOptionFor(entry.nightMoodId)?.emoji}</Body>
                <Caption style={{ marginLeft: 4 }}>night</Caption>
              </View>
            )}
            {entry.missionsTotal > 0 && (
              <View style={[styles.chip, { backgroundColor: theme.surfaceAlt }]}>
                <Caption>
                  {entry.missionsDone}/{entry.missionsTotal} missions
                </Caption>
              </View>
            )}
            {entry.waterCups > 0 && (
              <View style={[styles.chip, { backgroundColor: theme.surfaceAlt }]}>
                <Caption>💧 {entry.waterCups} cups</Caption>
              </View>
            )}
            {entry.sleepTotal > 0 && (
              <View style={[styles.chip, { backgroundColor: theme.surfaceAlt }]}>
                <Caption>
                  🌙 {entry.sleepCompleted}/{entry.sleepTotal}
                </Caption>
              </View>
            )}
          </View>

          {entry.spark && (
            <Body style={{ marginTop: spacing.xs }} numberOfLines={2}>
              ✨ {entry.spark}
            </Body>
          )}
          {entry.quote && (
            <Caption style={{ marginTop: 4, fontStyle: 'italic' }} numberOfLines={2}>
              “{entry.quote.quote}” — {entry.quote.author}
            </Caption>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderTopWidth: 1,
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
});
