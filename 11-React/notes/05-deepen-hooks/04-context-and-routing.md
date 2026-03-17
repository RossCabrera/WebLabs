# 04. Context, Routing & Application Architecture

> **Goal:** Share state globally with Context, persist user sessions, and structure navigation with React Router including protected routes.

---

## Table of Contents

1. [useContext](#usecontext)
2. [New `use` API with Context](#new-use-api-with-context)
3. [User Session Persistence](#user-session-persistence)
4. [React Router – Setup & Basics](#react-router--setup--basics)
5. [Application Routing Patterns](#application-routing-patterns)
6. [Private & Public Routes](#private--public-routes)
7. [Conditional Rendering](#conditional-rendering)

---

## useContext

Context lets you pass data to any component in the tree **without prop drilling**.

### Creating and Consuming Context

```tsx
// contexts/ThemeContext.tsx
import { createContext, useContext, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme:     Theme;
  toggleTheme: () => void;
}

// 1. Create context (undefined default signals "must be inside provider")
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 2. Custom hook — encapsulates the null check
export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}

// 3. Provider
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

```tsx
// App.tsx — wrap the tree
<ThemeProvider>
  <App />
</ThemeProvider>

// Any deeply nested component
const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className={theme}>
      <button onClick={toggleTheme}>Toggle</button>
    </header>
  );
};
```

### Context Does Not Replace State

Context is a **transport mechanism**, not a state manager. State still lives in `useState` / `useReducer` inside the Provider.

---

## New `use` API with Context

React 19's `use` can consume Context like `useContext`, but can be called **conditionally**.

```tsx
import { use } from 'react';

// ✅ Works like useContext but allows conditional usage
const MyComponent: React.FC<{ show: boolean }> = ({ show }) => {
  if (!show) return null;
  const { theme } = use(ThemeContext); // called conditionally — valid!
  return <div className={theme}>Hello</div>;
};
```

---

## User Session Persistence

Full auth context that persists the session to `localStorage`.

```tsx
// contexts/AuthContext.tsx
import { createContext, use, useState, useEffect, type ReactNode } from 'react';

interface User {
  id:    string;
  name:  string;
  email: string;
  role:  'admin' | 'user';
}

interface AuthContextType {
  user:     User | null;
  isLoading: boolean;
  login:    (email: string, password: string) => Promise<void>;
  logout:   () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser]         = useState<User | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);

  // Rehydrate session on mount
  useEffect(() => {
    const stored = localStorage.getItem('session');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('session');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Invalid credentials');

      const loggedInUser: User = await response.json();
      setUser(loggedInUser);
      localStorage.setItem('session', JSON.stringify(loggedInUser));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('session');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      logout,
      isAuthenticated: user !== null,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = use(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside <AuthProvider>');
  return ctx;
};
```

---

## React Router – Setup & Basics

```bash
npm install react-router-dom
```

### Project Structure

```text
src/
├── routes/
│   ├── AppRouter.tsx        ← All route definitions
│   ├── PrivateRoute.tsx     ← Auth guard
│   └── PublicRoute.tsx      ← Redirect if already logged in
├── pages/
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   └── NotFoundPage.tsx
└── main.tsx
```

### Basic Router Setup

```tsx
// main.tsx
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
```

### Core Hooks

```tsx
import {
  useNavigate,   // programmatic navigation
  useParams,     // URL params (:id)
  useLocation,   // current location object
  useSearchParams, // query string (?q=...)
} from 'react-router-dom';

// Examples
const navigate = useNavigate();
navigate('/dashboard');          // go to route
navigate(-1);                    // go back
navigate('/login', { replace: true }); // replace history entry

const { id } = useParams<{ id: string }>();

const location = useLocation();
console.log(location.pathname); // '/dashboard'

const [params, setParams] = useSearchParams();
const query = params.get('q') ?? '';
```

---

## Application Routing Patterns

### Flat Routes (simple apps)

```tsx
// routes/AppRouter.tsx
import { Routes, Route, Navigate } from 'react-router-dom';

const AppRouter: React.FC = () => (
  <Routes>
    <Route path="/"          element={<HomePage />} />
    <Route path="/login"     element={<LoginPage />} />
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/users/:id" element={<UserPage />} />
    <Route path="*"          element={<NotFoundPage />} />
  </Routes>
);
```

### Nested Routes (layouts)

```tsx
// Layout wraps multiple pages with shared chrome (nav, sidebar)
const AppRouter: React.FC = () => (
  <Routes>
    {/* Public layout */}
    <Route element={<PublicLayout />}>
      <Route path="/"      element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
    </Route>

    {/* Protected layout */}
    <Route element={<PrivateRoute />}>
      <Route element={<AppLayout />}>
        <Route path="/dashboard"        element={<DashboardPage />} />
        <Route path="/settings"         element={<SettingsPage />} />
        <Route path="/users/:id"        element={<UserPage />} />
        <Route path="/admin" element={<AdminRoute />}>  {/* role guard */}
          <Route path="users"   element={<AdminUsers />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>
      </Route>
    </Route>

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

// Layout uses <Outlet> as a slot for child routes
const AppLayout: React.FC = () => (
  <div className="app">
    <Sidebar />
    <main>
      <Outlet /> {/* child page renders here */}
    </main>
  </div>
);
```

---

## Private & Public Routes

### PrivateRoute – Require Authentication

```tsx
// routes/PrivateRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show spinner while session is being rehydrated
  if (isLoading) return <div>Loading…</div>;

  // Not authenticated → redirect to login, preserve intended destination
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated → render child routes
  return <Outlet />;
};

export default PrivateRoute;
```

### PublicRoute – Redirect if Already Logged In

```tsx
// routes/PublicRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Prevents logged-in users from hitting /login again
const PublicRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading…</div>;

  return isAuthenticated
    ? <Navigate to="/dashboard" replace />
    : <Outlet />;
};
```

### RoleRoute – Require a Specific Role

```tsx
interface RoleRouteProps {
  allowedRoles: string[];
}

const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
```

### Login with Redirect Back

```tsx
const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  // Redirect to the page they originally tried to visit
  const from = (location.state as { from?: Location })?.from?.pathname ?? '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch {
      toast.error('Login failed');
    }
  };

  return <form onSubmit={handleSubmit}>…</form>;
};
```

---

## Conditional Rendering

React renders JSX conditionally using standard JavaScript expressions.

### Patterns

```tsx
// 1. && short-circuit — renders nothing (no empty element) when false
{isAuthenticated && <UserMenu />}

// 2. Ternary — show one of two things
{isLoading ? <Spinner /> : <Content />}

// 3. Early return — cleanest for multiple states
if (isLoading) return <Spinner />;
if (error)     return <ErrorMessage error={error} />;
return <Content data={data} />;

// 4. Object map — cleaner than long ternary chains
const STATUS_COMPONENT = {
  idle:    <p>Ready</p>,
  loading: <Spinner />,
  error:   <ErrorMessage />,
  success: <SuccessMessage />,
} as const;

return STATUS_COMPONENT[status];
```

### Conditional Class Names

```tsx
// clsx / classnames library
import clsx from 'clsx';

<button
  className={clsx(
    'btn',
    { 'btn--active': isActive },
    { 'btn--disabled': isDisabled },
    variant === 'primary' && 'btn--primary',
  )}
>
  Click
</button>
```

### Auth-Aware Navigation

```tsx
const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav>
      <Link to="/">Home</Link>

      {isAuthenticated ? (
        <>
          <Link to="/dashboard">Dashboard</Link>
          {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </>
      )}
    </nav>
  );
};
```

---

## Architecture Summary

```text
main.tsx
└── BrowserRouter
    └── AuthProvider          ← session state lives here
        └── AppRouter
            ├── PublicRoute   ← redirects if already logged in
            │   ├── /         HomePage
            │   └── /login    LoginPage
            └── PrivateRoute  ← redirects to /login if not authenticated
                └── AppLayout (Outlet)
                    ├── /dashboard   DashboardPage
                    ├── /settings    SettingsPage
                    └── /admin       RoleRoute (admin only)
                        ├── users    AdminUsers
                        └── reports  AdminReports
```

### Best Practices

- **One Router per app** — place `<BrowserRouter>` at the very top.
- **Keep route definitions in one file** (`AppRouter.tsx`) for easy overview.
- **Lazy-load heavy pages** with `React.lazy` + `<Suspense>` to reduce initial bundle.
- **Never store sensitive data in localStorage** — use `httpOnly` cookies for tokens when possible.
- **Derive `isAuthenticated`** from `user !== null` instead of storing a boolean separately.
- **Preserve the `from` location** when redirecting to login so users return to where they intended.
