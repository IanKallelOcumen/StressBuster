# Transfer checklist – run on another PC / share with a friend

Use this so the app runs correctly after clone/pull on another machine.

## On your machine (before sharing)

1. **Commit all app-critical changes**  
   The repo must include both **new** and **modified** files so the app and its imports match:
   ```bash
   git add app/ components/ context/ utils/ app.config.js babel.config.js metro.config.js .env.example
   git status
   ```
   Then commit (include any other modified files you want your friend to have):
   ```bash
   git commit -m "Add missing context, utils, screens, minigames; configs and env template"
   ```

2. **Push**  
   ```bash
   git push
   ```

## On your friend’s machine

1. **Get the code**  
   - If they already have the repo: `git pull`  
   - If new clone: `git clone <repo-url>` then `cd StressBuster` (or your repo folder name)

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Environment file**  
   Copy the env template and add their own keys (no secrets in repo):
   ```bash
   copy .env.example .env
   ```
   Then edit `.env` and replace placeholders with:
   - `GEMINI_API_KEY` (or use encryption flow if you use it)
   - Firebase keys if they need auth/storage

4. **Run the app**  
   ```bash
   npx expo start
   ```

5. **Firebase**  
   The app talks to **Firebase in the cloud** (your project). Nothing starts on your friend’s PC: they just need the same `.env` Firebase keys so the app can connect.  
   **Firebase emulators** (local Auth/Firestore for dev) do **not** start automatically. To use them they’d run `npm run emulators` separately (needs Firebase CLI and Java).

## Files that were missing and are now tracked

These were previously untracked and caused “Unable to resolve module” on other PCs. They are now staged/committed so a fresh clone has everything:

- **Context:** `context/DevContext.js`, `context/ThemeContext.js`
- **Dev UI:** `components/dev/DevOverlay.jsx`
- **Utils:** `utils/haptics.js`, `utils/zenTokens.js`, `utils/encryption.js`, `utils/moodFromKeywords.js`, `utils/zenChatProviders.js`
- **Screens:** `components/screens/AuthScreen.jsx`
- **UI:** `components/ui/GlassCard.jsx`, `components/ui/GradientBackground.jsx`
- **Minigames:** `EmojiCatch.jsx`, `FocusHold.jsx`, `MandalaDraw.jsx`, `MemoryMatrix.jsx`
- **Config:** `app.config.js`, `babel.config.js`, `metro.config.js`, `.env.example`
- **Assets:** `assets/sounds/campfire.mp3`, `river.mp3`, `wind.mp3` (Sound screen uses these; rain/forest/waves were removed to avoid missing-file errors.)

If your friend still sees “Unable to resolve module …”, they need the latest commit (pull or re-clone) so these files are present.
