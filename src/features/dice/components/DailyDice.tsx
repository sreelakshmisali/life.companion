import React, { useRef, useState } from 'react';
import { Animated, Pressable, View, StyleSheet } from 'react-native';
import { Card } from '@/components/cards/Card';
import { Title, Body, Caption } from '@/components/common/Type';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing, radius, buttonHeight } from '@/theme/tokens';

const PROMPTS = [
  'Step outside for 5 minutes of fresh air.',
  'Write down one thing you\u2019re grateful for.',
  'Stretch your arms and neck slowly.',
  'Send a kind message to someone you miss.',
  'Drink a full glass of water, slowly.',
  'Tidy one small corner of your space.',
  'Sit quietly and take five deep breaths.',
  'Put on a song that makes you smile.',
];

export function DailyDice() {
  const { theme } = useAppTheme();
  const [prompt, setPrompt] = useState<string | null>(null);
  const spin = useRef(new Animated.Value(0)).current;

  const roll = () => {
    spin.setValue(0);
    Animated.timing(spin, { toValue: 1, duration: 550, useNativeDriver: true }).start(() => {
      setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
    });
  };

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Card>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Title>Daily dice</Title>
          <Caption style={{ marginTop: 2 }}>A tiny nudge, just for today</Caption>
        </View>
        <Pressable onPress={roll} hitSlop={8}>
          <Animated.View
            style={[
              styles.die,
              { backgroundColor: theme.accentSoft, transform: [{ rotate }] },
            ]}
          >
            <Body style={{ fontSize: 22 }}>🎲</Body>
          </Animated.View>
        </Pressable>
      </View>

      {prompt && (
        <View style={[styles.promptBox, { backgroundColor: theme.surfaceAlt, borderRadius: radius.md }]}>
          <Body>{prompt}</Body>
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
  die: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptBox: {
    marginTop: spacing.sm,
    padding: spacing.sm,
  },
});
