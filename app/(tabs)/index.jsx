/**********************************************************************
 * app/(tabs)/index.jsx – COMPLETE, COHESIVE, NO-ERROR BUILD
 * Gemini 2.0 Flash / AI mood / unified padding / fixed onSnapshot
 *********************************************************************/
import React, { useEffect, useState, useRef } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform,
  ScrollView, Text, TextInput,
  TouchableOpacity, useColorScheme, View, Switch, ActivityIndicator,
  FlatList, Modal
} from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Svg, Path, Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleGenerativeAI } from "@google/generative-ai";

// -----------  FIREBASE  -----------
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeAuth, getReactNativePersistence, getAuth,
  createUserWithEmailAndPassword, onAuthStateChanged,
  signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updateProfile
} from 'firebase/auth';
import {
  doc, getFirestore, onSnapshot, serverTimestamp, setDoc,
  updateDoc, increment, collection, addDoc, query, orderBy, getDocs, limit, writeBatch
} from 'firebase/firestore';

// -----------  CONFIG  -----------
const GEMINI_API_KEY = "AIzaSyDE2JR87MVKA3nNaKcc2bOHN9o9X5Ew1vk";
const firebaseConfig = {
  apiKey: "AIzaSyCfbYEs7JWx08ZwQj6oCa2Ju-M3gRGkLhA",
  authDomain: "stressbuster-app.firebaseapp.com",
  projectId: "stressbuster-app",
  storageBucket: "stressbuster-app.firebasestorage.app",
  messagingSenderId: "1029721176047",
  appId: "1:1029721176047:web:6eb6ec3ecf042bbe78281a",
  measurementId: "G-LPQPFKKLM5"
};
let auth, db;
try {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  try { auth = initializeAuth(app, { persistence: getReactNativePersistence(ReactNativeAsyncStorage) }); }
  catch { auth = getAuth(app); }
  db = getFirestore(app);
} catch (e) { console.warn("Init Error:", e); }

// -----------  THEME  -----------
const THEME_COLORS = {
  light: {
    text: '#000', subtext: '#8E8E93', screenBg: '#F2F2F7', tileBg: '#FFFFFF',
    accent: '#007AFF', blurTint: 'light', tabBar: '#FFFFFF', tabActive: '#007AFF', tabInactive: '#C7C7CC',
    icon: { orange: '#FF9500', yellow: '#FFCC00', red: '#FF3B30', green: '#34C759', purple: '#AF52DE', cyan: '#30b0c7', blue: '#007AFF', pink: '#FF2D55' }
  },
  dark: {
    text: '#FFF', subtext: '#8E8E93', screenBg: '#000', tileBg: '#1C1C1E',
    accent: '#0A84FF', blurTint: 'dark', tabBar: '#1C1C1E', tabActive: '#0A84FF', tabInactive: '#636366',
    icon: { orange: '#FF9F0A', yellow: '#FFD60A', red: '#FF453A', green: '#30D158', purple: '#BF5AF2', cyan: '#64D2FF', blue: '#0A84FF', pink: '#FF375F' }
  }
};
const ICONS = {
  home: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
  games: 'M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z',
  profile: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
  back: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
  chat: 'M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z',
  quote: 'M6 17h3l2-4V7H5v6h3zm8 5H6v-2h8v2zm4-6H6V6h12v2z',
  timer: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2V7zm0 8h2v2h-2v-2z',
  mood: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.59 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z',
  journal: 'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z',
  music: 'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z'
};

