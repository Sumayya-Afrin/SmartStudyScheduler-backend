// components/Header.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useResponsive } from '../hooks/useResponsive';
import { ThemeToggle } from './primitives';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onNavigate: (screen: string) => void;
}

/**
 * Fixed top navigation bar.
 * Renders the logo, theme toggle, login link, and Sign Up CTA.
 * On web it uses `position: sticky` so it stays pinned during scroll.
 */
const Header = ({ isDark, onToggleTheme, onNavigate }: HeaderProps) => {
  const C = useTheme();
  const { maxW, hPad } = useResponsive();

  return (
    <View
      style={[
        styles.navOuter,
        {
          borderBottomColor: C.border,
          backgroundColor: C.isDark ? `${C.bg}EE` : `${C.bg}F5`,
          ...(Platform.OS === 'web'
            ? { position: 'sticky' as any, top: 0, zIndex: 50 }
            : {}),
        },
      ]}
    >
      <View
        style={[styles.navInner, { maxWidth: maxW, paddingHorizontal: hPad }]}
      >
        {/* Logo */}
        <View style={styles.logoRow}>
          <View style={[styles.logoDot, { backgroundColor: C.accent }]} />
          <Text style={[styles.logoText, { color: C.text }]}>FocusFlow</Text>
        </View>

        {/* Right controls */}
        <View style={styles.navRight}>
          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
          <TouchableOpacity onPress={() => onNavigate('Auth')}>
            <Text style={[styles.navLogin, { color: C.muted }]}>Log in</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navCta, { backgroundColor: C.accent }]}
            onPress={() => onNavigate('Auth')}
          >
            <Text
              style={[
                styles.navCtaText,
                { color: C.isDark ? C.bg : '#fff' },
              ]}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navOuter: { borderBottomWidth: 1 },
  navInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    alignSelf: 'center',
    width: '100%',
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoDot: { width: 8, height: 8, borderRadius: 4 },
  logoText: { fontSize: 18, fontWeight: '700', fontStyle: 'italic' },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  navLogin: { fontSize: 14 },
  navCta: { borderRadius: 100, paddingVertical: 9, paddingHorizontal: 22 },
  navCtaText: { fontWeight: '700', fontSize: 14 },
});

export default Header;
