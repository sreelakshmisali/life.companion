import React, { useRef, useState } from 'react';
import { Animated, Pressable, View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card } from '@/components/cards/Card';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { Title, Body, Caption } from '@/components/common/Type';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing, radius } from '@/theme/tokens';
import { SparkIdea } from '../types';

/**
 * Replaces the old DailyDice — same playful "tiny nudge" spirit, but now
 * backed by the Spark provider: a deterministic Today's Spark with one
 * reroll a day, plus an unlimited Inspire Me button underneath.
 */
export function DailySparkCard({
  todaysSpark,
  canReroll,
  onReroll,
  ideas,
}: {
  todaysSpark: SparkIdea | null;
  canReroll: boolean;
  onReroll: () => void;
  ideas: SparkIdea[];
}) {
  const { theme } = useAppTheme();
  const [inspireIdea, setInspireIdea] = useState<SparkIdea | null>(null);
  const rerollSpin = useRef(new Animated.Value(0)).current;
  const inspireSpin = useRef(new Animated.Value(0)).current;

  const handleReroll = () => {
    if (!canReroll) return;
    rerollSpin.setValue(0);
    Animated.timing(rerollSpin, { toValue: 1, duration: 450, useNativeDriver: true }).start();
    onReroll();
  };

  const handleInspire = () => {
    if (ideas.length === 0) return;
    inspireSpin.setValue(0);
    Animated.timing(inspireSpin, { toValue: 1, duration: 550, useNativeDriver: true }).start(() => {
      const options = ideas.filter((i) => i.id !== inspireIdea?.id);
      const pool = options.length > 0 ? options : ideas;
      setInspireIdea(pool[Math.floor(Math.random() * pool.length)]);
    });
  };

  const rerollRotate = rerollSpin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const inspireRotate = inspireSpin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Card>
      <Title>Daily Spark</Title>

      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Caption style={{ marginTop: spacing.sm }}>Today's Spark</Caption>
        </View>
        <Pressable onPress={handleReroll} hitSlop={8} disabled={!canReroll}>
          <Animated.View style={{ transform: [{ rotate: rerollRotate }] }}>
            <Feather name="refresh-cw" size={16} color={canReroll ? theme.accent : theme.textSecondary} />
          </Animated.View>
        </Pressable>
      </View>

      {todaysSpark ? (
        <View style={[styles.promptBox, { backgroundColor: theme.surfaceAlt }]}>
          <Body>{todaysSpark.text}</Body>
        </View>
      ) : (
        <Caption style={{ marginTop: spacing.xs }}>Add a few ideas in Settings to get started.</Caption>
      )}
      {!canReroll && <Caption style={{ marginTop: 4 }}>Reroll used for today — fresh one tomorrow.</Caption>}

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <Caption>Inspire Me</Caption>
      <View style={styles.inspireRow}>
        <PrimaryButton label="Give me an idea" onPress={handleInspire} style={{ flex: 1 }} />
        <Animated.View style={[styles.die, { backgroundColor: theme.accentSoft, transform: [{ rotate: inspireRotate }] }]}>
          <Body style={{ fontSize: 20 }}>🎲</Body>
        </Animated.View>
      </View>

      {inspireIdea && (
        <View style={[styles.promptBox, { backgroundColor: theme.surfaceAlt }]}>
          <Body>{inspireIdea.text}</Body>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promptBox: {
    marginTop: spacing.xs,
    padding: spacing.sm,
    borderRadius: radius.md,
  },
  divider: {
    height: 1,
    marginVertical: spacing.sm,
  },
  inspireRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  die: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
