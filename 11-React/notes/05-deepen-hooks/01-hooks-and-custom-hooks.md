# 01. Hooks & Custom Hooks

> **Goal:** Reinforce core React hooks and compose them into reusable custom hooks.

---

## Table of Contents

1. [useState](#usestate)
2. [useRef](#useref)
3. [useEffect – Problems & Solutions](#useeffect)
4. [Custom Hooks](#custom-hooks)
   - [useCounter](#usecounter)
   - [usePokemon](#usepokemon)
   - [useTrafficLight](#usetrafficlight)
5. [Connecting Custom Hooks](#connecting-custom-hooks)
6. [Atomicity & Best Practices](#atomicity--best-practices)

---

## useState

`useState` stores a value that, when updated, causes the component to re-render.

```tsx
const [value, setValue] = useState<Type>(initialValue);
```

### Key Rules

- **Never mutate state directly** — always call the setter.
- Use the **functional updater** when the new value depends on the previous one.
- Each `useState` call is independent; group related values in an object only when they always change together.

### Example – Counter with functional updater

```tsx
import { useState } from 'react';

const Counter: React.FC = () => {
  const [count, setCount] = useState<number>(0);

  // ✅ Functional updater — safe for batched / async updates
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset     = () => setCount(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={decrement}>−</button>
      <button onClick={reset}>Reset</button>
      <button onClick={increment}>+</button>
    </div>
  );
};
```

### Example – Object state

```tsx
interface Form {
  name: string;
  email: string;
}

const [form, setForm] = useState<Form>({ name: '', email: '' });

// ✅ Spread existing state to avoid losing other fields
const handleChange = (field: keyof Form, value: string) =>
  setForm(prev => ({ ...prev, [field]: value }));
```

### Common Pitfalls

| Pitfall | Fix |
| :--------- | :----- |
| `count++` (mutation) | `setCount(prev => prev + 1)` |
| Stale closure in async callback | Use functional updater |
| Storing derived data in state | Compute it during render instead |

---

## useRef

`useRef` gives you a **mutable container** (`.current`) that persists across renders **without causing re-renders** when changed.

Two main uses:

1. **DOM access** – focus, scroll, measure elements.
2. **Mutable values** – timers, previous values, flags.

```tsx
const ref = useRef<Type>(initialValue);
```

### Example – Auto-focus an input

```tsx
import { useRef, useEffect } from 'react';

const SearchBox: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} placeholder="Search…" />;
};
```

### Example – Store a previous value

```tsx
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => { ref.current = value; });
  return ref.current;
}
```

### Example – Interval without re-render

```tsx
const intervalRef = useRef<number | null>(null);

const start = () => {
  intervalRef.current = window.setInterval(() => {
    console.log('tick');
  }, 1000);
};

const stop = () => {
  if (intervalRef.current) clearInterval(intervalRef.current);
};
```

### useRef vs useState

| | `useState` | `useRef` |
| :-- | :----------- | :--------- |
| Triggers re-render | ✅ Yes | ❌ No |
| Survives re-renders | ✅ Yes | ✅ Yes |
| DOM access | ❌ No | ✅ Yes |
| Mutable directly | ❌ No | ✅ Yes (`.current`) |

---

## useEffect

Runs **side effects** (data fetching, subscriptions, timers) after render.

```tsx
useEffect(() => {
  // effect
  return () => { /* cleanup */ };
}, [dependencies]);
```

### Dependency Array Rules

| Array | When it runs |
| :------- | :------------- |
| *omitted* | Every render |
| `[]` | Once, on mount |
| `[a, b]` | When `a` or `b` changes |

---

### Problem 1 – Infinite Loop

```tsx
// ❌ BAD – data is recreated every render → triggers effect → re-render → …
const [data, setData] = useState([]);
useEffect(() => {
  setData([1, 2, 3]);
}, [data]); // data changes every time!

// ✅ FIX – only run on mount
useEffect(() => {
  setData([1, 2, 3]);
}, []);
```

### Problem 2 – Missing Cleanup (Memory Leak)

```tsx
// ❌ BAD – subscription never removed
useEffect(() => {
  const sub = eventEmitter.subscribe(handler);
}, []);

// ✅ FIX – return cleanup function
useEffect(() => {
  const sub = eventEmitter.subscribe(handler);
  return () => sub.unsubscribe();
}, []);
```

### Problem 3 – Race Condition in Fetch

```tsx
// ✅ FIX – ignore stale responses with AbortController
useEffect(() => {
  const controller = new AbortController();

  fetch(`/api/user/${id}`, { signal: controller.signal })
    .then(r => r.json())
    .then(setUser)
    .catch(err => {
      if (err.name !== 'AbortError') console.error(err);
    });

  return () => controller.abort();
}, [id]);
```

### Problem 4 – Stale Closure

```tsx
// ❌ BAD – handler captures initial `count` value
useEffect(() => {
  const id = setInterval(() => {
    console.log(count); // always 0
  }, 1000);
  return () => clearInterval(id);
}, []); // empty deps = stale closure

// ✅ FIX – use a ref to hold latest value
const countRef = useRef(count);
useEffect(() => { countRef.current = count; }, [count]);

useEffect(() => {
  const id = setInterval(() => {
    console.log(countRef.current); // always fresh
  }, 1000);
  return () => clearInterval(id);
}, []);
```

---

## Custom Hooks

A custom hook is just a function whose name starts with `use` and calls other hooks. Its purpose is to **extract and reuse stateful logic** without duplicating code.

```text
Component logic = UI (JSX) + Behaviour (custom hook)
```

---

### useCounter

```tsx
// hooks/useCounter.ts
import { useState, useCallback } from 'react';

interface UseCounterOptions {
  initial?: number;
  min?: number;
  max?: number;
  step?: number;
}

interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  set: (value: number) => void;
}

export function useCounter({
  initial = 0,
  min = -Infinity,
  max = Infinity,
  step = 1,
}: UseCounterOptions = {}): UseCounterReturn {
  const [count, setCount] = useState<number>(initial);

  const increment = useCallback(() =>
    setCount(prev => Math.min(prev + step, max)), [step, max]);

  const decrement = useCallback(() =>
    setCount(prev => Math.max(prev - step, min)), [step, min]);

  const reset = useCallback(() => setCount(initial), [initial]);

  const set = useCallback((value: number) =>
    setCount(Math.min(Math.max(value, min), max)), [min, max]);

  return { count, increment, decrement, reset, set };
}
```

```tsx
// Usage
const { count, increment, decrement, reset } = useCounter({ initial: 5, min: 0, max: 10 });
```

---

### usePokemon

```tsx
// hooks/usePokemon.ts
import { useState, useEffect } from 'react';

interface Pokemon {
  id: number;
  name: string;
  sprites: { front_default: string };
  types: { type: { name: string } }[];
}

interface UsePokemonReturn {
  pokemon: Pokemon | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function usePokemon(nameOrId: string | number): UsePokemonReturn {
  const [pokemon, setPokemon]   = useState<Pokemon | null>(null);
  const [loading, setLoading]   = useState<boolean>(false);
  const [error, setError]       = useState<string | null>(null);
  const [trigger, setTrigger]   = useState<number>(0);

  useEffect(() => {
    if (!nameOrId) return;

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`, {
      signal: controller.signal,
    })
      .then(r => {
        if (!r.ok) throw new Error(`Not found: ${nameOrId}`);
        return r.json();
      })
      .then(data => { setPokemon(data); setLoading(false); })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [nameOrId, trigger]);

  const refetch = () => setTrigger(t => t + 1);

  return { pokemon, loading, error, refetch };
}
```

```tsx
// Usage
const { pokemon, loading, error } = usePokemon('pikachu');

if (loading) return <p>Loading…</p>;
if (error)   return <p>Error: {error}</p>;
return <img src={pokemon?.sprites.front_default} alt={pokemon?.name} />;
```

---

### useTrafficLight

Demonstrates **sequential state cycling** with a timer.

```tsx
// hooks/useTrafficLight.ts
import { useState, useEffect, useRef } from 'react';

type Light = 'red' | 'yellow' | 'green';

const CYCLE: Light[] = ['red', 'green', 'yellow'];
const DURATIONS: Record<Light, number> = {
  red:    3000,
  green:  3000,
  yellow: 1000,
};

interface UseTrafficLightReturn {
  light: Light;
  isRunning: boolean;
  toggle: () => void;
  reset: () => void;
}

export function useTrafficLight(): UseTrafficLightReturn {
  const [index, setIndex]         = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const timeoutRef                = useRef<number | null>(null);

  const light = CYCLE[index];

  useEffect(() => {
    if (!isRunning) return;

    timeoutRef.current = window.setTimeout(() => {
      setIndex(prev => (prev + 1) % CYCLE.length);
    }, DURATIONS[light]);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [index, isRunning, light]);

  const toggle = () => setIsRunning(r => !r);
  const reset  = () => { setIndex(0); setIsRunning(true); };

  return { light, isRunning, toggle, reset };
}
```

```tsx
// Usage
const { light, isRunning, toggle } = useTrafficLight();

const colors = { red: 'bg-red-500', yellow: 'bg-yellow-400', green: 'bg-green-500' };

return (
  <div>
    <div className={`w-16 h-16 rounded-full ${colors[light]}`} />
    <button onClick={toggle}>{isRunning ? 'Pause' : 'Resume'}</button>
  </div>
);
```

---

## Connecting Custom Hooks

Custom hooks can be **composed** — the output of one becomes the input of another.

```tsx
// hooks/usePokemonList.ts — combines useCounter + usePokemon
import { useCounter }  from './useCounter';
import { usePokemon }  from './usePokemon';

export function usePokemonList(total = 151) {
  const { count: id, increment: next, decrement: prev } =
    useCounter({ initial: 1, min: 1, max: total });

  const { pokemon, loading, error } = usePokemon(id);

  return { pokemon, loading, error, next, prev, currentId: id };
}
```

```tsx
// Component stays clean — no logic, only rendering
const PokemonBrowser: React.FC = () => {
  const { pokemon, loading, next, prev, currentId } = usePokemonList();

  return (
    <div>
      <h2>#{currentId} {pokemon?.name}</h2>
      {loading
        ? <p>Loading…</p>
        : <img src={pokemon?.sprites.front_default} alt={pokemon?.name} />
      }
      <button onClick={prev}>← Prev</button>
      <button onClick={next}>Next →</button>
    </div>
  );
};
```

**Pattern:** Keep components as *dumb* as possible — they receive data and call actions. All logic lives in hooks.

---

## Atomicity & Best Practices

### Atomic State

Each hook should manage **one coherent concern**. Avoid hooks that do too much.

```tsx
// ❌ Too broad — mixing UI + data concerns
function useDashboard() { /* fetches data, manages modal, tracks page */ }

// ✅ Atomic — each hook has one job
function useUserData(id: string) { /* only fetches user */ }
function useModal()               { /* only open/close state */ }
function usePagination(total: number) { /* only page tracking */ }
```

### Naming Conventions

- `use` prefix is **mandatory** (React's linting rules depend on it).
- Name reflects **what** it manages, not **how**: `useAuth`, `usePokemon`, not `useFetchEffect`.

### Return Shape

Prefer returning an **object** for flexibility (adding fields later won't break callers):

```tsx
// ✅ Object — easy to extend, order-independent destructuring
return { count, increment, decrement, reset };

// ⚠️ Tuple — good only when there are exactly 2 values (like useState)
return [value, setValue] as const;
```
