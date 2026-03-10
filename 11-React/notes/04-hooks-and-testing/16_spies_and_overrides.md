# 🕵️ Spies and Overriding Functions for Testing

## Key Differences

```text
Spy          → Observes an existing function, can keep or replace its behavior
Mock (fake)  → Completely replaces a function with a controlled version
Override     → Temporarily substitute a function/module during the test
```

---

## 1. `vi.spyOn` — Spy on Object Methods

### Spy Without Changing Behavior

```ts
// Observe console.log without replacing it
test('the function logs when it executes', () => {
  const spy = vi.spyOn(console, 'log');

  doSomething(); // calls console.log internally

  expect(spy).toHaveBeenCalled();
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('result:'));

  spy.mockRestore(); // restore the original console.log
});
```

### Spy and Temporarily Replace

```ts
// Replace Math.random for deterministic results
test('generates an ID using Math.random', () => {
  const spy = vi.spyOn(Math, 'random').mockReturnValue(0.123456789);

  const id = generateId(); // uses Math.random internally

  expect(id).toBe('4fzzzz'); // deterministic result
  expect(spy).toHaveBeenCalledTimes(1);

  spy.mockRestore();
});
```

### Spy on Date.now() for Timestamps

```ts
test('records the correct timestamp', () => {
  const FIXED_TIME = 1704067200000; // 2024-01-01 00:00:00 UTC
  vi.spyOn(Date, 'now').mockReturnValue(FIXED_TIME);

  const event = createEvent('login');

  expect(event.timestamp).toBe(FIXED_TIME);

  vi.restoreAllMocks();
});
```

---

## 2. Overriding Functions in the Module Under Test

### Pattern: Partial Module Mock

```ts
// src/services/gifsService.ts
export async function getGifs(query: string) { /* ... */ }
export function buildUrl(query: string) { /* ... */ }
```

```ts
// src/services/gifsService.test.ts

// Partial mock: replaces getGifs, keeps the real buildUrl
vi.mock('./gifsService', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./gifsService')>();
  return {
    ...actual,
    getGifs: vi.fn(), // only this one becomes a mock
  };
});

import { getGifs, buildUrl } from './gifsService';

test('buildUrl builds the URL correctly', () => {
  // buildUrl is the real function
  const url = buildUrl('cats');
  expect(url).toContain('cats');
});

test('getGifs calls the API', async () => {
  // getGifs is the mock
  vi.mocked(getGifs).mockResolvedValue([{ id: '1', title: 'Cat', url: '...' }]);
  const result = await getGifs('cats');
  expect(result).toHaveLength(1);
});
```

---

## 3. Overriding the Global fetch

```ts
// Override the browser's global fetch
describe('fetchData', () => {

  const mockFetch = vi.fn();

  beforeAll(() => {
    vi.stubGlobal('fetch', mockFetch); // replaces window.fetch
  });

  afterAll(() => {
    vi.unstubAllGlobals(); // restore
  });

  beforeEach(() => {
    mockFetch.mockClear();
  });

  test('makes GET to the correct URL', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: 'test' }),
    });

    await fetchData('/api/users');

    expect(mockFetch).toHaveBeenCalledWith('/api/users');
  });

  test('throws error if the response is not ok', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    await expect(fetchData('/api/missing')).rejects.toThrow('Error 404');
  });
});
```

---

## 4. Overriding `localStorage`

```ts
// Option 1: use jsdom's real localStorage (cleared between tests)
beforeEach(() => { localStorage.clear(); });

test('saves to localStorage', () => {
  saveToStorage('theme', 'dark');
  expect(localStorage.getItem('theme')).toBe('"dark"');
});

// Option 2: full localStorage mock
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem:    (key: string)              => store[key] ?? null,
    setItem:    (key: string, val: string) => { store[key] = val; },
    removeItem: (key: string)              => { delete store[key]; },
    clear:      ()                         => { store = {}; },
    get length() { return Object.keys(store).length; },
    key:        (i: number)                => Object.keys(store)[i] ?? null,
  };
})();

beforeAll(() => {
  vi.stubGlobal('localStorage', localStorageMock);
});
```