// -----------  CONTEXTS  -----------
const AuthContext = React.createContext();
const ThemeContext = React.createContext();
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dailyReward, setDailyReward] = useState(null);
  const streakChecked = useRef(false);

  useEffect(() => onAuthStateChanged(auth, u => {
    setUser(u);
    if (!u) { setProfile(null); setLoading(false); streakChecked.current = false; }
  }), []);

  useEffect(() => {
    if (!user) return;
    const ref = doc(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/data/profile`);
    return onSnapshot(ref, snap => {
      if (snap.exists()) {
        const data = snap.data();
        setProfile(data);
        if (!streakChecked.current) checkStreak(data);
      } else setProfile(null);
      setLoading(false);
    }, () => setLoading(false));
  }, [user]);

  const checkStreak = (data) => {
    const now = new Date();
    const last = (data.lastLogin?.toDate?.() || new Date("2000-01-01"));
    const diff = Math.round((new Date(now.getFullYear(), now.getMonth(), now.getDate()) - new Date(last.getFullYear(), last.getMonth(), last.getDate())) / 86400000);
    streakChecked.current = true;
    if (diff === 0) return;
    let newStreak = 1, reward = 5;
    if (diff === 1) { newStreak = (data.streak || 0) + 1; reward = newStreak * 5; }
    setDailyReward({ streak: newStreak, reward });
  };

  const claimReward = async () => {
    if (!user || !dailyReward) return;
    const { streak, reward } = dailyReward;
    setDailyReward(null);
    setProfile(p => ({ ...p, streak: streak, zenTokens: (p?.zenTokens || 0) + reward }));
    await updateDoc(doc(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/data/profile`), { streak, lastLogin: serverTimestamp(), zenTokens: increment(reward) });
    await addDoc(collection(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/wallet`), { amount: reward, reason: "daily_streak", createdAt: serverTimestamp() });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const updateTokens = async (amt, reason = "game_reward") => {
    if (!user) return;
    setProfile(p => ({ ...p, zenTokens: (p?.zenTokens || 0) + amt }));
    await updateDoc(doc(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/data/profile`), { zenTokens: increment(amt) });
    await addDoc(collection(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/wallet`), { amount: amt, reason, createdAt: serverTimestamp() });
  };

  const logout = async () => { streakChecked.current = false; await signOut(auth); };
  const updateName = async (newName) => {
    if (!user || !newName.trim()) return;
    setProfile(p => ({ ...p, name: newName }));
    await updateDoc(doc(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/data/profile`), { name: newName });
  };
  const resetStats = async () => {
    if (!user) return;
    setProfile(p => ({ ...p, streak: 0, zenTokens: 0 }));
    await updateDoc(doc(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/data/profile`), { streak: 0, zenTokens: 0 });
    Alert.alert("Reset", "Your stats have been reset.");
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, updateTokens, setProfileLocally: setProfile, dailyReward, claimReward, logout, updateName, resetStats }}>
      {children}
    </AuthContext.Provider>
  );
};

// -----------  UI COMPONENTS  -----------
const GlassCard = ({ children, style, color }) => {
  const { colors } = React.useContext(ThemeContext);
  return <View style={[{ backgroundColor: color || colors.tileBg, borderRadius: 24, padding: 16 }, style]}>{children}</View>;
};
const BackButton = ({ onPress }) => {
  const { colors } = React.useContext(ThemeContext);
  const insets = useSafeAreaInsets();
  return (
    <TouchableOpacity onPress={onPress} style={{ position: 'absolute', top: insets.top + 10, left: 20, zIndex: 999, width: 44, height: 44, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.tileBg, borderRadius: 22 }}>
      <Svg width={24} height={24} viewBox="0 0 24 24"><Path d={ICONS.back} fill={colors.text} /></Svg>
    </TouchableOpacity>
  );
};
const DailyRewardModal = () => {
  const { dailyReward, claimReward } = React.useContext(AuthContext);
  const { colors } = React.useContext(ThemeContext);
  if (!dailyReward) return null;
  return (
    <Modal transparent animationType="fade" visible>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: '80%', backgroundColor: colors.tileBg, borderRadius: 25, padding: 30, alignItems: 'center' }}>
          <Text style={{ fontSize: 60 }}>🎉</Text>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text, marginTop: 10 }}>Daily Streak!</Text>
          <Text style={{ fontSize: 16, color: colors.subtext, marginVertical: 10, textAlign: 'center' }}>You're on a <Text style={{ color: colors.icon.orange, fontWeight: 'bold' }}>{dailyReward.streak} day</Text> streak!</Text>
          <View style={{ backgroundColor: colors.icon.yellow + '20', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, marginBottom: 20 }}><Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.icon.orange }}>+ {dailyReward.reward} Tokens</Text></View>
          <TouchableOpacity onPress={claimReward} style={{ backgroundColor: colors.accent, paddingVertical: 12, paddingHorizontal: 40, borderRadius: 20 }}><Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Claim</Text></TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// -----------  AUTH SCREEN  -----------
const AuthScreen = () => {
  const { colors } = React.useContext(ThemeContext);
  const [isLogin, setIsLogin] = useState(true), [isReset, setIsReset] = useState(false), [email, setEmail] = useState(''), [pass, setPass] = useState(''), [name, setName] = useState(''), [bDay, setBDay] = useState(''), [bMonth, setBMonth] = useState(''), [bYear, setBYear] = useState(''), [loading, setL] = useState(false);
  const isValidDate = (d, m, y) => {
    const day = parseInt(d, 10), month = parseInt(m, 10), year = parseInt(y, 10);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
    if (year < 1900 || year > new Date().getFullYear()) return false;
    if (month < 1 || month > 12) return false;
    const daysInMonth = new Date(year, month, 0).getDate();
    return day >= 1 && day <= daysInMonth;
  };
  const isValidEmail = e => /\S+@\S+\.\S+/.test(e);
  const handleAuth = async () => {
    setL(true);
    try {
      if (!isValidEmail(email)) throw new Error("Invalid Email Format");
      if (isReset) {
        await sendPasswordResetEmail(auth, email);
        Alert.alert("Email Sent", "Check your inbox to reset password.");
        setIsReset(false); setIsLogin(true);
      } else if (isLogin) await signInWithEmailAndPassword(auth, email, pass);
      else {
        if (pass.length < 6) throw new Error("Password must be 6+ chars.");
        if (name.length < 2) throw new Error("Name too short.");
        if (!isValidDate(bDay, bMonth, bYear)) throw new Error("Invalid Date (DD MM YYYY).");
        const birthdayStr = `${bYear}-${bMonth.padStart(2, '0')}-${bDay.padStart(2, '0')}`;
        const { user: u } = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(u, { displayName: name });
        await setDoc(doc(db, `artifacts/${firebaseConfig.appId}/users/${u.uid}/data/profile`), { name, email, birthday: birthdayStr, zenTokens: 250, streak: 0, lastLogin: new Date("2000-01-01"), settings: { sfx: true } });
      }
    } catch (e) {
      let msg = e.message;
      if (e.code === 'auth/invalid-credential' || e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password') msg = "Invalid email or password.";
      else if (e.code === 'auth/email-already-in-use') msg = "Email already registered.";
      Alert.alert("Error", msg);
    }
    setL(false);
  };
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, justifyContent: 'center', padding: 30, backgroundColor: colors.screenBg }}>
      <Text style={{ fontSize: 32, fontWeight: 'bold', color: colors.text, textAlign: 'center', marginBottom: 10 }}>Stress Buster</Text>
      <Text style={{ textAlign: 'center', color: colors.subtext, marginBottom: 20 }}>{isReset ? "Reset Password" : (isLogin ? "Welcome Back" : "Create Account")}</Text>
      {!isLogin && !isReset && (
        <>
          <GlassCard><TextInput placeholder="Nickname" placeholderTextColor={colors.subtext} value={name} onChangeText={setName} style={{ fontSize: 16, color: colors.text }} /></GlassCard>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <View style={{ width: '28%' }}><GlassCard style={{ padding: 12 }}><TextInput placeholder="DD" keyboardType="numeric" maxLength={2} placeholderTextColor={colors.subtext} value={bDay} onChangeText={setBDay} style={{ fontSize: 16, color: colors.text, textAlign: 'center' }} /></GlassCard></View>
            <View style={{ width: '28%' }}><GlassCard style={{ padding: 12 }}><TextInput placeholder="MM" keyboardType="numeric" maxLength={2} placeholderTextColor={colors.subtext} value={bMonth} onChangeText={setBMonth} style={{ fontSize: 16, color: colors.text, textAlign: 'center' }} /></GlassCard></View>
            <View style={{ width: '38%' }}><GlassCard style={{ padding: 12 }}><TextInput placeholder="YYYY" keyboardType="numeric" maxLength={4} placeholderTextColor={colors.subtext} value={bYear} onChangeText={setBYear} style={{ fontSize: 16, color: colors.text, textAlign: 'center' }} /></GlassCard></View>
          </View>
        </>
      )}
      <GlassCard><TextInput placeholder="Email" placeholderTextColor={colors.subtext} value={email} onChangeText={setEmail} style={{ fontSize: 16, color: colors.text }} autoCapitalize='none' /></GlassCard>
      {!isReset && <GlassCard style={{ marginTop: 12 }}><TextInput placeholder="Password" placeholderTextColor={colors.subtext} value={pass} onChangeText={setPass} secureTextEntry style={{ fontSize: 16, color: colors.text }} /></GlassCard>}
      <TouchableOpacity onPress={handleAuth} style={{ backgroundColor: colors.accent, padding: 16, borderRadius: 20, alignItems: 'center', marginTop: 16 }}>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>{loading ? "…" : (isReset ? "Send Link" : (isLogin ? "Log In" : "Sign Up"))}</Text>
      </TouchableOpacity>
      <View style={{ marginTop: 20, alignItems: 'center', gap: 15 }}>
        {isLogin && !isReset && <TouchableOpacity onPress={() => setIsReset(true)}><Text style={{ color: colors.accent }}>Forgot Password?</Text></TouchableOpacity>}
        <TouchableOpacity onPress={() => { setIsReset(false); setIsLogin(!isLogin); }}><Text style={{ color: colors.subtext }}>{isReset ? "Back to Login" : (isLogin ? "Create Account" : "Back to Login")}</Text></TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// -----------  SOUND  -----------
const SoundScreen = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const [sound, setSound] = useState(), [playing, setPlaying] = useState(null);
  const soundFiles = { Rain: require('../../assets/sounds/rain.mp3'), Forest: require('../../assets/sounds/forest.mp3'), Waves: require('../../assets/sounds/waves.mp3') };
  async function playSound(name) {
    if (playing === name) { if (sound) await sound.unloadAsync(); setPlaying(null); setSound(null); return; }
    if (sound) await sound.unloadAsync();
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(soundFiles[name], { isLooping: true });
      setSound(newSound); setPlaying(name); await newSound.playAsync();
    } catch (e) { Alert.alert("Audio Missing", "Please run 'npx expo start -c' to reload assets."); }
  }
  useEffect(() => () => { if (sound) sound.unloadAsync(); }, [sound]);
  const insets = useSafeAreaInsets();
  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 20, paddingHorizontal: 20, paddingBottom: 40, alignItems: 'center' }}>
      <BackButton onPress={onBack} />
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 20 }}>Soundscapes</Text>
      {Object.keys(soundFiles).map(name => (
        <TouchableOpacity key={name} onPress={() => playSound(name)} style={{ width: '100%', marginBottom: 16 }}>
          <GlassCard style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: playing === name ? colors.accent + '20' : colors.tileBg }}>
            <Text style={{ fontSize: 30 }}>{name === 'Rain' ? '🌧️' : name === 'Forest' ? '🌲' : '🌊'}</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>{name}</Text>
            <Text style={{ color: playing === name ? colors.accent : colors.subtext }}>{playing === name ? "Stop" : "Play"}</Text>
          </GlassCard>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

// -----------  AI CHAT + MOOD  -----------
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
const AIChatScreen = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { profile, updateTokens, user, setProfileLocally } = React.useContext(AuthContext);
  const [msgs, setMsgs] = useState([]), [txt, setTxt] = useState(""), [isTyping, setIsTyping] = useState(false);
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/chats`), orderBy('createdAt', 'desc'), limit(30));
    const unsub = onSnapshot(q, s => {
      const h = s.docs.map(d => ({ id: d.id, ...d.data(), isAi: d.data().sender === 'ai' }));
      setMsgs(h.length ? h : [{ id: 'init', text: "Hi! I'm Zen. How are you feeling?", isAi: true }]);
    });
    return unsub;
  }, [user]);
  const send = async () => {
    if (!txt.trim() || (profile?.zenTokens || 0) < 5) { Alert.alert("Tokens", "Need 5 tokens."); return; }
    const textToSend = txt; setTxt(""); setIsTyping(true);
    try {
      await addDoc(collection(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/chats`), { text: textToSend, sender: 'user', createdAt: serverTimestamp() });
      updateTokens(-5, "ai_chat_cost");
      const mood = await detectMoodFromText(textToSend);
      await updateDoc(doc(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/data/profile`), { lastMood: mood.emoji, lastMoodLabel: mood.label, lastMoodConfidence: mood.confidence });
      setProfileLocally(p => ({ ...p, lastMood: mood.emoji, lastMoodLabel: mood.label, lastMoodConfidence: mood.confidence }));
      const prompt = `You are Zen, a mental-health AI. Short calm answer. User: ${textToSend}`;
      const result = await model.generateContent(prompt);
      const aiText = result.response.text();
      await addDoc(collection(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/chats`), { text: aiText, sender: 'ai', createdAt: serverTimestamp() });
    } catch (e) { Alert.alert("Zen Error", "Failed to connect."); } finally { setIsTyping(false); }
  };
  const clearHistory = async () => {
    const q = query(collection(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/chats`));
    const snap = await getDocs(q);
    const batch = writeBatch(db);
    snap.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
    setMsgs([{ id: 'init', text: "Hi! I'm Zen.", isAi: true }]);
  };
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingTop: insets.top + 20 }}>
      <BackButton onPress={onBack} />
      <TouchableOpacity onPress={clearHistory} style={{ position: 'absolute', top: insets.top + 20, right: 20 }}><Text style={{ color: colors.subtext, fontSize: 12 }}>Clear History</Text></TouchableOpacity>
      <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18, color: colors.text }}>Zen Companion</Text>
      <Text style={{ textAlign: 'center', color: colors.accent, fontSize: 12, marginBottom: 10 }}>5 Tokens/Msg</Text>
      <FlatList data={msgs} inverted keyExtractor={item => item.id} renderItem={({ item }) => (
        <View style={{ alignSelf: item.isAi ? 'flex-start' : 'flex-end', backgroundColor: item.isAi ? colors.chatAi : colors.chatUser, padding: 12, borderRadius: 16, marginHorizontal: 20, marginVertical: 4, maxWidth: '80%' }}>
          <Text style={{ color: item.isAi ? colors.chatTextAi : colors.chatTextUser, fontSize: 16 }}>{item.text}</Text>
        </View>
      )} />
      {isTyping && <Text style={{ marginLeft: 20, marginBottom: 10, color: colors.subtext }}>Zen is thinking…</Text>}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={10}>
        <View style={{ flexDirection: 'row', padding: 10, backgroundColor: colors.tileBg }}>
          <TextInput value={txt} onChangeText={setTxt} placeholder="Message…" placeholderTextColor={colors.subtext} style={{ flex: 1, padding: 12, backgroundColor: colors.screenBg, borderRadius: 20, color: colors.text }} />
          <TouchableOpacity onPress={send} style={{ marginLeft: 10, justifyContent: 'center', paddingHorizontal: 15 }}><Text style={{ color: colors.accent, fontWeight: 'bold' }}>Send</Text></TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

