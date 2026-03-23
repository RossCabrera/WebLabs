# 03 – Advanced Testing: Context, Router, TanStack & Custom Hooks

> **Goal:** Test real-world React apps — with routing, global state, data fetching, and complex interactions.

---

## Table of Contents

1. [Test Setup & Utilities](#test-setup--utilities)
2. [Testing with Context API](#testing-with-context-api)
3. [Router Testing](#router-testing)
4. [Query Parameter Testing](#query-parameter-testing)
5. [Redirection & Component Testing](#redirection--component-testing)
6. [Mocks & Spies](#mocks--spies)
7. [Testing with TanStack Query](#testing-with-tanstack-query)
8. [Custom Hook Testing](#custom-hook-testing)
9. [Best Practices](#best-practices)

---

## Test Setup & Utilities

### Dependencies

```bash
npm install -D vitest @vitest/ui jsdom
npm install -D @testing-library/react @testing-library/user-event @testing-library/jest-dom
npm install -D msw          # Mock Service Worker — intercept API calls
```

### vitest.config.ts

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals:     true,
    setupFiles:  ['./src/test/setup.ts'],
  },
});
```

### setup.ts

```ts
// src/test/setup.ts
import '@testing-library/jest-dom';
import { server } from './mocks/server';

// Start MSW before all tests
beforeAll(()  => server.listen());
afterEach(()  => server.resetHandlers());  // reset overrides between tests
afterAll(()   => server.close());
```

### Custom Render Utility

The most important testing pattern: a `renderWithProviders` helper that wraps components with everything they need.

```tsx
// src/test/utils.tsx
import { render, type RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';

interface RenderConfig extends RenderOptions {
  routerProps?: MemoryRouterProps;
  initialUser?: User | null;
}

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry:   false,  // don't retry in tests — fail fast
        gcTime:  0,      // don't cache between tests
      },
    },
  });
}

export function renderWithProviders(
  ui: React.ReactElement,
  { routerProps, ...renderOptions }: RenderConfig = {}
) {
  const queryClient = createTestQueryClient();

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter {...routerProps}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  };
}

// Re-export everything from testing-library so tests have one import
export * from '@testing-library/react';
export { userEvent } from '@testing-library/user-event';
```

---

## Testing with Context API

### Test the Provider & Consumer Together

```tsx
// contexts/AuthContext.test.tsx
import { renderWithProviders, screen, fireEvent } from '@/test/utils';
import { useAuth } from '@/contexts/AuthContext';

// A minimal consumer to expose the context values
const AuthDisplay: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  return (
    <div>
      <p data-testid="status">{isAuthenticated ? 'logged-in' : 'logged-out'}</p>
      <p data-testid="name">{user?.name ?? 'guest'}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  it('shows logged-out state by default', () => {
    renderWithProviders(<AuthDisplay />);
    expect(screen.getByTestId('status')).toHaveTextContent('logged-out');
    expect(screen.getByTestId('name')).toHaveTextContent('guest');
  });

  it('throws when useAuth is used outside AuthProvider', () => {
    // Suppress the error boundary console output
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<AuthDisplay />)).toThrow(
      'useAuth must be inside <AuthProvider>'
    );
  });
});
```

### Test Context Value Updates

```tsx
it('updates context when logout is called', async () => {
  const user = userEvent.setup();

  // Pre-populate localStorage to simulate a session
  localStorage.setItem('session', JSON.stringify({ id: '1', name: 'Alice', role: 'user' }));

  renderWithProviders(<AuthDisplay />);

  // Session should be rehydrated
  expect(screen.getByTestId('status')).toHaveTextContent('logged-in');
  expect(screen.getByTestId('name')).toHaveTextContent('Alice');

  // Logout
  await user.click(screen.getByRole('button', { name: /logout/i }));

  expect(screen.getByTestId('status')).toHaveTextContent('logged-out');
  expect(localStorage.getItem('session')).toBeNull();
});
```

---

## Router Testing

Use `MemoryRouter` in tests — it doesn't need a real browser URL.

### Testing Navigation

```tsx
// components/Navbar.test.tsx
import { renderWithProviders, screen } from '@/test/utils';
import { Navbar } from '@/components/Navbar';

