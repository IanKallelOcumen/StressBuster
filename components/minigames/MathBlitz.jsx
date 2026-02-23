import { useEffect, useRef, useState } from 'react';
import { Animated, Platform, Text, TouchableOpacity, View } from 'react-native';
import { safeHaptics, NotificationFeedbackType } from '../../utils/haptics';
import { scaleMinigameReward } from '../../utils/zenTokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassCard from '../ui/GlassCard';
import GradientBackground from '../ui/GradientBackground';

const generateProblem = () => {
  const num1 = Math.floor(Math.random() * 20) + 1;
  const num2 = Math.floor(Math.random() * 20) + 1;
  const operation = ['+', '-', '*'][Math.floor(Math.random() * 3)];
  let answer;
  if (operation === '+') answer = num1 + num2;
  else if (operation === '-') answer = Math.max(1, num1 - num2);
  else answer = num1 * num2;
  
  const wrong1 = answer + Math.floor(Math.random() * 10) + 1;
  const wrong2 = Math.max(0, answer - Math.floor(Math.random() * 10) - 1);
  const options = [answer, wrong1, wrong2].sort(() => Math.random() - 0.5);
  
  return { problem: `${num1} ${operation} ${num2}`, answer, options };
};

export const MathBlitz = ({ onBack, colors, updateTokens, sfxEnabled }) => {
  const insets = useSafeAreaInsets();
  const [problem, setProblem] = useState(generateProblem());
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [gameActive, setGameActive] = useState(true);
  const [feedback, setFeedback] = useState('');
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!gameActive) {
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: Platform.OS !== 'web' }).start();
    }
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive || time <= 0) {
      setGameActive(false);
      if (score > 0) {
        const reward = scaleMinigameReward(Math.max(1, Math.floor(score / 2)));
        updateTokens(reward);
      }
      return;
    }

    const timer = setInterval(() => setTime(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [gameActive, time, score]);

  const handleAnswer = async (selected) => {
    if (!gameActive) return;
    
    if (selected === problem.answer) {
      if (sfxEnabled) safeHaptics.notificationAsync(NotificationFeedbackType.Success);
      setScore(s => s + 1);
      setFeedback('✓ Correct!');
      setProblem(generateProblem());
      setTimeout(() => setFeedback(''), 1000);
    } else {
      if (sfxEnabled) safeHaptics.notificationAsync(NotificationFeedbackType.Warning);
      setFeedback('✗ Wrong');
      setTimeout(() => setFeedback(''), 800);
    }
  };

  return (
    <GradientBackground colors={colors}>
    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: insets.top + 60, paddingHorizontal: 20, paddingBottom: 20 }}>
      <Text style={{ fontSize: 32, fontWeight: '800', color: colors.text, marginBottom: 10 }}>Math Blitz</Text>
      
      <View style={{ flexDirection: 'row', gap: 20, marginBottom: 40 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: colors.subtext, fontSize: 12, fontWeight: '600' }}>Time</Text>
          <Text style={{ color: colors.accent, fontSize: 32, fontWeight: '800' }}>{time}</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: colors.subtext, fontSize: 12, fontWeight: '600' }}>Score</Text>
          <Text style={{ color: colors.accent, fontSize: 32, fontWeight: '800' }}>{score}</Text>
        </View>
      </View>

      {gameActive ? (
        <View style={{ alignItems: 'center', width: '100%', gap: 20 }}>
          <GlassCard
            colors={colors}
            color={colors.accent}
            intensity={20}
            style={{
              paddingVertical: 30,
              paddingHorizontal: 40,
              minWidth: 200,
              alignItems: 'center',
              borderRadius: 16,
              borderWidth: 2,
              borderColor: colors.accent
            }}>
            <Text style={{ fontSize: 28, fontWeight: '700', color: colors.text }}>{problem.problem}</Text>
            <Text style={{ fontSize: 14, color: colors.subtext, marginTop: 8 }}>= ?</Text>
          </GlassCard>

          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.accent, height: 24 }}>
            {feedback}
          </Text>

          <View style={{ gap: 12, width: '100%' }}>
            {problem.options.map((opt, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => handleAnswer(opt)}
                style={{ width: '100%' }}>
                <GlassCard
                  colors={colors}
                  color={colors.tileBg}
                  style={{
                    paddingVertical: 16,
                    alignItems: 'center',
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: colors.accent + '40'
                  }}>
                  <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600' }}>{opt}</Text>
                </GlassCard>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <Animated.View style={{ alignItems: 'center', gap: 12, transform: [{ scale: scaleAnim }] }}>
          <Text style={{ fontSize: 28, fontWeight: '700', color: colors.text }}>Game Over!</Text>
          <View style={{ backgroundColor: colors.accent + '20', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 24, alignItems: 'center' }}>
            <Text style={{ color: colors.subtext, fontSize: 12, fontWeight: '600' }}>Final Score</Text>
            <Text style={{ color: colors.accent, fontSize: 40, fontWeight: '800' }}>{score}</Text>
            <Text style={{ color: colors.accent, fontSize: 14, fontWeight: '600', marginTop: 8 }}>+{Math.max(1, Math.floor(score / 2))} tokens</Text>
          </View>
        </Animated.View>
      )}
    </View>
    </GradientBackground>
  );
};
