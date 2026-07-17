import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/tokens';
import { AmbientOrb } from '@/components/common/AmbientOrb';
import { Greeting, Title, Caption } from '@/components/common/Type';
import { Card } from '@/components/cards/Card';
import { MeditationCard } from '@/features/meditation/components/MeditationCard';
import { MoodPicker } from '@/features/mood/components/MoodPicker';
import { useMood } from '@/features/mood/store/MoodProvider';
import { DailyQuotesCard } from '@/features/quotes/components/DailyQuotesCard';
import { useQuotes } from '@/features/quotes/store/QuotesProvider';
import { SleepRitualCard } from '@/features/sleep/components/SleepRitualCard';
import { useSleepRitual } from '@/features/sleep/store/SleepRitualProvider';
import { TAB_BAR_CLEARANCE } from '../navigation/types';

/**
 * The consolidated Mind tab — everything the spec calls "mindfulness
 * features" lives here: mood tracking (morning + night), meditation,
 * daily quotes, the sleep ritual checklist, and a link into history.
 */
export function MindScreen({
  onOpenMeditation,
  onOpenInsights,
}: {
  onOpenMeditation: () => void;
  onOpenInsights: () => void;
}) {
  const { theme } = useAppTheme();
  const mood = useMood();
  const { quotes, quoteOfTheDay } = useQuotes();
  const sleep = useSleepRitual();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <LinearGradient colors={theme.backgroundGradient} style={StyleSheet.absoluteFill} />
      <AmbientOrb />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: TAB_BAR_CLEARANCE }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Greeting style={{ fontSize: 26, lineHeight: 32 }}>Mind</Greeting>
          <Caption style={{ marginTop: 4 }}>A quiet space for mood, breath, and rest</Caption>
        </View>

        <View style={styles.stack}>
          <MoodPicker
            period="morning"
            selected={mood.morningMood}
            onSelect={(id) => mood.setMood('morning', id)}
            onSeeAll={onOpenInsights}
          />
          <MoodPicker
            period="night"
            selected={mood.nightMood}
            onSelect={(id) => mood.setMood('night', id)}
            onSeeAll={onOpenInsights}
          />

          <MeditationCard onPress={onOpenMeditation} />

          <DailyQuotesCard quoteOfTheDay={quoteOfTheDay} quotes={quotes} />

          <SleepRitualCard
            checklist={sleep.checklist}
            completedTonight={sleep.completedTonight}
            onToggleItem={sleep.toggleTonightItem}
            currentStreak={sleep.currentStreak}
          />

          <Card onPress={onOpenInsights}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Title>Your history</Title>
                <Caption style={{ marginTop: 2 }}>Water, mood, and sleep — your week at a glance</Caption>
              </View>
              <Feather name="chevron-right" size={20} color={theme.textSecondary} />
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xl,
  },
  header: {
    marginTop: spacing.md,
    zIndex: 2,
  },
  stack: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
