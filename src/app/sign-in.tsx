import { useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export default function SignInScreen() {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(mode: 'sign-in' | 'sign-up') {
    setIsSubmitting(true);
    setError(null);
    const credentials = { email: email.trim(), password };
    const { error } =
      mode === 'sign-in'
        ? await supabase.auth.signInWithPassword(credentials)
        : await supabase.auth.signUp(credentials);
    if (error) setError(error.message);
    setIsSubmitting(false);
    // On success the AuthProvider receives the new session and the router guard redirects.
  }

  const inputStyle = [
    styles.input,
    { color: theme.text, backgroundColor: theme.backgroundElement },
  ];
  const disabled = isSubmitting || !isSupabaseConfigured;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.form}>
        <ThemedText type="subtitle">Anmelden</ThemedText>

        {!isSupabaseConfigured && (
          <ThemedText themeColor="textSecondary" testID="config-hint">
            Supabase ist nicht konfiguriert. Kopiere{' '}
            <ThemedText type="code">.env.example</ThemedText> nach{' '}
            <ThemedText type="code">.env</ThemedText> und trage URL und Key ein.
          </ThemedText>
        )}

        <TextInput
          style={inputStyle}
          placeholder="E-Mail"
          placeholderTextColor={theme.textSecondary}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={inputStyle}
          placeholder="Passwort"
          placeholderTextColor={theme.textSecondary}
          autoComplete="password"
          textContentType="password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error && (
          <ThemedText type="small" style={styles.error}>
            {error}
          </ThemedText>
        )}

        <Pressable
          accessibilityRole="button"
          disabled={disabled}
          onPress={() => submit('sign-in')}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.text },
            (pressed || disabled) && styles.dimmed,
          ]}>
          <ThemedText style={{ color: theme.background }}>Anmelden</ThemedText>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          disabled={disabled}
          onPress={() => submit('sign-up')}
          style={({ pressed }) => [styles.button, (pressed || disabled) && styles.dimmed]}>
          <ThemedText>Konto erstellen</ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  form: {
    flex: 1,
    maxWidth: MaxContentWidth / 2,
    justifyContent: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
  },
  input: {
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 16,
  },
  button: {
    alignItems: 'center',
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
  },
  dimmed: {
    opacity: 0.5,
  },
  error: {
    color: '#e5484d',
  },
});
