import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/setupTests.ts',
        'src/index.ts',
        'src/components/index.ts',
        'src/types/**',
        'src/theme/tokens.ts',
        'src/theme/ThemeContext.tsx',
        '.storybook/**',
        '**/*.stories.tsx',
        '**/*.test.tsx',
      ],
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80,
    },
  },
});
