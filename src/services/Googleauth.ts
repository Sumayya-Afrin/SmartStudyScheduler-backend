// services/googleAuth.ts
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import api from './api';
import type { AuthResponse } from '../types';

// Required for expo-web-browser to properly close after OAuth on mobile
WebBrowser.maybeCompleteAuthSession();

/**
 * Step 1 — Ask our backend for the Google OAuth URL.
 * Backend uses Supabase server-side to generate it.
 * Optional redirectTo param for mobile deep links.
 */
const getGoogleOAuthUrl = async (redirectTo?: string): Promise<string> => {
  const response = await api.get<{ url: string }>('/auth/google/url', {
    params: redirectTo ? { redirectTo } : {},
  });
  return response.data.url;
};

/**
 * Main entry point — called when user taps "Continue with Google".
 * WEB:    redirects browser to Google, App.tsx handles the return.
 * MOBILE: opens in-app browser, extracts token, exchanges with backend.
 */
export const signInWithGoogle = async (): Promise<string> => {
  if (Platform.OS === 'web') {
    return await signInWithGoogleWeb();
  } else {
    return await signInWithGoogleMobile();
  }
};

// ── Web ───────────────────────────────────────────────────────────────────────
const signInWithGoogleWeb = async (): Promise<string> => {
  const url = await getGoogleOAuthUrl();

  // Redirect the browser to Google login.
  // After the user logs in, Google → Supabase → back to your app URL.
  // App.tsx picks up the token from the URL hash on return.
  window.location.href = url;

  // Return empty string — App.tsx handleGoogleWebCallback() takes over
  return '';
};

// ── Mobile ────────────────────────────────────────────────────────────────────
const signInWithGoogleMobile = async (): Promise<string> => {
  // Deep link that Google will redirect back to on mobile
  const redirectUrl = Linking.createURL('auth/callback');

  // Get OAuth URL from backend, passing our mobile redirect
  const oauthUrl = await getGoogleOAuthUrl(redirectUrl);

  // Open Google login in an in-app browser
  const result = await WebBrowser.openAuthSessionAsync(oauthUrl, redirectUrl);

  if (result.type !== 'success') {
    throw new Error('Google sign-in was cancelled or failed.');
  }

  // Extract tokens from the redirect URL (they come back in the hash)
  const params = new URLSearchParams(
    result.url.split('#')[1] || result.url.split('?')[1] || ''
  );
  const accessToken = params.get('access_token');

  if (!accessToken) throw new Error('No access token returned from Google.');

  // Exchange Supabase token with our backend → get our own JWT back
  const response = await api.post<AuthResponse>('/auth/google/callback', {
    access_token: accessToken,
    refresh_token: params.get('refresh_token') || '',
  });

  return response.data.token;
};

/**
 * Called once in App.tsx on web after Google redirects back.
 * Reads the Supabase token from the URL hash,
 * exchanges it with our backend for our own JWT.
 * Returns our JWT on success, null if no token found in URL.
 */
export const handleGoogleWebCallback = async (): Promise<string | null> => {
  if (Platform.OS !== 'web') return null;

  const hash = window.location.hash;
  if (!hash) return null;

  const params = new URLSearchParams(hash.replace('#', ''));
  const accessToken = params.get('access_token');

  if (!accessToken) return null;

  try {
    const response = await api.post<AuthResponse>('/auth/google/callback', {
      access_token: accessToken,
      refresh_token: params.get('refresh_token') || '',
    });

    // Remove the token from the URL bar so it's not visible to the user
    window.history.replaceState({}, document.title, window.location.pathname);

    return response.data.token;
  } catch (error) {
    console.error('Google callback error:', error);
    return null;
  }
};

export default signInWithGoogle;