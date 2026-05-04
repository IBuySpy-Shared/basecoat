# Basecoat Portal - Quick Reference Card

## Color Palette (Hex Codes)

| Use Case | Color | Hex | Contrast |
|----------|-------|-----|----------|
| Primary Action | Blue | #0078D4 | 12.5:1 on white |
| Success/Compliant | Green | #107C10 | 4.9:1 |
| Warning/At-Risk | Orange | #F7630C | 4.8:1 |
| Error/Non-Compliant | Red | #D13438 | 5.1:1 |
| Body Text | Charcoal | #323232 | 8.6:1 |
| Secondary Text | Gray | #666666 | 6.7:1 |
| Light Background | Light Gray | #F3F2F1 | N/A |
| Border | Border Gray | #EBEBEB | N/A |

## Typography

| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|-------------|
| H1 | Segoe UI | 32px | Bold | 40px |
| H2 | Segoe UI | 28px | Bold | 36px |
| H3 | Segoe UI | 24px | Bold | 32px |
| H4 | Segoe UI | 20px | Bold | 28px |
| Body Large | Segoe UI | 16px | Regular | 24px |
| Body Medium | Segoe UI | 14px | Regular | 20px |
| Body Small | Segoe UI | 12px | Regular | 16px |
| Mono (Code) | Cascadia Code | 12px | Regular | 18px |

## Spacing Grid (8px base)

```
xs  = 4px
sm  = 8px
md  = 16px
lg  = 24px
xl  = 32px
2xl = 48px
3xl = 64px
```

## Component States

