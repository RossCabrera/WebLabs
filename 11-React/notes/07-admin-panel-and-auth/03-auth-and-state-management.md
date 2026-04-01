# 03 – Authentication & State Management

> **Goal:** Replace ad-hoc Context + `useState` session management with Zustand for cleaner global auth state, integrate it with TanStack Query, and establish JWT-based authentication with proper route protection.

> **Prior art:** `PrivateRoute`, `RoleRoute`, `useContext` auth patterns, and basic route guards are covered in `05/04-context-and-routing.md`. This note builds on top of those patterns using Zustand instead of Context.

---

## Table of Contents

1. [Why Zustand over Context for Auth](#why-zustand-over-context-for-auth)
2. [Zustand Fundamentals](#zustand-fundamentals)
3. [Auth Store with Zustand](#auth-store-with-zustand)
4. [JWT Fundamentals](#jwt-fundamentals)
5. [Session Persistence](#session-persistence)
6. [TanStack Query + Zustand Integration](#tanstack-query--zustand-integration)
7. [Authentication vs Authorization](#authentication-vs-authorization)
8. [Route Protection & Authorization](#route-protection--authorization)

---

## Why Zustand over Context for Auth

| Concern | Context + useState | Zustand |
| :--- | :--- | :--- |
| Boilerplate | Provider + context + hook per slice | One `create()` call |
| Re-renders | Every consumer re-renders on any state change | Per-selector subscriptions — only re-render what changed |
| Access outside React | Impossible | `useAuthStore.getState()` anywhere |
| DevTools | None built-in | Zustand devtools middleware |
| Persistence | Manual `localStorage` + `useEffect` | `persist` middleware (one line) |

For **global, frequently-read state** (auth, theme, cart) Zustand is a better fit than Context.

---

## Zustand Fundamentals

```bash
npm install zustand
```

```ts
import { create } from 'zustand';

// 1. Define state + actions in one interface
interface CounterStore {
  count:     number;
  increment: () => void;
  decrement: () => void;
  reset:     () => void;
}

// 2. Create the store
const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
  decrement: () => set(state => ({ count: state.count - 1 })),
  reset:     () => set({ count: 0 }),
}));

// 3. Use in any component — no Provider needed
const Counter: React.FC = () => {
  // Subscribe to only what you need — other components won't re-render
  const count     = useCounterStore(s => s.count);
  const increment = useCounterStore(s => s.increment);

  return <button onClick={increment}>{count}</button>;
};
```

### Selectors — Avoid Unnecessary Re-renders

```ts
// ❌ Subscribes to the whole store — re-renders on ANY change
const store = useCounterStore();

// ✅ Subscribes only to count — re-renders only when count changes
const count = useCounterStore(s => s.count);

// ✅ Multiple values — use shallow for object stability
import { useShallow } from 'zustand/react/shallow';
const { count, increment } = useCounterStore(
  useShallow(s => ({ count: s.count, increment: s.increment }))
);
```

### Accessing State Outside React

```ts
// Useful inside axios interceptors, TanStack query functions, etc.
const token = useAuthStore.getState().token;
const logout = useAuthStore.getState().logout;
```

---

## Auth Store with Zustand

```ts
// store/authStore.ts
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

interface User {
  id:    string;
  name:  string;
  email: string;
  roles: string[];
}

interface AuthStore {
  token:  string | null;
  user:   User  | null;

  // Actions
  setAuth:  (token: string, user: User) => void;
  logout:   () => void;

  // Derived (computed inline)
  isAuthenticated: () => boolean;
  hasRole:         (role: string) => boolean;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        token: null,
        user:  null,

        setAuth: (token, user) => set({ token, user }),

        logout: () => set({ token: null, user: null }),

        isAuthenticated: () => get().token !== null,

        hasRole: (role) => get().user?.roles.includes(role) ?? false,
      }),
      {
        name: 'auth-storage',          // localStorage key
        partialize: state => ({        // only persist token + user, not actions
          token: state.token,
          user:  state.user,
        }),
      }
    ),
    { name: 'Auth Store' }              // devtools label
  )
);
```

### Using the Store

```tsx
// Any component — no Provider wrapping required
const Navbar: React.FC = () => {
  const user   = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);

  return (
    <nav>
      {user && <span>Hello, {user.name}</span>}
      <button onClick={logout}>Logout</button>
    </nav>
  );
};
```

---

## JWT Fundamentals

A **JSON Web Token** is a compact, signed credential made of three Base64-encoded parts:

```
HEADER.PAYLOAD.SIGNATURE

eyJhbGciOiJIUzI1NiJ9   ←  header:    algorithm + type
.eyJ1c2VySWQiOiIxMjMifQ  ←  payload:   claims (user data)
.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c   ← signature
```

### Payload Claims

```json
{
  "sub":   "user_id_123",
  "name":  "Ross Cabrera",
  "roles": ["admin"],
  "iat":   1712000000,   // issued at (Unix timestamp)
  "exp":   1712086400    // expires at (24h later)
}
```

### Key Properties

| Property | Detail |
| :---- | :---- |
| **Stateless** | Server doesn't store sessions — all info is in the token |
| **Self-contained** | Payload holds user info — no extra DB lookup needed |
| **Signed, not encrypted** | Payload is readable by anyone (Base64) — never put secrets in it |
| **Expiry** | Short-lived access tokens (15 min – 1 h) + refresh tokens (7–30 d) |

### Decoding on the Client

```ts
// utils/jwt.ts
export function decodeToken(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded || typeof decoded.exp !== 'number') return true;
  return decoded.exp * 1000 < Date.now();  // exp is in seconds
}
```

> ⚠️ **Never trust the client-decoded token for security decisions.** Always verify on the server. Client-side decoding is only for UX (display name, role-based UI).

---

## Session Persistence

With the `persist` middleware (shown above), Zustand handles `localStorage` automatically. But you still need to handle the token on HTTP requests.

### Axios Interceptor — Attach Token to Every Request

```ts
// lib/api.ts
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor — inject token
api.interceptors.request.use(config => {
  const token = useAuthStore.getState().token;   // outside React — use getState()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();   // clear store
      window.location.href = '/login';    // force redirect
    }
    return Promise.reject(error);
  }
);
```

### Login Flow

```ts
// store/authStore.ts — add login action
login: async (email: string, password: string) => {
  const { data } = await api.post('/auth/login', { email, password });
  // data = { token: '...', user: { id, name, email, roles } }
  get().setAuth(data.token, data.user);
},
```

```tsx
// LoginPage.tsx
const LoginPage: React.FC = () => {
  const login    = useAuthStore(s => s.login);
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname ?? '/admin';

  const handleSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      navigate(from, { replace: true });
    } catch {
      toast.error('Invalid credentials');
    }
  };

  return <LoginForm onSubmit={handleSubmit} />;
};
```

---

## TanStack Query + Zustand Integration

TanStack Query manages **server state** (remote data). Zustand manages **client state** (auth, UI preferences). They complement each other.

### Pattern: Token-Dependent Queries

```ts
// hooks/useCurrentUser.ts
import { useQuery }     from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { api }          from '@/lib/api';

export function useCurrentUser() {
  const token = useAuthStore(s => s.token);

  return useQuery({
    queryKey: ['me'],
    queryFn:  () => api.get('/auth/me').then(r => r.data),
    enabled:  !!token,           // only fetch when authenticated
    staleTime: 1000 * 60 * 10,  // user profile rarely changes
  });
}
```

### Pattern: Invalidate on Logout

```ts
// store/authStore.ts
import { QueryClient } from '@tanstack/react-query';

// Pass queryClient in from outside, or access via a global ref
logout: (queryClient?: QueryClient) => {
  set({ token: null, user: null });
  queryClient?.clear();   // wipe all cached server data on logout
},
```

```tsx
// In a component where queryClient is available via useQueryClient()
const queryClient = useQueryClient();
const logout = useAuthStore(s => s.logout);

<button onClick={() => logout(queryClient)}>Log out</button>
```

---

## Authentication vs Authorization

| Concept | Question answered | Example |
| :--- | :--- | :--- |
| **Authentication** | *Who are you?* | Login with email + password → receive JWT |
| **Authorization** | *What are you allowed to do?* | Only `admin` role can access `/admin/*` |

### In Practice

- **Authentication** is handled by the login form + token storage.
- **Authorization** is enforced by route guards (`PrivateRoute`, `RoleRoute`) and server-side middleware.

> ⚠️ Client-side route guards are UX only. The backend **must** also enforce authorization on every endpoint.

---

## Route Protection & Authorization

These build directly on the patterns from `05/04-context-and-routing.md`, now reading from Zustand instead of Context.

### PrivateRoute — Require Authentication

```tsx
// routes/PrivateRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export const PrivateRoute: React.FC = () => {
  const token    = useAuthStore(s => s.token);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
```

### RoleRoute — Require a Specific Role

```tsx
// routes/RoleRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface RoleRouteProps {
  allowedRoles: string[];
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles }) => {
  const user = useAuthStore(s => s.user);

  const hasAccess = user?.roles.some(r => allowedRoles.includes(r)) ?? false;

  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
```

### Composing Guards in the Router

```tsx
// routes/AppRouter.tsx
<Routes>
  <Route path="/login" element={<LoginPage />} />

  {/* Step 1: must be logged in */}
  <Route element={<PrivateRoute />}>

    {/* Step 2: must have admin role */}
    <Route element={<RoleRoute allowedRoles={['admin']} />}>
      <Route element={<AdminLayout />}>
        <Route path="/admin"          element={<DashboardPage />} />
        <Route path="/admin/products" element={<ProductsPage />} />
      </Route>
    </Route>

  </Route>

  <Route path="/unauthorized" element={<UnauthorizedPage />} />
  <Route path="*" element={<NotFoundPage />} />
</Routes>
```

### Auth-Aware Navigation in the Sidebar

```tsx
const Sidebar: React.FC = () => {
  const hasRole = useAuthStore(s => s.hasRole);

  return (
    <nav>
      <NavLink to="/admin">Dashboard</NavLink>
      <NavLink to="/admin/products">Products</NavLink>
      {/* Only visible to super-admins */}
      {hasRole('superadmin') && <NavLink to="/admin/users">Users</NavLink>}
    </nav>
  );
};
```
