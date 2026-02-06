import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';

const BackButton = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      position: 'absolute',
      top: 16,
      left: 16,
      zIndex: 999,
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 8,
      padding: 8
    }}>
    <Text style={{ fontSize: 20 }}>←</Text>
  </TouchableOpacity>
);

export const BalanceGame = ({ onBack, colors, updateTokens }) => {
  const [balance, setBalance] = useState(50);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(true);
  const [time, setTime] = useState(30);
  const [feedback, setFeedback] = useState('');
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!gameActive) {
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
    }
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive || time <= 0) {
      setGameActive(false);
      const reward = Math.max(1, Math.floor(score / 5));
      updateTokens(reward);
      return;
    }

    const timer = setInterval(() => setTime(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [gameActive, time, score]);

  useEffect(() => {
    const decay = setInterval(() => {
      setBalance(b => {
        const newBalance = b + (Math.random() - 0.5) * 8;
        const target = 50;
        const improvement = Math.abs(target - newBalance);

        if (improvement < 10) {
          setScore(s => s + 1);
          setFeedback('✓ Balanced!');
          setTimeout(() => setFeedback(''), 600);
        }

        return Math.max(10, Math.min(90, newBalance));
      });
    }, 300);

    return () => clearInterval(decay);
  }, [gameActive]);

  const handleTap = async (direction) => {
    if (!gameActive) return;

    await Haptics.selectionAsync();
    if (direction === 'left') {
      setBalance(b => Math.max(10, b - 15));
    } else {
      setBalance(b => Math.min(90, b + 15));
    }
  };

  const isBalanced = Math.abs(balance - 50) < 12;

  return (
    <View style={{ flex: 1, backgroundColor: colors.screenBg, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <BackButton onPress={onBack} />

      <Text style={{ fontSize: 32, fontWeight: '800', color: colors.text, marginBottom: 20 }}>Balance Beam</Text>

      {gameActive ? (
        <View style={{ alignItems: 'center', width: '100%', gap: 30 }}>
          <View style={{ flexDirection: 'row', gap: 20 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: colors.subtext, fontSize: 11, fontWeight: '600' }}>Score</Text>
              <Text style={{ color: colors.accent, fontSize: 28, fontWeight: '800' }}>{score}</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: colors.subtext, fontSize: 11, fontWeight: '600' }}>Time</Text>
              <Text style={{ color: colors.accent, fontSize: 28, fontWeight: '800' }}>{time}</Text>
            </View>
          </View>

          <View style={{ alignItems: 'center', gap: 8, width: '100%' }}>
            <Text style={{ color: colors.subtext, fontSize: 12, fontWeight: '600' }}>Keep it balanced ⚖️</Text>
            
            <View style={{
              width: '100%',
              height: 12,
              backgroundColor: colors.tileBg,
              borderRadius: 6,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: colors.accent + '40'
            }}>
              <View style={{
                width: `${balance}%`,
                height: '100%',
                backgroundColor: isBalanced ? colors.accent : colors.icon.orange,
                borderRadius: 6
              }} />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <Text style={{ color: colors.subtext, fontSize: 10 }}>Left</Text>
              <Text style={{ color: isBalanced ? colors.accent : colors.icon.orange, fontSize: 10, fontWeight: '600' }}>
                {Math.abs(balance - 50).toFixed(0)}% off
              </Text>
              <Text style={{ color: colors.subtext, fontSize: 10 }}>Right</Text>
            </View>
          </View>

          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.accent, height: 20 }}>
            {feedback}
          </Text>

          <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
            <TouchableOpacity
              onPress={() => handleTap('left')}
              style={{
                flex: 1,
                backgroundColor: colors.tileBg,
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: 'center',
                borderWidth: 2,
                borderColor: colors.accent + '40'
              }}>
              <Text style={{ fontSize: 24 }}>←</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleTap('right')}
              style={{
                flex: 1,
                backgroundColor: colors.tileBg,
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: 'center',
                borderWidth: 2,
                borderColor: colors.accent + '40'
              }}>
              <Text style={{ fontSize: 24 }}>→</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Animated.View style={{ alignItems: 'center', gap: 16, transform: [{ scale: scaleAnim }] }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text }}>Game Over!</Text>
          <View style={{ backgroundColor: colors.accent + '20', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 24, alignItems: 'center' }}>
            <Text style={{ color: colors.subtext, fontSize: 12, fontWeight: '600' }}>Final Score</Text>
            <Text style={{ color: colors.accent, fontSize: 40, fontWeight: '800' }}>{score}</Text>
            <Text style={{ color: colors.accent, fontSize: 14, fontWeight: '600', marginTop: 8 }}>+{Math.max(1, Math.floor(score / 5))} tokens</Text>
          </View>
          <TouchableOpacity
            onPress={onBack}
            style={{ backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24, marginTop: 16 }}>
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>Back to Games</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};
