import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts as useFraunces,
  Fraunces_500Medium,
  Fraunces_600SemiBold_Italic,
} from '@expo-google-fonts/fraunces';
import {
  useFonts as useDMSans,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';

import { ThemeProvider, useAppTheme } from '@/theme/ThemeProvider';
import { MissionsProvider } from '@/features/missions/store/MissionsProvider';
import { WaterProvider } from '@/features/water/store/WaterProvider';
import { TodoProvider } from '@/features/todo/store/TodoProvider';
import { QuotesProvider } from '@/features/quotes/store/QuotesProvider';
import { SparkProvider } from '@/features/spark/store/SparkProvider';
import { SleepRitualProvider } from '@/features/sleep/store/SleepRitualProvider';
import { NotificationsProvider } from '@/features/notifications/store/NotificationsProvider';
import { DailyArchiveProvider } from '@/features/onThisDay/store/DailyArchiveProvider';
import { PersistenceGate } from '@/store/PersistenceGate';

import { HomeScreen } from '@/app/screens/HomeScreen';
import { SettingsScreen } from '@/app/screens/SettingsScreen';
import { MissionsScreen } from '@/features/missions/screens/MissionsScreen';
import { MeditationScreen } from '@/features/meditation/screens/MeditationScreen';
import { TodoScreen } from '@/features/todo/screens/TodoScreen';

import { TabBar } from '@/app/navigation/TabBar';
import { TabId, OverlayId } from '@/app/navigation/types';

SplashScreen.preventAutoHideAsync().catch(() => {});

import { StreakProvider } from '@/features/streak/store/StreakProvider';
import { DailyRoutineProvider } from '@/features/settings/store/DailyRoutineProvider';

function Root() {
  const { theme } = useAppTheme();
  const [tab, setTab] = React.useState<TabId>('home');
  const [overlay, setOverlay] = React.useState<OverlayId>(null);

  const closeOverlay = () => setOverlay(null);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />

      {/* Tab roots stay mounted-by-switch (one at a time) rather than a stack,
          matching the four-tab-only navigation model from the spec. */}
      <View style={StyleSheet.absoluteFill}>
        {tab === 'home' && (
          <HomeScreen
            onOpenMissions={() => setTab('missions')}
            onOpenMeditation={() => setTab('meditate')}
            onOpenTodos={() => setOverlay('todos')}
            onOpenSettings={() => setTab('settings')}
          />
        )}
        {tab === 'missions' && <MissionsScreen />}
        {tab === 'meditate' && <MeditationScreen />}
        {tab === 'settings' && <SettingsScreen />}
      </View>

      {/* Screens that aren't tabs of their own (Todo, trends)
          render as a full-screen takeover on top of whichever tab is
          active, and hide the tab bar while open. */}
      {overlay === 'todos' && <TodoScreen onBack={closeOverlay} />}

      {!overlay && <TabBar active={tab} onChange={setTab} />}
    </View>
  );
}

export default function App() {
  const [frauncesLoaded] = useFraunces({ Fraunces_500Medium, Fraunces_600SemiBold_Italic });
  const [dmSansLoaded] = useDMSans({ DMSans_400Regular, DMSans_500Medium, DMSans_700Bold });

  const fontsLoaded = frauncesLoaded && dmSansLoaded;

  const onLayout = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1 }} onLayout={onLayout}>
      <SafeAreaProvider>
        <ThemeProvider>
          <MissionsProvider>
            <WaterProvider>
              <TodoProvider>
                  <QuotesProvider>
                    <SparkProvider>
                      <SleepRitualProvider>
                        <DailyRoutineProvider>
                          <DailyArchiveProvider>
                            <StreakProvider>
                              <NotificationsProvider>
                                <PersistenceGate>
                                  <Root />
                                </PersistenceGate>
                              </NotificationsProvider>
                            </StreakProvider>
                          </DailyArchiveProvider>
                        </DailyRoutineProvider>
                      </SleepRitualProvider>
                    </SparkProvider>
                  </QuotesProvider>
              </TodoProvider>
            </WaterProvider>
          </MissionsProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </View>
  );
}
