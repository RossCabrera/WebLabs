# 🪝 Hook - useState

## What is a Hook?

**Hooks** are special React functions that let you use React features (like state) inside functional components.

> Rules of Hooks:
>
> - Only call them **inside components** or other hooks
> - Only call them at the **top level** (never inside if, for, etc.)
> - Hooks always start with `use`

---

## useState - Basic Concepts

```tsx
import { useState } from 'react';

// Syntax:
const [state, setState] = useState(initialValue);
//     ↑ value   ↑ function to update it
```

### Basic example: counter

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);  // 0 is the initial value

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

export default Counter;
```

---

## Typing useState in TypeScript

TypeScript can infer the type automatically, but you can also specify it explicitly:

```tsx
// ✅ Automatic inference (TypeScript deduces it)
const [count, setCount] = useState(0);          // number
const [name, setName] = useState('');           // string
const [isOpen, setIsOpen] = useState(false);    // boolean

// ✅ Explicit type (when the initial value doesn't make the type clear)
const [user, setUser] = useState<User | null>(null);
const [items, setItems] = useState<string[]>([]);
const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
```

---

## useState with Different Types

### String

```tsx
function NameInput() {
  const [name, setName] = useState('');

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
      />
      <p>Hello, {name || 'stranger'}!</p>
    </div>
  );
}
```

### Boolean (toggle)

```tsx
function Toggle() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      <button onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? 'Hide' : 'Show'}
      </button>
      {isVisible && <p>Content is visible!</p>}
    </div>
  );
}
```

### Object

```tsx
interface FormData {
  username: string;
  email: string;
}

function Form() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
  });

  // ⚠️ When updating an object, spread the previous state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,                              // keeps other fields
      [e.target.name]: e.target.value,          // updates the changed field
    });
  };

  return (
    <form>
      <input name="username" value={formData.username} onChange={handleChange} />
      <input name="email" value={formData.email} onChange={handleChange} />
      <p>Username: {formData.username}</p>
      <p>Email: {formData.email}</p>
    </form>
  );
}
```

### Array

```tsx
function TodoList() {
  const [todos, setTodos] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos([...todos, input]);  // never mutate the array directly
    setInput('');
  };

  const removeTodo = (index: number) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo, i) => (
          <li key={i}>
            {todo}
            <button onClick={() => removeTodo(i)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Functional Update (safe form)

When the new state depends on the previous one, use the **functional form**:

```tsx
// ❌ Can have bugs with rapid updates
setCount(count + 1);

// ✅ Functional form (always uses the most recent value)
setCount(prevCount => prevCount + 1);
```

```tsx
// Practical example with array
const addItem = (newItem: string) => {
  setItems(prevItems => [...prevItems, newItem]);
};
```

---

## ⚠️ Common Mistakes

```tsx
// ❌ NEVER mutate state directly
const addItem = () => {
  items.push('new');    // this does NOT re-render the component
  setItems(items);      // React does not detect the change
};

// ✅ Always create a new array/object
const addItem = () => {
  setItems([...items, 'new']);
};

// ❌ NEVER read freshly updated state in the same function
const handleClick = () => {
  setCount(count + 1);
  console.log(count);   // still shows the previous value
};
```

---

## useState with null (async value)

```tsx
interface User {
  id: number;
  name: string;
}

function UserProfile() {
  const [user, setUser] = useState<User | null>(null);

  // Simulates loading
  const loadUser = () => {
    setUser({ id: 1, name: 'Ana Garcia' });
  };

  if (!user) {
    return (
      <div>
        <p>No user loaded</p>
        <button onClick={loadUser}>Load user</button>
      </div>
    );
  }

  return <p>Welcome, {user.name}!</p>;
}
```
