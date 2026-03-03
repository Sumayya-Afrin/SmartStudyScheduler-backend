// context/ThemeContext.tsx
import { createContext, useContext } from 'react';

export const DARK = {
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

export const LIGHT = {
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

export type Theme = typeof DARK;
export const ThemeContext = createContext<Theme>(DARK);
export const useTheme = () => useContext(ThemeContext);
