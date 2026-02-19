/**********************************************************************
 * app/(tabs)/index.jsx – COMPLETE, COHESIVE, NO-ERROR BUILD
 * Gemini 2.0 Flash / AI mood / unified padding / fixed onSnapshot
 *********************************************************************/
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Image,
    Platform,
    ScrollView,
    Switch,
    Text, TextInput,
    TouchableOpacity, useColorScheme,
    useWindowDimensions,
    View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Circle, Path, Svg } from 'react-native-svg';
import AuthScreen from '../../components/screens/AuthScreen';
import BaseGlassCard from '../../components/ui/GlassCard';
import BaseGradientBackground from '../../components/ui/GradientBackground';
// import FloatingChat from '../../components/ui/FloatingChat';
import DevOverlay from '../../components/dev/DevOverlay';
import { DevProvider } from '../../context/DevContext';
import { THEME_COLORS, ThemeContext } from '../../context/ThemeContext';
import { safeHaptics, NotificationFeedbackType } from '../../utils/haptics';
import { ZEN_MAX_TOKENS, ZEN_DAILY_REWARD_PER_STREAK } from '../../utils/zenTokens';

// -----------  COMPONENTS  -----------
import { BalanceGame, BreathingExercise, BubbleGame, ColorGame, ColorMatch, EmojiCatch, FocusHold, FortuneGame, GridGame, MandalaDraw, MathBlitz, MemoryGame, MemoryMatrix, NumberGuesser, PuzzleSlider, ReflexGame, SimonSays, SpeedTap, SpinWheel, SwitchGame, TapCounter, WordChain } from '../../components/minigames';
import { JournalScreen } from '../../components/screens';

// Lazy-load heavier screens to speed up initial load
const LazyAIChatScreen = React.lazy(() => import('../../components/screens/AIChatScreen').then(m => ({ default: m.AIChatScreen })));
const LazyTimerScreen = React.lazy(() => import('../../components/screens/TimerScreen').then(m => ({ default: m.TimerScreen })));
const LazyQuoteScreen = React.lazy(() => import('../../components/screens/QuoteScreen').then(m => ({ default: m.QuoteScreen })));
const LazySoundScreen = React.lazy(() => import('../../components/screens/SoundScreen').then(m => ({ default: m.SoundScreen })));
const LazyInsightsScreen = React.lazy(() => import('../../components/screens/InsightsScreen').then(m => ({ default: m.InsightsScreen })));

// -----------  FIREBASE  -----------
import * as ImagePicker from 'expo-image-picker';
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
    connectAuthEmulator,
    getAuth,
    getReactNativePersistence,
    initializeAuth,
    onAuthStateChanged,
    sendEmailVerification as sendEmailVerificationAuth,
    signOut,
    updateProfile as updateProfileAuth
} from 'firebase/auth';
import {
    addDoc,
    collection,
    connectFirestoreEmulator,
    doc, getFirestore,
    initializeFirestore,
    onSnapshot,
    serverTimestamp,
    updateDoc
} from 'firebase/firestore';
import { connectStorageEmulator, getDownloadURL as getDownloadURLStorage, getStorage as getStorageAuth, ref as refStorage, uploadBytesResumable as uploadBytesResumableStorage } from 'firebase/storage';

import Constants from 'expo-constants';

// -----------  CONFIG  -----------
const extra = Constants.expoConfig?.extra || {};
const {
  geminiApiKey,
  firebaseApiKey,
  firebaseAuthDomain,
  firebaseProjectId,
  firebaseStorageBucket,
  firebaseMessagingSenderId,
  firebaseAppId,
  firebaseMeasurementId
} = extra;

const firebaseConfig = {
  apiKey: firebaseApiKey || 'demo-api-key',
  authDomain: firebaseAuthDomain || 'demo.firebaseapp.com',
  projectId: firebaseProjectId || 'demo-project',
  storageBucket: firebaseStorageBucket || 'demo-project.appspot.com',
  messagingSenderId: firebaseMessagingSenderId || '123456789',
  appId: firebaseAppId || '1:123456789:web:abcdef',
  measurementId: firebaseMeasurementId,
  storageBucket: firebaseStorageBucket || 'demo-project.appspot.com'
};

