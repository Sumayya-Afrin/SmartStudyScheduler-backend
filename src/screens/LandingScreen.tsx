// screens/LandingScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
  StatusBar,
  Dimensions,
  useWindowDimensions,
  Platform,
} from 'react-native';

const C = {
  bg: '#0B0E14',
  bg2: '#0F1219',
  surface: '#161B28',
  border: 'rgba(255,255,255,0.07)',
  accent: '#C8F566',
  text: '#F0F2F8',
  muted: '#6B7390',
  mutedLight: '#9199B1',
};

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
  const [open, setOpen] = useState(false);
  return (
    <TouchableOpacity
      style={[styles.faqItem, open && styles.faqItemOpen]}
      onPress={() => setOpen(!open)}
      activeOpacity={0.8}
    >
      <View style={styles.faqRow}>
        <Text style={styles.faqQ}>{q}</Text>
        <Text style={[styles.faqIcon, open && { color: C.accent }]}>{open ? '−' : '+'}</Text>
      </View>
      {open && <Text style={styles.faqA}>{a}</Text>}
    </TouchableOpacity>
  );
};

// ── Testimonial Card ─────────────────────────────────────────────────────────
const TestimonialCard = ({
  name, role, quote, style,
}: { name: string; role: string; quote: string; style?: any }) => (
  <View style={[styles.testimonialCard, style]}>
    <Text style={styles.testimonialQuote}>"{quote}"</Text>
    <View style={styles.testimonialAuthor}>
      <View style={styles.testimonialAvatar}>
        <Text style={styles.testimonialAvatarText}>{name[0]}</Text>
      </View>
      <View>
        <Text style={styles.testimonialName}>{name}</Text>
        <Text style={styles.testimonialRole}>{role}</Text>
      </View>
    </View>
  </View>
);

// ── Step Card ────────────────────────────────────────────────────────────────
const StepCard = ({ icon, title, desc, style }: any) => (
  <View style={[styles.stepCard, style]}>
    <View style={styles.stepIconWrap}>
      <Text style={styles.stepIcon}>{icon}</Text>
    </View>
    <Text style={styles.stepTitle}>{title}</Text>
    <Text style={styles.stepDesc}>{desc}</Text>
  </View>
);

// ── Feature Card ─────────────────────────────────────────────────────────────
const FeatureCard = ({ icon, title, desc, style }: any) => (
  <View style={[styles.featureCard, style]}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDesc}>{desc}</Text>
  </View>
);

