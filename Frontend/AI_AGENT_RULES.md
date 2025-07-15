
📁 RULES.md  
(2025-07-15 – Single Source of Truth for AI/Dev Agents working on this project)

🎯 PROJECT: DHARTI – An AI-powered, voice-first digital catalog creation tool for farmers, artisans, and kirana store owners.

🤖 AI Agent Rules — Elite Full-Stack, Voice-First, Multiplatform Engineering Standards

All AI agents contributing must behave as a **world-class developer**, ensuring:
- Latest tech
- Seamless UX on low-end phones
- Multilingual voice features
- Cross-platform deliverables: APK, IPA, and PWA

---

## ⚙️ Tech Stack – July 2025 LTS

| Layer               | Tech                                  | Version        |
|--------------------|----------------------------------------|----------------|
| Language & Runtime | TypeScript (strict mode)              | ^5.5.0         |
| Mobile App         | Expo SDK 51 / React Native 0.76       | "expo": "^51"  |
| Web & PWA          | Next.js 15 (App Router)               | ^15.0.2        |
| Voice STT (offline)| Vosk-WASM                             | ^1.4.0         |
| Voice TTS          | Coqui-TTS                             | ^0.20.1        |
| State              | TanStack Query v5                     | ^5.1.2         |
| Forms              | React Hook Form                       | ^9.0.0         |
| Styling (Web)      | TailwindCSS 4 + ShadCN/ui             | ^4.0.1         |
| Styling (Mobile)   | Nativewind 3                          | ^3.0.0         |
| Translations       | react-i18next + i18next               | ^14.3.0 / ^24.0.0 |
| Gen AI             | LangChain + OpenAI                    | ^0.3 / ^0.1.0  |
| Data Layer         | Supabase (or MongoDB alt.)            | July 2025 LTS  |
| Dev Tools          | EAS CLI + GitHub Actions              | eas-cli@^4.0.0 |

---

## 🎨 Design & Theme

- Use tokens from `THEMES.md` for all spacing, colors, fonts.
- Must support **Light** and **Dark mode**.
- Color contrast must meet **WCAG 2.1 AA+**.
- Support tap targets ≥ 44×44px.

---

## 🌍 Internationalization (i18n)

- All strings fetched using `t('key')` via `react-i18next`.
- JSON translations live in `/src/locales/{lang}.json`.
- CI test fails if hardcoded text (`/[A-Za-z].*["']$/`) is committed.

---

## 🔊 Voice-First UX Rules

| Feature                  | Rule                                                                 |
|--------------------------|----------------------------------------------------------------------|
| STT                      | Vosk-WASM with hi-IN, ta-IN, en-IN support                          |
| TTS                      | Coqui-TTS or fallback to Expo Speech API                            |
| Real-Time Caption        | Show captions during voice recording                                |
| Low-Confidence Handling  | Re-prompt if confidence < 0.6                                        |
| Multilingual Switching   | Automatically match `i18n.language`                                 |

---

## 🧠 Accessibility for Low-Digital-Literacy Users

- One-task-per-screen (wizard flow).
- Font Size toggle (S/M/L/XL) via AsyncStorage.
- Visual chips/icons for product category & fields.
- Speak confirmation for every interaction (“Product added”).

---

## 📦 Mobile App Rules (Expo)

| Platform | Rules                                                                 |
|----------|-----------------------------------------------------------------------|
| Android  | Build `.apk` with EAS → Universal APK with RECORD_AUDIO permission   |
| iOS      | `.ipa` via EAS preview → install with Configurator or TestFlight     |
| General  | Managed workflow only; eject only for native module constraints      |
| Navigation | Use `react-navigation` stack (no gestures)                         |
| Safe Areas | Use `react-native-safe-area-context`                              |

---

## 🛠️ CI/CD Rules

| Action                       | Implementation                                                                 |
|-----------------------------|----------------------------------------------------------------------------------|
| Trigger                     | On push to `main` or `v*` tags                                                  |
| Platforms                   | Matrix: android-apk, ios-ipa, web-pwa                                           |
| Steps                       | `npm ci` → lint → unit tests → EAS build → artifacts                            |
| Build Profiles              | Preview profile for all builds                                                 |
| Auto Versioning             | `expo-version-bump` on every build                                              |
| Artifacts                   | Upload `.apk`, `.ipa`, and `web-dist.zip` to GitHub artifacts                   |
| Notify                      | Slack/Discord webhook with build URLs + QR codes                                |

---

### 📄 Build Workflow Snippet (`.github/workflows/build.yml`)
```yaml
on: [push, workflow_dispatch]
jobs:
  build:
    strategy:
      matrix:
        platform: [android, ios, web]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: {node-version: 20, cache: 'npm'}
      - run: npm ci
      - run: npx eas-cli login --token ${{ secrets.EXPO_TOKEN }}
      - run: npx eas-cli build --platform ${{ matrix.platform }} --profile preview --non-interactive
      - run: npx eas-cli build:list --status finished --limit 1 --json > url.json
      - run: |
          URL=$(jq -r '.[0].artifacts.buildUrl' url.json)
          curl -L "$URL" -o "VoiceCatalog-${{ matrix.platform }}.${{ matrix.platform == 'web' && 'zip' || matrix.platform == 'ios' && 'ipa' || 'apk' }}"
      - uses: actions/upload-artifact@v4
        with:
          name: "VoiceCatalog-${{ matrix.platform }}"
          path: VoiceCatalog-*
````

---


## ✅ Hackathon Deliverables

| Item                     | Status                                  |
| ------------------------ | --------------------------------------- |
| 📲 `VoiceCatalog.apk` QR | Must be generated                       |
| 🍏 `VoiceCatalog.ipa` QR | Must be generated                       |
| 🌐 Web PWA link          | Live on Cloud Run                       |
| 🎞️ Demo Script          | Voice add (Hindi) → Offline → Sync      |
| 🗂️ One-command Setup    | `pnpm i && pnpm dev`                    |
| 🧾 README + THEMES.md    | Included                                |
| 🎤 Whisper Demo          | Offline speech input working            |
| 🧠 AI Response Examples  | Included for Hindi, Tamil, and Hinglish |

---

## 🌟 Bonus Points / Wow Factors

* 📶 Offline-First: Full product creation even without internet.
* 📞 WhatsApp Bot: Add product via voice note → auto cataloged.
* 📊 Recharts Dashboard: Live “Top 5 Added Products Today”.
* 📷 AR Scan: Scan mango → auto-detects & catalogs category.
* 🧠 AI Price Suggestion: Suggest based on mandi rates.

---

### Final Rule:

> **"Every contributor (human or AI) must follow this `AI_AGENT_RULES.md` as the gospel. All code, UI, APIs, CI, and builds must adhere to these standards for consistency, clarity, and quality. No shortcuts. No regressions. No ego. Ship it." 🚀**

```
