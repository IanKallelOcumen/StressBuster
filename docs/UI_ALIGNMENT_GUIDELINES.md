# UI Alignment & Styling Guidelines

## Overview
This document outlines the standards for UI alignment, safe area handling, and styling across the StressBuster application, particularly for minigames and screens.

## 1. Safe Area Handling
All screens must respect device safe areas (notch, home indicator, status bar).

### Implementation
- **Import:** `import { useSafeAreaInsets } from 'react-native-safe-area-context';`
- **Hook:** `const insets = useSafeAreaInsets();`
- **Padding:**
  - **Top:** Use `paddingTop: insets.top + X` (where X is usually 10-20px) for the main container or header.
  - **Bottom:** Ensure interactive elements at the bottom have `marginBottom: insets.bottom`.

### Example
```jsx
const insets = useSafeAreaInsets();
return (
  <View style={{ flex: 1, paddingTop: insets.top + 10 }}>
    {/* Content */}
  </View>
);
```

## 2. Header Layout
Consistent headers ensure a unified user experience.

### Standard Header Structure
- **Left:** Back Button (if applicable).
- **Center:** Screen Title.
- **Right:** Action Button (e.g., "Done", "Settings") or Score/Lives.

### Back Button
- **Icon:** `Ionicons` name="arrow-back" size={24} color={colors.text}
- **Container:** 40x40 TouchableOpacity, centered content.
- **Style:** 
  ```jsx
  <TouchableOpacity 
    onPress={onBack} 
    style={{ 
      width: 40, height: 40, borderRadius: 20,
      backgroundColor: colors.tileBg,
      justifyContent: 'center', alignItems: 'center',
      borderWidth: 1, borderColor: colors.text + '20'
    }}
  >
    <Ionicons name="arrow-back" size={24} color={colors.text} />
  </TouchableOpacity>
  ```
- **Positioning:**
  - If using a header row: Place as first child.
  - If floating (immersive games): Absolute positioning at `top: insets.top + 10`, `left: 20`.

## 3. GlassCard Usage
Use `GlassCard` for containers that need to separate content from the gradient background.

### Props
- `colors`: Pass the current theme colors object.
- `color`: Background tint (usually `colors.tileBg` or `colors.accent`).
- `intensity`: Blur intensity (default 30, use lower for subtle effect, higher for modals).

## 4. Typography
Use theme colors for text to ensure contrast.

- **Title:** `fontSize: 32`, `fontWeight: '800'`, `color: colors.text`
- **Subtitle:** `fontSize: 18`, `fontWeight: '600'`, `color: colors.subtext`
- **Body:** `fontSize: 14-16`, `color: colors.text`
- **Accent:** `color: colors.accent`

## 5. Responsive Design
- Use `Dimensions.get('window')` or `flex` layout to adapt to different screen sizes.
- Avoid hardcoded pixel values for layout structure (width/height of main containers).
- Use `gap` property for spacing between items in a list/row.

## 6. Theme Integration
Always use the `colors` prop passed to the component or consume `ThemeContext`.

- `colors.bg`: Main background (gradient start).
- `colors.bgSecondary`: Gradient end.
- `colors.text`: Primary text.
- `colors.subtext`: Secondary text.
- `colors.tileBg`: Card background.
- `colors.accent`: Interactive elements/highlights.