---

## 5. Overriding Complete Third-Party Modules

```ts
// Override react-router-dom for component tests
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams:   () => ({ id: '123' }),
    useLocation: () => ({ pathname: '/products/123', search: '', hash: '', state: null }),
  };
});

test('component navigates on click', async () => {
  const { useNavigate } = await import('react-router-dom');
  const navigate = vi.mocked(useNavigate)();

  render(<ProductDetail />);
  await userEvent.click(screen.getByRole('button', { name: /back/i }));

  expect(navigate).toHaveBeenCalledWith(-1);
});
```

---

## 6. Spy and Restore with `beforeEach/afterEach`

```ts
describe('Logger service', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Create the spy before each test
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore after each test
    consoleSpy.mockRestore();
  });

  test('logs the error to console', () => {
    logError('something went wrong');
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('something went wrong')
    );
  });

  test('does not log if the level is info', () => {
    logInfo('informational message');
    expect(consoleSpy).not.toHaveBeenCalled();
  });
});
```

---

## 7. `vi.fn()` with Custom Implementation

```ts
// Implementation that varies based on arguments
const mockGetUser = vi.fn().mockImplementation((id: number) => {
  if (id === 1) return Promise.resolve({ id: 1, name: 'Ana' });
  if (id === 2) return Promise.resolve({ id: 2, name: 'Carlos' });
  return Promise.reject(new Error(`User ${id} not found`));
});

test('returns Ana for id 1', async () => {
  const user = await mockGetUser(1);
  expect(user.name).toBe('Ana');
});

test('rejects for unknown id', async () => {
  await expect(mockGetUser(99)).rejects.toThrow('User 99 not found');
});
```

---

## 8. Overriding Environment Variables

```ts
// Override during a specific test
test('uses the staging URL in the test environment', () => {
  vi.stubEnv('VITE_API_URL', 'https://staging.api.com');

  const url = getApiUrl();
  expect(url).toBe('https://staging.api.com');

  vi.unstubAllEnvs(); // restore
});
```

---

## 9. Inspecting Calls with `.mock.calls`

```ts
const mockFn = vi.fn();

// Multiple calls with different arguments
mockFn('arg1', 'arg2');
mockFn('arg3');
mockFn({ key: 'value' });

// Access each call individually
console.log(mockFn.mock.calls);
// [['arg1', 'arg2'], ['arg3'], [{ key: 'value' }]]

// First call, first argument
expect(mockFn.mock.calls[0][0]).toBe('arg1');

// Second call, first argument
expect(mockFn.mock.calls[1][0]).toBe('arg3');

// Results of each call
mockFn.mock.results.forEach(result => {
  console.log(result.type);  // 'return' | 'throw'
  console.log(result.value); // the returned value
});
```

---

## Reference: `vi.fn()` / `vi.spyOn()` Methods

```ts
const mock = vi.fn();

// Configure return value
mock.mockReturnValue(value)           // always returns value
mock.mockReturnValueOnce(value)       // only on the next call
mock.mockResolvedValue(value)         // Promise.resolve(value)
mock.mockRejectedValue(error)         // Promise.reject(error)
mock.mockImplementation(fn)           // custom function
mock.mockImplementationOnce(fn)       // only on the next call

// Clear / reset
mock.mockClear()    // clears .mock.calls and .mock.results
mock.mockReset()    // clears everything + removes the implementation
mock.mockRestore()  // restores the original (spyOn only)

// Properties
mock.mock.calls           // [[args1], [args2], ...]
mock.mock.results         // [{ type, value }, ...]
mock.mock.lastCall        // args of the last call
mock.mock.instances       // instances created with new
```
