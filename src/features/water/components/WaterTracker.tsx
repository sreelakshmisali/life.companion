import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, StyleSheet, Pressable, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card } from '@/components/cards/Card';
import { Title, Body, Caption } from '@/components/common/Type';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing, radius, typography } from '@/theme/tokens';
import { WaterDayEntry } from '../types';
import { WeeklyBarChart } from '@/components/common/WeeklyBarChart';

const GLASS_HEIGHT = 64;
const GLASS_WIDTH = 48;

export function WaterTracker({
  cups,
  goal,
  onAdd,
  onRemove,
  onSetGoal,
  weekHistory,
}: {
  cups: number;
  goal: number;
  onAdd: () => void;
  onRemove: () => void;
  onSetGoal?: (goal: number) => void;
  weekHistory: WaterDayEntry[];
}) {
  const { theme } = useAppTheme();
  const fill = useRef(new Animated.Value(0)).current;
  const pct = Math.min(cups / goal, 1);
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalDraft, setGoalDraft] = useState(goal.toString());
  const [trendsExpanded, setTrendsExpanded] = useState(false);

  useEffect(() => {
    Animated.spring(fill, { toValue: pct, useNativeDriver: false, speed: 10, bounciness: 6 }).start();
  }, [pct]);

  const fillHeight = fill.interpolate({ inputRange: [0, 1], outputRange: [0, GLASS_HEIGHT - 6] });

  const commitGoal = () => {
    setEditingGoal(false);
    const parsed = parseInt(goalDraft, 10);
    if (!isNaN(parsed) && onSetGoal) onSetGoal(parsed);
  };

  return (
    <Card>
      <View style={styles.header}>
        <View>
          <Title>Water</Title>
          <Caption style={{ marginTop: 2 }}>
            {cups} of {goal} cups today
          </Caption>
        </View>

        <View style={styles.glassWrap}>
          <View style={[styles.glass, { borderColor: theme.border }]}>
            <Animated.View
              style={[
                styles.fill,
                { height: fillHeight, backgroundColor: theme.accent },
              ]}
            />
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.controls}>
          <Pressable
            onPress={onRemove}
            style={[styles.circleBtn, { borderColor: theme.border }]}
          >
            <Feather name="minus" size={16} color={theme.textSecondary} />
          </Pressable>
          <Pressable
            onPress={onAdd}
            style={[styles.circleBtn, { backgroundColor: theme.accent, borderColor: theme.accent }]}
          >
            <Feather name="plus" size={16} color={theme.textOnAccent} />
          </Pressable>
        </View>

        <View style={styles.goalRow}>
          {editingGoal ? (
            <TextInput
              value={goalDraft}
              onChangeText={setGoalDraft}
              onSubmitEditing={commitGoal}
              onBlur={commitGoal}
              keyboardType="number-pad"
              autoFocus
              style={[
                styles.goalInput,
                {
                  color: theme.textPrimary,
                  borderColor: theme.accent,
                  fontFamily: typography.fontFamily.body,
                },
              ]}
            />
          ) : (
            <Pressable onPress={() => { setGoalDraft(goal.toString()); setEditingGoal(true); }} hitSlop={8}>
              <Body style={{ color: theme.accent }}>Goal: {goal} cups</Body>
            </Pressable>
          )}
        </View>
      </View>

      <View style={{ marginTop: spacing.md }}>
        {trendsExpanded ? (
          <View style={styles.trendsPanel}>
            <View style={styles.trendsHeader}>
              <Caption color={theme.accent}>Water trends</Caption>
              <Pressable onPress={() => setTrendsExpanded(false)} hitSlop={8}>
                <Feather name="chevron-up" size={18} color={theme.textSecondary} />
              </Pressable>
            </View>
            <WeeklyBarChart
              data={weekHistory.map((d) => ({ label: d.label, value: d.cups, isToday: d.isToday }))}
              maxValue={Math.max(goal, ...weekHistory.map((d) => d.cups))}
            />
          </View>
        ) : (
          <Pressable onPress={() => setTrendsExpanded(true)} hitSlop={8} style={{ alignSelf: 'flex-end' }}>
            <Caption color={theme.accent}>See water trends</Caption>
          </Pressable>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  glassWrap: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  glass: {
    width: GLASS_WIDTH,
    height: GLASS_HEIGHT,
    borderWidth: 2,
    borderTopWidth: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  fill: {
    width: '100%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  controls: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  goalRow: {
    alignItems: 'flex-end',
  },
  goalInput: {
    borderBottomWidth: 1.5,
    paddingHorizontal: 4,
    paddingVertical: 2,
    fontSize: 14,
    minWidth: 60,
    textAlign: 'right',
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendsPanel: {
    paddingTop: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5E5',
  },
  trendsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
});
