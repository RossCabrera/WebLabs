# ⚡ Vitest — Setup, UI, and Coverage

## What is Vitest?

Vitest is a modern testing framework for **Vite** projects. It is compatible with the Jest API but much faster because it shares the Vite configuration.

```text
✅ Very fast (uses esbuild / Vite)
✅ Jest-compatible API
✅ Native TypeScript support
✅ Smart watch mode
✅ Visual UI included
```

---

## Installation

```bash
# Install Vitest
npm install -D vitest

# For React component tests you also need:
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

---

## Configuration in `vite.config.ts`

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,          // lets you use describe/test/expect without imports
    environment: 'jsdom',   // simulates the browser DOM
    setupFiles: './src/setupTests.ts',  // global setup file
    coverage: {
      provider: 'v8',       // or 'istanbul'
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx', 'src/**/*.d.ts'],
    },
  },
});
```

```ts
// tsconfig.json — add vitest types
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

```ts
// src/setupTests.ts — runs before each test
import '@testing-library/jest-dom';  // adds matchers like toBeInTheDocument()
```

---

## Scripts in `package.json`

```json
{
  "scripts": {
    "test": "vitest",                         // watch mode
    "test:run": "vitest run",                 // runs once and exits
    "test:ui": "vitest --ui",                 // visual UI
    "test:coverage": "vitest run --coverage"  // coverage report
  }
}
```

---

## Test File Structure

```ts
// src/utils/math.ts
export function add(a: number, b: number): number {
  return a + b;
}

export function divide(a: number, b: number): number {
  if (b === 0) throw new Error('Cannot divide by zero');
  return a / b;
}
```

```ts
// src/utils/math.test.ts   ← convention: same name + .test.ts
import { add, divide } from './math';

describe('math utils', () => {
  test('add should return the sum of two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('divide throws an error when dividing by 0', () => {
    expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
  });
});
```

> **File naming conventions:**
>
> - `math.test.ts` — next to the source file ✅ (most common)
> - `math.spec.ts` — also valid
> - `__tests__/math.ts` — in a separate folder

---

## Vitest UI

Vitest includes a visual interface that shows your tests in the browser.

```bash
npm install -D @vitest/ui

# Run
npx vitest --ui
```

The UI opens at `http://localhost:51204` and shows:

```text
✅ List of all tests
✅ Status of each test (pass/fail)
✅ Error details with diff
✅ Visual coverage
✅ Real-time re-execution
```

---

## Code Coverage

Coverage measures **what percentage of your code** was executed during tests.

```bash
npm install -D @vitest/coverage-v8

npx vitest run --coverage
```

### Coverage metrics

```text
Statements  : 85.71% → % of executed lines
Branches    : 75.00% → % of if/else branches covered
Functions   : 90.00% → % of functions called
Lines       : 85.71% → % of lines covered
```

### Example terminal report

```text
 % Coverage report from v8
--------------------|---------|----------|---------|---------| 
File                | % Stmts | % Branch | % Funcs | % Lines |
--------------------|---------|----------|---------|---------| 
All files           |   85.71 |    75.00 |   90.00 |   85.71 |
 utils/             |         |          |         |         |
  math.ts           |  100.00 |   100.00 |  100.00 |  100.00 |
  format.ts         |   80.00 |    50.00 |   80.00 |   80.00 |
 components/        |         |          |         |         |
  Button.tsx        |  100.00 |   100.00 |  100.00 |  100.00 |
--------------------|---------|----------|---------|---------| 
```

### Configure minimum thresholds

```ts
// vite.config.ts
test: {
  coverage: {
    provider: 'v8',
    thresholds: {
      statements: 80,   // CI fails if it drops below 80%
      branches: 75,
      functions: 80,
      lines: 80,
    },
  },
},
```

> ⚠️ 100% coverage doesn't guarantee good tests. It's better to have meaningful tests than tests that just "touch" the code.

---

## Most Common Vitest Matchers

```ts
// Equality
expect(value).toBe(5)              // ===  (primitives)
expect(obj).toEqual({ a: 1 })      // deep comparison (objects)
expect(obj).toStrictEqual({ a: 1 })// same but stricter

// Truthiness
expect(value).toBeTruthy()
expect(value).toBeFalsy()
expect(value).toBeNull()
expect(value).toBeUndefined()
expect(value).toBeDefined()

// Numbers
expect(n).toBeGreaterThan(5)
expect(n).toBeLessThanOrEqual(10)
expect(n).toBeCloseTo(0.1 + 0.2, 5) // for floats

// Strings
expect(str).toContain('hello')
expect(str).toMatch(/^hello/)         // regex

// Arrays
expect(arr).toHaveLength(3)
expect(arr).toContain('item')
expect(arr).toEqual(expect.arrayContaining(['a', 'b']))

// Errors
expect(() => fn()).toThrow()
expect(() => fn()).toThrow('specific message')
expect(() => fn()).toThrow(TypeError)

// Negation: .not
expect(value).not.toBe(0)
expect(arr).not.toContain('x')
```
