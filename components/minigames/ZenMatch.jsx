import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const MemoryGame = ({ onBack, colors, updateTokens }) => {
  const [cards] = useState(['🍎', '🍎', '🥑', '🥑', '🍇', '🍇', '🍒', '🍒'].sort(() => Math.random() - 0.5));
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 8, useNativeDriver: true })
    ]).start();
  }, [fadeAnim, scaleAnim]);
  
  const flip = i => {
    if (flipped.length === 2 || flipped.includes(i) || matched.includes(i)) return;
    const newF = [...flipped, i];
    setFlipped(newF);
    
    if (newF.length === 2) {
      if (cards[newF[0]] === cards[newF[1]]) {
        setMatched([...matched, ...newF]);
        setFlipped([]);
        if (matched.length + 2 === cards.length) {
          updateTokens(10, "memory_win");
          Alert.alert("Won!", "Perfect memory! +10 Tokens");
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const insets = useSafeAreaInsets();
  
  return (
    <Animated.ScrollView 
      contentContainerStyle={{ paddingTop: insets.top + 68, paddingBottom: 40, alignItems: 'center' }}
      style={{ opacity: fadeAnim }}
    >
      <Animated.View style={{ alignItems: 'center', transform: [{ scale: scaleAnim }] }}>
        <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 10 }}>Zen Match</Text>
        <Text style={{ color: colors.subtext, marginBottom: 30, fontSize: 13 }}>Find matching pairs (+10 Tokens)</Text>
      </Animated.View>
      
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: 300, justifyContent: 'center' }}>
        {cards.map((val, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => flip(i)}
            style={{
              width: 60,
              height: 80,
              margin: 5,
              backgroundColor: flipped.includes(i) || matched.includes(i) ? colors.accent : colors.tileBg,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 12
            }}>
            {(flipped.includes(i) || matched.includes(i)) && <Text style={{ fontSize: 30 }}>{val}</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </Animated.ScrollView>
  );
};
