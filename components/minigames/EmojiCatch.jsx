import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { safeHaptics, NotificationFeedbackType } from '../../utils/haptics';
import { scaleMinigameReward } from '../../utils/zenTokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassCard from '../ui/GlassCard';
import GradientBackground from '../ui/GradientBackground';

const MIN_ITEM_SIZE = 36;
const MAX_ITEM_SIZE = 52;
const INNER_PADDING = 8;

const EmojiCatch = ({ onBack, colors, updateTokens, sfxEnabled }) => {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [items, setItems] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameArea, setGameArea] = useState({ width: 0, height: 0 });
  const gameLoopRef = useRef();
  const lastSpawnTime = useRef(0);
  const lastFrameRef = useRef(null);
  const livesRef = useRef(lives);
  const scoreRef = useRef(score);
  const gameOverRef = useRef(gameOver);
  const gameAreaRef = useRef({ width: 0, height: 0 });
  const mountedRef = useRef(true);
  const itemSize = Math.max(MIN_ITEM_SIZE, Math.min(MAX_ITEM_SIZE, Math.floor((gameArea.width || width) / 8)));
  const speedPerSec = Math.max(90, (gameArea.height || height) * 0.3);

  const EMOJIS = [
    { type: 'good', char: '😊' },
    { type: 'good', char: '🌟' },
    { type: 'good', char: '💖' },
    { type: 'bad', char: '💣' },
    { type: 'bad', char: '😡' },
  ];

  const spawnItem = () => {
    if (!gameAreaRef.current.width || !gameAreaRef.current.height) return null;
    const id = Date.now() + Math.random();
    const maxX = Math.max(0, gameAreaRef.current.width - itemSize - INNER_PADDING * 2);
    const x = INNER_PADDING + Math.random() * maxX;
    const typeObj = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    return { id, x, y: -itemSize, ...typeObj };
  };

  const updateGame = (now) => {
    if (!mountedRef.current || gameOverRef.current) return;
    if (!lastFrameRef.current) lastFrameRef.current = now;
    const delta = (now - lastFrameRef.current) / 1000;
    lastFrameRef.current = now;

    if (now - lastSpawnTime.current > 1500) {
      const newItem = spawnItem();
      if (newItem) setItems(prev => [...prev, newItem]);
      lastSpawnTime.current = now;
    }

    setItems(prevItems => {
      const newItems = prevItems.map(item => ({ ...item, y: item.y + speedPerSec * delta }));
      
      // Check for missed items or off-screen
      const filteredItems = newItems.filter(item => {
        if (item.y > gameAreaRef.current.height + itemSize) {
          if (item.type === 'good') {
            setLives(l => {
                const newLives = l - 1;
                if (newLives <= 0 && !gameOverRef.current) {
                    setGameOver(true);
                }
                return newLives;
            });
            if (sfxEnabled) safeHaptics.notificationAsync(NotificationFeedbackType.Error);
          }
          return false;
        }
        return true;
      });
      
      return filteredItems;
    });

    if (!gameOverRef.current && livesRef.current > 0) {
      gameLoopRef.current = requestAnimationFrame(updateGame);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    if (!gameOver && gameAreaRef.current.height > 0) {
      gameLoopRef.current = requestAnimationFrame(updateGame);
    }
    return () => {
      mountedRef.current = false;
      if (gameLoopRef.current != null) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameOver, gameArea.height]);

  useEffect(() => {
    if (gameOver) {
        const raw = Math.floor(score / 10);
        if (raw > 0 && updateTokens) {
            updateTokens(scaleMinigameReward(raw));
        }
    }
  }, [gameOver]);
  
  useEffect(() => { livesRef.current = lives; }, [lives]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);

  const handleTap = (id, type) => {
    if (gameOver) return;
    
    if (sfxEnabled) safeHaptics.selectionAsync();
    
    if (type === 'good') {
      setScore(s => s + 10);
      setItems(prev => prev.filter(i => i.id !== id));
    } else {
      setLives(l => {
          const newLives = l - 1;
          if (newLives <= 0) setGameOver(true);
          return newLives;
      });
      setItems(prev => prev.filter(i => i.id !== id));
      if (sfxEnabled) safeHaptics.notificationAsync(NotificationFeedbackType.Error);
    }
  };

  const restart = () => {
    setScore(0);
    setLives(3);
    setItems([]);
    setGameOver(false);
    lastSpawnTime.current = Date.now();
    lastFrameRef.current = null;
  };

  return (
    <GradientBackground colors={colors}>
    <View style={[styles.container, { paddingTop: insets.top + 68, paddingHorizontal: 16, paddingBottom: insets.bottom + 40 }]}>
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={[styles.title, { color: colors.text }]}>Emoji Rain</Text>
        <Text style={styles.lives}>{'❤️'.repeat(Math.max(0, lives))}</Text>
      </View>
      
      <Text style={[styles.score, { color: colors.icon?.yellow || '#FFD60A' }]}>Score: {score}</Text>

      <View
        style={styles.gameArea}
        onLayout={(e) => {
          const { width: w, height: h } = e.nativeEvent.layout;
          setGameArea({ width: w, height: h });
          gameAreaRef.current = { width: w, height: h };
        }}
      >
      {gameOver && (
        <GlassCard intensity={80} style={styles.gameOver} colors={colors} color={colors.tileBg}>
          <Text style={styles.gameOverText}>Game Over</Text>
          <Text style={[styles.finalScore, { color: colors.text }]}>Final Score: {score}</Text>
          <Text style={[styles.finalScore, { fontSize: 18, marginTop: -20, color: colors.accent }]}>
             {Math.floor(score / 10) > 0 ? `+${Math.floor(score / 10)} Tokens` : ''}
          </Text>
          <TouchableOpacity onPress={restart} style={[styles.restartButton, { backgroundColor: colors.icon?.green || '#30D158' }]}>
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>
        </GlassCard>
      )}

      {items.map(item => (
        <TouchableOpacity
          key={item.id}
          style={[styles.item, { left: item.x, top: item.y, width: itemSize, height: itemSize }]}
          onPress={() => handleTap(item.id, item.type)}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: Math.floor(itemSize * 0.8) }}>{item.char}</Text>
        </TouchableOpacity>
      ))}
      </View>
    </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  lives: {
    fontSize: 18,
  },
  score: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  gameArea: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  item: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOver: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  gameOverText: {
    fontSize: 40,
    color: '#FF3B30',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  finalScore: {
    fontSize: 24,
    color: '#FFF',
    marginBottom: 30,
  },
  restartButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EmojiCatch;
