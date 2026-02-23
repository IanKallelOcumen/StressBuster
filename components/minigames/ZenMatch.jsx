import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Platform, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { safeHaptics, NotificationFeedbackType } from '../../utils/haptics';
import { scaleMinigameReward } from '../../utils/zenTokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassCard from '../ui/GlassCard';
import GradientBackground from '../ui/GradientBackground';

export const MemoryGame = ({ onBack, colors, updateTokens, sfxEnabled }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  useEffect(() => {
    startNewGame();
    const useNative = Platform.OS !== 'web';
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: useNative }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 8, useNativeDriver: useNative })
    ]).start();
  }, []);

  const startNewGame = () => {
    const emojis = ['🍎', '🥑', '🍇', '🍒', '🍋', '🍑']; // 6 pairs = 12 cards
    const deck = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    setCards(deck);
    setFlipped([]);
    setMatched([]);
  };
  
  const flip = i => {
    if (flipped.length === 2 || flipped.includes(i) || matched.includes(i)) return;
    
    if (sfxEnabled) safeHaptics.selectionAsync();

    const newF = [...flipped, i];
    setFlipped(newF);
    
    if (newF.length === 2) {
      if (cards[newF[0]] === cards[newF[1]]) {
        if (sfxEnabled) safeHaptics.notificationAsync(NotificationFeedbackType.Success);
        const newMatched = [...matched, ...newF];
        setMatched(newMatched);
        setFlipped([]);
        
        if (newMatched.length === cards.length) {
          const reward = scaleMinigameReward(10);
          updateTokens(reward, "memory_win");
          Alert.alert(
            "Perfect Memory!", 
            `You found all pairs! +${reward} Tokens`,
            [
              { text: "Menu", onPress: onBack },
              { text: "Play Again", onPress: () => startNewGame() }
            ]
          );
        }
      } else {
        if (sfxEnabled) safeHaptics.notificationAsync(NotificationFeedbackType.Error);
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const gridWidth = Math.min(width - 32, 320);
  const gapSize = 8;
  const cardWidth = Math.floor((gridWidth - gapSize * 3) / 4);
  const cardHeight = Math.floor(cardWidth * 1.25);
  
  return (
    <GradientBackground colors={colors}>
    <Animated.ScrollView 
      contentContainerStyle={{ paddingTop: insets.top + 68, paddingHorizontal: 16, paddingBottom: 40, alignItems: 'center' }}
      style={{ opacity: fadeAnim }}
    >
      <Animated.View style={{ alignItems: 'center', transform: [{ scale: scaleAnim }] }}>
        <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 10 }}>Zen Match</Text>
        <Text style={{ color: colors.subtext, marginBottom: 30, fontSize: 13 }}>Find matching pairs (+10 Tokens)</Text>
      </Animated.View>
      
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: gridWidth, justifyContent: 'center', gap: gapSize }}>
        {cards.map((val, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => flip(i)}
            style={{
              width: cardWidth,
              height: cardHeight
            }}>
            <GlassCard
              colors={colors}
              color={flipped.includes(i) || matched.includes(i) ? colors.accent : colors.tileBg}
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 12
              }}
            >
              {(flipped.includes(i) || matched.includes(i)) && <Text style={{ fontSize: 30 }}>{val}</Text>}
            </GlassCard>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.ScrollView>
    </GradientBackground>
  );
};
