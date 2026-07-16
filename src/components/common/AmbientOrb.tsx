import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/theme/ThemeProvider';

/**
 * The signature moment of the home screen: a soft, slow-breathing
 * gradient orb that sits behind the greeting. It scales and fades
 * on an 8s cycle — slow enough to feel alive, never distracting.
 */
export function AmbientOrb({ size = 260 }: { size?: number }) {
  const { theme } = useAppTheme();
  const breathe = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breathe, {
          toValue: 0,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [breathe]);

  const scale = breathe.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1.05] });
  const opacity = breathe.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0.85] });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.wrap,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          transform: [{ scale }],
          opacity,
        },
      ]}
    >
      <LinearGradient
        colors={theme.orbGradient}
        start={{ x: 0.15, y: 0.1 }}
        end={{ x: 0.9, y: 0.95 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: -60,
    alignSelf: 'center',
  },
});
