// sections/ProblemSolutionSection.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useResponsive } from '../hooks/useResponsive';

const PROBLEMS = [
  'My study schedule is all over the place.',
  'I keep forgetting deadlines and exams.',
  "I don't know what to study next.",
  'I lose focus after 10 minutes.',
  'Studying feels overwhelming.',
];

const SOLUTIONS = [
  'AI builds your full schedule in seconds.',
  'Smart reminders before every deadline.',
  'AI tells you exactly what to study next.',
  'Pomodoro focus mode locks you in.',
  'One clear dashboard — no more chaos.',
];

/**
 * Side-by-side "Before / After" comparison columns.
 */
const ProblemSolutionSection = () => {
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
        <Text style={[styles.eyebrow, { color: C.accent }]}>SOUND FAMILIAR?</Text>
        <Text style={[styles.sectionTitle, { color: C.text }]}>
          Goodbye Chaos.{'\n'}
          <Text style={{ color: C.accent }}>Hello Control.</Text>
        </Text>

        <View
          style={[styles.problemWrap, isDesktop && styles.problemWrapRow]}
        >
          {/* Problem column */}
          <View
            style={[
              styles.col,
              {
                borderColor: 'rgba(255,100,100,0.15)',
                backgroundColor: C.isDark
                  ? 'rgba(255,100,100,0.04)'
                  : 'rgba(255,100,100,0.03)',
              },
              isDesktop ? { flex: 1, marginRight: 12 } : { marginBottom: 12 },
            ]}
          >
            <Text style={[styles.colHeader, { color: '#FF6B6B' }]}>
              😩 The Problem
            </Text>
            {PROBLEMS.map((p, i) => (
              <View key={i} style={styles.item}>
                <Text style={[styles.dot, { color: '#FF6B6B' }]}>✕</Text>
                <Text style={[styles.itemText, { color: C.muted }]}>{p}</Text>
              </View>
            ))}
          </View>

          {/* Solution column */}
          <View
            style={[
              styles.col,
              {
                borderColor: `${C.accent}25`,
                backgroundColor: C.isDark
                  ? 'rgba(200,245,102,0.04)'
                  : 'rgba(92,158,0,0.04)',
              },
              isDesktop ? { flex: 1 } : undefined,
            ]}
          >
            <Text style={[styles.colHeader, { color: C.accent }]}>
              ✅ FocusFlow Fixes It
            </Text>
            {SOLUTIONS.map((s, i) => (
              <View key={i} style={styles.item}>
                <Text style={[styles.dot, { color: C.accent }]}>✓</Text>
                <Text style={[styles.itemText, { color: C.mutedLight }]}>
                  {s}
                </Text>
              </View>
            ))}
          </View>
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
  problemWrap: { gap: 12 },
  problemWrapRow: { flexDirection: 'row', alignItems: 'stretch' },
  col: { borderWidth: 1, borderRadius: 20, padding: 24 },
  colHeader: { fontSize: 14, fontWeight: '700', marginBottom: 18 },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
  },
  dot: { fontSize: 13, width: 18, marginTop: 1 },
  itemText: { fontSize: 13, flex: 1, lineHeight: 20 },
});

export default ProblemSolutionSection;
