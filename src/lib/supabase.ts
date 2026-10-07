import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, processLock } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

// During static web rendering (`expo export`) there is no `window`, so nothing can be persisted.
const isServer = Platform.OS === 'web' && typeof window === 'undefined';

export const supabase = createClient(
  supabaseUrl ?? 'http://localhost:54321',
  supabaseKey ?? 'missing-supabase-key',
  {
    auth: {
      // Web falls back to localStorage; native needs an explicit storage adapter.
      ...(Platform.OS !== 'web' && { storage: AsyncStorage }),
      autoRefreshToken: !isServer,
      persistSession: !isServer,
      detectSessionInUrl: Platform.OS === 'web' && !isServer,
      lock: processLock,
    },
  },
);

// On native, only refresh tokens while the app is in the foreground.
// https://supabase.com/docs/reference/javascript/auth-startautorefresh
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
