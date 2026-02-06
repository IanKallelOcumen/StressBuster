/**********************************************************************
 * app/(tabs)/index.jsx – COMPLETE, COHESIVE, NO-ERROR BUILD
 * Gemini 2.0 Flash / AI mood / unified padding / fixed onSnapshot
 *********************************************************************/
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView, Platform,
  Switch,
  Text, TextInput,
  TouchableOpacity, useColorScheme, View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Circle, Path, Svg } from 'react-native-svg';

// -----------  COMPONENTS  -----------
import { BalanceGame, BreathingExercise, BubbleGame, ColorGame, ColorMatch, FortuneGame, GridGame, MathBlitz, MemoryGame, NumberGuesser, PatternRepeat, PuzzleSlider, ReflexGame, SequenceGame, SimonSays, SpeedTap, SpinWheel, SwitchGame, TapCounter, WordChain } from '../../components/minigames';
import { AIChatScreen, detectMoodFromText, InsightsScreen, JournalScreen, QuoteScreen, SoundScreen, TimerScreen } from '../../components/screens';

// -----------  FIREBASE  -----------
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword, signOut,
  updateProfile
} from 'firebase/auth';
import {
  addDoc,
  collection,
  doc, getFirestore,
  onSnapshot,
  serverTimestamp, setDoc,
  updateDoc
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
    // Auto claim reward after 1 second
    setTimeout(() => {
      if (user) claimReward();
    }, 1000);
  };

  const claimReward = async () => {
    if (!user || !dailyReward) return;
    const { streak, reward } = dailyReward;
    const currentTokens = profile?.zenTokens || 0;
    const newTokens = Math.min(currentTokens + reward, 500);
    const actualReward = newTokens - currentTokens;
    setDailyReward(null);
    setProfile(p => ({ ...p, streak: streak, zenTokens: newTokens }));
    await updateDoc(doc(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/data/profile`), { streak, lastLogin: serverTimestamp(), zenTokens: newTokens });
    await addDoc(collection(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/wallet`), { amount: actualReward, reason: "daily_streak", createdAt: serverTimestamp() });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Daily Streak!", `🔥 ${streak} day streak! +${actualReward} tokens`);
  };

  const updateTokens = async (amt, reason = "game_reward") => {
    if (!user) return;
    const currentTokens = profile?.zenTokens || 0;
    const newTokens = Math.min(Math.max(currentTokens + amt, 0), 500);
    const actualChange = newTokens - currentTokens;
    if (actualChange === 0) return;
    setProfile(p => ({ ...p, zenTokens: newTokens }));
    await updateDoc(doc(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/data/profile`), { zenTokens: newTokens });
    await addDoc(collection(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/wallet`), { amount: actualChange, reason, createdAt: serverTimestamp() });
    if (newTokens === 500 && amt > 0) Alert.alert("Max Tokens!", "You've reached the 500 token limit! 🎉");
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
  return <View style={[{
    backgroundColor: color || colors.tileBg,
    borderRadius: 16,
    padding: 14,
    borderWidth: 0.5,
    borderColor: colors.accent + '15',
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2
  }, style]}>{children}</View>;
};
const BackButton = ({ onPress }) => {
  const { colors } = React.useContext(ThemeContext);
  const insets = useSafeAreaInsets();
  return (
    <TouchableOpacity onPress={onPress} style={{
      position: 'absolute',
      top: insets.top + 12,
      left: 16,
      zIndex: 999,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.tileBg,
      borderRadius: 20,
      borderWidth: 0.5,
      borderColor: colors.accent + '30',
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3
    }}>
      <Svg width={22} height={22} viewBox="0 0 24 24"><Path d={ICONS.back} fill={colors.text} /></Svg>
    </TouchableOpacity>
  );
};
// Daily reward modal removed - now shows as alert

