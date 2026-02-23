import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const GradientBackground = ({ children, style, colors }) => {
  // Fallback if colors is not provided (should not happen if used correctly)
  const gradientColors = colors?.gradient || (colors?.screenBg ? [colors.screenBg, colors.screenBg] : ['#ffffff', '#ffffff']);

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ flex: 1 }, style]}
    >
      {children}
    </LinearGradient>
  );
};

export default GradientBackground;
