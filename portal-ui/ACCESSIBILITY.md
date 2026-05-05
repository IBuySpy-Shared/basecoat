# Accessibility Guidelines

This document outlines the accessibility standards and guidelines for the Basecoat Portal UI component library.

## WCAG 2.1 AA Compliance

All components in this library are designed to meet **WCAG 2.1 Level AA** standards, ensuring:

- ✅ **Perceivable**: Information is presentable in multiple ways
- ✅ **Operable**: User interface is keyboard accessible
- ✅ **Understandable**: Text is readable and clear
- ✅ **Robust**: Content is compatible with assistive technologies

## Compliance Checklist

### Perceivable

#### 1.3 Adaptable - Information Structure
- [x] Semantic HTML elements (nav, main, aside, article, section)
- [x] Proper heading hierarchy (h1, h2, h3, etc.)
- [x] List markup for content lists
- [x] Form fields properly associated with labels
- [x] Data table markup with headers and captions

#### 1.4 Distinguishable - Visual Elements
- [x] Minimum 4.5:1 contrast ratio for normal text
- [x] Minimum 3:1 contrast ratio for large text (18pt+)
- [x] No information conveyed by color alone
- [x] Focus indicators at 2px minimum
- [x] Support for high contrast mode

### Operable

#### 2.1 Keyboard Accessible
- [x] All functionality available via keyboard
- [x] Tab order is logical and intuitive
- [x] Focus trap in modals and dropdowns
- [x] Escape key closes overlays
- [x] Arrow keys for menu navigation
- [x] No keyboard traps

#### 2.4 Navigable
- [x] Skip links for keyboard users
- [x] Focus visible indicator (2px outline)
- [x] Meaningful link text
- [x] Breadcrumbs for navigation context
- [x] Page title describes content

#### 2.5 Input Modalities
- [x] Target size minimum 44x44px (mobile)
- [x] Touch-friendly interface (48px buttons)
- [x] No pointer-only inputs
- [x] Alternative input methods supported

### Understandable

#### 3.2 Predictable - Consistent Navigation
- [x] Navigation consistent across pages
- [x] Component behavior predictable
- [x] Consistent visual design
- [x] Error prevention with validation

#### 3.3 Input Assistance - Form Support
- [x] Form labels associated with inputs
- [x] Form fields grouped logically
- [x] Required fields marked
- [x] Error messages linked to fields
- [x] Helpful error recovery suggestions

### Robust

#### 4.1 Compatible - ARIA & HTML
- [x] Valid HTML5 markup
- [x] Proper ARIA attributes
- [x] Screen reader compatible
- [x] No invalid attribute combinations

## Component Accessibility Features

### Button

```tsx
<Button
  variant="primary"
  aria-label="Submit form"  // For icon-only buttons
  aria-busy={isLoading}     // Loading state
  aria-disabled={isDisabled} // Disabled state
>
  Submit
</Button>
```

**Accessibility Features:**
- Focus indicator visible
- Keyboard: Enter/Space to activate
- Screen reader: Reads label and state
- Minimum 44x44px size

### Input

```tsx
<Input
  label="Email"
  type="email"
  isRequired
  aria-required="true"
  aria-invalid={isInvalid}
  aria-describedby={errorId}
/>
```

**Accessibility Features:**
- Label properly associated
- Required indicator marked
- Error messages linked
- Validation feedback on blur
- Mobile: 16px font prevents zoom

### Card

```tsx
<Card role="article">
  <Card.Header>
    <h2>Card Title</h2>
  </Card.Header>
  <Card.Body>Content</Card.Body>
</Card>
```

**Accessibility Features:**
- Semantic article role
- Proper heading hierarchy
- Clear content structure
- Focus outline on interactive cards

### Navigation

```tsx
<Navigation
  aria-label="Main navigation"
  links={links}
  role="menubar"
/>
```

**Accessibility Features:**
- Keyboard navigation (arrow keys)
- Screen reader support
- Current page indicator (aria-current)
- Skip links for keyboard users

### Modal

```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirmation"
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  Content
</Modal>
```

**Accessibility Features:**
- Focus management (trap focus)
- Escape key closes
- Backdrop click closes
- Proper ARIA attributes
- Prevents body scroll

## Testing for Accessibility

### Automated Testing

```bash
# Run accessibility tests
npm run test

# In your tests:
import { axe } from 'jest-axe';

it('has no accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Manual Testing

1. **Keyboard Navigation**
   - Tab through all interactive elements
   - Use arrow keys in navigation
   - Verify focus indicators are visible
   - Escape key closes modals

2. **Screen Reader Testing**
   - Test with NVDA (Windows), JAWS, or VoiceOver (Mac)
   - Verify all content is announced
   - Check link purposes
   - Test form labels and errors

3. **Visual Testing**
   - Check contrast ratios (4.5:1 minimum)
   - Verify focus indicators
   - Test with high contrast mode
   - Check color blindness (use Color Oracle tool)

4. **Responsive Testing**
   - Test on mobile devices
   - Verify 48px tap targets
   - Check touch interactions work
   - Test zoom at 200%

### Browser DevTools

- **Chrome**: Lighthouse, DevTools Accessibility Inspector
- **Firefox**: Inspector, Accessibility Checker extension
- **Safari**: Web Inspector, VoiceOver

## Dark Mode Accessibility

Dark mode in this library maintains:
- 4.5:1 contrast ratio in both light and dark modes
- No color-only status indicators
- Proper color scheme detection
- Manual override with persistent preference

## Motion & Animation

Components respect the `prefers-reduced-motion` preference:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Users who prefer reduced motion will see:
- No animations
- Instant state changes
- No parallax effects

## Common ARIA Patterns

### Form Validation

```tsx
<div>
  <label htmlFor="email">Email</label>
  <input
    id="email"
    type="email"
    aria-invalid={hasError}
    aria-describedby={hasError ? 'email-error' : undefined}
  />
  {hasError && <span id="email-error">Invalid email</span>}
</div>
```

### Live Updates

```tsx
<div aria-live="polite" aria-atomic="true">
  {message}
</div>
```

### Skip Links

```tsx
<a href="#main" className="skip-link">
  Skip to main content
</a>
```

## Accessibility Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM](https://webaim.org/)
- [A11ycasts](https://www.youtube.com/playlist?list=PLNYkxOF6rcICWx0C9Xc-RgEzwLvePng7V)

## Feedback & Issues

Found an accessibility issue? Please report it:
1. Component name and version
2. Browser and assistive technology
3. Steps to reproduce
4. Expected vs. actual behavior

---

**Accessibility is not a feature—it's a requirement.**
