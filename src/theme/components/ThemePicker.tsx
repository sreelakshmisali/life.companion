import React from 'react';
import { ScrollView, Pressable, View, StyleSheet } from 'react-native';
import { Caption } from '@/components/common/Type';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing, radius } from '@/theme/tokens';

export function ThemePicker() {
  const { allThemes, themeId, setThemeId, theme } = useAppTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {allThemes.map((t) => {
        const active = t.id === themeId;
        return (
          <Pressable key={t.id} onPress={() => setThemeId(t.id)}>
            <View
              style={[
                styles.chip,
                {
                  backgroundColor: active ? theme.accentSoft : theme.surface,
                  borderColor: active ? theme.accent : theme.border,
                },
              ]}
            >
              <Caption style={{ fontSize: 15 }}>{t.emoji}</Caption>
              <Caption color={active ? theme.accent : theme.textSecondary} style={{ marginLeft: 4 }}>
                {t.label}
              </Caption>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.xs,
    paddingRight: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
});
