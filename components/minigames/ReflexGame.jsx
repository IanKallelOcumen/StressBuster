import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Animated, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const ReflexGame = ({ onBack, colors, updateTokens }) => {
  const [gameState, setGameState] = useState('idle'); // idle, waiting, active, finished
  const [time, setTime] = useState(0);
  const [reaction, setReaction] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [bestTime, setBestTime] = useState(null);
  const scaleAnim = new Animated.Value(1);
  const insets = useSafeAreaInsets();

  const start = () => {
    setGameState('waiting');
    setReaction(null);
    setStartTime(null);
    const delay = Math.random() * 2000 + 1000;
    setTimeout(() => {
      setGameState('active');
      setStartTime(Date.now());
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, delay);
  };

  const tap = () => {
    if (gameState === 'waiting') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      setGameState('finished');
      setReaction('Too fast! Wait for the signal.');
      return;
    }

    if (gameState === 'active') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const elapsed = Date.now() - startTime;
      setReaction(elapsed);
      setGameState('finished');
      setAttempts(a => a + 1);
      
      if (!bestTime || elapsed < bestTime) {
        setBestTime(elapsed);
      }

      updateTokens(Math.max(1, Math.floor((500 - elapsed) / 100)), 'reflex_game');

      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.15, duration: 100, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true })
      ]).start();
    }
  };

  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 68, paddingHorizontal: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
      <View style={{ gap: 20, alignItems: 'center' }}>
        <View style={{ gap: 8, alignItems: 'center' }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text }}>Reflex Tester</Text>
          <Text style={{ fontSize: 13, color: colors.subtext }}>Test your reaction time</Text>
        </View>

        <Animated.View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: gameState === 'waiting' ? colors.icon.red : gameState === 'active' ? colors.icon.green : colors.accent,
            justifyContent: 'center',
            alignItems: 'center',
            transform: [{ scale: scaleAnim }],
            marginVertical: 20
          }}>
          {gameState === 'idle' && <Text style={{ fontSize: 40 }}>👆</Text>}
          {gameState === 'waiting' && <Text style={{ fontSize: 40 }}>⏳</Text>}
          {gameState === 'active' && <Text style={{ fontSize: 40 }}>🎯</Text>}
          {gameState === 'finished' && <Text style={{ fontSize: 40 }}>✓</Text>}
        </Animated.View>

        {reaction && typeof reaction === 'number' && (
          <View style={{ backgroundColor: colors.accent + '12', borderColor: colors.accent, borderWidth: 2, borderRadius: 16, paddingVertical: 16, paddingHorizontal: 20, alignItems: 'center', gap: 8, width: '100%' }}>
            <Text style={{ color: colors.subtext, fontSize: 12 }}>Your Time</Text>
            <Text style={{ color: colors.accent, fontSize: 40, fontWeight: '800', fontFamily: 'monospace' }}>
              {reaction}ms
            </Text>
            {bestTime && <Text style={{ color: colors.subtext, fontSize: 12 }}>Best: {bestTime}ms</Text>}
          </View>
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
            shadowColor: colors.accent,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4
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
  );
};