it('renders login link when not authenticated', () => {
  renderWithProviders(<Navbar />, {
    routerProps: { initialEntries: ['/'] },
  });

  expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
});

it('renders logout button when authenticated', () => {
  localStorage.setItem('session', JSON.stringify({ id: '1', name: 'Alice', role: 'user' }));

  renderWithProviders(<Navbar />, {
    routerProps: { initialEntries: ['/dashboard'] },
  });

  expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /login/i })).not.toBeInTheDocument();

  localStorage.clear();
});
```

### Testing a Full Route Tree

```tsx
// routes/AppRouter.test.tsx
import { renderWithProviders, screen } from '@/test/utils';
import { AppRouter } from '@/routes/AppRouter';

it('renders home page at /', () => {
  renderWithProviders(<AppRouter />, {
    routerProps: { initialEntries: ['/'] },
  });
  expect(screen.getByRole('heading', { name: /welcome/i })).toBeInTheDocument();
});

it('renders 404 for unknown routes', () => {
  renderWithProviders(<AppRouter />, {
    routerProps: { initialEntries: ['/does-not-exist'] },
  });
  expect(screen.getByText(/not found/i)).toBeInTheDocument();
});
```

---

## Query Parameter Testing

```tsx
// pages/ProductsPage.test.tsx
import { renderWithProviders, screen, waitFor } from '@/test/utils';
import { ProductsPage } from '@/pages/ProductsPage';

it('reads page from URL query parameter', async () => {
  renderWithProviders(<ProductsPage />, {
    routerProps: { initialEntries: ['/products?page=3'] },
  });

  await waitFor(() => {
    expect(screen.getByText('Page 3')).toBeInTheDocument();
  });
});

it('reads category from URL and filters products', async () => {
  renderWithProviders(<ProductsPage />, {
    routerProps: { initialEntries: ['/products?category=electronics'] },
  });

  await waitFor(() => {
    // MSW returns only electronics for this category
    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.queryByText('Running Shoes')).not.toBeInTheDocument();
  });
});

it('updates URL when category is changed', async () => {
  const user = userEvent.setup();
  renderWithProviders(<ProductsPage />, {
    routerProps: { initialEntries: ['/products'] },
  });

  await user.click(screen.getByRole('button', { name: /electronics/i }));

  // URL should update — we can check the rendered content driven by the URL
  await waitFor(() => {
    expect(screen.getByRole('button', { name: /electronics/i }))
      .toHaveClass('bg-primary'); // active state class
  });
});
```

---

## Redirection & Component Testing

### Testing PrivateRoute Redirection

```tsx
// routes/PrivateRoute.test.tsx
import { renderWithProviders, screen } from '@/test/utils';
import { AppRouter } from '@/routes/AppRouter';

it('redirects unauthenticated users to /login', async () => {
  localStorage.clear(); // ensure no session

  renderWithProviders(<AppRouter />, {
    routerProps: { initialEntries: ['/dashboard'] },
  });

  // Should show login page, not dashboard
  await waitFor(() => {
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  });
});

it('allows authenticated users to access protected routes', async () => {
  localStorage.setItem('session', JSON.stringify({ id: '1', name: 'Alice', role: 'user' }));

  renderWithProviders(<AppRouter />, {
    routerProps: { initialEntries: ['/dashboard'] },
  });

  await waitFor(() => {
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  });

  localStorage.clear();
});

