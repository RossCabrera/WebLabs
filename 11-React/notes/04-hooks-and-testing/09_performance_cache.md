# 🗄️ React Performance — `cache`, `memo`, `useMemo`, `useCallback`

---

## The Problem: Re-renders and Expensive Calculations

React re-renders a component when:

1. Its state (`useState`) changes
2. Its props change
3. Its parent component re-renders

This can cause:

- Expensive calculations that repeat unnecessarily
- Child components re-rendering even when their data didn't change
- Functions that are recreated on every render (breaking `memo`)

---

## `useMemo` — Memoize Calculated Values

Avoids recalculating an expensive value if its dependencies haven't changed.

```tsx
import { useMemo, useState } from 'react';

// ❌ Without useMemo: recalculates on EVERY render of the component
function ProductStats({ products }: { products: Product[] }) {
  const [otherState, setOtherState] = useState(false);

  // Runs on every render, even if products didn't change
  const stats = calculateStatistics(products); // expensive function

  return <div>{stats.average}</div>;
}

// ✅ With useMemo: only recalculates when products changes
function ProductStats({ products }: { products: Product[] }) {
  const [otherState, setOtherState] = useState(false);

  const stats = useMemo(() => {
    return calculateStatistics(products); // only when products changes
  }, [products]);

  return <div>{stats.average}</div>;
}
```

### When to Use useMemo

```tsx
// ✅ Expensive calculations (sorting, filtering, transforming large arrays)
const sortedItems = useMemo(
  () => [...items].sort((a, b) => b.price - a.price),
  [items]
);

// ✅ Filtering lists with multiple criteria
const filtered = useMemo(
  () => products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) &&
    p.price >= minPrice &&
    p.category === selectedCategory
  ),
  [products, query, minPrice, selectedCategory]
);

// ✅ Creating objects to pass to memoized components
const userConfig = useMemo(
  () => ({ theme, language, currency }),
  [theme, language, currency]
);

// ❌ DON'T use for simple calculations (useMemo's overhead is greater)
const double = useMemo(() => count * 2, [count]);  // unnecessary
const double = count * 2;                           // this is fine
```

---

## `useCallback` — Memoize Functions

Avoids a function being recreated on every render. Useful when passed as a prop to a `memo` component.

```tsx
import { useCallback, useState } from 'react';

// ❌ Without useCallback: handleClick is a new function on every render
function Parent() {
  const [count, setCount] = useState(0);
  const [text, setText]   = useState('');

  // Recreated on EVERY Parent render → breaks memo in MemoChild
  const handleClick = () => console.log('click');

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <MemoChild onClick={handleClick} />  {/* re-renders when typing in input */}
    </>
  );
}

// ✅ With useCallback: handleClick is stable between renders
function Parent() {
  const [count, setCount] = useState(0);
  const [text, setText]   = useState('');

  const handleClick = useCallback(() => {
    console.log('click', count);
  }, [count]); // only recreated when count changes

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <MemoChild onClick={handleClick} />  {/* does NOT re-render when typing */}
    </>
  );
}
```

### Pattern: useCallback + memo

```tsx
import { memo, useCallback, useState } from 'react';

// Memoized child component
interface ListItemProps {
  id: number;
  name: string;
  onDelete: (id: number) => void;
}

const ListItem = memo(function ListItem({ id, name, onDelete }: ListItemProps) {
  console.log(`Render: ${name}`);
  return (
    <li>
      {name}
      <button onClick={() => onDelete(id)}>🗑️</button>
    </li>
  );
});

// Parent component
function ItemList() {
  const [items, setItems] = useState([
    { id: 1, name: 'Item A' },
    { id: 2, name: 'Item B' },
    { id: 3, name: 'Item C' },
  ]);
  const [filter, setFilter] = useState('');

  // ✅ Stable: not recreated when typing in the filter
  const handleDelete = useCallback((id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const filtered = useMemo(
    () => items.filter(i => i.name.toLowerCase().includes(filter.toLowerCase())),
    [items, filter]
  );

  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter" />
      <ul>
        {filtered.map(item => (
          <ListItem key={item.id} {...item} onDelete={handleDelete} />
        ))}
      </ul>
    </div>
  );
}
```

---

## `React.memo` — Memoize Components

Avoids re-rendering a component if its props haven't changed.

