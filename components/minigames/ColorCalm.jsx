import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Platform, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { safeHaptics, ImpactFeedbackStyle } from '../../utils/haptics';
import { scaleMinigameReward } from '../../utils/zenTokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassCard from '../ui/GlassCard';
import GradientBackground from '../ui/GradientBackground';

export const ColorGame = ({ onBack, colors, updateTokens, sfxEnabled }) => {
  const [color, setColor] = useState(colors.accent);
  const [taps, setTaps] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  
  const useNative = Platform.OS !== 'web';
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 450, useNativeDriver: useNative }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 7, useNativeDriver: useNative })
    ]).start();
  }, [fadeAnim, scaleAnim]);

  const tap = () => {
    setColor('#' + Math.floor(Math.random() * 16777215).toString(16));
    if (sfxEnabled) safeHaptics.impactAsync(ImpactFeedbackStyle.Light);
    
    const t = taps + 1;
    setTaps(t);
    
    if (t % 20 === 0) {
      const reward = scaleMinigameReward(5);
      updateTokens(reward, "color");
      Alert.alert(`+${reward} Tokens`, "Colorful!");
    }
  };

  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const boxSize = Math.max(160, Math.min(220, width - 80));
  
  return (
    <GradientBackground colors={colors}>
    <Animated.ScrollView 
      contentContainerStyle={{ paddingTop: insets.top + 68, paddingHorizontal: 16, paddingBottom: 40, alignItems: 'center' }}
      style={{ opacity: fadeAnim }}
    >
      <Animated.View style={{ alignItems: 'center', transform: [{ scale: scaleAnim }] }}>
        <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 10 }}>Color Calm</Text>
        <GlassCard colors={colors} color={colors.tileBg} style={{ paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, marginBottom: 30 }}>
            <Text style={{ color: colors.subtext, fontSize: 13 }}>Tap to change colors</Text>
        </GlassCard>
      </Animated.View>
      
      <TouchableOpacity
        onPress={tap}
        style={{
          width: boxSize,
          height: boxSize,
          borderRadius: 20,
          backgroundColor: color,
          justifyContent: 'center',
          alignItems: 'center',
          ...(Platform.OS === 'web' ? {
            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.3)',
          } : {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8
          })
        }}>
        <Text style={{ color: '#fff', fontSize: 40, fontWeight: 'bold' }}>{taps}</Text>
      </TouchableOpacity>
    </Animated.ScrollView>
    </GradientBackground>
  );
};
