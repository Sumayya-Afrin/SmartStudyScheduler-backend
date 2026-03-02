// screens/LandingScreen.tsx
import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
  StatusBar,
  useWindowDimensions,
  Platform,
} from 'react-native';

// ── Theme ────────────────────────────────────────────────────────────────────
const DARK = {
  bg: '#0B0E14',
  bg2: '#0F1219',
  surface: '#161B28',
  border: 'rgba(255,255,255,0.07)',
  accent: '#C8F566',
  text: '#F0F2F8',
  muted: '#6B7390',
  mutedLight: '#9199B1',
  isDark: true,
};

const LIGHT = {
  bg: '#F7F8FA',
  bg2: '#EDEEF2',
  surface: '#FFFFFF',
  border: 'rgba(0,0,0,0.08)',
  accent: '#5C9E00',
  text: '#0F1117',
  muted: '#6B7390',
  mutedLight: '#8A92A8',
  isDark: false,
};

type Theme = typeof DARK;
const ThemeContext = createContext<Theme>(DARK);
const useTheme = () => useContext(ThemeContext);

// ── Responsive helpers ───────────────────────────────────────────────────────
const useResponsive = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 640 && width < 1024;
  const isMobile = width < 640;
  const maxW = Math.min(width, 1160);
  const hPad = isDesktop ? 80 : isTablet ? 40 : 24;
  return { width, isDesktop, isTablet, isMobile, maxW, hPad };
};

