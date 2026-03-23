# 02 – TanStack Query, Query Parameters & Data Fetching

> **Goal:** Replace ad-hoc `useState` + `useEffect` data fetching with TanStack Query for caching, background sync, and clean specialized hooks.

---

## Table of Contents

- [02 – TanStack Query, Query Parameters \& Data Fetching](#02--tanstack-query-query-parameters--data-fetching)
  - [Table of Contents](#table-of-contents)
  - [Why TanStack Query](#why-tanstack-query)
  - [Setup](#setup)
  - [useQuery](#usequery)
    - [Status Fields](#status-fields)
    - [Example – Product List](#example--product-list)
  - [useMutation](#usemutation)
    - [Optimistic Mutation](#optimistic-mutation)
  - [Query Parameters](#query-parameters)
  - [Caching](#caching)
    - [Query Keys — The Cache Foundation](#query-keys--the-cache-foundation)
    - [staleTime vs gcTime](#staletime-vs-gctime)
    - [Prefetching](#prefetching)
  - [Specialized Custom Hooks](#specialized-custom-hooks)
  - [Category-Based Pagination](#category-based-pagination)
  - [Common Pitfalls](#common-pitfalls)

---

## Why TanStack Query

The traditional approach forces you to wire up `useState` + `useEffect` for every fetch:

```tsx
// ❌ The old way — boilerplate you write over and over
const [data, setData]       = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError]     = useState(null);

useEffect(() => {
  setLoading(true);
  fetch('/api/products')
    .then(r => r.json())
    .then(setData)
    .catch(setError)
    .finally(() => setLoading(false));
}, []);
// No caching. No background refresh. No deduplication. No retry.
```

TanStack Query handles all of this automatically:

```tsx
// ✅ TanStack Query — same result, far less code
const { data, isLoading, error } = useQuery({
  queryKey: ['products'],
  queryFn:  () => fetch('/api/products').then(r => r.json()),
});
// Cached. Deduped. Auto-retried. Background-refreshed.
```

| Feature | Manual `useEffect` | TanStack Query |
| :--------- | :------------------- | :---------------- |
| Caching | ❌ | ✅ |
| Background refresh | ❌ | ✅ |
| Request deduplication | ❌ | ✅ |
| Auto retry on error | ❌ | ✅ |
| Loading/error states | Manual | ✅ Built-in |
| Optimistic updates | Very complex | ✅ Built-in |
| Pagination | Manual | ✅ Built-in |

---

## Setup

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

```tsx
// main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:          1000 * 60 * 5, // 5 min — data stays fresh
      gcTime:             1000 * 60 * 10, // 10 min — cache retention
      retry:              2,              // retry failed queries twice
      refetchOnWindowFocus: false,        // disable for most apps
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
```

---

## useQuery

```tsx
const query = useQuery({
  queryKey: ['unique', 'key'],   // cache key — array of primitives
  queryFn:  fetchFunction,       // must return a Promise
  enabled:  true,                // set false to pause query
  staleTime: 1000 * 60,          // override default staleTime
});

// Destructure what you need
const { data, isLoading, isFetching, isError, error, refetch } = query;
```

### Status Fields

| Field | Meaning |
| :------- | :--------- |
| `isLoading` | First load — no cached data yet |
| `isFetching` | Any network request in flight (including background refresh) |
| `isError` | Query failed |
| `isSuccess` | Data available |
| `data` | The resolved value |

### Example – Product List

```tsx
// lib/api.ts
const API = 'https://api.example.com';

export const api = {
  getProducts: (page = 1, limit = 12): Promise<ProductsResponse> =>
    fetch(`${API}/products?page=${page}&limit=${limit}`).then(r => {
      if (!r.ok) throw new Error('Failed to fetch products');
      return r.json();
    }),

  getProduct: (id: string): Promise<Product> =>
    fetch(`${API}/products/${id}`).then(r => {
      if (!r.ok) throw new Error('Product not found');
      return r.json();
    }),
};
```

```tsx
// hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useProducts(page: number, limit = 12) {
  return useQuery({
    queryKey: ['products', page, limit],   // key changes → new query
    queryFn:  () => api.getProducts(page, limit),
    placeholderData: (prev) => prev,       // keep old data while fetching new page
  });
}
```

```tsx
// hooks/useProduct.ts
export function useProduct(id: string) {
  return useQuery({
    queryKey: ['products', id],
    queryFn:  () => api.getProduct(id),
    enabled:  !!id,                        // don't run if id is empty
  });
}
```

```tsx
// ProductDetail.tsx
const ProductDetail: React.FC<{ id: string }> = ({ id }) => {
  const { data: product, isLoading, isError } = useProduct(id);

  if (isLoading) return <Skeleton className="h-96" />;
  if (isError)   return <p className="text-red-500">Product not found.</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="text-2xl">${product.price}</p>
    </div>
  );
};
```

---

## useMutation

Mutations handle **write operations** (POST, PUT, DELETE).

```tsx
const mutation = useMutation({
  mutationFn: (newProduct: NewProduct) => api.createProduct(newProduct),
  onSuccess:  (data) => {
    // Invalidate queries so lists refresh automatically
    queryClient.invalidateQueries({ queryKey: ['products'] });
    toast.success('Product created!');
  },
  onError: (error) => {
    toast.error(error.message);
  },
});

// Trigger the mutation
mutation.mutate({ name: 'Shoes', price: 49.99 });
// or await:
await mutation.mutateAsync(data);
```

### Optimistic Mutation

```tsx
const useToggleLike = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.toggleLike(postId),

    onMutate: async () => {
      // Cancel in-flight queries for this post
      await queryClient.cancelQueries({ queryKey: ['posts', postId] });

      // Snapshot current value for rollback
      const previous = queryClient.getQueryData<Post>(['posts', postId]);

      // Optimistically update
      queryClient.setQueryData<Post>(['posts', postId], old =>
        old ? { ...old, liked: !old.liked, likes: old.likes + (old.liked ? -1 : 1) } : old
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      // Rollback on failure
      if (context?.previous) {
        queryClient.setQueryData(['posts', postId], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', postId] });
    },
  });
};
```

---

## Query Parameters

Sync pagination, filters, and search with the URL using `useSearchParams`.

```tsx
// hooks/useQueryParams.ts
import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

export function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const getParam = (key: string, fallback = '') =>
    searchParams.get(key) ?? fallback;

  const getNumberParam = (key: string, fallback = 1) =>
    Number(searchParams.get(key)) || fallback;

  const setParam = useCallback((key: string, value: string | number) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set(key, String(value));
      return next;
    });
  }, [setSearchParams]);

  const setParams = useCallback((updates: Record<string, string | number>) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([k, v]) => next.set(k, String(v)));
      return next;
    });
  }, [setSearchParams]);

  const removeParam = useCallback((key: string) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.delete(key);
      return next;
    });
  }, [setSearchParams]);

  return { getParam, getNumberParam, setParam, setParams, removeParam, searchParams };
}
```

```tsx
// ProductsPage.tsx — URL drives the state
const ProductsPage: React.FC = () => {
  const { getParam, getNumberParam, setParam, setParams } = useQueryParams();

  const page     = getNumberParam('page', 1);
  const category = getParam('category');
  const search   = getParam('q');

  const { data, isLoading } = useProducts({ page, category, search });

  return (
    <div>
      <Input
        value={search}
        onChange={e => setParams({ q: e.target.value, page: 1 })} // reset page on search
        placeholder="Search products…"
      />
      <CategoryFilter
        value={category}
        onChange={cat => setParams({ category: cat, page: 1 })}
      />
      {isLoading
        ? <ProductGridSkeleton />
        : <ProductGrid products={data?.products ?? []} />
      }
      <Pagination
        currentPage={page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={p => setParam('page', p)}
      />
    </div>
  );
};
// URL: /products?category=shoes&q=nike&page=2
// Shareable, bookmarkable, browser-back works correctly ✅
```

---

## Caching

### Query Keys — The Cache Foundation

Query keys are the cache address. **Same key = same cache entry.**

```tsx
// Cache entries are separate for different keys
['products']                          // all products
['products', 1]                       // page 1
['products', { category: 'shoes' }]  // shoes category
['products', 'abc123']                // specific product

// ✅ Best practice: use a key factory
export const productKeys = {
  all:      ()                => ['products']                        as const,
  lists:    ()                => [...productKeys.all(), 'list']      as const,
  list:     (filters: object) => [...productKeys.lists(), filters]   as const,
  details:  ()                => [...productKeys.all(), 'detail']    as const,
  detail:   (id: string)      => [...productKeys.details(), id]      as const,
};

// Invalidate all product queries
queryClient.invalidateQueries({ queryKey: productKeys.all() });

// Invalidate only list queries
queryClient.invalidateQueries({ queryKey: productKeys.lists() });
```

### staleTime vs gcTime

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,  // 5 min: data is "fresh" — no background refetch
      gcTime:    1000 * 60 * 10, // 10 min: unused cache is garbage collected
    },
  },
});

// Per-query override
useQuery({
  queryKey: ['user', id],
  queryFn:  () => api.getUser(id),
  staleTime: Infinity,  // Never re-fetch automatically (e.g. static config data)
});
```

### Prefetching

```tsx
// Prefetch data before user navigates to the page
const prefetchProduct = async (id: string) => {
  await queryClient.prefetchQuery({
    queryKey: productKeys.detail(id),
    queryFn:  () => api.getProduct(id),
  });
};

// On hover — by the time user clicks, data is ready
<ProductCard onMouseEnter={() => prefetchProduct(product.id)} />
```

---

## Specialized Custom Hooks

Wrap TanStack Query in domain-specific hooks so components never import from `@tanstack/react-query` directly.

```tsx
// hooks/useProductList.ts
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useQueryParams } from './useQueryParams';
import { productKeys, api }           from '@/lib';

interface UseProductListOptions {
  itemsPerPage?: number;
}

export function useProductList({ itemsPerPage = 12 }: UseProductListOptions = {}) {
  const { getNumberParam, getParam } = useQueryParams();

  const page     = getNumberParam('page', 1);
  const category = getParam('category');
  const search   = getParam('q');

  const query = useQuery({
    queryKey: productKeys.list({ page, category, search, itemsPerPage }),
    queryFn:  () => api.getProducts({ page, category, search, limit: itemsPerPage }),
    placeholderData: keepPreviousData,  // smooth page transitions
  });

  return {
    ...query,
    products:   query.data?.products   ?? [],
    totalPages: query.data?.totalPages ?? 1,
    totalItems: query.data?.total      ?? 0,
    currentPage: page,
  };
}
```

```tsx
// hooks/useProductDetail.ts
export function useProductDetail(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn:  () => api.getProduct(id),
    enabled:  !!id,
    staleTime: 1000 * 60 * 10, // product details change rarely
  });
}
```

```tsx
// hooks/useCreateProduct.ts
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success('Product created!');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
```

```tsx
// Component is clean — no TanStack imports, no fetch logic
const ProductsPage: React.FC = () => {
  const { products, isLoading, currentPage, totalPages } = useProductList();

  if (isLoading) return <ProductGridSkeleton />;

  return (
    <>
      <ProductGrid products={products} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={...} />
    </>
  );
};
```

---

## Category-Based Pagination

Combining category filtering with URL-synced pagination.

```tsx
// hooks/useCategoryProducts.ts
export function useCategoryProducts() {
  const { getParam, getNumberParam, setParams } = useQueryParams();

  const category = getParam('category', 'all');
  const page     = getNumberParam('page', 1);

  const query = useQuery({
    queryKey: productKeys.list({ category, page }),
    queryFn:  () =>
      category === 'all'
        ? api.getProducts({ page })
        : api.getProductsByCategory({ category, page }),
    placeholderData: keepPreviousData,
  });

  // Changing category always resets to page 1
  const setCategory = (cat: string) => setParams({ category: cat, page: 1 });
  const setPage     = (p: number)   => setParams({ page: p });

  return {
    ...query,
    products:    query.data?.products   ?? [],
    totalPages:  query.data?.totalPages ?? 1,
    category,
    page,
    setCategory,
    setPage,
  };
}
```

```tsx
// CategoryTabs.tsx — driven entirely by URL state
const CATEGORIES = ['all', 'electronics', 'clothing', 'books', 'sports'];

const CategoryTabs: React.FC = () => {
  const { category, setCategory, products, isLoading, totalPages, page, setPage } =
    useCategoryProducts();

  return (
    <div>
      {/* Category selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {CATEGORIES.map(cat => (
          <Button
            key={cat}
            variant={category === cat ? 'default' : 'outline'}
            onClick={() => setCategory(cat)}
            className="capitalize"
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <ProductGridSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(p => <ProductCard key={p.id} {...p} />)}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        isLoading={isLoading}
      />
    </div>
  );
};
```

---

## Common Pitfalls

| Pitfall | Fix |
| :--------- | :----- |
| Putting objects/arrays directly in `queryKey` without memoising | TanStack Query does deep equality on keys — objects are fine |
| Not using `enabled` for dependent queries | `enabled: !!userId` prevents fetch before data is ready |
| Forgetting `placeholderData: keepPreviousData` for pagination | Without it, UI flashes empty on every page change |
| Invalidating too broadly | Use key factories to invalidate only what changed |
| Calling `queryClient` outside `QueryClientProvider` | Always wrap the whole app in the provider |
| Mutation side effects in the component | Move `onSuccess`/`onError` into the hook |
