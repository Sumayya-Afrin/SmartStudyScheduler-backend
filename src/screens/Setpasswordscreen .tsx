// screens/SetPasswordScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, ScrollView,
  Animated, Platform, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { ThemeContext, DARK, LIGHT, useTheme } from '../context/ThemeContext';
import { useResponsive } from '../hooks/useResponsive';
import Header from '../components/Header';
import Footer from '../components/Footer';

// ── Themed Input ──────────────────────────────────────────────────────────────
const ThemedInput = ({
  placeholder, value, onChangeText,
  secureTextEntry, rightElement, error,
}: {
  placeholder: string; value: string;
  onChangeText: (v: string) => void;
  secureTextEntry?: boolean;
  rightElement?: React.ReactNode;
  error?: string;
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
      <Animated.View style={[
        styles.inputWrap,
        { backgroundColor: C.isDark ? '#0F1219' : '#F0F2F6', borderColor: error ? '#FF6B6B' : borderColor as any },
      ]}>
        <TextInput
          style={[styles.input, { color: C.text }]}
          placeholder={placeholder}
          placeholderTextColor={C.isDark ? '#4A5270' : '#9199B1'}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
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
const SetPasswordScreenInner = ({ navigation }: { navigation: any }) => {
  const C = useTheme();
  const { width } = useResponsive();
  const isWide = width >= 640;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [done, setDone] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!password) errs.password = 'Password is required.';
    else if (password.length < 8) errs.password = 'Password must be at least 8 characters.';
    if (!confirmPassword) errs.confirmPassword = 'Please confirm your password.';
    else if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    return errs;
  };

  const handleSetPassword = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setIsLoading(true);
    setServerError('');
    try {
      await api.post('/auth/set-password', { password });
      setDone(true);
    } catch (error: any) {
      setServerError(error?.response?.data?.message || 'Failed to set password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const eyeBtn = (show: boolean, toggle: () => void) => (
    <TouchableOpacity onPress={toggle} style={styles.eyeBtn}>
      <Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={20} color={C.muted} />
    </TouchableOpacity>
  );

  // Password strength
  const strength =
    password.length >= 12 ? 4 :
    password.length >= 10 ? 3 :
    password.length >= 8  ? 2 :
    password.length > 0   ? 1 : 0;

  const strengthColor = strength <= 1 ? '#FF6B6B' : strength === 2 ? '#FFB347' : C.accent;
  const strengthLabel = strength === 4 ? 'Strong' : strength === 3 ? 'Good' : strength === 2 ? 'Fair' : strength === 1 ? 'Weak' : '';

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
          {done ? (
            // ── Success state ──────────────────────────────────────────────
            <View style={styles.centeredContent}>
              <View style={[styles.iconWrap, {
                backgroundColor: C.isDark ? 'rgba(200,245,102,0.08)' : 'rgba(92,158,0,0.08)',
                borderColor: C.isDark ? 'rgba(200,245,102,0.2)' : 'rgba(92,158,0,0.2)',
              }]}>
                <Ionicons name="checkmark" size={32} color={C.accent} />
              </View>
              <Text style={[styles.title, { color: C.text, textAlign: 'center' }]}>
                Registration complete!
              </Text>
              <Text style={[styles.subtitle, { color: C.muted, textAlign: 'center' }]}>
                Your account is ready. You can now log in with Google or your email and password.
              </Text>
              <TouchableOpacity
                style={[styles.submitBtn, { backgroundColor: C.accent }]}
                onPress={() => navigation.navigate('MainTabs')}
                activeOpacity={0.85}
              >
                <Text style={[styles.submitText, { color: accentFg }]}>Go to Dashboard →</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // ── Form state ─────────────────────────────────────────────────
            <>
              {/* Icon */}
              <View style={[styles.iconWrap, {
                backgroundColor: C.isDark ? 'rgba(200,245,102,0.07)' : 'rgba(92,158,0,0.08)',
                borderColor: C.isDark ? 'rgba(200,245,102,0.12)' : 'rgba(92,158,0,0.15)',
              }]}>
                <Ionicons name="lock-closed-outline" size={26} color={C.accent} />
              </View>

              <Text style={[styles.title, { color: C.text }]}>Set your password.</Text>
              <Text style={[styles.subtitle, { color: C.muted }]}>
                One last step! Set a password to complete your registration.
              </Text>

              {/* Server error */}
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
                <ThemedInput
                  placeholder="New password"
                  value={password}
                  onChangeText={(v) => { setPassword(v); if (errors.password) setErrors((e) => ({ ...e, password: '' })); }}
                  secureTextEntry={!showPassword}
                  rightElement={eyeBtn(showPassword, () => setShowPassword((s) => !s))}
                  error={errors.password}
                />
                <ThemedInput
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChangeText={(v) => { setConfirmPassword(v); if (errors.confirmPassword) setErrors((e) => ({ ...e, confirmPassword: '' })); }}
                  secureTextEntry={!showConfirm}
                  rightElement={eyeBtn(showConfirm, () => setShowConfirm((s) => !s))}
                  error={errors.confirmPassword}
                />
              </View>

              {/* Password strength */}
              {strength > 0 && (
                <View style={styles.strengthRow}>
                  {[1, 2, 3, 4].map((level) => (
                    <View key={level} style={[
                      styles.strengthBar,
                      { backgroundColor: level <= strength ? strengthColor : C.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)' },
                    ]} />
                  ))}
                  <Text style={[styles.strengthLabel, { color: C.muted }]}>{strengthLabel}</Text>
                </View>
              )}

              {/* Submit */}
              <TouchableOpacity
                style={[styles.submitBtn, { backgroundColor: C.accent, shadowColor: C.accent }]}
                onPress={handleSetPassword}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                {isLoading
                  ? <ActivityIndicator color={accentFg} />
                  : <Text style={[styles.submitText, { color: accentFg }]}>Set Password →</Text>
                }
              </TouchableOpacity>


            </>
          )}
        </Animated.View>
      </View>

      <Footer onNavigate={(screen) => navigation.navigate(screen)} />
    </ScrollView>
  );
};

