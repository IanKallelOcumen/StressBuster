import { useEffect, useRef, useState } from 'react';
import { Animated, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { safeHaptics, ImpactFeedbackStyle, NotificationFeedbackType } from '../../utils/haptics';
import { scaleMinigameReward } from '../../utils/zenTokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassCard from '../ui/GlassCard';
import GradientBackground from '../ui/GradientBackground';

export const ReflexGame = ({ onBack, colors, updateTokens, sfxEnabled }) => {
  const [gameState, setGameState] = useState('idle'); // idle, waiting, active, finished
  const [time, setTime] = useState(0);
  const [reaction, setReaction] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [bestTime, setBestTime] = useState(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const timeoutRef = useRef(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const start = () => {
    setGameState('waiting');
    setReaction(null);
    setStartTime(null);
    const delay = Math.random() * 2000 + 1000;
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      setGameState('active');
      setStartTime(Date.now());
      if (sfxEnabled) safeHaptics.notificationAsync(NotificationFeedbackType.Success);
    }, delay);
  };

  const tap = () => {
    if (gameState === 'waiting') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (sfxEnabled) safeHaptics.notificationAsync(NotificationFeedbackType.Warning);
      setGameState('finished');
      setReaction('Too fast! Wait for the signal.');
      return;
    }

    if (gameState === 'active') {
      if (sfxEnabled) safeHaptics.impactAsync(ImpactFeedbackStyle.Medium);
      const elapsed = Date.now() - startTime;
      setReaction(elapsed);
      setGameState('finished');
      setAttempts(a => a + 1);
      
      if (!bestTime || elapsed < bestTime) {
        setBestTime(elapsed);
      }

      updateTokens(scaleMinigameReward(Math.max(1, Math.floor((500 - elapsed) / 100))), 'reflex_game');

      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.15, duration: 100, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: Platform.OS !== 'web' })
      ]).start();
    }
  };

  return (
    <GradientBackground colors={colors}>
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 68, paddingHorizontal: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
      <View style={{ gap: 20, alignItems: 'center' }}>
        <View style={{ gap: 8, alignItems: 'center' }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text }}>Reflex Tester</Text>
          <Text style={{ fontSize: 13, color: colors.subtext }}>Test your reaction time</Text>
        </View>

        <Animated.View style={{ transform: [{ scale: scaleAnim }], marginVertical: 20 }}>
          <TouchableOpacity onPress={gameState === 'idle' ? start : tap} activeOpacity={0.8}>
            <GlassCard
              colors={colors}
              color={gameState === 'waiting' ? colors.icon.red : gameState === 'active' ? colors.icon.green : colors.accent}
              intensity={40}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {gameState === 'idle' && <Text style={{ fontSize: 40 }}>👆</Text>}
              {gameState === 'waiting' && <Text style={{ fontSize: 40 }}>⏳</Text>}
              {gameState === 'active' && <Text style={{ fontSize: 40 }}>🎯</Text>}
              {gameState === 'finished' && <Text style={{ fontSize: 40 }}>✓</Text>}
            </GlassCard>
          </TouchableOpacity>
        </Animated.View>

        {reaction && typeof reaction === 'number' && (
          <GlassCard colors={colors} color={colors.accent} style={{ borderRadius: 16, paddingVertical: 16, paddingHorizontal: 20, alignItems: 'center', gap: 8, width: '100%' }}>
            <Text style={{ color: colors.subtext, fontSize: 12 }}>Your Time</Text>
            <Text style={{ color: colors.accent, fontSize: 40, fontWeight: '800', fontFamily: 'monospace' }}>
              {reaction}ms
            </Text>
            {bestTime && <Text style={{ color: colors.subtext, fontSize: 12 }}>Best: {bestTime}ms</Text>}
          </GlassCard>
        )}

        {typeof reaction === 'string' && (
          <View style={{ backgroundColor: colors.icon.red + '12', borderColor: colors.icon.red, borderWidth: 2, borderRadius: 16, paddingVertical: 16, paddingHorizontal: 20, alignItems: 'center', width: '100%' }}>
            <Text style={{ color: colors.icon.red, fontSize: 14, fontWeight: '600', textAlign: 'center' }}>{reaction}</Text>
          </View>
        )}

        <TouchableOpacity
          onPress={gameState === 'idle' || gameState === 'finished' ? start : tap}
          style={{
            backgroundColor: colors.accent,
            paddingVertical: 16,
            paddingHorizontal: 60,
            borderRadius: 12,
            width: '100%',
            alignItems: 'center',
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
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>
            {gameState === 'active' ? 'TAP NOW!' : 'Start'}
          </Text>
        </TouchableOpacity>

        <View style={{ backgroundColor: colors.tileBg, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, width: '100%', gap: 4 }}>
          <Text style={{ color: colors.subtext, fontSize: 13, fontWeight: '600' }}>Stats</Text>
          <Text style={{ color: colors.subtext, fontSize: 12 }}>Attempts: {attempts}</Text>
          {bestTime && <Text style={{ color: colors.accent, fontSize: 12, fontWeight: '600' }}>Best Time: {bestTime}ms</Text>}
        </View>
      </View>
    </ScrollView>
    </GradientBackground>
  );
};
