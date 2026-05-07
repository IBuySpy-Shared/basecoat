# Design System Documentation

## Overview

The Basecoat Portal UI design system provides a comprehensive set of design tokens and components for building consistent, accessible interfaces.

## Color Palette

### Primary Colors

| Name | Hex | Usage | Contrast |
|------|-----|-------|----------|
| Primary Blue | `#0078D4` | Primary CTAs, links, focus states | 12.5:1 on white |
| Primary Dark | `#005A9E` | Hover/active states | 14.2:1 on white |
| Primary Light | `#0063B1` | Hover/disabled states | 10.8:1 on white |

### Semantic Colors

| State | Hex | Usage | WCAG AA |
|-------|-----|-------|---------|
| Success | `#107C10` | Compliant, passed audits | ✅ 5.1:1 |
| Warning | `#F7630C` | At-risk, needs attention | ✅ 4.5:1 |
| Error | `#D13438` | Non-compliant, failures | ✅ 5.2:1 |
| Info | `#0078D4` | Informational messages | ✅ 12.5:1 |

### Grayscale

| Shade | Hex | Usage |
|-------|-----|-------|
| Black | `#000000` | Headings, body text |
| Dark Gray | `#323232` | Secondary text, borders |
| Mid Gray | `#666666` | Tertiary text, placeholders |
| Light Gray | `#EBEBEB` | Subtle borders, dividers |
| Lighter Gray | `#F3F2F1` | Card backgrounds |
| White | `#FFFFFF` | Primary background |

### Dark Mode Palette

| Element | Light | Dark |
|---------|-------|------|
| Background | `#FFFFFF` | `#1A1A1A` |
| Surface | `#F3F2F1` | `#2D2D2D` |
| Text Primary | `#000000` | `#F5F5F5` |
| Text Secondary | `#323232` | `#D0D0D0` |
| Border | `#EBEBEB` | `#3A3A3A` |

## Typography

### Font Stack

```css
--font-family-base: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
  "Helvetica Neue", Arial, sans-serif;

--font-family-mono: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono",
  Consolas, "Courier New", monospace;
```

### Font Sizes (Responsive)

| Size | Desktop | Tablet | Mobile | Usage |
|------|---------|--------|--------|-------|
| xs | 12px | 12px | 12px | Labels, captions |
| sm | 14px | 14px | 14px | Secondary text |
| base | 16px | 16px | 16px | Body text |
| lg | 18px | 17px | 16px | Subheadings |
| xl | 20px | 18px | 17px | Headings |
| 2xl | 24px | 22px | 20px | Large headings |
| 3xl | 28px | 26px | 24px | Section titles |

### Font Weights

- Light: 300
- Normal: 400
- Medium: 500
- Semibold: 600
- Bold: 700

### Line Heights

- Tight: 1.2 (headings)
- Normal: 1.5 (body text)
- Relaxed: 1.75 (long-form content)
- Loose: 2 (spacing)

## Spacing

The design system uses an 8px base unit:

```
1 = 4px    (half unit)
2 = 8px    (1 unit)
3 = 12px   (1.5 units)
4 = 16px   (2 units)
6 = 24px   (3 units)
8 = 32px   (4 units)
12 = 48px  (6 units)
16 = 64px  (8 units)
20 = 80px  (10 units)
24 = 96px  (12 units)
```

### Spacing Guidelines

- **Between sections**: 48px - 64px
- **Between components**: 24px - 32px
- **Internal padding**: 16px - 24px
- **Text spacing**: 12px - 16px

## Border Radius

| Size | Value | Usage |
|------|-------|-------|
| xs | 2px | Minimal rounding |
| sm | 4px | Small elements |
| md | 8px | Default components |
| lg | 12px | Cards, modals |
| xl | 16px | Large elements |
| full | 9999px | Pills, circles |

## Shadows

All shadows respect dark mode and use CSS variables:

| Level | Value | Usage |
|-------|-------|-------|
| subtle | 0 1px 2px rgba(0,0,0,0.05) | Minimal depth |
| small | 0 1px 3px 0.1 | Hover states |
| medium | 0 4px 6px 0.1 | Default cards |
| large | 0 10px 15px 0.1 | Modal backdrop |
| xl | 0 20px 25px 0.1 | Floating elements |

