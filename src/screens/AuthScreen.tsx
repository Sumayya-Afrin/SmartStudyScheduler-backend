// screens/AuthScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { saveToken } from '../utils/storage';
import api from '../services/api';

// ── Themes (mirrors LandingScreen) ───────────────────────────────────────────
const DARK = {
  bg: '#0B0E14',
  surface: '#161B28',
  border: 'rgba(255,255,255,0.07)',
  borderFocus: 'rgba(200,245,102,0.4)',
  accent: '#C8F566',
  accentFg: '#0B0E14',
  text: '#F0F2F8',
  muted: '#6B7390',
  inputBg: '#0F1219',
  placeholder: '#4A5270',
  isDark: true,
};

const LIGHT = {
  bg: '#F7F8FA',
  surface: '#FFFFFF',
  border: 'rgba(0,0,0,0.08)',
  borderFocus: 'rgba(92,158,0,0.5)',
  accent: '#5C9E00',
  accentFg: '#FFFFFF',
  text: '#0F1117',
  muted: '#6B7390',
  inputBg: '#F0F2F6',
  placeholder: '#9199B1',
  isDark: false,
};

// ── Themed Input ──────────────────────────────────────────────────────────────
const ThemedInput = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  rightElement,
  C,
}: any) => {
  const [focused, setFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const onFocus = () => {
    setFocused(true);
    Animated.timing(borderAnim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
  };
  const onBlur = () => {
    setFocused(false);
    Animated.timing(borderAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [C.border, C.borderFocus],
  });

  return (
    <Animated.View style={[styles.inputWrap, { backgroundColor: C.inputBg, borderColor }]}>
      <TextInput
        style={[styles.input, { color: C.text }]}
        placeholder={placeholder}
        placeholderTextColor={C.placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize ?? 'none'}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {rightElement}
    </Animated.View>
  );
};

// ── Toggle ────────────────────────────────────────────────────────────────────
const ThemeToggle = ({ isDark, onToggle, C }: { isDark: boolean; onToggle: () => void; C: typeof DARK }) => {
  const translateX = useRef(new Animated.Value(isDark ? 22 : 0)).current;
  useEffect(() => {
    Animated.spring(translateX, { toValue: isDark ? 22 : 0, useNativeDriver: true, tension: 80, friction: 10 }).start();
  }, [isDark]);

  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.85}
      style={[styles.toggleTrack, {
        backgroundColor: isDark ? 'rgba(200,245,102,0.1)' : 'rgba(92,158,0,0.1)',
        borderColor: isDark ? 'rgba(200,245,102,0.2)' : 'rgba(92,158,0,0.2)',
      }]}
    >
      <Text style={styles.toggleIcon}>☀️</Text>
      <Text style={styles.toggleIcon}>🌙</Text>
      <Animated.View style={[styles.toggleThumb, { backgroundColor: C.accent, transform: [{ translateX }] }]} />
    </TouchableOpacity>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const AuthScreen = ({ navigation }: { navigation: any }) => {
  const [isDark, setIsDark] = useState(false); // matches landing default
  const C = isDark ? DARK : LIGHT;

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { width } = useWindowDimensions();
  const isWide = width >= 640;

  // Fade-in on mount
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }
    if (!isLogin && password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await api.post<{ token: string }>(endpoint, { email, password });
      await saveToken(response.data.token);
      navigation.navigate('MainTabs');
    } catch (error) {
      Alert.alert(isLogin ? 'Login Failed' : 'Registration Failed', 'Please check your details and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const eyeBtn = (show: boolean, toggle: () => void) => (
    <TouchableOpacity onPress={toggle} style={styles.eyeBtn}>
      <Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={20} color={C.muted} />
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: C.bg }]}
    >
      {/* Orbs */}
      <View style={[styles.orbBlue, !isDark && { backgroundColor: 'rgba(92,158,0,0.06)' }]} />
      <View style={[styles.orbGreen, !isDark && { backgroundColor: 'rgba(59,130,246,0.05)' }]} />

      {/* Theme toggle — top right */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Landing')} style={styles.backBtn}>
          <Ionicons name="arrow-back-outline" size={20} color={C.muted} />
          <Text style={[styles.backText, { color: C.muted }]}>Back</Text>
        </TouchableOpacity>
        <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} C={C} />
      </View>

      <Animated.View
        style={[
          styles.card,
          { backgroundColor: C.surface, borderColor: C.border, width: isWide ? 480 : '100%' },
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Logo */}
        <View style={styles.logoRow}>
          <View style={[styles.logoDot, { backgroundColor: C.accent }]} />
          <Text style={[styles.logoText, { color: C.text }]}>FocusFlow</Text>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: C.text }]}>
          {isLogin ? 'Welcome back.' : 'Create your account.'}
        </Text>
        <Text style={[styles.subtitle, { color: C.muted }]}>
          {isLogin
            ? 'Sign in to continue your study journey.'
            : 'Start building smarter study habits today.'}
        </Text>

        {/* Tab switcher */}
        <View style={[styles.tabRow, { backgroundColor: C.inputBg, borderColor: C.border }]}>
          {['Log In', 'Sign Up'].map((label, i) => {
            const active = (i === 0 && isLogin) || (i === 1 && !isLogin);
            return (
              <TouchableOpacity
                key={label}
                style={[styles.tab, active && { backgroundColor: C.accent }]}
                onPress={() => setIsLogin(i === 0)}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, { color: active ? C.accentFg : C.muted }]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Fields */}
        <View style={styles.fields}>
          <ThemedInput
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            C={C}
          />
          <ThemedInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            C={C}
            rightElement={eyeBtn(showPassword, () => setShowPassword(!showPassword))}
          />
          {!isLogin && (
            <ThemedInput
              placeholder="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirm}
              C={C}
              rightElement={eyeBtn(showConfirm, () => setShowConfirm(!showConfirm))}
            />
          )}
        </View>

        {/* Forgot password */}
        {isLogin && (
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotWrap}>
            <Text style={[styles.forgotText, { color: C.accent }]}>Forgot password?</Text>
          </TouchableOpacity>
        )}

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: C.accent,
            shadowColor: C.accent,
          }]}
          onPress={handleSubmit}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          {isLoading
            ? <ActivityIndicator color={C.accentFg} />
            : <Text style={[styles.submitText, { color: C.accentFg }]}>
                {isLogin ? 'Log In →' : 'Create Account →'}
              </Text>
          }
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: C.border }]} />
          <Text style={[styles.dividerText, { color: C.muted }]}>or</Text>
          <View style={[styles.dividerLine, { backgroundColor: C.border }]} />
        </View>

        {/* Google */}
        <TouchableOpacity
          style={[styles.googleBtn, { borderColor: C.border, backgroundColor: C.inputBg }]}
          activeOpacity={0.8}
        >
          <Text style={styles.googleIcon}>G</Text>
          <Text style={[styles.googleText, { color: C.text }]}>Continue with Google</Text>
        </TouchableOpacity>

        {/* Switch mode */}
        <View style={styles.switchRow}>
          <Text style={[styles.switchText, { color: C.muted }]}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
          </Text>
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={[styles.switchLink, { color: C.accent }]}>
              {isLogin ? 'Sign Up' : 'Log In'}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    padding: 24, overflow: 'hidden',
  },
  orbBlue: {
    position: 'absolute', top: -80, right: -120, width: 360, height: 360,
    borderRadius: 180, backgroundColor: 'rgba(91,142,255,0.1)',
  },
  orbGreen: {
    position: 'absolute', bottom: -60, left: -100, width: 280, height: 280,
    borderRadius: 140, backgroundColor: 'rgba(200,245,102,0.07)',
  },
  topBar: {
    position: 'absolute', top: Platform.OS === 'ios' ? 56 : 20, left: 24, right: 24,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    zIndex: 10,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { fontSize: 14 },

  // TOGGLE
  toggleTrack: {
    width: 52, height: 28, borderRadius: 14, borderWidth: 1,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 4, justifyContent: 'space-between',
    position: 'relative',
  },
  toggleIcon: { fontSize: 11, zIndex: 0 },
  toggleThumb: {
    position: 'absolute', left: 3,
    width: 22, height: 22, borderRadius: 11, zIndex: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 3,
  },

  // CARD
  card: {
    borderWidth: 1, borderRadius: 24, padding: 36,
    maxWidth: 480,
    shadowColor: '#000', shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1, shadowRadius: 32, elevation: 8,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 28 },
  logoDot: { width: 8, height: 8, borderRadius: 4 },
  logoText: { fontSize: 16, fontWeight: '700', fontStyle: 'italic' },
  title: { fontSize: 28, fontWeight: '900', letterSpacing: -0.5, marginBottom: 6 },
  subtitle: { fontSize: 14, lineHeight: 21, marginBottom: 28 },

  // TABS
  tabRow: {
    flexDirection: 'row', borderRadius: 12, borderWidth: 1,
    padding: 4, marginBottom: 24,
  },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 9, alignItems: 'center' },
  tabText: { fontSize: 14, fontWeight: '600' },

  // FIELDS
  fields: { gap: 12, marginBottom: 4 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderRadius: 14,
    paddingHorizontal: 16, height: 52,
  },
  input: { flex: 1, fontSize: 15 },
  eyeBtn: { padding: 4 },

  // FORGOT
  forgotWrap: { alignItems: 'flex-end', marginTop: 8, marginBottom: 4 },
  forgotText: { fontSize: 13, fontWeight: '500' },

  // SUBMIT
  submitBtn: {
    borderRadius: 100, paddingVertical: 16, alignItems: 'center',
    marginTop: 20,
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 6,
  },
  submitText: { fontSize: 15, fontWeight: '700' },

  // DIVIDER
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 20 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 12 },

  // GOOGLE
  googleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, borderWidth: 1, borderRadius: 100,
    paddingVertical: 14,
  },
  googleIcon: { fontSize: 15, fontWeight: '800', color: '#EA4335' },
  googleText: { fontSize: 14, fontWeight: '500' },

  // SWITCH
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  switchText: { fontSize: 13 },
  switchLink: { fontSize: 13, fontWeight: '700' },
});

export default AuthScreen;
