import { useEffect, useRef, useState } from 'react';
import { Animated, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { safeHaptics, ImpactFeedbackStyle, NotificationFeedbackType } from '../../utils/haptics';
import { scaleMinigameReward } from '../../utils/zenTokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GradientBackground from '../ui/GradientBackground';
import GlassCard from '../ui/GlassCard';

export const BreathingExercise = ({ onBack, colors, updateTokens, sfxEnabled }) => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [phase, setPhase] = useState('ready'); // ready, inhale, hold, exhale
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const scaleValue = useRef(new Animated.Value(0.5)).current;
  const opacityValue = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (!isBreathing) return;

    const runCycle = async () => {
      const useNative = Platform.OS !== 'web';
      // Inhale (4 seconds)
      setPhase('inhale');
      Animated.parallel([
        Animated.timing(scaleValue, { toValue: 1, duration: 4000, useNativeDriver: useNative }),
        Animated.timing(opacityValue, { toValue: 1, duration: 4000, useNativeDriver: useNative })
      ]).start();
      await new Promise(resolve => setTimeout(resolve, 4000));

      // Hold (4 seconds)
      setPhase('hold');
      await new Promise(resolve => setTimeout(resolve, 4000));

      // Exhale (6 seconds)
      setPhase('exhale');
      Animated.parallel([
        Animated.timing(scaleValue, { toValue: 0.5, duration: 6000, useNativeDriver: useNative }),
        Animated.timing(opacityValue, { toValue: 0.3, duration: 6000, useNativeDriver: useNative })
      ]).start();
      await new Promise(resolve => setTimeout(resolve, 6000));

      setCyclesCompleted(prev => prev + 1);
    };

    runCycle();
  }, [isBreathing, cyclesCompleted]);

  const startBreathing = () => {
    setIsBreathing(true);
    setCyclesCompleted(0);
    if (sfxEnabled) safeHaptics.impactAsync(ImpactFeedbackStyle.Medium);
  };

  const stopBreathing = () => {
    setIsBreathing(false);
    setPhase('ready');
    scaleValue.setValue(0.5);
    opacityValue.setValue(0.3);
    
    if (cyclesCompleted > 0) {
      const reward = scaleMinigameReward(cyclesCompleted * 5);
      updateTokens(reward, 'breathing');
      if (sfxEnabled) safeHaptics.notificationAsync(NotificationFeedbackType.Success);
    }
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In... 🌬️';
      case 'hold': return 'Hold... ⏸️';
      case 'exhale': return 'Breathe Out... 💨';
      default: return 'Ready to breathe?';
    }
  };

  const insets = useSafeAreaInsets();
  
  return (
    <GradientBackground colors={colors}>
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 68, paddingBottom: 40, alignItems: 'center', flex: 1, justifyContent: 'center' }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 10 }}>Breathing Exercise</Text>
      <Text style={{ color: colors.subtext, marginBottom: 30, textAlign: 'center', paddingHorizontal: 20 }}>
        Follow the circle • +5 tokens per cycle
      </Text>
      
      <View style={{ height: 300, justifyContent: 'center', alignItems: 'center', marginBottom: 40 }}>
        <Animated.View
          style={{
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: colors.accent,
            justifyContent: 'center',
            alignItems: 'center',
            transform: [{ scale: scaleValue }],
            opacity: opacityValue
          }}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center', paddingHorizontal: 20 }}>
            {getPhaseText()}
          </Text>
        </Animated.View>
      </View>
      
      <GlassCard colors={colors} color={colors.tileBg} style={{
        padding: 20,
        borderRadius: 20,
        marginBottom: 30,
        minWidth: 200,
        alignItems: 'center'
      }}>
        <Text style={{ color: colors.subtext, fontSize: 14 }}>Cycles Completed</Text>
        <Text style={{ color: colors.accent, fontSize: 36, fontWeight: 'bold' }}>{cyclesCompleted}</Text>
      </GlassCard>
      
      {!isBreathing ? (
        <TouchableOpacity
          onPress={startBreathing}
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
          onPress={stopBreathing}
          style={{
            backgroundColor: colors.icon.red,
            paddingVertical: 15,
            paddingHorizontal: 40,
            borderRadius: 25
          }}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>STOP</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
    </GradientBackground>
  );
};
