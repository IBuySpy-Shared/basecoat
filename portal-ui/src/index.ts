// Components
export * from './components';

// Theme
export { ThemeProvider, useTheme } from './theme/ThemeContext';
export type { Theme } from './theme/ThemeContext';

// Design Tokens
export { default as tokens } from './theme/tokens';
export * from './theme/tokens';

// Global styles - should be imported in app entry point
import './styles/global.css';

/**
 * Basecoat Portal UI Component Library
 *
 * A comprehensive, accessible React component library following WCAG 2.1 AA standards.
 *
 * Features:
 * - 5+ core components (Button, Input, Card, Navigation, Modal)
 * - Full dark mode support with system preference detection
 * - Responsive design (mobile, tablet, desktop, large breakpoints)
 * - Keyboard navigation and screen reader support
 * - TypeScript support with full type definitions
 * - Storybook documentation and component playground
 *
 * @example
 * import { ThemeProvider, Button, Input } from '@basecoat/portal-ui';
 *
 * export function App() {
 *   return (
 *     <ThemeProvider>
 *       <Button variant="primary">Click me</Button>
 *       <Input label="Email" type="email" />
 *     </ThemeProvider>
 *   );
 * }
 */

export default {};
