# 🎨 Conditional CSS and CSS Modules

---

## Conditional CSS

Apply CSS classes dynamically based on state or props.

### Method 1: Template literals (most common)

```tsx
function Button({ isActive }: { isActive: boolean }) {
  return (
    <button className={`btn ${isActive ? 'btn-active' : 'btn-inactive'}`}>
      Click
    </button>
  );
}
```

### Method 2: Concatenation with `&&`

```tsx
function Alert({ type, message }: { type: 'success' | 'error'; message: string }) {
  return (
    <div className={`alert ${type === 'error' && 'alert-error'}`}>
      {message}
    </div>
  );
}
```

### Method 3: Class array (clean pattern)

```tsx
function Button({ variant, disabled }: { variant: string; disabled: boolean }) {
  const classes = [
    'btn',
    variant === 'primary' && 'btn-primary',
    variant === 'danger'  && 'btn-danger',
    disabled              && 'btn-disabled',
  ]
    .filter(Boolean)       // removes false/null values
    .join(' ');

  return <button className={classes}>{label}</button>;
}
```

### Method 4: `clsx` library (very popular)

```bash
npm install clsx
```

```tsx
import clsx from 'clsx';

function Button({ isActive, isDisabled, variant }: ButtonProps) {
  return (
    <button
      className={clsx(
        'btn',
        variant === 'primary' && 'btn-primary',
        variant === 'secondary' && 'btn-secondary',
        { 'btn-active': isActive },     // object syntax
        { 'btn-disabled': isDisabled },
      )}
    >
      Click
    </button>
  );
}

// clsx with array (another valid syntax)
clsx(['btn', isActive && 'active', isDisabled && 'disabled'])
```

---

## Full Example: Conditional CSS with useState

```tsx
import { useState } from 'react';
import './styles.css';

function ToggleBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <div className={`box ${theme}`}>
      <button
        className={`toggle-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '▲ Close' : '▼ Open'}
      </button>

      {isOpen && (
        <div className="content">
          <p>Expandable content</p>
        </div>
      )}

      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Switch to {theme === 'light' ? 'dark' : 'light'}
      </button>
    </div>
  );
}
```

```css
/* styles.css */
.box { padding: 1rem; border-radius: 8px; }
.box.light { background: #fff; color: #000; }
.box.dark  { background: #1a1a1a; color: #fff; }

.toggle-btn { background: #ccc; }
.toggle-btn.active { background: #4CAF50; color: white; }
```

---

## CSS Modules

**CSS Modules** make styles **local to the component**, preventing name collisions between files.

### How it works

```text
Button.module.css    →  .btn becomes .Button_btn__abc123
```

Each class gets a unique auto-generated name. No conflicts between components.

---

### Basic example

```css
/* Button.module.css */
.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.primary {
  background-color: #3b82f6;
  color: white;
}

.secondary {
  background-color: #e5e7eb;
  color: #374151;
}

.danger {
  background-color: #ef4444;
  color: white;
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

```tsx
// Button.tsx
import styles from './Button.module.css';

interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  onClick?: () => void;
}

function Button({ label, variant = 'primary', disabled = false, onClick }: ButtonProps) {
  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${disabled ? styles.disabled : ''}`}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default Button;
```

---

### CSS Modules + clsx (recommended combo)

```tsx
import clsx from 'clsx';
import styles from './Card.module.css';

interface CardProps {
  title: string;
  highlighted?: boolean;
  children: React.ReactNode;
}

function Card({ title, highlighted = false, children }: CardProps) {
  return (
    <div className={clsx(styles.card, highlighted && styles.highlighted)}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.body}>{children}</div>
    </div>
  );
}
```

```css
/* Card.module.css */
.card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  transition: box-shadow 0.2s;
}

.card.highlighted {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

.title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.body {
  color: #6b7280;
}
```

---

### Global styles vs CSS Modules

```css
/* global.css — applies to the entire app */
* { box-sizing: border-box; }
body { font-family: sans-serif; }

/* Component.module.css — only for that component */
.container { max-width: 800px; }
```

```tsx
// main.tsx — import global styles once
import './index.css';
```

---

## Summary: When to Use What?

| Method | When to use |
| :-------- | :--------------- |
| Global CSS | Resets, typography, variables |
| CSS Module | Component-scoped styles (recommended) |
| Conditional CSS (template) | Few conditional classes |
| `clsx` | Many conditional classes |
| Inline styles | Only for dynamic values (variable colors) |

```tsx
// Inline style: useful for values you can't put in CSS
<div style={{ backgroundColor: user.profileColor, height: `${progress}%` }} />
```
