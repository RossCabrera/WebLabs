# 🔬 Testing Complete Custom Hooks

## The Most Common Custom Hook: Data + Loading State

We'll use a GIF search hook as our example (similar to a typical course project):

```ts
// src/hooks/useFetchGifs.ts
import { useState, useEffect } from 'react';
import { getGifs } from '../services/gifsService';

export interface Gif {
  id: string;
  title: string;
  url: string;
}

interface UseFetchGifsResult {
  gifs: Gif[];
  isLoading: boolean;
  error: string | null;
}

function useFetchGifs(query: string): UseFetchGifsResult {
  const [gifs, setGifs]         = useState<Gif[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setGifs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    getGifs(query)
      .then(data => {
        setGifs(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [query]);

  return { gifs, isLoading, error };
}

export default useFetchGifs;
```

```ts
// src/services/gifsService.ts
import axios from 'axios';
import type { Gif } from '../hooks/useFetchGifs';

export async function getGifs(query: string): Promise<Gif[]> {
  const { data } = await axios.get('https://api.giphy.com/v1/gifs/search', {
    params: {
      api_key: import.meta.env.VITE_GIPHY_API_KEY,
      q: query,
      limit: 10,
    },
  });

  return data.data.map((item: any) => ({
    id:    item.id,
    title: item.title,
    url:   item.images.downsized_medium.url,
  }));
}
```

---

## Strategy: Mock the Service

We don't want to make real HTTP requests in tests. We mock `getGifs`:

```ts
// src/hooks/useFetchGifs.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import useFetchGifs from './useFetchGifs';
import { getGifs } from '../services/gifsService';

// Mock the entire module
vi.mock('../services/gifsService');

const MOCK_GIFS = [
  { id: '1', title: 'Funny Cat', url: 'https://media.giphy.com/1.gif' },
  { id: '2', title: 'Happy Dog', url: 'https://media.giphy.com/2.gif' },
];

describe('useFetchGifs', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── Initial state ─────────────────────────────────────────────

  test('starts with isLoading true and empty gifs', () => {
    vi.mocked(getGifs).mockResolvedValue(MOCK_GIFS);

    const { result } = renderHook(() => useFetchGifs('cats'));

    // On the first render, before the promise resolves:
    expect(result.current.isLoading).toBe(true);
    expect(result.current.gifs).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  // ─── Successful load ───────────────────────────────────────────

  test('returns gifs after a successful load', async () => {
    vi.mocked(getGifs).mockResolvedValue(MOCK_GIFS);

    const { result } = renderHook(() => useFetchGifs('cats'));

    // waitFor keeps retrying until the condition is true
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.gifs).toEqual(MOCK_GIFS);
    expect(result.current.gifs).toHaveLength(2);
    expect(result.current.error).toBeNull();
  });

  test('calls getGifs with the correct query', async () => {
    vi.mocked(getGifs).mockResolvedValue(MOCK_GIFS);

    renderHook(() => useFetchGifs('one piece'));

    await waitFor(() => {
      expect(getGifs).toHaveBeenCalledWith('one piece');
    });

    expect(getGifs).toHaveBeenCalledTimes(1);
  });

  // ─── Error ─────────────────────────────────────────────────────

  test('sets error when the request fails', async () => {
    vi.mocked(getGifs).mockRejectedValue(new Error('API unavailable'));

    const { result } = renderHook(() => useFetchGifs('cats'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('API unavailable');
    expect(result.current.gifs).toEqual([]);
  });

  // ─── Empty query ───────────────────────────────────────────────

  test('does not call getGifs if the query is empty', async () => {
    const { result } = renderHook(() => useFetchGifs(''));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(getGifs).not.toHaveBeenCalled();
    expect(result.current.gifs).toEqual([]);
  });

  // ─── Query change ──────────────────────────────────────────────

  test('reloads when the query changes', async () => {
    vi.mocked(getGifs).mockResolvedValue(MOCK_GIFS);

    const { result, rerender } = renderHook(
      ({ query }: { query: string }) => useFetchGifs(query),
      { initialProps: { query: 'cats' } }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(getGifs).toHaveBeenCalledWith('cats');

    // Change the query
    rerender({ query: 'dogs' });

    await waitFor(() => expect(getGifs).toHaveBeenCalledWith('dogs'));
    expect(getGifs).toHaveBeenCalledTimes(2);
  });
});
```

