import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Caption } from './Type';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing, radius } from '@/theme/tokens';

export function WeatherChip({ temp, condition }: { temp: string; condition: string }) {
  const { theme } = useAppTheme();
  const iconName = condition === 'rainy' ? 'cloud-rain' : condition === 'cloudy' ? 'cloud' : 'sun';
  return (
    <View style={[styles.weatherWrap, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Feather name={iconName as any} size={16} color={theme.accent} />
      <Caption color={theme.textPrimary} style={{ marginLeft: 6 }}>
        {temp}
      </Caption>
    </View>
  );
}

const styles = StyleSheet.create({
  weatherWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
});
