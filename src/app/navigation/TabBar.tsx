import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing, radius, shadow } from '@/theme/tokens';
import { Caption } from '@/components/common/Type';
import { TabId } from './types';

interface TabDef {
  id: TabId;
  label: string;
  renderIcon: (color: string, size: number) => React.ReactNode;
}

const TABS: TabDef[] = [
  { id: 'home', label: 'Home', renderIcon: (color, size) => <Feather name="home" size={size} color={color} /> },
  {
    id: 'missions',
    label: 'Missions',
    renderIcon: (color, size) => <Feather name="check-circle" size={size} color={color} />,
  },
  {
    id: 'mind',
    label: 'Mind',
    renderIcon: (color, size) => <MaterialCommunityIcons name="meditation" size={size} color={color} />,
  },
  {
    id: 'settings',
    label: 'Settings',
    renderIcon: (color, size) => <Feather name="settings" size={size} color={color} />,
  },
];

function TabItem({ tab, active, onPress }: { tab: TabDef; active: boolean; onPress: () => void }) {
  const { theme } = useAppTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.9, useNativeDriver: true, speed: 40, bounciness: 6 }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 24, bounciness: 8 }).start();

  return (
    <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} style={styles.itemTouchArea} hitSlop={4}>
      <Animated.View
        style={[
          styles.pill,
          {
            backgroundColor: active ? theme.accentSoft : 'transparent',
            transform: [{ scale }],
          },
        ]}
      >
        {tab.renderIcon(active ? theme.accent : theme.textSecondary, 20)}
        <Caption color={active ? theme.accent : theme.textSecondary} style={{ marginTop: 2, fontSize: 11, lineHeight: 14 }}>
          {tab.label}
        </Caption>
      </Animated.View>
    </Pressable>
  );
}

export function TabBar({ active, onChange }: { active: TabId; onChange: (id: TabId) => void }) {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, spacing.xs) }]} pointerEvents="box-none">
      <View style={[styles.bar, shadow.soft, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        {TABS.map((tab) => (
          <TabItem key={tab.id} tab={tab} active={tab.id === active} onPress={() => onChange(tab.id)} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.sm,
  },
  bar: {
    flexDirection: 'row',
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingVertical: spacing.xs,
    paddingHorizontal: 4,
  },
  itemTouchArea: {
    flex: 1,
    alignItems: 'center',
  },
  pill: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: radius.md,
  },
});
