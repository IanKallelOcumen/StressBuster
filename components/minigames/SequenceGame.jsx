import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';

const BackButton = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      position: 'absolute',
      top: 16,
      left: 16,
      zIndex: 999,
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 8,
      padding: 8
    }}>
    <Text style={{ fontSize: 20 }}>←</Text>
  </TouchableOpacity>
);

const symbols = ['🔴', '🟢', '🔵', '🟡', '🟣', '🟠'];

export const SequenceGame = ({ onBack, colors, updateTokens }) => {
  const [sequence, setSequence] = useState(['🔴']);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('Watch the pattern...');
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (gameOver) {
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
    }
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;

    if (playerSequence.length === 0 && sequence.length > 0) {
      setTimeout(() => playSequence(), 800);
    }
  }, [sequence, playerSequence, gameOver]);

  const playSequence = async () => {
    setMessage('Watch...');
    for (let i = 0; i < sequence.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    setMessage('Your turn!');
  };

  const handleTap = async (symbol) => {
    if (gameOver || playerSequence.length === sequence.length) return;

    await Haptics.selectionAsync();
    const newPlayer = [...playerSequence, symbol];
    setPlayerSequence(newPlayer);

    if (symbol !== sequence[newPlayer.length - 1]) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      setGameOver(true);
      setMessage('Game Over! 😢');
      const reward = Math.max(1, level);
      updateTokens(reward);
      return;
    }

    if (newPlayer.length === sequence.length) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setMessage('Perfect! Level ' + (level + 1));
      setLevel(level + 1);

      setTimeout(() => {
        const newSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        setSequence([...sequence, newSymbol]);
        setPlayerSequence([]);
        setMessage('Watch...');
      }, 1200);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.screenBg, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <BackButton onPress={onBack} />

      <Text style={{ fontSize: 32, fontWeight: '800', color: colors.text, marginBottom: 20 }}>Sequence Memory</Text>

      <View style={{ alignItems: 'center', gap: 20, width: '100%' }}>
        <View style={{ flexDirection: 'row', gap: 20 }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: colors.subtext, fontSize: 11, fontWeight: '600' }}>Level</Text>
            <Text style={{ color: colors.accent, fontSize: 32, fontWeight: '800' }}>{level}</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: colors.subtext, fontSize: 11, fontWeight: '600' }}>Sequence</Text>
            <Text style={{ color: colors.accent, fontSize: 32, fontWeight: '800' }}>{sequence.length}</Text>
          </View>
        </View>

        <View style={{
          backgroundColor: colors.tileBg,
          borderRadius: 16,
          padding: 20,
          minHeight: 100,
          justifyContent: 'center',
          borderWidth: 2,
          borderColor: colors.accent + '40',
          width: '100%'
        }}>
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 8
          }}>
            {sequence.map((sym, i) => (
              <Text
                key={i}
                style={{
                  fontSize: 28,
                  backgroundColor: colors.accent + '20',
                  borderRadius: 8,
                  paddingHorizontal: 8,
                  paddingVertical: 4
                }}>
                {sym}
              </Text>
            ))}
          </View>
        </View>

        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.accent, minHeight: 20 }}>
          {message}
        </Text>

        {!gameOver && (
          <View style={{
            width: '100%',
            height: 280,
            backgroundColor: colors.tileBg,
            borderRadius: 16,
            padding: 12,
            flexWrap: 'wrap',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignContent: 'space-between'
          }}>
            {symbols.map((sym) => (
              <TouchableOpacity
                key={sym}
                onPress={() => handleTap(sym)}
                disabled={playerSequence.length === sequence.length}
                style={{
                  width: '31%',
                  height: 80,
                  backgroundColor: colors.accent + '15',
                  borderRadius: 12,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: colors.accent + '40'
                }}>
                <Text style={{ fontSize: 36 }}>{sym}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {gameOver && (
          <Animated.View style={{ alignItems: 'center', gap: 16, width: '100%', transform: [{ scale: scaleAnim }] }}>
            <View style={{ backgroundColor: colors.accent + '20', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 24, alignItems: 'center' }}>
              <Text style={{ color: colors.accent, fontSize: 32, fontWeight: '800' }}>Level {level}</Text>
              <Text style={{ color: colors.accent, fontSize: 14, fontWeight: '600', marginTop: 8 }}>+{Math.max(1, level)} tokens</Text>
            </View>
            <TouchableOpacity
              onPress={onBack}
              style={{ backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24 }}>
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>Back to Games</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
};