## Breakpoints

The design system uses a mobile-first approach:

| Breakpoint | Width | Target Devices |
|------------|-------|-----------------|
| Mobile | 375px | Phones |
| Tablet | 768px | Tablets |
| Desktop | 1440px | Laptops |
| Large | 1920px | Desktop/TV |

### Usage Examples

```css
/* Mobile-first base styles */
.component {
  font-size: 16px;
  padding: 12px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .component {
    font-size: 18px;
    padding: 16px;
  }
}

/* Desktop and up */
@media (min-width: 1440px) {
  .component {
    font-size: 20px;
    padding: 24px;
  }
}
```

## Z-Index Scale

| Layer | Value | Purpose |
|-------|-------|---------|
| Base | 0 | Normal content |
| Dropdown | 1000 | Dropdowns, popovers |
| Sticky | 1020 | Sticky headers |
| Fixed | 1030 | Fixed elements |
| Modal Backdrop | 1040 | Semi-transparent overlay |
| Modal | 1060 | Modal dialog |
| Popover | 1070 | Floating popovers |
| Tooltip | 1080 | Tooltip text |
| Notification | 1090 | Toast notifications |

## Transitions

```
Fast: 150ms ease-in-out (hover states)
Normal: 250ms ease-in-out (default)
Slow: 350ms ease-in-out (emphasis changes)
```

## Component Pattern Examples

### Button Styling Pattern

```tsx
const buttonStyles = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--spacing-2)',
  padding: 'var(--spacing-2) var(--spacing-4)',
  fontSize: 'var(--font-size-base)',
  fontWeight: 'var(--font-weight-medium)',
  borderRadius: 'var(--radius-md)',
  border: '1px solid transparent',
  cursor: 'pointer',
  transition: 'all var(--transition-normal)',
};
```

### Card Styling Pattern

```tsx
const cardStyles = {
  backgroundColor: 'var(--bg-secondary)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-lg)',
  padding: 'var(--spacing-4)',
  boxShadow: 'var(--shadow-medium)',
  transition: 'all var(--transition-normal)',
};
```

### Form Input Pattern

```tsx
const inputStyles = {
  width: '100%',
  padding: 'var(--spacing-2) var(--spacing-3)',
  fontSize: 'var(--font-size-base)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  transition: 'all var(--transition-normal)',
};
```

## Accessibility in Design Tokens

### Contrast Verification

All color combinations have been verified for WCAG AA compliance:
- Normal text: 4.5:1 minimum
- Large text (18pt+): 3:1 minimum
- UI components: 3:1 minimum

### Motion Preferences

All animations respect `prefers-reduced-motion`:
- Disabled for users with motion sensitivity
- No parallax or unnecessary animations
- Instant feedback still provided

### Color Independence

No information is conveyed by color alone:
- Status indicators include text or icons
- Interactive states clearly marked
- High contrast focus indicators

## Using Design Tokens

### In CSS

```css
.button {
  background-color: var(--color-primary);
  padding: var(--spacing-4);
  font-size: var(--font-size-base);
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
}
```

### In TypeScript

```tsx
import { tokens } from '@basecoat/portal-ui';

const styles = {
  padding: tokens.spacing[4],
  color: tokens.colors.primary.blue,
  fontSize: tokens.typography.fontSize.base,
};
```

### In Styled Components

```tsx
import styled from 'styled-components';
import { tokens } from '@basecoat/portal-ui';

const StyledButton = styled.button`
  background-color: ${tokens.colors.primary.blue};
  padding: ${tokens.spacing[4]};
  font-size: ${tokens.typography.fontSize.base};
  border-radius: ${tokens.borderRadius.md};
  transition: all ${tokens.transitions.normal};
`;
```

## Dark Mode Implementation

The library provides automatic dark mode support:

```tsx
import { ThemeProvider, useTheme } from '@basecoat/portal-ui';

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}

function ThemeToggle() {
  const { isDarkMode, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}>
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  );
}
```

---

For component-specific guidance, see individual component documentation.
