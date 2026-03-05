// App.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Platform, View, ActivityIndicator, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import linking from './src/navigation/linking';
import { handleGoogleWebCallback } from './src/services/Googleauth';
import { saveToken } from './src/utils/storage';

// Check for Google token BEFORE anything renders
const isGoogleCallback =
  Platform.OS === 'web' &&
  typeof window !== 'undefined' &&
  window.location.hash.includes('access_token');

export default function App() {
  const [isHandlingCallback, setIsHandlingCallback] = useState(isGoogleCallback);

  useEffect(() => {
    if (!isGoogleCallback) return;

    const handleCallback = async () => {
      try {
        const token = await handleGoogleWebCallback();
        if (token) {
          await saveToken(token);
          window.history.replaceState({}, document.title, '/dashboard');
          window.location.reload();
        } else {
          window.history.replaceState({}, document.title, '/auth');
          window.location.reload();
        }
      } catch (error) {
        console.error('Google callback failed:', error);
        window.history.replaceState({}, document.title, '/auth');
        window.location.reload();
      }
    };

    handleCallback();
  }, []);

  if (isHandlingCallback) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#C8F566" />
      </View>
    );
  }

  return (
    <NavigationContainer linking={linking}>
      <AppNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0B0E14',
  },
});