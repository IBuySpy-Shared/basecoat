# Component Design Specification Template

Use this template to define a UI component's design spec before implementation begins. Fill in all sections. Leave no section blank — use `N/A` if a section does not apply.

---

## Component Overview

| Field | Value |
|---|---|
| **Component Name** | `<PascalCase component name>` |
| **Purpose** | `<one sentence describing what this component does for the user>` |
| **Category** | `<atom / molecule / organism / template>` |
| **Design System** | `<design system or component library this belongs to>` |
| **Owner** | `<team or designer name>` |
| **Last Updated** | `YYYY-MM-DD` |

---

## Visual States

Document every visual state the component can be in. Include a description and visual treatment for each.

| State | Description | Visual Treatment |
|---|---|---|
| **Default** | `<resting state, no interaction>` | `<colors, borders, shadows, typography>` |
| **Hover** | `<cursor over the component>` | `<what changes on hover>` |
| **Focus** | `<keyboard focus on the component>` | `<focus ring style — must be visible at 3:1 contrast>` |
| **Active** | `<component is being pressed/clicked>` | `<pressed appearance>` |
| **Disabled** | `<component is non-interactive>` | `<muted appearance, cursor: not-allowed>` |
| **Loading** | `<component is waiting for data>` | `<skeleton, spinner, or shimmer>` |
| **Error** | `<validation or submission error>` | `<error border/text, aria-invalid="true">` |
| **Empty** | `<no data to display>` | `<placeholder content and guidance>` |
| **Selected** | `<component is in a selected state>` | `<selected indicator — checkmark, highlight, etc.>` |

---

## Props / Inputs

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `<propName>` | `<string / number / boolean / enum / ReactNode / etc.>` | `<yes / no>` | `<default value>` | `<what this prop controls>` |
| | | | | |
| | | | | |

---

## Accessibility

### ARIA Attributes

| Attribute | Value | When Applied |
|---|---|---|
| `role` | `<e.g., button, dialog, tabpanel>` | `<always / conditionally>` |
| `aria-label` | `<accessible name if no visible label>` | `<when no visible text>` |
| `aria-describedby` | `<ID of description element>` | `<when supplementary description exists>` |
| `aria-expanded` | `<true / false>` | `<when component controls expandable content>` |
| `aria-invalid` | `<true / false>` | `<when component is in error state>` |
| `aria-live` | `<polite / assertive>` | `<when content updates dynamically>` |
| `aria-disabled` | `<true>` | `<when disabled but still focusable>` |

### Keyboard Interaction

| Key | Action |
|---|---|
| `Tab` | `<moves focus to/from the component>` |
| `Enter` | `<activates the component>` |
| `Space` | `<activates the component (if button-like)>` |
| `Escape` | `<closes/dismisses the component (if overlay or modal)>` |
| `Arrow Up/Down` | `<navigates between options (if list-like)>` |
| `Arrow Left/Right` | `<navigates between items (if horizontal layout)>` |
| `Home / End` | `<moves to first / last option>` |

### Screen Reader Behavior

- **Announced as:** `<what the screen reader says when the component receives focus>`
- **State changes:** `<what is announced when the component state changes>`
- **Live region:** `<yes / no — if yes, describe what triggers the announcement>`

---

## Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| `sm` (< 640px) | `<e.g., full width, stacked layout, font size adjustments>` |
| `md` (640–1024px) | `<e.g., constrained width, inline layout>` |
| `lg` (> 1024px) | `<e.g., fixed width, side-by-side layout>` |

---

## Spacing & Sizing

| Property | Value | Notes |
|---|---|---|
| **Min Width** | `<e.g., 120px>` | |
| **Max Width** | `<e.g., 100% of container>` | |
| **Height** | `<e.g., 44px minimum>` | Must meet 44×44px touch target |
| **Padding** | `<e.g., 12px 16px>` | |
| **Margin** | `<e.g., 0 0 8px 0>` | |
| **Border Radius** | `<e.g., 4px>` | |

---

## Color & Typography

| Element | Token / Value | Notes |
|---|---|---|
| **Background** | `<design token or hex>` | |
| **Text** | `<design token or hex>` | Must meet 4.5:1 contrast against background |
| **Border** | `<design token or hex>` | Must meet 3:1 contrast for UI components |
| **Focus Ring** | `<design token or hex>` | Must meet 3:1 contrast against surrounding area |
| **Font Family** | `<e.g., system font stack>` | |
| **Font Size** | `<e.g., 14px / 0.875rem>` | |
| **Font Weight** | `<e.g., 400 / 600>` | |
| **Line Height** | `<e.g., 1.5>` | |

---

## Motion & Animation

| Trigger | Animation | Duration | Easing | Reduced Motion |
|---|---|---|---|---|
| `<e.g., on mount>` | `<e.g., fade in>` | `<e.g., 200ms>` | `<e.g., ease-out>` | `<e.g., no animation>` |
| `<e.g., on hover>` | `<e.g., scale 1.02>` | `<e.g., 150ms>` | `<e.g., ease-in-out>` | `<e.g., instant>` |

All animations must respect `prefers-reduced-motion: reduce`.

---

## Usage Guidelines

### Do

- `<correct usage example 1>`
- `<correct usage example 2>`
- `<correct usage example 3>`

### Don't

- `<incorrect usage example 1>`
- `<incorrect usage example 2>`
- `<incorrect usage example 3>`

---

## Related Components

| Component | Relationship |
|---|---|
| `<related component name>` | `<e.g., parent, child, alternative, composition>` |
| | |
