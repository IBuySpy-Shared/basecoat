---
description: Tailwind CSS v4 configuration and migration guide
applyTo: "**/*.css,**/*.tsx,**/*.html"
---

# Tailwind CSS v4 Instruction

## Overview

Tailwind CSS v4 introduces a paradigm shift from configuration-first to CSS-first approach. This guide covers the key differences, new features, and migration path from v3 to v4.

## CSS-First Configuration

Tailwind v4 prioritizes defining utilities and customizations directly in your CSS files using the new `@theme` directive. This approach reduces boilerplate in JavaScript configuration files.

```css
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --color-secondary: #10b981;
  --color-accent: #f59e0b;
  --spacing-4xl: 6rem;
}
```

The `@theme` directive allows you to:

- Define custom design tokens directly in CSS
- Override default Tailwind theme values
- Access theme values across all your CSS files
- Maintain consistency without duplicating configuration

## @theme Directive

The `@theme` directive is the core of Tailwind v4's CSS-first philosophy. It enables declarative theme management without requiring JavaScript configuration.

```css
@import "tailwindcss";

@theme {
  --color-brand-50: #f0f9ff;
  --color-brand-100: #e0f2fe;
  --color-brand-500: #0ea5e9;
  --color-brand-900: #0c2d6b;
  
  --font-sans: "Inter", sans-serif;
  --font-mono: "Fira Code", monospace;
  
  --border-radius-sm: 0.25rem;
  --border-radius-lg: 0.75rem;
}
```

You can also extend existing theme values:

```css
@theme {
  --spacing-*: inherit;
  --color-success: #22c55e;
}
```

## Native Cascade Layers

Tailwind v4 leverages native CSS cascade layers (`@layer`) to manage specificity and avoid conflicts between different style definitions.

```css
@import "tailwindcss";

@layer utilities {
  .custom-shadow {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
}

@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-500 text-white rounded-lg;
  }
}
```

Cascade layers in Tailwind v4 are organized as:

- Base: Tailwind's resets and defaults
- Components: Custom component classes
- Utilities: Utility classes (including Tailwind's)

## Container Queries

Container queries enable responsive design based on parent container size rather than viewport size. Tailwind v4 provides first-class support with utilities.

```html
<div class="@container">
  <div class="@sm:text-lg @md:text-2xl @lg:text-4xl">
    Responsive text that adjusts to container width
  </div>
</div>
```

In your HTML or templates:

```html
<article class="@container border rounded-lg p-4">
  <h2 class="@sm:text-lg @md:text-xl">Heading</h2>
  <p class="@sm:text-sm @md:text-base">Content that responds to container</p>
</article>
```

Supported container query breakpoints:

- `@sm` - 16rem (256px)
- `@md` - 28rem (448px)
- `@lg` - 32rem (512px)
- `@xl` - 36rem (576px)
- `@2xl` - 42rem (672px)

## Color-Mix Utilities

Tailwind v4 introduces color-mix utilities that leverage the native CSS `color-mix()` function for dynamic color manipulation.

```css
/* Applied in your Tailwind classes */
.bg-primary-tint {
  background-color: color-mix(in srgb, var(--color-primary) 80%, white);
}

.bg-primary-shade {
  background-color: color-mix(in srgb, var(--color-primary) 60%, black);
}
```

This enables:

- Automatic tint and shade generation
- Better color accessibility
- Reduced CSS file size
- Dynamic color manipulation without preprocessing

## @variant API

The `@variant` API allows you to create custom Tailwind variants that modify how utilities behave under specific conditions.

```css
@import "tailwindcss";

@variant focus-visible {
  &:focus-visible
}

@variant group-hover {
  :merge(.group):hover &
}

@variant peer-checked {
  :merge(.peer):checked ~ &
}
```

Custom variants enable conditions like:

- State selectors (`:focus-visible`, `:checked`)
- Parent/sibling states (`.group:hover`, `.peer:disabled`)
- Media queries (prefers-reduced-motion, color-scheme)
- Custom attribute selectors

Example usage in HTML:

```html
<button class="focus-visible:ring-2 focus-visible:ring-blue-500">
  Button with custom focus variant
</button>
```

## Performance Improvements

Tailwind v4 delivers significant performance enhancements over v3:

- **Smaller bundle size**: CSS-first approach reduces JavaScript overhead
- **Faster compilation**: Optimized parsing and processing engine
- **Zero-runtime overhead**: No JavaScript utilities at runtime
- **Better tree-shaking**: Unused styles are completely eliminated
- **Native CSS features**: Leverages browser-native capabilities instead of polyfills

Performance metrics show approximately:

- 20-40% reduction in CSS bundle size for typical projects
- 2-3x faster build times during development
- Minimal runtime impact with proper purging

## Migration from v3 to v4

### Step 1: Update Tailwind Package

```bash
npm install -D tailwindcss@latest
```

### Step 2: Update CSS Imports

**Before (v3)**:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**After (v4)**:

```css
@import "tailwindcss";
```

### Step 3: Move Configuration to CSS

**Before (v3 - tailwind.config.js)**:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#10b981',
      },
    },
  },
};
```

**After (v4 - styles.css)**:

```css
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --color-secondary: #10b981;
}
```

### Step 4: Update Container Queries

**Before (v3 - requires plugin)**:

```html
<div class="@container">
  <div class="@sm:text-sm">Text</div>
</div>
```

**After (v4 - built-in)**:

```html
<div class="@container">
  <div class="@sm:text-sm">Text</div>
</div>
```

### Step 5: Remove Deprecated Code

- Remove `@apply` directives where possible (use component classes instead)
- Update custom utilities to use the new format
- Replace PostCSS plugins with `@variant` API where applicable

### Step 6: Testing and Validation

```bash
npm run build
npm run dev
npm test
```

Verify that:

- All styles render correctly
- No console errors or warnings
- Container queries work across browsers
- Color utilities apply properly

## Common Migration Gotchas

### Specificity Issues

v4's cascade layers may behave differently than v3. If you have custom CSS, ensure you understand layer ordering.

### PostCSS Plugins

Remove or replace PostCSS plugins that modify Tailwind's output, as v4 handles many features natively.

### Dark Mode Configuration

Dark mode configuration moves from `tailwind.config.js` to CSS:

```css
@theme {
  --color-scheme: light dark;
}
```

## Best Practices

- Keep all theme values in the `@theme` directive for consistency
- Use cascade layers to organize custom styles
- Leverage container queries for component-based responsive design
- Use color-mix for generating tints and shades
- Test thoroughly on target browsers, particularly for container queries
- Monitor bundle size improvements with your build tools

## Browser Support

Tailwind v4 features require modern browser support:

- **CSS Variables**: All modern browsers
- **Cascade Layers**: All modern browsers (IE11 not supported)
- **Container Queries**: Chrome 105+, Safari 16+, Firefox 110+
- **color-mix()**: Chrome 119+, Safari 16.4+, Firefox 113+

Use fallbacks or feature detection for older browser support if needed.
