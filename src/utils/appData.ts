import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { BACKUP_FORMAT_VERSION } from '@/constants/app';

export interface AppDataSnapshot {
  formatVersion: number;
  exportedAt: string;
  data: Record<string, unknown>;
}

export function buildSnapshot(data: Record<string, unknown>): AppDataSnapshot {
  return {
    formatVersion: BACKUP_FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    data,
  };
}

/**
 * Writes the snapshot to a temp file and opens the system share sheet so
 * the user can save it wherever they like (Files, Drive, AirDrop, etc.) —
 * there's no backend, so "export" just means "hand me the file."
 */
export async function exportSnapshot(snapshot: AppDataSnapshot): Promise<void> {
  const fileName = `cozy-journal-backup-${new Date().toISOString().slice(0, 10)}.json`;
  const file = new File(Paths.cache, fileName);

  if (file.exists) file.delete();
  file.create();
  file.write(JSON.stringify(snapshot, null, 2));

  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(file.uri, {
      mimeType: 'application/json',
      dialogTitle: 'Save your Cozy Journal backup',
      UTI: 'public.json',
    });
  }
}

/**
 * Opens the document picker for a .json file, reads and parses it.
 * Returns null if the user cancels or the file isn't valid JSON.
 */
export async function pickAndReadSnapshot(): Promise<AppDataSnapshot | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'application/json',
    copyToCacheDirectory: true,
  });

  if (result.canceled || !result.assets?.[0]) return null;

  const picked = new File(result.assets[0].uri);
  const text = await picked.text();

  try {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== 'object' || !('data' in parsed)) return null;
    return parsed as AppDataSnapshot;
  } catch {
    return null;
  }
}
