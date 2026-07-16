import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, Text } from 'react-native';

const { width } = Dimensions.get('window');
const PETALS = ['🌸', '🍃', '🌿', '🌼'];
const COUNT = 10;

/**
 * A brief, gentle shower of petals/leaves — the reward moment for
 * completing every mission for the day. Fires once, then fades away.
 */
export function PetalConfetti({ visible }: { visible: boolean }) {
  const pieces = useRef(
    Array.from({ length: COUNT }).map(() => ({
      x: Math.random() * width,
      delay: Math.random() * 300,
      duration: 2200 + Math.random() * 800,
      rotate: Math.random() > 0.5 ? '1' : '-1',
      emoji: PETALS[Math.floor(Math.random() * PETALS.length)],
      fall: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    if (!visible) return;
    pieces.forEach((p) => {
      p.fall.setValue(0);
      Animated.timing(p.fall, {
        toValue: 1,
        duration: p.duration,
        delay: p.delay,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    });
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      {pieces.map((p, i) => {
        const translateY = p.fall.interpolate({ inputRange: [0, 1], outputRange: [0, 420] });
        const opacity = p.fall.interpolate({ inputRange: [0, 0.1, 0.85, 1], outputRange: [0, 1, 1, 0] });
        const rotate = p.fall.interpolate({
          inputRange: [0, 1],
          outputRange: [`0deg`, `${p.rotate === '1' ? 180 : -180}deg`],
        });
        return (
          <Animated.Text
            key={i}
            style={[
              styles.petal,
              { left: p.x, transform: [{ translateY }, { rotate }], opacity },
            ]}
          >
            {p.emoji}
          </Animated.Text>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  petal: {
    position: 'absolute',
    top: -20,
    fontSize: 20,
    zIndex: 50,
  },
});