// -----------  AUTH SCREEN  -----------
const AuthScreen = () => {
  const { colors } = React.useContext(ThemeContext);
  const [isLogin, setIsLogin] = useState(true), [isReset, setIsReset] = useState(false), [email, setEmail] = useState(''), [pass, setPass] = useState(''), [name, setName] = useState(''), [bDay, setBDay] = useState(''), [bMonth, setBMonth] = useState(''), [bYear, setBYear] = useState(''), [loading, setL] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true })
    ]).start();
  }, [fadeAnim, slideAnim, logoScale]);
  
  const handleButtonPressIn = () => {
    Animated.spring(buttonScale, { toValue: 0.96, friction: 3, tension: 200, useNativeDriver: true }).start();
  };
  
  const handleButtonPressOut = () => {
    Animated.spring(buttonScale, { toValue: 1, friction: 3, tension: 200, useNativeDriver: true }).start();
  };
  
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
        await setDoc(doc(db, `artifacts/${firebaseConfig.appId}/users/${u.uid}/data/profile`), { name, email, birthday: birthdayStr, zenTokens: 500, streak: 0, lastLogin: new Date("2000-01-01"), settings: { sfx: true } });
      }
    } catch (e) {
      let msg = e.message;
      if (e.code === 'auth/invalid-credential' || e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password') msg = "Invalid email or password.";
      else if (e.code === 'auth/email-already-in-use') msg = "Email already registered.";
      Alert.alert("Error", msg);
    }
    setL(false);
  };
  const horizontalPad = Math.min(40, Math.max(15, 30));
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, justifyContent: 'center', paddingHorizontal: horizontalPad, paddingVertical: 20, backgroundColor: colors.screenBg }}>
      <Animated.ScrollView 
        contentContainerStyle={{ justifyContent: 'center', minHeight: '100%' }} 
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim }}
      >
        <Animated.View style={{ transform: [{ translateY: slideAnim }, { scale: logoScale }] }}>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: colors.text, textAlign: 'center', marginBottom: 8 }}>Stress Buster</Text>
          <Text style={{ textAlign: 'center', color: colors.subtext, marginBottom: 24, fontSize: 14 }}>{isReset ? "Reset Password" : (isLogin ? "Welcome Back" : "Create Account")}</Text>
        </Animated.View>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        {!isLogin && !isReset && (
          <>
            <View style={{ marginBottom: 12 }}><GlassCard><TextInput placeholder="Nickname" placeholderTextColor={colors.subtext} value={name} onChangeText={setName} style={{ fontSize: 16, color: colors.text }} /></GlassCard></View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, gap: 8 }}>
              <View style={{ flex: 1 }}><GlassCard style={{ padding: 10, minHeight: 48 }}><TextInput placeholder="DD" keyboardType="numeric" maxLength={2} placeholderTextColor={colors.subtext} value={bDay} onChangeText={setBDay} style={{ fontSize: 16, color: colors.text, textAlign: 'center' }} /></GlassCard></View>
              <View style={{ flex: 1 }}><GlassCard style={{ padding: 10, minHeight: 48 }}><TextInput placeholder="MM" keyboardType="numeric" maxLength={2} placeholderTextColor={colors.subtext} value={bMonth} onChangeText={setBMonth} style={{ fontSize: 16, color: colors.text, textAlign: 'center' }} /></GlassCard></View>
              <View style={{ flex: 1.2 }}><GlassCard style={{ padding: 10, minHeight: 48 }}><TextInput placeholder="YYYY" keyboardType="numeric" maxLength={4} placeholderTextColor={colors.subtext} value={bYear} onChangeText={setBYear} style={{ fontSize: 16, color: colors.text, textAlign: 'center' }} /></GlassCard></View>
            </View>
          </>
        )}
        <View style={{ marginBottom: 12 }}><GlassCard><TextInput placeholder="Email" placeholderTextColor={colors.subtext} value={email} onChangeText={setEmail} style={{ fontSize: 16, color: colors.text }} autoCapitalize='none' /></GlassCard></View>
        {!isReset && <View style={{ marginBottom: 16 }}><GlassCard><TextInput placeholder="Password" placeholderTextColor={colors.subtext} value={pass} onChangeText={setPass} secureTextEntry style={{ fontSize: 16, color: colors.text }} /></GlassCard></View>}
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity 
            onPress={handleAuth} 
            onPressIn={handleButtonPressIn} 
            onPressOut={handleButtonPressOut}
            activeOpacity={1}
            style={{ backgroundColor: colors.accent, padding: 16, borderRadius: 20, alignItems: 'center', marginBottom: 20 }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{loading ? "…" : (isReset ? "Send Link" : (isLogin ? "Log In" : "Sign Up"))}</Text>
          </TouchableOpacity>
        </Animated.View>
        <View style={{ marginTop: 10, alignItems: 'center', gap: 12 }}>
          {isLogin && !isReset && <TouchableOpacity onPress={() => setIsReset(true)}><Text style={{ color: colors.accent, fontSize: 14 }}>Forgot Password?</Text></TouchableOpacity>}
          <TouchableOpacity onPress={() => { setIsReset(false); setIsLogin(!isLogin); }}><Text style={{ color: colors.subtext, fontSize: 14 }}>{isReset ? "Back to Login" : (isLogin ? "Create Account" : "Back to Login")}</Text></TouchableOpacity>
        </View>
        </Animated.View>
      </Animated.ScrollView>
    </KeyboardAvoidingView>
  );
};

