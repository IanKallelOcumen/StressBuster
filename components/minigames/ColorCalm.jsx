import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const ColorGame = ({ onBack, colors, updateTokens }) => {
  const [color, setColor] = useState(colors.accent);
  const [taps, setTaps] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 7, useNativeDriver: true })
    ]).start();
  }, [fadeAnim, scaleAnim]);

  const tap = () => {
    setColor('#' + Math.floor(Math.random() * 16777215).toString(16));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const t = taps + 1;
    setTaps(t);
    
    if (t % 20 === 0) {
      updateTokens(5, "color");
      Alert.alert("+5 Tokens", "Colorful!");
    }
  };

  const insets = useSafeAreaInsets();
  
  return (
    <Animated.ScrollView 
      contentContainerStyle={{ paddingTop: insets.top + 68, paddingBottom: 40, alignItems: 'center' }}
      style={{ opacity: fadeAnim }}
    >
      <Animated.View style={{ alignItems: 'center', transform: [{ scale: scaleAnim }] }}>
        <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 10 }}>Color Calm</Text>
        <Text style={{ color: colors.subtext, marginBottom: 30, fontSize: 13 }}>Tap to change colors</Text>
      </Animated.View>
      
      <TouchableOpacity
        onPress={tap}
        style={{
          width: 200,
          height: 200,
          borderRadius: 20,
          backgroundColor: color,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8
        }}>
        <Text style={{ color: '#fff', fontSize: 40, fontWeight: 'bold' }}>{taps}</Text>
      </TouchableOpacity>
    </Animated.ScrollView>
  );
};
