import { useEffect, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const TimerScreen = ({ onBack, colors }) => {
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessions, setSessions] = useState(0);
  const scaleValue = new Animated.Value(1);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(20));
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true })
    ]).start();
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => setSeconds(p => p - 1), 1000);
    } else if (seconds === 0 && isActive) {
      setIsActive(false);
      setSessions(s => s + 1);
      Animated.sequence([
        Animated.timing(scaleValue, { toValue: 1.2, duration: 100, useNativeDriver: true }),
        Animated.timing(scaleValue, { toValue: 1, duration: 100, useNativeDriver: true })
      ]).start();
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const insets = useSafeAreaInsets();
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const progress = ((25 * 60 - seconds) / (25 * 60)) * 100;
  
  return (
    <Animated.ScrollView contentContainerStyle={{ paddingTop: insets.top + 68, paddingBottom: insets.bottom + 80, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }} showsVerticalScrollIndicator={false} style={{ opacity: fadeAnim }}>
      <Animated.View style={{ gap: 20, alignItems: 'center', width: '100%', transform: [{ translateY: slideAnim }] }}>
        <View style={{ gap: 4 }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text, textAlign: 'center' }}>Focus Timer</Text>
          <Text style={{ fontSize: 13, color: colors.subtext, textAlign: 'center' }}>Pomodoro technique • 25 min</Text>
        </View>

        {/* Timer Display */}
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
          <View style={{ 
            width: 220,
            height: 220, 
            borderRadius: 110, 
            backgroundColor: colors.accent + '12',
            borderWidth: 2,
            borderColor: colors.accent,
            alignItems: 'center', 
            justifyContent: 'center',
            marginVertical: 20
          }}>
            <Text style={{ fontSize: 64, fontWeight: '800', color: colors.accent, fontFamily: 'monospace' }}>
              {minutes.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
            </Text>
          </View>
        </Animated.View>

        {/* Progress Bar */}
        <View style={{ width: '100%', gap: 8 }}>
          <View style={{ height: 6, backgroundColor: colors.tileBg, borderRadius: 3, overflow: 'hidden' }}>
            <View style={{ height: '100%', width: `${progress}%`, backgroundColor: colors.accent }} />
          </View>
          <Text style={{ fontSize: 11, color: colors.subtext, textAlign: 'center' }}>{progress.toFixed(0)}% complete</Text>
        </View>

        {/* Controls */}
        <View style={{ flexDirection: 'row', gap: 12, width: '100%', justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={() => setIsActive(!isActive)}
            style={{
              backgroundColor: colors.accent,
              paddingVertical: 14,
              paddingHorizontal: 32,
              borderRadius: 24,
              minWidth: 120,
              alignItems: 'center',
              shadowColor: colors.accent,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4
            }}>
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>
              {isActive ? "Pause" : "Start"}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => { setSeconds(25 * 60); setIsActive(false); }}
            style={{
              backgroundColor: colors.tileBg,
              paddingVertical: 14,
              paddingHorizontal: 32,
              borderRadius: 24,
              borderWidth: 1,
              borderColor: colors.accent + '30',
              minWidth: 120,
              alignItems: 'center'
            }}>
            <Text style={{ color: colors.text, fontWeight: '600', fontSize: 15 }}>
              Reset
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sessions Count */}
        <View style={{
          backgroundColor: colors.accent + '12',
          borderColor: colors.accent + '30',
          borderWidth: 1,
          borderRadius: 14,
          paddingVertical: 12,
          paddingHorizontal: 20,
          width: '100%',
          alignItems: 'center'
        }}>
          <Text style={{ color: colors.subtext, fontSize: 12, marginBottom: 4 }}>Sessions Completed</Text>
          <Text style={{ fontSize: 28, fontWeight: '800', color: colors.accent }}>{sessions}</Text>
        </View>
      </Animated.View>
    </Animated.ScrollView>
  );
};
