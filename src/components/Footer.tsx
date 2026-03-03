// components/Footer.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useResponsive } from '../hooks/useResponsive';

interface FooterProps {
  onNavigate?: (screen: string) => void;
}

/**
 * Fixed bottom footer.
 * Shows brand tagline, quick links, and copyright.
 * Add `position: 'sticky', bottom: 0` on web if you want a pinned footer,
 * or leave it scrolling naturally inside a ScrollView (default).
 */
const Footer = ({ onNavigate }: FooterProps) => {
  const C = useTheme();
  const { maxW, hPad, isDesktop } = useResponsive();

  const links = [
    { label: 'Features', screen: 'Features' },
    { label: 'How it Works', screen: 'HowItWorks' },
    { label: 'FAQ', screen: 'FAQ' },
    { label: 'Sign Up', screen: 'Auth' },
  ];

  return (
    <View
      style={[
        styles.footerOuter,
        { borderTopColor: C.border, backgroundColor: C.bg2 },
      ]}
    >
      <View
        style={[
          styles.footerInner,
          {
            maxWidth: maxW,
            paddingHorizontal: hPad,
            flexDirection: isDesktop ? 'row' : 'column',
          },
        ]}
      >
        {/* Brand */}
        <View style={styles.brand}>
          <View style={styles.logoRow}>
            <View style={[styles.logoDot, { backgroundColor: C.accent }]} />
            <Text style={[styles.logoText, { color: C.text }]}>FocusFlow</Text>
          </View>
          <Text style={[styles.tagline, { color: C.muted }]}>
            The smarter way to plan, focus & succeed.
          </Text>
        </View>

        {/* Links */}
        <View style={styles.linksRow}>
          {links.map((l) => (
            <TouchableOpacity
              key={l.label}
              onPress={() => onNavigate?.(l.screen)}
            >
              <Text style={[styles.footerLink, { color: C.muted }]}>
                {l.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Copyright strip */}
      <View
        style={[styles.copyrightStrip, { borderTopColor: C.border }]}
      >
        <Text style={[styles.copyright, { color: C.muted }]}>
          © {new Date().getFullYear()} FocusFlow · All rights reserved.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerOuter: { borderTopWidth: 1 },
  footerInner: {
    paddingTop: 48,
    paddingBottom: 32,
    alignSelf: 'center',
    width: '100%',
    justifyContent: 'space-between',
    gap: 32,
  },
  brand: { gap: 10, maxWidth: 280 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoDot: { width: 8, height: 8, borderRadius: 4 },
  logoText: { fontSize: 18, fontWeight: '700', fontStyle: 'italic' },
  tagline: { fontSize: 13, lineHeight: 20 },
  linksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    alignItems: 'center',
  },
  footerLink: { fontSize: 13 },
  copyrightStrip: {
    borderTopWidth: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  copyright: { fontSize: 12 },
});

export default Footer;