// AI Chat and screens now imported from components/screens/

// -----------  GAMES  -----------
const GamesTab = ({ navigateTo }) => {
  const { colors } = React.useContext(ThemeContext);
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 450, useNativeDriver: true })
    ]).start();
  }, [fadeAnim, slideAnim]);
  
  const GameCard = ({ title, sub, color, onPress, children }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        friction: 3,
        tension: 200,
        useNativeDriver: true
      }).start();
    };
    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 200,
        useNativeDriver: true
      }).start();
    };
    return (
      <TouchableOpacity onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} activeOpacity={1} style={{ width: '48%' }}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <GlassCard style={{ height: 140, justifyContent: 'center', alignItems: 'center', backgroundColor: color + '12' }}>
            {children}
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.text, marginTop: 8 }}>{title}</Text>
            <Text style={{ fontSize: 10, color: colors.subtext, marginTop: 4 }}>{sub}</Text>
          </GlassCard>
        </Animated.View>
      </TouchableOpacity>
    );
  };
  return (
    <Animated.ScrollView 
      contentContainerStyle={{ paddingBottom: 120, paddingTop: insets.top + 16, paddingHorizontal: 12 }} 
      showsVerticalScrollIndicator={false}
      style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
    >
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 16, marginLeft: 4 }}>Game Center</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 }}>
        <GameCard title="Zen Match" sub="Flip Pairs (+10)" color={colors.icon.purple} onPress={() => navigateTo('game-memory')}><Svg width={32} height={32} viewBox="0 0 24 24"><Path d={ICONS.games} fill={colors.icon.purple} /></Svg></GameCard>
        <GameCard title="Pop Bubbles" sub="Stress Relief (+1)" color={colors.icon.green} onPress={() => navigateTo('game-bubbles')}><Circle cx="20" cy="20" r="16" fill={colors.icon.green} /></GameCard>
        <GameCard title="Switches" sub="Haptic Click" color={colors.icon.orange} onPress={() => navigateTo('game-switches')}><Switch value={true} trackColor={{ true: colors.icon.orange }} thumbColor="#fff" style={{ scale: 0.8 }} /></GameCard>
        <GameCard title="Color Calm" sub="Tap Colors" color={colors.icon.cyan} onPress={() => navigateTo('game-color')}><View style={{ width: 28, height: 28, backgroundColor: colors.icon.cyan, borderRadius: 6 }} /></GameCard>
        <GameCard title="Zen Grid" sub="Light up (+10)" color={colors.icon.blue} onPress={() => navigateTo('game-grid')}><View style={{ flexDirection: 'row', flexWrap: 'wrap', width: 28, justifyContent: 'center' }}>{[1, 2, 3, 4].map(i => <View key={i} style={{ width: 8, height: 8, backgroundColor: colors.icon.blue, margin: 1, borderRadius: 1 }} />)}</View></GameCard>
        <GameCard title="Daily Fortune" sub="Cookie (+5)" color={colors.icon.pink} onPress={() => navigateTo('game-fortune')}><Text style={{ fontSize: 28 }}>🥠</Text></GameCard>
        <GameCard title="Spin Wheel" sub="Random Prize" color={colors.icon.yellow} onPress={() => navigateTo('game-spin')}><Text style={{ fontSize: 28 }}>🎡</Text></GameCard>
        <GameCard title="Tap Counter" sub="Speed Test" color={colors.icon.red} onPress={() => navigateTo('game-tap')}><Text style={{ fontSize: 28 }}>⚡</Text></GameCard>
        <GameCard title="Pattern Repeat" sub="Memory Challenge" color={colors.icon.purple} onPress={() => navigateTo('game-pattern')}><Text style={{ fontSize: 28 }}>🧩</Text></GameCard>
        <GameCard title="Breathing" sub="Calm Exercise" color={colors.icon.cyan} onPress={() => navigateTo('game-breathing')}><Text style={{ fontSize: 28 }}>🧘</Text></GameCard>
        <GameCard title="Number Guesser" sub="Brain Teaser" color={colors.icon.yellow} onPress={() => navigateTo('game-number')}><Text style={{ fontSize: 28 }}>🎯</Text></GameCard>
        <GameCard title="Simon Says" sub="Sequence Game" color={colors.icon.red} onPress={() => navigateTo('game-simon')}><Text style={{ fontSize: 28 }}>🎮</Text></GameCard>
        <GameCard title="Reflex Tester" sub="Reaction Time" color={colors.icon.orange} onPress={() => navigateTo('game-reflex')}><Text style={{ fontSize: 28 }}>⚡</Text></GameCard>
        <GameCard title="Puzzle Slider" sub="Arrange Tiles" color={colors.icon.blue} onPress={() => navigateTo('game-puzzle')}><Text style={{ fontSize: 28 }}>🧩</Text></GameCard>
        <GameCard title="Word Chain" sub="Word Game" color={colors.icon.pink} onPress={() => navigateTo('game-words')}><Text style={{ fontSize: 28 }}>🔤</Text></GameCard>
        <GameCard title="Math Blitz" sub="Quick Math" color={colors.icon.yellow} onPress={() => navigateTo('game-math')}><Text style={{ fontSize: 28 }}>🧮</Text></GameCard>
        <GameCard title="Color Match" sub="Color Puzzle" color={colors.icon.purple} onPress={() => navigateTo('game-colormatch')}><Text style={{ fontSize: 28 }}>🎨</Text></GameCard>
        <GameCard title="Speed Tap" sub="Fast Clicking" color={colors.icon.red} onPress={() => navigateTo('game-speedtap')}><Text style={{ fontSize: 28 }}>⚡</Text></GameCard>
        <GameCard title="Balance Beam" sub="Focus Game" color={colors.icon.cyan} onPress={() => navigateTo('game-balance')}><Text style={{ fontSize: 28 }}>⚖️</Text></GameCard>
        <GameCard title="Sequence" sub="Memory Sequence" color={colors.icon.blue} onPress={() => navigateTo('game-sequence')}><Text style={{ fontSize: 28 }}>📊</Text></GameCard>
      </View>
    </Animated.ScrollView>
  );
};