// ── Root ──────────────────────────────────────────────────────────────────────
const SetPasswordScreen = ({ navigation }: { navigation: any }) => {
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
        <SetPasswordScreenInner navigation={navigation} />
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
    borderWidth: 1, borderRadius: 24, padding: 36,
    maxWidth: 480, width: '100%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1, shadowRadius: 32, elevation: 8,
  },
  iconWrap: {
    width: 56, height: 56, borderRadius: 16, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  title: { fontSize: 28, fontWeight: '900', letterSpacing: -0.5, marginBottom: 6 },
  subtitle: { fontSize: 14, lineHeight: 21, marginBottom: 24 },
  serverErrorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 16,
  },
  serverErrorText: { fontSize: 13, color: '#FF6B6B', flex: 1, lineHeight: 18 },
  fields: { gap: 12, marginBottom: 8 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, height: 52,
  },
  input: { flex: 1, fontSize: 15 },
  eyeBtn: { padding: 4 },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5, marginLeft: 4 },
  errorText: { fontSize: 12, color: '#FF6B6B', flex: 1 },
  strengthRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20 },
  strengthBar: { flex: 1, height: 3, borderRadius: 2 },
  strengthLabel: { fontSize: 11, marginLeft: 4 },
  submitBtn: {
    borderRadius: 100, paddingVertical: 16, alignItems: 'center', marginTop: 8,
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 6,
  },
  submitText: { fontSize: 15, fontWeight: '700' },
  skipRow: { alignItems: 'center', marginTop: 16 },
  skipText: { fontSize: 13 },
  centeredContent: { alignItems: 'center' },
});

export default SetPasswordScreen;