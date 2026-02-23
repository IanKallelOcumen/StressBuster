import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

const GlassCard = ({ children, style, color, intensity = 20, colors }) => {
  // Check for colors object existence to prevent crashes
  if (!colors) return <View style={style}>{children}</View>;

  const isDark = colors.blurTint === 'dark';
  
  const containerStyle = {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder || (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)'),
    backgroundColor: color || colors.glassBg || (isDark ? 'rgba(30,30,30,0.4)' : 'rgba(255,255,255,0.65)'),
    ...(Platform.OS === 'web' ? {
      boxShadow: isDark ? '0 4px 12px 0 rgba(0,0,0,0.3)' : '0 4px 12px 0 rgba(0,0,0,0.05)',
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.05,
      shadowRadius: 12,
      elevation: 4,
    }),
  };

  return (
    <View style={[containerStyle, style]}>
      {Platform.OS === 'ios' && (
        <BlurView intensity={intensity} tint={colors.blurTint} style={StyleSheet.absoluteFill} />
      )}
      <View style={{ zIndex: 1 }}>{children}</View>
    </View>
  );
};

export default GlassCard;
