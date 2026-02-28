# Gemini API & app sanity check

**Date:** 2025-02-19

## 1. API & key

- **Request:** `POST .../models/gemini-2.5-flash:generateContent` with a small text prompt.
- **Result:** HTTP **429** (RESOURCE_EXHAUSTED – quota exceeded), **not** 401/403.
- **Conclusion:** Endpoint and **API key are valid**. The key is accepted; the only issue is **free-tier quota** (limits or exceeded; retry in ~40s).

## 2. App setup

| Check | Status |
|-------|--------|
| Metro mock for `@google/generative-ai` | **Disabled** (real SDK used) – `metro.config.js` ~L149 |
| Gemini key source | `app.config.js` → `getGeminiApiKey()` (decrypts `GEMINI_API_KEY_ENCRYPTED` from `.env`) |
| Key passed to app | `expoConfig.extra.geminiApiKey` |
| AIChatScreen | Uses `GoogleGenerativeAI` and `getGeminiModel()` with key from config |
| Model IDs | `gemini-2.5-flash`, `gemini-2.5-flash-lite`, `gemini-flash-latest`, `gemini-pro-latest` (2.0 retired June 2026) |

So: **code and API are correctly set up.** When quota allows, Zen chat should return real conversational replies.

## 3. If Zen still fails

- **429 / quota:** Wait a minute and try again, or check [Gemini API quotas](https://ai.google.dev/gemini-api/docs/rate-limits) and billing.
- **Same generic line / JSON:** Restart Expo with cache clear: `npx expo start --web --clear` so Metro doesn’t use any old mock.
- **Other errors:** Check browser/Expo console for `[DEBUG]` / `[ERROR]` Gemini logs.

## 4. Re-run sanity check (PowerShell)

```powershell
cd "c:\Users\kalle\OneDrive\Desktop\StressBuster"
# Use your key; body from file to avoid escaping issues
curl.exe -s -w "\nHTTP_CODE:%{http_code}" "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" -H "Content-Type: application/json" -H "x-goog-api-key: YOUR_KEY" -X POST -d "@scripts/gemini-sanity-payload.json"
```

- **200** → response body has `candidates[].content.parts[].text`.
- **429** → key valid, quota exceeded; retry later or try another model (e.g. `gemini-flash-latest`).