// -----------  GAMES  -----------
const GamesTab = ({ navigateTo }) => {
  const { colors } = React.useContext(ThemeContext);
  const insets = useSafeAreaInsets();
  const GameCard = ({ title, sub, color, onPress, children }) => (
    <TouchableOpacity onPress={onPress} style={{ width: '48%', marginBottom: 15 }}>
      <GlassCard style={{ height: 160, justifyContent: 'center', alignItems: 'center', backgroundColor: color + '15' }}>
        {children}
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text, marginTop: 10 }}>{title}</Text>
        <Text style={{ fontSize: 11, color: colors.subtext, marginTop: 5 }}>{sub}</Text>
      </GlassCard>
    </TouchableOpacity>
  );
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 120, paddingTop: insets.top + 20, paddingHorizontal: 20 }}>
      <Text style={{ fontSize: 30, fontWeight: 'bold', color: colors.text, marginBottom: 20 }}>Game Center</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <GameCard title="Zen Match" sub="Flip Pairs" color={colors.icon.purple} onPress={() => navigateTo('game-memory')}><Svg width={40} height={40} viewBox="0 0 24 24"><Path d={ICONS.games} fill={colors.icon.purple} /></Svg></GameCard>
        <GameCard title="Pop Bubbles" sub="Stress Relief" color={colors.icon.green} onPress={() => navigateTo('game-bubbles')}><Circle cx="20" cy="20" r="18" fill={colors.icon.green} /></GameCard>
        <GameCard title="Switches" sub="Haptic Click" color={colors.icon.orange} onPress={() => navigateTo('game-switches')}><Switch value={true} trackColor={{ true: colors.icon.orange }} thumbColor="#fff" /></GameCard>
        <GameCard title="Color Calm" sub="Tap Colors" color={colors.icon.cyan} onPress={() => navigateTo('game-color')}><View style={{ width: 30, height: 30, backgroundColor: colors.icon.cyan, borderRadius: 8 }} /></GameCard>
        <GameCard title="Zen Grid" sub="Light them up" color={colors.icon.blue} onPress={() => navigateTo('game-grid')}><View style={{ flexDirection: 'row', flexWrap: 'wrap', width: 30, justifyContent: 'center' }}>{[1, 2, 3, 4].map(i => <View key={i} style={{ width: 10, height: 10, backgroundColor: colors.icon.blue, margin: 1, borderRadius: 2 }} />)}</View></GameCard>
        <GameCard title="Daily Fortune" sub="Crack a Cookie" color={colors.icon.pink} onPress={() => navigateTo('game-fortune')}><Text style={{ fontSize: 30 }}>🥠</Text></GameCard>
      </View>
    </ScrollView>
  );
};

