import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleTap = () => {
    if (!isPlaying) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTaps(prev => prev + 1);
  };

  const endGame = () => {
    setIsPlaying(false);
    if (taps > highScore) {
      setHighScore(taps);
    }
    
    // Reward based on performance
    let reward = 0;
    if (taps >= 100) reward = 20;
    else if (taps >= 80) reward = 15;
    else if (taps >= 60) reward = 10;
    else if (taps >= 40) reward = 5;
    else reward = 2;
    
    updateTokens(reward, 'tap_counter');
    Alert.alert('Time\'s Up!', `You tapped ${taps} times!\n+${reward} tokens`);
  };

  const insets = useSafeAreaInsets();
  
  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 68, paddingBottom: 40, alignItems: 'center' }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 10 }}>Tap Counter</Text>
      <Text style={{ color: colors.subtext, marginBottom: 30 }}>Tap as fast as you can in 10 seconds!</Text>
      
      <View style={{
        width: 280,
        padding: 30,
        backgroundColor: colors.tileBg,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 30
      }}>
        <Text style={{ fontSize: 18, color: colors.subtext, marginBottom: 10 }}>Time Left</Text>
        <Text style={{ fontSize: 60, fontWeight: 'bold', color: colors.accent }}>{timeLeft}s</Text>
        <Text style={{ fontSize: 18, color: colors.subtext, marginTop: 20, marginBottom: 10 }}>Taps</Text>
        <Text style={{ fontSize: 48, fontWeight: 'bold', color: colors.text }}>{taps}</Text>
      </View>
      
      {!isPlaying ? (
        <TouchableOpacity
          onPress={startGame}
          style={{
            backgroundColor: colors.accent,
            paddingVertical: 15,
            paddingHorizontal: 40,
            borderRadius: 25
          }}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>START</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={handleTap}
          style={{
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: colors.accent,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: colors.accent,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 20,
            elevation: 10
          }}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 24 }}>TAP!</Text>
        </TouchableOpacity>
      )}
      
      {highScore > 0 && (
        <View style={{ marginTop: 30, alignItems: 'center' }}>
          <Text style={{ color: colors.subtext, fontSize: 14 }}>High Score</Text>
          <Text style={{ color: colors.accent, fontSize: 32, fontWeight: 'bold' }}>{highScore}</Text>
        </View>
      )}
    </ScrollView>
  );
};
