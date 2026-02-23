import { useEffect, useRef, useState } from 'react';
import { Animated, Platform, Text, TouchableOpacity, View } from 'react-native';
import { safeHaptics, NotificationFeedbackType } from '../../utils/haptics';
import { scaleMinigameReward } from '../../utils/zenTokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassCard from '../ui/GlassCard';
import GradientBackground from '../ui/GradientBackground';

export const SpeedTap = ({ onBack, colors, updateTokens, sfxEnabled }) => {
  const insets = useSafeAreaInsets();
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
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: Platform.OS !== 'web' }).start();
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
      if (sfxEnabled) safeHaptics.notificationAsync(NotificationFeedbackType.Success);
      if (currentNum === 9) {
        setGameComplete(true);
        const reward = scaleMinigameReward(Math.max(1, Math.floor(30 / time)));
        updateTokens(reward);
      } else {
        setCurrentNum(currentNum + 1);
      }
    } else {
      if (sfxEnabled) safeHaptics.notificationAsync(NotificationFeedbackType.Warning);
    }
  };

  return (
    <GradientBackground colors={colors}>
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: insets.top + 68, paddingHorizontal: 16, paddingBottom: 20 }}>
        <Text style={{ fontSize: 32, fontWeight: '800', color: colors.text, marginBottom: 20 }}>Speed Tap</Text>

        {!gameComplete ? (
          <View style={{ alignItems: 'center', width: '100%', gap: 24 }}>
            <GlassCard
              colors={colors}
              color={colors.tileBg}
              style={{ flexDirection: 'row', gap: 20, alignItems: 'center', padding: 15, borderRadius: 16 }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: colors.subtext, fontSize: 11, fontWeight: '600' }}>Next</Text>
                <Text style={{ color: colors.accent, fontSize: 32, fontWeight: '800' }}>{currentNum}</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: colors.subtext, fontSize: 11, fontWeight: '600' }}>Time</Text>
                <Text style={{ color: colors.accent, fontSize: 32, fontWeight: '800' }}>{time.toFixed(2)}s</Text>
              </View>
            </GlassCard>

            <GlassCard
              colors={colors}
              color={colors.tileBg}
              style={{
                width: '100%',
                height: 320,
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
                  }}>
                  <GlassCard
                    colors={colors}
                    color={num <= currentNum ? colors.accent : colors.tileBg}
                    intensity={num < currentNum ? 10 : 30}
                    style={{
                      flex: 1,
                      borderRadius: 12,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: 2,
                      borderColor: num === currentNum ? colors.accent : colors.accent + '40',
                      opacity: num < currentNum ? 0.5 : 1
                    }}>
                    <Text style={{ color: colors.text, fontSize: 28, fontWeight: '800' }}>{num}</Text>
                  </GlassCard>
                </TouchableOpacity>
              ))}
            </GlassCard>
          </View>
        ) : (
          <Animated.View style={{ alignItems: 'center', gap: 16, transform: [{ scale: scaleAnim }] }}>
            <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text }}>Blazing Fast! 🔥</Text>
            <GlassCard colors={colors} color={colors.accent} style={{ borderRadius: 12, paddingVertical: 16, paddingHorizontal: 24, alignItems: 'center' }}>
              <Text style={{ color: colors.accent, fontSize: 40, fontWeight: '800' }}>{time.toFixed(2)}s</Text>
              <Text style={{ color: colors.subtext, fontSize: 12, fontWeight: '600', marginTop: 4 }}>completed in</Text>
              <Text style={{ color: colors.accent, fontSize: 18, fontWeight: '700', marginTop: 12 }}>+{Math.max(1, Math.floor(30 / time))} tokens</Text>
            </GlassCard>
          </Animated.View>
        )}
      </View>
    </GradientBackground>
  );
};
