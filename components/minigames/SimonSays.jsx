import { useRef, useState } from 'react';
import { Alert, Animated, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { safeHaptics, ImpactFeedbackStyle } from '../../utils/haptics';
import { scaleMinigameReward } from '../../utils/zenTokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassCard from '../ui/GlassCard';
import GradientBackground from '../ui/GradientBackground';

const COLORS_SIMON = ['red', 'green', 'blue', 'yellow'];
const EMOJIS = ['🔴', '🟢', '🔵', '🟡'];

export const SimonSays = ({ onBack, colors, updateTokens, sfxEnabled }) => {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [level, setLevel] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [isCPUPlaying, setIsCPUPlaying] = useState(false);
  const [animatingIndex, setAnimatingIndex] = useState(-1);
  const scaleValues = useRef([new Animated.Value(1), new Animated.Value(1), new Animated.Value(1), new Animated.Value(1)]).current;
  const insets = useSafeAreaInsets();

  const playSequence = async (seq) => {
    setIsCPUPlaying(true);
    // Initial delay before sequence starts
    await new Promise(resolve => setTimeout(resolve, 800));
    
    for (let i = 0; i < seq.length; i++) {
      setAnimatingIndex(seq[i]);
      if (sfxEnabled) safeHaptics.impactAsync(ImpactFeedbackStyle.Medium);
      
      Animated.sequence([
        Animated.timing(scaleValues[seq[i]], { toValue: 1.2, duration: 200, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(scaleValues[seq[i]], { toValue: 1, duration: 100, useNativeDriver: Platform.OS !== 'web' })
      ]).start();
      
      await new Promise(resolve => setTimeout(resolve, 600));
      setAnimatingIndex(-1);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    setIsCPUPlaying(false);
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
    if (!gameStarted || isCPUPlaying) return;
    
    if (sfxEnabled) safeHaptics.impactAsync(ImpactFeedbackStyle.Medium);
    const newPlayerSeq = [...playerSequence, index];
    setPlayerSequence(newPlayerSeq);

    Animated.sequence([
      Animated.timing(scaleValues[index], { toValue: 1.15, duration: 100, useNativeDriver: Platform.OS !== 'web' }),
      Animated.timing(scaleValues[index], { toValue: 1, duration: 100, useNativeDriver: Platform.OS !== 'web' })
    ]).start();

    if (newPlayerSeq[newPlayerSeq.length - 1] !== sequence[newPlayerSeq.length - 1]) {
      setGameStarted(false);
      Alert.alert("Game Over", `You reached Level ${level}`);
      updateTokens(scaleMinigameReward(level), 'simon_says');
      return;
    }

    if (newPlayerSeq.length === sequence.length) {
      setIsCPUPlaying(true); // Prevent input immediately after last correct tap
      const newSeq = [...sequence, Math.floor(Math.random() * 4)];
      setSequence(newSeq);
      setPlayerSequence([]);
      setLevel(l => l + 1);
      await playSequence(newSeq);
    }
  };

  return (
    <GradientBackground colors={colors}>
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 68, paddingHorizontal: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
      <View style={{ gap: 20, alignItems: 'center' }}>
        <View style={{ gap: 8, alignItems: 'center' }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text }}>Simon Says</Text>
          <Text style={{ fontSize: 13, color: colors.subtext }}>Repeat the pattern</Text>
        </View>

        <GlassCard 
            colors={colors}
            color={colors.accent}
            intensity={20}
            style={{ 
                borderColor: colors.accent, 
                borderWidth: 2, 
                borderRadius: 16, 
                paddingVertical: 16, 
                paddingHorizontal: 20, 
                alignItems: 'center', 
                gap: 8,
                width: '100%' 
            }}>
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>Level: {level}</Text>
          <Text style={{ color: colors.subtext, fontSize: 13 }}>Sequence: {playerSequence.length} / {sequence.length}</Text>
        </GlassCard>

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
              ...(Platform.OS === 'web' ? {
                boxShadow: `0 4px 8px 0 ${colors.accent}4D`,
              } : {
                shadowColor: colors.accent,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4
              }),
              width: '100%'
            }}>
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>
              {level === 1 ? 'Start Game' : 'Play Again'}
            </Text>
          </TouchableOpacity>
        )}

        <GlassCard colors={colors} color={colors.tileBg} style={{ borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, width: '100%' }}>
          <Text style={{ color: colors.subtext, fontSize: 12, lineHeight: 18, textAlign: 'center' }}>
            💡 Higher levels give more tokens!
          </Text>
        </GlassCard>
      </View>
    </ScrollView>
    </GradientBackground>
  );
};
