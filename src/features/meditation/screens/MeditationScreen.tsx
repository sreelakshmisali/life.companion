import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/tokens';
import { Greeting, Title, Body, Caption } from '@/components/common/Type';
import { IconButton } from '@/components/buttons/IconButton';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { PetalConfetti } from '@/components/common/PetalConfetti';
import { BreathingOrb } from '../components/BreathingOrb';
import { DurationPicker } from '../components/DurationPicker';
import { useBreathingCycle } from '../hooks/useBreathingCycle';
import { useMeditationSession } from '../hooks/useMeditationSession';
import { MEDITATION_CLOSING_MESSAGES } from '../constants';

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function MeditationScreen() {
  const { theme } = useAppTheme();
  const session = useMeditationSession();
  const { phase, scale, glow } = useBreathingCycle(session.status === 'running');

  const closingMessage = React.useMemo(
    () => MEDITATION_CLOSING_MESSAGES[Math.floor(Math.random() * MEDITATION_CLOSING_MESSAGES.length)],
    [session.status === 'complete']
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <LinearGradient colors={theme.backgroundGradient} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Greeting style={{ fontSize: 26, lineHeight: 32 }}>Meditate</Greeting>
        </View>
        {session.status !== 'setup' && (
          <IconButton onPress={session.reset} backgroundColor={theme.surface}>
            <Feather name="rotate-ccw" size={16} color={theme.textSecondary} />
          </IconButton>
        )}
      </View>

      <View style={styles.body}>
        {session.status === 'complete' ? (
          <View style={styles.centered}>
            <Body style={{ fontSize: 40, marginBottom: spacing.sm }}>🌿</Body>
            <Title style={{ textAlign: 'center' }}>{closingMessage}</Title>
            <Caption style={{ marginTop: spacing.xs, textAlign: 'center' }}>
              You sat with yourself for {session.minutes} minutes.
            </Caption>
            <View style={{ marginTop: spacing.lg, width: '100%' }}>
              <PrimaryButton label="Done" onPress={session.reset} />
            </View>
            <PetalConfetti visible />
          </View>
        ) : (
          <>
            <View style={styles.orbArea}>
              <BreathingOrb scale={scale} glow={glow} />
              {session.status === 'running' || session.status === 'paused' ? (
                <View style={styles.phaseLabel}>
                  <Title>{session.status === 'paused' ? 'Paused' : phase.label}</Title>
                  <Caption style={{ marginTop: spacing.xs }}>{formatTime(session.remainingSeconds)} left</Caption>
                </View>
              ) : (
                <View style={styles.phaseLabel}>
                  <Caption>Ready when you are</Caption>
                </View>
              )}
            </View>

            <View style={styles.controls}>
              {session.status === 'setup' && (
                <>
                  <DurationPicker selectedMinutes={session.minutes} onSelect={session.selectMinutes} />
                  <View style={{ height: spacing.md }} />
                  <PrimaryButton label="Begin" onPress={session.start} />
                </>
              )}

              {session.status === 'running' && <PrimaryButton label="Pause" onPress={session.pause} />}

              {session.status === 'paused' && <PrimaryButton label="Resume" onPress={session.resume} />}
            </View>
          </>
        )}
      </View>
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
  body: {
    flex: 1,
    paddingHorizontal: spacing.md,
    justifyContent: 'space-between',
    paddingBottom: spacing.xl,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  orbArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseLabel: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  controls: {
    paddingBottom: spacing.sm,
  },
});
