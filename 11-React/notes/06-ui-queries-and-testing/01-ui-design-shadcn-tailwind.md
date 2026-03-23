# 01 – UI Design: Shadcn, Tailwind & Application Structure

> **Goal:** Build polished, well-structured UIs using Shadcn/UI and Tailwind, with lazy loading and pagination for performance.

---

## Table of Contents

1. [Tailwind CSS](#tailwind-css)
2. [Shadcn/UI](#shadcnui)
3. [Component Usage & Composition](#component-usage--composition)
4. [Code Segmentation](#code-segmentation)
5. [Lazy Loading](#lazy-loading)
6. [Pagination Structure](#pagination-structure)

---

## Tailwind CSS

Tailwind is a **utility-first CSS framework** — you style elements by composing small, single-purpose class names directly in your JSX.

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

```js
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { 500: '#6366f1', 600: '#4f46e5' },
      },
    },
  },
  plugins: [],
};
```

### Core Concepts

```tsx
// Layout
<div className="flex items-center justify-between gap-4 p-6" />
<div className="grid grid-cols-3 gap-4" />

// Spacing (4 = 1rem, 2 = 0.5rem)
<div className="mt-4 px-6 py-2" />

// Typography
<h1 className="text-2xl font-bold tracking-tight text-slate-900" />
<p  className="text-sm text-muted-foreground" />

// Responsive (mobile-first)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" />

// State variants
<button className="bg-brand-500 hover:bg-brand-600 disabled:opacity-50 transition-colors" />

// Dark mode
<div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" />
```

### clsx + tailwind-merge (Essential Combo)

```bash
npm install clsx tailwind-merge
```

```tsx
// lib/utils.ts  ← shadcn generates this automatically
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

```tsx
// Usage — merges conflicting Tailwind classes correctly
<div className={cn(
  'rounded-md px-4 py-2 text-sm font-medium',
  isActive   && 'bg-brand-500 text-white',
  isDisabled && 'opacity-50 cursor-not-allowed',
  className,   // allow callers to override
)} />

// Without twMerge this would break:
// cn('px-4', 'px-6') → 'px-4 px-6' ❌ (conflict)
// cn('px-4', 'px-6') → 'px-6'      ✅ (twMerge resolves it)
```

### Common Pitfalls

| Pitfall | Fix |
| :--------- | :----- |
| Dynamic class names get purged | Use full class strings, not template literals: `text-${color}-500` ❌ |
| Two conflicting classes both applied | Use `twMerge` / `cn()` |
| Deeply nested className props | Extract into a variant component with `cva` |

---

## Shadcn/UI

Shadcn/UI gives you **copy-paste components** built on Radix UI primitives + Tailwind. They live in *your* codebase so you own and customise them completely.

```bash
npx shadcn-ui@latest init
# Adds: components/ui/, lib/utils.ts, tailwind config updates
```

```bash
# Add individual components as needed
npx shadcn-ui@latest add button card input badge
npx shadcn-ui@latest add dialog sheet table skeleton
npx shadcn-ui@latest add select dropdown-menu tabs
```

### Key Components & Usage

```tsx
import { Button }   from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge }    from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input }    from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

// Button variants
<Button variant="default">Primary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button size="sm" disabled>Small</Button>

// Card
<Card>
  <CardHeader>
    <CardTitle>My Card</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Content goes here</p>
  </CardContent>
</Card>

// Loading skeleton
<Skeleton className="h-4 w-[250px]" />
<Skeleton className="h-12 w-12 rounded-full" />
```

### Building a Product Card

```tsx
// components/ProductCard.tsx
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge }  from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn }     from '@/lib/utils';

interface ProductCardProps {
  name:       string;
  price:      number;
  category:   string;
  imageUrl:   string;
  inStock:    boolean;
  onAddToCart: () => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  name, price, category, imageUrl, inStock, onAddToCart, className,
}) => (
  <Card className={cn('overflow-hidden transition-shadow hover:shadow-lg', className)}>
    <div className="aspect-square overflow-hidden">
      <img
        src={imageUrl}
        alt={name}
        className="h-full w-full object-cover transition-transform hover:scale-105"
      />
    </div>

    <CardHeader className="pb-2">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold leading-tight">{name}</h3>
        <Badge variant={inStock ? 'default' : 'secondary'}>
          {inStock ? 'In Stock' : 'Sold Out'}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">{category}</p>
    </CardHeader>

    <CardFooter className="flex items-center justify-between">
      <span className="text-lg font-bold">${price.toFixed(2)}</span>
      <Button
        size="sm"
        disabled={!inStock}
        onClick={onAddToCart}
      >
        Add to Cart
      </Button>
    </CardFooter>
  </Card>
);
```

---

## Component Usage & Composition

### Compound Components Pattern

```tsx
// A flexible Card that composes smaller pieces
// components/StatsCard.tsx

interface StatsCardProps {
  title:   string;
  value:   string | number;
  delta?:  number;         // % change
  icon?:   React.ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, delta, icon }) => {
  const isPositive = delta !== undefined && delta >= 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {delta !== undefined && (
          <p className={cn('text-xs mt-1', isPositive ? 'text-green-600' : 'text-red-600')}>
            {isPositive ? '↑' : '↓'} {Math.abs(delta)}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
};
```

### Variant-driven Components with `cva`

```bash
npm install class-variance-authority
```

```tsx
// components/ui/tag.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const tagVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      color: {
        blue:   'bg-blue-100 text-blue-800',
        green:  'bg-green-100 text-green-800',
        red:    'bg-red-100 text-red-800',
        yellow: 'bg-yellow-100 text-yellow-800',
      },
    },
    defaultVariants: { color: 'blue' },
  }
);

interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {}

export const Tag: React.FC<TagProps> = ({ className, color, ...props }) => (
  <span className={cn(tagVariants({ color }), className)} {...props} />
);

// Usage
<Tag color="green">Active</Tag>
<Tag color="red">Deprecated</Tag>
```

---

## Code Segmentation

Splitting code into focused, maintainable units.

### Folder Structure

```text
src/
├── components/
│   ├── ui/              ← shadcn primitives (never edit directly)
│   ├── common/          ← shared app components (Avatar, EmptyState)
│   └── features/
│       ├── products/    ← ProductCard, ProductGrid, ProductFilters
│       └── cart/        ← CartDrawer, CartItem, CartSummary
├── pages/               ← route-level components (thin — delegate to features)
├── hooks/               ← custom hooks
├── lib/                 ← utils, api clients, constants
└── types/               ← shared TypeScript types
```

### Page-level Segmentation

```tsx
// pages/ProductsPage.tsx — thin page, delegates everything
const ProductsPage: React.FC = () => (
  <div className="container py-8">
    <PageHeader title="Products" />
    <ProductFilters />
    <ProductGrid />
    <ProductPagination />
  </div>
);
```

```tsx
// features/products/ProductGrid.tsx — renders the grid
const ProductGrid: React.FC = () => {
  const { products, isLoading } = useProducts();   // data logic in hook

  if (isLoading) return <ProductGridSkeleton />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
      {products.map(p => <ProductCard key={p.id} {...p} />)}
    </div>
  );
};
```

---

## Lazy Loading

Load components **on demand** to reduce the initial bundle size.

```tsx
import { lazy, Suspense } from 'react';

// ✅ Lazy-import heavy or rarely-visited pages
const DashboardPage  = lazy(() => import('./pages/DashboardPage'));
const AdminPage      = lazy(() => import('./pages/AdminPage'));
const ChartComponent = lazy(() => import('./components/HeavyChart'));
```

### With React Router

```tsx
// routes/AppRouter.tsx
import { lazy, Suspense } from 'react';
import { Routes, Route }  from 'react-router-dom';
import { PageSkeleton }   from '@/components/common/PageSkeleton';

const HomePage    = lazy(() => import('@/pages/HomePage'));
const ProductPage = lazy(() => import('@/pages/ProductPage'));
const AdminPage   = lazy(() => import('@/pages/AdminPage'));

export const AppRouter: React.FC = () => (
  <Suspense fallback={<PageSkeleton />}>
    <Routes>
      <Route path="/"         element={<HomePage />} />
      <Route path="/products" element={<ProductPage />} />
      <Route path="/admin"    element={<AdminPage />} />
    </Routes>
  </Suspense>
);
```

### PageSkeleton Component

```tsx
// components/common/PageSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

export const PageSkeleton: React.FC = () => (
  <div className="container py-8 space-y-4">
    <Skeleton className="h-8 w-64" />
    <Skeleton className="h-4 w-full" />
    <div className="grid grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-48 rounded-lg" />
      ))}
    </div>
  </div>
);
```

---

## Pagination Structure

### Component-level Pagination

```tsx
// components/common/Pagination.tsx
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage:  number;
  totalPages:   number;
  onPageChange: (page: number) => void;
  isLoading?:   boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage, totalPages, onPageChange, isLoading,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Show at most 5 page numbers around current page
  const visible = pages.filter(p =>
    p === 1 || p === totalPages ||
    Math.abs(p - currentPage) <= 2
  );

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <Button
        variant="outline" size="icon"
        disabled={currentPage === 1 || isLoading}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {visible.map((page, idx) => {
        const prev = visible[idx - 1];
        const showEllipsis = prev && page - prev > 1;

        return (
          <span key={page} className="flex items-center gap-1">
            {showEllipsis && <span className="px-1 text-muted-foreground">…</span>}
            <Button
              variant={page === currentPage ? 'default' : 'outline'}
              size="icon"
              disabled={isLoading}
              onClick={() => onPageChange(page)}
              className={cn('w-9 h-9', page === currentPage && 'pointer-events-none')}
            >
              {page}
            </Button>
          </span>
        );
      })}

      <Button
        variant="outline" size="icon"
        disabled={currentPage === totalPages || isLoading}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
```

### usePagination Hook

```tsx
// hooks/usePagination.ts
import { useState, useCallback } from 'react';

interface UsePaginationOptions {
  initialPage?:  number;
  itemsPerPage?: number;
}

export function usePagination<T>(items: T[], {
  initialPage  = 1,
  itemsPerPage = 10,
}: UsePaginationOptions = {}) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages   = Math.ceil(items.length / itemsPerPage);
  const start        = (currentPage - 1) * itemsPerPage;
  const paginatedItems = items.slice(start, start + itemsPerPage);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  }, [totalPages]);

  const nextPage = useCallback(() => goToPage(currentPage + 1), [currentPage, goToPage]);
  const prevPage = useCallback(() => goToPage(currentPage - 1), [currentPage, goToPage]);

  return {
    currentPage, totalPages, paginatedItems,
    goToPage, nextPage, prevPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}
```

```tsx
// Usage with the Pagination component
const ProductGrid: React.FC<{ products: Product[] }> = ({ products }) => {
  const { paginatedItems, currentPage, totalPages, goToPage } =
    usePagination(products, { itemsPerPage: 12 });

  return (
    <>
      <div className="grid grid-cols-4 gap-6">
        {paginatedItems.map(p => <ProductCard key={p.id} {...p} />)}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
      />
    </>
  );
};
```
