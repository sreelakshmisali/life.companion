import React, { useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing, radius, buttonHeight, typography } from '@/theme/tokens';
import { Greeting, Body, Caption } from '@/components/common/Type';
import { Card } from '@/components/cards/Card';
import { EmptyState } from '@/components/common/EmptyState';
import { IconButton } from '@/components/buttons/IconButton';
import { useMissions } from '../store/MissionsProvider';
import { Mission } from '../types';
import { TAB_BAR_CLEARANCE } from '@/app/navigation/types';

function MissionRow({
  mission,
  onToggle,
  onSave,
  onDelete,
}: {
  mission: Mission;
  onToggle: () => void;
  onSave: (label: string) => void;
  onDelete: () => void;
}) {
  const { theme } = useAppTheme();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(mission.label);
  const revealX = useRef(new Animated.Value(0)).current;
  const [revealed, setRevealed] = useState(false);

  const toggleReveal = () => {
    const next = !revealed;
    setRevealed(next);
    Animated.spring(revealX, {
      toValue: next ? 1 : 0,
      useNativeDriver: true,
      speed: 24,
      bounciness: 6,
    }).start();
  };

  const translateX = revealX.interpolate({ inputRange: [0, 1], outputRange: [0, -64] });

  const commitEdit = () => {
    setEditing(false);
    onSave(draft);
  };

  return (
    <View style={styles.rowWrap}>
      <Pressable
        onPress={onDelete}
        style={[styles.deleteBtn, { backgroundColor: '#E3B8B4' }]}
      >
        <Feather name="trash-2" size={18} color="#5C4A48" />
      </Pressable>

      <Animated.View
        style={[
          styles.rowSurface,
          { backgroundColor: theme.surface, transform: [{ translateX }] },
        ]}
      >
        <Pressable onPress={onToggle} hitSlop={8}>
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
        </Pressable>

        {editing ? (
          <TextInput
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={commitEdit}
            onBlur={commitEdit}
            autoFocus
            style={[
              styles.editInput,
              { color: theme.textPrimary, fontFamily: typography.fontFamily.body },
            ]}
          />
        ) : (
          <Pressable style={{ flex: 1 }} onPress={() => setEditing(true)} onLongPress={toggleReveal}>
            <Body
              style={{ textDecorationLine: mission.done ? 'line-through' : 'none' }}
              color={mission.done ? theme.textSecondary : theme.textPrimary}
            >
              {mission.label}
            </Body>
          </Pressable>
        )}

        <Pressable onPress={toggleReveal} hitSlop={8}>
          <Feather name="more-horizontal" size={18} color={theme.textSecondary} />
        </Pressable>
      </Animated.View>
    </View>
  );
}

export function MissionsScreen({ onBack }: { onBack?: () => void }) {
  const { theme } = useAppTheme();
  const { missions, toggleMission, addMission, editMission, removeMission } = useMissions();
  const [draft, setDraft] = useState('');

  const doneCount = missions.filter((m) => m.done).length;

  const submit = () => {
    if (!draft.trim()) return;
    addMission(draft);
    setDraft('');
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <LinearGradient colors={theme.backgroundGradient} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        {onBack && (
          <IconButton onPress={onBack} backgroundColor={theme.surface} style={{ marginRight: spacing.sm }}>
            <Feather name="arrow-left" size={18} color={theme.textPrimary} />
          </IconButton>
        )}
        <View style={{ flex: 1 }}>
          <Greeting style={{ fontSize: 26, lineHeight: 32 }}>Your missions</Greeting>
          <Caption style={{ marginTop: 2 }}>
            {doneCount} of {missions.length} done today
          </Caption>
        </View>
      </View>

      {/* KeyboardAvoidingView scoped to just the scroll + composer, below the
          fixed header, so it only pushes up the content that actually needs
          to move. 'height' on Android (not 'undefined') is what makes the
          composer track the keyboard there — iOS uses 'padding' as usual. */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {missions.length === 0 ? (
            <Card>
              <EmptyState message={"No missions yet.\nLet's plant your first little habit."} />
            </Card>
          ) : (
            <View style={{ gap: spacing.xs }}>
              {missions.map((m) => (
                <MissionRow
                  key={m.id}
                  mission={m}
                  onToggle={() => toggleMission(m.id)}
                  onSave={(label) => editMission(m.id, label)}
                  onDelete={() => removeMission(m.id)}
                />
              ))}
            </View>
          )}
          <Caption style={{ marginTop: spacing.sm, textAlign: 'center' }}>
            Tap a mission to rename it. Tap ⋯ or hold to delete.
          </Caption>
        </ScrollView>

        <View style={[styles.composer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Add a little habit..."
            placeholderTextColor={theme.textSecondary}
            onSubmitEditing={submit}
            returnKeyType="done"
            style={[
              styles.composerInput,
              { color: theme.textPrimary, fontFamily: typography.fontFamily.body },
            ]}
          />
          <IconButton onPress={submit} size={buttonHeight.default} backgroundColor={theme.accent}>
            <Feather name="plus" size={20} color={theme.textOnAccent} />
          </IconButton>
        </View>
      </KeyboardAvoidingView>
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
  scroll: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xl,
  },
  rowWrap: {
    position: 'relative',
  },
  deleteBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 64,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowSurface: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
    borderRadius: radius.lg,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editInput: {
    flex: 1,
    fontSize: typography.size.body,
    paddingVertical: 0,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginHorizontal: spacing.sm,
    marginBottom: TAB_BAR_CLEARANCE - spacing.md,
    padding: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
  composerInput: {
    flex: 1,
    height: buttonHeight.default,
    paddingHorizontal: spacing.xs,
    fontSize: typography.size.body,
  },
});
