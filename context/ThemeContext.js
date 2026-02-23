import React from 'react';

export const THEME_COLORS = {
  light: {
    text: '#000', subtext: '#8E8E93', screenBg: '#F2F2F7', tileBg: '#FFFFFF',
    accent: '#007AFF', blurTint: 'light', tabBar: '#FFFFFF', tabActive: '#007AFF', tabInactive: '#C7C7CC',
    gradient: ['#F0F4F8', '#E6EEF5'], // Soft Blue-ish Gray
    glassBg: 'rgba(255,255,255,0.65)',
    glassBorder: 'rgba(255,255,255,0.6)',
    icon: { orange: '#FF9500', yellow: '#FFCC00', red: '#FF3B30', green: '#34C759', purple: '#AF52DE', cyan: '#30b0c7', blue: '#007AFF', pink: '#FF2D55' }
  },
  dark: {
    text: '#FFF', subtext: '#8E8E93', screenBg: '#000', tileBg: '#1C1C1E',
    accent: '#0A84FF', blurTint: 'dark', tabBar: '#1C1C1E', tabActive: '#0A84FF', tabInactive: '#636366',
    gradient: ['#121212', '#1E1E24'], // Deep Blue-Black
    glassBg: 'rgba(30,30,30,0.4)',
    glassBorder: 'rgba(255,255,255,0.1)',
    icon: { orange: '#FF9F0A', yellow: '#FFD60A', red: '#FF453A', green: '#30D158', purple: '#BF5AF2', cyan: '#64D2FF', blue: '#0A84FF', pink: '#FF375F' }
  }
};

export const ThemeContext = React.createContext();
