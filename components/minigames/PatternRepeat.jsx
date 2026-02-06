import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const PatternRepeat = ({ onBack, colors, updateTokens }) => {
  const [pattern, setPattern] = useState([]);
  const [userPattern, setUserPattern] = useState([]);
  const [isShowingPattern, setIsShowingPattern] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [level, setLevel] = useState(0);
  const [gameActive, setGameActive] = useState(false);

  const buttonColors = [
    { id: 0, color: colors.icon.red, label: 'Red' },
    { id: 1, color: colors.icon.green, label: 'Green' },
    { id: 2, color: colors.icon.blue, label: 'Blue' },
    { id: 3, color: colors.icon.yellow, label: 'Yellow' }
  ];

  const startGame = () => {
    setLevel(1);
    setGameActive(true);
    const newPattern = [Math.floor(Math.random() * 4)];
    setPattern(newPattern);
    setUserPattern([]);
    setTimeout(() => showPattern(newPattern), 500);
  };

  const showPattern = async (patternToShow) => {
    setIsShowingPattern(true);
    for (let i = 0; i < patternToShow.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setActiveButton(patternToShow[i]);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await new Promise(resolve => setTimeout(resolve, 500));
      setActiveButton(null);
    }
    setIsShowingPattern(false);
  };

  const handleButtonPress = (buttonId) => {
    if (isShowingPattern || !gameActive) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveButton(buttonId);
    setTimeout(() => setActiveButton(null), 200);
    
    const newUserPattern = [...userPattern, buttonId];
    setUserPattern(newUserPattern);
    
    // Check if correct
    if (pattern[newUserPattern.length - 1] !== buttonId) {
      // Wrong!
      gameOver();
      return;
    }
    
    // Check if pattern completed
    if (newUserPattern.length === pattern.length) {
      // Correct! Next level
      const reward = level * 5;
      updateTokens(reward, 'pattern_game');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      setTimeout(() => {
        const newLevel = level + 1;
        setLevel(newLevel);
        const newPattern = [...pattern, Math.floor(Math.random() * 4)];
        setPattern(newPattern);
        setUserPattern([]);
        setTimeout(() => showPattern(newPattern), 500);
      }, 1000);
    }
  };

  const gameOver = () => {
    setGameActive(false);
    const totalReward = level * 5;
    Alert.alert('Game Over!', `You reached level ${level}\n+${totalReward} tokens`);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  };

  const insets = useSafeAreaInsets();
  
  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 68, paddingBottom: 40, alignItems: 'center' }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 10 }}>Pattern Repeat</Text>
      <Text style={{ color: colors.subtext, marginBottom: 30 }}>Repeat the pattern!</Text>
      
      <View style={{
        backgroundColor: colors.tileBg,
        padding: 20,
        borderRadius: 20,
        marginBottom: 30,
        minWidth: 200,
        alignItems: 'center'
      }}>
        <Text style={{ color: colors.subtext, fontSize: 14 }}>Level</Text>
        <Text style={{ color: colors.accent, fontSize: 36, fontWeight: 'bold' }}>{level}</Text>
      </View>
      
      <View style={{ width: 250, height: 250, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          {[0, 1].map(id => (
            <TouchableOpacity
              key={id}
              onPress={() => handleButtonPress(id)}
              disabled={isShowingPattern || !gameActive}
              style={{
                width: 100,
                height: 100,
                margin: 5,
                backgroundColor: activeButton === id ? buttonColors[id].color : buttonColors[id].color + '80',
                borderRadius: 15,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: activeButton === id ? buttonColors[id].color : 'transparent',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 15,
                elevation: activeButton === id ? 10 : 3
              }}>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ flexDirection: 'row' }}>
          {[2, 3].map(id => (
            <TouchableOpacity
              key={id}
              onPress={() => handleButtonPress(id)}
              disabled={isShowingPattern || !gameActive}
              style={{
                width: 100,
                height: 100,
                margin: 5,
                backgroundColor: activeButton === id ? buttonColors[id].color : buttonColors[id].color + '80',
                borderRadius: 15,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: activeButton === id ? buttonColors[id].color : 'transparent',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 15,
                elevation: activeButton === id ? 10 : 3
              }}>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {!gameActive && (
        <TouchableOpacity
          onPress={startGame}
          style={{
            backgroundColor: colors.accent,
            paddingVertical: 15,
            paddingHorizontal: 40,
            borderRadius: 25,
            marginTop: 20
          }}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>
            {level === 0 ? 'START GAME' : 'PLAY AGAIN'}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};
