# StressBuster 🧘

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_2.0_Flash-8E75B2?style=for-the-badge&logo=google&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)

> A gamified mental wellness application built with React Native and Expo. Combines 20+ relaxation mini-games with an AI-powered therapeutic companion to help users manage stress through interactive, rewarding experiences.

## 📱 Project Overview

**StressBuster** makes mental health maintenance engaging and accessible through gamification. Users earn **Zen Tokens** by completing stress-relief activities (breathing exercises, tactile games, mood tracking), which they can spend on AI-powered therapy sessions.

The app features an AI companion (Zen Chat) that can use **Gemini**, **Groq**, or **OpenAI** (configurable). Mood is **keyword-based only** to avoid API rate limits. The interface uses **Glassmorphism** design with smooth animations, creating a calming and modern user experience.

## ✨ Key Features

### � 🤖 AI Companion (Zen Chat)
* **Multi-Provider AI:** Zen chat rotates between Gemini, Groq, and OpenAI (configurable via `ZEN_PROVIDERS` in `.env`) to reduce rate-limit pressure
* **Floating Bubble UI:** Modern chat interface with glassmorphism and smooth animations
* **Token Economy:** Spend Zen Tokens per message (cost and daily cap in `utils/zenTokens.js`)
* **Keyword-Based Mood:** Mood from keywords only (no API); journal and Zen chat use `utils/moodFromKeywords.js`
* **Conversation History:** Cloud-synced chat sessions stored in Firebase

### 🎮 20 Interactive Mini-Games
Haptic-enabled stress-relief games designed to ground and calm:

**Classic Games:**
* **Zen Match** - Memory card game (+10 tokens)
* **Pop Bubbles** - Virtual bubble wrap with physics (+1 token each)
* **Switches** - Satisfying tactile toggle switches
* **Color Calm** - Repetitive color tapping
* **Zen Grid** - Light-up grid puzzle (+10 tokens)
* **Daily Fortune** - Fortune cookie with affirmations (+5 tokens)

**Wheel & Chance Games:**
* **Spin Wheel** - Prize wheel with token rewards
* **Tap Counter** - Speed tapping game
* **Pattern Repeat** - Memory pattern challenge

**Mindfulness Games:**
* **Breathing Exercise** - Guided breathing with animations
* **Number Guesser** - Brain teaser game
* **Simon Says** - Sequence memory game
* **Reflex Tester** - Reaction time game

**Puzzle Games:**
* **Puzzle Slider** - Tile arrangement puzzle
* **Word Chain** - Word association game

**New Skill Games:**
* **Math Blitz** - Quick math challenges (+15 tokens)
* **Color Match** - Color pattern matching (+12 tokens)
* **Speed Tap** - Fast-clicking game (+10 tokens)
* **Balance Beam** - Focus balancing game (+15 tokens)
* **Sequence Game** - Number sequence memory (+12 tokens)

### 🛠️ Wellness Toolkit
* **Soundscapes:** Background audio loops (Rain, Forest, Ocean, Creek) using expo-av
* **Focus Timer:** 25-minute Pomodoro-style productivity timer
* **Mood Journal:** Emoji-based mood tracking with private notes
* **Zen Insights:** Visual statistics and mood analytics
* **Daily Quote:** Inspirational mindfulness quotes

### 💎 UI/UX Design
* **Glassmorphism Theme:** Frosted glass cards with BlurView (intensity 80-85)
* **Smooth Animations:** Entrance animations, tap feedback, and transitions using React Native Animated API
* **Dynamic Theming:** Full Light/Dark mode support
* **Haptic Feedback:** expo-haptics integration for tactile responses
* **Safe Area Optimized:** Proper insets for all devices including notched screens
* **Responsive Layout:** Adapts to different screen sizes

## 🏗️ Architecture & Tech Stack

### Frontend
* **React Native** - Cross-platform mobile framework
* **Expo SDK 54** - Managed workflow and native APIs
* **NativeWind** - Tailwind CSS for React Native styling
* **React Native Animated API** - Smooth animations with native driver

### Backend & Services
* **Firebase v12** - Authentication & Firestore database
* **Zen Chat AI** - Gemini / Groq / OpenAI (see `app.config.js`, `utils/zenChatProviders.js`); provider order and keys via `.env`
* **Cloud Firestore** - Real-time data sync for profiles, moods, and journals
* **Mood** - Keyword-based only (`utils/moodFromKeywords.js`), no AI calls for mood

### Key Dependencies
* `expo-blur` - Glassmorphism effects
* `expo-haptics` - Tactile feedback
* `expo-av` - Audio playback for soundscapes
* `react-native-svg` - Vector graphics and icons
* `@react-native-async-storage/async-storage` - Local persistence
* `react-native-safe-area-context` - Device-safe layouts

