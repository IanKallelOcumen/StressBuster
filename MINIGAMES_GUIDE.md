# 🎮 Minigames & Component Organization

## ✅ What Changed (Latest Update)

**NEW FEATURES:**
- ✅ **500 Token Cap** - Maximum 500 tokens to keep the game balanced
- ✅ **4 New Minigames** - Spin Wheel, Tap Counter, Pattern Repeat, Breathing Exercise
- ✅ **Removed Modal** - Daily rewards now auto-claim with alert notification
- ✅ **10 Total Minigames** - Double the fun!

The massive 731-line `index.jsx` has been reorganized into smaller, maintainable files:
- **Now: ~700 lines** in main + organized components
- Separated minigames into individual files
- Extracted screen components for better organization

## 📁 New Structure

```
components/
├── minigames/
│   ├── index.js              # Easy imports
│   ├── ZenMatch.jsx          # Memory card game (+10 tokens)
│   ├── PopBubbles.jsx        # Bubble popping (+1 token each)
│   ├── Switches.jsx          # Haptic switch toggling  
│   ├── ColorCalm.jsx         # Color tapping game
│   ├── ZenGrid.jsx           # Light up grid puzzle
│   ├── DailyFortune.jsx      # Fortune cookie (+5 tokens)
│   ├── SpinWheel.jsx         # Random prize spinner (NEW!)
│   ├── TapCounter.jsx        # Speed tapping challenge (NEW!)
│   ├── PatternRepeat.jsx     # Simon-says memory game (NEW!)
│   └── BreathingExercise.jsx # Guided breathing (+5/cycle) (NEW!)
│
└── screens/
    ├── index.js              # Easy imports
    ├── AIChatScreen.jsx      # Zen AI companion
    ├── SoundScreen.jsx       # Soundscapes (rain, forest, waves)
    ├── TimerScreen.jsx       # 25-minute focus timer
    ├── QuoteScreen.jsx       # Daily motivational quotes
    ├── JournalScreen.jsx     # Mood journaling
    └── InsightsScreen.jsx    # Stats & wellness metrics
```

## 🎯 All 10 Minigames

### 1. **Zen Match** 🎴
- Memory card matching game
- Rewards: +10 Tokens on completion
- File: `components/minigames/ZenMatch.jsx`

### 2. **Pop Bubbles** 🫧
- Satisfying bubble popping for stress relief
- Rewards: +1 Token per pop
- File: `components/minigames/PopBubbles.jsx`

### 3. **Switches** 🎚️
- Haptic feedback switch toggling
- Rewards: +5 Tokens every 20 flips
- File: `components/minigames/Switches.jsx`

### 4. **Color Calm** 🎨
- Tap to change colors
- Rewards: +5 Tokens every 20 taps
- File: `components/minigames/ColorCalm.jsx`

### 5. **Zen Grid** 💡
- Light up all squares puzzle
- Rewards: +10 Tokens on completion
- File: `components/minigames/ZenGrid.jsx`

### 6. **Daily Fortune** 🥠
- Crack fortune cookies for wisdom
- Rewards: +5 Tokens per cookie
- File: `components/minigames/DailyFortune.jsx`

### 7. **Spin Wheel** 🎡 (NEW!)
- Spin for random token prizes (1-20)
- Rewards: Random (1, 3, 5, 10, 15, or 20 tokens)
- File: `components/minigames/SpinWheel.jsx`

### 8. **Tap Counter** ⚡ (NEW!)
- Tap as fast as you can in 10 seconds
- Rewards: 2-20 Tokens based on speed (40+ taps gets rewards)
- File: `components/minigames/TapCounter.jsx`

### 9. **Pattern Repeat** 🧩 (NEW!)
- Simon-says style memory game
- Rewards: 5 Tokens per level completed
- File: `components/minigames/PatternRepeat.jsx`

### 10. **Breathing Exercise** 🧘 (NEW!)
- Guided 4-4-6 breathing cycles
- Rewards: +5 Tokens per completed cycle
- File: `components/minigames/BreathingExercise.jsx`

## 🚀 How to Use

### Importing Minigames
```javascript
import { MemoryGame, BubbleGame, ZenGrid } from '@/components/minigames';
```

### Importing Screens
```javascript
import { AIChatScreen, JournalScreen } from '@/components/screens';
```

### Adding New Minigames
1. Create new file in `components/minigames/YourGame.jsx`
2. Export component: `export const YourGame = ({ onBack, colors, updateTokens }) => { ... }`
3. Add to `components/minigames/index.js`
4. Import and use in main app

## 🎨 Component Props

### Minigames Props
- `onBack`: Function to navigate back
- `colors`: Theme colors object
- `updateTokens`: Function to award tokens

### Screen Props
- `onBack`: Function to navigate back
- `colors`: Theme colors object
- Plus screen-specific props (user, profile, db, etc.)

## 📊 Benefits

✅ **Better Organization** - Each feature in its own file  
✅ **Easier Maintenance** - Fix bugs in isolated components  
✅ **Faster Development** - Add new games without touching main file  
✅ **Cleaner Code** - Organized into logical modules  
✅ **Team Friendly** - Multiple devs can work simultaneously  
✅ **500 Token Cap** - Balanced progression system
✅ **10 Fun Minigames** - Hours of engaging stress relief!

## 🎮 Game Token Economy

| Game | Reward | Trigger |
|------|--------|---------|
| Zen Match | +10 | Complete all pairs |
| Pop Bubbles | +1 | Each pop |
| Switches | +5 | Every 20 flips |
| Color Calm | +5 | Every 20 taps |
| Zen Grid | +10 | Light all squares |
| Daily Fortune | +5 | Crack cookie |
| **Spin Wheel** | **1-20** | **Random spin** |
| **Tap Counter** | **2-20** | **Based on speed (40-100+ taps)** |
| **Pattern Repeat** | **5/level** | **Each level completed** |
| **Breathing** | **+5** | **Each cycle completed** |
| AI Chat | -5 | Per message (cost) |
| **MAX TOKENS** | **500** | **Cap limit** |

## 🚀 Recent Updates

### v2.0 - Major Feature Update
- Added 500 token cap for balanced gameplay
- Removed daily reward modal (now auto-claims with alert)
- Added 4 new engaging minigames
- Improved token reward system
- Better alignment and UI consistency

### v1.0 - Initial Organization  
- Separated 6 original minigames
- Created screens folder structure  
- Organized imports and exports

---

**Happy coding! 🎉 Your codebase is now much cleaner and easier to work with!**
