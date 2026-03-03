// sections/FeaturesSection.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useResponsive } from '../hooks/useResponsive';
import { FadeIn } from '../components/primitives';

const FEATURES = [
  {
    icon: '📅',
    title: 'AI Study Plans',
    desc: 'Personalized schedules based on your goals, deadlines, and available hours.',
  },
  {
    icon: '🧠',
    title: 'Adaptive Engine',
    desc: 'Your plan auto-adjusts as you learn — always optimized for you.',
  },
  {
    icon: '⏱',
    title: 'Pomodoro Mode',
    desc: 'Timed focus sessions with streak tracking to fight burnout.',
  },
  {
    icon: '📊',
    title: 'Progress Tracking',
    desc: 'Mastery scores per topic so you always know where you stand.',
  },
  {
    icon: '🔔',
    title: 'Smart Reminders',
    desc: 'Timely nudges before every exam, task, and study session.',
  },
  {
    icon: '🗓',
    title: 'Calendar Sync',
    desc: 'Two-way sync with Google Calendar and iCal built in.',
  },
];

// ── FeatureCard ───────────────────────────────────────────────────────────────
const FeatureCard = ({
  icon,
  title,
  desc,
  style,
}: {
  icon: string;
  title: string;
  desc: string;
  style?: any;
}) => {
  const C = useTheme();
  return (
    <View
      style={[
        styles.featureCard,
        { backgroundColor: C.surface, borderColor: C.border },
        style,
      ]}
    >
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={[styles.featureTitle, { color: C.text }]}>{title}</Text>
      <Text style={[styles.featureDesc, { color: C.muted }]}>{desc}</Text>
    </View>
  );
};

// ── Section ───────────────────────────────────────────────────────────────────
const FeaturesSection = () => {
  const C = useTheme();
  const { maxW, hPad, isDesktop, isTablet, width } = useResponsive();

  // Card width: 3-col on desktop, 2-col elsewhere
  const featureColW = isDesktop
    ? (maxW - hPad * 2 - 24) / 3
    : isTablet
    ? (width - hPad * 2 - 12) / 2
    : (width - 48 - 12) / 2;

  return (
    <View
      style={[
        styles.sectionOuter,
        { paddingHorizontal: hPad, backgroundColor: C.bg2 },
      ]}
    >
      <View style={{ maxWidth: maxW, alignSelf: 'center', width: '100%' }}>
        <Text style={[styles.eyebrow, { color: C.accent }]}>FEATURES</Text>
        <Text style={[styles.sectionTitle, { color: C.text }]}>
          Everything in{'\n'}
          <Text style={{ color: C.muted, fontStyle: 'italic' }}>one place.</Text>
        </Text>

        <View style={styles.featuresGrid}>
          {FEATURES.map((f, i) => (
            <FadeIn key={i} delay={80 * i}>
              <FeatureCard
                {...f}
                style={{ width: featureColW, marginBottom: 12 }}
              />
            </FadeIn>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionOuter: { paddingTop: 72, paddingBottom: 8 },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 36,
    marginBottom: 36,
  },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  featureCard: { borderWidth: 1, borderRadius: 20, padding: 22 },
  featureIcon: { fontSize: 26, marginBottom: 12 },
  featureTitle: { fontSize: 15, fontWeight: '700', marginBottom: 6 },
  featureDesc: { fontSize: 13, lineHeight: 19 },
});

export default FeaturesSection;
