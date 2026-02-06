# StressBuster 🧘

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_2.0_Flash-8E75B2?style=for-the-badge&logo=google&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)

> A gamified mental wellness application built with React Native and Expo. Combines 20+ relaxation mini-games with an AI-powered therapeutic companion to help users manage stress through interactive, rewarding experiences.

## 📱 Project Overview

**StressBuster** makes mental health maintenance engaging and accessible through gamification. Users earn **Zen Tokens** by completing stress-relief activities (breathing exercises, tactile games, mood tracking), which they can spend on AI-powered therapy sessions.

The app features an AI companion powered by **Google's Gemini 2.0 Flash**, providing empathetic, context-aware conversations. The interface uses **Glassmorphism** design with smooth animations, creating a calming and modern user experience.

## ✨ Key Features

### � AI Companion
* **Gemini 2.0 Flash Integration:** Delivers context-aware, therapeutic responses with low latency
* **Floating Bubble UI:** Modern chat interface with glassmorphism and smooth animations
* **Token Economy:** Spend Zen Tokens for AI conversations, encouraging healthy habits
* **Mood Detection:** AI analyzes emotional state and provides appropriate support
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
* **Google Gemini 2.0 Flash API** - AI conversation model
* **Cloud Firestore** - Real-time data sync for profiles, moods, and journals

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
├── components/
│   ├── minigames/              # 20 mini-game components
│   │   ├── ZenMatch.jsx
│   │   ├── PopBubbles.jsx
│   │   ├── MathBlitz.jsx
│   │   └── ... (17 more games)
│   ├── screens/                # Utility screens
│   │   ├── JournalScreen.jsx
│   │   ├── InsightsScreen.jsx
│   │   ├── AIChatScreen.jsx
│   │   ├── SoundScreen.jsx
│   │   ├── TimerScreen.jsx
│   │   └── QuoteScreen.jsx
│   └── ui/                     # Reusable UI components
├── constants/
│   └── theme.ts                # Color themes and design tokens
├── hooks/                      # Custom React hooks
└── assets/                     # Images and sounds
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app (for mobile testing)
- Firebase project
- Google Gemini API key

### Steps

1.  **Clone the repository**
    ```bash
    git clone https://github.com/IanKallelOcumen/StressBuster.git
    cd StressBuster
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Firebase**
    * Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
    * Enable Authentication (Email/Password)
    * Create a Firestore database
    * Update the `firebaseConfig` object in `app/(tabs)/index.jsx` with your credentials:
    ```javascript
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_PROJECT.firebaseapp.com",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_PROJECT.appspot.com",
      messagingSenderId: "YOUR_SENDER_ID",
      appId: "YOUR_APP_ID"
    };
    ```

4.  **Configure Gemini API**
    * Get an API key from [ai.google.dev](https://ai.google.dev)
    * Update the `GEMINI_API_KEY` constant in `app/(tabs)/index.jsx`:
    ```javascript
    const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY';
    ```

5.  **Run the application**
    ```bash
    npx expo start
    ```
    * Press `i` for iOS simulator
    * Press `a` for Android emulator
    * Scan QR code with Expo Go for physical device

## 🎯 Usage

1. **Sign Up/Login** - Create an account with email and password
2. **Earn Tokens** - Play mini-games to earn Zen Tokens (start with 500)
3. **Track Mood** - Use the journal to log your emotional state
4. **Chat with AI** - Spend tokens (10 per message) to talk with the AI companion
5. **Build Streaks** - Log in daily to maintain your wellness streak

## 🎯 Usage

1. **Sign Up/Login** - Create an account with email and password
2. **Earn Tokens** - Play mini-games to earn Zen Tokens (start with 500)
3. **Track Mood** - Use the journal to log your emotional state
4. **Chat with AI** - Spend tokens (10 per message) to talk with the AI companion
5. **Build Streaks** - Log in daily to maintain your wellness streak

## 🌟 Feature Highlights

### Token Economy System
- Start with 500 Zen Tokens
- Earn tokens by playing mini-games (1-15 tokens per game)
- Spend 10 tokens per AI conversation message
- Maximum cap of 5000 tokens to encourage balanced usage

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
- All main app logic is in `app/(tabs)/index.jsx` (944 lines)
- Mini-games are modular components in `components/minigames/`
- Utility screens are in `components/screens/`
- Shared UI components in `components/ui/`

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
