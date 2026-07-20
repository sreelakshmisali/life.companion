import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable, Alert, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing, radius } from '@/theme/tokens';
import { Greeting, Title, Body, Caption } from '@/components/common/Type';
import { Card } from '@/components/cards/Card';
import { Toggle } from '@/components/common/Toggle';
import { EditableTextList } from '@/components/common/EditableTextList';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { ThemePicker } from '@/theme/components/ThemePicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { APP_NAME, APP_VERSION } from '@/constants/app';
import { TAB_BAR_CLEARANCE } from '../navigation/types';

import { useNotificationPrefs } from '@/features/notifications/store/NotificationsProvider';
import { useQuotes } from '@/features/quotes/store/QuotesProvider';
import { QuotesEditableList } from '@/features/quotes/components/QuotesEditableList';
import { useSpark } from '@/features/spark/store/SparkProvider';
import { useWater } from '@/features/water/store/WaterProvider';
import { REMINDER_INTERVAL_OPTIONS } from '@/features/water/constants';
import { useSleepRitual } from '@/features/sleep/store/SleepRitualProvider';
import { useMissions } from '@/features/missions/store/MissionsProvider';
import { useTodos } from '@/features/todo/store/TodoProvider';
import { useDailyRoutine } from '@/features/settings/store/DailyRoutineProvider';
import { buildSnapshot, exportSnapshot, pickAndReadSnapshot } from '@/utils/appData';
import { useAppSnapshot } from '@/store/useAppSnapshot';

/** Collapsible-free, simple section wrapper so every block in this
 * screen — however different its content — reads as the same kind
 * of "settings card." */
function Section({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const { theme } = useAppTheme();
  return (
    <Card>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIcon, { backgroundColor: theme.accentSoft }]}>
          <Feather name={icon} size={16} color={theme.accent} />
        </View>
        <View style={{ flex: 1, marginLeft: spacing.xs }}>
          <Title>{title}</Title>
          {subtitle && <Caption style={{ marginTop: 2 }}>{subtitle}</Caption>}
        </View>
      </View>
      <View style={{ marginTop: spacing.sm }}>{children}</View>
    </Card>
  );
}

function ToggleRow({ label, value, onChange, disabled }: { label: string; value: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <View style={styles.toggleRow}>
      <Body style={{ flex: 1 }}>{label}</Body>
      <Toggle value={value} onChange={onChange} disabled={disabled} />
    </View>
  );
}

function TimePickerRow({ label, timeHHMM, onChange, disabled }: { label: string; timeHHMM: string; onChange: (v: string) => void; disabled?: boolean }) {
  const { theme } = useAppTheme();
  const [show, setShow] = useState(false);

  const [h, m] = timeHHMM.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);

  const displayTime = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  return (
    <View style={styles.timeRow}>
      <Caption style={{ flex: 1 }}>{label}</Caption>
      <Pressable onPress={() => !disabled && setShow(true)} style={[styles.timeChip, { backgroundColor: disabled ? theme.surfaceAlt : theme.surface }]}>
        <Body style={{ opacity: disabled ? 0.5 : 1 }}>{displayTime}</Body>
      </Pressable>
      {show && (
        <DateTimePicker
          value={d}
          mode="time"
          display="default"
          onChange={(event, date) => {
            setShow(false);
            if (date) {
              const hh = date.getHours().toString().padStart(2, '0');
              const mm = date.getMinutes().toString().padStart(2, '0');
              onChange(`${hh}:${mm}`);
            }
          }}
        />
      )}
    </View>
  );
}