// Minigames now imported from components/minigames/

// -----------  HOME  -----------
const HomeTab = ({ navigateTo }) => {
  const { colors } = React.useContext(ThemeContext);
  const { profile } = React.useContext(AuthContext);
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(25)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 450, useNativeDriver: true })
    ]).start();
  }, [fadeAnim, slideAnim]);
  
  const dailyShortcuts = [
    { title: 'Daily Quote', icon: ICONS.quote, color: '#ff2d55', route: 'quote' },
    { title: 'Focus Timer', icon: ICONS.timer, color: '#5856d6', route: 'timer' },
  ];
  
  const wellnessShortcuts = [
    { title: 'Journal', icon: ICONS.journal, color: '#007aff', route: 'journal' },
    { title: 'Zen Insights', icon: ICONS.mood, color: '#34c759', route: 'insights' },
  ];
  
  const toolsShortcuts = [
    { title: 'Soundscapes', icon: ICONS.music, color: '#FF3B30', route: 'sounds' },
    { title: 'AI Companion', icon: ICONS.chat, color: '#30b0c7', route: 'ai-chat' },
  ];

  const ShortcutCard = ({ title, icon, color, route }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.92,
        friction: 3,
        tension: 200,
        useNativeDriver: true
      }).start();
    };
    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 200,
        useNativeDriver: true
      }).start();
    };
    return (
      <TouchableOpacity onPress={() => navigateTo(route)} onPressIn={handlePressIn} onPressOut={handlePressOut} activeOpacity={1} style={{ flex: 1, aspectRatio: 1.1 }}>
        <Animated.View style={{ flex: 1, transform: [{ scale: scaleAnim }] }}>
          <BlurView intensity={80} tint={colors.blurTint} style={{ flex: 1, borderRadius: 16, padding: 14, justifyContent: 'space-between', backgroundColor: colors.tileBg }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: color + '30', alignItems: 'center', justifyContent: 'center' }}>
              <Svg width={22} height={22} viewBox="0 0 24 24"><Path d={icon} fill={color} /></Svg>
            </View>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text, marginTop: 8 }}>{title}</Text>
          </BlurView>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <Animated.ScrollView 
      contentContainerStyle={{ paddingBottom: 120, paddingTop: insets.top + 16, paddingHorizontal: 16 }} 
      showsVerticalScrollIndicator={false}
      style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
    >
      {/* Welcome Section */}
      <View style={{ marginBottom: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, color: colors.subtext, fontWeight: '500' }}>Welcome back,</Text>
            <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text, marginTop: 6 }}>{profile?.name || 'Friend'}</Text>
          </View>
          <View style={{ gap: 8, alignItems: 'flex-end' }}>
            <GlassCard style={{ paddingHorizontal: 10, paddingVertical: 6, backgroundColor: colors.icon.orange + '15', borderColor: colors.icon.orange + '30' }}>
              <Text style={{ color: colors.icon.orange, fontWeight: 'bold', fontSize: 13 }}>🔥 {profile?.streak || 0}</Text>
            </GlassCard>
            <GlassCard style={{ paddingHorizontal: 10, paddingVertical: 6, backgroundColor: colors.icon.yellow + '15', borderColor: colors.icon.yellow + '30' }}>
              <Text style={{ color: colors.icon.orange, fontWeight: 'bold', fontSize: 13 }}>💎 {profile?.zenTokens || 0}</Text>
            </GlassCard>
          </View>
        </View>
      </View>

      {/* Daily Wellness Section */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12 }}>Today's Wellness</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {dailyShortcuts.map((s, i) => (
            <ShortcutCard key={i} title={s.title} icon={s.icon} color={s.color} route={s.route} />
          ))}
        </View>
      </View>

      {/* Track & Grow Section */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12 }}>Track & Grow</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {wellnessShortcuts.map((s, i) => (
            <ShortcutCard key={i} title={s.title} icon={s.icon} color={s.color} route={s.route} />
          ))}
        </View>
      </View>

      {/* Explore Tools Section */}
      <View style={{ marginBottom: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12 }}>Explore Tools</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {toolsShortcuts.map((s, i) => (
            <ShortcutCard key={i} title={s.title} icon={s.icon} color={s.color} route={s.route} />
          ))}
        </View>
      </View>

      {/* Quick Stats */}
      <View style={{ marginTop: 24 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12 }}>Your Mood</Text>
        <GlassCard style={{ paddingVertical: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ color: colors.subtext, fontSize: 12, fontWeight: '500' }}>Current Mood</Text>
              <Text style={{ fontSize: 28, marginTop: 8 }}>{profile?.lastMood || '😶'}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ color: colors.text, fontWeight: '600', fontSize: 14 }}>{profile?.lastMoodLabel || 'Not tracked'}</Text>
              <Text style={{ color: colors.subtext, fontSize: 11, marginTop: 4 }}>Last from journal or chat</Text>
            </View>
          </View>
        </GlassCard>
      </View>
    </Animated.ScrollView>
  );
};