### Button
- **Primary**: Blue bg, white text (14px, 12px 24px padding, 48px min height)
- **Hover**: Darker blue (#106EBE)
- **Active**: Even darker (#005A9E)
- **Disabled**: Light gray bg, gray text
- **Focus**: 2px #0078D4 outline, 3px gap

### Input Field
- **Default**: 36px height, 1px border #EBEBEB, 8px 12px padding
- **Focus**: 2px blue border, 0 0 0 4px rgba(0,120,212,0.1) shadow
- **Error**: 1px #D13438 border, error text in red (12px)
- **Disabled**: #EBEBEB background

### Badge
- **Success**: Green bg #DFF6DD, green text #107C10, 4px 8px padding
- **Warning**: Orange bg #FFF4CE, orange text #F7630C
- **Error**: Red bg #FDE7E9, red text #D13438
- **Pending**: Gray bg #EBEBEB, gray text #666666

### Status Badge
- ✓ Compliant: Green (#107C10) + "✓ Compliant"
- ⚠ At-Risk: Orange (#F7630C) + "⚠ At-Risk"
- ✗ Non-Compliant: Red (#D13438) + "✗ Non-Compliant"
- ⏳ Pending: Gray + "⏳ Pending"

## Responsive Breakpoints

```css
/* Mobile First */
/* Mobile: 375px (default) */
/* Tablet: 768px (md: in Tailwind) */
/* Desktop: 1440px (2xl: in Tailwind) */
```

### Mobile (375px)
- Single column
- Full-width buttons (100% - 16px padding)
- Bottom tab navigation
- Collapsed sidebar (hamburger menu)
- Touch targets: 48px minimum

### Tablet (768px)
- Two columns
- Collapsible sidebar
- Card-based table rendering option
- Larger touch targets: 56px

### Desktop (1440px)
- Three columns
- 280px persistent sidebar
- Full-width tables with pagination
- Normal spacing

## Accessibility Rules (WCAG 2.1 AA)

### Color Contrast
- Text on background: 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- Never use color alone (always include icon/text)

### Keyboard Navigation
- **Tab**: Move to next interactive element
- **Shift+Tab**: Move to previous element
- **Enter**: Activate button/submit form
- **Space**: Toggle checkbox/radio/switch
- **Esc**: Close modal/dropdown
- **Arrow Keys**: Navigate menus/tables/lists

### Focus Indicators
- 2px outline (border or box-shadow)
- 3px gap from element edge
- Visible on all interactive elements
- Never use `outline: none` without replacement

### Screen Reader
- Semantic HTML: `<button>`, `<input>`, `<label>`
- Form labels associated: `<label for="id">`
- Icons with labels: `aria-label="description"`
- Alerts: `role="alert"` or `aria-live="polite"`

## Component Minimum Sizes

```
Button:        48px height × 120px min width
Input field:   36px height
Checkbox:      18px × 18px
Radio button:  18px diameter
Touch target:  48px × 48px minimum
Icon:          20px × 20px
Table row:     56px height
```

## Navigation Structure

```
┌─────────────────────────────────────┐
│  Logo | Search | Profile Menu | ... │  64px top bar
├─────────────────────────────────────┤
│ Sidebar  │                          │
│ 280px    │      Main Content        │
│          │      (1140px available)   │
├─────────────────────────────────────┤
│  Footer (optional)                   │  if needed
└─────────────────────────────────────┘
```

### Sidebar Navigation
- **Width**: 280px (desktop) / 64px (collapsed)
- **Item Height**: 44px
- **Active State**: Left border #0078D4 (4px) + background #F3F2F1
- **Icon + Label**: 20px icon, 14px label

## Form Guidelines

### Required Fields
- Mark with asterisk (*) in color (not color alone)
- Include in form instructions at top
- Validate on submit

### Error Messages
- Specific (not "Invalid")
- Prescriptive ("Must include @company.com")
- Associated with input via `aria-describedby`
- Role="alert" for announcement

### Success Feedback
- Toast notification (auto-dismiss 5 seconds)
- Or success page with next steps
- Clear confirmation message

## Data Table Structure

```
┌─────────────────────────────────────┐
│ Repo      │ Status    │ Last Scan   │ ← Header (F3F2F1 bg)
├─────────────────────────────────────┤
│ api       │ ✓ Compliant │ Today    │ ← Row (hover: F3F2F1)
│ auth      │ ⚠ At-Risk   │ Yesterday│
│ database  │ ✗ Non-Comp. │ 2 days  │
├─────────────────────────────────────┤
│ ← Previous | 1 of 6 | Next →        │ ← Pagination
└─────────────────────────────────────┘
```

- Sortable headers: Click to sort, arrow indicator
- Hover state: Background #F3F2F1
- Row height: 56px
- Alternating rows optional (for scannability)

## Modal/Dialog Guidelines

```
╔═══════════════════════════════════════╗
║ Modal Title              [X close]    │  Header
╠═══════════════════════════════════════╣
║                                        │
║  Content                               │
║  (Form, confirmation, etc)             │
║                                        │
╠═══════════════════════════════════════╣
║                 [Action] [Cancel]     │  Footer
╚═══════════════════════════════════════╝
```

- **Width**: Small 400px, Medium 600px, Large 800px
- **Mobile**: Full width (90vw)
- **Overlay**: Black 30% opacity
- **Close**: Esc key, X button, Cancel button

## Loading & Empty States

### Loading
- Skeleton placeholders (match content shape)
- Spinner for actions (centered, animated)
- Progress bar for uploads/imports

### Empty
- Icon + headline: "No audits yet"
- Descriptive message: "Create your first audit to get started"
- Call-to-action button: "Submit Audit"

### Error
- Error icon (red)
- Headline: "Something went wrong"
- Descriptive message with context
- Retry button or link to support

## Tailwind CSS Utilities

```css
/* Spacing */
p-4         /* padding: 16px */
m-2         /* margin: 8px */
gap-3       /* gap: 12px */

/* Text */
text-sm     /* 14px body medium */
font-bold   /* font-weight: 700 */
text-gray-600  /* #666666 */

/* Color */
bg-blue-600   /* #0078D4 */
text-red-600  /* #D13438 */
border-gray-200  /* #EBEBEB */

/* Focus Ring */
focus-visible:outline-blue-600
focus-visible:outline-offset-3

/* Responsive */
md:flex     /* desktop only */
md:w-1/2    /* 50% width on tablet+ */
```

## Common Patterns

### Form Field with Label
```html
<div class="mb-4">
  <label for="email" class="block text-sm font-bold mb-2">
    Email <span class="text-red-600">*</span>
  </label>
  <input
    id="email"
    type="email"
    required
    aria-describedby="email-error"
    class="w-full px-3 py-2 border border-gray-200 rounded"
  />
  <span id="email-error" role="alert" class="text-red-600 text-sm mt-1">
    {error}
  </span>
</div>
```

### Status Badge
```html
<span class="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded">
  <CheckIcon size={16} aria-hidden="true" />
  Compliant
</span>
```

### Accessible Button
```html
<button
  type="button"
  onClick={handleClick}
  aria-label="Close dialog"
  class="p-2 hover:bg-gray-100 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
>
  <XIcon size={24} aria-hidden="true" />
</button>
```

## File Organization

```
src/
├── components/common/         ← Reusable UI components
├── components/auth/           ← Auth-specific
├── components/dashboard/      ← Dashboard screens
├── pages/                      ← Route-level components
├── hooks/                      ← Custom React hooks
├── services/                   ← API integration
├── store/                      ← Zustand state
├── styles/                     ← Global CSS
└── utils/                      ← Helpers (validation, formatting)
```

## Testing Checklist

### Unit Test
- Props work correctly
- Event handlers fire
- State updates work
- Error boundaries render

### Accessibility Test
- axe-core audit (0 violations)
- Keyboard navigation works
- Screen reader announces
- Focus visible on all interactive elements

### Visual Test
- Storybook snapshot test
- Cross-browser screenshot
- Responsive at 375px, 768px, 1440px

---

## Links

- Design System: `PORTAL_UI_DESIGN_v1.md`
- Components: `COMPONENT_LIBRARY.md`
- Implementation: `FRONTEND_IMPLEMENTATION_GUIDE.md`
- Accessibility: `WCAG_2_1_AA_VALIDATION_CHECKLIST.md`
- Wireframes: `wireframes_*.excalidraw` (open in https://excalidraw.com)

