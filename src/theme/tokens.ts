// ─────────────────────────────────────────────
// Design tokens — the single source of truth for
// spacing, radius, and type scale across the app.
// Every screen must pull from here, never hardcode.
// ─────────────────────────────────────────────

export const spacing = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
} as const;

export const radius = {
  sm: 16,
  md: 20,
  lg: 24,
  pill: 999,
} as const;

export const cardPadding = {
  default: 20,
  roomy: 24,
} as const;

export const buttonHeight = {
  default: 52,
  large: 56,
} as const;

export const typography = {
  fontFamily: {
    display: 'Fraunces_500Medium',
    displaySemibold: 'Fraunces_600SemiBold_Italic',
    body: 'DMSans_400Regular',
    bodyMedium: 'DMSans_500Medium',
    bodyBold: 'DMSans_700Bold',
  },
  size: {
    greeting: 30,
    title: 22,
    subtitle: 17,
    body: 15,
    caption: 13,
  },
  lineHeight: {
    greeting: 38,
    title: 28,
    subtitle: 24,
    body: 22,
    caption: 18,
  },
} as const;

export const shadow = {
  soft: {
    shadowColor: '#8B8378',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  liftedOnPress: {
    shadowColor: '#8B8378',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
} as const;
