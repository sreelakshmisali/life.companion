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
import { DailyDice } from '@/features/dice/components/DailyDice';
import { QuoteChip } from '@/features/quotes/components/QuoteChip';
import { useQuotes } from '@/features/quotes/store/QuotesProvider';
import { getGreeting, getFormattedDate } from '@/utils/date';
import { MeditationCard } from '@/features/meditation/components/MeditationCard';
import { TodoCard } from '@/features/todo/components/TodoCard';
import { useTodos } from '@/features/todo/store/TodoProvider';
import { TAB_BAR_CLEARANCE } from '../navigation/types';

export function HomeScreen({
  onOpenMissions,
  onOpenMeditation,
  onOpenInsights,
  onOpenTodos,
}: {
  onOpenMissions: () => void;
  onOpenMeditation: () => void;
  onOpenInsights: () => void;
  onOpenTodos: () => void;
}) {
  const { theme } = useAppTheme();
  const { missions, toggleMission } = useMissions();
  const water = useWater();
  const mood = useMood();
  const { todos, activeTodos, toggleTodo } = useTodos();
  const { quoteOfTheDay } = useQuotes();

  const today = new Date();
  const greeting = getGreeting(today.getHours());

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <LinearGradient colors={theme.backgroundGradient} style={StyleSheet.absoluteFill} />
      <AmbientOrb />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: TAB_BAR_CLEARANCE }]}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.greetingBlock}>
          <Caption>{getFormattedDate(today)}</Caption>
          <Greeting style={{ marginTop: 4 }}>{greeting}</Greeting>
          <Subtitle style={{ marginTop: spacing.xs }}>
            Take a breath. Today is a fresh little page.
          </Subtitle>
          {quoteOfTheDay && <QuoteChip quote={quoteOfTheDay.quote} author={quoteOfTheDay.author} />}
        </View>

        <View style={styles.stack}>
          <StreakCard streakDays={4} weeklyGoal={7} />
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
          <MoodPicker selected={mood.mood} onSelect={mood.setMood} onSeeAll={onOpenInsights} />
          <DailyDice />
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
