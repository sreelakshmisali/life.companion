import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Body, Caption } from './Type';
import { IconButton } from '@/components/buttons/IconButton';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing, radius, typography } from '@/theme/tokens';

export interface EditableTextItem {
  id: string;
  text: string;
}

/**
 * Generic "list of one-line text items you can add/edit/delete" — the
 * exact same shape shows up for Daily Spark ideas, water reminder
 * messages, and the sleep ritual checklist, so it's built once here
 * instead of three times.
 */
export function EditableTextList({
  items,
  placeholder,
  emptyMessage,
  onAdd,
  onEdit,
  onRemove,
}: {
  items: EditableTextItem[];
  placeholder: string;
  emptyMessage: string;
  onAdd: (text: string) => void;
  onEdit: (id: string, text: string) => void;
  onRemove: (id: string) => void;
}) {
  const { theme } = useAppTheme();
  const [draft, setDraft] = useState('');

  const submit = () => {
    if (!draft.trim()) return;
    onAdd(draft);
    setDraft('');
  };

  return (
    <View>
      {items.length === 0 ? (
        <Caption style={{ paddingVertical: spacing.xs }}>{emptyMessage}</Caption>
      ) : (
        <View style={{ gap: 6 }}>
          {items.map((item) => (
            <Row key={item.id} item={item} onEdit={(text) => onEdit(item.id, text)} onRemove={() => onRemove(item.id)} />
          ))}
        </View>
      )}

      <View style={[styles.composer, { borderColor: theme.border, backgroundColor: theme.surfaceAlt }]}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
          onSubmitEditing={submit}
          returnKeyType="done"
          style={[styles.input, { color: theme.textPrimary, fontFamily: typography.fontFamily.body }]}
        />
        <IconButton onPress={submit} size={36} backgroundColor={theme.accent}>
          <Feather name="plus" size={16} color={theme.textOnAccent} />
        </IconButton>
      </View>
    </View>
  );
}

function Row({
  item,
  onEdit,
  onRemove,
}: {
  item: EditableTextItem;
  onEdit: (text: string) => void;
  onRemove: () => void;
}) {
  const { theme } = useAppTheme();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.text);

  const commit = () => {
    setEditing(false);
    onEdit(draft);
  };

  return (
    <View style={[styles.row, { backgroundColor: theme.surfaceAlt }]}>
      {editing ? (
        <TextInput
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={commit}
          onBlur={commit}
          autoFocus
          style={[styles.rowInput, { color: theme.textPrimary, fontFamily: typography.fontFamily.body }]}
        />
      ) : (
        <Pressable style={{ flex: 1 }} onPress={() => setEditing(true)}>
          <Body numberOfLines={2}>{item.text}</Body>
        </Pressable>
      )}
      <Pressable onPress={onRemove} hitSlop={8} style={{ marginLeft: spacing.xs }}>
        <Feather name="trash-2" size={16} color={theme.textSecondary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xs,
    borderRadius: radius.md,
  },
  rowInput: {
    flex: 1,
    fontSize: typography.size.body,
    paddingVertical: 0,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
    padding: 6,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    height: 36,
    paddingHorizontal: spacing.xs,
    fontSize: typography.size.body,
  },
});