// ── Theme Toggle Button ──────────────────────────────────────────────────────
const ThemeToggle = ({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) => {
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
        { backgroundColor: isDark ? 'rgba(200,245,102,0.15)' : 'rgba(92,158,0,0.12)',
          borderColor: isDark ? 'rgba(200,245,102,0.25)' : 'rgba(92,158,0,0.2)' },
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

// ── Fade-in wrapper ──────────────────────────────────────────────────────────
const FadeIn = ({ children, delay = 0, style }: any) => {
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

// ── FAQ Item ─────────────────────────────────────────────────────────────────
const FAQItem = ({ q, a }: { q: string; a: string }) => {
  const C = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <TouchableOpacity
      style={[
        styles.faqItem,
        { backgroundColor: C.surface, borderColor: open ? `${C.accent}40` : C.border },
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
      {open && <Text style={[styles.faqA, { color: C.muted }]}>{a}</Text>}
    </TouchableOpacity>
  );
};

// ── Step Card ────────────────────────────────────────────────────────────────
const StepCard = ({ icon, title, desc, style }: any) => {
  const C = useTheme();
  return (
    <View style={[styles.stepCard, { backgroundColor: C.surface, borderColor: C.border }, style]}>
      <View style={[styles.stepIconWrap, {
        backgroundColor: C.isDark ? 'rgba(200,245,102,0.07)' : 'rgba(92,158,0,0.08)',
        borderColor: C.isDark ? 'rgba(200,245,102,0.12)' : 'rgba(92,158,0,0.15)',
      }]}>
        <Text style={styles.stepIcon}>{icon}</Text>
      </View>
      <Text style={[styles.stepTitle, { color: C.text }]}>{title}</Text>
      <Text style={[styles.stepDesc, { color: C.muted }]}>{desc}</Text>
    </View>
  );
};

// ── Feature Card ─────────────────────────────────────────────────────────────
const FeatureCard = ({ icon, title, desc, style }: any) => {
  const C = useTheme();
  return (
    <View style={[styles.featureCard, { backgroundColor: C.surface, borderColor: C.border }, style]}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={[styles.featureTitle, { color: C.text }]}>{title}</Text>
      <Text style={[styles.featureDesc, { color: C.muted }]}>{desc}</Text>
    </View>
  );
};

// ── Main ─────────────────────────────────────────────────────────────────────
const LandingScreen = ({ navigation }: { navigation: any }) => {
  const [isDark, setIsDark] = useState(false);
  const C = isDark ? DARK : LIGHT;
  const { width, isDesktop, isTablet, isMobile, maxW, hPad } = useResponsive();

  const bgAnim = useRef(new Animated.Value(isDark ? 0 : 1)).current;
  useEffect(() => {
    Animated.timing(bgAnim, {
      toValue: isDark ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isDark]);

  const centerStyle = {
    width: '100%' as const,
    maxWidth: maxW,
    alignSelf: 'center' as const,
    paddingHorizontal: hPad,
  };

  const featureColW = isDesktop
    ? (maxW - hPad * 2 - 24) / 3
    : isTablet
    ? (width - hPad * 2 - 12) / 2
    : (width - 48 - 12) / 2;

  return (
    <ThemeContext.Provider value={C}>
      <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={C.bg}
        />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>

          {/* ── NAV ───────────────────────────────────────────────────── */}
          <View style={[styles.navOuter, {
            borderBottomColor: C.border,
            backgroundColor: C.isDark ? `${C.bg}EE` : `${C.bg}F5`,
            ...(Platform.OS === 'web' ? { position: 'sticky' as any, top: 0, zIndex: 50 } : {}),
          }]}>
            <View style={[styles.navInner, { maxWidth: maxW, paddingHorizontal: hPad }]}>
              <View style={styles.logoRow}>
                <View style={[styles.logoDot, { backgroundColor: C.accent }]} />
                <Text style={[styles.logoText, { color: C.text }]}>FocusFlow</Text>
              </View>

              {isDesktop && (
                <View style={styles.navLinks}>
                  {['Features', 'How it works', 'Pricing', 'FAQ'].map((l) => (
                    <TouchableOpacity key={l}>
                      <Text style={[styles.navLink, { color: C.muted }]}>{l}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <View style={styles.navRight}>
                <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
                <TouchableOpacity onPress={() => navigation.navigate('Auth')}>
                  <Text style={[styles.navLogin, { color: C.muted }]}>Log in</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.navCta, { backgroundColor: C.accent }]}
                  onPress={() => navigation.navigate('Auth')}
                >
                  <Text style={[styles.navCtaText, { color: C.isDark ? C.bg : '#fff' }]}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* ── HERO ──────────────────────────────────────────────────── */}
          <View style={[styles.heroOuter, { backgroundColor: C.bg }]}>
            <View style={[styles.orbBlue, !isDark && { backgroundColor: 'rgba(92,158,0,0.07)' }]} />
            <View style={[styles.orbGreen, !isDark && { backgroundColor: 'rgba(59,130,246,0.06)' }]} />
            <View style={[centerStyle, styles.heroInner]}>
              <FadeIn delay={100}>
                <Text style={[styles.heroTitle, isDesktop && styles.heroTitleLg, { color: C.text }]}>
                  The Smarter Way to{'\n'}
                  <Text style={{ color: C.accent }}>Plan, Focus & Succeed.</Text>
                </Text>
              </FadeIn>

              <FadeIn delay={240}>
                <Text style={[styles.heroSub, isDesktop && styles.heroSubLg, { color: C.muted }]}>
                  Most students struggle with procrastination and missed deadlines.{'\n'}
                  FocusFlow is here to change that — with AI-powered study plans built around your life.
                </Text>
              </FadeIn>

              <FadeIn delay={380}>
                <View style={[styles.heroBtns, !isMobile && styles.heroBtnsRow]}>
                  <TouchableOpacity
                    style={[styles.btnPrimary, { backgroundColor: C.accent }, !isMobile && styles.btnPrimaryInline]}
                    onPress={() => navigation.navigate('Auth')}
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.btnPrimaryText, { color: C.isDark ? C.bg : '#fff' }]}>
                      Get Started for Free →
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btnGhost, { borderColor: C.border }, !isMobile && styles.btnGhostInline]}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.btnGhostText, { color: C.text }]}>▶  See how it works</Text>
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

          {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
          <View style={[styles.sectionOuter, { paddingHorizontal: hPad, backgroundColor: C.bg }]}>
            <View style={{ maxWidth: maxW, alignSelf: 'center', width: '100%' }}>
              <Text style={[styles.eyebrow, { color: C.accent }]}>HOW IT WORKS</Text>
              <Text style={[styles.sectionTitle, { color: C.text }]}>
                The FocusFlow{'\n'}
                <Text style={{ color: C.muted, fontStyle: 'italic' }}>Study Method</Text>
              </Text>
              <View style={[styles.stepsWrap, isDesktop && styles.stepsWrapRow]}>
                {[
                  { icon: '📋', title: 'Get Organized', desc: 'Tell FocusFlow your subjects, exam dates, and free hours. AI builds your full study schedule in seconds.' },
                  { icon: '🎯', title: 'Stay on Track', desc: 'Smart reminders and daily task lists keep you focused. Every session is timed and logged automatically.' },
                  { icon: '📈', title: 'See Your Progress', desc: 'Watch mastery grow topic by topic. The AI reshuffles your plan as you improve — always one step ahead.' },
                ].map((s, i) => (
                  <FadeIn key={i} delay={100 + i * 120} style={isDesktop ? { flex: 1 } : undefined}>
                    <StepCard {...s} style={isDesktop ? { marginRight: i < 2 ? 12 : 0 } : { marginBottom: 12 }} />
                  </FadeIn>
                ))}
              </View>
            </View>
          </View>

          {/* ── PROBLEM / SOLUTION ────────────────────────────────────── */}
          <View style={[styles.sectionOuter, { paddingHorizontal: hPad, backgroundColor: C.bg }]}>
            <View style={{ maxWidth: maxW, alignSelf: 'center', width: '100%' }}>
              <Text style={[styles.eyebrow, { color: C.accent }]}>SOUND FAMILIAR?</Text>
              <Text style={[styles.sectionTitle, { color: C.text }]}>
                Goodbye Chaos.{'\n'}
                <Text style={{ color: C.accent }}>Hello Control.</Text>
              </Text>
              <View style={[styles.problemWrap, isDesktop && styles.problemWrapRow]}>
                <View style={[
                  styles.problemCol,
                  { borderColor: 'rgba(255,100,100,0.15)', backgroundColor: C.isDark ? 'rgba(255,100,100,0.04)' : 'rgba(255,100,100,0.03)' },
                  isDesktop ? { flex: 1, marginRight: 12 } : { marginBottom: 12 },
                ]}>
                  <Text style={[styles.problemColHeader, { color: '#FF6B6B' }]}>😩 The Problem</Text>
                  {[
                    'My study schedule is all over the place.',
                    'I keep forgetting deadlines and exams.',
                    "I don't know what to study next.",
                    'I lose focus after 10 minutes.',
                    'Studying feels overwhelming.',
                  ].map((p, i) => (
                    <View key={i} style={styles.problemItem}>
                      <Text style={[styles.problemDot, { color: '#FF6B6B' }]}>✕</Text>
                      <Text style={[styles.problemText, { color: C.muted }]}>{p}</Text>
                    </View>
                  ))}
                </View>

                <View style={[
                  styles.problemCol,
                  { borderColor: `${C.accent}25`, backgroundColor: C.isDark ? 'rgba(200,245,102,0.04)' : 'rgba(92,158,0,0.04)' },
                  isDesktop ? { flex: 1 } : undefined,
                ]}>
                  <Text style={[styles.problemColHeader, { color: C.accent }]}>✅ FocusFlow Fixes It</Text>
                  {[
                    'AI builds your full schedule in seconds.',
                    'Smart reminders before every deadline.',
                    'AI tells you exactly what to study next.',
                    'Pomodoro focus mode locks you in.',
                    'One clear dashboard — no more chaos.',
                  ].map((s, i) => (
                    <View key={i} style={styles.problemItem}>
                      <Text style={[styles.problemDot, { color: C.accent }]}>✓</Text>
                      <Text style={[styles.problemText, { color: C.mutedLight }]}>{s}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* ── FEATURES ──────────────────────────────────────────────── */}
          <View style={[styles.sectionOuter, { paddingHorizontal: hPad, backgroundColor: C.bg2 }]}>
            <View style={{ maxWidth: maxW, alignSelf: 'center', width: '100%' }}>
              <Text style={[styles.eyebrow, { color: C.accent }]}>FEATURES</Text>
              <Text style={[styles.sectionTitle, { color: C.text }]}>
                Everything in{'\n'}
                <Text style={{ color: C.muted, fontStyle: 'italic' }}>one place.</Text>
              </Text>
              <View style={styles.featuresGrid}>
                {[
                  { icon: '📅', title: 'AI Study Plans', desc: 'Personalized schedules based on your goals, deadlines, and available hours.' },
                  { icon: '🧠', title: 'Adaptive Engine', desc: 'Your plan auto-adjusts as you learn — always optimized for you.' },
                  { icon: '⏱', title: 'Pomodoro Mode', desc: 'Timed focus sessions with streak tracking to fight burnout.' },
                  { icon: '📊', title: 'Progress Tracking', desc: 'Mastery scores per topic so you always know where you stand.' },
                  { icon: '🔔', title: 'Smart Reminders', desc: 'Timely nudges before every exam, task, and study session.' },
                  { icon: '🗓', title: 'Calendar Sync', desc: 'Two-way sync with Google Calendar and iCal built in.' },
                ].map((f, i) => (
                  <FadeIn key={i} delay={80 * i}>
                    <FeatureCard {...f} style={{ width: featureColW, marginBottom: 12 }} />
                  </FadeIn>
                ))}
              </View>
            </View>
          </View>

          {/* ── FAQ ───────────────────────────────────────────────────── */}
          <View style={[styles.sectionOuter, { paddingHorizontal: hPad, backgroundColor: C.bg }]}>
            <View style={{ maxWidth: isDesktop ? 720 : maxW, alignSelf: 'center', width: '100%' }}>
              <Text style={[styles.eyebrow, { color: C.accent }]}>FAQ</Text>
              <Text style={[styles.sectionTitle, { color: C.text }]}>
                Got questions?{'\n'}
                <Text style={{ color: C.muted, fontStyle: 'italic' }}>We've got answers.</Text>
              </Text>
              <FAQItem q="Is FocusFlow free to use?" a="Yes — FocusFlow is completely free to get started. Core features including AI study plans, reminders, and progress tracking are all included at no cost." />
              <FAQItem q="How does the AI create my study plan?" a="You tell FocusFlow your subjects, exam dates, and how many hours you have each day. The AI calculates the optimal plan and distributes topics across your available time." />
              <FAQItem q="Will it work for my exam schedule?" a="Absolutely. FocusFlow supports multiple subjects, custom deadlines, and adapts to any exam board or curriculum — school, college, or competitive exams." />
              <FAQItem q="Does it sync across devices?" a="Yes. Your study plan, tasks, and progress sync automatically across web, iOS, and Android. Start on your laptop, check in on your phone." />
              <FAQItem q="What is the Pomodoro feature?" a="It's a built-in focus timer — 25 minutes of focused study followed by a 5-minute break. It tracks your streaks and helps you avoid burnout." />
            </View>
          </View>

          {/* ── FINAL CTA ─────────────────────────────────────────────── */}
          <View style={[styles.sectionOuter, { paddingHorizontal: hPad, backgroundColor: C.bg }]}>
            <View style={[styles.ctaCard, {
              backgroundColor: C.surface,
              borderColor: C.border,
              maxWidth: maxW, alignSelf: 'center', width: '100%',
            }]}>
              <View style={[styles.ctaOrb, { backgroundColor: C.isDark ? 'rgba(200,245,102,0.05)' : 'rgba(92,158,0,0.05)' }]} />
              <Text style={[styles.ctaTitle, isDesktop && styles.ctaTitleLg, { color: C.text }]}>
                Ready to get started?{'\n'}
                <Text style={{ color: C.accent }}>Take control today.</Text>
              </Text>
              <Text style={[styles.ctaSub, { color: C.muted }]}>
                Join thousands of students already on the waitlist.
              </Text>
              <TouchableOpacity
                style={[styles.btnPrimary, { backgroundColor: C.accent }, !isMobile && styles.btnPrimaryInline]}
                onPress={() => navigation.navigate('Auth')}
                activeOpacity={0.85}
              >
                <Text style={[styles.btnPrimaryText, { color: C.isDark ? C.bg : '#fff' }]}>
                  Get Started for Free →
                </Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </ThemeContext.Provider>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },

  // TOGGLE
  toggleTrack: {
    width: 52, height: 28, borderRadius: 14,
    borderWidth: 1, flexDirection: 'row',
    alignItems: 'center', paddingHorizontal: 4,
    position: 'relative', justifyContent: 'space-between',
  },
  toggleIconLeft: { fontSize: 12, zIndex: 0 },
  toggleIconRight: { fontSize: 12, zIndex: 0 },
  toggleThumb: {
    position: 'absolute', left: 3,
    width: 22, height: 22, borderRadius: 11,
    zIndex: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 3,
  },

  // NAV
  navOuter: { borderBottomWidth: 1 },
  navInner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 16, alignSelf: 'center', width: '100%',
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoDot: { width: 8, height: 8, borderRadius: 4 },
  logoText: { fontSize: 18, fontWeight: '700', fontStyle: 'italic' },
  navLinks: { flexDirection: 'row', gap: 32 },
  navLink: { fontSize: 14 },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  navLogin: { fontSize: 14 },
  navCta: { borderRadius: 100, paddingVertical: 9, paddingHorizontal: 22 },
  navCtaText: { fontWeight: '700', fontSize: 14 },

  // HERO
  heroOuter: { overflow: 'hidden', paddingBottom: 72 },
  heroInner: { paddingTop: 80, alignItems: 'center' },
  orbBlue: {
    position: 'absolute', top: -60, right: -100, width: 400, height: 400,
    borderRadius: 200, backgroundColor: 'rgba(91,142,255,0.1)',
  },
  orbGreen: {
    position: 'absolute', bottom: -40, left: -80, width: 300, height: 300,
    borderRadius: 150, backgroundColor: 'rgba(200,245,102,0.07)',
  },
  heroTitle: {
    fontSize: 34, fontWeight: '900',
    textAlign: 'center', lineHeight: 44, letterSpacing: -0.8, marginBottom: 20,
  },
  heroTitleLg: { fontSize: 56, lineHeight: 68, marginBottom: 24 },
  heroSub: {
    fontSize: 15, textAlign: 'center',
    lineHeight: 26, marginBottom: 40, maxWidth: 540,
  },
  heroSubLg: { fontSize: 18, lineHeight: 30 },
  heroBtns: { width: '100%', alignItems: 'stretch', gap: 12, marginBottom: 28 },
  heroBtnsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 'auto' },
  btnPrimary: {
    borderRadius: 100, paddingVertical: 16, paddingHorizontal: 28, alignItems: 'center',
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 6,
  },
  btnPrimaryInline: { alignSelf: 'center', minWidth: 220 },
  btnPrimaryText: { fontWeight: '700', fontSize: 15 },
  btnGhost: {
    borderRadius: 100, paddingVertical: 16, paddingHorizontal: 28,
    alignItems: 'center', borderWidth: 1,
  },
  btnGhostInline: { alignSelf: 'center', minWidth: 180 },
  btnGhostText: { fontSize: 14 },
  socialProof: { fontSize: 12, textAlign: 'center' },

  // SECTION
  sectionOuter: { paddingTop: 72, paddingBottom: 8 },
  eyebrow: {
    fontSize: 11, fontWeight: '700', textTransform: 'uppercase',
    letterSpacing: 2, marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 28, fontWeight: '800',
    letterSpacing: -0.5, lineHeight: 36, marginBottom: 36,
  },

  // STEPS
  stepsWrap: { gap: 12 },
  stepsWrapRow: { flexDirection: 'row', alignItems: 'stretch' },
  stepCard: {
    borderWidth: 1, borderRadius: 20, padding: 24, flex: 1,
  },
  stepIconWrap: {
    width: 52, height: 52, borderRadius: 14, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  stepIcon: { fontSize: 24 },
  stepTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  stepDesc: { fontSize: 13, lineHeight: 21 },

  // PROBLEM/SOLUTION
  problemWrap: { gap: 12 },
  problemWrapRow: { flexDirection: 'row', alignItems: 'stretch' },
  problemCol: { borderWidth: 1, borderRadius: 20, padding: 24 },
  problemColHeader: { fontSize: 14, fontWeight: '700', marginBottom: 18 },
  problemItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 12 },
  problemDot: { fontSize: 13, width: 18, marginTop: 1 },
  problemText: { fontSize: 13, flex: 1, lineHeight: 20 },

  // FEATURES
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  featureCard: { borderWidth: 1, borderRadius: 20, padding: 22 },
  featureIcon: { fontSize: 26, marginBottom: 12 },
  featureTitle: { fontSize: 15, fontWeight: '700', marginBottom: 6 },
  featureDesc: { fontSize: 13, lineHeight: 19 },

  // FAQ
  faqItem: { borderWidth: 1, borderRadius: 16, padding: 20, marginBottom: 10 },
  faqRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQ: { fontSize: 14, fontWeight: '600', flex: 1, paddingRight: 12, lineHeight: 20 },
  faqIcon: { fontSize: 22 },
  faqA: { fontSize: 13, lineHeight: 21, marginTop: 12 },

  // CTA
  ctaCard: {
    borderWidth: 1, borderRadius: 28, padding: 48,
    alignItems: 'center', overflow: 'hidden', marginBottom: 8,
  },
  ctaOrb: {
    position: 'absolute', top: -100, width: 340, height: 340, borderRadius: 170,
  },
  ctaTitle: {
    fontSize: 30, fontWeight: '900',
    textAlign: 'center', letterSpacing: -0.5, lineHeight: 40, marginBottom: 12,
  },
  ctaTitleLg: { fontSize: 42, lineHeight: 52 },
  ctaSub: { fontSize: 15, textAlign: 'center', lineHeight: 24, marginBottom: 32 },
});

export default LandingScreen;
