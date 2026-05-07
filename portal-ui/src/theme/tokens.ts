/**
 * Design System Tokens
 * Basecoat Portal UI Design System v1.0
 *
 * This file defines all design tokens used across the component library.
 * Based on PORTAL_UI_DESIGN_v1.md and WCAG 2.1 AA requirements.
 */

export const colors = {
  // Primary Colors
  primary: {
    blue: '#0078D4',
    darkBlue: '#005A9E',
    lightBlue: '#0063B1',
  },

  // Semantic Colors
  success: '#107C10',
  warning: '#F7630C',
  error: '#D13438',
  info: '#0078D4',

  // Grayscale
  black: '#000000',
  darkGray: '#323232',
  midGray: '#666666',
  lightGray: '#EBEBEB',
  lighterGray: '#F3F2F1',
  white: '#FFFFFF',

  // Status Colors (Compliance)
  compliant: '#107C10',
  atRisk: '#F7630C',
  nonCompliant: '#D13438',
  pending: '#665E00',
  neutral: '#A4A4A4',
  disabled: '#A4A4A4',
};

export const colorsByTheme = {
  light: {
    background: colors.white,
    surface: colors.lighterGray,
    surfaceHover: colors.lightGray,
    text: colors.black,
    textSecondary: colors.darkGray,
    textTertiary: colors.midGray,
    border: colors.lightGray,
    borderStrong: colors.darkGray,
  },
  dark: {
    background: '#1A1A1A',
    surface: '#2D2D2D',
    surfaceHover: '#3A3A3A',
    text: '#F5F5F5',
    textSecondary: '#D0D0D0',
    textTertiary: '#A0A0A0',
    border: '#3A3A3A',
    borderStrong: '#707070',
  },
};

export const typography = {
  fontFamily: {
    base: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
  },

  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '28px',
    '4xl': '32px',
    '5xl': '36px',
  },

  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  letterSpacing: {
    tight: '-0.02em',
    normal: '0em',
    wide: '0.02em',
  },
};

export const spacing = {
  // 8px base unit
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  6: '24px',
  8: '32px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
};

export const borderRadius = {
  none: '0px',
  xs: '2px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
};

export const shadows = {
  none: 'none',
  subtle: '0 1px 2px rgba(0, 0, 0, 0.05)',
  small: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  medium: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
  large: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
};

export const breakpoints = {
  mobile: '375px',
  tablet: '768px',
  desktop: '1440px',
  large: '1920px',
};

export const breakpointValues = {
  mobile: 375,
  tablet: 768,
  desktop: 1440,
  large: 1920,
};

export const mediaQueries = {
  mobile: `(min-width: ${breakpoints.mobile})`,
  tablet: `(min-width: ${breakpoints.tablet})`,
  desktop: `(min-width: ${breakpoints.desktop})`,
  large: `(min-width: ${breakpoints.large})`,
  mobileOnly: `(max-width: 767px)`,
  tabletOnly: `(min-width: ${breakpoints.tablet}px) and (max-width: 1439px)`,
};

export const transitions = {
  fast: '150ms ease-in-out',
  normal: '250ms ease-in-out',
  slow: '350ms ease-in-out',
};

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  backdrop: 1040,
  offcanvas: 1050,
  modal: 1060,
  popover: 1070,
  tooltip: 1080,
  notification: 1090,
};

// Accessibility-focused contrast ratios (WCAG AA verified)
export const contrastRatios = {
  AANormalText: '4.5:1', // Black on White
  AALargeText: '3:1',
  AAANormalText: '7:1',
  AAALargeText: '4.5:1',
};

// Reduced motion for accessibility
export const reducedMotion = '@media (prefers-reduced-motion: reduce)';

export default {
  colors,
  colorsByTheme,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  breakpointValues,
  mediaQueries,
  transitions,
  zIndex,
  contrastRatios,
  reducedMotion,
};