---

## Hook with localStorage

```ts
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  const remove = () => {
    localStorage.removeItem(key);
    setValue(initialValue);
  };

  return [value, setValue, remove] as const;
}

export default useLocalStorage;
```

```ts
// src/hooks/useLocalStorage.test.ts
import { renderHook, act } from '@testing-library/react';
import useLocalStorage from './useLocalStorage';

describe('useLocalStorage', () => {

  beforeEach(() => {
    localStorage.clear(); // clear between tests
  });

  test('returns the initial value if the key does not exist', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  test('reads an existing value from localStorage', () => {
    localStorage.setItem('theme', JSON.stringify('dark'));

    const { result } = renderHook(() => useLocalStorage('theme', 'light'));
    expect(result.current[0]).toBe('dark');
  });

  test('saves the new value to localStorage when updated', async () => {
    const { result } = renderHook(() => useLocalStorage('count', 0));

    act(() => {
      result.current[1](42);
    });

    expect(result.current[0]).toBe(42);
    // Verify it was saved to localStorage
    expect(JSON.parse(localStorage.getItem('count')!)).toBe(42);
  });

  test('remove deletes the value and restores the initial one', () => {
    const { result } = renderHook(() => useLocalStorage('name', 'Ana'));

    act(() => { result.current[1]('Carlos'); });
    expect(result.current[0]).toBe('Carlos');

    act(() => { result.current[2](); }); // remove
    expect(result.current[0]).toBe('Ana');
    expect(localStorage.getItem('name')).toBeNull();
  });

  test('handles invalid JSON in localStorage gracefully', () => {
    localStorage.setItem('bad-json', 'this is not JSON');

    const { result } = renderHook(() => useLocalStorage('bad-json', 'fallback'));
    expect(result.current[0]).toBe('fallback'); // uses the initialValue
  });
});
```

---

## Form Hook with Validation

```ts
// src/hooks/useForm.test.ts
import { renderHook, act } from '@testing-library/react';
import useForm from './useForm';

describe('useForm', () => {
  const initialValues = { email: '', password: '' };
  const validations = {
    email:    (v: string) => (!v.includes('@') ? 'Invalid email' : null),
    password: (v: string) => (v.length < 8 ? 'Minimum 8 characters' : null),
  };

  test('initializes with the provided values', () => {
    const { result } = renderHook(() => useForm(initialValues));
    expect(result.current.values).toEqual({ email: '', password: '' });
    expect(result.current.errors).toEqual({});
  });

  test('isValid is false when there are validation errors', () => {
    const { result } = renderHook(() => useForm(initialValues, validations));

    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'invalid' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.errors.email).toBe('Invalid email');
    expect(result.current.isValid).toBe(false);
  });

  test('isValid is true when all fields are valid', () => {
    const { result } = renderHook(() => useForm(initialValues, validations));

    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'ana@mail.com' },
      } as React.ChangeEvent<HTMLInputElement>);
      result.current.handleChange({
        target: { name: 'password', value: 'password123' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.isValid).toBe(true);
    expect(result.current.errors).toEqual({ email: undefined, password: undefined });
  });

  test('reset restores initial values', () => {
    const { result } = renderHook(() => useForm(initialValues));

    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'ana@mail.com' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => { result.current.reset(); });

    expect(result.current.values).toEqual({ email: '', password: '' });
  });
});
```

---

## `waitFor` — Waiting for Async Conditions

```ts
import { renderHook, waitFor } from '@testing-library/react';

test('waits for loading to complete', async () => {
  const { result } = renderHook(() => useFetchGifs('cats'));

  // Waits until the condition is true (retries every 50ms for up to 1000ms)
  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });

  // waitFor options
  await waitFor(
    () => expect(result.current.gifs.length).toBeGreaterThan(0),
    {
      timeout: 3000,   // maximum wait time (ms)
      interval: 100,   // how often it retries
    }
  );
});
```
