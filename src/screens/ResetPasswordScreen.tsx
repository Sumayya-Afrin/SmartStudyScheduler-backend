// screens/ResetPasswordScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

import { ThemeContext, DARK, LIGHT, useTheme } from '../context/ThemeContext';
import { useResponsive } from '../hooks/useResponsive';
import { ThemeToggle } from '../components/primitives';

// ── Themed Input ──────────────────────────────────────────────────────────────
const ThemedInput = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  rightElement,
}: {
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  secureTextEntry?: boolean;
  rightElement?: React.ReactNode;
}) => {
  const C = useTheme();
  const borderAnim = useRef(new Animated.Value(0)).current;

  const onFocus = () =>
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();

  const onBlur = () =>
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      C.border,
      C.isDark ? 'rgba(200,245,102,0.4)' : 'rgba(92,158,0,0.5)',
    ],
  });

  const inputBg = C.isDark ? '#0F1219' : '#F0F2F6';

  return (
    <Animated.View
      style={[styles.inputWrap, { backgroundColor: inputBg, borderColor }]}
    >
      <TextInput
        style={[styles.input, { color: C.text }]}
        placeholder={placeholder}
        placeholderTextColor={C.isDark ? '#4A5270' : '#9199B1'}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {rightElement}
    </Animated.View>
  );
};

// ── Inner screen ──────────────────────────────────────────────────────────────
const ResetPasswordScreenInner = ({ navigation }: { navigation: any }) => {
  const C = useTheme();
  const { width } = useResponsive();
  const isWide = width >= 640;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

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

  const handleUpdate = async () => {
    if (!password) {
      Alert.alert('Missing field', 'Please enter a new password.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Too short', 'Password must be at least 8 characters.');
      return;
    }
    setIsLoading(true);
    try {
      await api.post('/auth/update-password', { password });
      setDone(true);
    } catch {
      Alert.alert('Error', 'Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const accentFg = C.isDark ? C.bg : '#ffffff';
  const inputBg = C.isDark ? '#0F1219' : '#F0F2F6';

  const eyeBtn = (show: boolean, toggle: () => void) => (
    <TouchableOpacity onPress={toggle} style={styles.eyeBtn}>
      <Ionicons
        name={show ? 'eye-off-outline' : 'eye-outline'}
        size={20}
        color={C.muted}
      />
    </TouchableOpacity>
  );

  return (
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

        {done ? (
          // ── Success state ──────────────────────────────────────────
          <View style={styles.successWrap}>
            <View
              style={[
                styles.successIconWrap,
                {
                  backgroundColor: C.isDark
                    ? 'rgba(200,245,102,0.08)'
                    : 'rgba(92,158,0,0.08)',
                  borderColor: C.isDark
                    ? 'rgba(200,245,102,0.2)'
                    : 'rgba(92,158,0,0.2)',
                },
              ]}
            >
              <Ionicons name="checkmark" size={32} color={C.accent} />
            </View>
            <Text style={[styles.title, { color: C.text, textAlign: 'center' }]}>
              Password updated!
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: C.muted, textAlign: 'center' },
              ]}
            >
              Your password has been changed successfully. You can now log in
              with your new password.
            </Text>
            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: C.accent }]}
              onPress={() => navigation.navigate('Auth')}
              activeOpacity={0.85}
            >
              <Text style={[styles.submitText, { color: accentFg }]}>
                Go to Log In →
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          // ── Form state ─────────────────────────────────────────────
          <>
            {/* Lock icon */}
            <View
              style={[
                styles.iconWrap,
                {
                  backgroundColor: C.isDark
                    ? 'rgba(200,245,102,0.07)'
                    : 'rgba(92,158,0,0.08)',
                  borderColor: C.isDark
                    ? 'rgba(200,245,102,0.12)'
                    : 'rgba(92,158,0,0.15)',
                },
              ]}
            >
              <Ionicons name="lock-closed-outline" size={26} color={C.accent} />
            </View>

            <Text style={[styles.title, { color: C.text }]}>
              Set new password.
            </Text>
            <Text style={[styles.subtitle, { color: C.muted }]}>
              Choose a strong password with at least 8 characters.
            </Text>

            {/* Fields */}
            <View style={styles.fields}>
              <ThemedInput
                placeholder="New password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                rightElement={eyeBtn(showPassword, () =>
                  setShowPassword((s) => !s)
                )}
              />
              <ThemedInput
                placeholder="Confirm new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirm}
                rightElement={eyeBtn(showConfirm, () =>
                  setShowConfirm((s) => !s)
                )}
              />
            </View>

            {/* Password strength hint */}
            {password.length > 0 && (
              <View style={styles.strengthRow}>
                {[1, 2, 3, 4].map((level) => {
                  const strength =
                    password.length >= 12
                      ? 4
                      : password.length >= 10
                      ? 3
                      : password.length >= 8
                      ? 2
                      : 1;
                  return (
                    <View
                      key={level}
                      style={[
                        styles.strengthBar,
                        {
                          backgroundColor:
                            level <= strength
                              ? strength <= 1
                                ? '#FF6B6B'
                                : strength === 2
                                ? '#FFB347'
                                : C.accent
                              : C.isDark
                              ? 'rgba(255,255,255,0.07)'
                              : 'rgba(0,0,0,0.08)',
                        },
                      ]}
                    />
                  );
                })}
                <Text style={[styles.strengthLabel, { color: C.muted }]}>
                  {password.length >= 12
                    ? 'Strong'
                    : password.length >= 10
                    ? 'Good'
                    : password.length >= 8
                    ? 'Fair'
                    : 'Weak'}
                </Text>
              </View>
            )}

            {/* Submit */}
            <TouchableOpacity
              style={[
                styles.submitBtn,
                { backgroundColor: C.accent, shadowColor: C.accent },
              ]}
              onPress={handleUpdate}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color={accentFg} />
              ) : (
                <Text style={[styles.submitText, { color: accentFg }]}>
                  Update Password →
                </Text>
              )}
            </TouchableOpacity>

            {/* Back to login */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Auth')}
              style={styles.backRow}
            >
              <Ionicons name="arrow-back-outline" size={14} color={C.muted} />
              <Text style={[styles.backText, { color: C.muted }]}>
                Back to Log In
              </Text>
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
    </ScrollView>
  );
};

