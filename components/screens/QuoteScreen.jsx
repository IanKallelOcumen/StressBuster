import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Animated, Platform, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassCard from '../ui/GlassCard';
import GradientBackground from '../ui/GradientBackground';

const quotes = [
  "Peace begins with a smile.",
  "Breath is the bridge between body and mind.",
  "Quiet the mind and the soul will speak.",
  "The present moment is all you ever have.",
  "Within you is the stillness and sanctuary.",
  "Inhale courage, exhale fear.",
  "You are the sky, everything else is just weather.",
  "Calm mind brings inner strength.",
  "Your peace is worth protecting.",
  "Every breath is a fresh start."
];

export const QuoteScreen = ({ onBack, colors, sfxEnabled }) => {
  const insets = useSafeAreaInsets();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [quoteIndex, setQuoteIndex] = useState(Math.floor(Math.random() * quotes.length));
  
  const refreshQuote = () => {
    if (sfxEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Simple random pick, maybe same as before
    let newIndex = Math.floor(Math.random() * quotes.length);
    // Ensure new quote if possible
    if (quotes.length > 1) {
        while (newIndex === quoteIndex) {
            newIndex = Math.floor(Math.random() * quotes.length);
        }
    }
    setQuoteIndex(newIndex);
  };
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true })
    ]).start();
  }, []);
  
  return (
    <GradientBackground colors={colors}>
    <Animated.ScrollView contentContainerStyle={{ 
      paddingTop: insets.top + 68, 
      paddingBottom: insets.bottom + 80, 
      paddingHorizontal: 20,
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100%'
    }} showsVerticalScrollIndicator={false} style={{ opacity: fadeAnim }}>
      <Animated.View style={{ alignItems: 'center', gap: 24, transform: [{ translateY: slideAnim }] }}>
        <View style={{ gap: 4 }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text, textAlign: 'center' }}>Daily Wisdom</Text>
          <Text style={{ fontSize: 13, color: colors.subtext, textAlign: 'center' }}>A moment of mindfulness</Text>
        </View>

        {/* Quote Card */}
        <GlassCard colors={colors} color={colors.accent + '12'} style={{
          borderColor: colors.accent + '30',
          borderWidth: 1.5,
          borderRadius: 24,
          paddingHorizontal: 24,
          paddingVertical: 32,
          alignItems: 'center',
          gap: 16
        }}>
          <Text style={{ fontSize: 48 }}>💭</Text>
          <Text style={{ 
            fontSize: 20, 
            fontStyle: 'italic', 
            color: colors.text, 
            textAlign: 'center', 
            lineHeight: 32,
            fontWeight: '500'
          }}>
            “{quotes[quoteIndex]}”
          </Text>
        </GlassCard>

        {/* Refresh Button */}
        <TouchableOpacity
          onPress={refreshQuote}
          style={{
            backgroundColor: colors.accent,
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 20,
            ...(Platform.OS === 'web' ? {
              boxShadow: `0 4px 8px 0 ${colors.accent}4D`,
            } : {
              shadowColor: colors.accent,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4
            })
          }}>
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>New Quote</Text>
        </TouchableOpacity>

        {/* Tip */}
        <View style={{
          backgroundColor: colors.tileBg,
          borderRadius: 14,
          paddingHorizontal: 16,
          paddingVertical: 12,
          width: '100%'
        }}>
          <Text style={{ color: colors.subtext, fontSize: 12, lineHeight: 18, textAlign: 'center' }}>
            💡 Take a moment to reflect on this wisdom throughout your day.
          </Text>
        </View>
      </Animated.View>
    </Animated.ScrollView>
    </GradientBackground>
  );
};
