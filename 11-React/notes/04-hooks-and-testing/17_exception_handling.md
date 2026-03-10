# ⚠️ Exception Handling in Tests

## Why Test Errors?

Error cases are just as important as success cases. A robust system must:

- Throw descriptive errors
- Handle errors in a controlled way
- Not "silence" unexpected exceptions

---

## 1. Verify That a Function Throws — `toThrow`

```ts
// src/utils/divide.ts
export function divide(a: number, b: number): number {
  if (b === 0) throw new Error('Cannot divide by zero');
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Arguments must be numbers');
  }
  return a / b;
}
```

```ts
// src/utils/divide.test.ts
import { divide } from './divide';

describe('divide', () => {

  test('throws Error when dividing by zero', () => {
    // ⚠️ The function must be wrapped in an arrow function
    expect(() => divide(10, 0)).toThrow();
  });

  test('throws the correct message when dividing by zero', () => {
    expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
  });

  test('throws the correct error type', () => {
    expect(() => divide(10, 0)).toThrow(Error);
  });

  test('throws TypeError for invalid arguments', () => {
    expect(() => divide(10, 0)).toThrow(Error); // check type

    // Check type + message
    expect(() => divide(10, 0))
      .toThrow(expect.objectContaining({ message: 'Cannot divide by zero' }));
  });

  test('does NOT throw for a valid operation', () => {
    expect(() => divide(10, 2)).not.toThrow();
    expect(divide(10, 2)).toBe(5);
  });
});
```

> ⚠️ **Common mistake**: calling the function directly inside `expect`:
>
> ```ts
> expect(divide(10, 0)).toThrow(); // ❌ WRONG — error is thrown before expect can catch it
> expect(() => divide(10, 0)).toThrow(); // ✅ CORRECT — the arrow function captures the error
> ```

---

## 2. Errors in Async Functions — `rejects.toThrow`

```ts
// src/services/userService.ts
export async function getUserById(id: number) {
  if (id <= 0) throw new Error('ID must be a positive number');

  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) throw new Error(`User ${id} not found`);

  return res.json();
}
```

```ts
// src/services/userService.test.ts
import { getUserById } from './userService';

describe('getUserById', () => {

  // For async errors use: await expect(...).rejects.toThrow()
  test('throws error if ID is invalid', async () => {
    await expect(getUserById(-1)).rejects.toThrow('ID must be a positive number');
  });

  test('throws error if user does not exist (404)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }));

    await expect(getUserById(999)).rejects.toThrow('User 999 not found');

    vi.unstubAllGlobals();
  });

  test('throws the error with the correct type', async () => {
    await expect(getUserById(0)).rejects.toThrow(Error);
    await expect(getUserById(0)).rejects.toBeInstanceOf(Error);
  });

  test('resolves correctly for a valid ID', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 1, name: 'Ana' }),
    }));

    await expect(getUserById(1)).resolves.toEqual({ id: 1, name: 'Ana' });

    vi.unstubAllGlobals();
  });
});
```

---

## 3. Error Boundaries — Components That Catch Errors

```tsx
// src/components/ErrorBoundary.tsx
import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div role="alert">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
```

```tsx
// src/components/ErrorBoundary.test.tsx
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

// Component that always throws
function BrokenComponent({ shouldThrow }: { shouldThrow: boolean }): JSX.Element {
  if (shouldThrow) throw new Error('Simulated component error');
  return <p>Component working</p>;
}

describe('ErrorBoundary', () => {

  // Suppress React's console.error for cleaner output
  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterAll(() => {
    vi.restoreAllMocks();
  });

  test('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Component working')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('shows the fallback when a child throws an error', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Simulated component error')).toBeInTheDocument();
  });

  test('shows the custom fallback', () => {
    render(
      <ErrorBoundary fallback={<p>Custom error page</p>}>
        <BrokenComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error page')).toBeInTheDocument();
  });
});
```

---

## 4. Testing Errors in Custom Hooks

```ts
// src/hooks/useRequiredContext.ts
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useRequiredContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error(
      'useRequiredContext must be used inside an AuthProvider. ' +
      'Make sure to wrap your component with <AuthProvider>.'
    );
  }
  return ctx;
}
```

