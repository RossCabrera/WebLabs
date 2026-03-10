# 🔄 State Management + Component Communication

## Communication Patterns

```text
Parent → Child        props
Child → Parent        callbacks (functions as props)
Siblings              lift state to common parent
Distant components    Context API / Zustand / Redux
```

---

## 1. Parent → Child (Props)

```tsx
// Parent passes data to child via props
function Parent() {
  const [user] = useState({ name: 'Ana', role: 'admin' });
  return <UserCard user={user} />;
}

interface UserCardProps {
  user: { name: string; role: string };
}

function UserCard({ user }: UserCardProps) {
  return <p>{user.name} — {user.role}</p>;
}
```

---

## 2. Child → Parent (Callbacks)

```tsx
// Child notifies parent via a function received as a prop
function Parent() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <div>
      <ItemList onSelect={setSelectedId} />
      {selectedId && <p>Selected: {selectedId}</p>}
    </div>
  );
}

interface ItemListProps {
  onSelect: (id: number) => void;
}

function ItemList({ onSelect }: ItemListProps) {
  const items = [{ id: 1, name: 'Item A' }, { id: 2, name: 'Item B' }];
  return (
    <ul>
      {items.map(item => (
        <li key={item.id} onClick={() => onSelect(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
}
```

---

## 3. Lifting State Up

When two siblings need to share state, lift it to the common parent:

```tsx
// ❌ State in each child (they can't communicate)
function FilterInput() {
  const [filter, setFilter] = useState(''); // only FilterInput knows this
}
function ProductList() {
  // knows nothing about the filter
}

// ✅ State lifted to parent
function ProductPage() {
  const [filter, setFilter] = useState('');  // shared state

  return (
    <>
      <FilterInput value={filter} onChange={setFilter} />
      <ProductList filter={filter} />
    </>
  );
}

interface FilterInputProps {
  value: string;
  onChange: (val: string) => void;
}

function FilterInput({ value, onChange }: FilterInputProps) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Filter..."
    />
  );
}

interface ProductListProps {
  filter: string;
}

function ProductList({ filter }: ProductListProps) {
  const products = ['Laptop', 'Mouse', 'Keyboard', 'Monitor'];
  const filtered = products.filter(p =>
    p.toLowerCase().includes(filter.toLowerCase())
  );

  return <ul>{filtered.map(p => <li key={p}>{p}</li>)}</ul>;
}
```

---

## 4. useReducer — For Complex State

When `useState` gets complicated with many related variables:

```tsx
// src/hooks/useCartReducer.ts
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

type CartAction =
  | { type: 'ADD_ITEM';    payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: number }   // item id
  | { type: 'UPDATE_QTY';  payload: { id: number; qty: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' };

const initialState: CartState = { items: [], isOpen: false };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const exists = state.items.find(i => i.id === action.payload.id);
      if (exists) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) };
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
      return state;
  }
}

// Usage in component
import { useReducer } from 'react';

function ShoppingCart() {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const total = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div>
      <button onClick={() => dispatch({ type: 'TOGGLE_CART' })}>
        🛒 ({state.items.length})
      </button>
      {state.isOpen && (
        <div>
          {state.items.map(item => (
            <div key={item.id}>
              <span>{item.name} × {item.qty}</span>
              <button onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}>
                ❌
              </button>
            </div>
          ))}
          <p>Total: ${total.toFixed(2)}</p>
          <button onClick={() => dispatch({ type: 'CLEAR_CART' })}>
            Clear cart
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## 5. Context API — Global State Without Libraries

For state needed by many components (theme, authenticated user, language):

```tsx
// src/context/AuthContext.tsx
import { createContext, useContext, useState, type ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login:  (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// 1. Create the context
const AuthContext = createContext<AuthContextType | null>(null);

// 2. Create the Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login  = (user: User) => setUser(user);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Custom hook to consume the context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
```

```tsx
// src/main.tsx — wrap the app with the Provider
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);

// In any deeply nested component:
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav>
      {isAuthenticated ? (
        <>
          <span>Hello, {user!.name}</span>
          <button onClick={logout}>Sign out</button>
        </>
      ) : (
        <a href="/login">Sign in</a>
      )}
    </nav>
  );
}
```

---

## 6. Zustand — Simple and Modern Global State

```bash
npm install zustand
```

```ts
// src/store/useCartStore.ts
import { create } from 'zustand';

interface CartItem { id: number; name: string; price: number; qty: number; }

interface CartStore {
  items: CartItem[];
  addItem:    (item: CartItem) => void;
  removeItem: (id: number)    => void;
  clearCart:  ()              => void;
  total:      ()              => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (item) => set(state => {
    const exists = state.items.find(i => i.id === item.id);
    if (exists) {
      return { items: state.items.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i) };
    }
    return { items: [...state.items, item] };
  }),

  removeItem: (id) => set(state => ({
    items: state.items.filter(i => i.id !== id),
  })),

  clearCart: () => set({ items: [] }),

  total: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
}));

// Usage in any component (no Provider needed!)
function CartIcon() {
  const items = useCartStore(state => state.items);
  return <span>🛒 {items.length}</span>;
}

function ProductCard({ product }: { product: CartItem }) {
  const addItem = useCartStore(state => state.addItem);
  return <button onClick={() => addItem(product)}>Add to cart</button>;
}
```

---

## When to Use Each Option

| Situation | Solution |
| :----------- | :---------- |
| Simple local state | `useState` |
| Complex state with many actions | `useReducer` |
| Sharing between 2-3 nearby components | Lift state |
| Global state (theme, auth, language) | `Context API` |
| Complex global state with performance needs | `Zustand` / `Redux Toolkit` |
| Server state (API data) | `React Query` / `SWR` |
