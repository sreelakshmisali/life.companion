import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Body, Caption } from '@/components/common/Type';
import { IconButton } from '@/components/buttons/IconButton';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing, radius, typography } from '@/theme/tokens';
import { QuoteItem } from '../types';

export function QuotesEditableList({
  quotes,
  onAdd,
  onEdit,
  onRemove,
}: {
  quotes: QuoteItem[];
  onAdd: (quote: string, author: string) => void;
  onEdit: (id: string, quote: string, author: string) => void;
  onRemove: (id: string) => void;
}) {
  const { theme } = useAppTheme();
  const [quoteDraft, setQuoteDraft] = useState('');
  const [authorDraft, setAuthorDraft] = useState('');

  const submit = () => {
    if (!quoteDraft.trim()) return;
    onAdd(quoteDraft, authorDraft);
    setQuoteDraft('');
    setAuthorDraft('');
  };

  return (
    <View>
      {quotes.length === 0 ? (
        <Caption style={{ paddingVertical: spacing.xs }}>No quotes yet. Add one below.</Caption>
      ) : (
        <View style={{ gap: 6 }}>
          {quotes.map((q) => (
            <QuoteRow
              key={q.id}
              quote={q}
              onEdit={(quote, author) => onEdit(q.id, quote, author)}
              onRemove={() => onRemove(q.id)}
            />
          ))}
        </View>
      )}

      <View style={[styles.composer, { borderColor: theme.border, backgroundColor: theme.surfaceAlt }]}>
        <TextInput
          value={quoteDraft}
          onChangeText={setQuoteDraft}
          placeholder="New quote..."
          placeholderTextColor={theme.textSecondary}
          multiline
          style={[styles.quoteInput, { color: theme.textPrimary, fontFamily: typography.fontFamily.body }]}
        />
        <View style={styles.authorRow}>
          <TextInput
            value={authorDraft}
            onChangeText={setAuthorDraft}
            placeholder="Author (optional)"
            placeholderTextColor={theme.textSecondary}
            onSubmitEditing={submit}
            returnKeyType="done"
            style={[styles.authorInput, { color: theme.textPrimary, fontFamily: typography.fontFamily.body }]}
          />
          <IconButton onPress={submit} size={36} backgroundColor={theme.accent}>
            <Feather name="plus" size={16} color={theme.textOnAccent} />
          </IconButton>
        </View>
      </View>
    </View>
  );
}

function QuoteRow({
  quote,
  onEdit,
  onRemove,
}: {
  quote: QuoteItem;
  onEdit: (quote: string, author: string) => void;
  onRemove: () => void;
}) {
  const { theme } = useAppTheme();
  const [editing, setEditing] = useState(false);
  const [quoteDraft, setQuoteDraft] = useState(quote.quote);
  const [authorDraft, setAuthorDraft] = useState(quote.author);

  const commit = () => {
    setEditing(false);
    onEdit(quoteDraft, authorDraft);
  };

  return (
    <View style={[styles.row, { backgroundColor: theme.surfaceAlt }]}>
      {editing ? (
        <View style={{ flex: 1 }}>
          <TextInput
            value={quoteDraft}
            onChangeText={setQuoteDraft}
            multiline
            style={[styles.rowInput, { color: theme.textPrimary, fontFamily: typography.fontFamily.body }]}
          />
          <TextInput
            value={authorDraft}
            onChangeText={setAuthorDraft}
            onBlur={commit}
            onSubmitEditing={commit}
            autoFocus
            style={[
              styles.rowInput,
              { color: theme.textSecondary, marginTop: 4, fontFamily: typography.fontFamily.body },
            ]}
          />
        </View>
      ) : (
        <Pressable style={{ flex: 1 }} onPress={() => setEditing(true)}>
          <Body style={{ fontStyle: 'italic' }} numberOfLines={3}>
            “{quote.quote}”
          </Body>
          <Caption style={{ marginTop: 2 }}>— {quote.author}</Caption>
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
    alignItems: 'flex-start',
    padding: spacing.xs,
    borderRadius: radius.md,
  },
  rowInput: {
    fontSize: typography.size.body,
    paddingVertical: 0,
  },
  composer: {
    marginTop: spacing.xs,
    padding: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
  quoteInput: {
    fontSize: typography.size.body,
    minHeight: 40,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  authorInput: {
    flex: 1,
    height: 36,
    paddingHorizontal: spacing.xs,
    fontSize: typography.size.caption,
  },
});
