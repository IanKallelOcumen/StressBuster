import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const soundScapes = [
  { name: 'Rain', emoji: '🌧️', description: 'Gentle rain on leaves' },
  { name: 'Forest', emoji: '🌲', description: 'Birds chirping in nature' },
  { name: 'Ocean', emoji: '🌊', description: 'Waves crashing on shore' },
  { name: 'Creek', emoji: '💧', description: 'Flowing water sounds' },
  { name: 'Wind', emoji: '💨', description: 'Calm breeze through trees' },
  { name: 'Meditation', emoji: '🧘', description: 'Ambient zen music' }
];

export const SoundScreen = ({ onBack, colors }) => {
  const [playing, setPlaying] = useState(null);
  const insets = useSafeAreaInsets();
  const scaleValue = useRef(new Animated.Value(1)).current;
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(25));
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true })
    ]).start();
  }, []);

  const handlePlay = (name) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPlaying(playing === name ? null : name);
    
    Animated.sequence([
      Animated.timing(scaleValue, { toValue: 1.05, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleValue, { toValue: 1, duration: 100, useNativeDriver: true })
    ]).start();
  };

  return (
    <Animated.ScrollView contentContainerStyle={{ paddingTop: insets.top + 68, paddingBottom: insets.bottom + 80, paddingHorizontal: 16 }} showsVerticalScrollIndicator={false} style={{ opacity: fadeAnim }}>
      <Animated.View style={{ gap: 24, transform: [{ translateY: slideAnim }] }}>
        <View style={{ gap: 4 }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text }}>Soundscapes</Text>
          <Text style={{ fontSize: 13, color: colors.subtext }}>Ambient sounds for relaxation</Text>
        </View>

        <View style={{ gap: 12 }}>
          {soundScapes.map((sound, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => handlePlay(sound.name)}
              style={{
                backgroundColor: playing === sound.name ? colors.accent + '20' : colors.tileBg,
                borderColor: playing === sound.name ? colors.accent : colors.accent + '15',
                borderWidth: 1.5,
                borderRadius: 16,
                paddingVertical: 14,
                paddingHorizontal: 14,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                shadowColor: playing === sound.name ? colors.accent : colors.text,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: playing === sound.name ? 0.15 : 0.05,
                shadowRadius: 6,
                elevation: playing === sound.name ? 3 : 1
              }}>
              <Text style={{ fontSize: 32 }}>{sound.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>{sound.name}</Text>
                <Text style={{ fontSize: 12, color: colors.subtext, marginTop: 2 }}>{sound.description}</Text>
              </View>
              <View style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: colors.accent,
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Text style={{ fontSize: 16 }}>{playing === sound.name ? '⏸️' : '▶️'}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {playing && (
          <View style={{
            backgroundColor: colors.accent + '12',
            borderColor: colors.accent + '30',
            borderWidth: 1,
            borderRadius: 14,
            paddingVertical: 12,
            paddingHorizontal: 14,
            alignItems: 'center',
            gap: 8
          }}>
            <Text style={{ color: colors.subtext, fontSize: 12 }}>Now Playing</Text>
            <Text style={{ color: colors.accent, fontSize: 18, fontWeight: '700' }}>
              {soundScapes.find(s => s.name === playing)?.emoji} {playing}
            </Text>
            <Text style={{ color: colors.subtext, fontSize: 11, textAlign: 'center' }}>
              Enjoy the calming sounds. Press to pause.
            </Text>
          </View>
        )}

        <View style={{
          backgroundColor: colors.tileBg,
          borderRadius: 14,
          paddingHorizontal: 14,
          paddingVertical: 12
        }}>
          <Text style={{ color: colors.subtext, fontSize: 12, lineHeight: 18, textAlign: 'center' }}>
            💡 Soundscapes work best with headphones for immersive relaxation.
          </Text>
        </View>
      </Animated.View>
    </Animated.ScrollView>
  );
};