let auth, db, storage;
try {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  try { auth = initializeAuth(app, { persistence: getReactNativePersistence(ReactNativeAsyncStorage) }); }
  catch { auth = getAuth(app); }
  db = Platform.OS === 'web'
    ? initializeFirestore(app, { experimentalForceLongPolling: true, experimentalAutoDetectLongPolling: false, useFetchStreams: false })
    : getFirestore(app);
  storage = getStorageAuth(app);

  // Connect to emulators for local development (only if emulators are running)
  // NOTE: Emulators are optional - app will work with production Firebase if emulators aren't running
  // To start emulators: npm run emulators (or npm run emulators:start for PowerShell with Java setup)
  if (Platform.OS === 'web') {
    // Check if emulators are running by trying to fetch the emulator UI
    // This is non-blocking and won't prevent the app from working
    (async () => {
      try {
        // Quick check if emulator UI is accessible (indicates emulators are running)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 500); // 500ms timeout
        
        const response = await fetch('http://127.0.0.1:4000', { 
          method: 'HEAD', 
          mode: 'no-cors',
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        // If we get here, emulators are likely running
        try {
          connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
          connectFirestoreEmulator(db, '127.0.0.1', 8080);
          connectStorageEmulator(storage, '127.0.0.1', 9199);
          if (__DEV__) console.log('Connected to Firebase emulators');
        } catch (connectError) {
          if (!connectError?.message?.includes('already been initialized') && !connectError?.message?.includes('already connected') && __DEV__) {
            console.warn('Could not connect to emulators:', connectError?.message);
          }
        }
      } catch (_e) {
        // Emulators not running - use production Firebase
      }
    })();
  }
} catch (e) {
  if (__DEV__) console.warn('Firebase init error:', e?.message);
}

// -----------  THEME  -----------
// Imported from context/ThemeContext.js

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
  music: 'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z',
  forward: 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
  settings: 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.91l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.2-1.13.53-1.62.91l-2.39-.96c-.21-.08-.47-.05-.59.22L3.16 8.87c-.09.16-.12.36.03.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.91l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.2 1.13-.53 1.62-.91l2.39.96c.21.08.47.05.59-.22l1.92-3.32c.09-.22.05-.44-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z',
  bell: 'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z',
  moon: 'M9.37 5.51c-.18.64-.27 1.31-.27 1.99 0 4.08 3.32 7.4 7.4 7.4.68 0 1.35-.09 1.99-.27C17.45 17.16 14.93 19 12 19c-3.86 0-7-3.14-7-7 0-2.93 1.84-5.45 4.37-6.49z',
  sun: 'M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.79 1.41-1.41-1.79-1.79-1.41 1.41zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z',
  volume: 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'
};

// -----------  CONTEXTS  -----------
export const AuthContext = React.createContext();
const AuthProvider = ({ children }) => {
  if (!auth) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}><Text>Firebase auth not initialized</Text></View>;
  }
  
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [dailyReward, setDailyReward] = useState(null);
  const streakChecked = useRef(false);
  const streakTimeoutRef = useRef(null);

  // Dev function to update tokens (exposed to window for console access)
  const updateDevTokens = async (targetTokens = 5000) => {
    try {
      if (!user) return;
      if (user.email !== 'whatthe@gmail.com') return;
      const profileRef = doc(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/data/profile`);
      await updateDoc(profileRef, { zenTokens: targetTokens });
      setProfile(p => ({ ...p, zenTokens: targetTokens }));
      Alert.alert('Success', `Tokens updated to ${targetTokens}!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update tokens: ' + (error?.message || 'Unknown'));
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && Platform.OS === 'web' && user && db) {
      window.updateDevTokens = updateDevTokens;
    }
  }, [user, db]);

  useEffect(() => {
    try {
      return onAuthStateChanged(auth, u => {
        setUser(u);
        if (!u) {
          setProfile(null);
          setLoading(false);
          streakChecked.current = false;
        } else {
          setLoading(false); // show app immediately; profile will fill in from snapshot
        }
      }, (error) => {
        if (__DEV__) console.error('Auth error:', error?.message);
        setLoading(false);
      });
    } catch (error) {
      if (__DEV__) console.error('Auth setup error:', error?.message);
      setLoading(false);
      return () => {};
    }
  }, []);


  useEffect(() => {
    if (!user) return;
    const ref = doc(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/data/profile`);
    const unsub = onSnapshot(ref, snap => {
      if (snap.exists()) {
        const data = snap.data();
        setProfile(data);
        if (!streakChecked.current) checkStreak(data);
      } else {
        setProfile(null);
      }
      setLoading(false);
    }, (error) => {
      if (__DEV__) console.error('Profile listener error:', error);
      setLoading(false);
    });
    return () => {
      unsub();
      if (streakTimeoutRef.current) {
        clearTimeout(streakTimeoutRef.current);
        streakTimeoutRef.current = null;
      }
    };
  }, [user]);

  const checkStreak = (data) => {
    const now = new Date();
    const last = (data.lastLogin?.toDate?.() || new Date("2000-01-01"));
    const diff = Math.round((new Date(now.getFullYear(), now.getMonth(), now.getDate()) - new Date(last.getFullYear(), last.getMonth(), last.getDate())) / 86400000);
    streakChecked.current = true;
    if (diff === 0) return;
    let newStreak = 1, reward = ZEN_DAILY_REWARD_PER_STREAK;
    if (diff === 1) { newStreak = (data.streak || 0) + 1; reward = newStreak * ZEN_DAILY_REWARD_PER_STREAK; }
    setDailyReward({ streak: newStreak, reward });
    if (streakTimeoutRef.current) clearTimeout(streakTimeoutRef.current);
    streakTimeoutRef.current = setTimeout(() => {
      streakTimeoutRef.current = null;
      if (user) claimReward();
    }, 1000);
  };

  const claimReward = async () => {
    if (!user || !dailyReward) return;
    const { streak, reward } = dailyReward;
    const currentTokens = profile?.zenTokens || 0;
    const newTokens = Math.min(currentTokens + reward, ZEN_MAX_TOKENS);
    const actualReward = newTokens - currentTokens;
    setDailyReward(null);
    setProfile(p => ({ ...p, streak: streak, zenTokens: newTokens }));
    await updateDoc(doc(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/data/profile`), { streak, lastLogin: serverTimestamp(), zenTokens: newTokens });
    await addDoc(collection(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/wallet`), { amount: actualReward, reason: "daily_streak", createdAt: serverTimestamp() });
    safeHaptics.notificationAsync(NotificationFeedbackType.Success);
    Alert.alert("Daily Streak!", `🔥 ${streak} day streak! +${actualReward} tokens`);
  };

  const updateTokens = async (amt, reason = "game_reward") => {
    if (!user) return;
    const currentTokens = profile?.zenTokens || 0;
    const newTokens = Math.min(Math.max(currentTokens + amt, 0), ZEN_MAX_TOKENS);
    const actualChange = newTokens - currentTokens;
    if (actualChange === 0) return;
    setProfile(p => ({ ...p, zenTokens: newTokens }));
    await updateDoc(doc(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/data/profile`), { zenTokens: newTokens });
    await addDoc(collection(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/wallet`), { amount: actualChange, reason, createdAt: serverTimestamp() });
    if (newTokens === ZEN_MAX_TOKENS && amt > 0) Alert.alert("Max Tokens!", `You've reached the ${ZEN_MAX_TOKENS} token limit! 🎉`);
  };

  const logout = async () => { streakChecked.current = false; await signOut(auth); };
  
  const uploadAvatar = async (uri) => {
    if (!user || !uri) return;
    try {
      // Basic validation
      const response = await fetch(uri);
      const blob = await response.blob();
      
      // Check size (e.g., 5MB limit)
      if (blob.size > 5 * 1024 * 1024) {
          Alert.alert("Error", "Image is too large (max 5MB).");
          return;
      }

      const storage = getStorageAuth(getApp());
      const storageRef = refStorage(storage, `avatars/${user.uid}/${Date.now()}.jpg`);
      
      // Metadata for security rules
      const metadata = { contentType: 'image/jpeg', customMetadata: { uid: user.uid } };
      
      const uploadTask = uploadBytesResumableStorage(storageRef, blob, metadata);
      
      uploadTask.on('state_changed',
        (snapshot) => {
          if (__DEV__) {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload', Math.round(progress) + '%');
          }
        }, 
        (error) => {
          if (__DEV__) console.error("Upload failed:", error);
          Alert.alert("Upload Error", "Failed to upload image.");
        }, 
        async () => {
          const downloadURL = await getDownloadURLStorage(uploadTask.snapshot.ref);
          await updateProfileAuth(user, { photoURL: downloadURL });
          setProfile(p => ({ ...p, photoURL: downloadURL }));
          await updateDoc(doc(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/data/profile`), { photoURL: downloadURL });
          Alert.alert("Success", "Profile picture updated!");
        }
      );
    } catch (e) {
      if (__DEV__) console.error(e);
      Alert.alert("Error", "Could not process image.");
    }
  };

  const refreshUser = async () => {
    if (!auth?.currentUser) return;
    try {
      await auth.currentUser.reload();
      setUser(auth.currentUser);
    } catch (_) {}
  };

  const sendVerification = async () => {
    if (!user) return;
    try {
      await refreshUser();
      const current = auth.currentUser;
      if (current?.emailVerified) return;
      await sendEmailVerificationAuth(current || user);
      Alert.alert("Verification Sent", "Check your email and click the link. Then tap \"Verify Email\" again to refresh your status.");
    } catch (e) {
      Alert.alert("Error", e?.message || "Could not send verification email.");
    }
  };

  const updateName = async (newName) => {
    if (!user || !newName.trim()) return;
    setProfile(p => ({ ...p, name: newName }));
    await updateDoc(doc(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/data/profile`), { name: newName });
  };

  const updateSettings = async (newSettings) => {
    if (!user) return;
    const updatedSettings = { ...profile?.settings, ...newSettings };
    setProfile(p => ({ ...p, settings: updatedSettings }));
    await updateDoc(doc(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/data/profile`), { settings: updatedSettings });
  };

  // TODO PRODUCTION: Remove resetStats (and from AuthContext.Provider value below) before production — users must not be able to reset their statistics.
  const resetStats = async () => {
    if (!user) return;
    setProfile(p => ({ ...p, streak: 0, zenTokens: 0 }));
    await updateDoc(doc(db, `artifacts/${firebaseConfig.appId}/users/${user.uid}/data/profile`), { streak: 0, zenTokens: 0 });
    Alert.alert("Reset", "Your stats have been reset.");
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, updateTokens, setProfileLocally: setProfile, dailyReward, claimReward, logout, updateName, updateSettings, resetStats, uploadAvatar, sendVerification, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// -----------  UI COMPONENTS  -----------
const GradientBackground = (props) => {
  const { colors } = React.useContext(ThemeContext);
  return <BaseGradientBackground {...props} colors={colors} />;
};

const GlassCard = (props) => {
  const { colors } = React.useContext(ThemeContext);
  return <BaseGlassCard {...props} colors={colors} />;
};
const BackButton = ({ onPress }) => {
  const { colors } = React.useContext(ThemeContext);
  const insets = useSafeAreaInsets();
  
  // Debounce logic to prevent double navigation
  const [isPressed, setIsPressed] = useState(false);
  const handlePress = () => {
    if (isPressed) return;
    setIsPressed(true);
    onPress();
    // Reset lock after 1s just in case, though usually component unmounts
    setTimeout(() => setIsPressed(false), 1000);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={{
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
      ...(Platform.OS === 'web' ? {
        boxShadow: `0 2px 6px 0 ${colors.text}1A`,
      } : {
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3
      })
    }}>
      <Svg width={22} height={22} viewBox="0 0 24 24"><Path d={ICONS.back} fill={colors.text} /></Svg>
    </TouchableOpacity>
  );
};
// Daily reward modal removed - now shows as alert

// -----------  AUTH SCREEN  -----------
// AuthScreen is now imported from components/screens/AuthScreen.jsx

// AI Chat and screens now imported from components/screens/

// -----------  GAMES  -----------
const GAME_CATEGORIES = ['All', 'Relax', 'Focus', 'Brain', 'Fun'];
const GAMES_LIST = [
  { id: 'game-mandala', title: "Mandala Draw", sub: "Relaxing Art", color: 'pink', category: 'Relax', type: 'emoji', emoji: '🌸' },
  { id: 'game-breathing', title: "Breathing", sub: "Calm Exercise", color: 'cyan', category: 'Relax', type: 'emoji', emoji: '🧘' },
  { id: 'game-bubbles', title: "Pop Bubbles", sub: "Stress Relief", color: 'green', category: 'Relax', type: 'circle' },
  { id: 'game-focus', title: "Focus Flame", sub: "Hold to Zen", color: 'orange', category: 'Relax', type: 'emoji', emoji: '🔥' },
  { id: 'game-emoji', title: "Emoji Rain", sub: "Catch Happy", color: 'yellow', category: 'Relax', type: 'emoji', emoji: '😊' },
  { id: 'game-color', title: "Color Calm", sub: "Tap Colors", color: 'cyan', category: 'Relax', type: 'box' },
  { id: 'game-memory', title: "Zen Match", sub: "Flip Pairs", color: 'purple', category: 'Focus', type: 'svg' },
  { id: 'game-matrix', title: "Memory Matrix", sub: "Pattern Recall", color: 'blue', category: 'Focus', type: 'emoji', emoji: '🔳' },
  { id: 'game-balance', title: "Balance Beam", sub: "Focus Game", color: 'cyan', category: 'Focus', type: 'emoji', emoji: '⚖️' },
  { id: 'game-simon', title: "Simon Says", sub: "Sequence Game", color: 'red', category: 'Focus', type: 'emoji', emoji: '🎮' },
  { id: 'game-reflex', title: "Reflex Tester", sub: "Reaction Time", color: 'orange', category: 'Focus', type: 'emoji', emoji: '⚡' },
  { id: 'game-puzzle', title: "Puzzle Slider", sub: "Arrange Tiles", color: 'blue', category: 'Brain', type: 'emoji', emoji: '🧩' },
  { id: 'game-words', title: "Word Chain", sub: "Word Game", color: 'pink', category: 'Brain', type: 'emoji', emoji: '🔤' },
  { id: 'game-math', title: "Math Blitz", sub: "Quick Math", color: 'yellow', category: 'Brain', type: 'emoji', emoji: '🧮' },
  { id: 'game-colormatch', title: "Color Match", sub: "Color Puzzle", color: 'purple', category: 'Brain', type: 'emoji', emoji: '🎨' },
  { id: 'game-number', title: "Number Guesser", sub: "Brain Teaser", color: 'yellow', category: 'Brain', type: 'emoji', emoji: '🎯' },
  { id: 'game-fortune', title: "Daily Fortune", sub: "Cookie (+5)", color: 'pink', category: 'Fun', type: 'emoji', emoji: '🥠' },
  { id: 'game-spin', title: "Spin Wheel", sub: "Random Prize", color: 'yellow', category: 'Fun', type: 'emoji', emoji: '🎡' },
  { id: 'game-tap', title: "Tap Counter", sub: "Speed Test", color: 'red', category: 'Fun', type: 'emoji', emoji: '⚡' },
  { id: 'game-speedtap', title: "Speed Tap", sub: "Fast Clicking", color: 'red', category: 'Fun', type: 'emoji', emoji: '⚡' },
  { id: 'game-switches', title: "Switches", sub: "Haptic Click", color: 'orange', category: 'Fun', type: 'switch' },
  { id: 'game-grid', title: "Zen Grid", sub: "Light up (+10)", color: 'blue', category: 'Fun', type: 'grid' },
];

const GamesTab = ({ navigateTo }) => {
  const { colors } = React.useContext(ThemeContext);
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredGames = useMemo(
    () => selectedCategory === 'All' ? GAMES_LIST : GAMES_LIST.filter(g => g.category === selectedCategory),
    [selectedCategory]
  );

  useEffect(() => {
    const useNative = Platform.OS !== 'web';
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: useNative }),
      Animated.timing(slideAnim, { toValue: 0, duration: 450, useNativeDriver: useNative })
    ]).start();
  }, [fadeAnim, slideAnim]);

  const GameCard = ({ item }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const useNative = Platform.OS !== 'web';
    const handlePressIn = () => {
      Animated.spring(scaleAnim, { toValue: 0.95, friction: 3, tension: 200, useNativeDriver: useNative }).start();
    };
    const handlePressOut = () => {
      Animated.spring(scaleAnim, { toValue: 1, friction: 3, tension: 200, useNativeDriver: useNative }).start();
    };
    
    const renderIcon = () => {
      if (item.type === 'emoji') return <Text style={{ fontSize: 28 }}>{item.emoji}</Text>;
      if (item.type === 'svg') return <Svg width={32} height={32} viewBox="0 0 24 24"><Path d={ICONS.games} fill={colors.icon[item.color]} /></Svg>;
      if (item.type === 'circle') return <Svg width={32} height={32} viewBox="0 0 40 40"><Circle cx="20" cy="20" r="16" fill={colors.icon[item.color]} /></Svg>;
      if (item.type === 'switch') return <Switch value={true} trackColor={{ true: colors.icon[item.color] }} thumbColor="#fff" style={{ transform: [{ scale: 0.8 }] }} />;
      if (item.type === 'box') return <View style={{ width: 28, height: 28, backgroundColor: colors.icon[item.color], borderRadius: 6 }} />;
      if (item.type === 'grid') return <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: 28, justifyContent: 'center' }}>{[1, 2, 3, 4].map(i => <View key={i} style={{ width: 8, height: 8, backgroundColor: colors.icon[item.color], margin: 1, borderRadius: 1 }} />)}</View>;
      return null;
    };

    return (
      <TouchableOpacity onPress={() => navigateTo(item.id)} onPressIn={handlePressIn} onPressOut={handlePressOut} activeOpacity={1} style={{ width: '48%' }}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <GlassCard style={{ height: 140, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.icon[item.color] + '12' }}>
            {renderIcon()}
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.text, marginTop: 8 }}>{item.title}</Text>
            <Text style={{ fontSize: 10, color: colors.subtext, marginTop: 4 }}>{item.sub}</Text>
          </GlassCard>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <GradientBackground>
    <Animated.ScrollView 
      contentContainerStyle={{ paddingBottom: 120, paddingTop: insets.top + 16, paddingHorizontal: 12 }} 
      showsVerticalScrollIndicator={false}
      style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
    >
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 16, marginLeft: 4 }}>Game Center</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 4, marginBottom: 20 }}>
        {GAME_CATEGORIES.map(cat => (
          <TouchableOpacity 
            key={cat} 
            onPress={() => setSelectedCategory(cat)}
            style={{ 
              paddingVertical: 8, 
              paddingHorizontal: 16, 
              borderRadius: 20, 
              backgroundColor: selectedCategory === cat ? colors.accent : colors.tileBg,
              borderWidth: 1,
              borderColor: selectedCategory === cat ? colors.accent : colors.accent + '20'
            }}
          >
            <Text style={{ color: selectedCategory === cat ? '#fff' : colors.text, fontWeight: '600' }}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 }}>
        {filteredGames.map((game) => <GameCard key={game.id} item={game} />)}
      </View>
    </Animated.ScrollView>
    </GradientBackground>
  );
};

// Minigames now imported from components/minigames/

// -----------  HOME  -----------
const QUOTES = [
  "Peace comes from within. Do not seek it without.",
  "The only way to do great work is to love what you do.",
  "Smile, breathe, and go slowly.",
  "You are enough just as you are.",
  "This too shall pass.",
  "Inhale courage, exhale fear.",
  "Happiness depends upon ourselves."
];

const HomeTab = ({ navigateTo, openChat }) => {
  const { colors } = React.useContext(ThemeContext);
  const { profile } = React.useContext(AuthContext);
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(25)).current;
  
  const randomQuote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], []);

  useEffect(() => {
    const useNative = Platform.OS !== 'web';
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: useNative }),
      Animated.timing(slideAnim, { toValue: 0, duration: 450, useNativeDriver: useNative })
    ]).start();
  }, [fadeAnim, slideAnim]);
  
  const wellnessShortcuts = [
    { title: 'Journal', icon: ICONS.journal, color: '#007aff', route: 'journal' },
    { title: 'Zen Insights', icon: ICONS.mood, color: '#34c759', route: 'insights' },
    { title: 'Focus Timer', icon: ICONS.timer, color: '#5856d6', route: 'timer' },
  ];
  
  const toolsShortcuts = [
    { title: 'Soundscapes', icon: ICONS.music, color: '#FF3B30', route: 'sounds' },
    { title: 'AI Companion', icon: ICONS.chat, color: '#30b0c7', route: 'ai-chat' },
  ];

  const ShortcutCard = ({ title, icon, color, route }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const useNative = Platform.OS !== 'web';
    const handlePressIn = () => {
      Animated.spring(scaleAnim, { toValue: 0.92, friction: 3, tension: 200, useNativeDriver: useNative }).start();
    };
    const handlePressOut = () => {
      Animated.spring(scaleAnim, { toValue: 1, friction: 3, tension: 200, useNativeDriver: useNative }).start();
    };
    
    const handlePress = () => {
      navigateTo(route);
    };

    return (
      <TouchableOpacity onPress={handlePress} onPressIn={handlePressIn} onPressOut={handlePressOut} activeOpacity={1} style={{ flex: 1, aspectRatio: 1.1 }}>
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
    <GradientBackground>
    <Animated.ScrollView 
      contentContainerStyle={{ paddingBottom: 120, paddingTop: insets.top + 16, paddingHorizontal: 12 }} 
      showsVerticalScrollIndicator={false}
      style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
    >
      {/* Welcome Hero Section */}
      <View style={{ marginBottom: 24 }}>
        <GlassCard style={{ padding: 20, backgroundColor: colors.accent + '15', borderColor: colors.accent + '30' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={{ fontSize: 13, color: colors.subtext, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Welcome Back</Text>
                    <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text }}>{profile?.name || 'Friend'}</Text>
                    <Text style={{ fontSize: 14, color: colors.text, opacity: 0.7, marginTop: 6, lineHeight: 20 }}>Ready to find your balance today?</Text>
                </View>
                <View style={{ gap: 8 }}>
                     <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.tileBg, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: colors.icon.orange + '20' }}>
                        <Text style={{ fontSize: 16 }}>🔥</Text>
                        <Text style={{ marginLeft: 6, fontWeight: 'bold', color: colors.text, fontSize: 14 }}>{profile?.streak || 0}</Text>
                     </View>
                     <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.tileBg, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: colors.icon.yellow + '20' }}>
                        <Text style={{ fontSize: 16 }}>💎</Text>
                        <Text style={{ marginLeft: 6, fontWeight: 'bold', color: colors.text, fontSize: 14 }}>{profile?.zenTokens || 0}</Text>
                     </View>
                </View>
            </View>
        </GlassCard>
      </View>

      {/* Daily Quote Banner */}
      <TouchableOpacity onPress={() => navigateTo('quote')} activeOpacity={0.9} style={{ marginBottom: 28 }}>
        <GlassCard style={{ padding: 16, flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: colors.icon.pink + '08', borderColor: colors.icon.pink + '20' }}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.icon.pink + '20', alignItems: 'center', justifyContent: 'center' }}>
                <Svg width={22} height={22} viewBox="0 0 24 24"><Path d={ICONS.quote} fill={colors.icon.pink} /></Svg>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: colors.icon.pink, marginBottom: 4, letterSpacing: 0.5 }}>DAILY WISDOM</Text>
                <Text style={{ fontSize: 15, fontWeight: '500', color: colors.text, fontStyle: 'italic', lineHeight: 22 }}>“{randomQuote}”</Text>
            </View>
            <Svg width={20} height={20} viewBox="0 0 24 24"><Path d={ICONS.forward} fill={colors.subtext} /></Svg>
        </GlassCard>
      </TouchableOpacity>

      {/* Track & Grow Section */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 12 }}>Track & Grow</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {wellnessShortcuts.map((s, i) => (
            <ShortcutCard key={i} title={s.title} icon={s.icon} color={s.color} route={s.route} />
          ))}
        </View>
      </View>

      {/* Explore Tools Section */}
      <View style={{ marginBottom: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 12 }}>Explore Tools</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {toolsShortcuts.map((s, i) => (
            <ShortcutCard key={i} title={s.title} icon={s.icon} color={s.color} route={s.route} />
          ))}
        </View>
      </View>

      {/* Quick Stats */}
      <View style={{ marginTop: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 12 }}>Your Mood</Text>
        <GlassCard style={{ paddingVertical: 16, paddingHorizontal: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ color: colors.subtext, fontSize: 12, fontWeight: '600', textTransform: 'uppercase' }}>Current Mood</Text>
              <Text style={{ fontSize: 32, marginTop: 8 }}>{profile?.lastMood || '😶'}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ color: colors.text, fontWeight: '700', fontSize: 16 }}>{profile?.lastMoodLabel || 'Not tracked'}</Text>
              <Text style={{ color: colors.subtext, fontSize: 12, marginTop: 4 }}>Last entry from journal</Text>
            </View>
          </View>
        </GlassCard>
      </View>
    </Animated.ScrollView>
    </GradientBackground>
  );
};

// -----------  PROFILE  -----------
const ProfileTab = () => {
  const { colors } = React.useContext(ThemeContext);
  const { profile, logout, updateName, updateSettings, resetStats, user, uploadAvatar, sendVerification, refreshUser } = React.useContext(AuthContext);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isNarrow = width < 380;
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(profile?.name || "");
  const [sfxEnabled, setSfxEnabled] = useState(profile?.settings?.sfx ?? true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(profile?.settings?.notifications ?? true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    refreshUser?.();
  }, []);

  const handleAvatarPress = async () => {
    try {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setUploading(true);
            await uploadAvatar(result.assets[0].uri);
            setUploading(false);
        }
    } catch (e) {
        setUploading(false);
        Alert.alert("Error", "Could not pick image.");
    }
  };

  const handleSfxToggle = () => {
    const newVal = !sfxEnabled;
    setSfxEnabled(newVal);
    updateSettings({ sfx: newVal });
    if (newVal) safeHaptics.selectionAsync();
  };

  const handleNotificationsToggle = () => {
    const newVal = !notificationsEnabled;
    setNotificationsEnabled(newVal);
    updateSettings({ notifications: newVal });
    if (newVal) safeHaptics.notificationAsync(NotificationFeedbackType.Success);
  };

  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  useEffect(() => {
    const useNative = Platform.OS !== 'web';
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: useNative }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: useNative }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 40, useNativeDriver: useNative })
    ]).start();
  }, [fadeAnim, slideAnim, scaleAnim]);
  
  const saveName = () => { updateName(newName); setIsEditing(false); };
  
  const getLevel = (tokens = 0) => {
    if (tokens < 100) return { name: "Novice", icon: "🌱" };
    if (tokens < 200) return { name: "Seeker", icon: "🌿" };
    if (tokens < 300) return { name: "Meditator", icon: "🧘" };
    if (tokens < ZEN_MAX_TOKENS) return { name: "Zen Master", icon: "⭐" };
    return { name: "Enlightened", icon: "✨" };
  };
  const levelInfo = getLevel(profile?.zenTokens);

  const SettingRow = ({ icon, label, value, onToggle, color }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: color + '20', alignItems: 'center', justifyContent: 'center' }}>
           <Svg width={18} height={18} viewBox="0 0 24 24"><Path d={icon} fill={color} /></Svg>
        </View>
        <Text style={{ fontSize: 16, color: colors.text, fontWeight: '500' }}>{label}</Text>
      </View>
      <Switch 
        value={value} 
        onValueChange={onToggle}
        trackColor={{ false: colors.subtext + '40', true: colors.accent }}
        thumbColor={'#fff'}
      />
    </View>
  );
  
  return (
    <GradientBackground>
    <Animated.ScrollView 
      contentContainerStyle={{ paddingBottom: 120, paddingTop: insets.top + 16, paddingHorizontal: 16 }} 
      showsVerticalScrollIndicator={false}
      style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text }}>Profile</Text>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={{ padding: 8 }}>
            <Svg width={24} height={24} viewBox="0 0 24 24"><Path d={ICONS.settings} fill={colors.text} /></Svg>
          </TouchableOpacity>
      </View>

      <Animated.View style={{ alignItems: 'center', marginBottom: 28, transform: [{ scale: scaleAnim }] }}>
        <View style={{ marginBottom: 16 }}>
            <TouchableOpacity onPress={handleAvatarPress} disabled={uploading}>
                <View style={{ 
                width: 96, 
                height: 96, 
                borderRadius: 48, 
                backgroundColor: colors.accent, 
                alignItems: 'center', 
                justifyContent: 'center', 
                ...(Platform.OS === 'web' ? {
                  boxShadow: `0 8px 16px 0 ${colors.accent}4D`,
                } : {
                  shadowColor: colors.accent,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                  elevation: 10
                }),
                borderWidth: 4,
                borderColor: colors.screenBg,
                overflow: 'hidden'
                }}>
                {uploading ? (
                    <ActivityIndicator color="#fff" />
                ) : profile?.photoURL ? (
                    <Svg width="100%" height="100%" viewBox="0 0 100 100">
                        {/* We use an Image component from react-native here typically, but let's use a standard View with Image background or just basic text if fails. 
                            Since we are in Expo, let's use 'expo-image' or standard Image. 
                            I'll use a standard Image component. */}
                        <defs>
                            <clipPath id="clip">
                                <Circle cx="50" cy="50" r="50" />
                            </clipPath>
                        </defs>
                        {/* React Native Image inside SVG is tricky. Let's just use standard RN Image instead of this View block */}
                    </Svg>
                ) : (
                    <Text style={{ fontSize: 44, color: '#fff', fontWeight: 'bold' }}>{profile?.name?.[0]?.toUpperCase() || '?'}</Text>
                )}
                </View>
                {/* Standard Image Overlay if URL exists */}
                {!uploading && profile?.photoURL && (
                    <View style={{ position: 'absolute', width: 96, height: 96, borderRadius: 48, overflow: 'hidden', borderWidth: 4, borderColor: colors.screenBg }}>
                        <Image source={{ uri: profile.photoURL }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                    </View>
                )}
                <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: colors.tileBg, borderRadius: 12, padding: 6, borderWidth: 2, borderColor: colors.screenBg }}>
                    <Text style={{ fontSize: 16 }}>{uploading ? '⏳' : '📷'}</Text>
                </View>
            </TouchableOpacity>
        </View>
        
        {isEditing ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <GlassCard style={{ padding: 0, paddingHorizontal: 12 }}>
                <TextInput 
                    value={newName} 
                    onChangeText={setNewName} 
                    style={{ color: colors.text, fontSize: 20, fontWeight: 'bold', minWidth: 100, textAlign: 'center', paddingVertical: 8 }} 
                    autoFocus
                />
            </GlassCard>
            <TouchableOpacity onPress={saveName} style={{ backgroundColor: colors.accent, padding: 10, borderRadius: 12 }}>
                <Svg width={20} height={20} viewBox="0 0 24 24"><Path d={ICONS.forward} fill="#fff" /></Svg>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text }}>{profile?.name}</Text>
            <Text style={{ color: colors.accent, fontWeight: '600', fontSize: 14, marginTop: 4 }}>{levelInfo.name}</Text>
          </View>
        )}
      </Animated.View>

      {/* Stats Cards */}
      <View style={{ flexDirection: isNarrow ? 'column' : 'row', gap: 12, marginBottom: 24 }}>
        <GlassCard style={{ flex: 1, width: isNarrow ? '100%' : undefined, padding: 16, alignItems: 'center', backgroundColor: colors.icon.orange + '10', borderColor: colors.icon.orange + '20' }}>
          <Text style={{ fontSize: 24, marginBottom: 4 }}>🔥</Text>
          <Text style={{ fontSize: 20, fontWeight: '800', color: colors.text }}>{profile?.streak || 0}</Text>
          <Text style={{ fontSize: 11, color: colors.subtext, fontWeight: '600', textTransform: 'uppercase' }}>Streak</Text>
        </GlassCard>
        <GlassCard style={{ flex: 1, width: isNarrow ? '100%' : undefined, padding: 16, alignItems: 'center', backgroundColor: colors.icon.yellow + '10', borderColor: colors.icon.yellow + '20' }}>
          <Text style={{ fontSize: 24, marginBottom: 4 }}>💎</Text>
          <Text style={{ fontSize: 20, fontWeight: '800', color: colors.text }}>{profile?.zenTokens || 0}</Text>
          <Text style={{ fontSize: 11, color: colors.subtext, fontWeight: '600', textTransform: 'uppercase' }}>Tokens</Text>
        </GlassCard>
        <GlassCard style={{ flex: 1, width: isNarrow ? '100%' : undefined, padding: 16, alignItems: 'center', backgroundColor: colors.icon.blue + '10', borderColor: colors.icon.blue + '20' }}>
          <Text style={{ fontSize: 24, marginBottom: 4 }}>{profile?.lastMood || '😶'}</Text>
          <Text style={{ fontSize: 14, fontWeight: '800', color: colors.text, marginTop: 6, marginBottom: -2 }} numberOfLines={1}>{profile?.lastMoodLabel || 'None'}</Text>
          <Text style={{ fontSize: 11, color: colors.subtext, fontWeight: '600', textTransform: 'uppercase' }}>Mood</Text>
        </GlassCard>
      </View>

      {/* Settings Section */}
      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 12 }}>Security & Preferences</Text>
      <GlassCard style={{ marginBottom: 24, paddingVertical: 8 }}>
        <View style={{ paddingHorizontal: 24 }}>
          {/* Security Verification */}
          {!user?.emailVerified && (
             <TouchableOpacity onPress={sendVerification} style={{ paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.icon.orange + '20', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 16 }}>⚠️</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, color: colors.text, fontWeight: '500' }}>Verify Email</Text>
                    <Text style={{ fontSize: 12, color: colors.subtext }}>Secure your account</Text>
                </View>
                <Svg width={20} height={20} viewBox="0 0 24 24"><Path d={ICONS.forward} fill={colors.subtext} /></Svg>
             </TouchableOpacity>
          )}
          {!user?.emailVerified && <View style={{ height: 1, backgroundColor: colors.subtext + '15', marginLeft: 44 }} />}
          
          <SettingRow 
              icon={ICONS.volume} 
              label="Sound Effects" 
              value={sfxEnabled} 
              onToggle={handleSfxToggle} 
              color={colors.icon.purple}
          />
          <View style={{ height: 1, backgroundColor: colors.subtext + '15', marginLeft: 44 }} />
          <SettingRow 
              icon={ICONS.bell} 
              label="Daily Reminders" 
              value={notificationsEnabled} 
              onToggle={handleNotificationsToggle} 
              color={colors.icon.red}
          />
          <View style={{ height: 1, backgroundColor: colors.subtext + '15', marginLeft: 44 }} />
           <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.text + '10', alignItems: 'center', justifyContent: 'center' }}>
                  <Svg width={18} height={18} viewBox="0 0 24 24"><Path d={ICONS.moon} fill={colors.text} /></Svg>
                  </View>
                  <Text style={{ fontSize: 16, color: colors.text, fontWeight: '500' }}>Theme</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.subtext + '20', borderRadius: 8, padding: 2 }}>
                  {['system', 'light', 'dark'].map((t) => (
                      <TouchableOpacity 
                          key={t}
                          onPress={() => {
                              updateSettings({ theme: t });
                              safeHaptics.selectionAsync();
                          }}
                          style={{ 
                              paddingHorizontal: 8, 
                              paddingVertical: 4, 
                              borderRadius: 6, 
                              backgroundColor: (profile?.settings?.theme || 'system') === t ? colors.tileBg : 'transparent',
                              ...(Platform.OS === 'web' ? {
                                boxShadow: (profile?.settings?.theme || 'system') === t ? '0 1px 2px 0 rgba(0,0,0,0.1)' : 'none',
                              } : {
                                shadowColor: (profile?.settings?.theme || 'system') === t ? '#000' : 'transparent',
                                shadowOpacity: (profile?.settings?.theme || 'system') === t ? 0.1 : 0,
                                shadowRadius: 2,
                              })
                          }}
                      >
                          <Text style={{ 
                              fontSize: 12, 
                              fontWeight: '600', 
                              color: (profile?.settings?.theme || 'system') === t ? colors.text : colors.subtext,
                              textTransform: 'capitalize'
                          }}>
                              {t}
                          </Text>
                      </TouchableOpacity>
                  ))}
              </View>
          </View>
        </View>
      </GlassCard>

      {/* Account Info */}
      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 12 }}>Account</Text>
      <GlassCard style={{ marginBottom: 24, paddingVertical: 8 }}>
        <View style={{ paddingHorizontal: 24, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
            <Text style={{ color: colors.subtext }}>Email</Text>
            <Text style={{ color: colors.text, fontWeight: '500', flex: 1, textAlign: 'right' }} numberOfLines={1}>{profile?.email}</Text>
        </View>
        <View style={{ height: 1, backgroundColor: colors.subtext + '15' }} />
        <View style={{ paddingHorizontal: 24, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
            <Text style={{ color: colors.subtext }}>Member Since</Text>
            <Text style={{ color: colors.text, fontWeight: '500', flex: 1, textAlign: 'right' }}>{new Date(profile?.lastLogin?.toDate?.() || Date.now()).toLocaleDateString()}</Text>
        </View>
         <View style={{ height: 1, backgroundColor: colors.subtext + '15' }} />
         {/* TODO PRODUCTION: Remove this "Reset Statistics" button and resetStats from context before production. */}
         <TouchableOpacity onPress={resetStats} style={{ paddingHorizontal: 24, paddingVertical: 12 }}>
            <Text style={{ color: colors.icon.red, fontWeight: '500' }}>Reset Statistics</Text>
         </TouchableOpacity>
      </GlassCard>

      <TouchableOpacity 
        onPress={logout} 
        style={{ 
          alignItems: 'center', 
          backgroundColor: colors.tileBg,
          paddingVertical: 16,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: colors.subtext + '30'
        }}>
        <Text style={{ color: colors.icon.red, fontWeight: '700', fontSize: 16 }}>Log Out</Text>
      </TouchableOpacity>
      
      <Text style={{ textAlign: 'center', marginTop: 24, color: colors.subtext, fontSize: 12 }}>Version 1.2.0 • StressBuster AI</Text>
    </Animated.ScrollView>
    </GradientBackground>
  );
};

// -----------  GAME WRAPPERS  -----------
const GameWrapper = ({ onBack, Component }) => {
  const { colors } = React.useContext(ThemeContext);
  const { updateTokens, profile } = React.useContext(AuthContext);
  const sfxEnabled = profile?.settings?.sfx ?? true;
  return (
    <>
      <BackButton onPress={onBack} />
      <Component onBack={onBack} colors={colors} updateTokens={updateTokens} sfxEnabled={sfxEnabled} />
    </>
  );
};

const MemoryGameWrapper = ({ onBack }) => <GameWrapper onBack={onBack} Component={MemoryGame} />;
const BubbleGameWrapper = ({ onBack }) => <GameWrapper onBack={onBack} Component={BubbleGame} />;
const SwitchGameWrapper = ({ onBack }) => <GameWrapper onBack={onBack} Component={SwitchGame} />;
const ColorGameWrapper = ({ onBack }) => <GameWrapper onBack={onBack} Component={ColorGame} />;
const GridGameWrapper = ({ onBack }) => <GameWrapper onBack={onBack} Component={GridGame} />;
const FortuneGameWrapper = ({ onBack }) => <GameWrapper onBack={onBack} Component={FortuneGame} />;
const SpinWheelWrapper = ({ onBack }) => <GameWrapper onBack={onBack} Component={SpinWheel} />;
const TapCounterWrapper = ({ onBack }) => <GameWrapper onBack={onBack} Component={TapCounter} />;
const BreathingExerciseWrapper = ({ onBack }) => <GameWrapper onBack={onBack} Component={BreathingExercise} />;
const NumberGuesserWrapper = ({ onBack }) => <GameWrapper onBack={onBack} Component={NumberGuesser} />;
const SimonSaysWrapper = ({ onBack }) => <GameWrapper onBack={onBack} Component={SimonSays} />;
const ReflexGameWrapper = ({ onBack }) => <GameWrapper onBack={onBack} Component={ReflexGame} />;
const PuzzleSliderWrapper = ({ onBack }) => <GameWrapper onBack={onBack} Component={PuzzleSlider} />;
const WordChainWrapper = ({ onBack }) => <GameWrapper onBack={onBack} Component={WordChain} />;
const MathBlitzWrapper = ({ onBack }) => <GameWrapper onBack={onBack} Component={MathBlitz} />;
const ColorMatchWrapper = ({ onBack }) => <GameWrapper onBack={onBack} Component={ColorMatch} />;
const SpeedTapWrapper = ({ onBack }) => <GameWrapper onBack={onBack} Component={SpeedTap} />;
const BalanceGameWrapper = ({ onBack }) => <GameWrapper onBack={onBack} Component={BalanceGame} />;
const MandalaWrapper = ({ onBack }) => <GameWrapper onBack={onBack} Component={MandalaDraw} />;
const MemoryMatrixWrapper = ({ onBack }) => <GameWrapper onBack={onBack} Component={MemoryMatrix} />;
const FocusHoldWrapper = ({ onBack }) => <GameWrapper onBack={onBack} Component={FocusHold} />;
const EmojiCatchWrapper = ({ onBack }) => <GameWrapper onBack={onBack} Component={EmojiCatch} />;

// Lazy screen loading fallback
const ScreenFallback = () => {
  const { colors } = React.useContext(ThemeContext);
  return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.screenBg }}><ActivityIndicator size="large" color={colors.accent} /><Text style={{ marginTop: 10, color: colors.subtext }}>Loading…</Text></View>;
};

const SoundScreenWrapper = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { profile } = React.useContext(AuthContext);
  const sfxEnabled = profile?.settings?.sfx ?? true;
  return (
    <>
      <BackButton onPress={onBack} />
      <Suspense fallback={<ScreenFallback />}>
        <LazySoundScreen onBack={onBack} colors={colors} sfxEnabled={sfxEnabled} />
      </Suspense>
    </>
  );
};

const TimerScreenWrapper = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { profile } = React.useContext(AuthContext);
  const sfxEnabled = profile?.settings?.sfx ?? true;
  return (
    <>
      <BackButton onPress={onBack} />
      <Suspense fallback={<ScreenFallback />}>
        <LazyTimerScreen onBack={onBack} colors={colors} sfxEnabled={sfxEnabled} />
      </Suspense>
    </>
  );
};

const QuoteScreenWrapper = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { profile } = React.useContext(AuthContext);
  const sfxEnabled = profile?.settings?.sfx ?? true;
  return (
    <>
      <BackButton onPress={onBack} />
      <Suspense fallback={<ScreenFallback />}>
        <LazyQuoteScreen onBack={onBack} colors={colors} sfxEnabled={sfxEnabled} />
      </Suspense>
    </>
  );
};

const AIChatScreenWrapper = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { profile, updateTokens, user, setProfileLocally } = React.useContext(AuthContext);
  const sfxEnabled = profile?.settings?.sfx ?? true;
  return (
    <Suspense fallback={<ScreenFallback />}>
      <LazyAIChatScreen
        onBack={onBack}
        colors={colors}
        profile={profile}
        updateTokens={updateTokens}
        user={user}
        setProfileLocally={setProfileLocally}
        db={db}
        firebaseConfig={firebaseConfig}
        sfxEnabled={sfxEnabled}
      />
    </Suspense>
  );
};

const JournalScreenWrapper = ({ onBack }) => {
  const { colors } = React.useContext(ThemeContext);
  const { user, setProfileLocally, profile } = React.useContext(AuthContext);
  const sfxEnabled = profile?.settings?.sfx ?? true;
  return (
    <>
      <BackButton onPress={onBack} />
      <JournalScreen
        onBack={onBack}
        colors={colors}
        user={user}
        db={db}
        firebaseConfig={firebaseConfig}
        setProfileLocally={setProfileLocally}
        sfxEnabled={sfxEnabled}
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
      <Suspense fallback={<ScreenFallback />}>
        <LazyInsightsScreen onBack={onBack} colors={colors} profile={profile} />
      </Suspense>
    </>
  );
};

// -----------  MAIN LAYOUT  -----------
const TabButton = ({ tab, isActive, onPress, colors, iconPath }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const useNative = Platform.OS !== 'web';
    const onPressIn = () => Animated.spring(scaleAnim, { toValue: 0.9, useNativeDriver: useNative }).start();
    const onPressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: useNative }).start();
    return (
        <TouchableOpacity onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} activeOpacity={1} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Animated.View style={{ alignItems: 'center', transform: [{ scale: scaleAnim }], backgroundColor: isActive ? colors.accent + '15' : 'transparent', paddingVertical: 6, paddingHorizontal: 20, borderRadius: 20 }}>
                <Svg width={24} height={24} viewBox="0 0 24 24"><Path d={iconPath} fill={isActive ? colors.tabActive : colors.tabInactive} /></Svg>
                <Text style={{ fontSize: 10, color: isActive ? colors.tabActive : colors.tabInactive, fontWeight: isActive ? '700' : '500', marginTop: 2 }}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
            </Animated.View>
        </TouchableOpacity>
    );
};

function MainLayout() {
  const { user, loading, profile, updateTokens, setProfileLocally } = React.useContext(AuthContext);
  const { colors } = React.useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('home');
  const [screen, setScreen] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const insets = useSafeAreaInsets();

  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.screenBg }}><ActivityIndicator size="large" color={colors.accent} /><Text style={{ marginTop: 10, color: colors.subtext }}>Loading Zen…</Text></View>;
  }
  if (!user) {
    return <AuthScreen auth={auth} db={db} />;
  }

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
    if (screen === 'game-mandala') return <MandalaWrapper onBack={() => setScreen(null)} />;
    if (screen === 'game-matrix') return <MemoryMatrixWrapper onBack={() => setScreen(null)} />;
    if (screen === 'game-focus') return <FocusHoldWrapper onBack={() => setScreen(null)} />;
    if (screen === 'game-emoji') return <EmojiCatchWrapper onBack={() => setScreen(null)} />;
    if (screen === 'ai-chat') return <AIChatScreenWrapper onBack={() => setScreen(null)} />;
    if (screen === 'journal') return <JournalScreenWrapper onBack={() => setScreen(null)} />;
    if (screen === 'insights') return <InsightsScreenWrapper onBack={() => setScreen(null)} />;
    return <View style={{ flex: 1, paddingTop: insets.top + 20 }}><BackButton onPress={() => setScreen(null)} /></View>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.screenBg }}>
      <View style={{ flex: 1 }}>
        {activeTab === 'home' && <HomeTab navigateTo={setScreen} openChat={() => setIsChatOpen(true)} />}
        {activeTab === 'games' && <GamesTab navigateTo={setScreen} />}
        {activeTab === 'profile' && <ProfileTab />}
      </View>
      
      <BlurView 
        intensity={90} 
        tint={colors.blurTint} 
        style={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          borderTopWidth: 0.5, 
          borderColor: colors.subtext + '20',
          overflow: 'hidden' 
        }}
      >
        <View style={{ 
          flexDirection: 'row', 
          paddingBottom: insets.bottom + 8, 
          paddingTop: 12, 
          paddingHorizontal: 16, 
          backgroundColor: colors.tabBar + '80' 
        }}>
          {['home', 'games', 'profile'].map(tab => (
            <TabButton 
                key={tab} 
                tab={tab} 
                isActive={activeTab === tab} 
                onPress={() => setActiveTab(tab)} 
                colors={colors}
                iconPath={ICONS[tab]}
            />
          ))}
        </View>
      </BlurView>

      {/* FloatingChat removed as per user request */}
    </View>
  );
}

const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const { profile } = React.useContext(AuthContext);
  const userTheme = profile?.settings?.theme || 'system';
  
  let activeTheme = systemScheme || 'light';
  if (userTheme === 'light') activeTheme = 'light';
  if (userTheme === 'dark') activeTheme = 'dark';
  
  return (
    <ThemeContext.Provider value={{ theme: activeTheme, colors: THEME_COLORS[activeTheme], userTheme }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: THEME_COLORS[activeTheme].screenBg }} edges={['left', 'right']}>
        {children}
      </SafeAreaView>
    </ThemeContext.Provider>
  );
};

const DevWrapper = ({ children }) => {
    const { user, profile } = React.useContext(AuthContext);
    return (
        <DevProvider user={user} profile={profile}>
            {children}
        </DevProvider>
    );
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (__DEV__) console.error('ErrorBoundary:', error?.message, errorInfo?.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Error Loading App</Text>
          <Text style={{ fontSize: 14, color: '#666', marginBottom: 20 }}>{this.state.error?.message || 'Unknown error'}</Text>
          <Text style={{ fontSize: 12, color: '#999' }}>{this.state.error?.stack}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  try {
    return (
      <ErrorBoundary>
        <AuthProvider>
          <DevWrapper>
            <ThemeProvider>
              <MainLayout />
              <DevOverlay />
            </ThemeProvider>
          </DevWrapper>
        </AuthProvider>
      </ErrorBoundary>
    );
  } catch (error) {
    if (__DEV__) console.error('App render error:', error?.message);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Failed to render app</Text>
        <Text style={{ fontSize: 14, color: '#666' }}>{error?.message || String(error)}</Text>
      </View>
    );
  }
}
