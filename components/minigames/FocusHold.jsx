import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { safeHaptics, ImpactFeedbackStyle, NotificationFeedbackType } from '../../utils/haptics';
import { scaleMinigameReward } from '../../utils/zenTokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassCard from '../ui/GlassCard';
import GradientBackground from '../ui/GradientBackground';

const FocusHold = ({ onBack, colors, updateTokens, sfxEnabled }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const startTime = useRef(0);
  const timer = useRef(null);
  const progressWidth = Math.min(width - 32, 360);

  useEffect(() => {
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  const handlePressIn = () => {
    if (complete) return;
    setHolding(true);
    startTime.current = Date.now();
    if (sfxEnabled) safeHaptics.selectionAsync();

    const useNative = Platform.OS !== 'web';
    Animated.timing(scaleAnim, {
      toValue: 1.5,
      duration: 10000,
      easing: Easing.linear,
      useNativeDriver: useNative,
    }).start();

    timer.current = setInterval(() => {
      const elapsed = Date.now() - startTime.current;
      const p = Math.min(elapsed / 10000, 1);
      setProgress(p);
      
      if (p >= 1) {
        clearInterval(timer.current);
        setComplete(true);
        setHolding(false);
        if (sfxEnabled) safeHaptics.notificationAsync(NotificationFeedbackType.Success);
        if (updateTokens) updateTokens(scaleMinigameReward(10)); // Reward for patience
      } else {
        if (elapsed % 1000 < 50) { // Haptic heartbeat every second
           if (sfxEnabled) safeHaptics.impactAsync(ImpactFeedbackStyle.Light);
        }
      }
    }, 50);
  };

  const handlePressOut = () => {
    if (complete) return;
    setHolding(false);
    clearInterval(timer.current);
    
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
    
    setProgress(0);
    if (sfxEnabled) safeHaptics.notificationAsync(NotificationFeedbackType.Warning);
  };

  const reset = () => {
    setComplete(false);
    setProgress(0);
    scaleAnim.setValue(1);
  };

  return (
    <GradientBackground colors={colors}>
    <View style={[styles.container, { paddingTop: insets.top + 68, paddingHorizontal: 16, paddingBottom: insets.bottom + 40 }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Focus Flame</Text>
      </View>

      <View style={styles.content}>
        {complete ? (
          <GlassCard colors={colors} color={colors.tileBg} style={{ alignItems: 'center', padding: 30, borderRadius: 20 }}>
            <Text style={[styles.successText, { color: colors.text }]}>Zen Achieved</Text>
            <Text style={[styles.subText, { color: colors.subtext, textAlign: 'center' }]}>You focused for 10 seconds.{'\n'}+10 tokens</Text>
            <TouchableOpacity 
                style={[styles.resetButton, { backgroundColor: colors.accent }]} 
                onPress={reset}
            >
              <Text style={styles.buttonText}>Focus Again</Text>
            </TouchableOpacity>
          </GlassCard>
        ) : (
          <>
            <Text style={[styles.instruction, { color: colors.text }]}>
              {holding ? "Keep holding..." : "Hold the circle for 10 seconds"}
            </Text>
            <TouchableOpacity
              activeOpacity={1}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={[styles.flameContainer]}
            >
              <Animated.View
                style={[
                  styles.flame,
                  {
                    backgroundColor: holding ? colors.icon.orange : colors.icon.orange + '80',
                    transform: [{ scale: scaleAnim }],
                    ...(Platform.OS === 'web' ? {
                      boxShadow: holding ? `0 0 20px 0 ${colors.icon.orange}CC` : `0 0 10px 0 ${colors.icon.orange}4D`,
                    } : {
                      shadowColor: colors.icon.orange,
                      shadowOpacity: holding ? 0.8 : 0.3,
                      shadowRadius: holding ? 20 : 10,
                    })
                  }
                ]}
              />
            </TouchableOpacity>
            
            <GlassCard colors={colors} color={colors.text} intensity={10} style={[styles.progressBarContainer, { backgroundColor: undefined, width: progressWidth }]}>
                <View style={[styles.progressBar, { width: `${progress * 100}%`, backgroundColor: colors.accent }]} />
            </GlassCard>
          </>
        )}
      </View>
    </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  instruction: {
    fontSize: 18,
    marginBottom: 40,
    fontWeight: '500',
  },
  flameContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  flame: {
    width: 80,
    height: 80,
    borderRadius: 40,
    elevation: 10,
  },
  progressBarContainer: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    marginBottom: 30,
  },
  resetButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default FocusHold;
