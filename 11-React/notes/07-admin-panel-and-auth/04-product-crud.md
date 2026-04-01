# 04 – Admin Panel: Product CRUD

> **Goal:** Build the full admin product management experience — a filterable/paginated table, a shared create/edit form with validations, TanStack mutations, and precise cache invalidation.

> **Prior art:** TanStack `useMutation`, `invalidateQueries`, query key factories, and filter/pagination hooks are covered in earlier notes. This note focuses on the **form layer** (`useForm`, validations) and wiring it all together with mutations.

---

## Table of Contents

1. [Product Table with Filters & Pagination](#product-table-with-filters--pagination)
2. [Forms with `useForm`](#forms-with-useform)
3. [Validations](#validations)
4. [Shared Create / Edit Form](#shared-create--edit-form)
5. [TanStack Mutations in Detail](#tanstack-mutations-in-detail)
6. [Cache Invalidation Strategy](#cache-invalidation-strategy)

---

## Product Table with Filters & Pagination

The admin product table is a server-side data grid. Filters and page are in the URL (stateless persistence).

```tsx
// components/admin/ProductTable.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge }  from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProductTableProps {
  products:  Product[];
  isLoading: boolean;
  onEdit:    (id: string) => void;
  onDelete:  (id: string) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products, isLoading, onEdit, onDelete,
}) => {
  if (isLoading) return <TableSkeleton rows={10} />;

  if (!products.length) return (
    <div className="flex flex-col items-center py-16 text-muted-foreground">
      <Package className="h-12 w-12 mb-4 opacity-40" />
      <p>No products found.</p>
    </div>
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Gender</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map(product => (
          <TableRow key={product.id}>
            <TableCell className="font-medium">{product.title}</TableCell>
            <TableCell className="capitalize">{product.gender}</TableCell>
            <TableCell>${product.price.toFixed(2)}</TableCell>
            <TableCell>{product.stock}</TableCell>
            <TableCell>
              <Badge variant={product.inStock ? 'default' : 'secondary'}>
                {product.inStock ? 'In Stock' : 'Sold Out'}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="ghost" size="sm" onClick={() => onEdit(product.id)}>
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete(product.id)}>
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
```

### Filter Bar

```tsx
// components/admin/ProductFilters.tsx
export const ProductFilters: React.FC = () => {
  const { filters, set, clearAll, activeFilterCount } = useProductFilters();

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <Input
        placeholder="Search products…"
        value={filters.search}
        onChange={e => set('search', e.target.value)}
        className="w-64"
      />

      <Select value={filters.gender} onValueChange={v => set('gender', v as Gender)}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Gender" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All</SelectItem>
          <SelectItem value="men">Men</SelectItem>
          <SelectItem value="women">Women</SelectItem>
          <SelectItem value="kids">Kids</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.status} onValueChange={v => set('status', v as ProductStatus)}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>

      {activeFilterCount > 0 && (
        <Button variant="ghost" size="sm" onClick={clearAll}>
          Clear ({activeFilterCount})
        </Button>
      )}
    </div>
  );
};
```

---

## Forms with `useForm`

`react-hook-form` provides performant, uncontrolled form management. Individual fields re-render in isolation — not the whole form.

```bash
npm install react-hook-form
```

```tsx
import { useForm } from 'react-hook-form';

interface ProductFormData {
  title:       string;
  description: string;
  price:       number;
  stock:       number;
  gender:      'men' | 'women' | 'kids';
  tags:        string;    // comma-separated → transformed before submit
  slug:        string;
}

const { register, handleSubmit, formState: { errors }, reset, watch, setValue } =
  useForm<ProductFormData>({
    defaultValues: {
      title:       '',
      description: '',
      price:       0,
      stock:       0,
      gender:      'men',
      tags:        '',
      slug:        '',
    },
  });
```

### Key `useForm` Returns

| Return | Purpose |
| :--- | :--- |
| `register(name, rules)` | Connect input to form — handles value + validation |
| `handleSubmit(fn)` | Wraps submit handler — validates before calling `fn` |
| `formState.errors` | Validation error messages per field |
| `formState.isSubmitting` | True while async submit is in progress |
| `reset(values?)` | Reset form to defaults or given values |
| `watch(name)` | Subscribe to a field's current value |
| `setValue(name, value)` | Programmatically set a field value |

---

## Validations

Validation rules are passed as the second argument to `register`.

### Required

```tsx
<Input
  {...register('title', { required: 'Title is required' })}
  placeholder="Product title"
/>
{errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
```

### Min / Max

```tsx
<Input
  type="number"
  {...register('price', {
    required: 'Price is required',
    min: { value: 0.01, message: 'Price must be greater than 0' },
    max: { value: 99999, message: 'Price is too high' },
  })}
/>

<Input
  type="number"
  {...register('stock', {
    required: 'Stock is required',
    min: { value: 0,    message: 'Stock cannot be negative' },
  })}
/>

// For string length:
<Textarea
  {...register('description', {
    required:  'Description is required',
    minLength: { value: 20,   message: 'At least 20 characters' },
    maxLength: { value: 1000, message: 'Maximum 1000 characters' },
  })}
/>
```

### Regex-Based Validation

```tsx
// Slug: only lowercase letters, numbers, and hyphens
<Input
  {...register('slug', {
    required: 'Slug is required',
    pattern: {
      value:   /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      message: 'Slug must be lowercase with hyphens only (e.g., my-product)',
    },
  })}
/>

// SKU: 3 uppercase letters + dash + 4-6 digits
<Input
  {...register('sku', {
    pattern: {
      value:   /^[A-Z]{3}-\d{4,6}$/,
      message: 'SKU format: ABC-1234',
    },
  })}
/>
```

### Custom Validation Function

```tsx
<Input
  {...register('tags', {
    validate: value => {
      const count = value.split(',').filter(Boolean).length;
      return count <= 10 || 'Maximum 10 tags allowed';
    },
  })}
/>
```

### Reusable Form Field Component

```tsx
// components/admin/FormField.tsx
interface FormFieldProps {
  label:      string;
  error?:     string;
  children:   React.ReactNode;
  required?:  boolean;
}

export const FormField: React.FC<FormFieldProps> = ({ label, error, children, required }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium leading-none">
      {label}
      {required && <span className="text-destructive ml-1">*</span>}
    </label>
    {children}
    {error && (
      <p className="text-xs text-destructive flex items-center gap-1">
        <AlertCircle className="h-3 w-3" />
        {error}
      </p>
    )}
  </div>
);
```

---

## Shared Create / Edit Form

One form component handles both create and edit. Differentiate by the presence of an `id` prop.

```tsx
// pages/admin/ProductFormPage.tsx
import { useParams } from 'react-router-dom';

const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEditing = !!id;

  const { data: product, isLoading } = useProductDetail(id ?? '');  // skip if no id

  if (isEditing && isLoading) return <FormSkeleton />;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Product' : 'New Product'}
      </h1>
      <ProductForm product={product} />
    </div>
  );
};
```

```tsx
// components/admin/ProductForm.tsx
interface ProductFormProps {
  product?: Product;   // undefined → create mode
}

export const ProductForm: React.FC<ProductFormProps> = ({ product }) => {
  const navigate = useNavigate();
  const isEditing = !!product;

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } =
    useForm<ProductFormData>({
      defaultValues: product
        ? {
            title:       product.title,
            description: product.description,
            price:       product.price,
            stock:       product.stock,
            gender:      product.gender,
            tags:        product.tags.join(', '),
            slug:        product.slug,
          }
        : { gender: 'men', price: 0, stock: 0 },
    });

  const { mutate: createProduct } = useCreateProduct();
  const { mutate: updateProduct } = useUpdateProduct(product?.id ?? '');

  const onSubmit = (data: ProductFormData) => {
    // Transform before sending to API
    const payload = {
      ...data,
      tags: data.tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    if (isEditing) {
      updateProduct(payload, {
        onSuccess: () => { toast.success('Product updated'); },
      });
    } else {
      createProduct(payload, {
        onSuccess: (created) => {
          navigate(`/admin/products/${created.id}/edit`, { replace: true });
          toast.success('Product created');
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormField label="Title" error={errors.title?.message} required>
        <Input {...register('title', { required: 'Title is required' })} />
      </FormField>

      <FormField label="Slug" error={errors.slug?.message} required>
        <Input {...register('slug', {
          required: 'Slug is required',
          pattern: { value: /^[a-z0-9-]+$/, message: 'Lowercase, numbers, hyphens only' },
        })} />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Price" error={errors.price?.message} required>
          <Input type="number" step="0.01" {...register('price', {
            required: 'Required',
            min: { value: 0.01, message: '> 0' },
          })} />
        </FormField>

        <FormField label="Stock" error={errors.stock?.message} required>
          <Input type="number" {...register('stock', {
            required: 'Required',
            min: { value: 0, message: '≥ 0' },
          })} />
        </FormField>
      </div>

      <FormField label="Tags" error={errors.tags?.message}>
        <Input placeholder="shirt, casual, summer" {...register('tags')} />
        <p className="text-xs text-muted-foreground">Comma-separated</p>
      </FormField>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Save Changes' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};
```

---

## TanStack Mutations in Detail

```ts
// hooks/useCreateProduct.ts
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductPayload) =>
      api.post<Product>('/products', data).then(r => r.data),

    onSuccess: () => {
      // Invalidate all list queries — new product should appear
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },

    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message ?? 'Failed to create product');
    },
  });
}

// hooks/useUpdateProduct.ts
export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProductPayload) =>
      api.patch<Product>(`/products/${id}`, data).then(r => r.data),

    onSuccess: (updatedProduct) => {
      // Update the detail cache immediately (no re-fetch needed)
      queryClient.setQueryData(productKeys.detail(id), updatedProduct);
      // Refresh lists (price/title may have changed)
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },

    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message ?? 'Failed to update product');
    },
  });
}

// hooks/useDeleteProduct.ts
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),

    onSuccess: (_, id) => {
      // Remove from detail cache
      queryClient.removeQueries({ queryKey: productKeys.detail(id) });
      // Refresh lists
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success('Product deleted');
    },
  });
}
```

### Mutation States in the UI

```tsx
const { mutate, isPending, isError } = useDeleteProduct();

<Button
  variant="destructive"
  disabled={isPending}
  onClick={() => mutate(product.id)}
>
  {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : 'Delete'}
</Button>
```

---

## Cache Invalidation Strategy

| Mutation | Cache action | Why |
| :--- | :--- | :--- |
| Create product | `invalidateQueries(lists)` | New product may appear on any page |
| Update product | `setQueryData(detail)` + `invalidateQueries(lists)` | Update detail instantly; lists may show stale title/price |
| Delete product | `removeQueries(detail)` + `invalidateQueries(lists)` | Remove stale detail; shrink all list pages |
| Bulk action | `invalidateQueries(all)` | Easier than tracking individual keys |

### `invalidateQueries` vs `setQueryData`

| Method | Network request | Use when |
| :--- | :--- | :--- |
| `invalidateQueries` | Yes (marks stale, refetches) | You need fresh data from the server |
| `setQueryData` | No | Server returned the updated object in the mutation response — no re-fetch needed |

```ts
// Combine both for the best UX:
// 1. Update detail immediately (zero latency)
queryClient.setQueryData(productKeys.detail(id), serverResponse);

// 2. Invalidate lists so they re-fetch with updated data
queryClient.invalidateQueries({ queryKey: productKeys.lists() });
```
