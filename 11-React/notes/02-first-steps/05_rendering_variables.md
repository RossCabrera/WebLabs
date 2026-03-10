# 🖨️ Rendering Variables in JSX

## JSX and Curly Braces `{}`

In JSX, everything inside `{}` is **pure JavaScript**.

```tsx
const name = 'Ana';
const age = 25;

return <h1>Hello {name}, you are {age} years old</h1>;
// Result: Hello Ana, you are 25 years old
```

---

## Types That Can Be Rendered

```tsx
// ✅ String
const title = 'My App';
<h1>{title}</h1>

// ✅ Number
const price = 99.9;
<p>{price}</p>

// ✅ JS Expressions
<p>{2 + 2}</p>                        // 4
<p>{name.toUpperCase()}</p>           // ANA
<p>{price.toFixed(2)}</p>             // 99.90
<p>{`Price: $${price}`}</p>           // Price: $99.9

// ✅ Arrays of JSX
const items = ['Apple', 'Pear', 'Grape'];
<ul>{items.map((item, i) => <li key={i}>{item}</li>)}</ul>

// ✅ Ternary (conditional)
<span>{isAdmin ? 'Admin' : 'User'}</span>

// ✅ null / undefined (renders nothing) — useful for conditionals
{isLoggedIn && <p>Welcome</p>}
```

```tsx
// ❌ Types that CANNOT be rendered directly
const obj = { name: 'Ana' };
<p>{obj}</p>            // ❌ Error: Objects are not valid as React child

const bool = true;
<p>{bool}</p>           // renders nothing (booleans don't render)

// ✅ Solution: convert to string
<p>{JSON.stringify(obj)}</p>
<p>{String(bool)}</p>
<p>{bool ? 'Yes' : 'No'}</p>
```

---

## Conditional Rendering

### 1. Ternary operator

```tsx
function UserStatus({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div>
      {isLoggedIn
        ? <p>Welcome back 👋</p>
        : <p>Please log in</p>
      }
    </div>
  );
}
```

### 2. Short-circuit `&&` (logical AND)

```tsx
// Shows the element only if the condition is true
function Notification({ hasMessages }: { hasMessages: boolean }) {
  return (
    <div>
      <h1>Inbox</h1>
      {hasMessages && <span className="badge">🔔 You have messages</span>}
    </div>
  );
}
```

> ⚠️ **Gotcha**: if the condition is `0`, React renders `0`:
>
> ```tsx
> {count && <p>There are {count} items</p>}
> // If count = 0 → renders: 0 (not what you wanted)
>
> // ✅ Solutions:
> {count > 0 && <p>There are {count} items</p>}
> {!!count && <p>There are {count} items</p>}
> {count ? <p>There are {count} items</p> : null}
> ```

### 3. Early return

```tsx
function UserProfile({ user }: { user: User | null }) {
  if (!user) {
    return <p>No user found</p>;
  }

  // If we get here, user is not null
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

### 4. Switch for multiple states

```tsx
type Status = 'idle' | 'loading' | 'success' | 'error';

function StatusMessage({ status }: { status: Status }) {
  const renderContent = () => {
    switch (status) {
      case 'idle':    return <p>Waiting...</p>;
      case 'loading': return <p>⏳ Loading...</p>;
      case 'success': return <p>✅ Success!</p>;
      case 'error':   return <p>❌ An error occurred</p>;
    }
  };

  return <div>{renderContent()}</div>;
}
```

---

## Rendering Lists with `.map()`

```tsx
interface Task {
  id: number;
  title: string;
  done: boolean;
}

const tasks: Task[] = [
  { id: 1, title: 'Learn React', done: true },
  { id: 2, title: 'Exercise', done: false },
  { id: 3, title: 'Read a book', done: false },
];

function TaskList() {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>        {/* ⚠️ key is required in lists */}
          {task.done ? '✅' : '⬜'} {task.title}
        </li>
      ))}
    </ul>
  );
}
```

> ⚠️ **`key` prop**: React needs it to identify which element changed.
>
> - Use the unique `id` from your data if available
> - Avoid using the array index if the list can be reordered or have items removed

---

## Common JSX Expressions

```tsx
function ProductDetails({ product }: { product: Product }) {
  const { name, price, stock, description } = product;

  return (
    <div>
      {/* Number formatting */}
      <p>Price: ${price.toFixed(2)}</p>
      <p>Price: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)}</p>

      {/* Date formatting */}
      <p>Date: {new Date().toLocaleDateString('en-US')}</p>

      {/* Text with condition */}
      <p>Status: {stock > 0 ? `${stock} in stock` : 'Out of stock'}</p>

      {/* Truncate long text */}
      <p>{description.length > 100 ? `${description.slice(0, 100)}...` : description}</p>

      {/* Default value with || */}
      <p>{name || 'Unnamed product'}</p>

      {/* Default value with ?? (only null/undefined, not 0 or '') */}
      <p>{name ?? 'No name'}</p>
    </div>
  );
}
```

---

## Dynamic Attributes

```tsx
function InputField({ id, label, value, onChange, disabled }: InputProps) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>   {/* htmlFor instead of for */}
      <input
        id={id}
        type="text"
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={disabled ? 'input-disabled' : 'input'}
        placeholder={`Enter ${label.toLowerCase()}...`}
        aria-label={label}
      />
    </div>
  );
}
```

> 📝 **JSX vs HTML differences**:
>
> - `class` → `className`
> - `for` → `htmlFor`
> - `onclick` → `onClick` (camelCase)
> - Boolean attributes: `<input disabled />` = `<input disabled={true} />`

---

## Fragments: When You Don't Want an Extra div

```tsx
import { Fragment } from 'react';

// Option 1: Explicit Fragment (allows key in lists)
<Fragment key={item.id}>
  <dt>{item.term}</dt>
  <dd>{item.description}</dd>
</Fragment>

// Option 2: Short syntax (most common)
<>
  <h1>Title</h1>
  <p>Paragraph</p>
</>
```

---

## Quick Summary

| What to render | Syntax |
| :--- | :--- |
| Variable | `{variable}` |
| Expression | `{2 + 2}`, `{fn()}` |
| Conditional | `{condition ? 'a' : 'b'}` |
| Render or nothing | `{condition && <El />}` |
| List | `{arr.map(el => <Li key={el.id} />)}` |
| Template string | `` {`Hello ${name}`} `` |
| Object (debug) | `{JSON.stringify(obj)}` |
