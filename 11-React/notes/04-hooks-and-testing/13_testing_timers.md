# ⏰ Testing Timeouts and Timers

## The Problem with Real Timers

If a function uses a 500ms `setTimeout`, the test **would wait 500ms of real time**. With many tests, that adds up to seconds or minutes. The solution: **fake timers** that Vitest controls.

```text
Real timer:   test waits 500ms → slow ❌
Fake timer:   Vitest advances time manually → instant ✅
```

---

## Fake Timer API in Vitest

```ts
vi.useFakeTimers()              // activate fake timers
vi.useRealTimers()              // restore real timers
vi.advanceTimersByTime(ms)      // advance time by X milliseconds
vi.advanceTimersByTimeAsync(ms) // async version (for promises + timers)
vi.runAllTimers()               // run ALL pending timers
vi.runAllTimersAsync()          // async version
vi.runOnlyPendingTimers()       // run only currently pending timers
vi.clearAllTimers()             // cancel all pending timers
vi.getTimerCount()              // how many timers are pending
```

---

## 1. Basic `setTimeout`

```ts
// src/utils/delay.ts
export function delayedGreeting(name: string, callback: (msg: string) => void) {
  setTimeout(() => {
    callback(`Hello, ${name}!`);
  }, 1000);
}
```

```ts
// src/utils/delay.test.ts
import { delayedGreeting } from './delay';

describe('delayedGreeting', () => {

  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(()  => { vi.useRealTimers(); });

  test('calls the callback after 1 second', () => {
    const callback = vi.fn();

    delayedGreeting('Ana', callback);

    // Before advancing time: callback has NOT been called
    expect(callback).not.toHaveBeenCalled();

    // Advance 999ms: still not
    vi.advanceTimersByTime(999);
    expect(callback).not.toHaveBeenCalled();

    // Advance 1ms more (total 1000ms): now it fires
    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('Hello, Ana!');
  });

  test('does not call the callback if not enough time passes', () => {
    const callback = vi.fn();

    delayedGreeting('Ana', callback);
    vi.advanceTimersByTime(500);

    expect(callback).not.toHaveBeenCalled();
  });
});
```

---

## 2. `setInterval` — Cancel with Cleanup

```ts
// src/hooks/usePolling.ts
import { useEffect, useRef } from 'react';

function usePolling(callback: () => void, interval: number) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const id = setInterval(() => savedCallback.current(), interval);
    return () => clearInterval(id);
  }, [interval]);
}

export default usePolling;
```

```ts
// src/hooks/usePolling.test.ts
import { renderHook } from '@testing-library/react';
import usePolling from './usePolling';

describe('usePolling', () => {

  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(()  => { vi.useRealTimers(); });

  test('calls the callback at the specified interval', () => {
    const callback = vi.fn();

    renderHook(() => usePolling(callback, 1000));

    expect(callback).not.toHaveBeenCalled(); // not called yet

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(2);

    vi.advanceTimersByTime(3000);
    expect(callback).toHaveBeenCalledTimes(5);
  });

  test('stops polling on unmount (cleanup)', () => {
    const callback = vi.fn();

    const { unmount } = renderHook(() => usePolling(callback, 1000));

    vi.advanceTimersByTime(2000);
    expect(callback).toHaveBeenCalledTimes(2);

    unmount(); // cleanup → clearInterval

    vi.advanceTimersByTime(3000); // must not keep calling
    expect(callback).toHaveBeenCalledTimes(2); // still at 2
  });
});
```

---

## 3. Debounce with Fake Timers

```ts
// src/hooks/useDebounce.test.ts
import { renderHook, act } from '@testing-library/react';
import useDebounce from './useDebounce';

describe('useDebounce', () => {

  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(()  => { vi.useRealTimers(); });

  test('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  test('does not update the value before the delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });

    // Advance 499ms — should not have changed yet
    act(() => { vi.advanceTimersByTime(499); });
    expect(result.current).toBe('initial');
  });

  test('updates the value after the delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });

    act(() => { vi.advanceTimersByTime(500); });
    expect(result.current).toBe('updated');
  });

  test('cancels the timer if the value changes before the delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'a' } }
    );

    rerender({ value: 'b' });
    act(() => { vi.advanceTimersByTime(300); }); // halfway through delay

    rerender({ value: 'c' }); // new change → resets the timer
    act(() => { vi.advanceTimersByTime(300); }); // 300ms of the new timer

    // Should not have updated yet (new timer is still running)
    expect(result.current).toBe('a');

    act(() => { vi.advanceTimersByTime(200); }); // complete 500ms for 'c'
    expect(result.current).toBe('c'); // only 'c', never 'b'
  });
});
```

---

## 4. Timers + Promises Together (`advanceTimersByTimeAsync`)

When a function uses `setTimeout` wrapping promises:

```ts
// src/utils/retryWithDelay.ts
export async function retryWithDelay<T>(
  fn: () => Promise<T>,
  retries: number,
  delayMs: number
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;

    // Wait before retrying
    await new Promise(resolve => setTimeout(resolve, delayMs));
    return retryWithDelay(fn, retries - 1, delayMs);
  }
}
```

```ts
// src/utils/retryWithDelay.test.ts
import { retryWithDelay } from './retryWithDelay';

describe('retryWithDelay', () => {

  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(()  => { vi.useRealTimers(); });

  test('retries after the delay and succeeds', async () => {
    const mockFn = vi.fn()
      .mockRejectedValueOnce(new Error('Fail'))
      .mockResolvedValue('ok');

    const promise = retryWithDelay(mockFn, 1, 1000);

    // First call fails, now a timer is waiting 1000ms
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Advance time so the timer fires AND the promise resolves
    await vi.advanceTimersByTimeAsync(1000);

    const result = await promise;
    expect(result).toBe('ok');
    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});
```

---

## 5. Testing a Component with Auto-dismiss

```tsx
// src/components/Toast.tsx
import { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  duration?: number;
  onDismiss?: () => void;
}

function Toast({ message, duration = 3000, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  if (!visible) return null;
  return <div role="alert">{message}</div>;
}

export default Toast;
```

```tsx
// src/components/Toast.test.tsx
import { render, screen, act } from '@testing-library/react';
import Toast from './Toast';

describe('Toast', () => {

  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(()  => { vi.useRealTimers(); });

  test('shows the message immediately', () => {
    render(<Toast message="Saved!" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Saved!');
  });

  test('disappears after the configured time', () => {
    render(<Toast message="Hello" duration={2000} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();

    act(() => { vi.advanceTimersByTime(2000); });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('calls onDismiss when it disappears', () => {
    const onDismiss = vi.fn();
    render(<Toast message="Hello" duration={1000} onDismiss={onDismiss} />);

    act(() => { vi.advanceTimersByTime(1000); });

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  test('does not disappear before the configured time', () => {
    render(<Toast message="Hello" duration={3000} />);

    act(() => { vi.advanceTimersByTime(2999); });

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
```

---

## Quick Timer Reference

```ts
// Setup
beforeEach(() => vi.useFakeTimers());
afterEach(()  => vi.useRealTimers());

// Advance time
vi.advanceTimersByTime(500);            // synchronous
await vi.advanceTimersByTimeAsync(500); // sync + promises

// Run all timers at once
vi.runAllTimers();
await vi.runAllTimersAsync();

// Inside act() for React components
act(() => { vi.advanceTimersByTime(500); });
```