// ── Main ─────────────────────────────────────────────────────────────────────
const LandingScreen = ({ navigation }: { navigation: any }) => {
  const { width, isDesktop, isTablet, isMobile, maxW, hPad } = useResponsive();

  const centerStyle = {
    width: '100%' as const,
    maxWidth: maxW,
    alignSelf: 'center' as const,
    paddingHorizontal: hPad,
  };

  // Grid column widths
  const featureColW = isDesktop
    ? (maxW - hPad * 2 - 24) / 3
    : isTablet
    ? (width - hPad * 2 - 12) / 2
    : (width - 48 - 12) / 2;

  const testimonialColW = isDesktop
    ? (maxW - hPad * 2 - 24) / 3
    : width - hPad * 2;

  const stepColW = isDesktop
    ? (maxW - hPad * 2 - 24) / 3
    : width - hPad * 2;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>

        {/* ── NAV ─────────────────────────────────────────────────────── */}
        <View style={styles.navOuter}>
          <View style={[styles.navInner, { maxWidth: maxW, paddingHorizontal: hPad }]}>
            <View style={styles.logoRow}>
              <View style={styles.logoDot} />
              <Text style={styles.logoText}>FocusFlow</Text>
            </View>
            {/* Nav links — only on desktop */}
            {isDesktop && (
              <View style={styles.navLinks}>
                {['Features', 'How it works', 'Pricing', 'FAQ'].map((l) => (
                  <TouchableOpacity key={l}>
                    <Text style={styles.navLink}>{l}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <View style={styles.navRight}>
              <TouchableOpacity onPress={() => navigation.navigate('Auth')}>
                <Text style={styles.navLogin}>Log in</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navCta} onPress={() => navigation.navigate('Auth')}>
                <Text style={styles.navCtaText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── HERO ────────────────────────────────────────────────────── */}
        <View style={styles.heroOuter}>
          <View style={styles.orbBlue} />
          <View style={styles.orbGreen} />
          <View style={[centerStyle, styles.heroInner]}>
            <FadeIn delay={100}>
              <Text style={[styles.heroTitle, isDesktop && styles.heroTitleLg]}>
                The Smarter Way to{'\n'}
                <Text style={styles.heroAccent}>Plan, Focus & Succeed.</Text>
              </Text>
            </FadeIn>

            <FadeIn delay={240}>
              <Text style={[styles.heroSub, isDesktop && styles.heroSubLg]}>
                Most students struggle with procrastination and missed deadlines.{'\n'}
                FocusFlow is here to change that — with AI-powered study plans built around your life.
              </Text>
            </FadeIn>

            {/* Buttons — stacked on mobile, inline on tablet+ */}
            <FadeIn delay={380}>
              <View style={[styles.heroBtns, !isMobile && styles.heroBtnsRow]}>
                <TouchableOpacity
                  style={[styles.btnPrimary, !isMobile && styles.btnPrimaryInline]}
                  onPress={() => navigation.navigate('Auth')}
                  activeOpacity={0.85}
                >
                  <Text style={styles.btnPrimaryText}>Get Started for Free →</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btnGhost, !isMobile && styles.btnGhostInline]}
                  activeOpacity={0.7}
                >
                  <Text style={styles.btnGhostText}>▶  See how it works</Text>
                </TouchableOpacity>
              </View>
            </FadeIn>

            <FadeIn delay={500}>
              <Text style={styles.socialProof}>
                Trusted by students worldwide · Free to get started
              </Text>
            </FadeIn>
          </View>
        </View>

        {/* ── HOW IT WORKS ────────────────────────────────────────────── */}
        <View style={[styles.sectionOuter, { paddingHorizontal: hPad }]}>
          <View style={{ maxWidth: maxW, alignSelf: 'center', width: '100%' }}>
            <Text style={styles.eyebrow}>HOW IT WORKS</Text>
            <Text style={styles.sectionTitle}>
              The FocusFlow{'\n'}<Text style={styles.mutedItalic}>Study Method</Text>
            </Text>
            {/* Row on desktop, column on mobile */}
            <View style={[styles.stepsWrap, isDesktop && styles.stepsWrapRow]}>
              {[
                { icon: '📋', title: 'Get Organized', desc: 'Tell FocusFlow your subjects, exam dates, and free hours. AI builds your full study schedule in seconds.' },
                { icon: '🎯', title: 'Stay on Track', desc: 'Smart reminders and daily task lists keep you focused. Every session is timed and logged automatically.' },
                { icon: '📈', title: 'See Your Progress', desc: 'Watch mastery grow topic by topic. The AI reshuffles your plan as you improve — always one step ahead.' },
              ].map((s, i) => (
                <FadeIn key={i} delay={100 + i * 120}
                  style={isDesktop ? { flex: 1 } : undefined}>
                  <StepCard {...s}
                    style={isDesktop
                      ? { marginRight: i < 2 ? 12 : 0 }
                      : { marginBottom: 12 }}
                  />
                </FadeIn>
              ))}
            </View>
          </View>
        </View>

        {/* ── PROBLEM / SOLUTION ──────────────────────────────────────── */}
        <View style={[styles.sectionOuter, { paddingHorizontal: hPad }]}>
          <View style={{ maxWidth: maxW, alignSelf: 'center', width: '100%' }}>
            <Text style={styles.eyebrow}>SOUND FAMILIAR?</Text>
            <Text style={styles.sectionTitle}>
              Goodbye Chaos.{'\n'}<Text style={styles.accentText}>Hello Control.</Text>
            </Text>
            <View style={[styles.problemWrap, isDesktop && styles.problemWrapRow]}>
              {/* Problem */}
              <View style={[
                styles.problemCol,
                { borderColor: 'rgba(255,100,100,0.15)', backgroundColor: 'rgba(255,100,100,0.04)' },
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
                    <Text style={styles.problemText}>{p}</Text>
                  </View>
                ))}
              </View>
              {/* Solution */}
              <View style={[
                styles.problemCol,
                { borderColor: 'rgba(200,245,102,0.15)', backgroundColor: 'rgba(200,245,102,0.04)' },
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

        {/* ── FEATURES ────────────────────────────────────────────────── */}
        <View style={[styles.sectionOuter, { paddingHorizontal: hPad }]}>
          <View style={{ maxWidth: maxW, alignSelf: 'center', width: '100%' }}>
            <Text style={styles.eyebrow}>FEATURES</Text>
            <Text style={styles.sectionTitle}>
              Everything in{'\n'}<Text style={styles.mutedItalic}>one place.</Text>
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

        {/* ── TESTIMONIALS ────────────────────────────────────────────── */}
        <View style={[styles.sectionOuter, { paddingHorizontal: hPad, backgroundColor: C.bg2 }]}>
          <View style={{ maxWidth: maxW, alignSelf: 'center', width: '100%' }}>
            <Text style={styles.eyebrow}>STUDENTS LOVE IT</Text>
            <Text style={styles.sectionTitle}>
              Real students,{'\n'}<Text style={styles.accentText}>real results.</Text>
            </Text>
            <View style={[styles.testimonialsWrap, isDesktop && styles.testimonialsWrapRow]}>
              {[
                { name: 'Priya S', role: 'Engineering Student, IIT Delhi', quote: "FocusFlow's AI plan completely changed how I prepare for exams. I finished revision 3 days early." },
                { name: 'James A', role: 'First Year, Uni of Melbourne', quote: "I haven't missed a single deadline since using FocusFlow. The reminders are actually smart." },
                { name: 'Aarav M', role: 'Grade 12 Student, Hyderabad', quote: "The Pomodoro mode is a game changer. I actually get through 2-hour sessions without distraction." },
              ].map((t, i) => (
                <TestimonialCard key={i} {...t}
                  style={isDesktop
                    ? { flex: 1, marginRight: i < 2 ? 12 : 0 }
                    : { marginBottom: 12 }}
                />
              ))}
            </View>
          </View>
        </View>

        {/* ── FAQ ─────────────────────────────────────────────────────── */}
        <View style={[styles.sectionOuter, { paddingHorizontal: hPad }]}>
          <View style={{ maxWidth: isDesktop ? 720 : maxW, alignSelf: 'center', width: '100%' }}>
            <Text style={styles.eyebrow}>FAQ</Text>
            <Text style={styles.sectionTitle}>
              Got questions?{'\n'}<Text style={styles.mutedItalic}>We've got answers.</Text>
            </Text>
            <FAQItem q="Is FocusFlow free to use?" a="Yes — FocusFlow is completely free to get started. Core features including AI study plans, reminders, and progress tracking are all included at no cost." />
            <FAQItem q="How does the AI create my study plan?" a="You tell FocusFlow your subjects, exam dates, and how many hours you have each day. The AI calculates the optimal plan and distributes topics across your available time." />
            <FAQItem q="Will it work for my exam schedule?" a="Absolutely. FocusFlow supports multiple subjects, custom deadlines, and adapts to any exam board or curriculum — school, college, or competitive exams." />
            <FAQItem q="Does it sync across devices?" a="Yes. Your study plan, tasks, and progress sync automatically across web, iOS, and Android. Start on your laptop, check in on your phone." />
            <FAQItem q="What is the Pomodoro feature?" a="It's a built-in focus timer — 25 minutes of focused study followed by a 5-minute break. It tracks your streaks and helps you avoid burnout." />
          </View>
        </View>

        {/* ── FINAL CTA ───────────────────────────────────────────────── */}
        <View style={[styles.sectionOuter, { paddingHorizontal: hPad }]}>
          <View style={[styles.ctaCard, { maxWidth: maxW, alignSelf: 'center', width: '100%' }]}>
            <View style={styles.ctaOrb} />
            <Text style={[styles.ctaTitle, isDesktop && styles.ctaTitleLg]}>
              Ready to get started?{'\n'}
              <Text style={styles.accentText}>Take control today.</Text>
            </Text>
            <Text style={styles.ctaSub}>
              Join thousands of students already on the waitlist.
            </Text>
            <TouchableOpacity
              style={[styles.btnPrimary, !isMobile && styles.btnPrimaryInline]}
              onPress={() => navigation.navigate('Auth')}
              activeOpacity={0.85}
            >
              <Text style={styles.btnPrimaryText}>Get Started for Free →</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  // NAV
  navOuter: {
    borderBottomWidth: 1, borderBottomColor: C.border,
    backgroundColor: `${C.bg}EE`,
    ...(Platform.OS === 'web' ? { position: 'sticky' as any, top: 0, zIndex: 50 } : {}),
  },
  navInner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 16, alignSelf: 'center', width: '100%',
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.accent },
  logoText: { fontSize: 18, fontWeight: '700', fontStyle: 'italic', color: C.text },
  navLinks: { flexDirection: 'row', gap: 32 },
  navLink: { fontSize: 14, color: C.muted },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  navLogin: { fontSize: 14, color: C.muted },
  navCta: { backgroundColor: C.accent, borderRadius: 100, paddingVertical: 9, paddingHorizontal: 22 },
  navCtaText: { color: C.bg, fontWeight: '700', fontSize: 14 },

  // HERO
  heroOuter: {
    overflow: 'hidden', paddingBottom: 72,
  },
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
    fontSize: 34, fontWeight: '900', color: C.text,
    textAlign: 'center', lineHeight: 44, letterSpacing: -0.8, marginBottom: 20,
  },
  heroTitleLg: { fontSize: 56, lineHeight: 68, marginBottom: 24 },
  heroAccent: { color: C.accent },
  heroSub: {
    fontSize: 15, color: C.muted, textAlign: 'center',
    lineHeight: 26, marginBottom: 40, maxWidth: 540,
  },
  heroSubLg: { fontSize: 18, lineHeight: 30 },
  heroBtns: { width: '100%', alignItems: 'stretch', gap: 12, marginBottom: 28 },
  heroBtnsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 'auto' },
  btnPrimary: {
    backgroundColor: C.accent, borderRadius: 100,
    paddingVertical: 16, paddingHorizontal: 28, alignItems: 'center',
    shadowColor: C.accent, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25, shadowRadius: 16, elevation: 6,
  },
  btnPrimaryInline: { alignSelf: 'center', minWidth: 220 },
  btnPrimaryText: { color: C.bg, fontWeight: '700', fontSize: 15 },
  btnGhost: {
    borderRadius: 100, paddingVertical: 16, paddingHorizontal: 28,
    alignItems: 'center', borderWidth: 1, borderColor: C.border,
  },
  btnGhostInline: { alignSelf: 'center', minWidth: 180 },
  btnGhostText: { color: C.text, fontSize: 14 },
  socialProof: { fontSize: 12, color: C.muted, textAlign: 'center' },

  // SECTION
  sectionOuter: { paddingTop: 72, paddingBottom: 8 },
  eyebrow: {
    fontSize: 11, fontWeight: '700', textTransform: 'uppercase',
    letterSpacing: 2, color: C.accent, marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 28, fontWeight: '800', color: C.text,
    letterSpacing: -0.5, lineHeight: 36, marginBottom: 36,
  },
  mutedItalic: { color: C.muted, fontStyle: 'italic' },
  accentText: { color: C.accent },

  // STEPS
  stepsWrap: { gap: 12 },
  stepsWrapRow: { flexDirection: 'row', alignItems: 'stretch' },
  stepCard: {
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
    borderRadius: 20, padding: 24, flex: 1,
  },
  stepIconWrap: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: 'rgba(200,245,102,0.07)',
    borderWidth: 1, borderColor: 'rgba(200,245,102,0.12)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  stepIcon: { fontSize: 24 },
  stepTitle: { fontSize: 16, fontWeight: '700', color: C.text, marginBottom: 8 },
  stepDesc: { fontSize: 13, color: C.muted, lineHeight: 21 },

  // PROBLEM/SOLUTION
  problemWrap: { gap: 12 },
  problemWrapRow: { flexDirection: 'row', alignItems: 'stretch' },
  problemCol: { borderWidth: 1, borderRadius: 20, padding: 24 },
  problemColHeader: { fontSize: 14, fontWeight: '700', marginBottom: 18 },
  problemItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 12 },
  problemDot: { fontSize: 13, width: 18, marginTop: 1 },
  problemText: { fontSize: 13, color: C.muted, flex: 1, lineHeight: 20 },
  mutedLight: { color: C.mutedLight },

  // FEATURES
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  featureCard: {
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
    borderRadius: 20, padding: 22,
  },
  featureIcon: { fontSize: 26, marginBottom: 12 },
  featureTitle: { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 6 },
  featureDesc: { fontSize: 13, color: C.muted, lineHeight: 19 },

  // TESTIMONIALS
  testimonialsWrap: { gap: 12 },
  testimonialsWrapRow: { flexDirection: 'row', alignItems: 'stretch' },
  testimonialCard: {
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
    borderRadius: 20, padding: 24,
  },
  testimonialQuote: { fontSize: 14, color: C.mutedLight, lineHeight: 23, marginBottom: 18, fontStyle: 'italic' },
  testimonialAuthor: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  testimonialAvatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(200,245,102,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  testimonialAvatarText: { fontSize: 15, fontWeight: '700', color: C.accent },
  testimonialName: { fontSize: 13, fontWeight: '700', color: C.text },
  testimonialRole: { fontSize: 12, color: C.muted },

  // FAQ
  faqItem: {
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
    borderRadius: 16, padding: 20, marginBottom: 10,
  },
  faqItemOpen: { borderColor: 'rgba(200,245,102,0.25)' },
  faqRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQ: { fontSize: 14, fontWeight: '600', color: C.text, flex: 1, paddingRight: 12, lineHeight: 20 },
  faqIcon: { fontSize: 22, color: C.muted },
  faqA: { fontSize: 13, color: C.muted, lineHeight: 21, marginTop: 12 },

  // CTA
  ctaCard: {
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
    borderRadius: 28, padding: 48,
    alignItems: 'center', overflow: 'hidden', marginBottom: 8,
  },
  ctaOrb: {
    position: 'absolute', top: -100, width: 340, height: 340,
    borderRadius: 170, backgroundColor: 'rgba(200,245,102,0.05)',
  },
  ctaTitle: {
    fontSize: 30, fontWeight: '900', color: C.text,
    textAlign: 'center', letterSpacing: -0.5, lineHeight: 40, marginBottom: 12,
  },
  ctaTitleLg: { fontSize: 42, lineHeight: 52 },
  ctaSub: {
    fontSize: 15, color: C.muted, textAlign: 'center', lineHeight: 24, marginBottom: 32,
  },
});

export default LandingScreen;