it('redirects admin-only route to /unauthorized for regular users', async () => {
  localStorage.setItem('session', JSON.stringify({ id: '1', name: 'Alice', role: 'user' }));

  renderWithProviders(<AppRouter />, {
    routerProps: { initialEntries: ['/admin'] },
  });

  await waitFor(() => {
    expect(screen.getByText(/unauthorized/i)).toBeInTheDocument();
  });

  localStorage.clear();
});
```

---

## Mocks & Spies

### MSW — Mock Service Worker

MSW intercepts real `fetch` calls at the network level — the most realistic approach.

```ts
// src/test/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

const PRODUCTS = [
  { id: '1', name: 'Laptop',       price: 999, category: 'electronics' },
  { id: '2', name: 'Running Shoes', price: 89, category: 'sports' },
];

export const handlers = [
  // GET all products
  http.get('/api/products', ({ request }) => {
    const url      = new URL(request.url);
    const category = url.searchParams.get('category');
    const page     = Number(url.searchParams.get('page') ?? 1);

    const filtered = category
      ? PRODUCTS.filter(p => p.category === category)
      : PRODUCTS;

    return HttpResponse.json({
      products:   filtered,
      total:      filtered.length,
      totalPages: Math.ceil(filtered.length / 12),
      page,
    });
  }),

  // GET single product
  http.get('/api/products/:id', ({ params }) => {
    const product = PRODUCTS.find(p => p.id === params.id);
    if (!product) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(product);
  }),

  // POST create product
  http.post('/api/products', async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({ id: '99', ...body }, { status: 201 });
  }),
];
```

```ts
// src/test/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

### Overriding Handlers in Specific Tests

```tsx
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';

it('shows error state when API fails', async () => {
  // Override handler for this test only
  server.use(
    http.get('/api/products', () => new HttpResponse(null, { status: 500 }))
  );

  renderWithProviders(<ProductsPage />);

  await waitFor(() => {
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
  // Handler resets after test via afterEach(() => server.resetHandlers())
});
```

### Spies with Vitest

```tsx
import { vi, expect } from 'vitest';

it('calls onAddToCart when button is clicked', async () => {
  const user = userEvent.setup();
  const onAddToCart = vi.fn(); // create a spy

  renderWithProviders(
    <ProductCard
      name="Laptop" price={999} category="electronics"
      imageUrl="/img.jpg" inStock={true}
      onAddToCart={onAddToCart}
    />
  );

  await user.click(screen.getByRole('button', { name: /add to cart/i }));

  expect(onAddToCart).toHaveBeenCalledTimes(1);
  expect(onAddToCart).toHaveBeenCalledWith(); // called with no args
});

it('does not call onAddToCart when out of stock', async () => {
  const onAddToCart = vi.fn();

  renderWithProviders(
    <ProductCard name="Laptop" price={999} category="electronics"
      imageUrl="/img.jpg" inStock={false} onAddToCart={onAddToCart} />
  );

  expect(screen.getByRole('button', { name: /add to cart/i })).toBeDisabled();
  expect(onAddToCart).not.toHaveBeenCalled();
});
```

### Module Mocking

```tsx
// Mock an entire module
vi.mock('@/lib/api', () => ({
  api: {
    getProducts: vi.fn().mockResolvedValue({ products: [], totalPages: 1 }),
    getProduct:  vi.fn().mockResolvedValue({ id: '1', name: 'Laptop', price: 999 }),
  },
}));

// Or spy on a specific method
import { api } from '@/lib/api';
vi.spyOn(api, 'getProducts').mockResolvedValueOnce({ products: [], totalPages: 1 });
```

---

## Testing with TanStack Query

TanStack queries are async — always use `waitFor` or `findBy*` queries.

```tsx
// hooks/useProducts.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProducts } from '@/hooks/useProducts';
import { MemoryRouter } from 'react-router-dom';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/?page=1']}>
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('useProducts', () => {
  it('returns products from API', async () => {
    const { result } = renderHook(() => useProducts(1), {
      wrapper: createWrapper(),
    });

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    // Wait for data
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.products).toHaveLength(2);
    expect(result.current.products[0].name).toBe('Laptop');
  });

  it('returns error state when API fails', async () => {
    server.use(
      http.get('/api/products', () => new HttpResponse(null, { status: 500 }))
    );

    const { result } = renderHook(() => useProducts(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
```

