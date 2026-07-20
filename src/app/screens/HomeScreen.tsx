import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/tokens';
import { HomeSkyAccent } from '@/components/common/HomeSkyAccent';
import { Greeting, Subtitle, Caption } from '@/components/common/Type';
import { MissionsCard } from '@/features/missions/components/MissionsCard';
import { StreakCard } from '@/features/missions/components/StreakCard';
import { useMissions } from '@/features/missions/store/MissionsProvider';
import { WaterTracker } from '@/features/water/components/WaterTracker';
import { useWater } from '@/features/water/store/WaterProvider';
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
import { TAB_BAR_CLEARANCE } from '../navigation/types';

import { useStreak } from '@/features/streak/store/StreakProvider';

export function HomeScreen({
  onOpenMissions,
  onOpenMeditation,
  onOpenTodos,
  onOpenSettings,
}: {
  onOpenMissions: () => void;
  onOpenMeditation: () => void;
  onOpenTodos: () => void;
  onOpenSettings: () => void;
}) {
  const { theme } = useAppTheme();
  const { missions, toggleMission } = useMissions();
  const { currentStreak } = useStreak();
  const water = useWater();
  const { todos, activeTodos, toggleTodo } = useTodos();
  const { quoteOfTheDay } = useQuotes();
  const sleep = useSleepRitual();
  const spark = useSpark();

  const today = new Date();
  const hour = today.getHours();
  const greeting = getGreeting(hour);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <LinearGradient colors={theme.backgroundGradient} style={StyleSheet.absoluteFill} />
      <HomeSkyAccent />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: TAB_BAR_CLEARANCE }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.greetingBlock}>
          <Caption>{getFormattedDate(today)}</Caption>
          <Greeting style={{ marginTop: 4 }}>{greeting} ☀️</Greeting>
          <Subtitle style={{ marginTop: spacing.xs }}>
            Take a breath. Today is a fresh little page.
          </Subtitle>
          {quoteOfTheDay && <QuoteChip quote={quoteOfTheDay.quote} author={quoteOfTheDay.author} />}
        </View>

        <View style={styles.stack}>
          <StreakCard onOpenSettings={onOpenSettings} />
          <MeditationCard onPress={onOpenMeditation} />
          <MissionsCard missions={missions} onToggle={toggleMission} onSeeAll={onOpenMissions} />
          <TodoCard activeTodos={activeTodos} totalCount={todos.length} onToggle={toggleTodo} onSeeAll={onOpenTodos} />
          <WaterTracker
            cups={water.cups}
            goal={water.goal}
            onAdd={water.addCup}
            onRemove={water.removeCup}
            onSetGoal={water.setGoal}
            weekHistory={water.weekHistory}
          />
          <SleepRitualCard
            checklist={sleep.checklist}
            completedTonight={sleep.completedTonight}
            onToggleItem={sleep.toggleTonightItem}
            weekHistory={sleep.weekHistory}
          />
          <DailySparkCard
            todaysSpark={spark.todaysSpark}
            canReroll={spark.canReroll}
            onReroll={spark.reroll}
            ideas={spark.ideas}
          />
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
  greetingBlock: {
    marginTop: spacing.md,
    zIndex: 2,
  },
  stack: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
});
