// screens/LandingScreen.tsx
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Platform } from 'react-native';


// Context
import { ThemeContext, DARK, LIGHT } from '../context/ThemeContext';

// Fixed layout
import Header from '../components/Header';
import Footer from '../components/Footer';

// Independent page sections
import HeroSection from '../sections/HeroSection';
import HowItWorksSection from '../sections/HowItWorksSection';
import ProblemSolutionSection from '../sections/ProblemSolutionSection';
import FeaturesSection from '../sections/FeaturesSection';
import FAQSection from '../sections/FAQSection';
import CTASection from '../sections/CTASection';

/**
 * LandingScreen
 *
 * Acts purely as a composition shell.
 * - ThemeContext wraps everything so all children can call useTheme()
 * - Header & Footer are fixed/reusable across every page
 * - Each Section is fully independent — drop in, remove, or reorder freely
 */
const LandingScreen = ({ navigation }: { navigation: any }) => {
  const [isDark, setIsDark] = useState(false);
  const C = isDark ? DARK : LIGHT;

  const navigate = (screen: string) => navigation.navigate(screen);

  return (
    <ThemeContext.Provider value={C}>
      <SafeAreaView style={[styles.root, Platform.OS === 'web' && styles.webRoot, { backgroundColor: C.bg }]}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={C.bg}
        />

        {/* ── Fixed Header (sticky on web) ─────────────────────────── */}
        <Header
          isDark={isDark}
          onToggleTheme={() => setIsDark((d) => !d)}
          onNavigate={navigate}
        />

        {/* ── Page sections ────────────────────────────────────────── */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <HeroSection onNavigate={navigate} />
          <HowItWorksSection />
          <ProblemSolutionSection />
          <FeaturesSection />
          <FAQSection />
          <CTASection onNavigate={navigate} />

          {/* ── Fixed Footer ─────────────────────────────────────────── */}
          <Footer onNavigate={navigate} />
        </ScrollView>
      </SafeAreaView>
    </ThemeContext.Provider>
  );
};

const styles = StyleSheet.create({
    root: {
    flex: 1,
  },
  scroll: { paddingBottom: 0 },
  webRoot: {
    height: '100vh' as any,
  },
});

export default LandingScreen;
