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

export const MathBlitz = ({ onBack, colors, updateTokens }) => {
  const [problem, setProblem] = useState(generateProblem());
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [gameActive, setGameActive] = useState(true);
  const [feedback, setFeedback] = useState('');
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!gameActive) {
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
    }
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive || time <= 0) {
      setGameActive(false);
      if (score > 0) {
        const reward = Math.max(1, Math.floor(score / 2));
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
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setScore(s => s + 1);
      setFeedback('✓ Correct!');
      setProblem(generateProblem());
      setTimeout(() => setFeedback(''), 1000);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      setFeedback('✗ Wrong');
      setTimeout(() => setFeedback(''), 800);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.screenBg, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <BackButton onPress={onBack} />
      
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
          <View style={{
            backgroundColor: colors.accent + '15',
            borderRadius: 16,
            borderWidth: 2,
            borderColor: colors.accent,
            paddingVertical: 30,
            paddingHorizontal: 40,
            minWidth: 200,
            alignItems: 'center'
          }}>
            <Text style={{ fontSize: 28, fontWeight: '700', color: colors.text }}>{problem.problem}</Text>
            <Text style={{ fontSize: 14, color: colors.subtext, marginTop: 8 }}>= ?</Text>
          </View>

          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.accent, height: 24 }}>
            {feedback}
          </Text>

          <View style={{ gap: 12, width: '100%' }}>
            {problem.options.map((opt, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => handleAnswer(opt)}
                style={{
                  backgroundColor: colors.tileBg,
                  borderRadius: 12,
                  paddingVertical: 16,
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: colors.accent + '40'
                }}>
                <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600' }}>{opt}</Text>
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
          <TouchableOpacity
            onPress={onBack}
            style={{ backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24, marginTop: 20 }}>
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>Back to Games</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};
