# 📌 useRef — The Ref Hook

## What Is useRef?

`useRef` creates a `{ current: value }` object that:

1. **Persists** between renders (does not reset)
2. **Does not trigger re-renders** when it changes (unlike `useState`)
3. Can point directly to **DOM elements**

```ts
const ref = useRef(initialValue);
// ref.current → access the value
// ref.current = newValue → modify without re-render
```

---

## Use Case 1: DOM References

### Auto-focus an input

```tsx
import { useRef, useEffect } from 'react';

function SearchBox() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus(); // focus on mount
  }, []);

  return <input ref={inputRef} placeholder="Search..." />;
}
```

### Scroll to element

```tsx
function Chat({ messages }: { messages: string[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to the last message
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-container">
      {messages.map((msg, i) => <p key={i}>{msg}</p>)}
      <div ref={bottomRef} />  {/* invisible anchor at the bottom */}
    </div>
  );
}
```

### Get element dimensions

```tsx
import { useRef, useState, useEffect } from 'react';

function MeasuredBox() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (boxRef.current) {
      const { width, height } = boxRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, []);

  return (
    <div ref={boxRef} className="resizable-box">
      <p>Width: {dimensions.width}px</p>
      <p>Height: {dimensions.height}px</p>
    </div>
  );
}
```

---

## Use Case 2: Persistent Value Without Re-render

### Store the previous value of state

```tsx
import { useRef, useEffect, useState } from 'react';

function usePrevious<T>(value: T): T | undefined {
  const prevRef = useRef<T>();

  useEffect(() => {
    prevRef.current = value; // updates AFTER the render
  });

  return prevRef.current; // returns the value from the PREVIOUS render
}

// Usage
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCount ?? '—'}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </div>
  );
}
```

### Skip the first render in useEffect

```tsx
function SearchResults({ query }: { query: string }) {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // Don't run on the first render
    }

    console.log('Searching:', query);
    // fetch...
  }, [query]);

  return <p>Results for: {query}</p>;
}
```

---

## Use Case 3: Stable References (Timers, Instances)

### Timer / Interval

```tsx
function Stopwatch() {
  const [time, setTime]       = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    if (running) return;
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setTime(t => t + 1);
    }, 1000);
  };

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRunning(false);
  };

  const reset = () => {
    stop();
    setTime(0);
  };

  // Clean up on unmount
  useEffect(() => () => stop(), []);

  const format = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div>
      <h2>{format(time)}</h2>
      <button onClick={start}  disabled={running}>▶ Start</button>
      <button onClick={stop}   disabled={!running}>⏸ Pause</button>
      <button onClick={reset}>↺ Reset</button>
    </div>
  );
}
```

### Cancel request with ref

```tsx
function DataLoader() {
  const [data, setData] = useState(null);
  const controllerRef = useRef<AbortController | null>(null);

  const loadData = async (id: number) => {
    // Cancel previous request if it exists
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();

    try {
      const res = await fetch(`/api/data/${id}`, {
        signal: controllerRef.current.signal,
      });
      const json = await res.json();
      setData(json);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error(err);
      }
    }
  };

  return <button onClick={() => loadData(1)}>Load</button>;
}
```

---

## Use Case 4: `forwardRef` — Passing Ref to a Child Component

By default, `ref` cannot be passed as a prop to custom components. Use `forwardRef`:

```tsx
import { forwardRef } from 'react';

interface InputProps {
  label: string;
  placeholder?: string;
}

// forwardRef lets the parent control the internal input
const CustomInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label, placeholder }, ref) => {
    return (
      <div>
        <label>{label}</label>
        <input ref={ref} placeholder={placeholder} />
      </div>
    );
  }
);

CustomInput.displayName = 'CustomInput'; // for DevTools

// Usage in parent
function Form() {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => inputRef.current?.focus();

  return (
    <>
      <CustomInput ref={inputRef} label="Name" placeholder="Your name" />
      <button onClick={focusInput}>Focus input</button>
    </>
  );
}
```

---

## useState vs useRef — When to Use Each

| | `useState` | `useRef` |
| :--- | :--- | :--- |
| Triggers re-render? | ✅ Yes | ❌ No |
| Persists between renders? | ✅ Yes | ✅ Yes |
| For displaying in UI? | ✅ Yes | ❌ No |
| For referencing DOM? | ❌ No | ✅ Yes |
| For timers/instances? | ❌ No | ✅ Yes |

```tsx
// Simple rule:
// If the value affects the UI → useState
// If the value does NOT affect the UI → useRef
```
