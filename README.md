# Expo + Supabase Boilerplate

Vorlage für Apps, die aus **einer Codebasis** im **Web** und auf **iOS** laufen (Android funktioniert ebenfalls).

| Bereich      | Technologie                                                        |
| ------------ | ------------------------------------------------------------------ |
| Framework    | [Expo](https://expo.dev) SDK 57, React Native, React 19 + Compiler |
| Routing      | Expo Router (dateibasiert, typisierte Routen)                      |
| Web          | react-native-web, statischer Export                                |
| Backend/Auth | [Supabase](https://supabase.com) (E-Mail + Passwort)               |
| Qualität     | TypeScript (strict), ESLint, Prettier, Jest + Testing Library      |
| Builds       | EAS Build / Submit / Update                                        |
| KI           | `CLAUDE.md`/`AGENTS.md`, SessionStart-Hook für Claude Code         |

## Loslegen

```bash
npm install
cp .env.example .env   # Supabase-URL und Publishable/Anon-Key eintragen
npm run web            # im Browser
npm run ios            # iOS-Simulator (macOS) oder Expo Go per QR-Code
```

Ohne `.env` startet die App trotzdem und zeigt auf dem Login-Screen einen Hinweis zur Einrichtung.

## Scripts

| Befehl              | Zweck                                        |
| ------------------- | -------------------------------------------- |
| `npm start`         | Dev-Server (iOS, Android, Web)               |
| `npm run check`     | Lint + Typecheck + Format-Check + Tests (CI) |
| `npm test`          | Jest-Tests                                   |
| `npm run format`    | Code formatieren                             |
| `npm run build:web` | Statischer Web-Build nach `dist/`            |
| `npm run doctor`    | Expo-Konfiguration prüfen                    |

## Struktur

```
src/
  app/                 Routen (Expo Router)
    _layout.tsx        Root-Layout, schützt Routen je nach Login-Status
    sign-in.tsx        Login / Registrierung
    (tabs)/            Bereich für eingeloggte Nutzer
  components/          Wiederverwendbare UI (ThemedText, ThemedView, …)
  constants/theme.ts   Farben (Light/Dark), Abstände, Fonts
  lib/supabase.ts      Supabase-Client
  providers/           React-Context (AuthProvider, useAuth)
__tests__/             Tests
```

## Neues Projekt aus der Vorlage

1. Repo kopieren (oder auf GitHub als Template-Repository markieren).
2. In `app.json` `name`, `slug`, `scheme`, `ios.bundleIdentifier` und `android.package` anpassen.
3. App-Icons und Splash-Screen in `assets/` ersetzen.
4. Supabase-Projekt anlegen und `.env` befüllen. Für jede Tabelle **Row Level Security** aktivieren.

## Deployment

**Web:** `npm run build:web` erzeugt statische Dateien in `dist/`, die sich auf jedem Static Host deployen lassen (Vercel, Netlify, Cloudflare Pages, EAS Hosting: `npx eas-cli@latest deploy`). Die `EXPO_PUBLIC_*`-Variablen müssen beim Build gesetzt sein.

**iOS** (kein Mac nötig, Apple Developer Account erforderlich):

```bash
npx eas-cli@latest login
npx eas-cli@latest init                                   # verknüpft das Projekt mit EAS
npx eas-cli@latest env:create                             # EXPO_PUBLIC_* für die Builds hinterlegen
npx eas-cli@latest build --platform ios --profile development   # Dev-Build für Simulator
npx eas-cli@latest build --platform ios --profile production
npx eas-cli@latest submit --platform ios                  # Upload zu App Store Connect / TestFlight
```

Die Profile stehen in `eas.json`. Kleine JS-Änderungen lassen sich ohne neuen App-Store-Review per `eas update` ausliefern.

## Arbeiten mit Claude Code

- `CLAUDE.md` verweist auf `AGENTS.md`. Dort stehen Projektstruktur, Befehle und Regeln für KI-Agenten.
- `.claude/settings.json` aktiviert das offizielle Expo-Plugin, erlaubt die Prüf-Befehle ohne Nachfrage und installiert in Cloud-Sessions automatisch die Abhängigkeiten.
- Gib Claude Aufgaben am besten mit dem Hinweis, am Ende `npm run check` auszuführen.
