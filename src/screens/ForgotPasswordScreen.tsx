// screens/ForgotPasswordScreen.tsx
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
  keyboardType,
}: {
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: any;
}) => {
  const C = useTheme();
  const borderAnim = useRef(new Animated.Value(0)).current;

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      C.border,
      C.isDark ? 'rgba(200,245,102,0.4)' : 'rgba(92,158,0,0.5)',
    ],
  });

  return (
    <Animated.View
      style={[
        styles.inputWrap,
        {
          backgroundColor: C.isDark ? '#0F1219' : '#F0F2F6',
          borderColor,
        },
      ]}
    >
      <Ionicons
        name="mail-outline"
        size={18}
        color={C.muted}
        style={styles.inputIcon}
      />
      <TextInput
        style={[styles.input, { color: C.text }]}
        placeholder={placeholder}
        placeholderTextColor={C.isDark ? '#4A5270' : '#9199B1'}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        keyboardType={keyboardType}
        onFocus={() =>
          Animated.timing(borderAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
          }).start()
        }
        onBlur={() =>
          Animated.timing(borderAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }).start()
        }
      />
    </Animated.View>
  );
};

// ── Inner screen ──────────────────────────────────────────────────────────────
const ForgotPasswordScreenInner = ({ navigation }: { navigation: any }) => {
  const C = useTheme();
  const { width } = useResponsive();
  const isWide = width >= 640;

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

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

  const handleReset = async () => {
    if (!email) {
      Alert.alert('Missing field', 'Please enter your email address.');
      return;
    }
    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch {
      Alert.alert('Error', 'Could not send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const accentFg = C.isDark ? C.bg : '#ffffff';

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

        {sent ? (
          // ── Success state ────────────────────────────────────────────
          <View style={styles.centeredContent}>
            <View
              style={[
                styles.iconWrap,
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
              <Ionicons name="paper-plane-outline" size={30} color={C.accent} />
            </View>

            <Text style={[styles.title, { color: C.text, textAlign: 'center' }]}>
              Check your inbox.
            </Text>
            <Text
              style={[styles.subtitle, { color: C.muted, textAlign: 'center' }]}
            >
              We sent a password reset link to{'\n'}
              <Text style={{ color: C.text, fontWeight: '600' }}>{email}</Text>
            </Text>

            <View
              style={[
                styles.infoBox,
                {
                  backgroundColor: C.isDark
                    ? 'rgba(200,245,102,0.05)'
                    : 'rgba(92,158,0,0.05)',
                  borderColor: C.isDark
                    ? 'rgba(200,245,102,0.12)'
                    : 'rgba(92,158,0,0.12)',
                },
              ]}
            >
              <Ionicons
                name="information-circle-outline"
                size={16}
                color={C.accent}
                style={{ marginTop: 1 }}
              />
              <Text style={[styles.infoText, { color: C.muted }]}>
                Didn't receive it? Check your spam folder or try again in a few minutes.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: C.accent }]}
              onPress={() => navigation.navigate('Auth')}
              activeOpacity={0.85}
            >
              <Text style={[styles.submitText, { color: accentFg }]}>
                Back to Log In →
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSent(false)}
              style={styles.retryRow}
            >
              <Text style={[styles.retryText, { color: C.muted }]}>
                Wrong email?{' '}
                <Text style={{ color: C.accent, fontWeight: '600' }}>
                  Try again
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          // ── Form state ───────────────────────────────────────────────
          <>
            {/* Icon */}
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
              <Ionicons name="key-outline" size={26} color={C.accent} />
            </View>

            <Text style={[styles.title, { color: C.text }]}>
              Forgot password?
            </Text>
            <Text style={[styles.subtitle, { color: C.muted }]}>
              No worries — enter your email and we'll send you a reset link right away.
            </Text>

            <ThemedInput
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <TouchableOpacity
              style={[
                styles.submitBtn,
                { backgroundColor: C.accent, shadowColor: C.accent },
              ]}
              onPress={handleReset}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color={accentFg} />
              ) : (
                <Text style={[styles.submitText, { color: accentFg }]}>
                  Send Reset Link →
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
const ForgotPasswordScreen = ({ navigation }: { navigation: any }) => {
  const [isDark, setIsDark] = useState(false);
  const C = isDark ? DARK : LIGHT;

  return (
    <ThemeContext.Provider value={C}>
      <View style={styles.themeToggleOverlay}>
        <ThemeToggle isDark={isDark} onToggle={() => setIsDark((d) => !d)} />
      </View>
      <ForgotPasswordScreenInner navigation={navigation} />
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

  // Icon badge
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

  // Input
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 20,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15 },

  // Submit
  submitBtn: {
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: 'center',
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

  // Success state
  centeredContent: { alignItems: 'center' },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 24,
    width: '100%',
  },
  infoText: { fontSize: 13, lineHeight: 19, flex: 1 },
  retryRow: { marginTop: 16 },
  retryText: { fontSize: 13, textAlign: 'center' },
});

export default ForgotPasswordScreen;
