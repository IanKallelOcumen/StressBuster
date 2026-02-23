import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import React from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';

// Import providers from the tabs index (they're defined there)
// We'll need to move them here eventually, but for now we'll import
export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  // #region agent log
  console.log('[DEBUG] app/_layout.tsx: RootLayout rendering', Date.now());
  fetch('http://127.0.0.1:7691/ingest/81e03e83-1ede-486a-a58e-379015d4d35e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'0dc834'},body:JSON.stringify({sessionId:'0dc834',location:'app/_layout.tsx:15',message:'RootLayout rendering',data:{timestamp:Date.now()},runId:'run1',hypothesisId:'D'})}).catch((e)=>console.error('[DEBUG] Fetch error:',e));
  // #endregion
  const colorScheme = useColorScheme();
  // #region agent log
  console.log('[DEBUG] app/_layout.tsx: colorScheme resolved', {colorScheme});
  fetch('http://127.0.0.1:7691/ingest/81e03e83-1ede-486a-a58e-379015d4d35e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'0dc834'},body:JSON.stringify({sessionId:'0dc834',location:'app/_layout.tsx:18',message:'RootLayout colorScheme resolved',data:{colorScheme},runId:'run1',hypothesisId:'D'})}).catch((e)=>console.error('[DEBUG] Fetch error:',e));
  // #endregion

  return (
    <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </NavigationThemeProvider>
  );
}