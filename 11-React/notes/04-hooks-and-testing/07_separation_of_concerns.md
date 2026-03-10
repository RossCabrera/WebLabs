# 🏗️ Separation of Concerns — Scalable Architecture

## The Principle

> Each file/module should have **one single reason to change**.

```text
❌ A component that: fetches data + manages state + has business logic + renders UI
✅ A component that: only renders UI
   + a hook that:    manages state and logic
   + a service that: makes HTTP requests
   + a type file:    defines interfaces
```

---

## Scalable Project Structure

```text
src/
├── api/
│   └── axiosInstance.ts          # centralized HTTP client
│
├── assets/
│   ├── fonts/
│   └── images/
│
├── components/                   # reusable components (no business logic)
│   ├── ui/                       # "dumb" / presentational components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.css
│   │   │   └── Button.test.tsx
│   │   ├── Input/
│   │   └── Card/
│   └── layout/
│       ├── Navbar.tsx
│       └── Footer.tsx
│
├── features/                     # feature-based modules
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── services/
│   │   │   └── authService.ts
│   │   └── types/
│   │       └── auth.types.ts
│   └── products/
│       ├── components/
│       │   ├── ProductCard.tsx
│       │   └── ProductList.tsx
│       ├── hooks/
│       │   └── useProducts.ts
│       ├── services/
│       │   └── productsService.ts
│       └── types/
│           └── product.types.ts
│
├── hooks/                        # global reusable hooks
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── useWindowSize.ts
│
├── context/                      # global contexts
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
│
├── pages/                        # views / routes
│   ├── HomePage.tsx
│   ├── ProductsPage.tsx
│   └── LoginPage.tsx
│
├── types/                        # shared global types
│   └── index.ts
│
├── utils/                        # pure utility functions
│   ├── formatters.ts
│   ├── validators.ts
│   └── helpers.ts
│
├── config/
│   └── env.ts                    # environment configuration
│
├── App.tsx
└── main.tsx
```

---

## Pattern: Container + Presentational

The most important separation: **logic** vs **UI**

```tsx
// ❌ "Fat" component — does everything
function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('');

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const filtered = products.filter(p => p.name.includes(filter));

  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      {loading ? <p>Loading...</p> : filtered.map(p => <p key={p.id}>{p.name}</p>)}
    </div>
  );
}
```

```tsx
// ✅ Properly separated

// 1. types/product.types.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

// 2. services/productsService.ts
import api from '../api/axiosInstance';
import type { Product } from '../types/product.types';

export const productsService = {
  getAll:    () => api.get<Product[]>('/products').then(r => r.data),
  getById: (id: number) => api.get<Product>(`/products/${id}`).then(r => r.data),
};

// 3. hooks/useProducts.ts — pure logic
import { useState, useEffect } from 'react';
import { productsService } from '../services/productsService';
import useDebounce from './useDebounce';
import type { Product } from '../types/product.types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [filter, setFilter]     = useState('');
  const debouncedFilter         = useDebounce(filter, 300);

  useEffect(() => {
    productsService.getAll()
      .then(setProducts)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(debouncedFilter.toLowerCase())
  );

  return { products: filteredProducts, loading, error, filter, setFilter };
}

// 4. components/ProductCard.tsx — presentational component (UI only)
interface ProductCardProps {
  name: string;
  price: number;
  onAddToCart: () => void;
}

function ProductCard({ name, price, onAddToCart }: ProductCardProps) {
  return (
    <div className="product-card">
      <h3>{name}</h3>
      <p>${price.toFixed(2)}</p>
      <button onClick={onAddToCart}>Add to cart</button>
    </div>
  );
}

// 5. components/ProductList.tsx — container component (orchestrates)
import { useProducts } from '../hooks/useProducts';
import ProductCard from './ProductCard';

function ProductList() {
  const { products, loading, error, filter, setFilter } = useProducts();

  if (loading) return <p>Loading products...</p>;
  if (error)   return <p>Error: {error}</p>;

  return (
    <div>
      <input
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="Filter products..."
      />
      <div className="product-grid">
        {products.map(p => (
          <ProductCard
            key={p.id}
            name={p.name}
            price={p.price}
            onAddToCart={() => console.log(`Add ${p.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## utils/ — Pure Reusable Functions

```ts
// src/utils/formatters.ts
export const formatCurrency = (amount: number, currency = 'USD'): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);

export const formatDate = (date: string | Date, locale = 'en-US'): string =>
  new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date(date));

export const truncate = (text: string, maxLength: number): string =>
  text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

export const slugify = (text: string): string =>
  text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
```

```ts
// src/utils/validators.ts
export const isEmail  = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const isPhone  = (v: string) => /^\+?[\d\s\-()]{7,15}$/.test(v);
export const isEmpty  = (v: string) => v.trim().length === 0;
export const isURL    = (v: string) => { try { new URL(v); return true; } catch { return false; } };
```

---

## Barrel Exports Index (index.ts)

Enables cleaner imports:

```ts
// src/components/ui/index.ts
export { default as Button } from './Button/Button';
export { default as Input }  from './Input/Input';
export { default as Card }   from './Card/Card';
export { default as Modal }  from './Modal/Modal';

// src/hooks/index.ts
export { default as useDebounce }     from './useDebounce';
export { default as useLocalStorage } from './useLocalStorage';
export { default as useToggle }       from './useToggle';

// Now imports are cleaner:
import { Button, Input, Card } from '../components/ui';
import { useDebounce, useToggle } from '../hooks';
```

---

## Separation of Concerns Checklist

```text
UI Component (presentational):
  ✅ Only receives props and renders HTML/JSX
  ✅ Does not fetch or access APIs directly
  ✅ Has no business logic
  ✅ Easy to test with direct props

Custom Hook:
  ✅ Manages state related to a feature
  ✅ Contains the component's business logic
  ✅ Can be reused across multiple components
  ✅ Returns only what the component needs

Service:
  ✅ Only makes HTTP calls
  ✅ Has no state
  ✅ Easy to mock in tests
  ✅ Centralizes API logic

Types:
  ✅ Defines shared interfaces and types
  ✅ No logic, only types
```
