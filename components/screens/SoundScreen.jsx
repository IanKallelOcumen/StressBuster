import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { Animated, Platform, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassCard from '../ui/GlassCard';
import GradientBackground from '../ui/GradientBackground';

// Only include sounds that exist in assets/sounds/ (rain/forest/waves were removed from repo)
const soundScapes = [
  { name: 'Campfire', emoji: '🔥', description: 'Crackling fire at night', file: require('../../assets/sounds/campfire.mp3') },
  { name: 'River', emoji: '🏞️', description: 'Flowing water stream', file: require('../../assets/sounds/river.mp3') },
  { name: 'Wind', emoji: '🍃', description: 'Soft wind blowing', file: require('../../assets/sounds/wind.mp3') },
];

export const SoundScreen = ({ onBack, colors, sfxEnabled }) => {
  const [playing, setPlaying] = useState(null);
  const [sound, setSound] = useState();
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

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const handlePlay = async (item) => {
    if (sfxEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (playing === item.name) {
      // Stop playing
      setPlaying(null);
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      }
    } else {
      // Start playing new sound
      if (sound) {
        await sound.unloadAsync();
      }
      setPlaying(item.name);
      
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          item.file,
          { isLooping: true, shouldPlay: true }
        );
        setSound(newSound);
      } catch (error) {
        console.error("Error playing sound", error);
        setPlaying(null);
      }
    }
    
    Animated.sequence([
      Animated.timing(scaleValue, { toValue: 1.05, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleValue, { toValue: 1, duration: 100, useNativeDriver: true })
    ]).start();
  };

  return (
    <GradientBackground colors={colors}>
    <Animated.ScrollView contentContainerStyle={{ paddingTop: insets.top + 68, paddingBottom: insets.bottom + 80, paddingHorizontal: 16 }} showsVerticalScrollIndicator={false} style={{ opacity: fadeAnim }}>
      <Animated.View style={{ gap: 24, transform: [{ translateY: slideAnim }] }}>
        <View style={{ gap: 4 }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text }}>Soundscapes</Text>
          <Text style={{ fontSize: 13, color: colors.subtext }}>Ambient sounds for relaxation</Text>
        </View>

        <View style={{ gap: 12 }}>
          {soundScapes.map((item, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => handlePlay(item)}
              activeOpacity={0.8}
            >
              <GlassCard
                colors={colors}
                color={playing === item.name ? colors.accent + '20' : colors.tileBg}
                style={{
                  borderColor: playing === item.name ? colors.accent : colors.accent + '15',
                  borderWidth: 1.5,
                  borderRadius: 16,
                  paddingVertical: 14,
                  paddingHorizontal: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  ...(Platform.OS === 'web' ? {
                    boxShadow: playing === item.name ? `0 2px 6px 0 ${colors.accent}26` : `0 2px 6px 0 ${colors.text}0D`,
                  } : {
                    shadowColor: playing === item.name ? colors.accent : colors.text,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: playing === item.name ? 0.15 : 0.05,
                    shadowRadius: 6,
                    elevation: playing === item.name ? 3 : 1
                  })
                }}
              >
                <Text style={{ fontSize: 28 }}>{item.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
                  <Text style={{ color: colors.subtext, fontSize: 13 }}>{item.description}</Text>
                </View>
                {playing === item.name && (
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent }} />
                )}
              </GlassCard>
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
    </GradientBackground>
  );
};
