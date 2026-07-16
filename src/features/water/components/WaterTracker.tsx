import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card } from '@/components/cards/Card';
import { Title, Caption } from '@/components/common/Type';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing, radius } from '@/theme/tokens';

const GLASS_HEIGHT = 64;
const GLASS_WIDTH = 48;

export function WaterTracker({
  cups,
  goal,
  onAdd,
  onRemove,
  onSeeAll,
}: {
  cups: number;
  goal: number;
  onAdd: () => void;
  onRemove: () => void;
  onSeeAll?: () => void;
}) {
  const { theme } = useAppTheme();
  const fill = useRef(new Animated.Value(0)).current;
  const pct = Math.min(cups / goal, 1);

  useEffect(() => {
    Animated.spring(fill, { toValue: pct, useNativeDriver: false, speed: 10, bounciness: 6 }).start();
  }, [pct]);

  const fillHeight = fill.interpolate({ inputRange: [0, 1], outputRange: [0, GLASS_HEIGHT - 6] });

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
        {onSeeAll && (
          <Pressable onPress={onSeeAll} hitSlop={8}>
            <Caption color={theme.accent}>See trends</Caption>
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
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
