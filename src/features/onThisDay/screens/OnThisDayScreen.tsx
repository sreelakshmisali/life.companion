import React, { useMemo } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/tokens';
import { Greeting, Body, Caption } from '@/components/common/Type';
import { Card } from '@/components/cards/Card';
import { IconButton } from '@/components/buttons/IconButton';
import { useDailyArchive } from '../store/DailyArchiveProvider';
import { getLookbackTargets } from '../utils';
import { MemoryRow } from '../components/MemoryRow';

export function OnThisDayScreen({ onBack }: { onBack: () => void }) {
  const { theme } = useAppTheme();
  const { getEntry, loggedDayCount } = useDailyArchive();

  const lookbacks = useMemo(
    () => getLookbackTargets().map((t) => ({ ...t, entry: getEntry(t.dateKey) })),
    [getEntry]
  );

  const anyMemories = lookbacks.some((l) => l.entry);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <LinearGradient colors={theme.backgroundGradient} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <IconButton onPress={onBack} backgroundColor={theme.surface}>
          <Feather name="arrow-left" size={18} color={theme.textPrimary} />
        </IconButton>
        <View style={{ flex: 1, marginLeft: spacing.sm }}>
          <Greeting style={{ fontSize: 26, lineHeight: 32 }}>On This Day</Greeting>
          <Caption style={{ marginTop: 2 }}>A little look back</Caption>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Card>
          {!anyMemories && (
            <Body style={{ marginBottom: spacing.xs }}>
              Nothing to look back on yet — real memories build up the more you use Cozy Journal. Come back
              in a week for your first one.
            </Body>
          )}
          {lookbacks.map((l) => (
            <MemoryRow key={l.key} lookback={l} />
          ))}
        </Card>

        <Card style={{ marginTop: spacing.md, backgroundColor: theme.surfaceAlt }}>
          <Caption>
            {loggedDayCount === 1
              ? "You've logged 1 day so far."
              : `You've logged ${loggedDayCount} days so far.`}{' '}
            Every day you use the app becomes a real memory here — nothing here is made up.
          </Caption>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
  },
  scroll: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xl,
  },
});
