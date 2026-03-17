# 02. useReducer, State Management & Tools

> **Goal:** Manage complex, multi-field state with `useReducer`, validate with Zod, persist with storage APIs, and polish the UI with shadcn + Sonner.

---

## Table of Contents

1. [Reducer Pattern](#reducer-pattern)
2. [useReducer Hook](#usereducer-hook)
3. [Schema Validation – Zod](#schema-validation--zod)
4. [Effects on State](#effects-on-state)
5. [LocalStorage & SessionStorage](#localstorage--sessionstorage)
6. [Reducer Conditions](#reducer-conditions)
7. [shadcn/ui](#shadcnui)
8. [Sonner – Toast Notifications](#sonner--toast-notifications)

---

## Reducer Pattern

A **reducer** is a pure function that takes the current state and an action, then returns the *next* state.

```text
(state, action) => newState
```

### When to prefer `useReducer` over `useState`

| Scenario | Prefer |
| :---------- | :------- |
| 1–2 independent values | `useState` |
| Multiple values that change together | `useReducer` |
| Next state depends on previous state in complex ways | `useReducer` |
| You want human-readable action names | `useReducer` |
| Centralised logic that can be unit-tested | `useReducer` |

---

## useReducer Hook

```tsx
const [state, dispatch] = useReducer(reducer, initialState);
```

### Full Shopping-Cart Example

```tsx
// types.ts
interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

// Define every action as a discriminated union
type CartAction =
  | { type: 'ADD_ITEM';    payload: Omit<CartItem, 'qty'> }
  | { type: 'REMOVE_ITEM'; payload: { id: number } }
  | { type: 'UPDATE_QTY';  payload: { id: number; qty: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' };
```

```tsx
// reducer.ts
const initialState: CartState = { items: [], isOpen: false };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, qty: 1 }] };
    }

    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload.id) };

    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload.id ? { ...i, qty: action.payload.qty } : i
        ),
      };

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };

    default:
      return state; // always return state for unknown actions
  }
}
```

```tsx
// Cart.tsx
import { useReducer } from 'react';

const Cart: React.FC = () => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  const total = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div>
      <button onClick={() => dispatch({ type: 'TOGGLE_CART' })}>
        Cart ({cart.items.length})
      </button>

      {cart.isOpen && (
        <ul>
          {cart.items.map(item => (
            <li key={item.id}>
              {item.name} × {item.qty}
              <button onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: { id: item.id } })}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <p>Total: ${total.toFixed(2)}</p>
      <button onClick={() => dispatch({ type: 'CLEAR_CART' })}>Clear</button>
    </div>
  );
};
```

### Key Rules

- Reducer must be **pure** — no API calls, no random values, no mutations.
- Always return a **new object** — never mutate `state` directly.
- Use **discriminated unions** for actions so TypeScript narrows payload types automatically.
- `default` case should return `state` unchanged.

---

## Schema Validation – Zod

Zod validates data at runtime while inferring TypeScript types automatically.

```bash
npm install zod
```

### Defining Schemas

```tsx
import { z } from 'zod';

const UserSchema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters'),
  email:    z.string().email('Invalid email'),
  age:      z.number().int().min(18, 'Must be 18+').optional(),
  role:     z.enum(['admin', 'user', 'guest']),
  password: z.string()
              .min(8)
              .regex(/[A-Z]/, 'Must contain an uppercase letter')
              .regex(/[0-9]/, 'Must contain a number'),
});

// Derive the TypeScript type — single source of truth
type User = z.infer<typeof UserSchema>;
```

### Parsing & Error Handling

```tsx
// safeParse — preferred (doesn't throw)
const result = UserSchema.safeParse(formData);

if (!result.success) {
  // result.error.flatten() gives field-level messages
  const errors = result.error.flatten().fieldErrors;
  // errors.name → ['Name must be at least 2 characters']
  console.log(errors);
} else {
  const user = result.data; // fully typed as User
}
```

### Form Validation with Reducer

```tsx
const FormSchema = z.object({
  username: z.string().min(3),
  email:    z.string().email(),
});

type FormData   = z.infer<typeof FormSchema>;
type FormErrors = Partial<Record<keyof FormData, string[]>>;

interface FormState {
  data:    FormData;
  errors:  FormErrors;
  isValid: boolean;
}

type FormAction =
  | { type: 'SET_FIELD'; field: keyof FormData; value: string }
  | { type: 'VALIDATE' }
  | { type: 'RESET' };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD': {
      const data = { ...state.data, [action.field]: action.value };
      return { ...state, data };
    }
    case 'VALIDATE': {
      const result = FormSchema.safeParse(state.data);
      return result.success
        ? { ...state, errors: {}, isValid: true }
        : { ...state, errors: result.error.flatten().fieldErrors, isValid: false };
    }
    case 'RESET':
      return { data: { username: '', email: '' }, errors: {}, isValid: false };
    default:
      return state;
  }
}
```

---

## Effects on State

`useEffect` can be used as a **reaction** to state changes — useful for side effects like syncing, logging, or triggering derived operations.

```tsx
// Auto-save when form data changes
useEffect(() => {
  if (!state.isValid) return;
  const timer = setTimeout(() => {
    localStorage.setItem('draft', JSON.stringify(state.data));
  }, 500); // debounce
  return () => clearTimeout(timer);
}, [state.data, state.isValid]);
```

**Pattern:** Effects that respond to state = reactive side-effects. Keep them focused on one task.

---

## LocalStorage & SessionStorage

| | `localStorage` | `sessionStorage` |
| :-- | :--------------- | :----------------- |
| Persists after tab close | ✅ Yes | ❌ No |
| Shared across tabs | ✅ Yes | ❌ No |
| Capacity | ~5 MB | ~5 MB |
| Synchronous | ✅ Yes | ✅ Yes |

### useLocalStorage Custom Hook

```tsx
// hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error('LocalStorage write failed:', err);
    }
  }, [key, value]);

  const remove = () => {
    localStorage.removeItem(key);
    setValue(initialValue);
  };

  return [value, setValue, remove] as const;
}
```

```tsx
// Usage
const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
```

### Connecting useLocalStorage with useReducer

```tsx
function usePersistedReducer<S, A>(
  reducer: (state: S, action: A) => S,
  initialState: S,
  key: string,
) {
  const [persisted, setPersisted] = useLocalStorage<S>(key, initialState);
  const [state, dispatch] = useReducer(reducer, persisted);

  // Sync reducer state → localStorage
  useEffect(() => {
    setPersisted(state);
  }, [state]);

  return [state, dispatch] as const;
}
```

---

## Reducer Conditions

Use helper functions and guards to keep the reducer readable.

```tsx
// Guard: only update if qty is valid
case 'UPDATE_QTY': {
  const { id, qty } = action.payload;
  if (qty < 1) return state; // guard condition
  return {
    ...state,
    items: state.items.map(i => i.id === id ? { ...i, qty } : i),
  };
}

// Computed derived values inside the reducer
case 'ADD_ITEM': {
  const newItems = [...state.items, { ...action.payload, qty: 1 }];
  const total    = newItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  return { ...state, items: newItems, total }; // store derived total
}
```

**Best Practice:** If a condition makes the reducer branch complex, extract a helper:

```tsx
function mergeOrAppend(items: CartItem[], newItem: Omit<CartItem, 'qty'>): CartItem[] {
  const idx = items.findIndex(i => i.id === newItem.id);
  if (idx !== -1) {
    return items.map((i, n) => n === idx ? { ...i, qty: i.qty + 1 } : i);
  }
  return [...items, { ...newItem, qty: 1 }];
}
```

---

## shadcn/ui

shadcn/ui is a collection of accessible, copy-paste components built on Radix UI + Tailwind CSS.

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input form toast
```

### Usage Pattern

```tsx
// shadcn components live in your project (not in node_modules)
import { Button }   from '@/components/ui/button';
import { Input }    from '@/components/ui/input';
import {
  Form, FormField, FormItem, FormLabel,
  FormControl, FormMessage,
} from '@/components/ui/form';
```

### Form Example (shadcn + Zod)

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email(),
  name:  z.string().min(2),
});

type FormData = z.infer<typeof schema>;

const MyForm: React.FC = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', name: '' },
  });

  const onSubmit = (data: FormData) => {
    console.log('Valid data:', data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage /> {/* shows Zod error */}
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
```

---

## Sonner – Toast Notifications

Sonner is a lightweight, beautiful toast library.

```bash
npm install sonner
```

```tsx
// main.tsx / App.tsx — add the Toaster once at the root
import { Toaster } from 'sonner';

<Toaster position="top-right" richColors />
```

```tsx
// Anywhere in your app
import { toast } from 'sonner';

// Variants
toast.success('Profile saved!');
toast.error('Something went wrong.');
toast.warning('Check your input.');
toast.info('New version available.');
toast.loading('Saving…');

// Promise toast — auto-resolves based on promise state
toast.promise(saveUser(data), {
  loading: 'Saving user…',
  success: 'User saved!',
  error:   'Failed to save user.',
});

// With action button
toast('Cart updated', {
  action: {
    label: 'Undo',
    onClick: () => dispatch({ type: 'UNDO' }),
  },
});
```

### Integrating Sonner with Reducer

```tsx
// Dispatch + notify in one place
const addItem = (item: CartItem) => {
  dispatch({ type: 'ADD_ITEM', payload: item });
  toast.success(`${item.name} added to cart`);
};

const clearCart = () => {
  dispatch({ type: 'CLEAR_CART' });
  toast('Cart cleared', {
    action: { label: 'Undo', onClick: () => dispatch({ type: 'RESTORE_CART' }) },
  });
};
```

---

## Common Pitfalls

| Mistake | Fix |
| :--------- | :----- |
| Mutating state in reducer | Always spread: `{ ...state, field: value }` |
| Forgetting `default` case | Always return `state` in default |
| Storing non-serialisable values in localStorage | Store only JSON-safe data |
| Calling `toast` inside reducer | Reducers are pure; call `toast` in event handlers or effects |
| Zod `parse` (throws) in render | Use `safeParse` and handle errors gracefully |
