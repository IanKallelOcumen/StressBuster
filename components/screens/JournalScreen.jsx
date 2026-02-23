import { addDoc, collection, doc, limit, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { safeHaptics, ImpactFeedbackStyle, NotificationFeedbackType } from '../../utils/haptics';
import { moodFromKeywords } from '../../utils/moodFromKeywords';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, FlatList, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassCard from '../ui/GlassCard';
import GradientBackground from '../ui/GradientBackground';

export const JournalScreen = ({ onBack, colors, user, db, firebaseConfig, setProfileLocally, sfxEnabled }) => {
  const [entries, setEntries] = useState([]);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const slideInAnim = useRef(new Animated.Value(100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const useNativeDriver = Platform.OS !== 'web';
  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideInAnim, { toValue: 0, duration: 400, useNativeDriver }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 400, useNativeDriver })
    ]).start();
  }, [slideInAnim, opacityAnim, useNativeDriver]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/journal`),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const unsub = onSnapshot(q, s => setEntries(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    return unsub;
  }, [user]);

  const save = async () => {
    if (!note.trim()) return;
    if (sfxEnabled) safeHaptics.impactAsync(ImpactFeedbackStyle.Medium);
    setSaving(true);
    
    try {
      if (sfxEnabled) safeHaptics.notificationAsync(NotificationFeedbackType.Success);
      await addDoc(collection(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/journal`), {
        text: note,
        createdAt: serverTimestamp()
      });
      
      const mood = moodFromKeywords(note);
      await updateDoc(doc(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/data/profile`), {
        lastMood: mood.emoji,
        lastMoodLabel: mood.label,
        lastMoodConfidence: mood.confidence
      });
      setProfileLocally(p => ({
        ...p,
        lastMood: mood.emoji,
        lastMoodLabel: mood.label,
        lastMoodConfidence: mood.confidence
      }));
      
      setNote("");
    } finally {
      setSaving(false);
    }
  };

  const insets = useSafeAreaInsets();
  
  return (
    <GradientBackground colors={colors}>
    <Animated.ScrollView contentContainerStyle={{ paddingTop: insets.top + 68, paddingHorizontal: 16, paddingBottom: insets.bottom + 80 }} showsVerticalScrollIndicator={false} style={{ opacity: opacityAnim, transform: [{ translateY: slideInAnim }] }}>
        <Animated.View style={{ marginBottom: 20, opacity: opacityAnim, paddingLeft: 52 }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text }}>Journal</Text>
          <Text style={{ fontSize: 14, color: colors.subtext, marginTop: 4 }}>Capture your thoughts and feelings</Text>
        </Animated.View>
        
        <GlassCard colors={colors} color={colors.accent + '08'} style={{ borderColor: colors.accent + '30', paddingHorizontal: 14, paddingVertical: 12 }}>
        <View style={{ gap: 12 }}>
          <Text style={{ color: colors.subtext, fontSize: 12, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5 }}>Today’s Entry</Text>
          <TextInput
            multiline
            value={note}
            onChangeText={setNote}
            editable={!saving}
            style={{
              minHeight: 120,
              padding: 14,
              color: colors.text,
              fontSize: 16,
              backgroundColor: colors.screenBg,
              borderRadius: 14,
              textAlignVertical: 'top',
              borderWidth: 1,
              borderColor: colors.accent + '20'
            }}
            placeholder="How are you feeling today?"
            placeholderTextColor={colors.subtext}
          />
          <TouchableOpacity
            onPress={save}
            disabled={saving || !note.trim()}
            style={{
              backgroundColor: saving || !note.trim() ? colors.subtext + '40' : colors.accent,
              paddingVertical: 13,
              paddingHorizontal: 20,
              borderRadius: 14,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 8,
              ...(Platform.OS === 'web' ? {
                boxShadow: saving || !note.trim() ? 'none' : `0 4px 8px 0 ${colors.accent}4D`,
              } : {
                shadowColor: colors.accent,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: saving || !note.trim() ? 0 : 0.3,
                shadowRadius: 8,
                elevation: saving || !note.trim() ? 0 : 4
              })
            }}>
            {saving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : null}
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>
              {saving ? 'Saving...' : 'Save Entry'}
            </Text>
          </TouchableOpacity>
        </View>
      </GlassCard>
      
      {entries.length > 0 && (
        <View style={{ marginTop: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12 }}>Previous Entries</Text>
          <FlatList
            data={entries}
            keyExtractor={i => i.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <GlassCard colors={colors} color={colors.tileBg} style={{ marginBottom: 10, borderColor: colors.accent + '10', paddingHorizontal: 16, paddingVertical: 14 }}>
                <Text style={{ color: colors.text, fontSize: 14, lineHeight: 20 }} numberOfLines={8}>{item.text}</Text>
                {item.createdAt && (
                  <Text style={{ color: colors.subtext, fontSize: 11, marginTop: 10 }}>
                    {new Date(item.createdAt.toDate?.() || item.createdAt).toLocaleDateString()}
                  </Text>
                )}
              </GlassCard>
            )}
          />
        </View>
      )}
      
      {entries.length === 0 && !note && (
        <View style={{ marginTop: 40, alignItems: 'center', opacity: 0.6 }}>
          <Text style={{ fontSize: 40, marginBottom: 10 }}>📝</Text>
          <Text style={{ color: colors.subtext, fontSize: 14, textAlign: 'center' }}>Start journaling to track your emotional journey</Text>
        </View>
      )}
    </Animated.ScrollView>
    </GradientBackground>
  );
};
