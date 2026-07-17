import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useAppTheme } from '@/theme/ThemeProvider';
import { STORAGE_KEY, BACKUP_FORMAT_VERSION } from '@/constants/app';
import { readStoredSnapshot, writeStoredSnapshot } from '@/utils/storage';
import { useAppSnapshot } from './useAppSnapshot';

const AUTOSAVE_DEBOUNCE_MS = 500;

/**
 * Sits just inside every provider. On mount it loads whatever was saved
 * last session and replays it through the same `hydrate` / `replaceAll`
 * methods that back import — so persistence and "restore a backup" are
 * the same code path. Once hydrated, it renders the real app and quietly
 * autosaves a debounced snapshot on every change.
 *
 * Children aren't rendered until hydration finishes, so nothing flashes
 * mock/default data before real data loads.
 */
export function PersistenceGate({ children }: { children: React.ReactNode }) {
  const { theme } = useAppTheme();
  const { data, hydrateAll } = useAppSnapshot();

  const [hydrated, setHydrated] = useState(false);
  const skipNextSaveRef = useRef(true); // the load-triggered render shouldn't immediately re-save
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load once on mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await readStoredSnapshot(STORAGE_KEY);
      if (!cancelled && stored?.data) {
        hydrateAll(stored.data);
      }
      if (!cancelled) setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
    // Intentionally run once — hydrateAll's identity can change with provider
    // state, but re-hydrating on every render would fight the autosave below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced autosave whenever any persisted slice changes.
  useEffect(() => {
    if (!hydrated) return;
    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      writeStoredSnapshot(STORAGE_KEY, {
        formatVersion: BACKUP_FORMAT_VERSION,
        exportedAt: new Date().toISOString(),
        data,
      });
    }, AUTOSAVE_DEBOUNCE_MS);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, hydrated]);

  if (!hydrated) {
    // Bare, themed background only — avoids a flash of default/mock content
    // before stored data is applied. Font/splash gating in App.tsx already
    // covers the frame before this point, so this is typically instant.
    return <View style={{ flex: 1, backgroundColor: theme.background }} />;
  }

  return <>{children}</>;
}
