import { useEffect, useRef, useState } from 'react';
import { Animated, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { safeHaptics, NotificationFeedbackType } from '../../utils/haptics';
import { scaleMinigameReward } from '../../utils/zenTokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassCard from '../ui/GlassCard';
import GradientBackground from '../ui/GradientBackground';

export const NumberGuesser = ({ onBack, colors, updateTokens, sfxEnabled }) => {
  const [secret, setSecret] = useState(0);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState('I\'m thinking of a number between 1-100');
  const [gameWon, setGameWon] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setSecret(Math.floor(Math.random() * 100) + 1);
  }, []);

  const handleGuess = () => {
    if (!guess.trim()) return;
    const num = parseInt(guess);
    setAttempts(a => a + 1);
    
    if (num === secret) {
      if (sfxEnabled) safeHaptics.notificationAsync(NotificationFeedbackType.Success);
      setMessage(`🎉 Correct! It took ${attempts + 1} attempts!`);
      setGameWon(true);
      updateTokens(scaleMinigameReward(Math.max(1, 5 - attempts)), 'number_guessing');
      const useNative = Platform.OS !== 'web';
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.1, duration: 100, useNativeDriver: useNative }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: useNative })
      ]).start();
    } else if (num > secret) {
      if (sfxEnabled) safeHaptics.notificationAsync(NotificationFeedbackType.Warning);
      setMessage('📉 Too high! Try lower');
      setGuess('');
    } else {
      if (sfxEnabled) safeHaptics.notificationAsync(NotificationFeedbackType.Warning);
      setMessage('📈 Too low! Try higher');
      setGuess('');
    }
  };

  const reset = () => {
    setSecret(Math.floor(Math.random() * 100) + 1);
    setGuess('');
    setAttempts(0);
    setMessage('I\'m thinking of a number between 1-100');
    setGameWon(false);
  };

  return (
    <GradientBackground colors={colors}>
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 68, paddingHorizontal: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
      <View style={{ gap: 20 }}>
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text }}>Number Guesser</Text>
          <Text style={{ fontSize: 13, color: colors.subtext }}>Can you guess the secret number?</Text>
        </View>

        <Animated.View style={{ width: '100%', transform: [{ scale: scaleAnim }] }}>
          <GlassCard
            colors={colors}
            color={colors.accent}
            intensity={20}
            style={{
              borderWidth: 2,
              borderColor: colors.accent,
              borderRadius: 16,
              padding: 20,
              alignItems: 'center',
              gap: 16
            }}>
            <Text style={{ fontSize: 48 }}>🎯</Text>
            <Text style={{ color: colors.text, fontSize: 16, textAlign: 'center', lineHeight: 24 }}>{message}</Text>
            <Text style={{ color: colors.subtext, fontSize: 13 }}>Attempts: {attempts}</Text>
          </GlassCard>
        </Animated.View>

        {!gameWon && (
          <>
            <View style={{ gap: 10 }}>
              <TextInput
                value={guess}
                onChangeText={setGuess}
                placeholder="Enter your guess"
                placeholderTextColor={colors.subtext}
                keyboardType="number-pad"
                editable={!gameWon}
                style={{
                  backgroundColor: colors.tileBg,
                  borderColor: colors.accent + '20',
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  color: colors.text,
                  fontSize: 16
                }}
              />
              <TouchableOpacity
                onPress={handleGuess}
                style={{ width: '100%' }}>
                <GlassCard
                  colors={colors}
                  color={colors.accent}
                  style={{
                    paddingVertical: 13,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%'
                  }}>
                  <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>Guess</Text>
                </GlassCard>
              </TouchableOpacity>
            </View>
          </>
        )}

        {gameWon && (
          <TouchableOpacity
            onPress={reset}
            style={{ width: '100%' }}>
            <GlassCard
              colors={colors}
              color={colors.accent}
              style={{
                paddingVertical: 13,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%'
              }}>
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>Play Again</Text>
            </GlassCard>
          </TouchableOpacity>
        )}

        <View style={{ backgroundColor: colors.tileBg, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 }}>
          <Text style={{ color: colors.subtext, fontSize: 12, lineHeight: 18, textAlign: 'center' }}>
            💡 Fewer attempts = more tokens!
          </Text>
        </View>
      </View>
    </ScrollView>
    </GradientBackground>
  );
};
