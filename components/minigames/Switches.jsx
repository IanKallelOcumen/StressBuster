import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const SwitchGame = ({ onBack, colors, updateTokens }) => {
  const [switches, setSwitches] = useState([false, false, false, false, false]);
  const [count, setCount] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 450, useNativeDriver: true })
    ]).start();
  }, [fadeAnim, slideAnim]);

  const toggle = i => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const n = [...switches];
    n[i] = !n[i];
    setSwitches(n);
    
    const c = count + 1;
    setCount(c);
    
    if (c % 20 === 0) {
      updateTokens(5, "switch");
      Alert.alert("+5 Tokens", "Satisfying!");
    }
  };

  const insets = useSafeAreaInsets();
  
  return (
    <Animated.ScrollView 
      contentContainerStyle={{ paddingTop: insets.top + 68, paddingBottom: 40, alignItems: 'center' }}
      style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
    >
      <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 10 }}>Switches</Text>
      <Text style={{ color: colors.subtext, marginBottom: 10 }}>Toggle for haptic feedback</Text>
      <Text style={{ color: colors.accent, fontWeight: 'bold', marginBottom: 20 }}>Flips: {count}</Text>
      
      <View style={{ gap: 16 }}>
        {switches.map((v, i) => (
          <View
            key={i}
            style={{
              flexDirection: 'row',
              width: 200,
              justifyContent: 'space-between',
              backgroundColor: colors.tileBg,
              padding: 15,
              borderRadius: 16
            }}>
            <Text style={{ color: colors.text }}>Switch {i + 1}</Text>
            <Switch
              value={v}
              onValueChange={() => toggle(i)}
              trackColor={{ true: colors.accent }}
            />
          </View>
        ))}
      </View>
    </Animated.ScrollView>
  );
};
