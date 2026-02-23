import { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { safeHaptics, NotificationFeedbackType } from '../../utils/haptics';
import { scaleMinigameReward } from '../../utils/zenTokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassCard from '../ui/GlassCard';
import GradientBackground from '../ui/GradientBackground';

const GRID_SIZE = 5;

const MemoryMatrix = ({ onBack, colors, updateTokens, sfxEnabled }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const gridSize = Math.min(width - 32, 360);
  const gapSize = 6;
  const cellSize = Math.floor((gridSize - gapSize * (GRID_SIZE - 1)) / GRID_SIZE);
  const [grid, setGrid] = useState(Array(GRID_SIZE * GRID_SIZE).fill(false));
  const [pattern, setPattern] = useState([]);
  const [userPattern, setUserPattern] = useState([]);
  const [gameState, setGameState] = useState('idle'); // idle, showing, playing, won, lost
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Start game
  const startGame = () => {
    setGameState('showing');
    setUserPattern([]);
    generatePattern(level + 2); // Start with 3 tiles
  };

  const generatePattern = (count) => {
    const newPattern = [];
    while (newPattern.length < count) {
      const index = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE));
      if (!newPattern.includes(index)) {
        newPattern.push(index);
      }
    }
    setPattern(newPattern);
    
    // Show pattern
    setGrid(prev => prev.map((_, i) => newPattern.includes(i)));
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      setGrid(Array(GRID_SIZE * GRID_SIZE).fill(false));
      setGameState('playing');
    }, 1500 + (level * 200)); // Show longer for higher levels
  };

  const handleTap = (index) => {
    if (gameState !== 'playing') return;
    if (userPattern.includes(index)) return; // Already tapped

    if (sfxEnabled) safeHaptics.selectionAsync();
    
    if (pattern.includes(index)) {
      // Correct tap
      const newUserPattern = [...userPattern, index];
      setUserPattern(newUserPattern);
      
      // Update grid visually
      const newGrid = [...grid];
      newGrid[index] = true;
      setGrid(newGrid);

      if (newUserPattern.length === pattern.length) {
        // Level complete
        if (sfxEnabled) safeHaptics.notificationAsync(NotificationFeedbackType.Success);
        setGameState('won');
        const points = level * 10;
        setScore(s => s + points);
        if (updateTokens) updateTokens(scaleMinigameReward(points / 2)); // Award half tokens for score
        
        setTimeout(() => {
          setLevel(l => l + 1);
          startGame();
        }, 1000);
      }
    } else {
      // Wrong tap
      if (sfxEnabled) safeHaptics.notificationAsync(NotificationFeedbackType.Error);
      setGameState('lost');
      Alert.alert('Game Over', `You reached Level ${level}!`, [
        { text: 'Try Again', onPress: () => { setLevel(1); setScore(0); startGame(); } },
        { text: 'Exit', onPress: onBack }
      ]);
    }
  };

  return (
    <GradientBackground colors={colors}>
    <View style={[styles.container, { paddingTop: insets.top + 68, paddingHorizontal: 16, paddingBottom: insets.bottom + 40 }]}>
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        <Text style={[styles.title, { color: colors.text }]}>Memory Matrix</Text>
        <Text style={[styles.score, { color: colors.accent }]}>Score: {score}</Text>
      </View>

      <Text style={[styles.instructions, { color: colors.subtext }]}>
        {gameState === 'idle' ? 'Tap Start to begin' : 
         gameState === 'showing' ? 'Memorize the pattern...' : 
         gameState === 'playing' ? 'Tap the tiles!' : 
         gameState === 'won' ? 'Great Job!' : 'Game Over'}
      </Text>

      <View style={[styles.grid, { width: gridSize, height: gridSize, gap: gapSize }]}>
        {Array(GRID_SIZE * GRID_SIZE).fill(0).map((_, i) => (
          <TouchableOpacity
            key={i}
            activeOpacity={0.8}
            onPress={() => handleTap(i)}
            style={[
              styles.cell,
              { 
                width: cellSize, 
                height: cellSize,
                backgroundColor: grid[i] 
                  ? colors.accent 
                  : (colors.text + '10'), // subtle empty cell
                borderColor: colors.text + '20'
              }
            ]}
          />
        ))}
      </View>

      {gameState === 'idle' && (
        <TouchableOpacity 
          onPress={startGame}
        >
          <GlassCard
            colors={colors}
            color={colors.accent}
            style={styles.startButton}
          >
            <Text style={styles.startButtonText}>Start Game</Text>
          </GlassCard>
        </TouchableOpacity>
      )}
    </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  score: {
    fontSize: 14,
    fontWeight: '700',
  },
  instructions: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cell: {
    margin: 2,
    borderRadius: 8,
    borderWidth: 1,
  },
  startButton: {
    marginTop: 40,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MemoryMatrix;
