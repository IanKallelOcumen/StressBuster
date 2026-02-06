import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const BubbleGame = ({ onBack, colors, updateTokens }) => {
  const [bubbles, setBubbles] = useState(
    Array.from({ length: 15 }, (_, i) => ({ id: i, visible: true }))
  );
  const [totalPopped, setTotalPopped] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true })
    ]).start();
  }, [fadeAnim, slideAnim]);

  const pop = id => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setBubbles(p => p.map(x => x.id === id ? { ...x, visible: false } : x));
    setTotalPopped(totalPopped + 1);
    updateTokens(1, "bubble_pop");
    
    setTimeout(() => {
      setBubbles(p => p.map(x => x.id === id ? { ...x, visible: true } : x));
    }, 2000);
  };

  const insets = useSafeAreaInsets();
  
  return (
    <Animated.ScrollView 
      contentContainerStyle={{ paddingTop: insets.top + 68, paddingBottom: 40, alignItems: 'center' }}
      style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
    >
      <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 10 }}>Pop Bubbles</Text>
      <Text style={{ color: colors.subtext, marginBottom: 10 }}>Pop for stress relief (+1 Token each)</Text>
      <Text style={{ color: colors.accent, fontWeight: 'bold', marginBottom: 20 }}>Popped: {totalPopped}</Text>
      
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: 300, justifyContent: 'center' }}>
        {bubbles.map(x => (
          <TouchableOpacity
            key={x.id}
            onPress={() => pop(x.id)}
            style={{
              width: 60,
              height: 60,
              margin: 10,
              backgroundColor: x.visible ? colors.icon.green : 'transparent',
              borderRadius: 30,
              borderWidth: x.visible ? 0 : 2,
              borderColor: x.visible ? 'transparent' : colors.icon.green + '40'
            }}
          />
        ))}
      </View>
    </Animated.ScrollView>
  );
};
