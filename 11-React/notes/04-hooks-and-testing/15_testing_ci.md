# 🔄 Integrating Testing into the Build and CI/CD Process

## Why Automate Tests

```text
Without CI:  Developer forgets to run tests → bug reaches production ❌
With CI:     Every push/PR runs tests automatically → merge blocked if they fail ✅
```

---

## package.json Scripts

```json
{
  "scripts": {
    "dev":              "vite",
    "build":            "tsc && vite build",
    "preview":          "vite preview",

    "test":             "vitest",
    "test:run":         "vitest run",
    "test:ui":          "vitest --ui",
    "test:coverage":    "vitest run --coverage",
    "test:watch":       "vitest --watch",

    "lint":             "eslint src --ext .ts,.tsx",
    "type-check":       "tsc --noEmit",

    "ci":               "npm run type-check && npm run lint && npm run test:run",
    "build:ci":         "npm run ci && npm run build"
  }
}
```

---

## Vitest Configuration for CI

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals:     true,
    environment: 'jsdom',
    setupFiles:  ['./src/setupTests.ts'],

    // CI-specific configuration
    reporters: process.env.CI
      ? ['verbose', 'junit']   // in CI: detailed report + JUnit for GitHub Actions
      : ['verbose'],           // locally: verbose only

    outputFile: {
      junit: './test-results/junit.xml',   // for parsing in CI
    },

    coverage: {
      provider:  'v8',
      reporter:  ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/main.tsx',
        'src/**/*.d.ts',
        'src/**/*.stories.{ts,tsx}',
        'src/**/index.ts',
      ],
      // Minimum thresholds — if coverage drops below these %, CI fails
      thresholds: {
        statements: 80,
        branches:   75,
        functions:  80,
        lines:      80,
      },
    },

    // Maximum time per test (prevents hanging tests)
    testTimeout: 10_000,
    hookTimeout: 10_000,
  },
});
```

---

## GitHub Actions — Complete Workflow

```yaml
# .github/workflows/ci.yml
name: CI — Test & Build

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    name: 🧪 Tests
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci   # stricter than npm install in CI

      - name: Type check
        run: npx tsc --noEmit

      - name: Lint
        run: npm run lint

      - name: Run tests with coverage
        run: npm run test:coverage
        env:
          CI: true
          VITE_GIPHY_API_KEY: ${{ secrets.GIPHY_API_KEY }}  # repo secrets

      - name: Upload coverage report
        uses: codecov/codecov-action@v4
        with:
          file: ./coverage/lcov.info
          fail_ci_if_error: false  # don't fail if Codecov is unavailable

      - name: Publish test results
        uses: mikepenz/action-junit-report@v4
        if: always()   # run even if tests fail
        with:
          report_paths: './test-results/junit.xml'

  build:
    name: 🏗️ Build
    runs-on: ubuntu-latest
    needs: test   # only if tests pass

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}

      - name: Save build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
          retention-days: 7
```

---

## Environment Variables in CI

```yaml
# Option 1: repository secrets (for private values)
env:
  VITE_API_KEY: ${{ secrets.VITE_API_KEY }}

# Option 2: public environment variables
env:
  VITE_API_URL: https://api.my-app.com
  VITE_APP_NAME: My App
```

```ts
// In tests, mock the environment variables
// src/setupTests.ts
vi.stubEnv('VITE_GIPHY_API_KEY', 'test-api-key-fake');
```

---

## Pre-commit Hooks with Husky

Run tests before every commit:

```bash
npm install -D husky lint-staged
npx husky init
```

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

```json
// package.json
{
  "lint-staged": {
    "src/**/*.{ts,tsx}": [
      "eslint --fix",
      "vitest related --run"   // only tests related to changed files
    ]
  }
}
```

---

## Run Only Affected Tests

```bash
# Vitest automatically detects which tests to run based on changed files
npx vitest related src/hooks/useFetchGifs.ts

# In watch mode, it does this automatically:
npx vitest --watch
```

---

## Coverage Badge in README

```markdown
<!-- README.md -->
[![Tests](https://github.com/username/repo/workflows/CI/badge.svg)](https://github.com/username/repo/actions)
[![Coverage](https://codecov.io/gh/username/repo/branch/main/graph/badge.svg)](https://codecov.io/gh/username/repo)
```

---

## CI Checklist for a React Project

```text
✅ Unit + integration tests (Vitest)
✅ Type checking (tsc --noEmit)
✅ Linting (ESLint)
✅ Coverage with minimum thresholds
✅ Successful build
✅ Environment variables as secrets
✅ Pre-commit hooks (Husky)
✅ Status badge in README
```
