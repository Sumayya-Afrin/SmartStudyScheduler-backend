// sections/CTASection.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useResponsive } from '../hooks/useResponsive';

interface CTASectionProps {
  onNavigate: (screen: string) => void;
}

/**
 * Full-width final call-to-action card with ambient orb effect.
 */
const CTASection = ({ onNavigate }: CTASectionProps) => {
  const C = useTheme();
  const { maxW, hPad, isDesktop, isMobile } = useResponsive();

  return (
    <View
      style={[
        styles.sectionOuter,
        { paddingHorizontal: hPad, backgroundColor: C.bg },
      ]}
    >
      <View
        style={[
          styles.ctaCard,
          {
            backgroundColor: C.surface,
            borderColor: C.border,
            maxWidth: maxW,
            alignSelf: 'center',
            width: '100%',
          },
        ]}
      >
        <View
          style={[
            styles.ctaOrb,
            {
              backgroundColor: C.isDark
                ? 'rgba(200,245,102,0.05)'
                : 'rgba(92,158,0,0.05)',
            },
          ]}
        />

        <Text
          style={[
            styles.ctaTitle,
            isDesktop && styles.ctaTitleLg,
            { color: C.text },
          ]}
        >
          Ready to get started?{'\n'}
          <Text style={{ color: C.accent }}>Take control today.</Text>
        </Text>

        <Text style={[styles.ctaSub, { color: C.muted }]}>
          Join thousands of students already on the waitlist.
        </Text>

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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionOuter: { paddingTop: 72, paddingBottom: 8 },
  ctaCard: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 48,
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 8,
  },
  ctaOrb: {
    position: 'absolute',
    top: -100,
    width: 340,
    height: 340,
    borderRadius: 170,
  },
  ctaTitle: {
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 40,
    marginBottom: 12,
  },
  ctaTitleLg: { fontSize: 42, lineHeight: 52 },
  ctaSub: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
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
});

export default CTASection;
