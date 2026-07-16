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

function averageCups(entries: { cups: number }[]) {
  if (entries.length === 0) return 0;
  const sum = entries.reduce((s, e) => s + e.cups, 0);
  return Math.round((sum / entries.length) * 10) / 10;
}

export function InsightsScreen({ onBack }: { onBack: () => void }) {
  const { theme } = useAppTheme();
  const water = useWater();
  const mood = useMood();

  const weeklyAverage = averageCups(water.weekHistory);
  const daysHitGoal = water.weekHistory.filter((d) => d.cups >= water.goal).length;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <LinearGradient colors={theme.backgroundGradient} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <IconButton onPress={onBack} backgroundColor={theme.surface}>
          <Feather name="arrow-left" size={18} color={theme.textPrimary} />
        </IconButton>
        <View style={{ flex: 1, marginLeft: spacing.sm }}>
          <Greeting style={{ fontSize: 26, lineHeight: 32 }}>Water & mood</Greeting>
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
          <Caption style={{ marginTop: 2 }}>This week</Caption>

          <MoodWeekTimeline days={mood.weekHistory} />

          <View style={styles.moodPickRow}>
            {MOODS.map((m) => {
              const selected = mood.mood === m.id;
              return (
                <IconButton
                  key={m.id}
                  onPress={() => mood.setMood(m.id as MoodId)}
                  size={44}
                  backgroundColor={selected ? theme.accentSoft : 'transparent'}
                  borderColor={selected ? theme.accent : theme.border}
                >
                  <Body style={{ fontSize: 18 }}>{m.emoji}</Body>
                </IconButton>
              );
            })}
          </View>
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
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
