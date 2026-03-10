# 🪝 Testing React Hooks

## Why Hooks Need Their Own Testing Approach

Hooks can only be called inside React components. If you try to call `useState` or `useEffect` directly in a test, React throws an error.

The solution: **`renderHook`** from Testing Library, which wraps the hook in an invisible component.

```bash
npm install -D @testing-library/react
# renderHook is included in @testing-library/react v13+
```

---

## `renderHook` — The Base Tool

```tsx
import { renderHook } from '@testing-library/react';

// Basic syntax
const { result, rerender, unmount } = renderHook(() => myHook(args));

// result.current → current value returned by the hook
```

---

## 1. Testing Internal `useState` of a Hook

```ts
// src/hooks/useCounter.ts
import { useState } from 'react';

interface UseCounterOptions { min?: number; max?: number; }

function useCounter(initial = 0, { min = -Infinity, max = Infinity }: UseCounterOptions = {}) {
  const [count, setCount] = useState(initial);

  const increment = () => setCount(c => Math.min(c + 1, max));
  const decrement = () => setCount(c => Math.max(c - 1, min));
  const reset     = () => setCount(initial);

  return { count, increment, decrement, reset };
}

export default useCounter;
```

```ts
// src/hooks/useCounter.test.ts
import { renderHook, act } from '@testing-library/react';
import useCounter from './useCounter';

describe('useCounter', () => {

  test('returns the default initial value (0)', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  test('returns the provided initial value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  test('increment increases the counter by 1', () => {
    const { result } = renderHook(() => useCounter(5));

    // ⚠️ All state updates inside a hook must be wrapped in act()
    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(6);
  });

  test('decrement decreases the counter by 1', () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(4);
  });

  test('reset returns to the initial value', () => {
    const { result } = renderHook(() => useCounter(10));

    act(() => {
      result.current.increment();
      result.current.increment();
    });
    expect(result.current.count).toBe(12);

    act(() => {
      result.current.reset();
    });
    expect(result.current.count).toBe(10); // back to initial
  });

  test('does not exceed the configured maximum', () => {
    const { result } = renderHook(() => useCounter(9, { max: 10 }));

    act(() => {
      result.current.increment(); // 10
      result.current.increment(); // tries 11, stays at 10
    });

    expect(result.current.count).toBe(10);
  });

  test('does not go below the configured minimum', () => {
    const { result } = renderHook(() => useCounter(1, { min: 0 }));

    act(() => {
      result.current.decrement(); // 0
      result.current.decrement(); // tries -1, stays at 0
    });

    expect(result.current.count).toBe(0);
  });
});
```

---

## 2. `act()` — Why It's Necessary

`act()` ensures React processes all state changes before you make assertions. Without `act()`, the state may not have updated yet.

```ts
// ❌ Without act: state may not be updated when asserting
const { result } = renderHook(() => useCounter());
result.current.increment();
expect(result.current.count).toBe(1); // may fail

// ✅ With act: waits for React to update state
act(() => {
  result.current.increment();
});
expect(result.current.count).toBe(1); // always correct
```

---

## 3. `rerender` — Testing Prop/Argument Changes

```ts
// src/hooks/useTitle.ts
import { useEffect } from 'react';

function useTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

export default useTitle;
```

```ts
// src/hooks/useTitle.test.ts
import { renderHook } from '@testing-library/react';
import useTitle from './useTitle';

test('updates the document title', () => {
  const { rerender } = renderHook(
    ({ title }: { title: string }) => useTitle(title),
    { initialProps: { title: 'Initial Page' } }
  );

  expect(document.title).toBe('Initial Page');

  // Change the props and verify the hook reacts
  rerender({ title: 'Updated Page' });

  expect(document.title).toBe('Updated Page');
});
```

---

## 4. `unmount` — Testing useEffect Cleanup

```ts
// src/hooks/useEventListener.ts
import { useEffect } from 'react';

function useEventListener(event: string, handler: EventListener) {
  useEffect(() => {
    window.addEventListener(event, handler);
    return () => window.removeEventListener(event, handler); // cleanup
  }, [event, handler]);
}

export default useEventListener;
```

```ts
// src/hooks/useEventListener.test.ts
import { renderHook } from '@testing-library/react';
import useEventListener from './useEventListener';

test('adds and removes the event listener correctly', () => {
  const addSpy    = vi.spyOn(window, 'addEventListener');
  const removeSpy = vi.spyOn(window, 'removeEventListener');
  const handler   = vi.fn();

  const { unmount } = renderHook(() => useEventListener('click', handler));

  // On mount: must add the listener
  expect(addSpy).toHaveBeenCalledWith('click', handler);

  // On unmount: must remove the listener (cleanup)
  unmount();
  expect(removeSpy).toHaveBeenCalledWith('click', handler);

  addSpy.mockRestore();
  removeSpy.mockRestore();
});
```

---

## 5. Testing `useToggle`

```ts
// src/hooks/useToggle.ts
import { useState, useCallback } from 'react';

function useToggle(initial = false) {
  const [value, setValue]  = useState(initial);
  const toggle   = useCallback(() => setValue(v => !v), []);
  const setTrue  = useCallback(() => setValue(true),    []);
  const setFalse = useCallback(() => setValue(false),   []);
  return { value, toggle, setTrue, setFalse };
}

export default useToggle;
```

```ts
// src/hooks/useToggle.test.ts
import { renderHook, act } from '@testing-library/react';
import useToggle from './useToggle';

describe('useToggle', () => {
  test('starts with false by default', () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current.value).toBe(false);
  });

  test('starts with the provided value', () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current.value).toBe(true);
  });

  test('toggle flips the value to its opposite', () => {
    const { result } = renderHook(() => useToggle(false));

    act(() => { result.current.toggle(); });
    expect(result.current.value).toBe(true);

    act(() => { result.current.toggle(); });
    expect(result.current.value).toBe(false);
  });

  test('setTrue sets the value to true', () => {
    const { result } = renderHook(() => useToggle(false));
    act(() => { result.current.setTrue(); });
    expect(result.current.value).toBe(true);
  });

  test('setFalse sets the value to false', () => {
    const { result } = renderHook(() => useToggle(true));
    act(() => { result.current.setFalse(); });
    expect(result.current.value).toBe(false);
  });
});
```

---

## 6. Hook with Context — Wrapping with Provider

```ts
// src/hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
```

```tsx
// src/hooks/useAuth.test.tsx
import { renderHook } from '@testing-library/react';
import { AuthProvider } from '../context/AuthContext';
import { useAuth } from './useAuth';

// Wrapper that provides the required context
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

test('useAuth returns the authentication context', () => {
  const { result } = renderHook(() => useAuth(), { wrapper });

  expect(result.current.isAuthenticated).toBe(false);
  expect(result.current.user).toBeNull();
  expect(typeof result.current.login).toBe('function');
  expect(typeof result.current.logout).toBe('function');
});

test('throws error if used outside the Provider', () => {
  // Without wrapper → must throw the error
  expect(() => {
    renderHook(() => useAuth());
  }).toThrow('useAuth must be used inside AuthProvider');
});
```

---

## Quick Reference

```ts
// Standard hook test structure
import { renderHook, act } from '@testing-library/react';

const { result, rerender, unmount } = renderHook(
  (props) => myHook(props),
  {
    initialProps: { /* initial props */ },
    wrapper: MyProvider,  // for hooks that require Context
  }
);

// Read the current value
result.current.somePropertyOrFunction

// Execute functions that change state
act(() => { result.current.someFunction(); });

// Change props
rerender({ newProp: 'value' });

// Unmount (test cleanup)
unmount();
```
