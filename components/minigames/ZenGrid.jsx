import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Platform, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { safeHaptics, ImpactFeedbackStyle } from '../../utils/haptics';
import { scaleMinigameReward } from '../../utils/zenTokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassCard from '../ui/GlassCard';
import GradientBackground from '../ui/GradientBackground';

export const GridGame = ({ onBack, colors, updateTokens, sfxEnabled }) => {
  const [grid, setGrid] = useState(Array(16).fill(false));
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: Platform.OS !== 'web' }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 8, useNativeDriver: Platform.OS !== 'web' })
    ]).start();
  }, [fadeAnim, scaleAnim]);

  const toggle = i => {
    if (sfxEnabled) safeHaptics.impactAsync(ImpactFeedbackStyle.Light);
    const newG = [...grid];
    newG[i] = !newG[i];
    setGrid(newG);
    
    if (newG.every(Boolean)) {
      const reward = scaleMinigameReward(10);
      updateTokens(reward, "grid_win");
      Alert.alert("Bright!", `You lit up the whole grid! +${reward} Tokens`);
      setGrid(Array(16).fill(false));
    }
  };

  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const gridSize = Math.min(width - 32, 360);
  const gapSize = 8;
  const tileSize = Math.floor((gridSize - gapSize * 3) / 4);
  
  return (
    <GradientBackground colors={colors}>
    <Animated.ScrollView 
      contentContainerStyle={{ paddingTop: insets.top + 68, paddingHorizontal: 16, paddingBottom: 40, alignItems: 'center' }}
      style={{ opacity: fadeAnim }}
    >
      <Animated.View style={{ alignItems: 'center', transform: [{ scale: scaleAnim }] }}>
        <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 10 }}>Zen Grid</Text>
        <Text style={{ color: colors.subtext, marginBottom: 30, fontSize: 13 }}>Light up all squares</Text>
      </Animated.View>
      
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: gridSize, justifyContent: 'center', gap: gapSize }}>
        {grid.map((on, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => toggle(i)}
            style={{
              width: tileSize,
              height: tileSize,
            }}>
            <GlassCard
              colors={colors}
              color={on ? colors.icon.blue : colors.tileBg}
              intensity={on ? 40 : 10}
              style={{
                flex: 1,
                borderRadius: 12,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: on ? 0 : 1,
                borderColor: colors.accent + '20',
                opacity: on ? 1 : 0.6
              }}
            />
          </TouchableOpacity>
        ))}
      </View>
    </Animated.ScrollView>
    </GradientBackground>
  );
};
