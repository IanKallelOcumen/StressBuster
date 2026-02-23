import Constants from 'expo-constants';
import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    updateProfile,
    sendEmailVerification
} from 'firebase/auth';
import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { ZEN_SIGNUP_TOKENS } from '../../utils/zenTokens';
import {
    ActivityIndicator,
    Alert,
    Animated,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions
} from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import DevOverlay from '../dev/DevOverlay';
import GradientBackground from '../ui/GradientBackground';
import { Svg, Path, Circle } from 'react-native-svg';

// Constants for configuration
const { firebaseAppId } = Constants.expoConfig.extra;

/** Map Firebase Auth error codes to user-friendly messages */
function getAuthErrorMessage(code, fallback = 'Something went wrong. Please try again.') {
  const messages = {
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/user-disabled': 'This account has been disabled. Contact support.',
    'auth/user-not-found': 'No account found with this email. Check the address or sign up.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Incorrect email or password. Please check and try again.',
    'auth/email-already-in-use': 'This email is already registered. Try signing in or use another email.',
    'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
    'auth/operation-not-allowed': 'Sign-in method is not enabled. Contact support.',
    'auth/network-request-failed': 'Network error. Check your connection and try again.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/requires-recent-login': 'Please sign out and sign in again to continue.',
    'auth/invalid-verification-code': 'Invalid or expired code. Please try again.',
    'auth/invalid-verification-id': 'Verification failed. Please try again.',
    'auth/expired-action-code': 'Link has expired. Request a new one.',
    'auth/invalid-action-code': 'Link is invalid or already used. Request a new one.',
    'auth/missing-email': 'Please enter your email address.',
    'auth/missing-password': 'Please enter your password.',
  };
  return (code && messages[code]) || fallback;
}

// Custom Input Component with enhanced styling
const AuthInput = ({ 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry, 
  keyboardType, 
  autoCapitalize,
  maxLength,
  style,
  colors 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { width } = useWindowDimensions();
  
  // Responsive width calculation (mobile-first)
  const inputWidth = Math.min(width - 40, 400); // Cap at 400px, full width minus padding on mobile

  // Build style object conditionally to avoid shadow props on web
  const dynamicStyle = {
    width: '100%',
    minWidth: 320, // Requirement: Minimum 320px width
    maxWidth: 400,
    backgroundColor: colors.glassBg, // Use theme glass background
    borderColor: isFocused ? colors.accent : '#E0E0E0', // Requirement: Focus state color & #E0E0E0 default
  };
  
  // Add shadow styles based on platform
  if (Platform.OS === 'web') {
    dynamicStyle.boxShadow = isFocused ? `0 2px 8px 0 ${colors.accent}33` : '0 2px 4px 0 rgba(0,0,0,0.05)';
  } else {
    dynamicStyle.shadowColor = isFocused ? colors.accent : '#000'; // Requirement: Subtle box-shadow transition
    dynamicStyle.shadowOpacity = isFocused ? 0.2 : 0.05;
    dynamicStyle.shadowRadius = isFocused ? 8 : 4;
  }

  return (
    <View style={[
      styles.inputContainer,
      dynamicStyle,
      style
    ]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.subtext}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        maxLength={maxLength}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...(Platform.OS === 'web' && {
          // Web-specific props for proper form handling
          name: secureTextEntry ? 'password' : placeholder.toLowerCase().replace(/\s+/g, ''),
          autoComplete: secureTextEntry ? 'current-password' : (keyboardType === 'email-address' ? 'email' : 'off'),
          type: secureTextEntry ? 'password' : (keyboardType === 'email-address' ? 'email' : 'text')
        })}
        style={[
          styles.inputField,
          { 
            color: colors.text,
            // Requirement: Min font size 16px
          }
        ]}
      />
    </View>
  );
};

