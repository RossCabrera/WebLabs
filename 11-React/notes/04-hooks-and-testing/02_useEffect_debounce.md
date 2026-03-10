# ⚡ useEffect + Debounce

## useEffect — Concepts

`useEffect` runs code **after** React renders the component. It is used for side effects: HTTP requests, subscriptions, timers, DOM manipulation, etc.

```tsx
useEffect(() => {
  // 1. Effect code
  return () => {
    // 2. Cleanup: runs on unmount or before the effect re-runs
  };
}, [/* 3. dependencies */]);
```

---

## Dependency Array — The 3 Forms

```tsx
// 1. No array → runs on EVERY render
useEffect(() => {
  console.log('Runs on every render');
});

// 2. Empty array [] → runs ONCE (on mount)
useEffect(() => {
  console.log('Only on component mount');
  return () => console.log('Only on unmount');
}, []);

// 3. With dependencies → runs when a dependency changes
useEffect(() => {
  console.log(`userId changed to: ${userId}`);
}, [userId]);
```

---

## Common Use Cases

### HTTP request on mount

```tsx
useEffect(() => {
  const controller = new AbortController();

  fetch(`/api/users/${id}`, { signal: controller.signal })
    .then(res => res.json())
    .then(setUser)
    .catch(err => { if (err.name !== 'AbortError') setError(err.message); });

  return () => controller.abort();
}, [id]);
```

### Subscription / event listener

```tsx
useEffect(() => {
  const handleResize = () => setWindowWidth(window.innerWidth);

  window.addEventListener('resize', handleResize);

  return () => window.removeEventListener('resize', handleResize); // cleanup!
}, []);
```

### Sync with localStorage

```tsx
useEffect(() => {
  localStorage.setItem('theme', theme);
}, [theme]);
```

### Change page title

```tsx
useEffect(() => {
  document.title = `${productName} — My Store`;
}, [productName]);
```

---

## ⚠️ Rules and Common Mistakes

```tsx
// ❌ Don't use async directly in useEffect
useEffect(async () => { ... }, []); // Error: useEffect doesn't accept async

// ✅ Async function inside the effect
useEffect(() => {
  const load = async () => {
    const data = await fetchData();
    setData(data);
  };
  load();
}, []);

// ❌ Missing dependency (React warns with lint)
const [query, setQuery] = useState('');
useEffect(() => {
  search(query); // query is a dependency but not in the array
}, []);          // ← should be [query]

// ✅ Correct
useEffect(() => {
  search(query);
}, [query]);
```

---

## Debounce — What Is It?

**Debounce** postpones executing a function until a certain amount of time has passed without it being called again. Ideal for real-time search.

```text
Without debounce:  User types "react" → 5 HTTP requests (r, re, rea, reac, react)
With debounce:     User types "react" → 1 HTTP request (only after stopping)
```

---

## Manual Debounce with useEffect

```tsx
// src/components/SearchInput.tsx
import { useState, useEffect } from 'react';

interface SearchInputProps {
  onSearch: (query: string) => void;
  delay?: number;
}

function SearchInput({ onSearch, delay = 500 }: SearchInputProps) {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    // Create a timer that fires the search after the delay
    const timer = setTimeout(() => {
      onSearch(inputValue);
    }, delay);

    // Cleanup: cancel the timer if the user keeps typing
    return () => clearTimeout(timer);
  }, [inputValue, delay, onSearch]);

  return (
    <input
      type="text"
      value={inputValue}
      onChange={e => setInputValue(e.target.value)}
      placeholder="Search..."
    />
  );
}

export default SearchInput;
```

---

## Custom Hook: `useDebounce`

Encapsulate debounce in a reusable hook:

```ts
// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
```

### Hook usage

```tsx
// src/components/ProductSearch.tsx
import { useState, useEffect } from 'react';
import useDebounce from '../hooks/useDebounce';
import { searchProducts } from '../services/productsService';

function ProductSearch() {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Only changes after the user stops typing for 500ms
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const search = async () => {
      setLoading(true);
      try {
        const data = await searchProducts(debouncedQuery);
        setResults(data);
      } finally {
        setLoading(false);
      }
    };

    search();
  }, [debouncedQuery]); // ← only runs when debouncedQuery changes

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search products..."
      />
      {loading && <p>Searching...</p>}
      <ul>
        {results.map((item: any) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Debounce with `useMemo` and Stable Reference

To pass debounced functions as props without recreating them on each render:

```tsx
import { useMemo } from 'react';
import { debounce } from 'lodash'; // npm install lodash @types/lodash

function ParentComponent() {
  const handleSearch = useMemo(
    () => debounce((query: string) => {
      console.log('Searching:', query);
      // API call...
    }, 400),
    [] // created only once
  );

  // Clean up debounce on unmount
  useEffect(() => {
    return () => handleSearch.cancel();
  }, [handleSearch]);

  return <input onChange={e => handleSearch(e.target.value)} />;
}
```

---

## Debounce Flow Diagram

```text
User types: "r"     → timer(500ms) starts
User types: "re"    → previous timer CANCELLED, new timer(500ms)
User types: "rea"   → previous timer CANCELLED, new timer(500ms)
User types: "reac"  → previous timer CANCELLED, new timer(500ms)
User types: "react" → previous timer CANCELLED, new timer(500ms)
...500ms without typing...
→ Search fires with "react" ✅ (only 1 HTTP request)
```

---

## Throttle vs Debounce

```text
Debounce  → waits X ms after the LAST event    (search)
Throttle  → fires at most once every X ms       (scroll, resize)
```

```ts
// Manual throttle
function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => clearTimeout(handler);
  }, [value, limit]);

  return throttledValue;
}
```
