# 🧰 Testing Library + Component Mocking

## What is Testing Library?

**@testing-library/react** lets you test React components by interacting with them **the way a real user would**: finding elements by text, roles, and labels; clicking, typing, etc.

> Philosophy: _"The more your tests resemble how the software is used, the more confidence they give you."_

```text
❌ Don't select by CSS class or internal structure
✅ Select by visible text, roles, and labels (as a user would)
```

---

## Installation

```bash
npm install -D @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

```ts
// src/setupTests.ts
import '@testing-library/jest-dom';
// Adds matchers like: toBeInTheDocument, toHaveValue, toBeDisabled, etc.
```

---

## Core Functions

### `render` — Render the component

```tsx
import { render } from '@testing-library/react';
import MyComponent from './MyComponent';

test('renders the component', () => {
  const { container, unmount, rerender } = render(<MyComponent />);
  // container → the root DOM element
  // unmount   → unmounts the component
  // rerender  → re-renders with new props
});
```

### `screen` — Access the rendered DOM

```tsx
import { render, screen } from '@testing-library/react';

render(<button>Submit</button>);

// Available queries on screen:
screen.getByText('Submit')             // by visible text
screen.getByRole('button')             // by ARIA role
screen.getByLabelText('Email')         // by input label
screen.getByPlaceholderText('...')     // by placeholder
screen.getByTestId('submit-btn')       // by data-testid (last resort)
screen.getByTitle('Close')             // by title attribute
screen.getByAltText('Logo')            // by image alt text
```

---

## Query Variants

| Prefix | Not found | Multiple | Use |
| --------- | :---: | :---: | ----- |
| `getBy` | ❌ throws | ❌ throws | When the element MUST exist |
| `queryBy` | returns null | ❌ throws | Verify something does NOT exist |
| `findBy` | ❌ throws (async) | ❌ throws | Async elements |
| `getAllBy` | ❌ throws | ✅ returns array | Multiple elements |
| `queryAllBy` | returns [] | ✅ returns array | Multiple optional |
| `findAllBy` | ❌ throws (async) | ✅ returns array | Multiple async |

```tsx
// getBy → for elements that must be there
const button = screen.getByRole('button', { name: /submit/i });

// queryBy → to verify absence
expect(screen.queryByText('Error')).not.toBeInTheDocument();

// findBy → for elements that appear after an async action
const message = await screen.findByText('Saved!');
```

---

## `userEvent` — Simulate User Interactions

```tsx
import userEvent from '@testing-library/user-event';

// Always set up userEvent with setup() in each test
const user = userEvent.setup();

// Available actions
await user.click(element);
await user.dblClick(element);
await user.type(input, 'text');
await user.clear(input);
await user.selectOptions(select, 'option');
await user.keyboard('{Enter}');
await user.keyboard('{Tab}');
await user.hover(element);
await user.unhover(element);
await user.upload(fileInput, file);
```

---

## jest-dom Matchers

```tsx
expect(element).toBeInTheDocument()       // exists in the DOM
expect(element).not.toBeInTheDocument()   // does not exist

expect(element).toBeVisible()             // visible to the user
expect(element).toBeDisabled()            // has disabled attribute
expect(element).toBeEnabled()

expect(input).toHaveValue('text')         // input value
expect(input).toHaveDisplayValue('option')
expect(checkbox).toBeChecked()

expect(element).toHaveTextContent('Hello')
expect(element).toHaveAttribute('href', '/home')
expect(element).toHaveClass('active')

expect(element).toHaveFocus()
expect(form).toBeValid()
expect(form).toBeInvalid()
```

---

## Full Example: Login Form

```tsx
// src/components/LoginForm.tsx
import { useState } from 'react';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
}

function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('All fields are required');
      return;
    }
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />

      <label htmlFor="password">Password</label>
      <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />

      {error && <p role="alert">{error}</p>}

      <button type="submit">Log In</button>
    </form>
  );
}

