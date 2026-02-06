import { GoogleGenerativeAI } from "@google/generative-ai";
import { BlurView } from 'expo-blur';
import { addDoc, collection, doc, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp, updateDoc, writeBatch } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, FlatList, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const GEMINI_API_KEY = "AIzaSyDE2JR87MVKA3nNaKcc2bOHN9o9X5Ew1vk";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const detectMoodFromText = async text => {
  const prompt = `Analyse this text and return ONLY json {emoji,label,confidence} 0-1. Text: "${text}"`;
  try {
    const res = await model.generateContent(prompt);
    const raw = res.response.text().replace(/```json|```/g, '').trim();
    return JSON.parse(raw);
  } catch {
    return { emoji: '😐', label: 'Neutral', confidence: 0.5 };
  }
};

const ICONS = {
  close: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z'
};

export const AIChatScreen = ({ onBack, colors, profile, updateTokens, user, setProfileLocally, db, firebaseConfig }) => {
  const [msgs, setMsgs] = useState([]);
  const [txt, setTxt] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true })
    ]).start();
  }, [fadeAnim, slideAnim]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/chats`),
      orderBy('createdAt', 'desc'),
      limit(30)
    );
    const unsub = onSnapshot(q, s => {
      const h = s.docs.map(d => ({ id: d.id, ...d.data(), isAi: d.data().sender === 'ai' }));
      setMsgs(h.length ? h : [{ id: 'init', text: "Hi! I'm Zen. How are you feeling?", isAi: true }]);
    });
    return unsub;
  }, [user]);

  const send = async () => {
    if (!txt.trim() || (profile?.zenTokens || 0) < 5) {
      Alert.alert("Tokens", "Need 5 tokens to chat.");
      return;
    }
    
    const textToSend = txt;
    setTxt("");
    setIsTyping(true);
    
    try {
      await addDoc(collection(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/chats`), {
        text: textToSend,
        sender: 'user',
        createdAt: serverTimestamp()
      });
      
      updateTokens(-5, "ai_chat_cost");
      
      const mood = await detectMoodFromText(textToSend);
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
      
      const prompt = `You are Zen, a mental-health AI. Short calm answer (2-3 sentences max). User: ${textToSend}`;
      const result = await model.generateContent(prompt);
      const aiText = result.response.text();
      
      await addDoc(collection(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/chats`), {
        text: aiText,
        sender: 'ai',
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.error("Chat error:", e);
      Alert.alert("Zen Error", "Failed to connect. Check your tokens.");
    } finally {
      setIsTyping(false);
    }
  };

  const clearHistory = async () => {
    const q = query(collection(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/chats`));
    const snap = await getDocs(q);
    const batch = writeBatch(db);
    snap.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
    setMsgs([{ id: 'init', text: "Hi! I'm Zen. How are you feeling?", isAi: true }]);
  };

  const insets = useSafeAreaInsets();
  
  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
      {/* Backdrop */}
      <TouchableOpacity 
        activeOpacity={1} 
        style={{ flex: 1 }} 
        onPress={onBack}
      />
      
      {/* Floating Chat Modal */}
      <Animated.View 
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }}
      >
        <BlurView intensity={95} tint={colors.blurTint} style={{ borderTopLeftRadius: 32, borderTopRightRadius: 32, overflow: 'hidden' }}>
          <View style={{
            backgroundColor: colors.screenBg,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            maxHeight: insets.bottom + 480,
            minHeight: insets.bottom + 300,
            paddingTop: 20,
            paddingHorizontal: 0,
            borderWidth: 0.5,
            borderColor: colors.accent + '20',
            shadowColor: colors.text,
            shadowOffset: { width: 0, height: -8 },
            shadowOpacity: 0.15,
            shadowRadius: 20,
            elevation: 10
          }}>
            {/* Header */}
            <View style={{ paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 0.5, borderColor: colors.accent + '15' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>Zen Companion</Text>
                  <Text style={{ color: colors.subtext, fontSize: 11, marginTop: 2 }}>💬 5 Tokens per message</Text>
                </View>
                <TouchableOpacity onPress={onBack} style={{ padding: 8, marginRight: -8 }}>
                  <Svg width={24} height={24} viewBox="0 0 24 24">
                    <Path d={ICONS.close} fill={colors.text} />
                  </Svg>
                </TouchableOpacity>
              </View>
            </View>

            {/* Messages FlatList */}
            <FlatList
              data={msgs}
              inverted
              keyExtractor={item => item.id}
              contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
              scrollIndicatorInsets={{ bottom: 60 }}
              renderItem={({ item }) => (
                <View style={{
                  alignSelf: item.isAi ? 'flex-start' : 'flex-end',
                  backgroundColor: item.isAi ? colors.tileBg : colors.accent,
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  borderRadius: 16,
                  marginVertical: 6,
                  maxWidth: '85%',
                  shadowColor: colors.text,
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: item.isAi ? 0.05 : 0.1,
                  shadowRadius: 3,
                  elevation: 1
                }}>
                  <Text style={{ color: item.isAi ? colors.text : '#fff', fontSize: 14, lineHeight: 20 }}>
                    {item.text}
                  </Text>
                </View>
              )}
            />

            {/* Typing Indicator */}
            {isTyping && (
              <View style={{ paddingHorizontal: 16, paddingBottom: 8, flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                <Text style={{ color: colors.subtext, fontSize: 12 }}>Zen is thinking</Text>
                <ActivityIndicator color={colors.accent} size="small" />
              </View>
            )}

            {/* Input Area */}
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <View style={{ 
                paddingHorizontal: 14, 
                paddingVertical: 12, 
                paddingBottom: Math.max(insets.bottom + 12, 16),
                backgroundColor: colors.tileBg, 
                borderTopWidth: 0.5, 
                borderColor: colors.accent + '15'
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <TouchableOpacity 
                    onPress={clearHistory} 
                    style={{ 
                      paddingHorizontal: 12, 
                      paddingVertical: 6, 
                      backgroundColor: colors.screenBg, 
                      borderRadius: 12, 
                      borderWidth: 1, 
                      borderColor: colors.accent + '20' 
                    }}>
                    <Text style={{ color: colors.subtext, fontSize: 11, fontWeight: '600' }}>🗑️ Clear</Text>
                  </TouchableOpacity>
                  <View style={{ flex: 1 }} />
                  <View style={{ backgroundColor: colors.accent + '15', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 }}>
                    <Text style={{ color: colors.accent, fontSize: 10, fontWeight: '700' }}>💎 {profile?.zenTokens || 0}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10 }}>
                  <TextInput
                    value={txt}
                    onChangeText={setTxt}
                    placeholder="Type your thoughts..."
                    placeholderTextColor={colors.subtext}
                    editable={!isTyping}
                    style={{
                      flex: 1,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      backgroundColor: colors.screenBg,
                      borderRadius: 22,
                      color: colors.text,
                      fontSize: 14,
                      maxHeight: 90,
                      borderWidth: 1,
                      borderColor: colors.accent + '20'
                    }}
                    multiline
                  />
                  <TouchableOpacity
                    onPress={send}
                    disabled={isTyping || !txt.trim()}
                    style={{ 
                      width: 48,
                      height: 48,
                      backgroundColor: isTyping || !txt.trim() ? colors.subtext + '40' : colors.accent,
                      borderRadius: 24,
                      justifyContent: 'center',
                      alignItems: 'center',
                      shadowColor: colors.accent,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: isTyping || !txt.trim() ? 0 : 0.3,
                      shadowRadius: 6,
                      elevation: isTyping || !txt.trim() ? 0 : 4
                    }}>
                    <Text style={{ 
                      color: '#fff', 
                      fontWeight: '700', 
                      fontSize: 14
                    }}>
                      {isTyping ? '⏳' : '➤'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </BlurView>
      </Animated.View>
    </View>
  );
};

export { detectMoodFromText };
