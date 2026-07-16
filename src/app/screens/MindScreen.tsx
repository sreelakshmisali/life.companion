import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/tokens';
import { AmbientOrb } from '@/components/common/AmbientOrb';
import { Greeting, Title, Body, Caption } from '@/components/common/Type';
import { Card } from '@/components/cards/Card';
import { MeditationCard } from '@/features/meditation/components/MeditationCard';
import { TAB_BAR_CLEARANCE } from '../navigation/types';

/**
 * Phase 1 shell for the consolidated Mind tab. Mood, quotes, sleep ritual,
 * and history all move in here properly in Phase 4 — for now this hosts
 * Meditation and a link into the existing trends view so navigation has
 * a real home for everything the spec calls "mindfulness features."
 */
export function MindScreen({
  onOpenMeditation,
  onOpenInsights,
}: {
  onOpenMeditation: () => void;
  onOpenInsights: () => void;
}) {
  const { theme } = useAppTheme();

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
          <MeditationCard onPress={onOpenMeditation} />

          <Card onPress={onOpenInsights}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Title>Mood & water trends</Title>
                <Caption style={{ marginTop: 2 }}>See your week at a glance</Caption>
              </View>
              <Feather name="chevron-right" size={20} color={theme.textSecondary} />
            </View>
          </Card>

          <Card>
            <Title>More on the way</Title>
            <Body style={{ marginTop: spacing.xs }}>
              Daily quotes, sleep ritual, and mood history are moving in here soon.
            </Body>
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
