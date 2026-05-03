import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/__tests__/setupTests.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        '.next/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        'src/__tests__/setupTests.ts',
        'src/__tests__/testUtils.tsx',
        // React hooks require UI test environment; covered by e2e tests
        'src/lib/game/useTurnTimer.ts',
        // Store integrates UI + domain; covered by component tests
        'src/store/gameStore.ts',
        // DOM download utility; not unit-testable without jsdom file API
        'src/lib/game/replayModel.ts',
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
  },
  resolve: {
    alias: {
      // Resolve workspace packages from TypeScript source so tests work
      // without a pre-built dist (CI runs tests before build step)
      '@entropy-garden/engine': path.resolve(__dirname, '../../packages/engine/src/index.ts'),
      '@entropy-garden/ai': path.resolve(__dirname, '../../packages/ai/src/index.ts'),
      '@': path.resolve(__dirname, './src'),
    },
  },
});
