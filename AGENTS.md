This is an Expo/React Native boilerplate that ships to **iOS and the web** from one codebase, with **Supabase** for auth and data. Prioritize mobile-first patterns, performance, and cross-platform compatibility — every screen must work on both iOS and web.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
npm test                    # jest-expo + React Native Testing Library
npm run check               # lint + typecheck + format check + tests (same as CI)
npm run build:web           # static web export into dist/
```

Run `npm run check` before declaring any task done. For UI changes, also run `npm run build:web` and check the result in a browser.

## Project structure

- `src/app/` — routes (Expo Router). `_layout.tsx` guards routes with `Stack.Protected` based on the Supabase session: signed-in users see `(tabs)/`, everyone else `sign-in.tsx`.
- `src/lib/supabase.ts` — the single Supabase client. Import it from here; never create another client.
- `src/providers/auth-provider.tsx` — `useAuth()` returns `{ session, isLoading }`.
- `src/components/`, `src/hooks/`, `src/constants/theme.ts` — shared UI, theme colors and spacing. Use `ThemedText`/`ThemedView` and `useTheme()` instead of hard-coded colors so light and dark mode keep working.
- Platform-specific files use the `.web.tsx` / `.ios.tsx` suffix (see `app-tabs.tsx` vs `app-tabs.web.tsx`).
- `__tests__/` — Jest tests. Mock `@/lib/supabase` in tests; never hit a real backend.

## Environment & secrets

- Config lives in `.env` (copy `.env.example`). `EXPO_PUBLIC_*` variables are inlined into the client bundle, so only public values (Supabase URL, publishable/anon key) go there. Never put a Supabase service-role key or other secret in the app.
- Data access is secured by Supabase Row Level Security — every new table needs RLS policies.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md