// -----------  NEW GAME SCREENS  -----------
const GridGame = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { updateTokens } = React.useContext(AuthContext);
  const [grid, setGrid] = useState(Array(9).fill(false));
  const toggle = i => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newG = [...grid]; newG[i] = !newG[i]; setGrid(newG);
    if (newG.every(Boolean)) { updateTokens(10, "grid_win"); Alert.alert("Bright!", "You lit up the whole grid!"); setGrid(Array(9).fill(false)); }
  };
  const insets = useSafeAreaInsets();
  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 40, alignItems: 'center' }}>
      <BackButton onPress={onBack} />
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 10 }}>Zen Grid</Text>
      <Text style={{ color: colors.subtext, marginBottom: 30 }}>Light up all squares</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: 300, justifyContent: 'center' }}>
        {grid.map((on, i) => <TouchableOpacity key={i} onPress={() => toggle(i)} style={{ width: 80, height: 80, margin: 5, backgroundColor: on ? colors.icon.blue : colors.tileBg, borderRadius: 12 }} />)}
      </View>
    </ScrollView>
  );
};
const FortuneGame = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { updateTokens } = React.useContext(AuthContext);
  const [msg, setMsg] = useState("Tap the cookie!");
  const fortunes = ["You are enough.", "Peace is within you.", "Breathe deeply.", "Today is a gift.", "You are loved."];
  const crack = () => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); const f = fortunes[Math.floor(Math.random() * fortunes.length)]; setMsg(f); updateTokens(5, "fortune"); };
  const insets = useSafeAreaInsets();
  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 40, alignItems: 'center' }}>
      <BackButton onPress={onBack} />
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 30 }}>Fortune Cookie</Text>
      <TouchableOpacity onPress={crack}><Text style={{ fontSize: 100 }}>🥠</Text></TouchableOpacity>
      <GlassCard style={{ marginTop: 30, padding: 20 }}><Text style={{ fontSize: 18, color: colors.text, textAlign: 'center' }}>"{msg}"</Text></GlassCard>
    </ScrollView>
  );
};
const SwitchGame = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { updateTokens } = React.useContext(AuthContext);
  const [switches, setSwitches] = useState([false, false, false, false, false]), [count, setCount] = useState(0);
  const toggle = i => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const n = [...switches]; n[i] = !n[i]; setSwitches(n);
    const c = count + 1; setCount(c);
    if (c % 20 === 0) { updateTokens(5, "switch"); Alert.alert("+5 Tokens", "Satisfying!"); }
  };
  const insets = useSafeAreaInsets();
  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 40, alignItems: 'center' }}>
      <BackButton onPress={onBack} />
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 30 }}>Switches</Text>
      <View style={{ gap: 16 }}>{switches.map((v, i) => <View key={i} style={{ flexDirection: 'row', width: 200, justifyContent: 'space-between', backgroundColor: colors.tileBg, padding: 15, borderRadius: 16 }}><Text style={{ color: colors.text }}>Switch {i + 1}</Text><Switch value={v} onValueChange={() => toggle(i)} trackColor={{ true: colors.accent }} /></View>)}</View>
    </ScrollView>
  );
};
const ColorGame = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { updateTokens } = React.useContext(AuthContext);
  const [color, setColor] = useState(colors.accent), [taps, setTaps] = useState(0);
  const tap = () => { setColor('#' + Math.floor(Math.random() * 16777215).toString(16)); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); const t = taps + 1; setTaps(t); if (t % 20 === 0) { updateTokens(5, "color"); Alert.alert("+5 Tokens", "Colorful!"); } };
  const insets = useSafeAreaInsets();
  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 40, alignItems: 'center' }}>
      <BackButton onPress={onBack} />
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 30 }}>Color Calm</Text>
      <TouchableOpacity onPress={tap} style={{ width: 200, height: 200, borderRadius: 20, backgroundColor: color, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: '#fff', fontSize: 40, fontWeight: 'bold' }}>{taps}</Text></TouchableOpacity>
    </ScrollView>
  );
};

