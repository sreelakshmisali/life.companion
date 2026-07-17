import React from 'react';
import { View, ScrollView, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/tokens';
import { AmbientOrb } from '@/components/common/AmbientOrb';
import { Greeting, Subtitle, Caption } from '@/components/common/Type';
import { WeatherChip } from '@/components/common/WeatherChip';
import { MissionsCard } from '@/features/missions/components/MissionsCard';
import { StreakCard } from '@/features/missions/components/StreakCard';
import { useMissions } from '@/features/missions/store/MissionsProvider';
import { WaterTracker } from '@/features/water/components/WaterTracker';
import { useWater } from '@/features/water/store/WaterProvider';
import { MoodPicker } from '@/features/mood/components/MoodPicker';
import { useMood } from '@/features/mood/store/MoodProvider';
import { DailySparkCard } from '@/features/spark/components/DailySparkCard';
import { useSpark } from '@/features/spark/store/SparkProvider';
import { QuoteChip } from '@/features/quotes/components/QuoteChip';
import { useQuotes } from '@/features/quotes/store/QuotesProvider';
import { getGreeting, getFormattedDate } from '@/utils/date';
import { MeditationCard } from '@/features/meditation/components/MeditationCard';
import { TodoCard } from '@/features/todo/components/TodoCard';
import { useTodos } from '@/features/todo/store/TodoProvider';
import { SleepRitualCard } from '@/features/sleep/components/SleepRitualCard';
import { useSleepRitual } from '@/features/sleep/store/SleepRitualProvider';
import { OnThisDayCard } from '@/features/onThisDay/components/OnThisDayCard';
import { TAB_BAR_CLEARANCE } from '../navigation/types';

export function HomeScreen({
  onOpenMissions,
  onOpenMeditation,
  onOpenInsights,
  onOpenTodos,
  onOpenOnThisDay,
}: {
  onOpenMissions: () => void;
  onOpenMeditation: () => void;
  onOpenInsights: () => void;
  onOpenTodos: () => void;
  onOpenOnThisDay: () => void;
}) {
  const { theme } = useAppTheme();
  const { missions, toggleMission, currentStreak } = useMissions();
  const water = useWater();
  const mood = useMood();
  const { todos, activeTodos, toggleTodo } = useTodos();
  const { quoteOfTheDay } = useQuotes();
  const sleep = useSleepRitual();
  const spark = useSpark();

  const today = new Date();
  const hour = today.getHours();
  const greeting = getGreeting(hour);
  const isEvening = hour >= 18;
  const moodPeriod = isEvening ? 'night' : 'morning';

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <LinearGradient colors={theme.backgroundGradient} style={StyleSheet.absoluteFill} />
      <AmbientOrb />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: TAB_BAR_CLEARANCE }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <WeatherChip temp="22°" condition="cloudy" />
        </View>

        <View style={styles.greetingBlock}>
          <Caption>{getFormattedDate(today)}</Caption>
          <Greeting style={{ marginTop: 4 }}>{greeting} ☀️</Greeting>
          <Subtitle style={{ marginTop: spacing.xs }}>
            Take a breath. Today is a fresh little page.
          </Subtitle>
          {quoteOfTheDay && <QuoteChip quote={quoteOfTheDay.quote} author={quoteOfTheDay.author} />}
        </View>

        <View style={styles.stack}>
          <StreakCard streakDays={currentStreak} weeklyGoal={7} />
          <MeditationCard onPress={onOpenMeditation} />
          <MissionsCard missions={missions} onToggle={toggleMission} onSeeAll={onOpenMissions} />
          <TodoCard activeTodos={activeTodos} totalCount={todos.length} onToggle={toggleTodo} onSeeAll={onOpenTodos} />
          <WaterTracker
            cups={water.cups}
            goal={water.goal}
            onAdd={water.addCup}
            onRemove={water.removeCup}
            onSeeAll={onOpenInsights}
          />
          <MoodPicker
            period={moodPeriod}
            selected={moodPeriod === 'night' ? mood.nightMood : mood.morningMood}
            onSelect={(id) => mood.setMood(moodPeriod, id)}
            onSeeAll={onOpenInsights}
          />
          {isEvening && (
            <SleepRitualCard
              checklist={sleep.checklist}
              completedTonight={sleep.completedTonight}
              onToggleItem={sleep.toggleTonightItem}
              currentStreak={sleep.currentStreak}
            />
          )}
          <DailySparkCard
            todaysSpark={spark.todaysSpark}
            canReroll={spark.canReroll}
            onReroll={spark.reroll}
            ideas={spark.ideas}
          />
          <OnThisDayCard onSeeAll={onOpenOnThisDay} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  topRow: {
    alignItems: 'flex-end',
    marginBottom: spacing.sm,
  },
  greetingBlock: {
    marginTop: spacing.md,
    zIndex: 2,
  },
  stack: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
});