// ── Root (owns theme state) ───────────────────────────────────────────────────
const ResetPasswordScreen = ({ navigation }: { navigation: any }) => {
  const [isDark, setIsDark] = useState(false);
  const C = isDark ? DARK : LIGHT;

  return (
    <ThemeContext.Provider value={C}>
      <View
        style={[
          styles.themeToggleOverlay,
          { backgroundColor: 'transparent' },
        ]}
      >
        <ThemeToggle isDark={isDark} onToggle={() => setIsDark((d) => !d)} />
      </View>
      <ResetPasswordScreenInner navigation={navigation} />
    </ThemeContext.Provider>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    minHeight: Platform.OS === 'web' ? ('100vh' as any) : undefined,
    overflow: 'hidden',
  },
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

  // Logo
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 28,
  },
  logoDot: { width: 8, height: 8, borderRadius: 4 },
  logoText: { fontSize: 16, fontWeight: '700', fontStyle: 'italic' },

  // Icon
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  // Text
  title: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: { fontSize: 14, lineHeight: 21, marginBottom: 28 },

  // Fields
  fields: { gap: 12, marginBottom: 12 },
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

  // Strength
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  strengthBar: { flex: 1, height: 3, borderRadius: 2 },
  strengthLabel: { fontSize: 11, marginLeft: 4 },

  // Submit
  submitBtn: {
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  submitText: { fontSize: 15, fontWeight: '700' },

  // Back link
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 20,
  },
  backText: { fontSize: 13 },

  // Success
  successWrap: { alignItems: 'center', paddingVertical: 8 },
  successIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
});

export default ResetPasswordScreen;
