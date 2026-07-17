import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/tokens';
import { Greeting, Title, Body, Caption } from '@/components/common/Type';
import { Card } from '@/components/cards/Card';
import { IconButton } from '@/components/buttons/IconButton';
import { WeeklyBarChart } from '@/components/common/WeeklyBarChart';
import { useWater } from '@/features/water/store/WaterProvider';
import { useMood } from '@/features/mood/store/MoodProvider';
import { MoodWeekTimeline } from '@/features/mood/components/MoodWeekTimeline';
import { MOODS } from '@/features/mood/constants';
import { MoodId } from '@/features/mood/types';
import { useSleepRitual } from '@/features/sleep/store/SleepRitualProvider';

function averageCups(entries: { cups: number }[]) {
  if (entries.length === 0) return 0;
  const sum = entries.reduce((s, e) => s + e.cups, 0);
  return Math.round((sum / entries.length) * 10) / 10;
}

/**
 * A gentle, plain-language pattern spotted across this week's data — not a
 * statistical claim, just a nudge in the direction the numbers lean.
 */
function buildWeeklyInsight(
  waterHistory: { cups: number }[],
  goal: number,
  sleepHistory: { completedCount: number; totalCount: number }[]
): string | null {
  const daysHitWaterGoal = waterHistory.filter((d) => d.cups >= goal).length;
  const fullSleepNights = sleepHistory.filter((d) => d.totalCount > 0 && d.completedCount >= d.totalCount).length;

  if (fullSleepNights >= 5) return 'Your sleep ritual is nearly a daily habit this week — lovely consistency.';
  if (daysHitWaterGoal >= 5) return "You've been hitting your water goal most days this week. Keep it flowing.";
  if (fullSleepNights >= 3 && daysHitWaterGoal >= 3) return 'You tend to sleep better on days you also stay hydrated.';
  return null;
}

export function InsightsScreen({ onBack }: { onBack: () => void }) {
  const { theme } = useAppTheme();
  const water = useWater();
  const mood = useMood();
  const sleep = useSleepRitual();

  const weeklyAverage = averageCups(water.weekHistory);
  const daysHitGoal = water.weekHistory.filter((d) => d.cups >= water.goal).length;
  const insight = buildWeeklyInsight(water.weekHistory, water.goal, sleep.weekHistory);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <LinearGradient colors={theme.backgroundGradient} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <IconButton onPress={onBack} backgroundColor={theme.surface}>
          <Feather name="arrow-left" size={18} color={theme.textPrimary} />
        </IconButton>
        <View style={{ flex: 1, marginLeft: spacing.sm }}>
          <Greeting style={{ fontSize: 26, lineHeight: 32 }}>Your history</Greeting>
          <Caption style={{ marginTop: 2 }}>Your last 7 days</Caption>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ── Water ───────────────────────────────── */}
        <Card>
          <View style={styles.rowHeader}>
            <Title>Water</Title>
            <Caption>{water.cups} of {water.goal} cups today</Caption>
          </View>

          <WeeklyBarChart
            data={water.weekHistory.map((d) => ({ label: d.label, value: d.cups, isToday: d.isToday }))}
            maxValue={Math.max(water.goal, ...water.weekHistory.map((d) => d.cups))}
          />

          <View style={styles.statsRow}>
            <View style={styles.statBlock}>
              <Title style={{ fontSize: 20, lineHeight: 26 }}>{weeklyAverage}</Title>
              <Caption>Avg cups/day</Caption>
            </View>
            <View style={styles.statBlock}>
              <Title style={{ fontSize: 20, lineHeight: 26 }}>{daysHitGoal}/7</Title>
              <Caption>Days goal hit</Caption>
            </View>
          </View>

          <View style={styles.controls}>
            <IconButton onPress={water.removeCup} borderColor={theme.border} size={40}>
              <Feather name="minus" size={16} color={theme.textSecondary} />
            </IconButton>
            <IconButton onPress={water.addCup} backgroundColor={theme.accent} size={40}>
              <Feather name="plus" size={16} color={theme.textOnAccent} />
            </IconButton>
          </View>
        </Card>

        {/* ── Mood ────────────────────────────────── */}
        <Card style={{ marginTop: spacing.md }}>
          <Title>Mood</Title>
          <Caption style={{ marginTop: 2 }}>Morning (top) and night (bottom), this week</Caption>

          <MoodWeekTimeline days={mood.weekHistory} />

          <Caption style={{ marginTop: spacing.md }}>Morning</Caption>
          <View style={styles.moodPickRow}>
            {MOODS.map((m) => {
              const selected = mood.morningMood === m.id;
              return (
                <IconButton
                  key={m.id}
                  onPress={() => mood.setMood('morning', m.id as MoodId)}
                  size={40}
                  backgroundColor={selected ? theme.accentSoft : 'transparent'}
                  borderColor={selected ? theme.accent : theme.border}
                >
                  <Body style={{ fontSize: 16 }}>{m.emoji}</Body>
                </IconButton>
              );
            })}
          </View>

          <Caption style={{ marginTop: spacing.sm }}>Night</Caption>
          <View style={styles.moodPickRow}>
            {MOODS.map((m) => {
              const selected = mood.nightMood === m.id;
              return (
                <IconButton
                  key={m.id}
                  onPress={() => mood.setMood('night', m.id as MoodId)}
                  size={40}
                  backgroundColor={selected ? theme.accentSoft : 'transparent'}
                  borderColor={selected ? theme.accent : theme.border}
                >
                  <Body style={{ fontSize: 16 }}>{m.emoji}</Body>
                </IconButton>
              );
            })}
          </View>
        </Card>

        {/* ── Sleep ritual ────────────────────────── */}
        <Card style={{ marginTop: spacing.md }}>
          <View style={styles.rowHeader}>
            <Title>Sleep ritual</Title>
            <Caption>{sleep.currentStreak > 0 ? `🔥 ${sleep.currentStreak} night streak` : 'This week'}</Caption>
          </View>

          <WeeklyBarChart
            data={sleep.weekHistory.map((d) => ({
              label: d.label,
              value: d.completedCount,
              isToday: d.isToday,
            }))}
            maxValue={Math.max(1, ...sleep.weekHistory.map((d) => d.totalCount))}
          />
        </Card>

        {/* ── Insight ─────────────────────────────── */}
        {insight && (
          <Card style={{ marginTop: spacing.md, backgroundColor: theme.surfaceAlt }}>
            <View style={styles.row}>
              <Body>✨</Body>
              <Body style={{ marginLeft: spacing.xs, flex: 1 }}>{insight}</Body>
            </View>
          </Card>
        )}
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
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
    gap: spacing.lg,
  },
  statBlock: {},
  controls: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  moodPickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
});
