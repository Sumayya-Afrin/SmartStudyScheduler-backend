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
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { saveToken } from '../utils/storage';
import api from '../services/api';

// ── Shared theme & hooks (same as rest of app) ────────────────────────────────
import { ThemeContext, DARK, LIGHT, useTheme } from '../context/ThemeContext';
import { useResponsive } from '../hooks/useResponsive';
import { ThemeToggle } from '../components/primitives';

// ── Themed Input ──────────────────────────────────────────────────────────────
const ThemedInput = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  rightElement,
}: {
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: any;
  autoCapitalize?: any;
  rightElement?: React.ReactNode;
}) => {
  const C = useTheme();
  const [focused, setFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const onFocus = () => {
    setFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };
  const onBlur = () => {
    setFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const borderFocus = C.isDark
    ? 'rgba(200,245,102,0.4)'
    : 'rgba(92,158,0,0.5)';

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [C.border, borderFocus],
  });

  const inputBg = C.isDark ? '#0F1219' : '#F0F2F6';
  const placeholder_color = C.isDark ? '#4A5270' : '#9199B1';

  return (
    <Animated.View
      style={[styles.inputWrap, { backgroundColor: inputBg, borderColor }]}
    >
      <TextInput
        style={[styles.input, { color: C.text }]}
        placeholder={placeholder}
        placeholderTextColor={placeholder_color}
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

// ── Inner screen (consumes context) ──────────────────────────────────────────
const AuthScreenInner = ({ navigation }: { navigation: any }) => {
  const C = useTheme();
  const { isWide } = (() => {
    const { width } = useResponsive();
    return { isWide: width >= 640 };
  })();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fade-in on mount
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
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
      const response = await api.post<{ token: string }>(endpoint, {
        email,
        password,
      });
      await saveToken(response.data.token);
      navigation.navigate('MainTabs');
    } catch {
      Alert.alert(
        isLogin ? 'Login Failed' : 'Registration Failed',
        'Please check your details and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const eyeBtn = (show: boolean, toggle: () => void) => (
    <TouchableOpacity onPress={toggle} style={styles.eyeBtn}>
      <Ionicons
        name={show ? 'eye-off-outline' : 'eye-outline'}
        size={20}
        color={C.muted}
      />
    </TouchableOpacity>
  );

  const inputBg = C.isDark ? '#0F1219' : '#F0F2F6';
  const accentFg = C.isDark ? C.bg : '#ffffff';

  return (
    // Web-safe: ScrollView + min-height instead of KeyboardAvoidingView collapsing
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        { backgroundColor: C.bg },
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Ambient orbs */}
      <View
        style={[
          styles.orbBlue,
          !C.isDark && { backgroundColor: 'rgba(92,158,0,0.06)' },
        ]}
      />
      <View
        style={[
          styles.orbGreen,
          !C.isDark && { backgroundColor: 'rgba(59,130,246,0.05)' },
        ]}
      />

      {/* Top bar intentionally empty — back is handled by the navigator */}

      {/* Card */}
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: C.surface,
            borderColor: C.border,
            width: isWide ? 480 : '100%',
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
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
        <View
          style={[
            styles.tabRow,
            { backgroundColor: inputBg, borderColor: C.border },
          ]}
        >
          {['Log In', 'Sign Up'].map((label, i) => {
            const active = (i === 0 && isLogin) || (i === 1 && !isLogin);
            return (
              <TouchableOpacity
                key={label}
                style={[
                  styles.tab,
                  active && { backgroundColor: C.accent },
                ]}
                onPress={() => setIsLogin(i === 0)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: active ? accentFg : C.muted },
                  ]}
                >
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
          />
          <ThemedInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            rightElement={eyeBtn(showPassword, () =>
              setShowPassword(!showPassword)
            )}
          />
          {!isLogin && (
            <ThemedInput
              placeholder="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirm}
              rightElement={eyeBtn(showConfirm, () =>
                setShowConfirm(!showConfirm)
              )}
            />
          )}
        </View>

        {/* Forgot password */}
        {isLogin && (
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotWrap}
          >
            <Text style={[styles.forgotText, { color: C.accent }]}>
              Forgot password?
            </Text>
          </TouchableOpacity>
        )}

        {/* Submit */}
        <TouchableOpacity
          style={[
            styles.submitBtn,
            { backgroundColor: C.accent, shadowColor: C.accent },
          ]}
          onPress={handleSubmit}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator color={accentFg} />
          ) : (
            <Text style={[styles.submitText, { color: accentFg }]}>
              {isLogin ? 'Log In →' : 'Create Account →'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: C.border }]} />
          <Text style={[styles.dividerText, { color: C.muted }]}>or</Text>
          <View style={[styles.dividerLine, { backgroundColor: C.border }]} />
        </View>

        {/* Google */}
        <TouchableOpacity
          style={[
            styles.googleBtn,
            { borderColor: C.border, backgroundColor: inputBg },
          ]}
          activeOpacity={0.8}
        >
          <Text style={styles.googleIcon}>G</Text>
          <Text style={[styles.googleText, { color: C.text }]}>
            Continue with Google
          </Text>
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
    </ScrollView>
  );
};

