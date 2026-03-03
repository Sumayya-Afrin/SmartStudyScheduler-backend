// sections/HowItWorksSection.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useResponsive } from '../hooks/useResponsive';
import { FadeIn } from '../components/primitives';

const STEPS = [
  {
    icon: '📋',
    title: 'Get Organized',
    desc: 'Tell FocusFlow your subjects, exam dates, and free hours. AI builds your full study schedule in seconds.',
  },
  {
    icon: '🎯',
    title: 'Stay on Track',
    desc: 'Smart reminders and daily task lists keep you focused. Every session is timed and logged automatically.',
  },
  {
    icon: '📈',
    title: 'See Your Progress',
    desc: 'Watch mastery grow topic by topic. The AI reshuffles your plan as you improve — always one step ahead.',
  },
];

// ── StepCard ──────────────────────────────────────────────────────────────────
const StepCard = ({
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
        styles.stepCard,
        { backgroundColor: C.surface, borderColor: C.border },
        style,
      ]}
    >
      <View
        style={[
          styles.stepIconWrap,
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
        <Text style={styles.stepIcon}>{icon}</Text>
      </View>
      <Text style={[styles.stepTitle, { color: C.text }]}>{title}</Text>
      <Text style={[styles.stepDesc, { color: C.muted }]}>{desc}</Text>
    </View>
  );
};

// ── Section ───────────────────────────────────────────────────────────────────
const HowItWorksSection = () => {
  const C = useTheme();
  const { maxW, hPad, isDesktop } = useResponsive();

  return (
    <View
      style={[
        styles.sectionOuter,
        { paddingHorizontal: hPad, backgroundColor: C.bg },
      ]}
    >
      <View style={{ maxWidth: maxW, alignSelf: 'center', width: '100%' }}>
        <Text style={[styles.eyebrow, { color: C.accent }]}>HOW IT WORKS</Text>
        <Text style={[styles.sectionTitle, { color: C.text }]}>
          The FocusFlow{'\n'}
          <Text style={{ color: C.muted, fontStyle: 'italic' }}>
            Study Method
          </Text>
        </Text>

        <View style={[styles.stepsWrap, isDesktop && styles.stepsWrapRow]}>
          {STEPS.map((s, i) => (
            <FadeIn
              key={i}
              delay={100 + i * 120}
              style={isDesktop ? { flex: 1 } : undefined}
            >
              <StepCard
                {...s}
                style={
                  isDesktop
                    ? { marginRight: i < 2 ? 12 : 0 }
                    : { marginBottom: 12 }
                }
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
  stepsWrap: { gap: 12 },
  stepsWrapRow: { flexDirection: 'row', alignItems: 'stretch' },
  stepCard: { borderWidth: 1, borderRadius: 20, padding: 24, flex: 1 },
  stepIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stepIcon: { fontSize: 24 },
  stepTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  stepDesc: { fontSize: 13, lineHeight: 21 },
});

export default HowItWorksSection;