### State Management
* **React Context API** - AuthContext, ThemeContext
* **Firebase Realtime Listeners** - Live profile and mood updates
* **Local Storage** - Offline-first capabilities

## 📂 Project Structure

```
StressBuster/
├── app/
│   ├── (tabs)/
│   │   └── index.jsx          # Main app with all tabs and routing
│   └── _layout.tsx             # Root layout with providers
├── app.config.js              # Expo config; reads API keys from .env (supports encrypted keys)
├── components/
│   ├── minigames/              # Mini-game components (tokens scaled in utils/zenTokens.js)
│   ├── screens/                # Journal, Zen Chat, Insights, Sound, Timer, Quote, Auth
│   └── ui/                     # Reusable UI components
├── context/                    # AuthContext, ThemeContext
├── utils/
│   ├── zenTokens.js            # Token costs, caps, signup, minigame scale
│   ├── zenChatProviders.js     # Multi-provider Zen chat (Gemini / Groq / OpenAI)
│   ├── moodFromKeywords.js     # Keyword-based mood (no API)
│   └── encryption.js           # Decrypt API keys (e.g. GEMINI_API_KEY_ENCRYPTED)
├── constants/
├── hooks/
└── assets/                     # Images and sounds
```

## 🚀 Step-by-step setup (get the app running)

Follow these steps in order so the app runs on your machine (or when someone else clones the repo).

### What you need first