// -----------  HOME  -----------
const HomeTab = ({ navigateTo }) => {
  const { colors } = React.useContext(ThemeContext);
  const { profile } = React.useContext(AuthContext);
  const insets = useSafeAreaInsets();
  const shortcuts = [
    { title: 'AI Chat', icon: ICONS.chat, color: '#30b0c7', route: 'ai-chat' },
    { title: 'Soundscapes', icon: ICONS.music, color: '#FF3B30', route: 'sounds' },
    { title: 'Daily Quote', icon: ICONS.quote, color: '#ff2d55', route: 'quote' },
    { title: 'Focus Timer', icon: ICONS.timer, color: '#5856d6', route: 'timer' },
    { title: 'Zen Insights', icon: ICONS.mood, color: '#34c759', route: 'insights' },
    { title: 'Journal', icon: ICONS.journal, color: '#007aff', route: 'journal' },
  ];
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 120, paddingTop: insets.top + 20, paddingHorizontal: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <View><Text style={{ fontSize: 16, color: colors.subtext }}>Welcome back,</Text><Text style={{ fontSize: 28, fontWeight: '800', color: colors.text }}>{profile?.name || 'Friend'}</Text></View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={{ backgroundColor: colors.icon.orange + '20', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 }}><Text style={{ color: colors.icon.orange, fontWeight: 'bold', fontSize: 14 }}>🔥 {profile?.streak || 0}</Text></View>
          <View style={{ backgroundColor: colors.icon.yellow + '20', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 }}><Text style={{ color: colors.icon.orange, fontWeight: 'bold', fontSize: 14 }}>💎 {profile?.zenTokens || 0}</Text></View>
          <View style={{ backgroundColor: colors.icon.purple + '20', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 }}><Text style={{ fontSize: 14 }}>{profile?.lastMood || '😶'}</Text></View>
        </View>
      </View>
      <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 15 }}>Shortcuts</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {shortcuts.map((s, i) => (
          <TouchableOpacity key={i} onPress={() => navigateTo(s.route)} style={{ width: '48%', aspectRatio: 1.1, marginBottom: 15 }}>
            <BlurView intensity={80} tint={colors.blurTint} style={{ flex: 1, borderRadius: 24, padding: 16, justifyContent: 'space-between', backgroundColor: colors.tileBg }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: s.color + '30', alignItems: 'center', justifyContent: 'center' }}><Svg width={24} height={24} viewBox="0 0 24 24"><Path d={s.icon} fill={s.color} /></Svg></View>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>{s.title}</Text>
            </BlurView>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

// -----------  PROFILE  -----------
const ProfileTab = () => {
  const { colors } = React.useContext(ThemeContext);
  const { profile, logout, updateName, resetStats } = React.useContext(AuthContext);
  const insets = useSafeAreaInsets();
  const [isEditing, setIsEditing] = useState(false), [newName, setNewName] = useState(profile?.name || "");
  const saveName = () => { updateName(newName); setIsEditing(false); };
  const getLevel = (tokens = 0) => {
    if (tokens < 100) return "Novice"; if (tokens < 500) return "Seeker"; if (tokens < 1000) return "Meditator"; return "Zen Master";
  };
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 120, paddingTop: insets.top + 20, paddingHorizontal: 20 }}>
      <Text style={{ fontSize: 30, fontWeight: 'bold', color: colors.text, marginBottom: 20 }}>Profile</Text>
      <View style={{ alignItems: 'center', marginBottom: 30 }}>
        <View style={{ width: 90, height: 90, borderRadius: 45, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}><Text style={{ fontSize: 40, color: '#fff', fontWeight: 'bold' }}>{profile?.name?.[0] || '?'}</Text></View>
        {isEditing ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput value={newName} onChangeText={setNewName} style={{ borderBottomWidth: 1, borderColor: colors.text, color: colors.text, fontSize: 24, fontWeight: 'bold', width: 150, textAlign: 'center' }} />
            <TouchableOpacity onPress={saveName}><Text style={{ marginLeft: 10, color: colors.accent }}>Save</Text></TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => setIsEditing(true)} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text }}>{profile?.name} ✏️</Text>
          </TouchableOpacity>
        )}
        <Text style={{ color: colors.subtext }}>{profile?.email}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
        <View style={{ width: '31%', backgroundColor: colors.tileBg, borderRadius: 15, padding: 10, alignItems: 'center' }}><Text style={{ fontSize: 24 }}>🔥</Text><Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>{profile?.streak || 0}</Text><Text style={{ fontSize: 12, color: colors.subtext }}>Streak</Text></View>
        <View style={{ width: '31%', backgroundColor: colors.tileBg, borderRadius: 15, padding: 10, alignItems: 'center' }}><Text style={{ fontSize: 24 }}>💎</Text><Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>{profile?.zenTokens || 0}</Text><Text style={{ fontSize: 12, color: colors.subtext }}>Tokens</Text></View>
        <View style={{ width: '31%', backgroundColor: colors.tileBg, borderRadius: 15, padding: 10, alignItems: 'center' }}>
          <Text style={{ fontSize: 24 }}>{profile?.lastMood || '😶'}</Text>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.text, marginTop: 2 }}>{profile?.lastMoodLabel || 'None'}</Text>
          <Text style={{ fontSize: 12, color: colors.subtext }}>Current</Text>
        </View>
      </View>
      <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 10 }}>Details</Text>
      <GlassCard>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}><Text style={{ color: colors.subtext }}>Level</Text><Text style={{ color: colors.accent, fontWeight: 'bold' }}>{getLevel(profile?.zenTokens)}</Text></View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}><Text style={{ color: colors.subtext }}>Birthday</Text><Text style={{ color: colors.text }}>{profile?.birthday || "Not set"}</Text></View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ color: colors.subtext }}>Email</Text><Text style={{ color: colors.text }}>{profile?.email || "Unknown"}</Text></View>
      </GlassCard>
      <TouchableOpacity onPress={resetStats} style={{ alignItems: 'center', marginTop: 10 }}><Text style={{ color: colors.subtext, textDecorationLine: 'underline' }}>Reset Stats</Text></TouchableOpacity>
      <TouchableOpacity onPress={logout} style={{ alignItems: 'center', marginTop: 20 }}><Text style={{ color: colors.icon.red, fontWeight: '600', fontSize: 16 }}>Log Out</Text></TouchableOpacity>
    </ScrollView>
  );
};

