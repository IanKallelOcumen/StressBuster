import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Platform, Text, TouchableOpacity, View } from 'react-native';
import { safeHaptics, NotificationFeedbackType } from '../../utils/haptics';
import { scaleMinigameReward } from '../../utils/zenTokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassCard from '../ui/GlassCard';
import GradientBackground from '../ui/GradientBackground';

const colorMap = {
  'Red': '#FF6B6B',
  'Blue': '#4A90E2',
  'Green': '#2ECC71',
  'Yellow': '#F1C40F',
  'Purple': '#9B59B6',
  'Orange': '#E67E22'
};

export const ColorMatch = ({ onBack, colors, updateTokens, sfxEnabled }) => {
  const insets = useSafeAreaInsets();
  const colorNames = useMemo(() => Object.keys(colorMap), []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (gameWon) {
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: Platform.OS !== 'web' }).start();
    }
  }, [gameWon]);

  const currentColor = colorNames[currentIndex];
  
  const options = useMemo(() => {
    const wrongColors = colorNames
      .filter(c => c !== currentColor)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    return [currentColor, ...wrongColors].sort(() => Math.random() - 0.5);
  }, [currentIndex, currentColor, colorNames]);

  const handleTap = async (colorName) => {
    const newMoves = moves + 1;
    setMoves(newMoves);

    if (colorName === currentColor) {
      if (sfxEnabled) safeHaptics.notificationAsync(NotificationFeedbackType.Success);
      const newScore = score + 1;
      setScore(newScore);

      if (newScore === 6) {
        const reward = scaleMinigameReward(Math.max(1, 10 - newMoves));
        setGameWon(true);
        updateTokens(reward);
      } else {
        setCurrentIndex((currentIndex + 1) % colorNames.length);
      }
    } else {
      if (sfxEnabled) safeHaptics.notificationAsync(NotificationFeedbackType.Warning);
    }
  };

  return (
    <GradientBackground colors={colors}>
    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: insets.top + 68, paddingHorizontal: 16, paddingBottom: 20 }}>
      <Text style={{ fontSize: 32, fontWeight: '800', color: colors.text, marginBottom: 30 }}>Color Match</Text>

      {!gameWon ? (
        <View style={{ alignItems: 'center', gap: 30, width: '100%' }}>
          <GlassCard
            colors={colors}
            color={colors.tileBg}
            style={{ flexDirection: 'row', gap: 20, padding: 15, borderRadius: 16 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: colors.subtext, fontSize: 11, fontWeight: '600' }}>Score</Text>
              <Text style={{ color: colors.accent, fontSize: 28, fontWeight: '800' }}>{score}/6</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: colors.subtext, fontSize: 11, fontWeight: '600' }}>Moves</Text>
              <Text style={{ color: colors.accent, fontSize: 28, fontWeight: '800' }}>{moves}</Text>
            </View>
          </GlassCard>

          <View style={{
            width: 140,
            height: 140,
            borderRadius: 20,
            backgroundColor: colorMap[currentColor],
            borderWidth: 4,
            borderColor: colors.accent,
            ...(Platform.OS === 'web' ? {
              boxShadow: `0 8px 12px 0 ${colorMap[currentColor]}66`,
            } : {
              shadowColor: colorMap[currentColor],
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 8
            })
          }} />

          <Text style={{ color: colors.subtext, fontSize: 14, fontWeight: '600' }}>Tap the color name:</Text>

          <View style={{ gap: 10, width: '100%' }}>
            {options.map((opt, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => handleTap(opt)}
                style={{ width: '100%' }}>
                <GlassCard
                  colors={colors}
                  color={colors.tileBg}
                  style={{
                    borderRadius: 12,
                    paddingVertical: 14,
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: colors.accent + '40'
                  }}>
                  <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>{opt}</Text>
                </GlassCard>
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
        </Animated.View>
      )}
    </View>
    </GradientBackground>
  );
};
