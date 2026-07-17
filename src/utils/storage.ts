import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppDataSnapshot } from './appData';

/**
 * Thin wrapper around AsyncStorage for the single app-wide snapshot.
 * Reuses the same AppDataSnapshot shape as export/import, so "persistence"
 * and "backup file" are really the same serialization with two destinations.
 */
export async function readStoredSnapshot(key: string): Promise<AppDataSnapshot | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !('data' in parsed)) return null;
    return parsed as AppDataSnapshot;
  } catch {
    // Corrupt or unreadable storage shouldn't crash app start — fall back
    // to defaults, same as a first launch.
    return null;
  }
}

export async function writeStoredSnapshot(key: string, snapshot: AppDataSnapshot): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(snapshot));
  } catch {
    // Best-effort — a failed autosave shouldn't surface as a user-facing
    // error the way a failed manual export/import does.
  }
}