const AuthScreen = ({ auth, db }) => {
  const { colors } = React.useContext(ThemeContext);
  const [isLogin, setIsLogin] = useState(true);
  const [isReset, setIsReset] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');
  const [bDay, setBDay] = useState('');
  const [bMonth, setBMonth] = useState('');
  const [bYear, setBYear] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [usePhone, setUsePhone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Animation Refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  
  const { width } = useWindowDimensions();

  // Task Progress Counter (Diagnostic)
  const [taskProgress, setTaskProgress] = useState(0);
  
  useEffect(() => {
    console.log("AuthScreen Mounted");
    // Simulate Task 0 Completion: "Initialization"
    const timer = setTimeout(() => {
        setTaskProgress(1);
        console.log("Task 0 Completed: Initialization & Core Rendering");
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Disable useNativeDriver on web to avoid warnings
    const useNative = Platform.OS !== 'web';
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: useNative }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: useNative }),
      Animated.spring(logoScale, { toValue: 1, friction: 8, tension: 40, useNativeDriver: useNative })
    ]).start();
  }, [fadeAnim, slideAnim, logoScale]);
  
  const handleButtonPressIn = () => {
    const useNative = Platform.OS !== 'web';
    Animated.spring(buttonScale, { toValue: 0.96, friction: 3, tension: 200, useNativeDriver: useNative }).start();
  };
  
  const handleButtonPressOut = () => {
    const useNative = Platform.OS !== 'web';
    Animated.spring(buttonScale, { toValue: 1, friction: 3, tension: 200, useNativeDriver: useNative }).start();
  };
  
  const isValidDate = (d, m, y) => {
    const day = parseInt(d, 10), month = parseInt(m, 10), year = parseInt(y, 10);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
    if (year < 1900 || year > new Date().getFullYear()) return false;
    if (month < 1 || month > 12) return false;
    const daysInMonth = new Date(year, month, 0).getDate();
    return day >= 1 && day <= daysInMonth;
  };

  const isValidEmail = e => {
    // 1. Basic Format Check
    if (!/\S+@\S+\.\S+/.test(e)) {
        Alert.alert("Invalid Email", "Please enter a valid email address.");
        return false;
    }
    
    // REMOVED: Domain whitelist check - was too restrictive and preventing login
    // Users can now use any email domain
    return true;
  };

  const isValidPhone = p => /^\+?[1-9]\d{1,14}$/.test(p);

  const handleAuth = async () => {
    setFormError('');
    setLoading(true);
    try {
      if (usePhone) {
        if (!isValidPhone(phoneNumber)) {
          Alert.alert("Invalid Phone", "Please enter a valid phone number with country code (e.g. +1234567890).");
          setLoading(false);
          return;
        }
        // In a real app, integrate Twilio/Firebase Auth Phone here
        Alert.alert("SMS Verification", "SMS code sent to " + phoneNumber + " (Simulated). Please verify to continue.");
        setLoading(false);
        return;
      }

      const trimmedEmail = (email || '').trim();
      const trimmedPass = (pass || '').trim();

      if (!trimmedEmail) {
        setFormError('Please enter your email address.');
        Alert.alert("Email required", "Please enter your email address.");
        setLoading(false);
        return;
      }
      if (!isValidEmail(trimmedEmail)) {
        setFormError('Please enter a valid email address.');
        setLoading(false);
        return;
      }

      if (isReset) {
        try {
          await sendPasswordResetEmail(auth, trimmedEmail);
          setFormError('');
          Alert.alert("Email Sent", "Check your inbox to reset your password. If you don't see it, check spam.");
          setIsReset(false);
          setIsLogin(true);
        } catch (resetErr) {
          const msg = getAuthErrorMessage(resetErr?.code, resetErr?.message);
          setFormError(msg);
          Alert.alert("Reset failed", msg);
        }
        setLoading(false);
        return;
      }

      if (isLogin) {
        if (!trimmedPass) {
          setFormError('Please enter your password.');
          Alert.alert("Password required", "Please enter your password.");
          setLoading(false);
          return;
        }
        try {
          await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPass);
          setFormError('');
        } catch (loginErr) {
          const msg = getAuthErrorMessage(loginErr?.code, loginErr?.message);
          setFormError(msg);
          Alert.alert("Sign in failed", msg);
        }
        setLoading(false);
        return;
      }

      // Sign Up
      if (trimmedPass.length < 6) {
        setFormError('Password must be at least 6 characters.');
        Alert.alert("Password too short", "Password must be at least 6 characters.");
        setLoading(false);
        return;
      }
      if (!name || (name || '').trim().length < 2) {
        setFormError('Please enter your name (at least 2 characters).');
        Alert.alert("Name required", "Please enter your name (at least 2 characters).");
        setLoading(false);
        return;
      }
      if (!isValidDate(bDay, bMonth, bYear)) {
        setFormError('Please enter a valid birth date (DD MM YYYY).');
        Alert.alert("Invalid date", "Please enter a valid birth date (DD MM YYYY).");
        setLoading(false);
        return;
      }
      const birthdayStr = `${bYear}-${bMonth.padStart(2, '0')}-${bDay.padStart(2, '0')}`;
      try {
        const { user: u } = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPass);
        const profileData = {
          name: (name || '').trim(),
          email: trimmedEmail,
          birthday: birthdayStr,
          zenTokens: ZEN_SIGNUP_TOKENS,
          streak: 0,
          lastLogin: new Date("2000-01-01"),
          settings: { sfx: true },
          memberSince: serverTimestamp(),
          isVerified: false
        };
        await Promise.all([
          updateProfile(u, { displayName: (name || '').trim() }),
          setDoc(doc(db, `artifacts/${firebaseAppId}/users/${u.uid}/data/profile`), profileData)
        ]);
        sendEmailVerification(u).catch(() => {}); // fire-and-forget so we don't block
        setFormError('');
        Alert.alert("Account Created", "Please verify your email to unlock all features.");
      } catch (signUpErr) {
        const msg = getAuthErrorMessage(signUpErr?.code, signUpErr?.message);
        setFormError(msg);
        Alert.alert("Sign up failed", msg);
      }
    } catch (e) {
      const msg = getAuthErrorMessage(e?.code, e?.message);
      setFormError(msg);
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  const horizontalPad = Math.min(40, Math.max(15, 30));

  return (
    <GradientBackground colors={colors}>
      <View style={{ position: 'absolute', top: 10, left: 10, zIndex: 999, backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 8 }}>
        <Text style={{ color: '#4ade80', fontWeight: 'bold' }}>
          {taskProgress >= 1 ? "✅ Task 0: Complete" : "⏳ Task 0: Initializing..."}
        </Text>
      </View>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: horizontalPad, paddingVertical: 20 }}
      >
        <DevOverlay 
          colors={colors} 
          auth={auth} 
          db={db}
          onBypassLogin={async ({ email: devEmail, password: devPass }) => {
            if (!auth || !devEmail || !devPass) {
              Alert.alert("Dev Login", "Email and password required.");
              return;
            }
            try {
              await signInWithEmailAndPassword(auth, devEmail, devPass);
              // Auth state will update and app will navigate to main
            } catch (e) {
              const msg = e.code === 'auth/invalid-credential' || e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password'
                ? "Invalid email or password."
                : (e.message || "Login failed.");
              Alert.alert("Dev Login Failed", msg);
            }
          }}
        />

        <Animated.ScrollView 
          contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', minHeight: '100%', width: '100%', maxWidth: 500 }} 
          showsVerticalScrollIndicator={false}
          style={{ opacity: fadeAnim, width: '100%' }}
        >
          <Animated.View style={{ transform: [{ translateY: slideAnim }, { scale: logoScale }], alignItems: 'center', width: '100%' }}>
            <Text style={{ fontSize: 32, fontWeight: 'bold', color: colors.text, textAlign: 'center', marginBottom: 8 }}>Stress Buster</Text>
            <Text style={{ textAlign: 'center', color: colors.subtext, marginBottom: 24, fontSize: 14 }}>
              {isReset ? "Reset Password" : (isLogin ? "Welcome Back" : "Create Account")}
            </Text>
          </Animated.View>

          {Platform.OS === 'web' ? (
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleAuth();
              }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
            >
              <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], width: '100%', alignItems: 'center', gap: 16 }}>
                {/* Registration specific fields */}
                {!isLogin && !isReset && (
                  <>
                    <AuthInput 
                      placeholder="Nickname" 
                      value={name} 
                      onChangeText={(v) => { setFormError(''); setName(v); }} 
                      colors={colors}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', gap: 8, minWidth: 320, maxWidth: 400 }}>
                      <View style={{ flex: 1 }}>
                        <AuthInput 
                          placeholder="DD" 
                          keyboardType="numeric" 
                          maxLength={2} 
                          value={bDay} 
                          onChangeText={setBDay} 
                          colors={colors}
                          style={{ minWidth: 0, textAlign: 'center' }}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <AuthInput 
                          placeholder="MM" 
                          keyboardType="numeric" 
                          maxLength={2} 
                          value={bMonth} 
                          onChangeText={setBMonth} 
                          colors={colors}
                          style={{ minWidth: 0, textAlign: 'center' }}
                        />
                      </View>
                      <View style={{ flex: 1.2 }}>
                        <AuthInput 
                          placeholder="YYYY" 
                          keyboardType="numeric" 
                          maxLength={4} 
                          value={bYear} 
                          onChangeText={setBYear} 
                          colors={colors}
                          style={{ minWidth: 0, textAlign: 'center' }}
                        />
                      </View>
                    </View>
                    
                    {/* Method Toggle for Sign Up */}
                    <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center', marginVertical: 4 }}>
                        <TouchableOpacity onPress={() => setUsePhone(false)} style={{ padding: 6, borderBottomWidth: !usePhone ? 2 : 0, borderColor: colors.accent }}>
                            <Text style={{ color: !usePhone ? colors.text : colors.subtext, fontWeight: !usePhone ? 'bold' : 'normal' }}>Email</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setUsePhone(true)} style={{ padding: 6, borderBottomWidth: usePhone ? 2 : 0, borderColor: colors.accent }}>
                            <Text style={{ color: usePhone ? colors.text : colors.subtext, fontWeight: usePhone ? 'bold' : 'normal' }}>Phone</Text>
                        </TouchableOpacity>
                    </View>
                  </>
                )}

                {/* Email/Phone Input Field */}
                {usePhone ? (
                    <AuthInput 
                      placeholder="Phone Number (+1...)" 
                      value={phoneNumber} 
                      onChangeText={setPhoneNumber} 
                      keyboardType="phone-pad"
                      colors={colors}
                    />
                ) : (
                    <AuthInput 
                      placeholder="Email" 
                      value={email} 
                      onChangeText={(v) => { setFormError(''); setEmail(v); }} 
                      autoCapitalize='none' 
                      colors={colors}
                      keyboardType="email-address"
                    />
                )}
                
                {!isReset && (
                  <AuthInput 
                    placeholder="Password" 
                    value={pass} 
                    onChangeText={(v) => { setFormError(''); setPass(v); }} 
                    secureTextEntry 
                    colors={colors}
                  />
                )}

                <Animated.View style={{ transform: [{ scale: buttonScale }], width: '100%', alignItems: 'center', marginTop: 8 }}>
                  <TouchableOpacity 
                    onPress={handleAuth} 
                    onPressIn={handleButtonPressIn} 
                    onPressOut={handleButtonPressOut}
                    activeOpacity={1}
                    style={{ 
                      backgroundColor: colors.accent, 
                      padding: 16, 
                      borderRadius: 20, 
                      alignItems: 'center', 
                      width: '100%',
                      minWidth: 320,
                      maxWidth: 400,
                      minHeight: 56
                    }}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                        {isReset ? "Send Link" : (isLogin ? "Log In" : "Sign Up")}
                      </Text>
                    )}
                  </TouchableOpacity>
                </Animated.View>
                {formError ? (
                  <Text style={{ color: colors.icon?.red || '#ef4444', fontSize: 13, marginTop: 10, textAlign: 'center', paddingHorizontal: 16 }}>
                    {formError}
                  </Text>
                ) : null}
              </Animated.View>
            </form>
          ) : (
            <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], width: '100%', alignItems: 'center', gap: 16 }}>
              {/* Registration specific fields */}
              {!isLogin && !isReset && (
                <>
                  <AuthInput 
                    placeholder="Nickname" 
                    value={name} 
                    onChangeText={(v) => { setFormError(''); setName(v); }} 
                    colors={colors}
                  />
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', gap: 8, minWidth: 320, maxWidth: 400 }}>
                    <View style={{ flex: 1 }}>
                      <AuthInput 
                        placeholder="DD" 
                        keyboardType="numeric" 
                        maxLength={2} 
                        value={bDay} 
                        onChangeText={setBDay} 
                        colors={colors}
                        style={{ minWidth: 0, textAlign: 'center' }}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <AuthInput 
                        placeholder="MM" 
                        keyboardType="numeric" 
                        maxLength={2} 
                        value={bMonth} 
                        onChangeText={setBMonth} 
                        colors={colors}
                        style={{ minWidth: 0, textAlign: 'center' }}
                      />
                    </View>
                    <View style={{ flex: 1.2 }}>
                      <AuthInput 
                        placeholder="YYYY" 
                        keyboardType="numeric" 
                        maxLength={4} 
                        value={bYear} 
                        onChangeText={setBYear} 
                        colors={colors}
                        style={{ minWidth: 0, textAlign: 'center' }}
                      />
                    </View>
                  </View>
                  
                  {/* Method Toggle for Sign Up */}
                  <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center', marginVertical: 4 }}>
                      <TouchableOpacity onPress={() => setUsePhone(false)} style={{ padding: 6, borderBottomWidth: !usePhone ? 2 : 0, borderColor: colors.accent }}>
                          <Text style={{ color: !usePhone ? colors.text : colors.subtext, fontWeight: !usePhone ? 'bold' : 'normal' }}>Email</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setUsePhone(true)} style={{ padding: 6, borderBottomWidth: usePhone ? 2 : 0, borderColor: colors.accent }}>
                          <Text style={{ color: usePhone ? colors.text : colors.subtext, fontWeight: usePhone ? 'bold' : 'normal' }}>Phone</Text>
                      </TouchableOpacity>
                  </View>
                </>
              )}

              {/* Email/Phone Input Field */}
              {usePhone ? (
                  <AuthInput 
                    placeholder="Phone Number (+1...)" 
                    value={phoneNumber} 
                    onChangeText={setPhoneNumber} 
                    keyboardType="phone-pad"
                    colors={colors}
                  />
              ) : (
                  <AuthInput 
                    placeholder="Email" 
                    value={email} 
                    onChangeText={(v) => { setFormError(''); setEmail(v); }} 
                    autoCapitalize='none' 
                    colors={colors}
                    keyboardType="email-address"
                  />
              )}
              
              {!isReset && (
                <AuthInput 
                  placeholder="Password" 
                  value={pass} 
                  onChangeText={(v) => { setFormError(''); setPass(v); }} 
                  secureTextEntry 
                  colors={colors}
                />
              )}

              <Animated.View style={{ transform: [{ scale: buttonScale }], width: '100%', alignItems: 'center', marginTop: 8 }}>
                <TouchableOpacity 
                  onPress={handleAuth} 
                  onPressIn={handleButtonPressIn} 
                  onPressOut={handleButtonPressOut}
                  activeOpacity={1}
                  style={{ 
                    backgroundColor: colors.accent, 
                    padding: 16, 
                    borderRadius: 20, 
                    alignItems: 'center', 
                    width: '100%',
                    minWidth: 320,
                    maxWidth: 400,
                    // Requirement: 44x44px min touch target (padding 16 ensures > 44px height)
                    minHeight: 56
                  }}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                      {isReset ? "Send Link" : (isLogin ? "Log In" : "Sign Up")}
                    </Text>
                  )}
                </TouchableOpacity>
              </Animated.View>
              {formError ? (
                <Text style={{ color: colors.icon?.red || '#ef4444', fontSize: 13, marginTop: 10, textAlign: 'center', paddingHorizontal: 16 }}>
                  {formError}
                </Text>
              ) : null}
            </Animated.View>
          )}
            
            {/* Phone/Email Toggle for Registration - REMOVED (now tabs) */}
            
            <View style={{ marginTop: 24, width: '100%', alignItems: 'center', minWidth: 320, maxWidth: 400 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 20 }}>
                <View style={{ flex: 1, height: 1, backgroundColor: colors.subtext + '30' }} />
                <Text style={{ marginHorizontal: 10, color: colors.subtext, fontSize: 12 }}>OR CONTINUE WITH</Text>
                <View style={{ flex: 1, height: 1, backgroundColor: colors.subtext + '30' }} />
              </View>
              <View style={{ flexDirection: 'row', gap: 16 }}>
                <TouchableOpacity 
                  onPress={async () => {
                    if (Platform.OS === 'web') {
                      try {
                        setLoading(true);
                        const provider = new GoogleAuthProvider();
                        const result = await signInWithPopup(auth, provider);
                        const user = result.user;
                        setLoading(false);
                        const userRef = doc(db, `artifacts/${firebaseAppId}/users/${user.uid}/data/profile`);
                        getDoc(userRef).then(snap => {
                          if (!snap.exists()) {
                            return setDoc(userRef, {
                              name: user.displayName || 'User',
                              email: user.email,
                              zenTokens: ZEN_SIGNUP_TOKENS,
                              streak: 0,
                              lastLogin: new Date("2000-01-01"),
                              settings: { sfx: true },
                              memberSince: serverTimestamp(),
                              isVerified: user.emailVerified
                            });
                          }
                        }).catch(() => {});
                      } catch (error) {
                        setLoading(false);
                        Alert.alert("Google Sign-In Error", error.message || "Failed to sign in with Google.");
                      }
                    } else {
                      Alert.alert("Google Login", "Google Sign-In is currently only available on web. Please use email/password login.");
                    }
                  }}
                  style={{
                    width: 50, height: 50, borderRadius: 25, backgroundColor: colors.tileBg,
                    justifyContent: 'center', alignItems: 'center',
                    borderWidth: 1, borderColor: colors.text + '10'
                  }}
                >
                  <Svg width={24} height={24} viewBox="0 0 24 24">
                    <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </Svg>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => {
                    if (Platform.OS === 'web') {
                      Alert.alert("Apple Sign-In", "Apple Sign-In requires additional configuration. Please use email/password or Google sign-in for now.");
                    } else {
                      Alert.alert("Apple Login", "Apple Sign-In requires Apple Developer Account configuration.");
                    }
                  }}
                  style={{
                    width: 50, height: 50, borderRadius: 25, backgroundColor: colors.tileBg,
                    justifyContent: 'center', alignItems: 'center',
                    borderWidth: 1, borderColor: colors.text + '10'
                  }}
                >
                  <Svg width={24} height={24} viewBox="0 0 24 24" fill={colors.text}>
                    <Path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </Svg>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ marginTop: 20, alignItems: 'center', gap: 12 }}>
              {isLogin && !isReset && (
                <TouchableOpacity onPress={() => setIsReset(true)} style={{ padding: 8 }}>
                  <Text style={{ color: colors.accent, fontSize: 14 }}>Forgot Password?</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                onPress={() => { setIsReset(false); setIsLogin(!isLogin); }}
                style={{ padding: 8 }}
              >
                <Text style={{ color: colors.subtext, fontSize: 14 }}>
                  {isReset ? "Back to Login" : (isLogin ? "Create Account" : "Back to Login")}
                </Text>
              </TouchableOpacity>
            </View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    // Requirement: 8px border-radius
    borderRadius: 8,
    // Requirement: 1px solid border
    borderWidth: 1,
    // Requirement: 48px min height
    minHeight: 48,
    justifyContent: 'center',
    marginBottom: 0,
    overflow: 'hidden',
  },
  inputField: {
    // Requirement: 16px horizontal padding, 12px vertical padding
    paddingHorizontal: 16,
    paddingVertical: 12,
    // Requirement: Minimum font size 16px
    fontSize: 16,
    width: '100%',
    height: '100%',
  }
});

export default AuthScreen;
