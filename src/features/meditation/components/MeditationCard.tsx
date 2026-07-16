import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/cards/Card';
import { Title, Caption } from '@/components/common/Type';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/tokens';

export function MeditationCard({ onPress }: { onPress: () => void }) {
  const { theme } = useAppTheme();

  return (
    <Card onPress={onPress}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Title>Meditate</Title>
          <Caption style={{ marginTop: 2 }}>A few slow breaths, whenever you're ready</Caption>
        </View>
        <View style={styles.previewWrap}>
          <LinearGradient
            colors={theme.orbGradient}
            start={{ x: 0.2, y: 0.1 }}
            end={{ x: 0.85, y: 0.9 }}
            style={styles.previewOrb}
          />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewWrap: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  previewOrb: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
});
