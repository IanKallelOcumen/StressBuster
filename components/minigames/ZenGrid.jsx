import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const GridGame = ({ onBack, colors, updateTokens }) => {
  const [grid, setGrid] = useState(Array(16).fill(false));
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 8, useNativeDriver: true })
    ]).start();
  }, [fadeAnim, scaleAnim]);

  const toggle = i => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newG = [...grid];
    newG[i] = !newG[i];
    setGrid(newG);
    
    if (newG.every(Boolean)) {
      updateTokens(10, "grid_win");
      Alert.alert("Bright!", "You lit up the whole grid! +10 Tokens");
      setGrid(Array(9).fill(false));
    }
  };

  const insets = useSafeAreaInsets();
  
  return (
    <Animated.ScrollView 
      contentContainerStyle={{ paddingTop: insets.top + 68, paddingBottom: 40, alignItems: 'center' }}
      style={{ opacity: fadeAnim }}
    >
      <Animated.View style={{ alignItems: 'center', transform: [{ scale: scaleAnim }] }}>
        <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 10 }}>Zen Grid</Text>
        <Text style={{ color: colors.subtext, marginBottom: 30, fontSize: 13 }}>Light up all squares</Text>
      </Animated.View>
      
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: 300, justifyContent: 'center' }}>
        {grid.map((on, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => toggle(i)}
            style={{
              width: 80,
              height: 80,
              margin: 5,
              backgroundColor: on ? colors.icon.blue : colors.tileBg,
              borderRadius: 12,
              shadowColor: on ? colors.icon.blue : 'transparent',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.6,
              shadowRadius: 10,
              elevation: on ? 5 : 0
            }}
          />
        ))}
      </View>
    </Animated.ScrollView>
  );
};
