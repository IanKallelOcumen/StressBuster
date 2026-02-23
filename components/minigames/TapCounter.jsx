import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { safeHaptics, ImpactFeedbackStyle } from '../../utils/haptics';
import { scaleMinigameReward } from '../../utils/zenTokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassCard from '../ui/GlassCard';
import GradientBackground from '../ui/GradientBackground';

export const TapCounter = ({ onBack, colors, updateTokens }) => {
  const [taps, setTaps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      endGame();
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    setTaps(0);
    setTimeLeft(10);
    setIsPlaying(true);
    safeHaptics.impactAsync(ImpactFeedbackStyle.Medium);
  };

  const handleTap = () => {
    if (!isPlaying) return;
    safeHaptics.impactAsync(ImpactFeedbackStyle.Light);
    setTaps(prev => prev + 1);
  };

  const endGame = () => {
    setIsPlaying(false);
    if (taps > highScore) {
      setHighScore(taps);
    }
    
    // Reward based on performance (scaled to reduce token distribution)
    let raw = 0;
    if (taps >= 100) raw = 20;
    else if (taps >= 80) raw = 15;
    else if (taps >= 60) raw = 10;
    else if (taps >= 40) raw = 5;
    else raw = 2;
    const reward = scaleMinigameReward(raw);
    updateTokens(reward, 'tap_counter');
    Alert.alert('Time\'s Up!', `You tapped ${taps} times!\n+${reward} tokens`);
  };

  const insets = useSafeAreaInsets();
  
  return (
    <GradientBackground colors={colors}>
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 68, paddingHorizontal: 16, paddingBottom: 40, alignItems: 'center' }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 10 }}>Tap Counter</Text>
      <Text style={{ color: colors.subtext, marginBottom: 30 }}>Tap as fast as you can in 10 seconds!</Text>
      
      <GlassCard
        colors={colors}
        color={colors.tileBg}
        style={{
        width: '100%',
        maxWidth: 360,
        padding: 30,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 30
      }}>
        <Text style={{ fontSize: 18, color: colors.subtext, marginBottom: 10 }}>Time Left</Text>
        <Text style={{ fontSize: 60, fontWeight: 'bold', color: colors.accent }}>{timeLeft}s</Text>
        <Text style={{ fontSize: 18, color: colors.subtext, marginTop: 20, marginBottom: 10 }}>Taps</Text>
        <Text style={{ fontSize: 48, fontWeight: 'bold', color: colors.text }}>{taps}</Text>
      </GlassCard>
      
      {!isPlaying ? (
        <TouchableOpacity
          onPress={startGame}
          style={{ width: '100%', alignItems: 'center' }}>
          <GlassCard
            colors={colors}
            color={colors.accent}
            style={{
              paddingVertical: 15,
              paddingHorizontal: 40,
              borderRadius: 25,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>START</Text>
          </GlassCard>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={handleTap}
          style={{
            width: 200,
            height: 200,
            borderRadius: 100,
          }}>
          <GlassCard
            colors={colors}
            color={colors.accent}
            intensity={40}
            style={{
              flex: 1,
              borderRadius: 100,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 4,
              borderColor: '#ffffff50'
            }}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 32 }}>TAP!</Text>
          </GlassCard>
        </TouchableOpacity>
      )}
      
      {highScore > 0 && (
        <View style={{ marginTop: 30, alignItems: 'center' }}>
          <Text style={{ color: colors.subtext, fontSize: 14 }}>High Score</Text>
          <Text style={{ color: colors.accent, fontSize: 32, fontWeight: 'bold' }}>{highScore}</Text>
        </View>
      )}
    </ScrollView>
    </GradientBackground>
  );
};