```tsx
import { memo } from 'react';

// ✅ Only re-renders if name or price changes
const ProductCard = memo(function ProductCard({
  name,
  price,
}: {
  name: string;
  price: number;
}) {
  return (
    <div>
      <h3>{name}</h3>
      <p>${price}</p>
    </div>
  );
});

// With custom comparison
const ProductCard = memo(
  function ProductCard({ product }: { product: Product }) {
    return <div>{product.name}</div>;
  },
  (prevProps, nextProps) => {
    // returns true if they are "equal" (should NOT re-render)
    return prevProps.product.id === nextProps.product.id &&
           prevProps.product.name === nextProps.product.name;
  }
);
```

---

## `cache` — React 19 / React Server Components

`cache` is a React function for **memoizing function results** at the request level. Especially useful in React Server Components (Next.js App Router).

```tsx
// Only available in React 19+ / React Server Components
import { cache } from 'react';

// Without cache: if two components call getUser(1), 2 fetches are made
async function getUser(id: number) {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
}

// With cache: multiple calls with the same argument = 1 single fetch
const getUser = cache(async (id: number) => {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
});

// Now these two components share the result
async function UserHeader({ id }: { id: number }) {
  const user = await getUser(id); // ← first real fetch
  return <h1>{user.name}</h1>;
}

async function UserAvatar({ id }: { id: number }) {
  const user = await getUser(id); // ← uses cached result
  return <img src={user.avatar} />;
}
```

> ⚠️ React's `cache` is different from `useMemo`:
>
> - `useMemo` → client-side, persists between renders of the same component
> - `cache` → server-side, persists during the same request (cleared between requests)

---

## When to Use Each Tool

| Tool | Use | When |
| :------------- | :----- | :-------- |
| `useMemo` | Memoize **values** | Expensive calculations that depend on props/state |
| `useCallback` | Memoize **functions** | Functions passed to `memo` components |
| `React.memo` | Memoize **components** | Components that receive the same props frequently |
| `cache` (React 19) | Memoize in **Server Components** | Deduplicates fetches during a request |

---

## Golden Rule — Don't Over-Optimize

```tsx
// ❌ Premature optimization: unnecessary useMemo
const doubled = useMemo(() => count * 2, [count]);

// ✅ Simple and direct
const doubled = count * 2;

// ❌ Unnecessary useCallback if the child doesn't use memo
const handleClick = useCallback(() => setCount(c => c + 1), []);

// ✅ If the child has no memo, useCallback doesn't help
const handleClick = () => setCount(c => c + 1);
```

**Recommended flow:**

1. Write the code without optimizations
2. Use React DevTools Profiler to identify bottlenecks
3. Apply `memo`, `useMemo`, `useCallback` only where necessary
4. Measure again to confirm the improvement

---

## Example: Fully Optimized List

```tsx
import { useState, useMemo, useCallback, memo } from 'react';
import useDebounce from '../hooks/useDebounce';

interface Product { id: number; name: string; price: number; category: string; }

// Memoized child component
const ProductRow = memo(function ProductRow({
  product,
  onSelect,
}: {
  product: Product;
  onSelect: (id: number) => void;
}) {
  return (
    <tr onClick={() => onSelect(product.id)}>
      <td>{product.name}</td>
      <td>${product.price}</td>
      <td>{product.category}</td>
    </tr>
  );
});

function ProductTable({ products }: { products: Product[] }) {
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('all');
  const [selected, setSelected] = useState<number | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  // Memoize filtering (can be expensive with thousands of items)
  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch   = p.name.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchCategory = category === 'all' || p.category === category;
      return matchSearch && matchCategory;
    });
  }, [products, debouncedSearch, category]);

  // Memoize unique categories
  const categories = useMemo(
    () => ['all', ...new Set(products.map(p => p.category))],
    [products]
  );

  // Stable: not recreated when search/category changes
  const handleSelect = useCallback((id: number) => {
    setSelected(id);
  }, []);

  return (
    <div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." />
      <select value={category} onChange={e => setCategory(e.target.value)}>
        {categories.map(cat => <option key={cat}>{cat}</option>)}
      </select>
      <p>{filtered.length} products</p>
      <table>
        <tbody>
          {filtered.map(p => (
            <ProductRow key={p.id} product={p} onSelect={handleSelect} />
          ))}
        </tbody>
      </table>
      {selected && <p>Selected: {selected}</p>}
    </div>
  );
}
```