// ── Root (owns theme state, provides context) ─────────────────────────────────
const AuthScreen = ({ navigation }: { navigation: any }) => {
  const [isDark, setIsDark] = useState(false);
  const C = isDark ? DARK : LIGHT;

  return (
    <ThemeContext.Provider value={C}>
      {/* Floating theme toggle — rendered outside the card so it's always visible */}
      <View
        style={[
          styles.themeToggleOverlay,
          { backgroundColor: C.bg },
        ]}
      >
        <ThemeToggle
          isDark={isDark}
          onToggle={() => setIsDark((d) => !d)}
        />
      </View>
      <AuthScreenInner navigation={navigation} />
    </ThemeContext.Provider>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Web-safe scroll container instead of KeyboardAvoidingView
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    minHeight: Platform.OS === 'web' ? ('100vh' as any) : undefined,
    overflow: 'hidden',
  },

  // Theme toggle pinned top-right, outside scroll
  themeToggleOverlay: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 56 : 20,
    right: 24,
    zIndex: 100,
  },

  // Orbs
  orbBlue: {
    position: 'absolute',
    top: -80,
    right: -120,
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: 'rgba(91,142,255,0.1)',
  },
  orbGreen: {
    position: 'absolute',
    bottom: -60,
    left: -100,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(200,245,102,0.07)',
  },



  // Card
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 36,
    maxWidth: 480,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 8,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 28,
  },
  logoDot: { width: 8, height: 8, borderRadius: 4 },
  logoText: { fontSize: 16, fontWeight: '700', fontStyle: 'italic' },
  title: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: { fontSize: 14, lineHeight: 21, marginBottom: 28 },

  // Tabs
  tabRow: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: 'center',
  },
  tabText: { fontSize: 14, fontWeight: '600' },

  // Fields
  fields: { gap: 12, marginBottom: 4 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
  },
  input: { flex: 1, fontSize: 15 },
  eyeBtn: { padding: 4 },

  // Forgot
  forgotWrap: {
    alignItems: 'flex-end',
    marginTop: 8,
    marginBottom: 4,
  },
  forgotText: { fontSize: 13, fontWeight: '500' },

  // Submit
  submitBtn: {
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  submitText: { fontSize: 15, fontWeight: '700' },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 20,
  },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 12 },

  // Google
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 100,
    paddingVertical: 14,
  },
  googleIcon: { fontSize: 15, fontWeight: '800', color: '#EA4335' },
  googleText: { fontSize: 14, fontWeight: '500' },

  // Switch
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  switchText: { fontSize: 13 },
  switchLink: { fontSize: 13, fontWeight: '700' },

  // Toggle
  toggleTrack: {
    width: 52,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    justifyContent: 'space-between',
    position: 'relative',
  },
  toggleIcon: { fontSize: 11, zIndex: 0 },
  toggleThumb: {
    position: 'absolute',
    left: 3,
    width: 22,
    height: 22,
    borderRadius: 11,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default AuthScreen;
