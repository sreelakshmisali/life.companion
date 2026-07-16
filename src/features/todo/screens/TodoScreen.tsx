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
import { useTodos } from '../store/TodoProvider';
import { TodoItem, TodoPriority } from '../types';
import { PRIORITIES } from '../constants';
import { PriorityDot, PriorityTag } from '../components/PriorityTag';

type Filter = 'active' | 'all' | 'done';

function TodoRow({
  todo,
  onToggle,
  onSave,
  onDelete,
}: {
  todo: TodoItem;
  onToggle: () => void;
  onSave: (label: string) => void;
  onDelete: () => void;
}) {
  const { theme } = useAppTheme();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.label);
  const revealX = useRef(new Animated.Value(0)).current;
  const [revealed, setRevealed] = useState(false);

  const toggleReveal = () => {
    const next = !revealed;
    setRevealed(next);
    Animated.spring(revealX, { toValue: next ? 1 : 0, useNativeDriver: true, speed: 24, bounciness: 6 }).start();
  };

  const translateX = revealX.interpolate({ inputRange: [0, 1], outputRange: [0, -64] });

  const commitEdit = () => {
    setEditing(false);
    onSave(draft);
  };

  return (
    <View style={styles.rowWrap}>
      <Pressable onPress={onDelete} style={[styles.deleteBtn, { backgroundColor: '#E3B8B4' }]}>
        <Feather name="trash-2" size={18} color="#5C4A48" />
      </Pressable>

      <Animated.View style={[styles.rowSurface, { backgroundColor: theme.surface, transform: [{ translateX }] }]}>
        <Pressable onPress={onToggle} hitSlop={8}>
          <View
            style={[
              styles.checkbox,
              {
                borderColor: todo.done ? theme.accent : theme.border,
                backgroundColor: todo.done ? theme.accent : 'transparent',
              },
            ]}
          >
            {todo.done && <Feather name="check" size={14} color={theme.textOnAccent} />}
          </View>
        </Pressable>

        <View style={{ flex: 1 }}>
          {editing ? (
            <TextInput
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={commitEdit}
              onBlur={commitEdit}
              autoFocus
              style={[styles.editInput, { color: theme.textPrimary, fontFamily: typography.fontFamily.body }]}
            />
          ) : (
            <Pressable onPress={() => setEditing(true)} onLongPress={toggleReveal}>
              <Body
                style={{ textDecorationLine: todo.done ? 'line-through' : 'none' }}
                color={todo.done ? theme.textSecondary : theme.textPrimary}
              >
                {todo.label}
              </Body>
            </Pressable>
          )}
          {!todo.done && (
            <View style={{ marginTop: 6 }}>
              <PriorityTag priority={todo.priority} />
            </View>
          )}
        </View>

        <Pressable onPress={toggleReveal} hitSlop={8}>
          <Feather name="more-horizontal" size={18} color={theme.textSecondary} />
        </Pressable>
      </Animated.View>
    </View>
  );
}

function FilterTabs({ filter, onChange, counts }: { filter: Filter; onChange: (f: Filter) => void; counts: Record<Filter, number> }) {
  const { theme } = useAppTheme();
  const tabs: { id: Filter; label: string }[] = [
    { id: 'active', label: 'Active' },
    { id: 'all', label: 'All' },
    { id: 'done', label: 'Done' },
  ];

  return (
    <View style={styles.tabsRow}>
      {tabs.map((t) => {
        const active = t.id === filter;
        return (
          <Pressable key={t.id} onPress={() => onChange(t.id)} style={{ flex: 1 }}>
            <View
              style={[
                styles.tab,
                { backgroundColor: active ? theme.accent : theme.surface, borderColor: active ? theme.accent : theme.border },
              ]}
            >
              <Caption color={active ? theme.textOnAccent : theme.textSecondary} style={{ fontFamily: undefined }}>
                {t.label} ({counts[t.id]})
              </Caption>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

export function TodoScreen({ onBack }: { onBack: () => void }) {
  const { theme } = useAppTheme();
  const { todos, activeTodos, completedTodos, addTodo, toggleTodo, editTodo, removeTodo } = useTodos();
  const [draft, setDraft] = useState('');
  const [priority, setPriority] = useState<TodoPriority>('medium');
  const [filter, setFilter] = useState<Filter>('active');

  const submit = () => {
    if (!draft.trim()) return;
    addTodo(draft, priority);
    setDraft('');
  };

  const visible = filter === 'active' ? activeTodos : filter === 'done' ? completedTodos : todos;
  const counts: Record<Filter, number> = { active: activeTodos.length, all: todos.length, done: completedTodos.length };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <LinearGradient colors={theme.backgroundGradient} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <IconButton onPress={onBack} backgroundColor={theme.surface}>
          <Feather name="arrow-left" size={18} color={theme.textPrimary} />
        </IconButton>
        <View style={{ flex: 1, marginLeft: spacing.sm }}>
          <Greeting style={{ fontSize: 26, lineHeight: 32 }}>To-do</Greeting>
          <Caption style={{ marginTop: 2 }}>{activeTodos.length} things on your plate</Caption>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        <View style={{ paddingHorizontal: spacing.sm }}>
          <FilterTabs filter={filter} onChange={setFilter} counts={counts} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {visible.length === 0 ? (
            <Card>
              <EmptyState
                emoji="📝"
                message={
                  filter === 'done'
                    ? "Nothing finished yet.\nThat's alright, no rush."
                    : "Nothing here.\nAdd your first to-do below."
                }
              />
            </Card>
          ) : (
            <View style={{ gap: spacing.xs }}>
              {visible.map((t) => (
                <TodoRow
                  key={t.id}
                  todo={t}
                  onToggle={() => toggleTodo(t.id)}
                  onSave={(label) => editTodo(t.id, label)}
                  onDelete={() => removeTodo(t.id)}
                />
              ))}
            </View>
          )}
        </ScrollView>

        <View style={styles.composerWrap}>
          <View style={styles.priorityRow}>
            {PRIORITIES.map((p) => {
              const active = p.id === priority;
              return (
                <Pressable key={p.id} onPress={() => setPriority(p.id)} style={styles.priorityPick}>
                  <View
                    style={[
                      styles.priorityDotWrap,
                      { borderColor: active ? p.color : theme.border, backgroundColor: active ? p.softColor : 'transparent' },
                    ]}
                  >
                    <PriorityDot priority={p.id} size={10} />
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View style={[styles.composer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Add a to-do..."
              placeholderTextColor={theme.textSecondary}
              onSubmitEditing={submit}
              returnKeyType="done"
              style={[styles.composerInput, { color: theme.textPrimary, fontFamily: typography.fontFamily.body }]}
            />
            <IconButton onPress={submit} size={buttonHeight.default} backgroundColor={theme.accent}>
              <Feather name="plus" size={20} color={theme.textOnAccent} />
            </IconButton>
          </View>
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
  tabsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  tab: {
    paddingVertical: 10,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    alignItems: 'center',
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
  composerWrap: {
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.md,
  },
  priorityRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  priorityPick: {
    padding: 2,
  },
  priorityDotWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
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
