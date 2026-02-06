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

const colorMap = {
  'Red': '#FF6B6B',
  'Blue': '#4A90E2',
  'Green': '#2ECC71',
  'Yellow': '#F1C40F',
  'Purple': '#9B59B6',
  'Orange': '#E67E22'
};

export const ColorMatch = ({ onBack, colors, updateTokens }) => {
  const colorNames = Object.keys(colorMap);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (gameWon) {
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
    }
  }, [gameWon]);

  const currentColor = colorNames[currentIndex];
  const wrongColors = colorNames
    .filter(c => c !== currentColor)
    .sort(() => Math.random() - 0.5)
    .slice(0, 2);
  const options = [currentColor, ...wrongColors].sort(() => Math.random() - 0.5);

  const handleTap = async (colorName) => {
    const newMoves = moves + 1;
    setMoves(newMoves);

    if (colorName === currentColor) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const newScore = score + 1;
      setScore(newScore);

      if (newScore === 6) {
        const reward = Math.max(1, 10 - newMoves);
        setGameWon(true);
        updateTokens(reward);
      } else {
        setCurrentIndex((currentIndex + 1) % colorNames.length);
      }
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.screenBg, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <BackButton onPress={onBack} />

      <Text style={{ fontSize: 32, fontWeight: '800', color: colors.text, marginBottom: 30 }}>Color Match</Text>

      {!gameWon ? (
        <View style={{ alignItems: 'center', gap: 30, width: '100%' }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: colors.subtext, fontSize: 11, fontWeight: '600' }}>Score</Text>
              <Text style={{ color: colors.accent, fontSize: 28, fontWeight: '800' }}>{score}/6</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: colors.subtext, fontSize: 11, fontWeight: '600' }}>Moves</Text>
              <Text style={{ color: colors.accent, fontSize: 28, fontWeight: '800' }}>{moves}</Text>
            </View>
          </View>

          <View style={{
            width: 140,
            height: 140,
            borderRadius: 20,
            backgroundColor: colorMap[currentColor],
            borderWidth: 4,
            borderColor: colors.accent,
            shadowColor: colorMap[currentColor],
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 8
          }} />

          <Text style={{ color: colors.subtext, fontSize: 14, fontWeight: '600' }}>Tap the color name:</Text>

          <View style={{ gap: 10, width: '100%' }}>
            {options.map((opt, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => handleTap(opt)}
                style={{
                  backgroundColor: colors.tileBg,
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: colors.accent + '40'
                }}>
                <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <Animated.View style={{ alignItems: 'center', gap: 16, transform: [{ scale: scaleAnim }] }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text }}>Perfect Match! 🎨</Text>
          <View style={{ backgroundColor: colors.accent + '20', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 24, alignItems: 'center' }}>
            <Text style={{ color: colors.accent, fontSize: 36, fontWeight: '800' }}>{Math.max(1, 10 - moves)}</Text>
            <Text style={{ color: colors.subtext, fontSize: 12, fontWeight: '600', marginTop: 4 }}>tokens earned</Text>
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