- **Node.js 18+** and **npm** ([nodejs.org](https://nodejs.org))
- **Expo Go** on your phone (optional; for testing on device)
- A **Firebase project** (see Step 4)
- At least one **AI API key** for Zen Chat: [Gemini](https://ai.google.dev), [Groq](https://console.groq.com), or [OpenAI](https://platform.openai.com)

---

### Step 1: Get the code

**If you use Git (clone):**
```bash
git clone https://github.com/IanKallelOcumen/StressBuster.git
cd StressBuster
```

**If you downloaded a ZIP:**  
Unzip it, then open a terminal (PowerShell or Command Prompt) and go into the project folder:
```bash
cd path\to\StressBuster
```
(Replace `path\to\StressBuster` with the real folder path.)

---

### Step 2: Install dependencies

In the project folder, run:

```bash
npm install
```

Wait until it finishes (no errors).

---

### Step 3: Create your `.env` file

The app needs API keys and Firebase config in a file named `.env`. The repo does **not** include `.env` (so secrets stay private). Use the template:

**Windows (Command Prompt or PowerShell):**
```bash
copy .env.example .env
```

**macOS / Linux:**
```bash
cp .env.example .env
```

Then open `.env` in a text editor. You will fill it in during the next steps.

---

### Step 4: Set up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com) and sign in.
2. **Create a project** (or use an existing one).
3. **Enable Authentication**
   - In the left menu: **Build → Authentication → Get started**
   - Open the **Sign-in method** tab and enable **Email/Password**.
4. **Create a Firestore database**
   - **Build → Firestore Database → Create database**
   - Choose **Start in test mode** (or set rules later).
   - Pick a region and confirm.
5. **Get your config**
   - Project **Settings** (gear) → **General** → scroll to **Your apps**
   - Add a **Web** app if you don’t have one; copy the `firebaseConfig` object.
   - Put each value into `.env` as below.

In your `.env` file, set (use your real values from the Firebase config):

```env
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

---

### Step 5: Add an AI API key (for Zen Chat)

The app needs at least one of these so the AI chat works. Put the key in `.env`.

**Option A – Gemini (recommended, free tier):**
1. Go to [Google AI Studio](https://aistudio.google.com/apikey) and create an API key.
2. In `.env` set:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

**Option B – Groq:**  
Get a key from [Groq Console](https://console.groq.com) and set:
```env
GROQ_API_KEY=your_groq_api_key_here
```

**Option C – OpenAI:**  
Get a key from [OpenAI](https://platform.openai.com/api-keys) and set:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

You can set more than one; the app will use the first one it finds. Optional: set order with  
`ZEN_PROVIDERS=gemini,groq,openai` in `.env`.

---

### Step 6: Run the app

In the project folder, run:

```bash
npx expo start
```

- **Web:** Open the URL shown in the terminal (e.g. `http://localhost:8081`).
- **Phone:** Install **Expo Go**, then scan the QR code from the terminal.
- **iOS simulator:** Press `i` in the terminal (Mac only).
- **Android emulator:** Press `a` in the terminal (if Android Studio is set up).

The app connects to **Firebase in the cloud** using the keys in `.env`. You do **not** need to start any server on your PC.

---

### Step 7 (optional): Firebase emulators

For local development with a local Auth/Firestore, you can run Firebase emulators. This is **optional**; the app works with production Firebase without it.

```bash
npm run emulators
```

Requires [Firebase CLI](https://firebase.google.com/docs/cli) and Java. If emulators aren’t running, the app uses your production Firebase project automatically.

---

### Quick checklist

| Step | What to do |
|------|------------|
| 1 | Get code: `git clone` or unzip → `cd StressBuster` |
| 2 | Install: `npm install` |
| 3 | Env file: `copy .env.example .env` (Windows) or `cp .env.example .env` (Mac/Linux) |
| 4 | Firebase: Create project, enable Email/Password auth, create Firestore, copy config into `.env` |
| 5 | AI key: Add at least one of `GEMINI_API_KEY`, `GROQ_API_KEY`, `OPENAI_API_KEY` in `.env` |
| 6 | Run: `npx expo start` |

If something fails, check that `.env` has no typos, all Firebase fields are set, and at least one AI key is set. See also [TRANSFER_CHECKLIST.md](TRANSFER_CHECKLIST.md) for sharing the project with others.

## 🎯 Usage

1. **Sign Up/Login** - Create an account with email and password
2. **Earn Tokens** - Play mini-games to earn Zen Tokens (starting balance and rewards in `utils/zenTokens.js`)
3. **Track Mood** - Use the journal; mood is keyword-based (no API)
4. **Chat with AI** - Spend Zen tokens per message (cost and daily cap in `utils/zenTokens.js`)
5. **Build Streaks** - Log in daily to maintain your wellness streak

## 🌟 Feature Highlights

### Token Economy System
- Configured in `utils/zenTokens.js`: signup grant, per-message cost, daily Zen cap, max balance, minigame scale
- Start with a small signup grant (e.g. 5 tokens); earn more by playing mini-games (rewards scaled)
- Zen chat costs tokens per message with a daily message cap to manage API rate limits
- Mood is keyword-based only (no API calls for mood)

### Progressive Leveling
- **Novice** (0-99 tokens) 🌱
- **Seeker** (100-199 tokens) 🌿
- **Meditator** (200-349 tokens) 🧘
- **Zen Master** (350-499 tokens) ⭐
- **Enlightened** (500+ tokens) ✨

### Streak Tracking
- Daily login streaks encourage consistency
- Visible on home screen with 🔥 icon
- Resets if you miss a day

### Offline-First Design
- All mini-games work without internet
- Journal entries saved locally
- Syncs with Firebase when online

## 📸 Screenshots

| Home Dashboard | Game Center | AI Chat |
|:---:|:---:|:---:|
| *(Coming Soon)* | *(Coming Soon)* | *(Coming Soon)* |

## 🔧 Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
# iOS
npx expo build:ios

# Android
npx expo build:android
```

### Code Structure
- Main app and routing in `app/(tabs)/index.jsx`
- Config and API keys: `app.config.js` + `.env` (use `.env.example` as template)
- Mini-games in `components/minigames/`; token scale in `utils/zenTokens.js`
- Zen chat providers in `utils/zenChatProviders.js`; mood in `utils/moodFromKeywords.js`
- Shared UI in `components/ui/`

### Repo and .gitignore
- `.env` and encryption scripts are not committed; only encrypted key *values* in your local `.env` are used at runtime
- Logs, IDE folders (`.cursor/`, `.gemini/`), Firebase local/emulator files, and dev-only scripts are ignored so the repo stays clean on GitHub

## 🐛 Known Issues

- Token cap enforcement happens client-side (could be moved to Firebase rules)
- AI conversation history doesn't implement pagination (loads all messages)
- Some games need better win condition feedback

## 🗺️ Roadmap

- [ ] Add more mini-games (Target: 30+)
- [ ] Implement achievements system
- [ ] Add social features (friend challenges)
- [ ] Voice mode for AI companion
- [ ] Widget support for iOS/Android
- [ ] Apple Health / Google Fit integration
- [ ] Weekly/monthly wellness reports

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow existing code style (React hooks, functional components)
- Add animations for new interactive elements
- Ensure mini-games award appropriate tokens
- Test on both iOS and Android
- Update README if adding major features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ian Kallel Ocumen**
- GitHub: [@IanKallelOcumen](https://github.com/IanKallelOcumen)

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- Firebase for backend infrastructure
- Expo team for the amazing development platform
- React Native community for excellent libraries

---

**Made with ❤️ for mental wellness**
