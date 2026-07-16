import React from 'react';
import { Modal, View, StyleSheet, Pressable } from 'react-native';
import { Title, Body } from '@/components/common/Type';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing, radius, shadow } from '@/theme/tokens';

export function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  destructive,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { theme } = useAppTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={[styles.card, shadow.soft, { backgroundColor: theme.surface }]} onPress={() => {}}>
          <Title>{title}</Title>
          <Body style={{ marginTop: spacing.xs }}>{message}</Body>

          <View style={{ marginTop: spacing.md, gap: spacing.xs }}>
            <PrimaryButton
              label={confirmLabel}
              onPress={onConfirm}
              backgroundColor={destructive ? '#C97B7B' : undefined}
            />
            <Pressable onPress={onCancel} style={styles.cancelBtn}>
              <Body color={theme.textSecondary}>Cancel</Body>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(40, 35, 30, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  card: {
    width: '100%',
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
});
