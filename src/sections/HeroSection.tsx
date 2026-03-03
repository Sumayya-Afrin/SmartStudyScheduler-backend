// sections/HeroSection.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useResponsive } from '../hooks/useResponsive';
import { FadeIn } from '../components/primitives';

interface HeroSectionProps {
  onNavigate: (screen: string) => void;
}

/**
 * Full-width hero with headline, sub-copy, CTA buttons and ambient orbs.
 */
const HeroSection = ({ onNavigate }: HeroSectionProps) => {
  const C = useTheme();
  const { maxW, hPad, isDesktop, isMobile } = useResponsive();

  const centerStyle = {
    width: '100%' as const,
    maxWidth: maxW,
    alignSelf: 'center' as const,
    paddingHorizontal: hPad,
  };

  return (
    <View style={[styles.heroOuter, { backgroundColor: C.bg }]}>
      {/* Ambient orbs */}
      <View
        style={[
          styles.orbBlue,
          !C.isDark && { backgroundColor: 'rgba(92,158,0,0.07)' },
        ]}
      />
      <View
        style={[
          styles.orbGreen,
          !C.isDark && { backgroundColor: 'rgba(59,130,246,0.06)' },
        ]}
      />

      <View style={[centerStyle, styles.heroInner]}>
        <FadeIn delay={100}>
          <Text
            style={[
              styles.heroTitle,
              isDesktop && styles.heroTitleLg,
              { color: C.text },
            ]}
          >
            The Smarter Way to{'\n'}
            <Text style={{ color: C.accent }}>Plan, Focus & Succeed.</Text>
          </Text>
        </FadeIn>

        <FadeIn delay={240}>
          <Text
            style={[
              styles.heroSub,
              isDesktop && styles.heroSubLg,
              { color: C.muted },
            ]}
          >
            Most students struggle with procrastination and missed deadlines.{'\n'}
            FocusFlow is here to change that — with AI-powered study plans built
            around your life.
          </Text>
        </FadeIn>

        <FadeIn delay={380}>
          <View
            style={[styles.heroBtns, !isMobile && styles.heroBtnsRow]}
          >
            <TouchableOpacity
              style={[
                styles.btnPrimary,
                { backgroundColor: C.accent },
                !isMobile && styles.btnPrimaryInline,
              ]}
              onPress={() => onNavigate('Auth')}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.btnPrimaryText,
                  { color: C.isDark ? C.bg : '#fff' },
                ]}
              >
                Get Started for Free →
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.btnGhost,
                { borderColor: C.border },
                !isMobile && styles.btnGhostInline,
              ]}
              activeOpacity={0.7}
            >
              <Text style={[styles.btnGhostText, { color: C.text }]}>
                ▶  See how it works
              </Text>
            </TouchableOpacity>
          </View>
        </FadeIn>

        <FadeIn delay={500}>
          <Text style={[styles.socialProof, { color: C.muted }]}>
            Trusted by students worldwide · Free to get started
          </Text>
        </FadeIn>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heroOuter: { overflow: 'hidden', paddingBottom: 72 },
  heroInner: { paddingTop: 80, alignItems: 'center' },
  orbBlue: {
    position: 'absolute',
    top: -60,
    right: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(91,142,255,0.1)',
  },
  orbGreen: {
    position: 'absolute',
    bottom: -40,
    left: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(200,245,102,0.07)',
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 44,
    letterSpacing: -0.8,
    marginBottom: 20,
  },
  heroTitleLg: { fontSize: 56, lineHeight: 68, marginBottom: 24 },
  heroSub: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 40,
    maxWidth: 540,
  },
  heroSubLg: { fontSize: 18, lineHeight: 30 },
  heroBtns: {
    width: '100%',
    alignItems: 'stretch',
    gap: 12,
    marginBottom: 28,
  },
  heroBtnsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
  },
  btnPrimary: {
    borderRadius: 100,
    paddingVertical: 16,
    paddingHorizontal: 28,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  btnPrimaryInline: { alignSelf: 'center', minWidth: 220 },
  btnPrimaryText: { fontWeight: '700', fontSize: 15 },
  btnGhost: {
    borderRadius: 100,
    paddingVertical: 16,
    paddingHorizontal: 28,
    alignItems: 'center',
    borderWidth: 1,
  },
  btnGhostInline: { alignSelf: 'center', minWidth: 180 },
  btnGhostText: { fontSize: 14 },
  socialProof: { fontSize: 12, textAlign: 'center' },
});

export default HeroSection;
