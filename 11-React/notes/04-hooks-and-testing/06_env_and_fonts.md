# 🔐 Environment Variables + Custom Fonts

---

## Environment Variables in Vite + React

### `.env` Files

```text
.env                  → default values (all environments)
.env.local            → local, NOT committed to git (secrets)
.env.development      → development only (npm run dev)
.env.production       → production only (npm run build)
.env.test             → test only (vitest)
```

### Important Rules in Vite

```bash
# ✅ ONLY variables prefixed with VITE_ are accessible in code
VITE_API_URL=https://api.example.com
VITE_APP_NAME=My App

# ❌ Without the VITE_ prefix they won't be available in code (Node/server only)
SECRET_KEY=abc123           # not accessible via import.meta.env
DATABASE_URL=postgres://... # not accessible via import.meta.env
```

### Full `.env` Example

```bash
# .env
VITE_APP_NAME=My Application
VITE_APP_VERSION=1.0.0

# .env.development
VITE_API_URL=http://localhost:3000/api
VITE_ENABLE_DEVTOOLS=true

# .env.production
VITE_API_URL=https://api.mydomain.com
VITE_ENABLE_DEVTOOLS=false

# .env.local  (add to .gitignore!)
VITE_API_KEY=your-secret-api-key
```

### `.gitignore` — Protect Secrets

```bash
# .gitignore
.env.local
.env.*.local
```

---

## Accessing Variables in Code

```ts
// In any .ts / .tsx file
const apiUrl  = import.meta.env.VITE_API_URL;
const appName = import.meta.env.VITE_APP_NAME;

// Vite's built-in variables (always available)
import.meta.env.MODE        // "development" | "production" | "test"
import.meta.env.DEV         // boolean: true in development
import.meta.env.PROD        // boolean: true in production
import.meta.env.BASE_URL    // base URL configured in vite.config.ts
```

### TypeScript Typing for Env Variables

```ts
// src/vite-env.d.ts — extend import.meta.env types
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_API_KEY: string;
  readonly VITE_ENABLE_DEVTOOLS: string; // always a string, convert manually
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

### Centralized Config Module

```ts
// src/config/env.ts
const config = {
  apiUrl:        import.meta.env.VITE_API_URL,
  appName:       import.meta.env.VITE_APP_NAME,
  apiKey:        import.meta.env.VITE_API_KEY,
  enableDevtools: import.meta.env.VITE_ENABLE_DEVTOOLS === 'true',
  isDev:         import.meta.env.DEV,
  isProd:        import.meta.env.PROD,
} as const;

// Validate required variables exist
const required = ['apiUrl', 'appName'] as const;
for (const key of required) {
  if (!config[key]) {
    throw new Error(`Missing environment variable: VITE_${key.toUpperCase()}`);
  }
}

export default config;
```

```ts
// Usage
import config from '../config/env';

const api = axios.create({ baseURL: config.apiUrl });

if (config.isDev) {
  console.log('Development mode active');
}
```

---

## Environment Variables in Vitest

```ts
// src/setupTests.ts
import { vi } from 'vitest';

// Mock env variables in tests
vi.stubEnv('VITE_API_URL', 'http://localhost:3000');

// Or in an individual test:
test('uses the correct URL', () => {
  vi.stubEnv('VITE_API_URL', 'https://test-api.com');
  expect(config.apiUrl).toBe('https://test-api.com');
  vi.unstubAllEnvs();
});
```

---

## Custom Fonts

### Option 1: Google Fonts (CDN)

```html
<!-- index.html -->
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fira+Code&display=swap" rel="stylesheet">
</head>
```

```css
/* src/index.css */
body {
  font-family: 'Inter', sans-serif;
}

code, pre {
  font-family: 'Fira Code', monospace;
}
```

### Option 2: Local Fonts (recommended for production)

```text
src/
└── assets/
    └── fonts/
        ├── Inter-Regular.woff2
        ├── Inter-Medium.woff2
        ├── Inter-SemiBold.woff2
        └── Inter-Bold.woff2
```

```css
/* src/assets/fonts/fonts.css */
@font-face {
  font-family: 'Inter';
  src: url('./Inter-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;   /* shows system font while loading */
}

@font-face {
  font-family: 'Inter';
  src: url('./Inter-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Inter';
  src: url('./Inter-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

```ts
// src/main.tsx — import fonts
import './assets/fonts/fonts.css';
import './index.css';
```

```css
/* src/index.css */
:root {
  --font-sans:  'Inter', system-ui, -apple-system, sans-serif;
  --font-mono:  'Fira Code', 'Courier New', monospace;
}

body {
  font-family: var(--font-sans);
}
```

### Option 3: Dynamic CSS Variable Font (theming)

```css
/* src/index.css */
:root {
  --font-primary: 'Inter', sans-serif;
}

[data-theme="retro"] {
  --font-primary: 'Georgia', serif;
}

body {
  font-family: var(--font-primary);
}
```

```tsx
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme] = useLocalStorage('theme', 'default');

  return (
    <div data-theme={theme}>
      {children}
    </div>
  );
}
```

---

## CSS Variables for Consistent Design

```css
/* src/index.css */
:root {
  /* Typography */
  --font-size-xs:   0.75rem;    /* 12px */
  --font-size-sm:   0.875rem;   /* 14px */
  --font-size-base: 1rem;       /* 16px */
  --font-size-lg:   1.125rem;   /* 18px */
  --font-size-xl:   1.25rem;    /* 20px */
  --font-size-2xl:  1.5rem;     /* 24px */

  /* Weights */
  --font-weight-normal:   400;
  --font-weight-medium:   500;
  --font-weight-semibold: 600;
  --font-weight-bold:     700;

  /* Colors */
  --color-primary:   #3b82f6;
  --color-secondary: #64748b;
  --color-success:   #22c55e;
  --color-error:     #ef4444;
  --color-bg:        #ffffff;
  --color-text:      #0f172a;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-8: 2rem;

  /* Border radius */
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   16px;
  --radius-full: 9999px;
}

/* Dark theme */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg:   #0f172a;
    --color-text: #f8fafc;
  }
}
```
