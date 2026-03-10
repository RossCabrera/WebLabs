# 🔧 React DevTools + Production Build

---

## React DevTools

Browser extension for inspecting React components in real time.

**Installation:**

- Chrome: [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools)
- Firefox: [React Developer Tools](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

---

## "Components" Tab

Lets you explore the component tree and see props and state:

```text
▼ App
  ▼ AuthProvider
    ▼ Router
      ▼ Navbar
          user: { id: 1, name: "Ana" }
          isOpen: false
      ▼ ProductsPage
        ▼ ProductList
            products: [Array(10)]
            loading: false
          ▼ ProductCard
              name: "Laptop"
              price: 999
```

### What you can do

- **Select a component**: view its current props and state
- **Edit props/state live**: to test different states without code changes
- **Search for a component**: `Ctrl+F` inside the panel
- **Inspect hooks**: see the current value of each `useState`, `useRef`, etc.
- **Go to source**: click `<>` to open the file

---

## "Profiler" Tab — Detect Unnecessary Re-renders

The Profiler records renders in your app and shows how long each component takes.

```text
1. Click ⏺ (record)
2. Interact with the app
3. Click ⏹ (stop)
4. Analyze results
```

### Interpreting Results

```text
Commit #1  (2.3ms)
  ├── App                  0.1ms  (didn't change)
  ├── ProductList          1.8ms  ← re-render
  │   ├── FilterInput      0.3ms
  │   └── ProductCard ×10  1.5ms  ← 10 renders
  └── Navbar               0.1ms  (didn't change)
```

Flamegraph colors:

- **Gray**: did not re-render
- **Green/Yellow/Red**: re-rendered (darker = slower)

---

## `displayName` — Improve Names in DevTools

```tsx
// By default, components with forwardRef or memo appear as "Anonymous"
const Button = React.memo(({ label }: { label: string }) => <button>{label}</button>);
Button.displayName = 'Button';  // ← visible name in DevTools

const CustomInput = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => (
  <input ref={ref} {...props} />
));
CustomInput.displayName = 'CustomInput';
```

---

## `React.StrictMode` — Problem Detection

```tsx
// src/main.tsx
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>   {/* ← only active in development */}
    <App />
  </React.StrictMode>
);
```

StrictMode in development:

- Renders components **twice** to detect side effects
- Detects use of deprecated APIs
- Detects `useEffect` with incorrect cleanup

> If your component mounts/unmounts twice in dev, it's normal — that's StrictMode. In production it only happens once.

---

## Generating a Production Build

```bash
# Generate build
npm run build

# Preview the build (simulates production locally)
npm run preview
```

This creates the `dist/` folder:

```text
dist/
├── index.html
├── assets/
│   ├── index-DiwrgTda.js       ← minified JS with hash
│   ├── index-DiwrgTda.css      ← minified CSS
│   └── logo-CJ7EkX.png        ← hashed assets for cache busting
└── favicon.ico
```

---

## Analyzing Bundle Size

```bash
npm install -D rollup-plugin-visualizer
```

```ts
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,           // opens the report in the browser
      filename: 'dist/stats.html',
      gzipSize: true,
    }),
  ],
});
```

```bash
npm run build
# Automatically opens stats.html with the bundle map
```

---

## Production Optimizations

### Code splitting (lazy loading)

```tsx
// src/App.tsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// ✅ Each page loads only when needed
const HomePage     = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const AdminPage    = lazy(() => import('./pages/AdminPage'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/"         element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/admin"    element={<AdminPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

### React.memo — Avoid Unnecessary Re-renders

```tsx
import { memo } from 'react';

interface ProductCardProps {
  name: string;
  price: number;
}

// Only re-renders if its props change
const ProductCard = memo(function ProductCard({ name, price }: ProductCardProps) {
  return (
    <div>
      <h3>{name}</h3>
      <p>${price}</p>
    </div>
  );
});

export default ProductCard;
```

### Optimized `vite.config.ts` for Production

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }, // import with @/components/...
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    sourcemap: false,        // false in production to avoid exposing source code
    minify: 'esbuild',       // faster than terser
    rollupOptions: {
      output: {
        // Split vendor libraries into a separate chunk (better caching)
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
```

---

## Environment Variables per Environment

```bash
# Check which mode is active
npm run dev     → MODE = "development"
npm run build   → MODE = "production"
npm run preview → MODE = "production"
```

```ts
// Show version only in development
if (import.meta.env.DEV) {
  console.log('App version:', import.meta.env.VITE_APP_VERSION);
}

// Enable React Query devtools only in development
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      {import.meta.env.DEV && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
```

---

## Deploy — Common Options for Vite/React Apps

```bash
# Vercel (recommended for personal projects)
npm install -g vercel
vercel

# Netlify
npm install -g netlify-cli
netlify deploy --prod --dir=dist

# GitHub Pages
npm install -D gh-pages
# package.json: "deploy": "gh-pages -d dist"
npm run build && npm run deploy
```

> ⚠️ If you use React Router with routes like `/products`, configure the server to redirect all routes to `index.html` (SPA fallback).
