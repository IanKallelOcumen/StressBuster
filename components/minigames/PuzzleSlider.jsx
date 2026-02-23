import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { safeHaptics, ImpactFeedbackStyle, NotificationFeedbackType } from '../../utils/haptics';
import { scaleMinigameReward } from '../../utils/zenTokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassCard from '../ui/GlassCard';
import GradientBackground from '../ui/GradientBackground';

export const PuzzleSlider = ({ onBack, colors, updateTokens, sfxEnabled }) => {
  const [tiles, setTiles] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    let arr = Array.from({ length: 8 }, (_, i) => i + 1);
    arr.push(null);
    
    // Shuffle
    for (let i = 0; i < 200; i++) {
      const emptyIdx = arr.indexOf(null);
      const adjacents = [emptyIdx - 3, emptyIdx + 3, emptyIdx - 1, emptyIdx + 1]
        .filter(i => i >= 0 && i < 9 && Math.abs(i - emptyIdx) <= 3);
      const randomAdj = adjacents[Math.floor(Math.random() * adjacents.length)];
      [arr[emptyIdx], arr[randomAdj]] = [arr[randomAdj], arr[emptyIdx]];
    }
    
    setTiles(arr);
    setMoves(0);
    setGameWon(false);
  };

  const canMove = (index) => {
    const emptyIdx = tiles.indexOf(null);
    const row = Math.floor(index / 3);
    const col = index % 3;
    const emptyRow = Math.floor(emptyIdx / 3);
    const emptyCol = emptyIdx % 3;

    return (row === emptyRow && Math.abs(col - emptyCol) <= 1) ||
           (col === emptyCol && Math.abs(row - emptyRow) <= 1);
  };

  const handleTap = (index) => {
    if (!canMove(index) || gameWon) return;

    if (sfxEnabled) safeHaptics.impactAsync(ImpactFeedbackStyle.Medium);
    const emptyIdx = tiles.indexOf(null);
    const newTiles = [...tiles];
    [newTiles[index], newTiles[emptyIdx]] = [newTiles[emptyIdx], newTiles[index]];
    setTiles(newTiles);
    setMoves(m => m + 1);

    // Check win
    const isSolved = newTiles.slice(0, 8).every((t, i) => t === i + 1) && newTiles[8] === null;
    if (isSolved) {
      if (sfxEnabled) safeHaptics.notificationAsync(NotificationFeedbackType.Success);
      setGameWon(true);
      updateTokens(scaleMinigameReward(Math.max(1, 10 - Math.floor(moves / 5))), 'puzzle_slider');
    }
  };

  return (
    <GradientBackground colors={colors}>
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 68, paddingHorizontal: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
      <View style={{ gap: 20, alignItems: 'center' }}>
        <View style={{ gap: 8, alignItems: 'center' }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text }}>Puzzle Slider</Text>
          <Text style={{ fontSize: 13, color: colors.subtext }}>Arrange tiles in order</Text>
        </View>

        <GlassCard colors={colors} color={colors.tileBg} style={{ borderRadius: 12, paddingVertical: 12, paddingHorizontal: 20, alignItems: 'center' }}>
          <Text style={{ color: colors.subtext, fontSize: 12 }}>Moves: {moves}</Text>
        </GlassCard>

        <View style={{ width: '100%', aspectRatio: 1, gap: 4, flexWrap: 'wrap', flexDirection: 'row', alignContent: 'flex-start' }}>
          {tiles.map((tile, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => handleTap(idx)}
              disabled={!tile || !canMove(idx) || gameWon}
              style={{
                width: '33.333%',
                aspectRatio: 1,
                padding: 2,
              }}>
              <GlassCard
                colors={colors}
                color={tile ? colors.accent : colors.tileBg}
                intensity={tile ? 40 : 10}
                style={{
                  flex: 1,
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: tile ? 1 : 0.3,
                  borderWidth: tile && canMove(idx) ? 1 : 0,
                  borderColor: colors.accent + '50'
                }}>
                {tile && <Text style={{ fontSize: 24, fontWeight: '800', color: colors.text }}>{tile}</Text>}
              </GlassCard>
            </TouchableOpacity>
          ))}
        </View>

        {gameWon && (
          <GlassCard colors={colors} color={colors.icon.green} style={{ borderRadius: 16, paddingVertical: 16, paddingHorizontal: 20, alignItems: 'center', width: '100%', gap: 8 }}>
            <Text style={{ color: colors.icon.green, fontSize: 18, fontWeight: '700' }}>🎉 Puzzle Solved!</Text>
            <Text style={{ color: colors.subtext, fontSize: 13 }}>Completed in {moves} moves</Text>
          </GlassCard>
        )}

        {gameWon && (
          <TouchableOpacity
            onPress={initializeGame}
            style={{ width: '100%' }}>
            <GlassCard colors={colors} color={colors.accent} style={{
              paddingVertical: 13,
              paddingHorizontal: 40,
              borderRadius: 12,
              width: '100%',
              alignItems: 'center',
            }}>
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>Play Again</Text>
            </GlassCard>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
    </GradientBackground>
  );
};
