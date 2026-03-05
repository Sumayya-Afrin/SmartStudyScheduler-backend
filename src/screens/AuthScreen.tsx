// screens/AuthScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Animated,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { saveToken } from '../utils/storage';
import api from '../services/api';
import { signInWithGoogle } from '../services/Googleauth';
import type { AuthResponse } from '../types';

import { ThemeContext, DARK, LIGHT, useTheme } from '../context/ThemeContext';
import { useResponsive } from '../hooks/useResponsive';
import Header from '../components/Header';
import Footer from '../components/Footer';

// ── Validation ────────────────────────────────────────────────────────────────
const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const isValidPassword = (password: string) => password.length >= 8;

const validateForm = (
  isLogin: boolean,
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): Record<string, string> => {
  const errors: Record<string, string> = {};
  if (!isLogin && name.trim().length < 2)
    errors.name = 'Please enter your full name (at least 2 characters).';
  if (!email.trim())
    errors.email = 'Email is required.';
  else if (!isValidEmail(email))
    errors.email = 'Please enter a valid email address.';
  if (!password)
    errors.password = 'Password is required.';
  else if (!isLogin && !isValidPassword(password))
    errors.password = 'Password must be at least 8 characters.';
  if (!isLogin && password !== confirmPassword)
    errors.confirmPassword = 'Passwords do not match.';
  return errors;
};

