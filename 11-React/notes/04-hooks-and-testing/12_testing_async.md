# ⏳ Testing Asynchronous Tasks

## The Problem

Synchronous tests finish before promises resolve:

```ts
test('loads data', () => {
  const { result } = renderHook(() => useFetchGifs('cats'));
  // ❌ The promise hasn't resolved yet — isLoading is still true
  expect(result.current.isLoading).toBe(false); // FAILS
});

// ✅ We need to wait for it to resolve
test('loads data', async () => {
  const { result } = renderHook(() => useFetchGifs('cats'));
  await waitFor(() => expect(result.current.isLoading).toBe(false));
  expect(result.current.gifs).toHaveLength(2); // now it works
});
```

---

## Tools for Async Testing

| Tool | When to Use |
| :--- | :--- |
| `waitFor` | Wait for a condition to be true |
| `findBy*` (Testing Library) | Wait for a DOM element to appear |
| `async/await` | Functions that return promises |
| `mockResolvedValue` | Mock a successful promise |
| `mockRejectedValue` | Mock a rejected promise |

---

## 1. `async/await` with `mockResolvedValue`

```ts
// src/services/gifsService.test.ts
import { getGifs } from './gifsService';
import axios from 'axios';

vi.mock('axios');

describe('getGifs', () => {

  test('returns correctly mapped gifs', async () => {
    // Arrange: mock the API response
    const apiResponse = {
      data: {
        data: [
          {
            id: 'abc123',
            title: 'Funny Cat',
            images: { downsized_medium: { url: 'https://giphy.com/1.gif' } },
          },
          {
            id: 'def456',
            title: 'Happy Dog',
            images: { downsized_medium: { url: 'https://giphy.com/2.gif' } },
          },
        ],
      },
    };

    vi.mocked(axios.get).mockResolvedValue(apiResponse);

    // Act
    const result = await getGifs('cats');

    // Assert
    expect(result).toEqual([
      { id: 'abc123', title: 'Funny Cat', url: 'https://giphy.com/1.gif' },
      { id: 'def456', title: 'Happy Dog', url: 'https://giphy.com/2.gif' },
    ]);
  });

  test('calls axios with the correct parameters', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: { data: [] } });

    await getGifs('one piece');

    expect(axios.get).toHaveBeenCalledWith(
      'https://api.giphy.com/v1/gifs/search',
      expect.objectContaining({
        params: expect.objectContaining({ q: 'one piece', limit: 10 }),
      })
    );
  });

  test('throws error if the request fails', async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error('Network Error'));

    await expect(getGifs('cats')).rejects.toThrow('Network Error');
  });
});
```

---

## 2. `findBy*` in Components — Waiting for DOM Elements

```tsx
// src/components/GifGrid.tsx
import { useFetchGifs } from '../hooks/useFetchGifs';

function GifGrid({ query }: { query: string }) {
  const { gifs, isLoading, error } = useFetchGifs(query);

  if (isLoading) return <p role="status">Loading...</p>;
  if (error)     return <p role="alert">Error: {error}</p>;
  if (gifs.length === 0) return <p>No GIFs found</p>;

  return (
    <ul aria-label="GIF list">
      {gifs.map(gif => (
        <li key={gif.id}>
          <img src={gif.url} alt={gif.title} />
          <p>{gif.title}</p>
        </li>
      ))}
    </ul>
  );
}
```

