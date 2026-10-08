import '@/global.css';

import { Platform, StyleSheet } from 'react-native';

export const Colors = {
  light: {
    primary: '#EA580C',        // Bharat Saffron / Industrial Orange
    primaryDark: '#C2410C',
    primaryLight: '#FFEDD5',
    primarySubtle: '#FFF7ED',
    secondary: '#0F172A',      // Heavy Slate
    secondaryLight: '#1E293B',
    background: '#F8FAFC',
    backgroundSubtle: '#F1F5F9',
    card: '#FFFFFF',
    cardElevated: '#FFFFFF',
    text: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    borderStrong: '#CBD5E1',
    backgroundElement: '#F1F5F9',
    backgroundSelected: '#FFEDD5',
    success: '#10B981',        // Emerald Precision
    successLight: '#DCFCE7',
    successDark: '#047857',
    warning: '#D97706',        // Industrial Amber
    warningLight: '#FEF3C7',
    danger: '#EF4444',         // Alert Crimson
    dangerLight: '#FEE2E2',
    info: '#0284C7',           // Technical Sky
    infoLight: '#E0F2FE',
    accent: '#F59E0B',
    accentLight: '#FEF3C7',
  },
  dark: {
    primary: '#F97316',
    primaryDark: '#EA580C',
    primaryLight: '#431407',
    primarySubtle: '#261205',
    secondary: '#F8FAFC',
    secondaryLight: '#94A3B8',
    background: '#090D16',
    backgroundSubtle: '#0F172A',
    card: '#131B2E',
    cardElevated: '#1A243D',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    border: '#1E293B',
    borderLight: '#182234',
    borderStrong: '#334155',
    backgroundElement: '#1E293B',
    backgroundSelected: '#331B0A',
    success: '#10B981',
    successLight: '#064E3B',
    successDark: '#047857',
    warning: '#F59E0B',
    warningLight: '#451A03',
    danger: '#EF4444',
    dangerLight: '#450A0A',
    info: '#38BDF8',
    infoLight: '#082F49',
    accent: '#FBBF24',
    accentLight: '#451A03',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light;
export type ThemeColors = typeof Colors.light;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
  six: 24,
  seven: 32,
  eight: 40,
  nine: 48,
  ten: 64,
} as const;

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const Shadows = StyleSheet.create({
  xs: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  primary: {
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
});

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'monospace',
  },
});

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 960;
