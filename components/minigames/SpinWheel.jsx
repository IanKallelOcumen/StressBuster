import * as Haptics from 'expo-haptics';
import { useRef, useState } from 'react';
import { Animated, Easing, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const SpinWheel = ({ onBack, colors, updateTokens }) => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  
  const prizes = [
    { label: '+5', value: 5, color: colors.icon.green },
    { label: '+10', value: 10, color: colors.icon.blue },
    { label: '+3', value: 3, color: colors.icon.yellow },
    { label: '+15', value: 15, color: colors.icon.purple },
    { label: '+1', value: 1, color: colors.icon.orange },
    { label: '+20', value: 20, color: colors.icon.pink }
  ];

  const wheelSize = 240;
  const prizeSize = 50;
  const radius = wheelSize / 2 - prizeSize / 2 - 15;

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    const randomIndex = Math.floor(Math.random() * prizes.length);
    const prize = prizes[randomIndex];
    
    Animated.parallel([
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      }),
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.05,
          duration: 100,
          useNativeDriver: true
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true
        })
      ])
    ]).start(() => {
      setResult(prize);
      updateTokens(prize.value, 'spin_wheel');
      spinValue.setValue(0);
      setSpinning(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    });
  };

  const rotation = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '2160deg']
  });

  const insets = useSafeAreaInsets();
  
  return (
    <ScrollView contentContainerStyle={{ flex: 1, paddingTop: insets.top + 68, paddingBottom: insets.bottom + 60, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: '100%', alignItems: 'center', gap: 20, paddingHorizontal: 16 }}>
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.text, textAlign: 'center' }}>Spin Wheel</Text>
          <Text style={{ color: colors.subtext, textAlign: 'center', fontSize: 14 }}>Spin for random tokens!</Text>
        </View>
        
        <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 20 }}>
          {/* Pointer at top */}
          <View style={{ position: 'absolute', top: -15, zIndex: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 24 }}>▼</Text>
          </View>

          <Animated.View
            style={{
              width: wheelSize,
              height: wheelSize,
              borderRadius: wheelSize / 2,
              backgroundColor: colors.tileBg,
              justifyContent: 'center',
              alignItems: 'center',
              transform: [{ rotate: rotation }, { scale: scaleValue }],
              borderWidth: 6,
              borderColor: colors.accent,
              shadowColor: colors.text,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 10
            }}>
            {prizes.map((prize, index) => {
              const angle = (index * 360) / prizes.length;
              const radians = (angle * Math.PI) / 180;
              const x = radius * Math.sin(radians);
              const y = -radius * Math.cos(radians);

              return (
                <View
                  key={index}
                  style={{
                    position: 'absolute',
                    width: prizeSize,
                    height: prizeSize,
                    borderRadius: prizeSize / 2,
                    backgroundColor: prize.color,
                    justifyContent: 'center',
                    alignItems: 'center',
                    left: wheelSize / 2 + x - prizeSize / 2,
                    top: wheelSize / 2 + y - prizeSize / 2,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3,
                    elevation: 5
                  }}>
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>{prize.label}</Text>
                </View>
              );
            })}
            
            {/* Center circle */}
            <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: colors.accent, shadowColor: colors.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 6 }} />
          </Animated.View>
        </View>
        
        <TouchableOpacity
          onPress={spin}
          disabled={spinning}
          style={{
            backgroundColor: spinning ? colors.subtext + '80' : colors.accent,
            paddingVertical: 16,
            paddingHorizontal: 50,
            borderRadius: 28,
            shadowColor: colors.accent,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: spinning ? 0 : 0.3,
            shadowRadius: 10,
            elevation: 8
          }}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>
            {spinning ? 'Spinning...' : 'SPIN!'}
          </Text>
        </TouchableOpacity>

        {result && (
          <View style={{
            backgroundColor: result.color + '20',
            borderColor: result.color,
            borderWidth: 2,
            borderRadius: 16,
            paddingVertical: 16,
            paddingHorizontal: 24,
            width: '90%',
            alignItems: 'center',
            marginTop: 10
          }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, textAlign: 'center' }}>
              You won <Text style={{ color: result.color, fontWeight: 'bold', fontSize: 22 }}>{result.label}</Text> tokens! 🎉
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};
