import { useEffect, useState } from 'react';
import { Animated, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassCard from '../ui/GlassCard';
import GradientBackground from '../ui/GradientBackground';

export const InsightsScreen = ({ onBack, colors, profile }) => {
  const insets = useSafeAreaInsets();
  const [cardScales] = useState([
    new Animated.Value(0.8),
    new Animated.Value(0.8),
    new Animated.Value(0.8),
    new Animated.Value(0.8)
  ]);
  const [cardOpacities] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]);
  const confidence = Math.round((profile?.lastMoodConfidence || 0) * 100);
  const streak = profile?.streak || 0;
  const tokens = profile?.zenTokens || 0;
  const journalMood = profile?.lastMood || '😶';
  const journalLabel = profile?.lastMoodLabel || '—';
  const chatMood = profile?.lastChatMood || null;
  const chatLabel = profile?.lastChatMoodLabel || null;
  
  useEffect(() => {
    cardScales.forEach((scale, i) => {
      Animated.parallel([
        Animated.timing(scale, { toValue: 1, duration: 500, delay: i * 100, useNativeDriver: true }),
        Animated.timing(cardOpacities[i], { toValue: 1, duration: 500, delay: i * 100, useNativeDriver: true })
      ]).start();
    });
  }, []);
  
  const getLevel = (t) => {
    if (t < 100) return 'Novice';
    if (t < 300) return 'Seeker';
    if (t < 500) return 'Meditator';
    return 'Zen Master';
  };
  
  return (
    <GradientBackground colors={colors}>
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 68, paddingHorizontal: 16, paddingBottom: insets.bottom + 80 }} showsVerticalScrollIndicator={false}>
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text }}>Zen Insights</Text>
        <Text style={{ fontSize: 14, color: colors.subtext, marginTop: 4 }}>Track your wellness journey</Text>
      </View>
      
      <Animated.View style={{ opacity: cardOpacities[0], transform: [{ scale: cardScales[0] }] }}>
        <GlassCard colors={colors} color={colors.icon.orange + '08'} style={{ borderColor: colors.icon.orange + '30', marginBottom: 14, paddingHorizontal: 24, paddingVertical: 18 }}>
          <View style={{ alignItems: 'flex-start', gap: 10 }}>
            <Text style={{ color: colors.subtext, fontSize: 12, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5 }}>Mood (Journal + Zen Chat)</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <View>
                <Text style={{ color: colors.subtext, fontSize: 11 }}>Journal</Text>
                <Text style={{ fontSize: 36 }}>{journalMood}</Text>
                <Text style={{ color: colors.text, fontSize: 15, fontWeight: '600' }}>{journalLabel}</Text>
              </View>
              {chatMood && chatLabel && (
                <View>
                  <Text style={{ color: colors.subtext, fontSize: 11 }}>Zen chat (keywords)</Text>
                  <Text style={{ fontSize: 36 }}>{chatMood}</Text>
                  <Text style={{ color: colors.text, fontSize: 15, fontWeight: '600' }}>{chatLabel}</Text>
                </View>
              )}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <View style={{ height: 6, width: `${Math.min(confidence, 100)}%`, backgroundColor: colors.icon.orange, borderRadius: 3 }} />
              <Text style={{ color: colors.subtext, fontSize: 12 }}>Journal confidence: {confidence}%</Text>
            </View>
          </View>
        </GlassCard>
      </Animated.View>
      
      <Animated.View style={{ opacity: cardOpacities[1], transform: [{ scale: cardScales[1] }] }}>
        <GlassCard colors={colors} color={colors.icon.orange + '08'} style={{ borderColor: colors.icon.orange + '30', marginBottom: 14, paddingHorizontal: 24, paddingVertical: 18 }}>
          <View style={{ alignItems: 'flex-start', gap: 10 }}>
            <Text style={{ color: colors.subtext, fontSize: 12, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5 }}>Streak Status</Text>
            <Text style={{ fontSize: 48 }}>🔥</Text>
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600' }}>{streak} Day Streak</Text>
            <Text style={{ color: colors.subtext, marginTop: 4, fontSize: 13 }}>Login daily + journal & chat to keep momentum.</Text>
          </View>
        </GlassCard>
      </Animated.View>
      
      <Animated.View style={{ opacity: cardOpacities[2], transform: [{ scale: cardScales[2] }] }}>
        <GlassCard colors={colors} color={colors.accent + '08'} style={{ borderColor: colors.accent + '30', marginBottom: 14, paddingHorizontal: 24, paddingVertical: 18 }}>
          <View style={{ gap: 8 }}>
            <Text style={{ color: colors.subtext, fontSize: 12, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5 }}>Zen Wisdom</Text>
            <Text style={{ color: colors.subtext, fontSize: 15, lineHeight: 24, fontStyle: 'italic' }}>
              “Breathe in calm, breathe out stress. You are in control of your peace.”
            </Text>
          </View>
        </GlassCard>
      </Animated.View>
      
      <Animated.View style={{ opacity: cardOpacities[3], transform: [{ scale: cardScales[3] }] }}>
        <GlassCard colors={colors} color={colors.accent + '12'} style={{ borderColor: colors.accent + '40', marginBottom: 14, paddingHorizontal: 24, paddingVertical: 18 }}>
          <View style={{ gap: 8 }}>
            <Text style={{ color: colors.subtext, fontSize: 12, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5 }}>Wellness Score</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
              <Text style={{ color: colors.accent, fontSize: 42, fontWeight: '800' }}>{tokens}</Text>
              <Text style={{ color: colors.subtext, fontSize: 13 }}>Zen Tokens</Text>
            </View>
            <View style={{ height: 8, backgroundColor: colors.tileBg, borderRadius: 4, overflow: 'hidden', marginTop: 8 }}>
              <View style={{ height: '100%', width: `${Math.min((tokens / 500) * 100, 100)}%`, backgroundColor: colors.accent, borderRadius: 4 }} />
            </View>
            <Text style={{ color: colors.subtext, fontSize: 11, marginTop: 4 }}>Level: {getLevel(tokens)}</Text>
          </View>
        </GlassCard>
      </Animated.View>
    </ScrollView>
    </GradientBackground>
  );
};
