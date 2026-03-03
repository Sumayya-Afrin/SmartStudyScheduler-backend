// sections/FAQSection.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useResponsive } from '../hooks/useResponsive';

const FAQS = [
  {
    q: 'Is FocusFlow free to use?',
    a: 'Yes — FocusFlow is completely free to get started. Core features including AI study plans, reminders, and progress tracking are all included at no cost.',
  },
  {
    q: 'How does the AI create my study plan?',
    a: 'You tell FocusFlow your subjects, exam dates, and how many hours you have each day. The AI calculates the optimal plan and distributes topics across your available time.',
  },
  {
    q: 'Will it work for my exam schedule?',
    a: 'Absolutely. FocusFlow supports multiple subjects, custom deadlines, and adapts to any exam board or curriculum — school, college, or competitive exams.',
  },
  {
    q: 'Does it sync across devices?',
    a: 'Yes. Your study plan, tasks, and progress sync automatically across web, iOS, and Android. Start on your laptop, check in on your phone.',
  },
  {
    q: 'What is the Pomodoro feature?',
    a: "It's a built-in focus timer — 25 minutes of focused study followed by a 5-minute break. It tracks your streaks and helps you avoid burnout.",
  },
];

// ── FAQItem ───────────────────────────────────────────────────────────────────
const FAQItem = ({ q, a }: { q: string; a: string }) => {
  const C = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <TouchableOpacity
      style={[
        styles.faqItem,
        {
          backgroundColor: C.surface,
          borderColor: open ? `${C.accent}40` : C.border,
        },
      ]}
      onPress={() => setOpen(!open)}
      activeOpacity={0.8}
    >
      <View style={styles.faqRow}>
        <Text style={[styles.faqQ, { color: C.text }]}>{q}</Text>
        <Text style={[styles.faqIcon, { color: open ? C.accent : C.muted }]}>
          {open ? '−' : '+'}
        </Text>
      </View>
      {open && (
        <Text style={[styles.faqA, { color: C.muted }]}>{a}</Text>
      )}
    </TouchableOpacity>
  );
};

// ── Section ───────────────────────────────────────────────────────────────────
const FAQSection = () => {
  const C = useTheme();
  const { maxW, hPad, isDesktop } = useResponsive();

  return (
    <View
      style={[
        styles.sectionOuter,
        { paddingHorizontal: hPad, backgroundColor: C.bg },
      ]}
    >
      <View
        style={{
          maxWidth: isDesktop ? 720 : maxW,
          alignSelf: 'center',
          width: '100%',
        }}
      >
        <Text style={[styles.eyebrow, { color: C.accent }]}>FAQ</Text>
        <Text style={[styles.sectionTitle, { color: C.text }]}>
          Got questions?{'\n'}
          <Text style={{ color: C.muted, fontStyle: 'italic' }}>
            We've got answers.
          </Text>
        </Text>

        {FAQS.map((item, i) => (
          <FAQItem key={i} {...item} />
        ))}
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
  faqItem: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    marginBottom: 10,
  },
  faqRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQ: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    paddingRight: 12,
    lineHeight: 20,
  },
  faqIcon: { fontSize: 22 },
  faqA: { fontSize: 13, lineHeight: 21, marginTop: 12 },
});

export default FAQSection;
