import { useEffect, useRef, useState } from 'react';
import { Animated, Platform, Text, TouchableOpacity } from 'react-native';
import { safeHaptics, NotificationFeedbackType } from '../../utils/haptics';
import { scaleMinigameReward } from '../../utils/zenTokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassCard from '../ui/GlassCard';
import GradientBackground from '../ui/GradientBackground';

export const FortuneGame = ({ onBack, colors, updateTokens, sfxEnabled }) => {
  const [msg, setMsg] = useState("Tap the cookie!");
  const [cracked, setCracked] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const cookieScale = useRef(new Animated.Value(1)).current;
  
  const useNative = Platform.OS !== 'web';
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: useNative }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 7, useNativeDriver: useNative })
    ]).start();
  }, [fadeAnim, scaleAnim]);
  
  const fortunes = [
    "You are enough.",
    "Peace is within you.",
    "Breathe deeply.",
    "Today is a gift.",
    "You are loved.",
    "Stay present.",
    "Trust the process.",
    "You are stronger than you think.",
    "Embrace the journey.",
    "Your light shines bright."
  ];

  const crack = () => {
    Animated.sequence([
      Animated.timing(cookieScale, { toValue: 1.2, duration: 150, useNativeDriver: useNative }),
      Animated.timing(cookieScale, { toValue: 1, duration: 150, useNativeDriver: useNative })
    ]).start();
    if (sfxEnabled) safeHaptics.notificationAsync(NotificationFeedbackType.Success);
    const f = fortunes[Math.floor(Math.random() * fortunes.length)];
    setMsg(f);
    setCracked(true);
    updateTokens(scaleMinigameReward(5), "fortune");
    
    setTimeout(() => {
      setCracked(false);
      setMsg("Tap the cookie!");
    }, 5000);
  };

  const insets = useSafeAreaInsets();
  
  return (
    <GradientBackground colors={colors}>
    <Animated.ScrollView 
      contentContainerStyle={{ paddingTop: insets.top + 68, paddingHorizontal: 16, paddingBottom: 40, alignItems: 'center' }}
      style={{ opacity: fadeAnim }}
    >
      <Animated.View style={{ alignItems: 'center', transform: [{ scale: scaleAnim }] }}>
        <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 10 }}>Fortune Cookie</Text>
        <Text style={{ color: colors.subtext, marginBottom: 30, fontSize: 13 }}>Crack for wisdom (+5 Tokens)</Text>
      </Animated.View>
      
      <Animated.View style={{ transform: [{ scale: cookieScale }] }}>
        <TouchableOpacity onPress={crack} disabled={cracked}>
          <Text style={{ fontSize: 100, opacity: cracked ? 0.5 : 1 }}>🥠</Text>
        </TouchableOpacity>
      </Animated.View>
      
      <GlassCard colors={colors} color={colors.tileBg} style={{
        marginTop: 30,
        padding: 20,
        borderRadius: 24,
        width: '100%',
        maxWidth: 360,
        alignItems: 'center'
      }}>
        <Text style={{
          fontSize: 18,
          color: colors.text,
          textAlign: 'center',
          fontStyle: 'italic'
        }}>
          “{msg}”
        </Text>
      </GlassCard>
    </Animated.ScrollView>
    </GradientBackground>
  );
};