// -----------  PROFILE  -----------
const ProfileTab = () => {
  const { colors } = React.useContext(ThemeContext);
  const { profile, logout, updateName, resetStats } = React.useContext(AuthContext);
  const insets = useSafeAreaInsets();
  const [isEditing, setIsEditing] = useState(false), [newName, setNewName] = useState(profile?.name || "");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true })
    ]).start();
  }, [fadeAnim, slideAnim, scaleAnim]);
  
  const saveName = () => { updateName(newName); setIsEditing(false); };
  const getLevel = (tokens = 0) => {
    if (tokens < 100) return { name: "Novice", icon: "🌱" };
    if (tokens < 200) return { name: "Seeker", icon: "🌿" };
    if (tokens < 350) return { name: "Meditator", icon: "🧘" };
    if (tokens < 500) return { name: "Zen Master", icon: "⭐" };
    return { name: "Enlightened", icon: "✨" };
  };
  const levelInfo = getLevel(profile?.zenTokens);
  
  return (
    <Animated.ScrollView 
      contentContainerStyle={{ paddingBottom: 120, paddingTop: insets.top + 16, paddingHorizontal: 16 }} 
      showsVerticalScrollIndicator={false}
      style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
    >
      <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 24 }}>Profile</Text>
      <Animated.View style={{ alignItems: 'center', marginBottom: 28, transform: [{ scale: scaleAnim }] }}>
        <View style={{ 
          width: 88, 
          height: 88, 
          borderRadius: 44, 
          backgroundColor: colors.accent, 
          alignItems: 'center', 
          justifyContent: 'center', 
          marginBottom: 14,
          shadowColor: colors.accent,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 6,
          borderWidth: 3,
          borderColor: colors.screenBg
        }}>
          <Text style={{ fontSize: 40, color: '#fff', fontWeight: 'bold' }}>{profile?.name?.[0]?.toUpperCase() || '?'}</Text>
        </View>
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
        <Text style={{ color: colors.subtext, marginTop: 6 }}>{profile?.email}</Text>
      </Animated.View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, gap: 10 }}>
        <GlassCard style={{ flex: 1, paddingVertical: 16, paddingHorizontal: 10, alignItems: 'center', backgroundColor: colors.icon.orange + '08', borderColor: colors.icon.orange + '25' }}>
          <Text style={{ fontSize: 26 }}>🔥</Text>
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.text, marginTop: 6 }}>{profile?.streak || 0}</Text>
          <Text style={{ fontSize: 11, color: colors.subtext, fontWeight: '500', marginTop: 2 }}>Day Streak</Text>
        </GlassCard>
        <GlassCard style={{ flex: 1, paddingVertical: 16, paddingHorizontal: 10, alignItems: 'center', backgroundColor: colors.icon.yellow + '08', borderColor: colors.icon.yellow + '25' }}>
          <Text style={{ fontSize: 26 }}>💎</Text>
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.text, marginTop: 6 }}>{profile?.zenTokens || 0}</Text>
          <Text style={{ fontSize: 11, color: colors.subtext, fontWeight: '500', marginTop: 2 }}>Tokens</Text>
        </GlassCard>
        <GlassCard style={{ flex: 1, paddingVertical: 16, paddingHorizontal: 10, alignItems: 'center', backgroundColor: colors.accent + '08', borderColor: colors.accent + '25' }}>
          <Text style={{ fontSize: 26 }}>{profile?.lastMood || '😶'}</Text>
          <Text style={{ fontSize: 12, fontWeight: '700', color: colors.text, marginTop: 6 }}>{profile?.lastMoodLabel || 'Neutral'}</Text>
          <Text style={{ fontSize: 10, color: colors.subtext, fontWeight: '500', marginTop: 2 }}>Mood</Text>
        </GlassCard>
      </View>
      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 12 }}>Your Journey</Text>
      <GlassCard style={{ marginBottom: 16, backgroundColor: colors.accent + '08', borderColor: colors.accent + '25' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6 }}>
          <Text style={{ color: colors.subtext, fontSize: 13, fontWeight: '500' }}>Level</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ fontSize: 18 }}>{levelInfo.icon}</Text>
            <Text style={{ color: colors.accent, fontWeight: '800', fontSize: 15 }}>{levelInfo.name}</Text>
          </View>
        </View>
        <View style={{ height: 1, backgroundColor: colors.accent + '15', marginVertical: 10 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}><Text style={{ color: colors.subtext, fontSize: 13, fontWeight: '500' }}>Birthday</Text><Text style={{ color: colors.text, fontWeight: '600', fontSize: 13 }}>{profile?.birthday || "Not set"}</Text></View>
        <View style={{ height: 1, backgroundColor: colors.accent + '15', marginVertical: 10 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}><Text style={{ color: colors.subtext, fontSize: 13, fontWeight: '500' }}>Email</Text><Text style={{ color: colors.text, fontWeight: '600', fontSize: 13 }} numberOfLines={1}>{profile?.email || "Unknown"}</Text></View>
      </GlassCard>
      <TouchableOpacity onPress={resetStats} style={{ alignItems: 'center', marginTop: 14, paddingVertical: 8 }}>
        <Text style={{ color: colors.subtext, textDecorationLine: 'underline', fontSize: 13 }}>Reset Stats</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={logout} 
        style={{ 
          alignItems: 'center', 
          marginTop: 24,
          backgroundColor: colors.icon.red + '12',
          paddingVertical: 14,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.icon.red + '30'
        }}>
        <Text style={{ color: colors.icon.red, fontWeight: '700', fontSize: 15 }}>🚪 Log Out</Text>
      </TouchableOpacity>
    </Animated.ScrollView>
  );
};

