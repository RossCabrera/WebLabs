# 🎯 Expecting Specific Arguments in Functions

## `toHaveBeenCalledWith` — The Basic

Verifies that a mock function was called with exact arguments.

```ts
const mockFn = vi.fn();
mockFn('hello', 42, true);

expect(mockFn).toHaveBeenCalledWith('hello', 42, true);   // ✅
expect(mockFn).toHaveBeenCalledWith('hello');              // ❌ (missing args)
```

---

## `expect.any()` — Accept any value of a type

When the exact value doesn't matter, only the type:

```ts
const mockCallback = vi.fn();
someFunction(mockCallback);

expect(mockCallback).toHaveBeenCalledWith(
  expect.any(String),   // accepts any string
  expect.any(Number),   // accepts any number
  expect.any(Function), // accepts any function
  expect.any(Object),   // accepts any object
  expect.any(Array),    // accepts any array
);
```

### Real example: verifying an API call

```ts
const mockApi = vi.fn().mockResolvedValue({ success: true });

await createUser({ name: 'Ana', email: 'ana@example.com' });

expect(mockApi).toHaveBeenCalledWith(
  '/api/users',
  expect.any(Object),        // the request body
);
```

---

## `expect.objectContaining()` — Object with specific properties

Verifies that the argument is an object that **contains at least** those properties (it may have more).

```ts
const mockSave = vi.fn();
mockSave({ id: 1, name: 'Ana', email: 'ana@mail.com', createdAt: '2024-01-01' });

// ✅ Only verify the properties we care about
expect(mockSave).toHaveBeenCalledWith(
  expect.objectContaining({
    name: 'Ana',
    email: 'ana@mail.com',
    // No need to specify id or createdAt
  })
);
```

### Nested

```ts
expect(mockFn).toHaveBeenCalledWith(
  expect.objectContaining({
    user: expect.objectContaining({ name: 'Ana' }),
    metadata: expect.objectContaining({ version: expect.any(Number) }),
  })
);
```

---

## `expect.arrayContaining()` — Array that contains certain elements

```ts
const mockProcess = vi.fn();
mockProcess(['apple', 'pear', 'grape', 'lemon']);

// ✅ The array contains at least these elements (may have more)
expect(mockProcess).toHaveBeenCalledWith(
  expect.arrayContaining(['apple', 'pear'])
);
```

---

## `expect.stringContaining()` and `expect.stringMatching()`

```ts
const mockLog = vi.fn();
mockLog('Error: Could not connect to server on 2024-01-15');

// Contains the substring
expect(mockLog).toHaveBeenCalledWith(
  expect.stringContaining('Could not connect')
);

// Matches the regex
expect(mockLog).toHaveBeenCalledWith(
  expect.stringMatching(/^Error:/)
);
```

---

## `toHaveBeenNthCalledWith` — The Nth call

Verifies the arguments of a specific call (by order number).

```ts
const mockFn = vi.fn();
mockFn('first');
mockFn('second');
mockFn('third');

expect(mockFn).toHaveBeenNthCalledWith(1, 'first');
expect(mockFn).toHaveBeenNthCalledWith(2, 'second');
expect(mockFn).toHaveBeenLastCalledWith('third');
```

---

## `toHaveBeenCalledTimes` — Exact number of calls

```ts
const mockFn = vi.fn();
mockFn();
mockFn();

expect(mockFn).toHaveBeenCalledTimes(2);
expect(mockFn).not.toHaveBeenCalledTimes(1);
```

---

## Manually Inspecting Calls with `.mock`

If you need more detailed inspection, access the `.mock` property:

```ts
const mockFn = vi.fn();
mockFn('first', 'call');
mockFn('second');

// .mock.calls → array of arrays with the arguments of each call
console.log(mockFn.mock.calls);
// [['first', 'call'], ['second']]

// First call, first argument
expect(mockFn.mock.calls[0][0]).toBe('first');

// .mock.results → results of each call
console.log(mockFn.mock.results);
// [{ type: 'return', value: undefined }, ...]

// .mock.instances → instances created with new
// .mock.lastCall → arguments of the last call
expect(mockFn.mock.lastCall).toEqual(['second']);
```

---

## Full Example: Form that Calls a Service

```ts
// src/services/authService.ts
export async function login(email: string, password: string) {
  const res = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: { 'Content-Type': 'application/json' },
  });
  return res.json();
}
```

```ts
// src/services/authService.test.ts
import { login } from './authService';

// Global mock of fetch
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('login', () => {
  beforeEach(() => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ token: 'abc123' }),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('calls fetch with the correct credentials', async () => {
    // Act
    await login('ana@mail.com', 'password123');

    // Assert: verify URL
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/login',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    );
  });

  test('body includes email and password', async () => {
    await login('ana@mail.com', 'password123');

    const [, options] = mockFetch.mock.calls[0];
    const body = JSON.parse(options.body);

    expect(body).toEqual({
      email: 'ana@mail.com',
      password: 'password123',
    });
  });

  test('returns the token from the server', async () => {
    const result = await login('ana@mail.com', 'password123');
    expect(result).toEqual({ token: 'abc123' });
  });
});
```

---

## Summary of Argument Matchers

| Matcher | Use |
| :--------- | :----- |
| `toHaveBeenCalledWith(a, b)` | Exact arguments |
| `toHaveBeenCalledTimes(n)` | Number of calls |
| `toHaveBeenLastCalledWith(a)` | Arguments of the last call |
| `toHaveBeenNthCalledWith(n, a)` | Arguments of call N |
| `expect.any(Type)` | Any value of that type |
| `expect.objectContaining({})` | Object that includes those props |
| `expect.arrayContaining([])` | Array that includes those items |
| `expect.stringContaining('')` | String that includes that text |
| `expect.stringMatching(/regex/)` | String that matches the regex |
| `.mock.calls` | Direct access to all args |
