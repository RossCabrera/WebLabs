# 🕵️ Spies, Mocks, and Module Mocking

## Key Concepts

```text
Spy    → Observes a real function without replacing it (records calls)
Mock   → Replaces a function/module with a controlled fake version
Stub   → Variant of a mock that returns predefined values
```

---

## `vi` — Vitest's Object for Mocking

```ts
import { vi } from 'vitest';
// With globals: true in config, vi is globally available without importing
```

---

## Spies — `vi.spyOn`

A spy **observes** an existing function and records how it was called, without changing its default behavior.

```ts
// src/utils/logger.ts
export const logger = {
  log: (msg: string) => console.log(`[LOG]: ${msg}`),
  error: (msg: string) => console.error(`[ERROR]: ${msg}`),
};
```

```ts
// src/utils/logger.test.ts
import { logger } from './logger';

test('logger.log should call console.log', () => {
  // Arrange: create a spy on console.log
  const spy = vi.spyOn(console, 'log');

  // Act
  logger.log('Hello world');

  // Assert: verify it was called
  expect(spy).toHaveBeenCalled();
  expect(spy).toHaveBeenCalledWith('[LOG]: Hello world');
  expect(spy).toHaveBeenCalledTimes(1);

  // Clean up the spy (important!)
  spy.mockRestore();
});
```

### Spying without modifying behavior

```ts
test('spy that also calls the original function', () => {
  const obj = { multiply: (a: number, b: number) => a * b };
  const spy = vi.spyOn(obj, 'multiply');

  const result = obj.multiply(3, 4);  // still calls the real function

  expect(result).toBe(12);            // real result
  expect(spy).toHaveBeenCalledWith(3, 4);
});
```

### Spy that temporarily replaces

```ts
test('spy that returns a fake value', () => {
  const spy = vi.spyOn(Math, 'random').mockReturnValue(0.5);

  const result = Math.random();

  expect(result).toBe(0.5);
  spy.mockRestore();  // restores original Math.random
});
```

---

## Mocks — `vi.fn()`

Creates a completely fake (mock) function that you can control.

```ts
// Create a basic mock
const mockFn = vi.fn();

// Use it
mockFn('hello');
mockFn('world');

// Verify
expect(mockFn).toHaveBeenCalledTimes(2);
expect(mockFn).toHaveBeenCalledWith('hello');
expect(mockFn).toHaveBeenLastCalledWith('world');
```

### Configuring return values

```ts
// Always return the same value
const mockGetUser = vi.fn().mockReturnValue({ id: 1, name: 'Ana' });
expect(mockGetUser()).toEqual({ id: 1, name: 'Ana' });

// Return different values on each call
const mockRand = vi.fn()
  .mockReturnValueOnce(10)
  .mockReturnValueOnce(20)
  .mockReturnValue(0);   // default for the rest

expect(mockRand()).toBe(10);
expect(mockRand()).toBe(20);
expect(mockRand()).toBe(0);
expect(mockRand()).toBe(0);

// Return a resolved Promise
const mockFetch = vi.fn().mockResolvedValue({ data: 'ok' });
const result = await mockFetch();
expect(result).toEqual({ data: 'ok' });

// Return a rejected Promise
const mockFetchFail = vi.fn().mockRejectedValue(new Error('Network error'));
await expect(mockFetchFail()).rejects.toThrow('Network error');

// Use a custom implementation
const mockDouble = vi.fn().mockImplementation((n: number) => n * 2);
expect(mockDouble(5)).toBe(10);
```

### Real example: service with dependency

```ts
// src/services/userService.ts
export interface User { id: number; name: string; email: string; }

export async function fetchUser(id: number): Promise<User> {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
}

export async function getUserDisplayName(id: number): Promise<string> {
  const user = await fetchUser(id);
  return `${user.name} (${user.email})`;
}
```

```ts
// src/services/userService.test.ts
import { getUserDisplayName, fetchUser } from './userService';
import { vi } from 'vitest';

// Mock fetchUser to avoid real HTTP calls
vi.mock('./userService', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./userService')>();
  return {
    ...actual,
    fetchUser: vi.fn(),
  };
});

test('getUserDisplayName returns formatted name and email', async () => {
  // Arrange
  vi.mocked(fetchUser).mockResolvedValue({
    id: 1,
    name: 'Ana Garcia',
    email: 'ana@example.com',
  });

  // Act
  const result = await getUserDisplayName(1);

  // Assert
  expect(result).toBe('Ana Garcia (ana@example.com)');
  expect(fetchUser).toHaveBeenCalledWith(1);
});
```

---

## Mocking Entire Modules — `vi.mock()`

Replaces an entire module with mock versions.

```ts
// vi.mock is automatically "hoisted" to the top of the file
vi.mock('./path/to/module');
```

### Mocking an external module (e.g., axios)

```ts
// src/api/posts.ts
import axios from 'axios';

export async function getPosts() {
  const { data } = await axios.get('/api/posts');
  return data;
}
```

```ts
// src/api/posts.test.ts
import { getPosts } from './posts';
import axios from 'axios';

vi.mock('axios');  // replaces all of axios with mocks

test('getPosts returns posts from the server', async () => {
  // Arrange: configure what axios.get returns
  vi.mocked(axios.get).mockResolvedValue({
    data: [
      { id: 1, title: 'Post 1' },
      { id: 2, title: 'Post 2' },
    ],
  });

  // Act
  const posts = await getPosts();

  // Assert
  expect(posts).toHaveLength(2);
  expect(axios.get).toHaveBeenCalledWith('/api/posts');
});
```

### Partial module mock

```ts
// Only mock some functions, keep the rest real
vi.mock('./utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./utils')>();
  return {
    ...actual,                          // keeps real functions
    fetchData: vi.fn(),                 // only this one is mocked
  };
});
```

### Mock module with factory

```ts
vi.mock('./authService', () => ({
  login: vi.fn().mockResolvedValue({ token: 'fake-token' }),
  logout: vi.fn(),
  getUser: vi.fn().mockReturnValue({ id: 1, name: 'Mock User' }),
}));
```

---

## Clearing Mocks Between Tests

```ts
describe('Suite with mocks', () => {
  beforeEach(() => {
    vi.clearAllMocks();    // clears calls/instances but keeps implementation
    // vi.resetAllMocks(); // clears calls AND implementation (back to vi.fn())
    // vi.restoreAllMocks(); // restores spies to original (spyOn only)
  });
});
```

| Method | Clears calls | Clears implementation | Restores original |
| :-------- | :---: | :---: | :---: |
| `clearAllMocks()` | ✅ | ❌ | ❌ |
| `resetAllMocks()` | ✅ | ✅ | ❌ |
| `restoreAllMocks()` | ✅ | ✅ | ✅ (spyOn only) |

---

## Mocking Environment Variables

```ts
test('uses the production URL in prod', () => {
  // Arrange
  vi.stubEnv('VITE_API_URL', 'https://api.production.com');

  // Act
  const url = getApiUrl();

  // Assert
  expect(url).toBe('https://api.production.com');

  vi.unstubAllEnvs();  // restore
});
```

---

## Mocking Timers

```ts
test('calls the callback after 1 second', () => {
  // Arrange
  vi.useFakeTimers();
  const callback = vi.fn();

  // Act
  setTimeout(callback, 1000);
  vi.advanceTimersByTime(1000);  // advance simulated time

  // Assert
  expect(callback).toHaveBeenCalledTimes(1);

  vi.useRealTimers();  // restore
});
```
