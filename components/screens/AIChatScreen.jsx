import { GoogleGenerativeAI } from "@google/generative-ai";
import Constants from 'expo-constants';
import { addDoc, collection, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { useEffect, useRef, useState, useMemo } from 'react';
import { ActivityIndicator, Alert, Animated, FlatList, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { safeHaptics, ImpactFeedbackStyle } from '../../utils/haptics';
import { moodFromKeywords } from '../../utils/moodFromKeywords';
import { tryProviders } from '../../utils/zenChatProviders';
import { ZEN_CHAT_COST, ZEN_TIP_COST, ZEN_DAILY_CAP } from '../../utils/zenTokens';

// Helper to get safe model
const getGeminiModel = () => {
  try {
    const key = Constants.expoConfig?.extra?.geminiApiKey;
    if (__DEV__) {
      console.log("[Zen] API key present:", !!key);
    }
    if (!key || key.startsWith("your_") || key.includes("...") || key.trim() === "") {
      if (__DEV__) console.warn("[Zen] Gemini API key missing or invalid");
      return null;
    }
    const genAI = new GoogleGenerativeAI(key.trim());
    const modelsToTry = ["gemini-2.5-flash-lite", "gemini-2.5-flash", "gemini-flash-latest", "gemini-pro-latest"];
    let model;
    for (const modelId of modelsToTry) {
      try {
        model = genAI.getGenerativeModel({ model: modelId });
        break;
      } catch (err) {
        if (__DEV__) console.warn("[Zen] Model failed:", modelId, err?.message);
      }
    }
    return model ?? null;
  } catch (e) {
    if (__DEV__) console.error("[Zen] Init error:", e?.message);
    return null;
  }
};

const ICONS = {
  close: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z',
  back: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z'
};

export const ChatInterface = ({ onBack, onClose, colors, profile, updateTokens, user, setProfileLocally, db, firebaseConfig, sfxEnabled }) => {
  const [msgs, setMsgs] = useState([]);
  const [txt, setTxt] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const insets = useSafeAreaInsets();
  const mockAlertShownRef = useRef(false);

  // Safe Model Init
  const model = useMemo(() => getGeminiModel(), []);

  useEffect(() => {
    if (!model) {
      Alert.alert(
        "Configuration Error",
        "Gemini API key is missing or invalid. Check .env and restart."
      );
    }
  }, [model]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/chats`),
      orderBy('createdAt', 'desc'),
      limit(30)
    );
    // Listen for metadata changes to include pending writes immediately
    const unsub = onSnapshot(q, { includeMetadataChanges: true }, s => {
      const h = s.docs.map(d => ({ id: d.id, ...d.data(), isAi: d.data().sender === 'ai' }));
      
      const welcomeMsg = { id: 'init', text: "Hi! I'm Zen. How are you feeling?", isAi: true, createdAt: 0 };
      
      // Filter out duplicate init messages if they exist in DB (legacy)
      const cleanHistory = h.filter(m => m.text !== "Hi! I'm Zen. How are you feeling?");
      
      setMsgs([...cleanHistory, welcomeMsg]);
    });
    return unsub;
  }, [user]);

  const send = async () => {
    if (!txt.trim() || (profile?.zenTokens || 0) < ZEN_CHAT_COST) {
      Alert.alert("Tokens", `Need ${ZEN_CHAT_COST} tokens to chat.`);
      return;
    }
    
    if (!model) {
      Alert.alert("Service Unavailable", "AI Model not initialized. Please check connection.");
      return;
    }

    // Fair-use: max messages per user per day so we don't hit API rate limits
    const quotaRef = doc(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/data/zenQuota`);
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });
    try {
      const snap = await getDoc(quotaRef);
      const data = snap.exists() ? snap.data() : {};
      if (data.date === today && (data.count || 0) >= ZEN_DAILY_CAP) {
        Alert.alert("Daily limit", `Zen allows ${ZEN_DAILY_CAP} messages per day so everyone can use it. Resets at midnight PT. Try again tomorrow.`);
        return;
      }
    } catch (_) {}

    const textToSend = txt;
    setTxt("");
    setIsTyping(true);
    
    try {
      // 1. Save User Message
      await addDoc(collection(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/chats`), {
        text: textToSend,
        sender: 'user',
        createdAt: serverTimestamp()
      });

      updateTokens(-ZEN_CHAT_COST, "ai_chat_cost");

      // Update mood from Zen chat (keywords) so Insights reflects journal + chat
      const chatMood = moodFromKeywords(textToSend);
      try {
        const profileRef = doc(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/data/profile`);
        await updateDoc(profileRef, { lastChatMood: chatMood.emoji, lastChatMoodLabel: chatMood.label });
        setProfileLocally(p => ({ ...p, lastChatMood: chatMood.emoji, lastChatMoodLabel: chatMood.label }));
      } catch (_) {}

      const mood = { emoji: '😐', label: 'Neutral', confidence: 0.5 };

      // Generate Response — send chat history so Zen has context (name, previous messages, etc.)
      const systemInstruction = `You are Zen, a compassionate mental health companion in the Stress Buster app. Reply ONLY with plain conversational text. Never output JSON, code blocks, or structured data. If the user asks "do you work" or "hello", answer directly (e.g. "Yes, I'm here! How can I help?" or "Hi! How are you feeling?"). If they ask for their name, use the name from context. Keep replies brief (2–3 sentences). Be calm and supportive. User's name: ${profile?.name || 'Friend'}.`;

      const historyAsc = [...msgs]
        .filter(m => m.text && String(m.text).trim() && !/^\s*\{\s*"status"/.test(String(m.text)))
        .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
      const recentTurns = historyAsc.slice(-20);
      const contents = [
        ...recentTurns.map(m => ({
          role: m.isAi ? 'model' : 'user',
          parts: [{ text: String(m.text).trim() }]
        })),
        { role: 'user', parts: [{ text: textToSend }] }
      ];

      if (__DEV__) console.log("[Zen] Sending", contents.length, "turns");
      const extra = Constants.expoConfig?.extra ?? {};
      const providerNames = extra.zenProviders && extra.zenProviders.length ? extra.zenProviders : ['gemini'];
      const keys = {
        geminiApiKey: extra.geminiApiKey,
        groqApiKey: extra.groqApiKey,
        openAiApiKey: extra.openAiApiKey,
      };

      let aiText = '';
      try {
        aiText = await tryProviders(providerNames, keys, systemInstruction, contents);
      } catch (e) {
        if (__DEV__) console.warn("[Zen] Providers failed:", e?.message);
        const isQuota = e?.status === 429 || (e?.message && (String(e.message).includes('quota') || String(e.message).includes('429')));
        aiText = isQuota
          ? "API quota exceeded. Try again in a minute or add another provider (e.g. Groq) in .env: ZEN_PROVIDERS=gemini,groq"
          : "Connection problem. Check your API key(s) and internet, then try again.";
      }

      aiText = String(aiText ?? '').replace(/```json|```|```json\n|```\n/g, '').trim();
      const trimmed = aiText.trim();

      if (!trimmed) {
        aiText = "I'm here. Sometimes I can't put it into words — try asking again or rephrase.";
      } else {
        const isMockOrDiagnosticsJson =
          (trimmed.includes('"status"') && trimmed.includes('"issues"') && trimmed.includes('optimization_suggestions')) ||
          /^\s*\{\s*"status"\s*:\s*"healthy"/.test(trimmed);
        if (isMockOrDiagnosticsJson) {
          aiText = "Hi! I'm here. How can I help you feel better today?";
          if (!mockAlertShownRef.current) {
            mockAlertShownRef.current = true;
            Alert.alert(
              "Zen using cached mock",
              "The app is still using an old cached bundle. To fix: 1) Stop Expo (Ctrl+C). 2) Run: npx expo start --web --clear  3) Open the app and hard refresh (Ctrl+Shift+R).",
              [{ text: "OK" }]
            );
          }
        } else {
          const looksLikeJson = (trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'));
          if (looksLikeJson) {
            try {
              const parsed = JSON.parse(aiText);
              if (typeof parsed === 'object' && ('status' in parsed || 'optimization_suggestions' in parsed)) {
                aiText = "I'm here. How can I help you feel better today?";
              }
            } catch (_) {}
          }
        }
      }
      
      // 4. Save AI Message
      await addDoc(collection(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/chats`), {
        text: aiText,
        sender: 'ai',
        createdAt: serverTimestamp()
      });
      // Bump daily count for fair-use (resets at midnight PT)
      try {
        const snap = await getDoc(quotaRef);
        const data = snap.exists() ? snap.data() : {};
        const isNewDay = data.date !== today;
        await setDoc(quotaRef, { date: today, count: isNewDay ? 1 : (data.count || 0) + 1 }, { merge: true });
      } catch (_) {}
    } catch (e) {
      if (__DEV__) console.error("[Zen] Chat error:", e?.message);
      
      let errorMessage = "Connection failed. Please check your internet or API key.";
      if (e.message?.includes("API_KEY")) {
        errorMessage = "Invalid API key. Please check your .env file and restart the server.";
      } else if (e.message?.includes("quota") || e.message?.includes("429")) {
        errorMessage = "API quota exceeded. Please try again later.";
      } else if (e.message?.includes("network") || e.message?.includes("fetch")) {
        errorMessage = "Network error. Please check your internet connection.";
      }
      
      Alert.alert("Zen Error", errorMessage);
      updateTokens(ZEN_CHAT_COST, "ai_chat_refund");
    } finally {
      setIsTyping(false);
    }
  };

  const getZenTip = async () => {
    if ((profile?.zenTokens || 0) < ZEN_TIP_COST) {
       Alert.alert("Tokens", `Need ${ZEN_TIP_COST} tokens for a tip.`);
       return;
    }
    if (!model) {
        Alert.alert("Error", "AI Service Unavailable");
        return;
    }

    if (sfxEnabled) safeHaptics.selectionAsync();
    setIsTyping(true);
    updateTokens(-ZEN_TIP_COST, "zen_tip");
    try {
        const prompt = `Give me a short, uplifting affirmation or a quick 1-sentence stress-relief tip. Be creative and warm.

CRITICAL: Respond with ONLY plain conversational text. NO JSON, NO code blocks, NO structured data. Just write a friendly tip or affirmation.`;
        if (__DEV__) console.log("[Zen] Requesting tip");
        let result;
        try {
          result = await model.generateContent(prompt, {
            generationConfig: {
              temperature: 0.8,
              topP: 0.9,
              topK: 40,
              maxOutputTokens: 100,
              responseMimeType: 'text/plain' // Force plain text, not JSON
            }
          });
        } catch (configError) {
          // Fallback if responseMimeType is not supported
          if (__DEV__) console.warn("[Zen] Tip fallback:", configError?.message);
          result = await model.generateContent(prompt);
        }
        
        if (!result || !result.response) {
          throw new Error("Invalid response from Gemini API for Zen tip");
        }

        let text = '';
        try {
          text = result.response.text() ?? '';
        } catch (_) {
          text = '';
        }
        if (typeof text !== 'string') text = String(text ?? '');
        text = text.replace(/```json|```/g, '').trim();

        const isMockOrJson = (text.startsWith('{') && text.endsWith('}')) || text.includes('"status"') || text.includes('optimization_suggestions');
        if (isMockOrJson || !text) {
          if (isMockOrJson && __DEV__) console.warn("[Zen] Tip returned JSON, using fallback");
          text = "Take a deep breath. You're doing great, and you have the strength to handle whatever comes your way.";
        }

        await addDoc(collection(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/chats`), {
            text: "✨ " + text,
            sender: 'ai',
            createdAt: serverTimestamp()
        });
    } catch (e) {
        if (__DEV__) console.error("[Zen] Tip error:", e?.message);
        Alert.alert("Error", "Zen is sleeping.");
        updateTokens(ZEN_TIP_COST, "zen_tip_refund");
    } finally {
        setIsTyping(false);
    }
  };

  const clearHistory = async () => {
    if (sfxEnabled) safeHaptics.impactAsync(ImpactFeedbackStyle.Medium);
    const q = query(collection(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/chats`));
    const snap = await getDocs(q);
    const batch = writeBatch(db);
    snap.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
  };

  return (
        <View 
          style={{
            flex: 1,
            backgroundColor: colors.screenBg,
            paddingTop: insets.top,
            margin: 0,
            paddingHorizontal: 0,
            paddingBottom: 0,
          }}
        >
            {/* Header */}
            <View style={{ 
              paddingHorizontal: 16, 
              paddingVertical: 8, 
              borderBottomWidth: 0.5, 
              borderColor: colors.accent + '15',
              backgroundColor: colors.screenBg,
              minHeight: 50,
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <TouchableOpacity onPress={onBack} style={{ padding: 6 }}>
                    <Svg width={22} height={22} viewBox="0 0 24 24"><Path d={ICONS.back} fill={colors.text} /></Svg>
                  </TouchableOpacity>
                  <View>
                    <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text }}>Zen Companion</Text>
                    <Text style={{ color: colors.subtext, fontSize: 10, marginTop: 1 }}>💬 {ZEN_CHAT_COST} tokens per message</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={onClose} style={{ padding: 6 }}>
                  <Svg width={22} height={22} viewBox="0 0 24 24"><Path d={ICONS.close} fill={colors.text} /></Svg>
                </TouchableOpacity>
              </View>
            </View>

            {/* Messages FlatList */}
            <FlatList
              data={msgs}
              inverted
              keyExtractor={item => item.id ?? `msg-${item.createdAt ?? 0}`}
              initialNumToRender={15}
              maxToRenderPerBatch={10}
              windowSize={11}
              contentContainerStyle={{ 
                paddingHorizontal: 12, 
                paddingVertical: 8,
                flexGrow: 1
              }}
              style={{ flex: 1 }}
              scrollIndicatorInsets={{ bottom: Platform.OS === 'web' ? 80 : 60 }}
              showsVerticalScrollIndicator={true}
              renderItem={({ item }) => (
                <View style={{
                  alignSelf: item.isAi ? 'flex-start' : 'flex-end',
                  backgroundColor: item.isAi ? colors.tileBg : colors.accent,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 14,
                  marginVertical: 4,
                  maxWidth: '88%',
                  ...(Platform.OS === 'web' ? {
                    boxShadow: item.isAi ? '0 1px 2px 0 rgba(0,0,0,0.05)' : '0 1px 3px 0 rgba(0,0,0,0.1)',
                  } : {
                    shadowColor: colors.text,
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: item.isAi ? 0.05 : 0.1,
                    shadowRadius: 3,
                    elevation: 1
                  })
                }}>
                  <Text style={{ color: item.isAi ? colors.text : '#fff', fontSize: 14, lineHeight: 20 }}>
                    {item.text}
                  </Text>
                </View>
              )}
            />

            {/* Typing Indicator */}
            {isTyping && (
              <View style={{ 
                paddingHorizontal: 12, 
                paddingBottom: 4, 
                flexDirection: 'row', 
                gap: 4, 
                alignItems: 'center',
                backgroundColor: colors.screenBg
              }}>
                <Text style={{ color: colors.subtext, fontSize: 11 }}>Zen is thinking</Text>
                <ActivityIndicator color={colors.accent} size="small" />
              </View>
            )}

            {/* Input Area */}
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
              style={{ backgroundColor: colors.screenBg }}
            >
              <View style={{ 
                paddingHorizontal: 12, 
                paddingTop: 8,
                paddingBottom: Math.max(insets.bottom, 8),
                backgroundColor: colors.screenBg, 
                borderTopWidth: 0.5, 
                borderColor: colors.accent + '15'
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <TouchableOpacity 
                    onPress={clearHistory} 
                    style={{ 
                      paddingHorizontal: 10, 
                      paddingVertical: 5, 
                      backgroundColor: colors.tileBg, 
                      borderRadius: 10, 
                      borderWidth: 1, 
                      borderColor: colors.accent + '20' 
                    }}>
                    <Text style={{ color: colors.subtext, fontSize: 10, fontWeight: '600' }}>🗑️ Clear</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={getZenTip} 
                    style={{ 
                      paddingHorizontal: 10, 
                      paddingVertical: 5, 
                      backgroundColor: colors.accent + '15', 
                      borderRadius: 10, 
                      borderWidth: 1, 
                      borderColor: colors.accent + '30' 
                    }}>
                    <Text style={{ color: colors.accent, fontSize: 10, fontWeight: '600' }}>✨ Zen Tip</Text>
                  </TouchableOpacity>
                  <View style={{ flex: 1 }} />
                  <View style={{ backgroundColor: colors.accent + '15', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
                    <Text style={{ color: colors.accent, fontSize: 10, fontWeight: '700' }}>💎 {profile?.zenTokens || 0}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
                  <TextInput
                    value={txt}
                    onChangeText={setTxt}
                    placeholder="Type your thoughts..."
                    placeholderTextColor={colors.subtext}
                    editable={!isTyping}
                    style={{
                      flex: 1,
                      paddingHorizontal: 12,
                      paddingVertical: 9,
                      backgroundColor: colors.tileBg,
                      borderRadius: 20,
                      color: colors.text,
                      fontSize: 14,
                      maxHeight: 80,
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
                      ...(Platform.OS === 'web' ? {
                        pointerEvents: isTyping || !txt.trim() ? 'none' : 'auto',
                        boxShadow: isTyping || !txt.trim() ? 'none' : `0 2px 6px 0 ${colors.accent}4D`,
                      } : {
                        shadowColor: colors.accent,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: isTyping || !txt.trim() ? 0 : 0.3,
                        shadowRadius: 6,
                        elevation: isTyping || !txt.trim() ? 0 : 4
                      })
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
  );
};

export const AIChatScreen = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: Platform.OS !== 'web' }).start();
  }, [fadeAnim]);

  return (
    <View style={{ flex: 1 }}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ChatInterface {...props} />
      </Animated.View>
    </View>
  );
};

