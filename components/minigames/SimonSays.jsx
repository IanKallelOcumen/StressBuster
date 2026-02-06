import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Animated, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS_SIMON = ['red', 'green', 'blue', 'yellow'];
const EMOJIS = ['🔴', '🟢', '🔵', '🟡'];

export const SimonSays = ({ onBack, colors, updateTokens }) => {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [level, setLevel] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [animatingIndex, setAnimatingIndex] = useState(-1);
  const [scaleValues] = useState([new Animated.Value(1), new Animated.Value(1), new Animated.Value(1), new Animated.Value(1)]);
  const insets = useSafeAreaInsets();

  const playSequence = async (seq) => {
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setAnimatingIndex(seq[i]);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Animated.sequence([
        Animated.timing(scaleValues[seq[i]], { toValue: 1.2, duration: 100, useNativeDriver: true }),
        Animated.timing(scaleValues[seq[i]], { toValue: 1, duration: 100, useNativeDriver: true })
      ]).start();
      await new Promise(resolve => setTimeout(resolve, 400));
    }
    setAnimatingIndex(-1);
  };

  const start = async () => {
    setGameStarted(true);
    const newSeq = [Math.floor(Math.random() * 4)];
    setSequence(newSeq);
    setPlayerSequence([]);
    setLevel(1);
    await playSequence(newSeq);
  };

  const handleColor = async (index) => {
    if (!gameStarted) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const newPlayerSeq = [...playerSequence, index];
    setPlayerSequence(newPlayerSeq);

    Animated.sequence([
      Animated.timing(scaleValues[index], { toValue: 1.15, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleValues[index], { toValue: 1, duration: 100, useNativeDriver: true })
    ]).start();

    if (newPlayerSeq[newPlayerSeq.length - 1] !== sequence[newPlayerSeq.length - 1]) {
      setGameStarted(false);
      updateTokens(level, 'simon_says');
      return;
    }

    if (newPlayerSeq.length === sequence.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newSeq = [...sequence, Math.floor(Math.random() * 4)];
      setSequence(newSeq);
      setPlayerSequence([]);
      setLevel(l => l + 1);
      await playSequence(newSeq);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 68, paddingHorizontal: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
      <View style={{ gap: 20, alignItems: 'center' }}>
        <View style={{ gap: 8, alignItems: 'center' }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text }}>Simon Says</Text>
          <Text style={{ fontSize: 13, color: colors.subtext }}>Repeat the pattern</Text>
        </View>

        <View style={{ backgroundColor: colors.accent + '12', borderColor: colors.accent, borderWidth: 2, borderRadius: 16, paddingVertical: 16, paddingHorizontal: 20, alignItems: 'center', gap: 8 }}>
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>Level: {level}</Text>
          <Text style={{ color: colors.subtext, fontSize: 13 }}>Sequence: {playerSequence.length} / {sequence.length}</Text>
        </View>

        <View style={{ width: '100%', gap: 12 }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Animated.View style={{ flex: 1, transform: [{ scale: scaleValues[0] }] }}>
              <TouchableOpacity
                onPress={() => handleColor(0)}
                style={{
                  backgroundColor: '#FF3B30',
                  padding: 20,
                  borderRadius: 12,
                  alignItems: 'center',
                  opacity: animatingIndex === 0 ? 1 : 0.7
                }}>
                <Text style={{ fontSize: 32 }}>🔴</Text>
              </TouchableOpacity>
            </Animated.View>
            <Animated.View style={{ flex: 1, transform: [{ scale: scaleValues[1] }] }}>
              <TouchableOpacity
                onPress={() => handleColor(1)}
                style={{
                  backgroundColor: '#34C759',
                  padding: 20,
                  borderRadius: 12,
                  alignItems: 'center',
                  opacity: animatingIndex === 1 ? 1 : 0.7
                }}>
                <Text style={{ fontSize: 32 }}>🟢</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Animated.View style={{ flex: 1, transform: [{ scale: scaleValues[2] }] }}>
              <TouchableOpacity
                onPress={() => handleColor(2)}
                style={{
                  backgroundColor: '#007AFF',
                  padding: 20,
                  borderRadius: 12,
                  alignItems: 'center',
                  opacity: animatingIndex === 2 ? 1 : 0.7
                }}>
                <Text style={{ fontSize: 32 }}>🔵</Text>
              </TouchableOpacity>
            </Animated.View>
            <Animated.View style={{ flex: 1, transform: [{ scale: scaleValues[3] }] }}>
              <TouchableOpacity
                onPress={() => handleColor(3)}
                style={{
                  backgroundColor: '#FFCC00',
                  padding: 20,
                  borderRadius: 12,
                  alignItems: 'center',
                  opacity: animatingIndex === 3 ? 1 : 0.7
                }}>
                <Text style={{ fontSize: 32 }}>🟡</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>

        {!gameStarted && (
          <TouchableOpacity
            onPress={start}
            style={{
              backgroundColor: colors.accent,
              paddingVertical: 13,
              paddingHorizontal: 40,
              borderRadius: 12,
              alignItems: 'center',
              shadowColor: colors.accent,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
              width: '100%'
            }}>
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>
              {level === 1 ? 'Start Game' : 'Play Again'}
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ backgroundColor: colors.tileBg, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, width: '100%' }}>
          <Text style={{ color: colors.subtext, fontSize: 12, lineHeight: 18, textAlign: 'center' }}>
            💡 Higher levels give more tokens!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};
