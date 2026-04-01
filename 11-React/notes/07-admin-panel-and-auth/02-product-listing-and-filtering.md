# 02 – Product Listing & Filtering

> **Goal:** Build server-driven product pages (main + gender) with multi-filter support, using TanStack Query advanced patterns to keep the UI snappy and the URL as the single source of truth.

> **Prior art:** TanStack setup, `useQuery`, `useMutation`, basic query params, and `keepPreviousData` are covered in `06/02-tanstack-query-and-data-fetching.md`. This note focuses on what's new in the admin/product-listing context.

---

## Table of Contents

1. [Argument Transformations](#argument-transformations)
2. [Query Key Factories — In Depth](#query-key-factories--in-depth)
3. [Server-Side Pagination](#server-side-pagination)
4. [Multi-Filter Hooks](#multi-filter-hooks)
5. [Gender Page Pattern](#gender-page-pattern)
6. [Common Pitfalls](#common-pitfalls)

---

## Argument Transformations

When your component-level filter state doesn't map 1:1 to what the API expects, transform before passing to the query function.

```tsx
// The component knows about "gender" and "page"
// The API expects { gender, offset, limit }

// lib/api/products.ts
interface ProductListParams {
  gender?:  'men' | 'women' | 'kids' | '';
  page?:    number;
  limit?:   number;
  search?:  string;
}

// Transform: component args → API args
function toApiParams(params: ProductListParams) {
  const { page = 1, limit = 12, ...rest } = params;
  return {
    ...rest,
    offset: (page - 1) * limit,   // page-based → offset-based
    limit,
  };
}

export const productsApi = {
  getList: (params: ProductListParams) =>
    axios
      .get('/products', { params: toApiParams(params) })
      .then(r => r.data),
};
```

```tsx
// The hook presents a clean, component-friendly API
// hooks/useProductList.ts
export function useProductList(params: ProductListParams) {
  return useQuery({
    queryKey: productKeys.list(params),   // raw params as key
    queryFn:  () => productsApi.getList(params),   // transform inside
    placeholderData: keepPreviousData,
  });
}
```

### Why Keep the Transformation Inside the Query Function

- Query key uses raw component args → easy to read, easy to invalidate by component state
- API shape can change without touching components or query keys
- Easier to test the transformation in isolation

---

## Query Key Factories — In Depth

> Already introduced in section 06. Here we build a complete factory for a product-centric admin.

```ts
// lib/queryKeys.ts

export const productKeys = {
  // Root — invalidates EVERYTHING product-related
  all: () => ['products'] as const,

  // All list queries (any filters)
  lists: () => [...productKeys.all(), 'list'] as const,

  // A specific filtered list
  list: (filters: object) => [...productKeys.lists(), filters] as const,

  // All detail queries
  details: () => [...productKeys.all(), 'detail'] as const,

  // A specific product detail
  detail: (id: string) => [...productKeys.details(), id] as const,
};

// Usage examples
queryClient.invalidateQueries({ queryKey: productKeys.all() });      // full cache wipe
queryClient.invalidateQueries({ queryKey: productKeys.lists() });    // only list pages
queryClient.invalidateQueries({ queryKey: productKeys.detail(id) }); // one product
```

### Matching Logic

TanStack Query checks if the invalidation key is a **prefix** of cached keys.

```
productKeys.all()  →  ['products']
  matches:  ['products', 'list', { page: 1 }]  ✅
  matches:  ['products', 'detail', 'abc']       ✅

productKeys.lists() →  ['products', 'list']
  matches:  ['products', 'list', { page: 1 }]  ✅
  no match: ['products', 'detail', 'abc']       ❌
```

This lets you surgically invalidate after mutations:

```tsx
// After creating a product — only invalidate lists, not detail cache
onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.lists() }),

// After updating a specific product — invalidate just its detail + all lists
onSuccess: (_, { id }) => {
  queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
  queryClient.invalidateQueries({ queryKey: productKeys.lists() });
},
```

---

## Server-Side Pagination

Client-side pagination (slicing an array) was covered in section 06. Admin panels almost always need **server-side pagination** because datasets are too large to load at once.

```tsx
// hooks/useAdminProductList.ts
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useAdminFilters } from './useAdminFilters';
import { productsApi }     from '@/lib/api';
import { productKeys }     from '@/lib/queryKeys';

export function useAdminProductList() {
  const { filters } = useAdminFilters();
  const { page, limit, search, gender, status } = filters;

  const query = useQuery({
    queryKey: productKeys.list({ page, limit, search, gender, status }),
    queryFn:  () => productsApi.getList({ page, limit, search, gender, status }),
    placeholderData: keepPreviousData,   // no flash when changing pages
  });

  return {
    ...query,
    products:   query.data?.data       ?? [],
    total:      query.data?.total      ?? 0,
    totalPages: Math.ceil((query.data?.total ?? 0) / limit),
    page,
    limit,
  };
}
```

```tsx
// ProductsPage.tsx
const ProductsPage: React.FC = () => {
  const { products, isLoading, isFetching, totalPages, page } = useAdminProductList();
  const { filters, setFilter, clearFilters } = useAdminFilters();

  return (
    <div className="space-y-4">
      <ProductFilters filters={filters} onFilterChange={setFilter} onClear={clearFilters} />

      {/* isFetching (not isLoading) shows a subtle loading indicator on page changes */}
      {isFetching && <ProgressBar />}

      <ProductTable products={products} isLoading={isLoading} />

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={p => setFilter('page', p)} />
    </div>
  );
};
```

### `isLoading` vs `isFetching` for Pagination UX

| State | When true | Best used for |
| :---- | :-------- | :------------ |
| `isLoading` | First load only (no cached data) | Full-page skeleton |
| `isFetching` | Any network request, including page changes | Subtle progress indicator, disabled state |

```tsx
// Subtle loading indicator pattern
{isFetching && (
  <div className="h-1 w-full bg-primary/20 rounded-full overflow-hidden">
    <div className="h-full bg-primary animate-pulse" />
  </div>
)}
```

---

## Multi-Filter Hooks

Combine URL params, TanStack Query, and filter reset logic into one domain hook.

```tsx
// hooks/useProductFilters.ts
import { useSearchParams } from 'react-router-dom';

export type Gender = 'men' | 'women' | 'kids' | '';
export type ProductStatus = 'active' | 'inactive' | '';

export function useProductFilters() {
  const [params, setParams] = useSearchParams();

  const filters = {
    page:   Number(params.get('page'))   || 1,
    search: params.get('search')         ?? '',
    gender: (params.get('gender')        ?? '') as Gender,
    status: (params.get('status')        ?? '') as ProductStatus,
  };

  // Generic setter — always resets page to 1 for non-page updates
  const set = <K extends keyof typeof filters>(key: K, value: typeof filters[K]) => {
    setParams(prev => {
      const next = new URLSearchParams(prev);
      next.set(key, String(value));
      if (key !== 'page') next.set('page', '1');
      return next;
    });
  };

  // Remove a filter entirely (vs setting it to empty string)
  const remove = (key: string) => {
    setParams(prev => {
      const next = new URLSearchParams(prev);
      next.delete(key);
      next.set('page', '1');
      return next;
    });
  };

  const clearAll = () => setParams({});

  const activeFilterCount = [filters.search, filters.gender, filters.status]
    .filter(Boolean).length;

  return { filters, set, remove, clearAll, activeFilterCount };
}
```

---

## Gender Page Pattern

A dedicated gender page (e.g., `/store/women`) is essentially the product listing pre-filtered by gender. Use the same hook, seeding the gender from the URL segment.

```tsx
// pages/GenderPage.tsx
import { useParams } from 'react-router-dom';

// Route: <Route path="/store/:gender" element={<GenderPage />} />

const GenderPage: React.FC = () => {
  const { gender } = useParams<{ gender: string }>();

  // Pass gender as a static filter — user can still apply sub-filters
  const { products, isLoading, totalPages } = useProductList({
    gender: gender as Gender,
    // page / search still come from URL params via useProductFilters inside the hook
  });

  return (
    <div>
      <h1 className="text-2xl font-bold capitalize">{gender}'s Collection</h1>
      <ProductFilters hideGenderFilter />    {/* gender is fixed on this page */}
      <ProductGrid products={products} isLoading={isLoading} />
      <Pagination totalPages={totalPages} ... />
    </div>
  );
};
```

### Merging Static + Dynamic Filters

When one filter is fixed by the route, merge it with the dynamic URL params:

```tsx
export function useProductList(staticFilters: Partial<ProductFilters> = {}) {
  const { filters: urlFilters } = useProductFilters();

  // Static filters (from route) take precedence over URL params for the same key
  const merged = { ...urlFilters, ...staticFilters };

  return useQuery({
    queryKey: productKeys.list(merged),
    queryFn:  () => productsApi.getList(merged),
    placeholderData: keepPreviousData,
  });
}
```

---

## Common Pitfalls

| Pitfall | Fix |
| :--- | :--- |
| Not resetting page when filter changes | Always `next.set('page', '1')` in the filter setter |
| Using `isLoading` for page transitions | Use `isFetching` — `isLoading` is false after first load |
| Hardcoding gender in the component | Read from `useParams`, pass as static filter to the shared hook |
| Building separate hooks per page | One parameterised hook + static overrides keeps things DRY |
| Query key doesn't include all filters | Cache misses or stale results — every filter that affects the result must be in the key |