// -----------  MISC SCREENS  -----------
const TimerScreen = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const insets = useSafeAreaInsets();
  const [s, setS] = useState(25 * 60), [a, setA] = useState(false);
  useEffect(() => {
    let i = null;
    if (a && s > 0) i = setInterval(() => setS(p => p - 1), 1000);
    else if (s === 0) setA(false);
    return () => clearInterval(i);
  }, [a, s]);
  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 40, alignItems: 'center' }}>
      <BackButton onPress={onBack} />
      <Text style={{ fontSize: 60, fontWeight: 'bold', color: colors.text, marginTop: 40 }}>{Math.floor(s / 60)}:{(s % 60).toString().padStart(2, '0')}</Text>
      <TouchableOpacity onPress={() => setA(!a)} style={{ marginTop: 40, backgroundColor: colors.accent, padding: 15, borderRadius: 30 }}><Text style={{ color: '#fff' }}>{a ? "Pause" : "Start"}</Text></TouchableOpacity>
    </ScrollView>
  );
};
const QuoteScreen = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const insets = useSafeAreaInsets();
  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 40, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 }}>
      <BackButton onPress={onBack} />
      <Text style={{ fontSize: 24, fontStyle: 'italic', color: colors.text, textAlign: 'center' }}>"{["Peace begins with a smile.", "Breath is the bridge.", "Quiet the mind."][Math.floor(Math.random() * 3)]}"</Text>
    </ScrollView>
  );
};
const JournalScreen = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { user, setProfileLocally } = React.useContext(AuthContext);
  const [entries, setEntries] = useState([]), [note, setNote] = useState("");
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/journal`), orderBy('createdAt', 'desc'), limit(50));
    const unsub = onSnapshot(q, s => setEntries(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    return unsub;
  }, [user]);
  const save = async () => {
    if (!note.trim()) return;
    await addDoc(collection(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/journal`), { text: note, createdAt: serverTimestamp() });
    const mood = await detectMoodFromText(note);
    await updateDoc(doc(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/data/profile`), { lastMood: mood.emoji, lastMoodLabel: mood.label, lastMoodConfidence: mood.confidence });
    setProfileLocally(p => ({ ...p, lastMood: mood.emoji, lastMoodLabel: mood.label, lastMoodConfidence: mood.confidence }));
    setNote("");
  };
  const insets = useSafeAreaInsets();
  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 20, paddingHorizontal: 20, paddingBottom: 40 }}>
      <BackButton onPress={onBack} />
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 20 }}>Journal</Text>
      <GlassCard style={{ padding: 0 }}>
        <TextInput multiline value={note} onChangeText={setNote} style={{ height: 100, padding: 15, color: colors.text, fontSize: 16 }} placeholder="Type…" placeholderTextColor={colors.subtext} />
        <TouchableOpacity onPress={save} style={{ alignSelf: 'flex-end', padding: 15 }}><Text style={{ color: colors.accent, fontWeight: 'bold' }}>Save</Text></TouchableOpacity>
      </GlassCard>
      <FlatList data={entries} keyExtractor={i => i.id} renderItem={({ item }) => <GlassCard style={{ marginTop: 10 }}><Text style={{ color: colors.text }}>{item.text}</Text></GlassCard>} />
    </ScrollView>
  );
};
const InsightsScreen = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { profile } = React.useContext(AuthContext);
  const insets = useSafeAreaInsets();
  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 20, paddingHorizontal: 20, paddingBottom: 40 }}>
      <BackButton onPress={onBack} />
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 20 }}>Zen Insights</Text>
      <GlassCard><Text style={{ color: colors.text, fontSize: 16 }}>Last Mood: {profile?.lastMood} ({profile?.lastMoodLabel})</Text><Text style={{ color: colors.subtext, marginTop: 5 }}>Confidence: {Math.round((profile?.lastMoodConfidence || 0) * 100)}%</Text></GlassCard>
      <GlassCard style={{ marginTop: 15 }}><Text style={{ color: colors.text, fontSize: 16 }}>Streak: 🔥 {profile?.streak || 0}</Text><Text style={{ color: colors.subtext, marginTop: 5 }}>Keep it going!</Text></GlassCard>
      <GlassCard style={{ marginTop: 15 }}><Text style={{ color: colors.text, fontSize: 16 }}>Zen Tip</Text><Text style={{ color: colors.subtext, marginTop: 5 }}>“Breathe in calm, breathe out stress.”</Text></GlassCard>
    </ScrollView>
  );
};

// -----------  GAMES (MINI)  -----------
const MemoryGame = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { updateTokens } = React.useContext(AuthContext);
  const [cards] = useState(['🍎', '🍎', '🥑', '🥑', '🍇', '🍇', '🍒', '🍒'].sort(() => Math.random() - 0.5));
  const [flipped, setFlipped] = useState([]), [matched, setMatched] = useState([]);
  const flip = i => {
    if (flipped.length === 2 || flipped.includes(i) || matched.includes(i)) return;
    const newF = [...flipped, i];
    setFlipped(newF);
    if (newF.length === 2) {
      if (cards[newF[0]] === cards[newF[1]]) {
        setMatched([...matched, ...newF]);
        setFlipped([]);
        if (matched.length + 2 === cards.length) { updateTokens(10, "memory_win"); Alert.alert("Won!"); }
      } else setTimeout(() => setFlipped([]), 1000);
    }
  };
  const insets = useSafeAreaInsets();
  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 40, alignItems: 'center' }}>
      <BackButton onPress={onBack} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: 300, justifyContent: 'center' }}>
        {cards.map((val, i) => (
          <TouchableOpacity key={i} onPress={() => flip(i)} style={{ width: 60, height: 80, margin: 5, backgroundColor: flipped.includes(i) || matched.includes(i) ? colors.accent : colors.tileBg, justifyContent: 'center', alignItems: 'center' }}>
            {(flipped.includes(i) || matched.includes(i)) && <Text style={{ fontSize: 30 }}>{val}</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};
const BubbleGame = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { updateTokens } = React.useContext(AuthContext);
  const [bubbles, setBubbles] = useState(Array.from({ length: 15 }, (_, i) => ({ id: i, visible: true })));
  const pop = id => {
    setBubbles(p => p.map(x => x.id === id ? { ...x, visible: false } : x));
    updateTokens(1);
    setTimeout(() => setBubbles(p => p.map(x => x.id === id ? { ...x, visible: true } : x)), 2000);
  };
  const insets = useSafeAreaInsets();
  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 40, alignItems: 'center' }}>
      <BackButton onPress={onBack} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: 300, justifyContent: 'center' }}>
        {bubbles.map(x => <TouchableOpacity key={x.id} onPress={() => pop(x.id)} style={{ width: 60, height: 60, margin: 10, backgroundColor: x.visible ? colors.icon.green : 'transparent', borderRadius: 30 }} />)}
      </View>
    </ScrollView>
  );
};

// -----------  MAIN LAYOUT  -----------
function MainLayout() {
  const { user, loading } = React.useContext(AuthContext);
  const { colors } = React.useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('home');
  const [screen, setScreen] = useState(null);
  const insets = useSafeAreaInsets();

  if (loading) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.screenBg }}><ActivityIndicator size="large" color={colors.accent} /><Text style={{ marginTop: 10, color: colors.subtext }}>Loading Zen…</Text></View>;
  if (!user) return <AuthScreen />;

  if (screen) {
    if (screen === 'timer') return <TimerScreen onBack={() => setScreen(null)} />;
    if (screen === 'quote') return <QuoteScreen onBack={() => setScreen(null)} />;
    if (screen === 'sounds') return <SoundScreen onBack={() => setScreen(null)} />;
    if (screen === 'game-memory') return <MemoryGame onBack={() => setScreen(null)} />;
    if (screen === 'game-bubbles') return <BubbleGame onBack={() => setScreen(null)} />;
    if (screen === 'game-switches') return <SwitchGame onBack={() => setScreen(null)} />;
    if (screen === 'game-color') return <ColorGame onBack={() => setScreen(null)} />;
    if (screen === 'game-grid') return <GridGame onBack={() => setScreen(null)} />;
    if (screen === 'game-fortune') return <FortuneGame onBack={() => setScreen(null)} />;
    if (screen === 'ai-chat') return <AIChatScreen onBack={() => setScreen(null)} />;
    if (screen === 'journal') return <JournalScreen onBack={() => setScreen(null)} />;
    if (screen === 'insights') return <InsightsScreen onBack={() => setScreen(null)} />;
    return <View style={{ flex: 1, paddingTop: insets.top + 20 }}><BackButton onPress={() => setScreen(null)} /></View>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.screenBg }}>
      <DailyRewardModal />
      <View style={{ flex: 1 }}>
        {activeTab === 'home' && <HomeTab navigateTo={setScreen} />}
        {activeTab === 'games' && <GamesTab navigateTo={setScreen} />}
        {activeTab === 'profile' && <ProfileTab />}
      </View>
      <View style={{ flexDirection: 'row', backgroundColor: colors.tabBar, paddingBottom: insets.bottom + 10, paddingTop: 15, borderTopWidth: 0.5, borderColor: colors.subtext + '30', position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        {['home', 'games', 'profile'].map(tab => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={{ flex: 1, alignItems: 'center' }}>
              <Svg width={28} height={28} viewBox="0 0 24 24"><Path d={ICONS[tab]} fill={isActive ? colors.tabActive : colors.tabInactive} /></Svg>
              <Text style={{ fontSize: 10, marginTop: 4, color: isActive ? colors.tabActive : colors.tabInactive, textTransform: 'capitalize' }}>{tab}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function App() {
  const systemScheme = useColorScheme();
  const theme = systemScheme || 'light';
  return (
    <ThemeContext.Provider value={{ theme, colors: THEME_COLORS[theme] }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: THEME_COLORS[theme].screenBg }} edges={['left', 'right']}>
        <AuthProvider>
          <MainLayout />
        </AuthProvider>
      </SafeAreaView>
    </ThemeContext.Provider>
  );
}