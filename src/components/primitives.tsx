// components/primitives.tsx
import React, { useRef, useEffect } from 'react';
import {
  Animated,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

// ── FadeIn ────────────────────────────────────────────────────────────────────
export const FadeIn = ({ children, delay = 0, style }: {
  children: React.ReactNode;
  delay?: number;
  style?: any;
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 600, delay, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 600, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
};

// ── ThemeToggle ───────────────────────────────────────────────────────────────
export const ThemeToggle = ({
  isDark,
  onToggle,
}: {
  isDark: boolean;
  onToggle: () => void;
}) => {
  const C = useTheme();
  const translateX = useRef(new Animated.Value(isDark ? 22 : 0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: isDark ? 22 : 0,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();
  }, [isDark]);

  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.85}
      style={[
        styles.toggleTrack,
        {
          backgroundColor: isDark
            ? 'rgba(200,245,102,0.15)'
            : 'rgba(92,158,0,0.12)',
          borderColor: isDark
            ? 'rgba(200,245,102,0.25)'
            : 'rgba(92,158,0,0.2)',
        },
      ]}
    >
      <Text style={styles.toggleIconLeft}>☀️</Text>
      <Text style={styles.toggleIconRight}>🌙</Text>
      <Animated.View
        style={[
          styles.toggleThumb,
          { backgroundColor: C.accent, transform: [{ translateX }] },
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggleTrack: {
    width: 52,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    position: 'relative',
    justifyContent: 'space-between',
  },
  toggleIconLeft: { fontSize: 12, zIndex: 0 },
  toggleIconRight: { fontSize: 12, zIndex: 0 },
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
