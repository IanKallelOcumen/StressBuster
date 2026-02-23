import { useEffect, useRef, useState } from 'react';
import { Animated, Platform, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { safeHaptics, ImpactFeedbackStyle } from '../../utils/haptics';
import { scaleMinigameReward } from '../../utils/zenTokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassCard from '../ui/GlassCard';
import GradientBackground from '../ui/GradientBackground';

export const BubbleGame = ({ onBack, colors, updateTokens, sfxEnabled }) => {
  const [bubbles, setBubbles] = useState(
    Array.from({ length: 15 }, (_, i) => ({ id: i, visible: true }))
  );
  const [totalPopped, setTotalPopped] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: Platform.OS !== 'web' }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: Platform.OS !== 'web' })
    ]).start();
  }, [fadeAnim, slideAnim]);

  const pop = id => {
    if (sfxEnabled) safeHaptics.impactAsync(ImpactFeedbackStyle.Light);
    setBubbles(p => p.map(x => x.id === id ? { ...x, visible: false } : x));
    setTotalPopped(totalPopped + 1);
    updateTokens(scaleMinigameReward(1), "bubble_pop");
    
    setTimeout(() => {
      setBubbles(p => p.map(x => x.id === id ? { ...x, visible: true } : x));
    }, 2000);
  };

  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const gridWidth = Math.min(width - 32, 320);
  const bubbleSize = Math.floor((gridWidth - 36) / 4);
  
  return (
    <GradientBackground colors={colors}>
    <Animated.ScrollView 
      contentContainerStyle={{ paddingTop: insets.top + 68, paddingHorizontal: 16, paddingBottom: 40, alignItems: 'center' }}
      style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
    >
      <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 10 }}>Pop Bubbles</Text>
      <Text style={{ color: colors.subtext, marginBottom: 10 }}>Pop for stress relief (+1 Token each)</Text>
      <GlassCard colors={colors} color={colors.tileBg} style={{ paddingHorizontal: 20, paddingVertical: 10, borderRadius: 16, marginBottom: 20 }}>
        <Text style={{ color: colors.accent, fontWeight: 'bold' }}>Popped: {totalPopped}</Text>
      </GlassCard>
      
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: gridWidth, justifyContent: 'center', gap: 12 }}>
        {bubbles.map(x => (
          <TouchableOpacity
            key={x.id}
            onPress={() => pop(x.id)}
            style={{
              width: bubbleSize,
              height: bubbleSize,
              backgroundColor: x.visible ? colors.icon.green : 'transparent',
              borderRadius: bubbleSize / 2,
              borderWidth: x.visible ? 0 : 2,
              borderColor: x.visible ? 'transparent' : colors.icon.green + '40'
            }}
          />
        ))}
      </View>
    </Animated.ScrollView>
    </GradientBackground>
  );
};