// ── Themed Input ──────────────────────────────────────────────────────────────
const ThemedInput = ({
  placeholder, value, onChangeText,
  secureTextEntry, keyboardType, autoCapitalize, rightElement, error,
}: {
  placeholder: string; value: string;
  onChangeText: (v: string) => void;
  secureTextEntry?: boolean; keyboardType?: any;
  autoCapitalize?: any; rightElement?: React.ReactNode; error?: string;
}) => {
  const C = useTheme();
  const borderAnim = useRef(new Animated.Value(0)).current;

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      error ? '#FF6B6B' : C.border,
      error ? '#FF6B6B' : (C.isDark ? 'rgba(200,245,102,0.4)' : 'rgba(92,158,0,0.5)'),
    ],
  });

  return (
    <View>
      <Animated.View style={[styles.inputWrap, {
        backgroundColor: C.isDark ? '#0F1219' : '#F0F2F6',
        borderColor: error ? '#FF6B6B' : borderColor as any,
      }]}>
        <TextInput
          style={[styles.input, { color: C.text }]}
          placeholder={placeholder}
          placeholderTextColor={C.isDark ? '#4A5270' : '#9199B1'}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize ?? 'none'}
          onFocus={() => Animated.timing(borderAnim, { toValue: 1, duration: 200, useNativeDriver: false }).start()}
          onBlur={() => Animated.timing(borderAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start()}
        />
        {rightElement}
      </Animated.View>
      {error ? (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle-outline" size={13} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
};

// ── Inner screen ──────────────────────────────────────────────────────────────
const AuthScreenInner = ({ navigation }: { navigation: any }) => {
  const C = useTheme();
  const { width } = useResponsive();
  const isWide = width >= 640;

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const switchMode = (login: boolean) => {
    setIsLogin(login);
    setName(''); setEmail(''); setPassword(''); setConfirmPassword('');
    setErrors({}); setServerError('');
  };

  const clearError = (field: string) => {
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }));
    if (serverError) setServerError('');
  };

  // ── Email/password submit ──────────────────────────────────────────────────
  const handleSubmit = async () => {
    const formErrors = validateForm(isLogin, name, email, password, confirmPassword);
    if (Object.keys(formErrors).length > 0) { setErrors(formErrors); return; }

    setIsLoading(true);
    setServerError('');
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin
        ? { email: email.trim(), password }
        : { email: email.trim(), password, name: name.trim() };

      const response = await api.post<AuthResponse>(endpoint, payload);
      await saveToken(response.data.token);
      navigation.navigate('MainTabs');
    } catch (error: any) {
      setServerError(error?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Google submit ──────────────────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setServerError('');
    try {
      // 1. Get Supabase access_token from Google
      const supabaseToken = await signInWithGoogle();

      // On web, signInWithGoogle() triggers a redirect — nothing more to do here.
      // The listenForGoogleCallback() in App.tsx will handle the rest.
      if (!supabaseToken) return;

      // 2. Send Supabase token to YOUR backend → get back your own JWT
      const response = await api.post<AuthResponse>('/auth/google', {
        access_token: supabaseToken,
      });

      // 3. Same as normal login from here
      await saveToken(response.data.token);
      navigation.navigate('MainTabs');
    } catch (error: any) {
      setServerError(error?.message || 'Google sign-in failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const eyeBtn = (show: boolean, toggle: () => void) => (
    <TouchableOpacity onPress={toggle} style={styles.eyeBtn}>
      <Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={20} color={C.muted} />
    </TouchableOpacity>
  );

  const inputBg = C.isDark ? '#0F1219' : '#F0F2F6';
  const accentFg = C.isDark ? C.bg : '#ffffff';

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.scrollContent, { backgroundColor: C.bg }]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.orbBlue, !C.isDark && { backgroundColor: 'rgba(92,158,0,0.06)' }]} />
      <View style={[styles.orbGreen, !C.isDark && { backgroundColor: 'rgba(59,130,246,0.05)' }]} />

      <View style={styles.pageBody}>
        <Animated.View style={[
          styles.card,
          {
            backgroundColor: C.surface, borderColor: C.border,
            width: isWide ? 480 : '100%',
            opacity: fadeAnim, transform: [{ translateY: slideAnim }],
          },
        ]}>
          {/* Logo */}
          <View style={styles.logoRow}>
            <View style={[styles.logoDot, { backgroundColor: C.accent }]} />
            <Text style={[styles.logoText, { color: C.text }]}>FocusFlow</Text>
          </View>

          <Text style={[styles.title, { color: C.text }]}>
            {isLogin ? 'Welcome back.' : 'Create your account.'}
          </Text>
          <Text style={[styles.subtitle, { color: C.muted }]}>
            {isLogin
              ? 'Sign in to continue your study journey.'
              : 'Start building smarter study habits today.'}
          </Text>

          {/* Tab switcher */}
          <View style={[styles.tabRow, { backgroundColor: inputBg, borderColor: C.border }]}>
            {['Log In', 'Sign Up'].map((label, i) => {
              const active = (i === 0 && isLogin) || (i === 1 && !isLogin);
              return (
                <TouchableOpacity
                  key={label}
                  style={[styles.tab, active && { backgroundColor: C.accent }]}
                  onPress={() => switchMode(i === 0)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tabText, { color: active ? accentFg : C.muted }]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Server error banner */}
          {serverError ? (
            <View style={[styles.serverErrorBox, {
              borderColor: 'rgba(255,107,107,0.3)',
              backgroundColor: 'rgba(255,107,107,0.07)',
            }]}>
              <Ionicons name="warning-outline" size={16} color="#FF6B6B" />
              <Text style={styles.serverErrorText}>{serverError}</Text>
            </View>
          ) : null}

          {/* Fields */}
          <View style={styles.fields}>
            {!isLogin && (
              <ThemedInput
                placeholder="Full name" value={name}
                onChangeText={(v) => { setName(v); clearError('name'); }}
                autoCapitalize="words" error={errors.name}
              />
            )}
            <ThemedInput
              placeholder="Email address" value={email}
              onChangeText={(v) => { setEmail(v); clearError('email'); }}
              keyboardType="email-address" error={errors.email}
            />
            <ThemedInput
              placeholder="Password" value={password}
              onChangeText={(v) => { setPassword(v); clearError('password'); }}
              secureTextEntry={!showPassword}
              rightElement={eyeBtn(showPassword, () => setShowPassword(!showPassword))}
              error={errors.password}
            />
            {!isLogin && (
              <ThemedInput
                placeholder="Confirm password" value={confirmPassword}
                onChangeText={(v) => { setConfirmPassword(v); clearError('confirmPassword'); }}
                secureTextEntry={!showConfirm}
                rightElement={eyeBtn(showConfirm, () => setShowConfirm(!showConfirm))}
                error={errors.confirmPassword}
              />
            )}
          </View>

          {isLogin && (
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotWrap}
            >
              <Text style={[styles.forgotText, { color: C.accent }]}>Forgot password?</Text>
            </TouchableOpacity>
          )}

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: C.accent, shadowColor: C.accent }]}
            onPress={handleSubmit}
            disabled={isLoading || isGoogleLoading}
            activeOpacity={0.85}
          >
            {isLoading
              ? <ActivityIndicator color={accentFg} />
              : <Text style={[styles.submitText, { color: accentFg }]}>
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

          {/* Google button — now functional */}
          <TouchableOpacity
            style={[styles.googleBtn, {
              borderColor: C.border, backgroundColor: inputBg,
              opacity: isGoogleLoading ? 0.7 : 1,
            }]}
            onPress={handleGoogleSignIn}
            disabled={isLoading || isGoogleLoading}
            activeOpacity={0.8}
          >
            {isGoogleLoading ? (
              <ActivityIndicator size="small" color={C.muted} />
            ) : (
              <>
                <Text style={styles.googleIcon}>G</Text>
                <Text style={[styles.googleText, { color: C.text }]}>
                  Continue with Google
                </Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.switchRow}>
            <Text style={[styles.switchText, { color: C.muted }]}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
            </Text>
            <TouchableOpacity onPress={() => switchMode(!isLogin)}>
              <Text style={[styles.switchLink, { color: C.accent }]}>
                {isLogin ? 'Sign Up' : 'Log In'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>

      <Footer onNavigate={(screen) => navigation.navigate(screen)} />
    </ScrollView>
  );
};

// ── Root ──────────────────────────────────────────────────────────────────────
const AuthScreen = ({ navigation }: { navigation: any }) => {
  const [isDark, setIsDark] = useState(false);
  const C = isDark ? DARK : LIGHT;

  return (
    <ThemeContext.Provider value={C}>
      <SafeAreaView style={[styles.root, { backgroundColor: C.bg }]}>
        <Header
          isDark={isDark}
          onToggleTheme={() => setIsDark((d) => !d)}
          onNavigate={(screen) => navigation.navigate(screen)}
        />
        <AuthScreenInner navigation={navigation} />
      </SafeAreaView>
    </ThemeContext.Provider>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, ...(Platform.OS === 'web' ? { height: '100vh' as any } : {}) },
  scrollContent: { flexGrow: 1 },
  pageBody: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 24, paddingTop: 64, paddingBottom: 64, overflow: 'hidden',
  },
  orbBlue: {
    position: 'absolute', top: -80, right: -120,
    width: 360, height: 360, borderRadius: 180,
    backgroundColor: 'rgba(91,142,255,0.1)',
  },
  orbGreen: {
    position: 'absolute', bottom: -60, left: -100,
    width: 280, height: 280, borderRadius: 140,
    backgroundColor: 'rgba(200,245,102,0.07)',
  },
  card: {
    borderWidth: 1, borderRadius: 24, padding: 36, maxWidth: 480, width: '100%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1, shadowRadius: 32, elevation: 8,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 28 },
  logoDot: { width: 8, height: 8, borderRadius: 4 },
  logoText: { fontSize: 16, fontWeight: '700', fontStyle: 'italic' },
  title: { fontSize: 28, fontWeight: '900', letterSpacing: -0.5, marginBottom: 6 },
  subtitle: { fontSize: 14, lineHeight: 21, marginBottom: 28 },
  tabRow: {
    flexDirection: 'row', borderRadius: 12, borderWidth: 1,
    padding: 4, marginBottom: 24,
  },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 9, alignItems: 'center' },
  tabText: { fontSize: 14, fontWeight: '600' },
  serverErrorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 16,
  },
  serverErrorText: { fontSize: 13, color: '#FF6B6B', flex: 1, lineHeight: 18 },
  fields: { gap: 12, marginBottom: 4 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1,
    borderRadius: 14, paddingHorizontal: 16, height: 52,
  },
  input: { flex: 1, fontSize: 15 },
  eyeBtn: { padding: 4 },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5, marginLeft: 4 },
  errorText: { fontSize: 12, color: '#FF6B6B', flex: 1 },
  forgotWrap: { alignItems: 'flex-end', marginTop: 8, marginBottom: 4 },
  forgotText: { fontSize: 13, fontWeight: '500' },
  submitBtn: {
    borderRadius: 100, paddingVertical: 16, alignItems: 'center', marginTop: 20,
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 6,
  },
  submitText: { fontSize: 15, fontWeight: '700' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 20 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 12 },
  googleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, borderWidth: 1, borderRadius: 100, paddingVertical: 14, minHeight: 52,
  },
  googleIcon: { fontSize: 15, fontWeight: '800', color: '#EA4335' },
  googleText: { fontSize: 14, fontWeight: '500' },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  switchText: { fontSize: 13 },
  switchLink: { fontSize: 13, fontWeight: '700' },
});

export default AuthScreen;