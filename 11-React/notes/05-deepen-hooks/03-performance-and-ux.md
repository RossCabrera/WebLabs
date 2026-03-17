# 03. Performance & UX Optimisation

> **Goal:** Improve perceived and actual performance with memoisation, optimistic updates, and concurrent React features.

---

## Table of Contents

1. [Memoisation Fundamentals](#memoisation-fundamentals)
2. [useMemo](#usememo)
3. [useCallback](#usecallback)
4. [React.memo](#reactmemo)
5. [useOptimistic](#useoptimistic)
6. [useTransition](#usetransition)
7. [Simulating Failures & Rollbacks](#simulating-failures--rollbacks)
8. [New `use` API](#new-use-api)
9. [Suspense](#suspense)

---

## Memoisation Fundamentals

Memoisation caches the result of an expensive computation so it is not recalculated on every render.

**Two things React memoises:**

- **Values** → `useMemo`
- **Functions** → `useCallback`
- **Components** → `React.memo`

### When to reach for memoisation

React renders are fast. Memoisation adds complexity — only use it when:

1. A computation is measurably slow (profile first!).
2. A function/value is used as a dependency of `useEffect` or prop of a memoised child.
3. You are passing stable callbacks through many layers (avoids cascading re-renders).

> **Rule of thumb:** Write it without memoisation first. Add memoisation only after profiling confirms it's needed.

---

## useMemo

Caches an **expensive computed value** between renders.

```tsx
const memoizedValue = useMemo(() => expensiveCalculation(a, b), [a, b]);
```

Recomputes only when `a` or `b` changes.

### Example – Filtering a large list

```tsx
import { useState, useMemo } from 'react';

interface Product { id: number; name: string; price: number; category: string; }

const ProductList: React.FC<{ products: Product[] }> = ({ products }) => {
  const [search, setSearch]   = useState('');
  const [maxPrice, setMax]    = useState(1000);

  // ✅ Only recomputes when products, search, or maxPrice changes
  const filtered = useMemo(() =>
    products
      .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
      .filter(p => p.price <= maxPrice),
    [products, search, maxPrice]
  );

  // ✅ Derived stat — recalculate only when filtered list changes
  const averagePrice = useMemo(() =>
    filtered.length
      ? filtered.reduce((sum, p) => sum + p.price, 0) / filtered.length
      : 0,
    [filtered]
  );

  return (
    <div>
      <input value={search} onChange={e => setSearch(e.target.value)} />
      <p>Avg price: ${averagePrice.toFixed(2)} — {filtered.length} results</p>
      {filtered.map(p => <div key={p.id}>{p.name} – ${p.price}</div>)}
    </div>
  );
};
```

### Common Pitfalls

```tsx
// ❌ Memoising something trivially cheap — waste of memory & indirection
const doubled = useMemo(() => count * 2, [count]);

// ❌ Object in deps — new reference every render defeats the purpose
const config = { theme: 'dark' };
const value = useMemo(() => compute(config), [config]); // re-runs every render

// ✅ Stabilise the object first
const config = useMemo(() => ({ theme: 'dark' }), []);
```

---

## useCallback

Caches a **function reference** between renders.

```tsx
const stableCallback = useCallback(() => doSomething(a, b), [a, b]);
```

### Example – Preventing child re-renders

```tsx
import { useState, useCallback, memo } from 'react';

// Child wrapped in memo — only re-renders if props change
const ExpensiveChild = memo(({ onAction }: { onAction: () => void }) => {
  console.log('Child rendered');
  return <button onClick={onAction}>Action</button>;
});

const Parent: React.FC = () => {
  const [count, setCount] = useState(0);
  const [text, setText]   = useState('');

  // ✅ Stable reference — child does NOT re-render when text changes
  const handleAction = useCallback(() => {
    setCount(prev => prev + 1);
  }, []); // no dependencies needed — uses functional updater

  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <p>Count: {count}</p>
      <ExpensiveChild onAction={handleAction} />
    </div>
  );
};
```

### useCallback in Custom Hooks

```tsx
export function useSearch<T>(items: T[], predicate: (item: T, q: string) => boolean) {
  const [query, setQuery] = useState('');

  // Stable between renders unless items changes
  const results = useMemo(
    () => items.filter(item => predicate(item, query)),
    [items, query, predicate]
  );

  // Stable setter to pass to inputs without triggering re-renders
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value),
    []
  );

  return { query, results, handleChange };
}
```

---

## React.memo

Wraps a component so it only re-renders when its **props change** (shallow comparison by default).

```tsx
const MyComponent = React.memo(({ value }: { value: number }) => {
  return <p>{value}</p>;
});

// Custom comparison function (use sparingly)
const MyComponent = React.memo(
  ({ data }: { data: object }) => <p>{JSON.stringify(data)}</p>,
  (prevProps, nextProps) => prevProps.data.id === nextProps.data.id
);
```

**`React.memo` works best when:**

- The component renders often with the same props.
- It is a pure/presentational component.
- Props are primitives or stable references (from `useMemo`/`useCallback`).

---

## useOptimistic

Provides a **temporary, optimistic version** of state while an async operation is in flight. The UI feels instant; if the operation fails, the state rolls back.

```tsx
import { useOptimistic } from 'react';

// useOptimistic(currentState, updateFn)
const [optimisticItems, addOptimistic] = useOptimistic(
  items,
  (currentItems, newItem: Item) => [...currentItems, newItem]
);
```

### Example – Instant Todo Add

```tsx
import { useState, useOptimistic } from 'react';

interface Todo { id: string; text: string; pending?: boolean; }

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const [optimisticTodos, addOptimistic] = useOptimistic(
    todos,
    (current, newTodo: Todo) => [...current, newTodo]
  );

  const handleAdd = async (text: string) => {
    const temp: Todo = { id: crypto.randomUUID(), text, pending: true };

    // 1. Instantly update UI
    addOptimistic(temp);

    try {
      // 2. Persist to server
      const saved = await api.createTodo(text);
      // 3. Replace optimistic state with real data
      setTodos(prev => [...prev, saved]);
    } catch {
      // 4. Rollback — optimistic state disappears automatically
      // because the underlying `todos` state never changed
      toast.error('Failed to add todo');
    }
  };

  return (
    <ul>
      {optimisticTodos.map(todo => (
        <li key={todo.id} style={{ opacity: todo.pending ? 0.5 : 1 }}>
          {todo.text} {todo.pending && '(saving…)'}
        </li>
      ))}
    </ul>
  );
};
```

---

## useTransition

Marks a state update as **non-urgent**, allowing React to keep the UI responsive while it processes the update in the background.

```tsx
const [isPending, startTransition] = useTransition();
```

### Example – Non-blocking search

```tsx
import { useState, useTransition } from 'react';

const HeavySearch: React.FC = () => {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value); // urgent — update input immediately

    startTransition(() => {
      // non-urgent — React can interrupt this if user keeps typing
      setResults(expensiveFilter(value));
    });
  };

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending && <span>Loading results…</span>}
      {results.map(r => <div key={r}>{r}</div>)}
    </div>
  );
};
```

### useOptimistic vs useTransition

| | `useOptimistic` | `useTransition` |
| :-- | :---------------- | :----------------- |
| Purpose | Show fake data while async op runs | Keep UI responsive during heavy state update |
| Rollback | Automatic if real state doesn't update | N/A — no rollback |
| Typical use | Form submits, likes, cart operations | Tabs, search, navigation |

---

## Simulating Failures & Rollbacks

Testing the rollback path is as important as the happy path.

```tsx
// Simulate a random network failure
async function unreliableApi(data: unknown) {
  await new Promise(res => setTimeout(res, 800)); // fake latency

  if (Math.random() < 0.4) { // 40% failure rate
    throw new Error('Network error');
  }

  return { ...data, id: crypto.randomUUID() };
}
```

```tsx
const handleLike = async (postId: string) => {
  // Optimistic: increment like count instantly
  addOptimistic({ id: postId, liked: true });

  try {
    await unreliableApi({ postId, action: 'like' });
    // Confirm: update real state
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, likes: p.likes + 1, liked: true } : p
    ));
    toast.success('Liked!');
  } catch {
    // Rollback happens automatically (optimistic state discarded)
    toast.error('Could not like post. Try again.');
  }
};
```

---

## New `use` API

React 19's `use` is a new hook that **unwraps Promises and Contexts** inside render. Unlike `useEffect`, you can call it conditionally.

```tsx
import { use } from 'react';

// Works with Promises (inside Suspense boundary)
const data = use(fetchDataPromise);

// Works with Context (alternative to useContext)
const theme = use(ThemeContext);
```

### Example – Fetch inside component

```tsx
import { use, Suspense } from 'react';

// Create the promise OUTSIDE the component to avoid re-creating it every render
const userPromise = fetch('/api/user/1').then(r => r.json());

const UserProfile: React.FC = () => {
  const user = use(userPromise); // suspends until resolved
  return <h1>{user.name}</h1>;
};

const App: React.FC = () => (
  <Suspense fallback={<p>Loading profile…</p>}>
    <UserProfile />
  </Suspense>
);
```

> **Important:** The Promise must be **stable** (created outside or memoised) — don't create it inline in render.

### Conditional use of `use`

```tsx
// ✅ use CAN be called conditionally (unlike other hooks)
const MyComponent: React.FC<{ loadUser: boolean }> = ({ loadUser }) => {
  if (loadUser) {
    const user = use(userPromise); // perfectly valid
    return <p>{user.name}</p>;
  }
  return <p>Guest</p>;
};
```

---

## Suspense

`Suspense` lets you **declaratively handle loading states**. When a child component is "suspended" (waiting for data/code), Suspense shows a fallback instead.

```tsx
import { Suspense, lazy } from 'react';

// Code splitting — load component on demand
const Dashboard = lazy(() => import('./Dashboard'));

const App: React.FC = () => (
  <Suspense fallback={<div>Loading dashboard…</div>}>
    <Dashboard />
  </Suspense>
);
```

### Nested Suspense Boundaries

```tsx
// Granular loading states
<Suspense fallback={<PageSkeleton />}>
  <Header />
  <Suspense fallback={<FeedSkeleton />}>
    <Feed />
  </Suspense>
  <Suspense fallback={<SidebarSkeleton />}>
    <Sidebar />
  </Suspense>
</Suspense>
```

### Suspense + Error Boundary

```tsx
import { Component, type ReactNode } from 'react';

class ErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// Usage
<ErrorBoundary fallback={<p>Something went wrong.</p>}>
  <Suspense fallback={<p>Loading…</p>}>
    <AsyncComponent />
  </Suspense>
</ErrorBoundary>
```

### Suspense + useTransition (Avoid Spinner Flash)

```tsx
const [isPending, startTransition] = useTransition();
const [page, setPage] = useState('home');

// Navigate without showing Suspense fallback — keep old UI visible
const navigate = (next: string) => {
  startTransition(() => setPage(next));
};

// isPending = true during transition — show subtle indicator
return (
  <>
    {isPending && <div className="progress-bar" />}
    <Suspense fallback={<PageSkeleton />}>
      <CurrentPage page={page} />
    </Suspense>
  </>
);
```

---

## Quick Reference

```text
Performance decision tree:
│
├─ Is the value expensive to compute?
│   └─ Yes → useMemo
│
├─ Is the function passed to a child or used as useEffect dep?
│   └─ Yes → useCallback
│
├─ Is the component re-rendering with the same props?
│   └─ Yes → React.memo
│
├─ Does the UI need to feel instant while async op runs?
│   └─ Yes → useOptimistic
│
└─ Does a state update make the UI feel laggy/janky?
    └─ Yes → useTransition
```