// -----------  GAME WRAPPERS  -----------
const MemoryGameWrapper = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { updateTokens } = React.useContext(AuthContext);
  return (
    <>
      <BackButton onPress={onBack} />
      <MemoryGame onBack={onBack} colors={colors} updateTokens={updateTokens} />
    </>
  );
};

const BubbleGameWrapper = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { updateTokens } = React.useContext(AuthContext);
  return (
    <>
      <BackButton onPress={onBack} />
      <BubbleGame onBack={onBack} colors={colors} updateTokens={updateTokens} />
    </>
  );
};

const SwitchGameWrapper = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { updateTokens } = React.useContext(AuthContext);
  return (
    <>
      <BackButton onPress={onBack} />
      <SwitchGame onBack={onBack} colors={colors} updateTokens={updateTokens} />
    </>
  );
};

const ColorGameWrapper = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { updateTokens } = React.useContext(AuthContext);
  return (
    <>
      <BackButton onPress={onBack} />
      <ColorGame onBack={onBack} colors={colors} updateTokens={updateTokens} />
    </>
  );
};

const GridGameWrapper = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { updateTokens } = React.useContext(AuthContext);
  return (
    <>
      <BackButton onPress={onBack} />
      <GridGame onBack={onBack} colors={colors} updateTokens={updateTokens} />
    </>
  );
};

const FortuneGameWrapper = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { updateTokens } = React.useContext(AuthContext);
  return (
    <>
      <BackButton onPress={onBack} />
      <FortuneGame onBack={onBack} colors={colors} updateTokens={updateTokens} />
    </>
  );
};

const SpinWheelWrapper = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { updateTokens } = React.useContext(AuthContext);
  return (
    <>
      <BackButton onPress={onBack} />
      <SpinWheel onBack={onBack} colors={colors} updateTokens={updateTokens} />
    </>
  );
};

