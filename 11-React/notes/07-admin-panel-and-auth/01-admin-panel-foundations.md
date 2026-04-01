# 01 – Admin Panel Foundations

> **Goal:** Scaffold a product admin panel with working navigation, URL-driven state, and a clean integration of custom fonts — all while keeping the codebase maintainable when starting from AI-generated code.

---

## Table of Contents

1. [Project Structure for an Admin Panel](#project-structure-for-an-admin-panel)
2. [Routes — Admin Layout Pattern](#routes--admin-layout-pattern)
3. [Query Parameters & Stateless Persistence](#query-parameters--stateless-persistence)
4. [Navigation Patterns](#navigation-patterns)
5. [Custom Fonts: Google Fonts + Tailwind](#custom-fonts-google-fonts--tailwind)
6. [Adapting AI-Generated Code](#adapting-ai-generated-code)

---

## Project Structure for an Admin Panel

An admin panel is a **separate layout subtree** inside your router, sharing the same React app but with its own sidebar, header, and protected access.

```text
src/
├── layouts/
│   ├── AdminLayout.tsx        ← sidebar + top bar, renders <Outlet />
│   └── PublicLayout.tsx
├── pages/
│   ├── admin/
│   │   ├── DashboardPage.tsx
│   │   ├── ProductsPage.tsx   ← product table with filters
│   │   ├── ProductFormPage.tsx ← create / edit form
│   │   └── OrdersPage.tsx
│   └── auth/
│       └── LoginPage.tsx
├── components/
│   ├── admin/                 ← admin-specific reusable components
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   └── ProductTable.tsx
│   └── ui/                   ← shadcn primitives
├── routes/
│   └── AppRouter.tsx
└── main.tsx
```

---

## Routes — Admin Layout Pattern

Build admin routes as a **nested protected subtree**. The outer guard handles auth; the layout handles chrome (sidebar/header).

```tsx
// routes/AppRouter.tsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const AdminLayout      = lazy(() => import('@/layouts/AdminLayout'));
const DashboardPage    = lazy(() => import('@/pages/admin/DashboardPage'));
const ProductsPage     = lazy(() => import('@/pages/admin/ProductsPage'));
const ProductFormPage  = lazy(() => import('@/pages/admin/ProductFormPage'));

export const AppRouter: React.FC = () => (
  <Suspense fallback={<PageSkeleton />}>
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* Admin — auth guard wraps the whole subtree */}
      <Route element={<PrivateRoute allowedRoles={['admin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin"                    element={<DashboardPage />} />
          <Route path="/admin/products"           element={<ProductsPage />} />
          <Route path="/admin/products/new"       element={<ProductFormPage />} />
          <Route path="/admin/products/:id/edit"  element={<ProductFormPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  </Suspense>
);
```

```tsx
// layouts/AdminLayout.tsx
import { Outlet } from 'react-router-dom';

export const AdminLayout: React.FC = () => (
  <div className="flex h-screen bg-background">
    <Sidebar />
    <div className="flex flex-1 flex-col overflow-hidden">
      <TopBar />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />   {/* active admin page renders here */}
      </main>
    </div>
  </div>
);
```

### Key Points

- **One `<PrivateRoute>`** wraps the whole admin subtree — no need to guard every individual route.
- Lazy-load all admin pages — they are heavy and most public users never visit them.
- Use `path="/admin/products/:id/edit"` to share the same form component for create *and* edit, differentiated by the presence of `:id`.

---

## Query Parameters & Stateless Persistence

> Already covered in `06 / 02-tanstack-query-and-data-fetching.md`. This section focuses on patterns **specific to admin panels**.

**Stateless persistence** means state lives in the URL, not in `useState`. Advantages:

- Survives page refresh
- Shareable links (e.g., send a pre-filtered product list to a colleague)
- Browser back/forward works correctly

### Admin Filter Pattern

```tsx
// hooks/useAdminFilters.ts
import { useSearchParams } from 'react-router-dom';

export function useAdminFilters() {
  const [params, setParams] = useSearchParams();

  const filters = {
    page:     Number(params.get('page'))     || 1,
    limit:    Number(params.get('limit'))    || 10,
    search:   params.get('search')           ?? '',
    gender:   params.get('gender')           ?? '',
    status:   params.get('status')           ?? '',  // 'active' | 'inactive' | ''
  };

  const setFilter = (key: string, value: string | number) => {
    setParams(prev => {
      const next = new URLSearchParams(prev);
      next.set(key, String(value));
      if (key !== 'page') next.set('page', '1');  // always reset page on filter change
      return next;
    });
  };

  const clearFilters = () => setParams({});

  return { filters, setFilter, clearFilters };
}
```

```tsx
// URL examples this produces:
// /admin/products?page=2&gender=women&status=active&search=shoe
```

### Why Reset Page on Filter Change

When a filter changes, the current page number is likely invalid (the result count changes). Always reset `page` to `1` when any non-page filter is updated.

---

## Navigation Patterns

### Sidebar with Active Link Highlighting

```tsx
// components/admin/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Dashboard',  to: '/admin',          icon: LayoutDashboard },
  { label: 'Products',   to: '/admin/products', icon: Package },
  { label: 'Orders',     to: '/admin/orders',   icon: ShoppingCart },
];

export const Sidebar: React.FC = () => (
  <aside className="w-64 border-r bg-card flex flex-col">
    <div className="h-16 flex items-center px-6 border-b">
      <span className="font-bold text-lg">Admin Panel</span>
    </div>
    <nav className="flex-1 px-3 py-4 space-y-1">
      {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end                        // exact match — "Products" won't highlight when on "/admin"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </nav>
  </aside>
);
```

### Programmatic Navigation After Mutations

```tsx
const navigate = useNavigate();

// After creating a product — go to its edit page
const { mutate: createProduct } = useCreateProduct({
  onSuccess: (product) => navigate(`/admin/products/${product.id}/edit`),
});

// After deleting — return to the list
const { mutate: deleteProduct } = useDeleteProduct({
  onSuccess: () => navigate('/admin/products', { replace: true }),
});
```

---

## Custom Fonts: Google Fonts + Tailwind

### Step 1 — Import in HTML or CSS

```html
<!-- index.html — preconnect for performance -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

Alternatively, import inside `index.css`:

```css
/* index.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
```

### Step 2 — Register in Tailwind Config

```ts
// tailwind.config.ts
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],  // Inter as the default sans font
      },
    },
  },
};
```

### Step 3 — Apply Globally

```css
/* index.css  */
@layer base {
  body {
    @apply font-sans antialiased;
  }
}
```

Now all text in the app uses Inter by default, with no need for per-element class names.

### Using Multiple Fonts

```ts
fontFamily: {
  sans:  ['Inter',        ...fontFamily.sans],
  mono:  ['JetBrains Mono', ...fontFamily.mono],
  display: ['Outfit', ...fontFamily.sans],   // headings / hero text
},
```

```tsx
// Usage
<h1 className="font-display text-4xl font-bold">Admin Panel</h1>
<code className="font-mono text-sm">SELECT * FROM products</code>
```

---

## Adapting AI-Generated Code

AI tools (ChatGPT, Copilot, v0, etc.) produce working code quickly, but it often needs adjustment before merging into a real project.

### Common Issues & Fixes

| Issue | What to do |
| :--- | :--- |
| Wrong import paths | Update to match your `@/` alias and folder structure |
| Inline styles instead of Tailwind | Replace with Tailwind classes using your design tokens |
| Hardcoded data / `any` types | Add proper TypeScript types; replace mocks with real API calls |
| Missing error / loading states | Add `isLoading`, `isError` branches |
| No accessibility attributes | Add `aria-*`, `role`, keyboard handlers where needed |
| Monolithic component | Break into smaller focused components |
| State in component instead of URL | Replace `useState` filters with `useSearchParams` |

### Workflow

1. **Run it first** — get it working, even if messy.
2. **Type it** — replace `any` with real interfaces.
3. **Extract hooks** — move fetch/mutation logic out of the component.
4. **Match design system** — swap ad-hoc styles for your `cn()` + Tailwind tokens.
5. **Add edge cases** — empty states, loading skeletons, error messages.
6. **Test** — write at least a smoke test per new component.

```tsx
// ❌ AI output — common starting point
function ProductList() {
  const [data, setData] = useState<any>([]);
  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(setData);
  }, []);
  return <div style={{ display: 'flex' }}>{data.map((p: any) => <div>{p.name}</div>)}</div>;
}

// ✅ After adaptation
const ProductList: React.FC = () => {
  const { products, isLoading } = useProductList();   // TanStack hook
  if (isLoading) return <ProductGridSkeleton />;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
};
```