export default LoginForm;
```

```tsx
// src/components/LoginForm.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
  test('renders email and password fields', () => {
    render(<LoginForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  test('calls onSubmit with email and password on submit', async () => {
    // Arrange
    const user = userEvent.setup();
    const mockSubmit = vi.fn();
    render(<LoginForm onSubmit={mockSubmit} />);

    // Act
    await user.type(screen.getByLabelText('Email'), 'ana@mail.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    // Assert
    expect(mockSubmit).toHaveBeenCalledWith('ana@mail.com', 'password123');
    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });

  test('shows error if fields are empty', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('All fields are required');
  });

  test('does not call onSubmit if fields are empty', async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();
    render(<LoginForm onSubmit={mockSubmit} />);

    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(mockSubmit).not.toHaveBeenCalled();
  });
});
```

---

## Component Mocking

Sometimes you want to test a parent component without its children complicating the test.

```tsx
// src/components/Dashboard.tsx
import UserProfile from './UserProfile';
import StatsChart from './StatsChart';   // heavy component with D3

function Dashboard({ userId }: { userId: number }) {
  return (
    <div>
      <h1>Dashboard</h1>
      <UserProfile userId={userId} />
      <StatsChart />
    </div>
  );
}
```

```tsx
// src/components/Dashboard.test.tsx
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

// Mock child components
vi.mock('./UserProfile', () => ({
  default: ({ userId }: { userId: number }) => (
    <div data-testid="user-profile-mock">UserProfile mock (id: {userId})</div>
  ),
}));

vi.mock('./StatsChart', () => ({
  default: () => <div data-testid="stats-chart-mock">StatsChart mock</div>,
}));

test('Dashboard renders title and child components', () => {
  render(<Dashboard userId={42} />);

  expect(screen.getByText('Dashboard')).toBeInTheDocument();
  expect(screen.getByTestId('user-profile-mock')).toBeInTheDocument();
  expect(screen.getByText('UserProfile mock (id: 42)')).toBeInTheDocument();
  expect(screen.getByTestId('stats-chart-mock')).toBeInTheDocument();
});
```

---

## Async Example: Component That Loads Data

```tsx
// src/components/UserList.tsx
import { useState, useEffect } from 'react';
import { fetchUsers } from '../services/userService';

function UserList() {
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers().then(data => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}
```

```tsx
// src/components/UserList.test.tsx
import { render, screen } from '@testing-library/react';
import UserList from './UserList';
import { fetchUsers } from '../services/userService';

vi.mock('../services/userService');

test('shows user list after loading', async () => {
  // Arrange
  vi.mocked(fetchUsers).mockResolvedValue([
    { id: 1, name: 'Ana Garcia' },
    { id: 2, name: 'Carlos Lopez' },
  ]);

  // Act
  render(<UserList />);

  // First shows loading
  expect(screen.getByText('Loading...')).toBeInTheDocument();

  // Wait for users to appear
  expect(await screen.findByText('Ana Garcia')).toBeInTheDocument();
  expect(screen.getByText('Carlos Lopez')).toBeInTheDocument();

  // Loading should no longer be present
  expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
});
```

---

## Common ARIA Roles (for `getByRole`)

| HTML element | Role |
| :--------------- | :------ |
| `<button>` | `button` |
| `<a href>` | `link` |
| `<input type="text">` | `textbox` |
| `<input type="checkbox">` | `checkbox` |
| `<input type="radio">` | `radio` |
| `<select>` | `combobox` |
| `<h1>` - `<h6>` | `heading` |
| `<img>` | `img` |
| `<ul>`, `<ol>` | `list` |
| `<li>` | `listitem` |
| `<nav>` | `navigation` |
| `<p role="alert">` | `alert` |
| `<dialog>` | `dialog` |

```tsx
// Useful getByRole options
screen.getByRole('button', { name: /submit/i })   // by name (text/aria-label)
screen.getByRole('heading', { level: 2 })          // specifically h2
screen.getByRole('checkbox', { checked: true })    // checked checkbox
```
