# 🎮 Minigames & Component Organization

## ✅ What Changed (Latest Update)

**NEW FEATURES:**
- ✅ **22 Total Minigames** - A huge variety of stress-busting activities!
- ✅ **Optimized Performance** - Minigames now use efficient rendering and cleanup.
- ✅ **Standardized UI** - Consistent back buttons and layout across all games.
- ✅ **Cleaned Codebase** - Removed redundant assets and components.

The `index.jsx` now serves as a clean router, importing optimized components from the `components/minigames` directory.

## 📁 New Structure

```
components/
├── minigames/
│   ├── index.js              # Central export file
│   ├── ZenMatch.jsx          # Memory card game
│   ├── PopBubbles.jsx        # Bubble popping
│   ├── Switches.jsx          # Haptic switches
│   ├── ColorCalm.jsx         # Color tapping
│   ├── ZenGrid.jsx           # Grid puzzle
│   ├── DailyFortune.jsx      # Fortune cookies
│   ├── SpinWheel.jsx         # Prize wheel
│   ├── TapCounter.jsx        # Speed tapping
│   ├── BreathingExercise.jsx # Guided breathing
│   ├── NumberGuesser.jsx     # High/Low game
│   ├── SimonSays.jsx         # Memory pattern
│   ├── ReflexGame.jsx        # Reaction time
│   ├── PuzzleSlider.jsx      # Sliding puzzle
│   ├── WordChain.jsx         # Word association
│   ├── MathBlitz.jsx         # Speed math
│   ├── ColorMatch.jsx        # Stroop test
│   ├── SpeedTap.jsx          # Sequential tapping
│   ├── BalanceGame.jsx       # Gyro/Tap balance
│   ├── MandalaDraw.jsx       # Mandala drawing
│   ├── MemoryMatrix.jsx      # Grid memory
│   ├── FocusHold.jsx         # Focus timer
│   └── EmojiCatch.jsx        # Catching game
│
└── screens/
    ├── AIChatScreen.jsx      # AI Companion
    ├── SoundScreen.jsx       # Soundscapes
    ├── TimerScreen.jsx       # Focus Timer
    ├── QuoteScreen.jsx       # Daily Quotes
    ├── JournalScreen.jsx     # Mood Journal
    └── InsightsScreen.jsx    # Analytics
```

## 🎯 All 22 Minigames

| Game | Description | Reward |
|------|-------------|--------|
| **Zen Match** | Classic memory card matching | +10 Tokens |
| **Pop Bubbles** | Infinite bubble wrap popping | +1 Token/pop |
| **Switches** | Satisfying toggle switches | +5 Tokens/20 flips |
| **Color Calm** | Relaxing color transitions | +5 Tokens/20 taps |
| **Zen Grid** | Light-out style puzzle | +10 Tokens |
| **Daily Fortune** | Open a fortune cookie | +5 Tokens |
| **Spin Wheel** | Daily prize wheel | 1-20 Tokens |
| **Tap Counter** | Tap fast in 10 seconds | Based on speed |
| **Breathing** | 4-7-8 Breathing guide | +5 Tokens/cycle |
| **Number Guesser** | Guess the number (1-100) | Based on attempts |
| **Simon Says** | Repeat the pattern | Based on length |
| **Reflex Game** | Tap when color changes | Based on reaction |
| **Puzzle Slider** | 15-puzzle sliding block | Based on moves |
| **Word Chain** | Form words from letters | Based on word length |
| **Math Blitz** | Speed arithmetic | Based on score |
| **Color Match** | Match text color, not word | Based on score |
| **SpeedTap** | Tap numbers 1-9 in order | Based on speed |
| **Balance Beam** | Keep the bar centered | Based on time |
| **Mandala Draw** | Create symmetrical art | +10 Tokens |
| **Memory Matrix** | Recall grid patterns | +10 Tokens |
| **Focus Flame** | Hold button to focus | +10 Tokens |
| **Emoji Rain** | Catch positive emojis | +1 Token/catch |

## 🚀 How to Use

### Importing Minigames
```javascript
import { MemoryGame, SpeedTap, WordChain } from '@/components/minigames';
```

### Adding New Minigames
1. Create new file in `components/minigames/YourGame.jsx`
2. Export component: `export const YourGame = ({ onBack, colors, updateTokens }) => { ... }`
3. Add to `components/minigames/index.js`
4. Import and use in `app/(tabs)/index.jsx` inside a wrapper.

## 🎨 Component Props

### Minigames Props
- `onBack`: Function to navigate back (provided by wrapper)
- `colors`: Theme colors object (light/dark mode)
- `updateTokens`: Function to award tokens (e.g., `updateTokens(5)`)

---

**Happy coding! 🎉 Your codebase is now much cleaner and easier to work with!**
