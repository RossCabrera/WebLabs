# 🪝 Custom Hooks — Custom React Hooks

## What Are They?

**Custom hooks** are functions that start with `use` and encapsulate reusable logic using other hooks. They allow you to **separate component logic from the UI**.

```text
Rules:
✅ The name must start with "use"
✅ Can only be called inside components or other hooks
✅ Return what the component needs (state, functions, values)
```

---

## Base Pattern

```ts
// src/hooks/useExample.ts
import { useState, useEffect } from 'react';

function useExample(param: string) {
  // logic here (useState, useEffect, fetch, etc.)
  const [data, setData] = useState(null);

  // return what the component needs
  return { data };
}

export default useExample;
```

---

## 1. `useFetch` — Generic HTTP Requests

```ts
// src/hooks/useFetch.ts
import { useState, useEffect } from 'react';

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData]       = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [url, trigger]);

  const refetch = () => setTrigger(t => t + 1);

  return { data, loading, error, refetch };
}

export default useFetch;
```

```tsx
// Usage in component — very clean!
function UserProfile({ id }: { id: number }) {
  const { data: user, loading, error, refetch } = useFetch<User>(
    `https://api.example.com/users/${id}`
  );

  if (loading) return <p>Loading...</p>;
  if (error)   return <p>Error: {error} <button onClick={refetch}>Retry</button></p>;

  return <h2>{user?.name}</h2>;
}
```

---

## 2. `useLocalStorage` — Persistence in localStorage

```ts
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  const removeValue = () => {
    localStorage.removeItem(key);
    setValue(initialValue);
  };

  return [value, setValue, removeValue] as const;
}

export default useLocalStorage;
```

```tsx
// Usage
function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');

  return (
    <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}
```

---

## 3. `useDebounce` — Reusable (covered in useEffect chapter)

```ts
// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay = 500): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default useDebounce;
```

---

## 4. `useToggle` — Booleans with Toggle

```ts
// src/hooks/useToggle.ts
import { useState, useCallback } from 'react';

function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle    = useCallback(() => setValue(v => !v), []);
  const setTrue   = useCallback(() => setValue(true),    []);
  const setFalse  = useCallback(() => setValue(false),   []);

  return { value, toggle, setTrue, setFalse };
}

export default useToggle;
```

```tsx
function Modal() {
  const { value: isOpen, toggle, setFalse: close } = useToggle();

  return (
    <>
      <button onClick={toggle}>Open modal</button>
      {isOpen && (
        <div className="modal">
          <p>Modal content</p>
          <button onClick={close}>Close</button>
        </div>
      )}
    </>
  );
}
```

---

## 5. `useCounter` — Counter with Limits

```ts
// src/hooks/useCounter.ts
import { useState } from 'react';

interface UseCounterOptions {
  min?: number;
  max?: number;
  step?: number;
}

function useCounter(initialValue = 0, options: UseCounterOptions = {}) {
  const { min = -Infinity, max = Infinity, step = 1 } = options;
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(c => Math.min(c + step, max));
  const decrement = () => setCount(c => Math.max(c - step, min));
  const reset     = () => setCount(initialValue);
  const set       = (val: number) => setCount(Math.min(Math.max(val, min), max));

  return { count, increment, decrement, reset, set };
}

export default useCounter;
```

```tsx
function QuantitySelector() {
  const { count, increment, decrement } = useCounter(1, { min: 1, max: 99 });

  return (
    <div>
      <button onClick={decrement}>−</button>
      <span>{count}</span>
      <button onClick={increment}>+</button>
    </div>
  );
}
```

---

## 6. `useForm` — Generic Forms

```ts
// src/hooks/useForm.ts
import { useState } from 'react';

type ValidationRules<T> = Partial<{
  [K in keyof T]: (value: T[K]) => string | null;
}>;

function useForm<T extends Record<string, unknown>>(
  initialValues: T,
  validations?: ValidationRules<T>
) {
  const [values, setValues]   = useState<T>(initialValues);
  const [errors, setErrors]   = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));

    if (validations?.[name as keyof T]) {
      const error = validations[name as keyof T]!(value as T[keyof T]);
      setErrors(prev => ({ ...prev, [name]: error ?? undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  const isValid = Object.values(errors).every(e => !e);

  return { values, errors, touched, handleChange, handleBlur, reset, isValid };
}

export default useForm;
```

```tsx
// Usage
function RegisterForm() {
  const { values, errors, touched, handleChange, handleBlur, isValid } = useForm(
    { email: '', password: '' },
    {
      email:    v => (!v.includes('@') ? 'Invalid email' : null),
      password: v => (v.length < 8 ? 'Minimum 8 characters' : null),
    }
  );

  return (
    <form>
      <input name="email" value={values.email} onChange={handleChange} onBlur={handleBlur} />
      {touched.email && errors.email && <p>{errors.email}</p>}

      <input name="password" type="password" value={values.password} onChange={handleChange} onBlur={handleBlur} />
      {touched.password && errors.password && <p>{errors.password}</p>}

      <button type="submit" disabled={!isValid}>Register</button>
    </form>
  );
}
```

---

## 7. `useWindowSize` — Window Dimensions

```ts
// src/hooks/useWindowSize.ts
import { useState, useEffect } from 'react';

interface WindowSize { width: number; height: number; }

function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>({
    width:  window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

export default useWindowSize;
```

---

## Folder Structure Convention

```text
src/
└── hooks/
    ├── useFetch.ts          # generic HTTP
    ├── useDebounce.ts       # debounce
    ├── useLocalStorage.ts   # persistence
    ├── useToggle.ts         # booleans
    ├── useWindowSize.ts     # viewport
    ├── useForm.ts           # forms
    └── useAuth.ts           # authentication (uses Context)
```