const TapCounterWrapper = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { updateTokens } = React.useContext(AuthContext);
  return (
    <>
      <BackButton onPress={onBack} />
      <TapCounter onBack={onBack} colors={colors} updateTokens={updateTokens} />
    </>
  );
};

const PatternRepeatWrapper = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { updateTokens } = React.useContext(AuthContext);
  return (
    <>
      <BackButton onPress={onBack} />
      <PatternRepeat onBack={onBack} colors={colors} updateTokens={updateTokens} />
    </>
  );
};

const BreathingExerciseWrapper = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { updateTokens } = React.useContext(AuthContext);
  return (
    <>
      <BackButton onPress={onBack} />
      <BreathingExercise onBack={onBack} colors={colors} updateTokens={updateTokens} />
    </>
  );
};

const NumberGuesserWrapper = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { updateTokens } = React.useContext(AuthContext);
  return (
    <>
      <BackButton onPress={onBack} />
      <NumberGuesser onBack={onBack} colors={colors} updateTokens={updateTokens} />
    </>
  );
};

const SimonSaysWrapper = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { updateTokens } = React.useContext(AuthContext);
  return (
    <>
      <BackButton onPress={onBack} />
      <SimonSays onBack={onBack} colors={colors} updateTokens={updateTokens} />
    </>
  );
};

const ReflexGameWrapper = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { updateTokens } = React.useContext(AuthContext);
  return (
    <>
      <BackButton onPress={onBack} />
      <ReflexGame onBack={onBack} colors={colors} updateTokens={updateTokens} />
    </>
  );
};

const PuzzleSliderWrapper = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { updateTokens } = React.useContext(AuthContext);
  return (
    <>
      <BackButton onPress={onBack} />
      <PuzzleSlider onBack={onBack} colors={colors} updateTokens={updateTokens} />
    </>
  );
};

const WordChainWrapper = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { updateTokens } = React.useContext(AuthContext);
  return (
    <>
      <BackButton onPress={onBack} />
      <WordChain onBack={onBack} colors={colors} updateTokens={updateTokens} />
    </>
  );
};

const MathBlitzWrapper = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { updateTokens } = React.useContext(AuthContext);
  return (
    <>
      <BackButton onPress={onBack} />
      <MathBlitz onBack={onBack} colors={colors} updateTokens={updateTokens} />
    </>
  );
};

const ColorMatchWrapper = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { updateTokens } = React.useContext(AuthContext);
  return (
    <>
      <BackButton onPress={onBack} />
      <ColorMatch onBack={onBack} colors={colors} updateTokens={updateTokens} />
    </>
  );
};

const SpeedTapWrapper = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { updateTokens } = React.useContext(AuthContext);
  return (
    <>
      <BackButton onPress={onBack} />
      <SpeedTap onBack={onBack} colors={colors} updateTokens={updateTokens} />
    </>
  );
};

const BalanceGameWrapper = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { updateTokens } = React.useContext(AuthContext);
  return (
    <>
      <BackButton onPress={onBack} />
      <BalanceGame onBack={onBack} colors={colors} updateTokens={updateTokens} />
    </>
  );
};

const SequenceGameWrapper = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { updateTokens } = React.useContext(AuthContext);
  return (
    <>
      <BackButton onPress={onBack} />
      <SequenceGame onBack={onBack} colors={colors} updateTokens={updateTokens} />
    </>
  );
};

// Screen wrappers
const SoundScreenWrapper = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  return (
    <>
      <BackButton onPress={onBack} />
      <SoundScreen onBack={onBack} colors={colors} />
    </>
  );
};

const TimerScreenWrapper = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  return (
    <>
      <BackButton onPress={onBack} />
      <TimerScreen onBack={onBack} colors={colors} />
    </>
  );
};

const QuoteScreenWrapper = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  return (
    <>
      <BackButton onPress={onBack} />
      <QuoteScreen onBack={onBack} colors={colors} />
    </>
  );
};

const AIChatScreenWrapper = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { profile, updateTokens, user, setProfileLocally } = React.useContext(AuthContext);
  return (
    <>
      <BackButton onPress={onBack} />
      <AIChatScreen
        onBack={onBack}
        colors={colors}
        profile={profile}
        updateTokens={updateTokens}
        user={user}
        setProfileLocally={setProfileLocally}
        db={db}
        firebaseConfig={firebaseConfig}
      />
    </>
  );
};