### Testing Mutations

```tsx
// hooks/useCreateProduct.test.tsx
it('invalidates product list after successful creation', async () => {
  const { result, queryClient } = renderWithProviders(<CreateProductForm />);
  const user = userEvent.setup();

  // Spy on queryClient.invalidateQueries
  const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

  await user.type(screen.getByLabelText(/name/i), 'New Laptop');
  await user.type(screen.getByLabelText(/price/i), '1299');
  await user.click(screen.getByRole('button', { name: /create/i }));

  await waitFor(() => {
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: expect.arrayContaining(['products']),
    });
  });
});
```

---

## Custom Hook Testing

Use `renderHook` from `@testing-library/react`.

```tsx
// hooks/usePagination.test.ts
import { renderHook, act } from '@testing-library/react';
import { usePagination } from '@/hooks/usePagination';

const items = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));

describe('usePagination', () => {
  it('returns first page by default', () => {
    const { result } = renderHook(() => usePagination(items, { itemsPerPage: 10 }));

    expect(result.current.currentPage).toBe(1);
    expect(result.current.paginatedItems).toHaveLength(10);
    expect(result.current.totalPages).toBe(3);
  });

  it('navigates to next page', () => {
    const { result } = renderHook(() => usePagination(items, { itemsPerPage: 10 }));

    act(() => result.current.nextPage());

    expect(result.current.currentPage).toBe(2);
    expect(result.current.paginatedItems[0].id).toBe(11);
  });

  it('does not go below page 1', () => {
    const { result } = renderHook(() => usePagination(items, { itemsPerPage: 10 }));

    act(() => result.current.prevPage());

    expect(result.current.currentPage).toBe(1);
  });

  it('does not exceed totalPages', () => {
    const { result } = renderHook(() => usePagination(items, { itemsPerPage: 10 }));

    act(() => result.current.goToPage(99));

    expect(result.current.currentPage).toBe(3); // clamped to totalPages
  });
});
```

```tsx
// hooks/useQueryParams.test.tsx
import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useQueryParams } from '@/hooks/useQueryParams';

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <MemoryRouter initialEntries={['/products?page=2&category=shoes']}>
      {children}
    </MemoryRouter>
  );
}

describe('useQueryParams', () => {
  it('reads string params from URL', () => {
    const { result } = renderHook(() => useQueryParams(), { wrapper });
    expect(result.current.getParam('category')).toBe('shoes');
  });

  it('reads number params from URL', () => {
    const { result } = renderHook(() => useQueryParams(), { wrapper });
    expect(result.current.getNumberParam('page')).toBe(2);
  });

  it('returns fallback for missing params', () => {
    const { result } = renderHook(() => useQueryParams(), { wrapper });
    expect(result.current.getParam('missing', 'default')).toBe('default');
  });
});
```

---

## Best Practices

### Query by Role (Accessibility-First)

```tsx
// ✅ Prefer — tests accessibility and semantics
screen.getByRole('button', { name: /add to cart/i })
screen.getByRole('heading', { level: 1 })
screen.getByRole('link', { name: /home/i })

// ⚠️ Use only when semantic queries don't work
screen.getByTestId('product-card')

// ❌ Avoid — ties tests to implementation details
screen.getByClassName('product-card__button')
```

### Always Use `waitFor` for Async

```tsx
// ❌ May not wait long enough
expect(screen.getByText('Laptop')).toBeInTheDocument();

// ✅ Waits until assertion passes or timeout
await waitFor(() => {
  expect(screen.getByText('Laptop')).toBeInTheDocument();
});

// ✅ findBy* is shorthand for waitFor + getBy
const item = await screen.findByText('Laptop');
```
