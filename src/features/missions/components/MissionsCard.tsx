import React, { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card } from '@/components/cards/Card';
import { Title, Body, Caption } from '@/components/common/Type';
import { EmptyState } from '@/components/common/EmptyState';
import { PetalConfetti } from '@/components/common/PetalConfetti';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing, radius } from '@/theme/tokens';
import type { Mission } from '../types';

export type { Mission };

function MissionRow({ mission, onToggle }: { mission: Mission; onToggle: () => void }) {
  const { theme } = useAppTheme();
  const ripple = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    ripple.setValue(0);
    Animated.timing(ripple, { toValue: 1, duration: 420, useNativeDriver: true }).start();
    onToggle();
  };

  const rippleScale = ripple.interpolate({ inputRange: [0, 1], outputRange: [0.6, 2.2] });
  const rippleOpacity = ripple.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0.35, 0.15, 0] });

  return (
    <Pressable onPress={handlePress} style={styles.row}>
      <View style={styles.checkWrap}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.ripple,
            {
              backgroundColor: theme.accent,
              transform: [{ scale: rippleScale }],
              opacity: rippleOpacity,
            },
          ]}
        />
        <View
          style={[
            styles.checkbox,
            {
              borderColor: mission.done ? theme.accent : theme.border,
              backgroundColor: mission.done ? theme.accent : 'transparent',
            },
          ]}
        >
          {mission.done && <Feather name="check" size={14} color={theme.textOnAccent} />}
        </View>
      </View>
      <Body
        style={{ flex: 1, textDecorationLine: mission.done ? 'line-through' : 'none' }}
        color={mission.done ? theme.textSecondary : theme.textPrimary}
      >
        {mission.label}
      </Body>
    </Pressable>
  );
}

export function MissionsCard({
  missions,
  onToggle,
  onSeeAll,
}: {
  missions: Mission[];
  onToggle: (id: string) => void;
  onSeeAll?: () => void;
}) {
  const { theme } = useAppTheme();
  const doneCount = missions.filter((m) => m.done).length;
  const allDone = missions.length > 0 && doneCount === missions.length;
  const [showConfetti, setShowConfetti] = useState(false);
  const prevAllDone = useRef(false);

  React.useEffect(() => {
    if (allDone && !prevAllDone.current) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 2800);
      return () => clearTimeout(t);
    }
    prevAllDone.current = allDone;
  }, [allDone]);

  return (
    <Card>
      <View style={styles.header}>
        <Title>Today's missions</Title>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={[styles.pill, { backgroundColor: theme.accentSoft }]}>
            <Caption color={theme.accent} style={{ fontFamily: undefined }}>
              {doneCount}/{missions.length}
            </Caption>
          </View>
          {onSeeAll && (
            <Pressable onPress={onSeeAll} hitSlop={8}>
              <Caption color={theme.accent}>See all</Caption>
            </Pressable>
          )}
        </View>
      </View>

      {missions.length === 0 ? (
        <EmptyState message={"No missions yet.\nLet's plant your first little habit."} />
      ) : (
        <View style={{ marginTop: spacing.xs }}>
          {missions.map((m) => (
            <MissionRow key={m.id} mission={m} onToggle={() => onToggle(m.id)} />
          ))}
        </View>
      )}

      <PetalConfetti visible={showConfetti} />
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pill: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: spacing.xs,
  },
  checkWrap: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ripple: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