const JournalScreenWrapper = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { user, setProfileLocally } = React.useContext(AuthContext);
  return (
    <>
      <BackButton onPress={onBack} />
      <JournalScreen
        onBack={onBack}
        colors={colors}
        user={user}
        db={db}
        firebaseConfig={firebaseConfig}
        detectMoodFromText={detectMoodFromText}
        setProfileLocally={setProfileLocally}
      />
    </>
  );
};

const InsightsScreenWrapper = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { profile } = React.useContext(AuthContext);
  return (
    <>
      <BackButton onPress={onBack} />
      <InsightsScreen onBack={onBack} colors={colors} profile={profile} />
    </>
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
    if (screen === 'timer') return <TimerScreenWrapper onBack={() => setScreen(null)} />;
    if (screen === 'quote') return <QuoteScreenWrapper onBack={() => setScreen(null)} />;
    if (screen === 'sounds') return <SoundScreenWrapper onBack={() => setScreen(null)} />;
    if (screen === 'game-memory') return <MemoryGameWrapper onBack={() => setScreen(null)} />;
    if (screen === 'game-bubbles') return <BubbleGameWrapper onBack={() => setScreen(null)} />;
    if (screen === 'game-switches') return <SwitchGameWrapper onBack={() => setScreen(null)} />;
    if (screen === 'game-color') return <ColorGameWrapper onBack={() => setScreen(null)} />;
    if (screen === 'game-grid') return <GridGameWrapper onBack={() => setScreen(null)} />;
    if (screen === 'game-fortune') return <FortuneGameWrapper onBack={() => setScreen(null)} />;
    if (screen === 'game-spin') return <SpinWheelWrapper onBack={() => setScreen(null)} />;
    if (screen === 'game-tap') return <TapCounterWrapper onBack={() => setScreen(null)} />;
    if (screen === 'game-pattern') return <PatternRepeatWrapper onBack={() => setScreen(null)} />;
    if (screen === 'game-breathing') return <BreathingExerciseWrapper onBack={() => setScreen(null)} />;
    if (screen === 'game-number') return <NumberGuesserWrapper onBack={() => setScreen(null)} />;
    if (screen === 'game-simon') return <SimonSaysWrapper onBack={() => setScreen(null)} />;
    if (screen === 'game-reflex') return <ReflexGameWrapper onBack={() => setScreen(null)} />;
    if (screen === 'game-puzzle') return <PuzzleSliderWrapper onBack={() => setScreen(null)} />;
    if (screen === 'game-words') return <WordChainWrapper onBack={() => setScreen(null)} />;
    if (screen === 'game-math') return <MathBlitzWrapper onBack={() => setScreen(null)} />;
    if (screen === 'game-colormatch') return <ColorMatchWrapper onBack={() => setScreen(null)} />;
    if (screen === 'game-speedtap') return <SpeedTapWrapper onBack={() => setScreen(null)} />;
    if (screen === 'game-balance') return <BalanceGameWrapper onBack={() => setScreen(null)} />;
    if (screen === 'game-sequence') return <SequenceGameWrapper onBack={() => setScreen(null)} />;
    if (screen === 'ai-chat') return <AIChatScreenWrapper onBack={() => setScreen(null)} />;
    if (screen === 'journal') return <JournalScreenWrapper onBack={() => setScreen(null)} />;
    if (screen === 'insights') return <InsightsScreenWrapper onBack={() => setScreen(null)} />;
    return <View style={{ flex: 1, paddingTop: insets.top + 20 }}><BackButton onPress={() => setScreen(null)} /></View>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.screenBg }}>
      <View style={{ flex: 1 }}>
        {activeTab === 'home' && <HomeTab navigateTo={setScreen} />}
        {activeTab === 'games' && <GamesTab navigateTo={setScreen} />}
        {activeTab === 'profile' && <ProfileTab />}
      </View>
      <View style={{ flexDirection: 'row', backgroundColor: colors.tabBar, paddingBottom: insets.bottom + 12, paddingTop: 12, paddingHorizontal: 8, borderTopWidth: 0.5, borderColor: colors.subtext + '20', position: 'absolute', bottom: 0, left: 0, right: 0, shadowColor: colors.text, shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 8 }}>
        {['home', 'games', 'profile'].map(tab => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: 8,
              borderRadius: 12,
              backgroundColor: isActive ? colors.accent + '10' : 'transparent',
              gap: 4
            }}>
              <Svg width={26} height={26} viewBox="0 0 24 24"><Path d={ICONS[tab]} fill={isActive ? colors.tabActive : colors.tabInactive} /></Svg>
              <Text style={{ fontSize: 9, color: isActive ? colors.tabActive : colors.tabInactive, textTransform: 'capitalize', fontWeight: isActive ? '600' : '500' }}>{tab}</Text>
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