```ts
// src/hooks/useRequiredContext.test.ts
import { renderHook } from '@testing-library/react';
import { useRequiredContext } from './useRequiredContext';
import { AuthProvider } from '../context/AuthContext';

test('throws a clear error when used outside the Provider', () => {
  // Suppress React's console.error
  vi.spyOn(console, 'error').mockImplementation(() => {});

  expect(() => {
    renderHook(() => useRequiredContext());
  }).toThrow('useRequiredContext must be used inside an AuthProvider');

  vi.restoreAllMocks();
});

test('works correctly inside the Provider', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  expect(() => {
    renderHook(() => useRequiredContext(), { wrapper });
  }).not.toThrow();
});
```

---

## 5. Chained Validation Errors

```ts
// src/utils/schema.ts
export class ValidationError extends Error {
  constructor(
    public field: string,
    message: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateUser(user: unknown) {
  if (!user || typeof user !== 'object') {
    throw new ValidationError('user', 'User must be an object');
  }

  const u = user as Record<string, unknown>;

  if (!u.name || typeof u.name !== 'string') {
    throw new ValidationError('name', 'Name is required');
  }

  if (!u.email || !String(u.email).includes('@')) {
    throw new ValidationError('email', 'Email is invalid');
  }
}
```

```ts
// src/utils/schema.test.ts
import { validateUser, ValidationError } from './schema';

describe('validateUser', () => {

  test('throws ValidationError if user is not an object', () => {
    expect(() => validateUser(null)).toThrow(ValidationError);
    expect(() => validateUser(null)).toThrow('User must be an object');
  });

  test('the error has the correct field', () => {
    try {
      validateUser({ email: 'ana@mail.com' }); // missing name
      expect(true).toBe(false); // if it reaches here, the test fails
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError);
      expect((err as ValidationError).field).toBe('name');
      expect((err as ValidationError).message).toBe('Name is required');
    }
  });

  test('throws invalid email error', () => {
    expect(() => validateUser({ name: 'Ana', email: 'invalid' }))
      .toThrow('Email is invalid');
  });

  test('does not throw with valid data', () => {
    expect(() =>
      validateUser({ name: 'Ana', email: 'ana@mail.com' })
    ).not.toThrow();
  });
});
```

---

## 6. Error Matchers

```ts
// Verify that any error is thrown
expect(() => fn()).toThrow();

// Verify exact message
expect(() => fn()).toThrow('exact message');

// Verify partial message (substring)
expect(() => fn()).toThrow('partial');

// Verify with regex
expect(() => fn()).toThrow(/^Error:/);

// Verify error type
expect(() => fn()).toThrow(Error);
expect(() => fn()).toThrow(TypeError);
expect(() => fn()).toThrow(ValidationError);

// Verify that it does NOT throw
expect(() => fn()).not.toThrow();

// Async: rejects
await expect(asyncFn()).rejects.toThrow('message');
await expect(asyncFn()).rejects.toBeInstanceOf(Error);

// Async: resolves
await expect(asyncFn()).resolves.toEqual({ data: 'ok' });

// Inspect the error manually (for custom properties)
try {
  fn();
  expect.fail('Should have thrown an error'); // force failure if no throw
} catch (err) {
  expect(err).toBeInstanceOf(ValidationError);
  expect((err as ValidationError).field).toBe('email');
}
```

---

## 7. Silencing Expected Errors in the Console

When React logs errors to the console during tests (ErrorBoundary, PropTypes):

```ts
// Suppress only during a specific test
test('component handles the error correctly', () => {
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  render(
    <ErrorBoundary>
      <BrokenComponent />
    </ErrorBoundary>
  );

  expect(screen.getByRole('alert')).toBeInTheDocument();

  consoleSpy.mockRestore();
});

// Suppress for an entire suite
describe('tests with expected errors', () => {
  beforeAll(() => vi.spyOn(console, 'error').mockImplementation(() => {}));
  afterAll(()  => vi.restoreAllMocks());

  // ... all tests here won't see console.error
});
```