```tsx
// src/components/GifGrid.test.tsx
import { render, screen } from '@testing-library/react';
import GifGrid from './GifGrid';
import { getGifs } from '../services/gifsService';

vi.mock('../services/gifsService');

const MOCK_GIFS = [
  { id: '1', title: 'Cat GIF', url: 'https://giphy.com/1.gif' },
  { id: '2', title: 'Dog GIF', url: 'https://giphy.com/2.gif' },
];

describe('GifGrid', () => {

  test('shows "Loading..." while fetching data', () => {
    // The promise never resolves in this test → indefinite loading state
    vi.mocked(getGifs).mockReturnValue(new Promise(() => {}));

    render(<GifGrid query="cats" />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading...');
  });

  test('shows GIFs after loading', async () => {
    vi.mocked(getGifs).mockResolvedValue(MOCK_GIFS);

    render(<GifGrid query="cats" />);

    // findBy* is async — waits until the element appears
    const list = await screen.findByRole('list', { name: /gif list/i });
    expect(list).toBeInTheDocument();

    // All titles must appear
    expect(await screen.findByText('Cat GIF')).toBeInTheDocument();
    expect(screen.getByText('Dog GIF')).toBeInTheDocument();

    // The loader must have disappeared
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  test('shows error when the request fails', async () => {
    vi.mocked(getGifs).mockRejectedValue(new Error('Invalid API key'));

    render(<GifGrid query="cats" />);

    const errorEl = await screen.findByRole('alert');
    expect(errorEl).toHaveTextContent('Error: Invalid API key');
  });

  test('shows a message when there are no results', async () => {
    vi.mocked(getGifs).mockResolvedValue([]); // empty array

    render(<GifGrid query="xyzabc123" />);

    expect(await screen.findByText('No GIFs found')).toBeInTheDocument();
  });
});
```

---

## 3. Multiple Async Calls with `mockResolvedValueOnce`

```ts
test('handles sequential queries', async () => {
  vi.mocked(getGifs)
    .mockResolvedValueOnce([{ id: '1', title: 'Cat', url: '...' }])
    .mockResolvedValueOnce([{ id: '2', title: 'Dog', url: '...' }]);

  const { result, rerender } = renderHook(
    ({ q }) => useFetchGifs(q),
    { initialProps: { q: 'cats' } }
  );

  await waitFor(() => expect(result.current.isLoading).toBe(false));
  expect(result.current.gifs[0].title).toBe('Cat');

  rerender({ q: 'dogs' });

  await waitFor(() => expect(result.current.gifs[0].title).toBe('Dog'));
});
```

---

## 4. Testing Async Functions Directly

```ts
// src/utils/fetchWithRetry.ts
export async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries = 3
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    return fetchWithRetry(fn, retries - 1);
  }
}
```

```ts
// src/utils/fetchWithRetry.test.ts
import { fetchWithRetry } from './fetchWithRetry';

describe('fetchWithRetry', () => {

  test('returns the result if successful on the first attempt', async () => {
    const mockFn = vi.fn().mockResolvedValue('result');

    const result = await fetchWithRetry(mockFn);

    expect(result).toBe('result');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('retries on failure and eventually succeeds', async () => {
    const mockFn = vi.fn()
      .mockRejectedValueOnce(new Error('Fail 1'))
      .mockRejectedValueOnce(new Error('Fail 2'))
      .mockResolvedValue('success on attempt 3');

    const result = await fetchWithRetry(mockFn, 3);

    expect(result).toBe('success on attempt 3');
    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  test('throws the error when retries are exhausted', async () => {
    const mockFn = vi.fn().mockRejectedValue(new Error('Always fails'));

    await expect(fetchWithRetry(mockFn, 2)).rejects.toThrow('Always fails');
    expect(mockFn).toHaveBeenCalledTimes(3); // 1 original + 2 retries
  });
});
```

---

## 5. `waitFor` vs `findBy` — When to Use Each

```ts
// findBy → for DOM elements that appear asynchronously
const element = await screen.findByText('Loaded!');
// equivalent to:
await waitFor(() => screen.getByText('Loaded!'));

// waitFor → for any async assertion (not just DOM)
await waitFor(() => {
  expect(mockFn).toHaveBeenCalledTimes(1);
  expect(result.current.isLoading).toBe(false);
});

// Rule:
// Looking for a DOM element → use findBy
// Verifying any other condition → use waitFor
```

---

## 6. Testing Loading States with `act` + `flushPromises`

```ts
// Utility to resolve all pending promises
const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

test('full cycle: loading → data', async () => {
  vi.mocked(getGifs).mockResolvedValue(MOCK_GIFS);

  const { result } = renderHook(() => useFetchGifs('cats'));

  // Initial state: loading
  expect(result.current.isLoading).toBe(true);

  // Wait for all promises to resolve
  await act(async () => {
    await flushPromises();
  });

  // Final state: data loaded
  expect(result.current.isLoading).toBe(false);
  expect(result.current.gifs).toHaveLength(2);
});
```