export function SettingsScreen() {
  const { theme } = useAppTheme();
  const notifications = useNotificationPrefs();
  const quotes = useQuotes();
  const spark = useSpark();
  const water = useWater();
  const sleep = useSleepRitual();
  const missions = useMissions();
  const todos = useTodos();
  const dailyRoutine = useDailyRoutine();
  const { data: snapshotData, hydrateAll, resetAll } = useAppSnapshot();

  const [resetVisible, setResetVisible] = useState(false);
  const [importBusy, setImportBusy] = useState(false);

  const handleExport = async () => {
    const snapshot = buildSnapshot(snapshotData);
    try {
      await exportSnapshot(snapshot);
    } catch (e) {
      Alert.alert('Export failed', 'Something went wrong saving your backup. Please try again.');
    }
  };

  const handleImport = async () => {
    setImportBusy(true);
    try {
      const snapshot = await pickAndReadSnapshot();
      if (!snapshot) {
        setImportBusy(false);
        return;
      }
      hydrateAll(snapshot.data);
      Alert.alert('Backup restored', 'Your data has been imported.');
    } catch (e) {
      Alert.alert('Import failed', "That file couldn't be read as a Cozy Journal backup.");
    } finally {
      setImportBusy(false);
    }
  };

  const handleReset = () => {
    resetAll();
    setResetVisible(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <LinearGradient colors={theme.backgroundGradient} style={StyleSheet.absoluteFill} />

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: TAB_BAR_CLEARANCE }]} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Greeting style={{ fontSize: 26, lineHeight: 32 }}>Settings</Greeting>
          <Caption style={{ marginTop: 4 }}>Make it feel like yours</Caption>
        </View>

        <View style={styles.stack}>
          <Section icon="feather" title="Appearance" subtitle="Switching themes never touches your data">
            <ThemePicker />
          </Section>

          <Section icon="check-square" title="Daily Routine" subtitle="Choose what counts towards your streak">
            <ToggleRow label="Missions" value={dailyRoutine.missionsEnabled} onChange={dailyRoutine.setMissionsEnabled} />
            <ToggleRow label="Water Tracking" value={dailyRoutine.waterEnabled} onChange={dailyRoutine.setWaterEnabled} />
            <ToggleRow label="Sleep Ritual" value={dailyRoutine.sleepEnabled} onChange={dailyRoutine.setSleepEnabled} />
          </Section>

          <Section icon="bell" title="Notifications" subtitle="Gentle reminders throughout your day">
            <ToggleRow label="Enable Notifications" value={notifications.allEnabled} onChange={(v) => notifications.setPref('allEnabled', v)} />
            
            {notifications.allEnabled && !notifications.systemPermissionEnabled && (
              <View style={[styles.warningBanner, { backgroundColor: theme.accentSoft }]}>
                <Caption color={theme.accent}>⚠️ Permission disabled in system settings</Caption>
                <Pressable onPress={() => Linking.openSettings()} style={{ marginTop: spacing.xs }}>
                  <Caption color={theme.accent} style={{ textDecorationLine: 'underline' }}>Open Settings</Caption>
                </Pressable>
              </View>
            )}

            <View style={[styles.divider, { backgroundColor: theme.border, marginTop: spacing.sm, marginBottom: spacing.md }]} />
            
            <ToggleRow label="Morning Reminder" value={notifications.morningEnabled} onChange={(v) => notifications.setPref('morningEnabled', v)} disabled={!notifications.allEnabled} />
            <TimePickerRow label="Time" timeHHMM={notifications.morningTime} onChange={(v) => notifications.setPref('morningTime', v)} disabled={!notifications.allEnabled || !notifications.morningEnabled} />
            <View style={[styles.divider, { backgroundColor: theme.border, marginVertical: spacing.sm }]} />

            <ToggleRow label="Water Reminders" value={notifications.waterEnabled} onChange={(v) => notifications.setPref('waterEnabled', v)} disabled={!notifications.allEnabled} />
            <TimePickerRow label="Start Time" timeHHMM={notifications.waterStartTime} onChange={(v) => notifications.setPref('waterStartTime', v)} disabled={!notifications.allEnabled || !notifications.waterEnabled} />
            <TimePickerRow label="End Time" timeHHMM={notifications.waterEndTime} onChange={(v) => notifications.setPref('waterEndTime', v)} disabled={!notifications.allEnabled || !notifications.waterEnabled} />
            <View style={[styles.divider, { backgroundColor: theme.border, marginVertical: spacing.sm }]} />

            <ToggleRow label="Mission Reminder" value={notifications.missionsEnabled} onChange={(v) => notifications.setPref('missionsEnabled', v)} disabled={!notifications.allEnabled} />
            <TimePickerRow label="Time" timeHHMM={notifications.missionsTime} onChange={(v) => notifications.setPref('missionsTime', v)} disabled={!notifications.allEnabled || !notifications.missionsEnabled} />
            <View style={[styles.divider, { backgroundColor: theme.border, marginVertical: spacing.sm }]} />

            <ToggleRow label="Sleep Reminder" value={notifications.sleepEnabled} onChange={(v) => notifications.setPref('sleepEnabled', v)} disabled={!notifications.allEnabled} />
            <TimePickerRow label="Time" timeHHMM={notifications.sleepTime} onChange={(v) => notifications.setPref('sleepTime', v)} disabled={!notifications.allEnabled || !notifications.sleepEnabled} />
            <View style={[styles.divider, { backgroundColor: theme.border, marginVertical: spacing.sm }]} />

            <ToggleRow label="Streak Protection" value={notifications.streakEnabled} onChange={(v) => notifications.setPref('streakEnabled', v)} disabled={!notifications.allEnabled} />
            <TimePickerRow label="Time" timeHHMM={notifications.streakTime} onChange={(v) => notifications.setPref('streakTime', v)} disabled={!notifications.allEnabled || !notifications.streakEnabled} />
          </Section>

          <Section icon="message-circle" title="Quotes" subtitle="Manually added by you — no online quote API">
            <QuotesEditableList
              quotes={quotes.quotes}
              onAdd={quotes.addQuote}
              onEdit={quotes.editQuote}
              onRemove={quotes.removeQuote}
            />
          </Section>

          <Section icon="zap" title="Daily Spark" subtitle="Custom ideas for Today's Spark and Inspire Me">
            <EditableTextList
              items={spark.ideas.map((i) => ({ id: i.id, text: i.text }))}
              placeholder="New spark idea..."
              emptyMessage="No spark ideas yet."
              onAdd={spark.addIdea}
              onEdit={spark.editIdea}
              onRemove={spark.removeIdea}
            />
          </Section>

          <Section icon="droplet" title="Water reminder messages" subtitle="Custom or sassy nudges to drink water">
            <View style={styles.intervalRow}>
              <Caption>Remind me every</Caption>
              <View style={styles.chipsRow}>
                {REMINDER_INTERVAL_OPTIONS.map((mins) => {
                  const active = mins === water.reminderIntervalMinutes;
                  return (
                    <Pressable key={mins} onPress={() => water.setReminderIntervalMinutes(mins)}>
                      <View
                        style={[
                          styles.chip,
                          { backgroundColor: active ? theme.accent : theme.surfaceAlt, borderColor: active ? theme.accent : theme.border },
                        ]}
                      >
                        <Caption color={active ? theme.textOnAccent : theme.textSecondary} style={{ fontFamily: undefined }}>
                          {mins}m
                        </Caption>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border, marginVertical: spacing.sm }]} />
            <EditableTextList
              items={water.reminderMessages.map((m) => ({ id: m.id, text: m.text }))}
              placeholder="New reminder message..."
              emptyMessage="No custom messages yet."
              onAdd={water.addReminderMessage}
              onEdit={water.editReminderMessage}
              onRemove={water.removeReminderMessage}
            />
          </Section>

          <Section icon="moon" title="Sleep ritual" subtitle="Edit your bedtime checklist items">
            <EditableTextList
              items={sleep.checklist.map((i) => ({ id: i.id, text: i.label }))}
              placeholder="New checklist item..."
              emptyMessage="No checklist items yet."
              onAdd={sleep.addItem}
              onEdit={sleep.editItem}
              onRemove={sleep.removeItem}
            />
          </Section>

          <Section icon="database" title="Data" subtitle="Everything stays on this device">
            <View style={{ gap: spacing.xs }}>
              <PrimaryButton label="Export all data as JSON" onPress={handleExport} />
              <PrimaryButton label={importBusy ? 'Importing...' : 'Import backup'} onPress={handleImport} disabled={importBusy} />
              <PrimaryButton label="Reset all data" backgroundColor="#C97B7B" onPress={() => setResetVisible(true)} />
            </View>
          </Section>

          <Section icon="info" title="About">
            <Body>{APP_NAME} — version {APP_VERSION}</Body>
            <Caption style={{ marginTop: spacing.xs }}>Built with ❤️ for personal use</Caption>
          </Section>
        </View>
      </ScrollView>

      <ConfirmModal
        visible={resetVisible}
        title="Reset all data?"
        message="This clears your missions, todos, water history, quotes, spark ideas, sleep checklist, and On This Day memories. This can't be undone — consider exporting a backup first."
        confirmLabel="Reset everything"
        destructive
        onConfirm={handleReset}
        onCancel={() => setResetVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xl,
  },
  header: {
    marginTop: spacing.md,
  },
  stack: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  intervalRow: {
    gap: spacing.xs,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingLeft: spacing.md,
  },
  timeChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.sm,
  },
  warningBanner: {
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginTop: spacing.xs,
    alignItems: 'flex-start',
  },
});
