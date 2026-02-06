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

export const SpeedTap = ({ onBack, colors, updateTokens }) => {
  const [currentNum, setCurrentNum] = useState(1);
  const [startTime] = useState(Date.now());
  const [time, setTime] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const [buttons, setButtons] = useState(
    Array.from({ length: 9 }, (_, i) => ({ num: i + 1, pos: Math.random() }))
      .sort((a, b) => a.pos - b.pos)
  );

  useEffect(() => {
    if (gameComplete) {
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
    }
  }, [gameComplete]);

  useEffect(() => {
    if (!gameComplete) {
      const timer = setInterval(() => setTime((Date.now() - startTime) / 1000), 10);
      return () => clearInterval(timer);
    }
  }, [gameComplete, startTime]);

  const handleTap = async (num) => {
    if (gameComplete) return;

    if (num === currentNum) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (currentNum === 9) {
        setGameComplete(true);
        const reward = Math.max(1, Math.floor(30 / time));
        updateTokens(reward);
      } else {
        setCurrentNum(currentNum + 1);
      }
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.screenBg, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <BackButton onPress={onBack} />

      <Text style={{ fontSize: 32, fontWeight: '800', color: colors.text, marginBottom: 20 }}>Speed Tap</Text>

      {!gameComplete ? (
        <View style={{ alignItems: 'center', width: '100%', gap: 24 }}>
          <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: colors.subtext, fontSize: 11, fontWeight: '600' }}>Next</Text>
              <Text style={{ color: colors.accent, fontSize: 32, fontWeight: '800' }}>{currentNum}</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: colors.subtext, fontSize: 11, fontWeight: '600' }}>Time</Text>
              <Text style={{ color: colors.accent, fontSize: 32, fontWeight: '800' }}>{time.toFixed(2)}s</Text>
            </View>
          </View>

          <View style={{
            width: '100%',
            height: 320,
            backgroundColor: colors.tileBg,
            borderRadius: 16,
            padding: 12,
            flexWrap: 'wrap',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignContent: 'space-between'
          }}>
            {buttons.map(({ num }) => (
              <TouchableOpacity
                key={num}
                onPress={() => handleTap(num)}
                style={{
                  width: '31%',
                  height: 90,
                  backgroundColor: num <= currentNum ? colors.accent + '30' : colors.accent + '10',
                  borderRadius: 12,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: num === currentNum ? colors.accent : colors.accent + '40',
                  opacity: num < currentNum ? 0.5 : 1
                }}>
                <Text style={{ color: colors.text, fontSize: 28, fontWeight: '800' }}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <Animated.View style={{ alignItems: 'center', gap: 16, transform: [{ scale: scaleAnim }] }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text }}>Blazing Fast! 🔥</Text>
          <View style={{ backgroundColor: colors.accent + '20', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 24, alignItems: 'center' }}>
            <Text style={{ color: colors.accent, fontSize: 40, fontWeight: '800' }}>{time.toFixed(2)}s</Text>
            <Text style={{ color: colors.subtext, fontSize: 12, fontWeight: '600', marginTop: 4 }}>completed in</Text>
            <Text style={{ color: colors.accent, fontSize: 18, fontWeight: '700', marginTop: 12 }}>+{Math.max(1, Math.floor(30 / time))} tokens</Text>
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
