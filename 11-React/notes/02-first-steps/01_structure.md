# 📁 Directory Structure and Naming Conventions

## Typical React + Vite + TS Project Structure

```text
my-app/
├── public/                  # Static files (favicon, public images)
│   └── vite.svg
├── src/
│   ├── assets/              # Images, fonts, icons
│   │   └── logo.png
│   ├── components/          # Reusable components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.css
│   │   │   └── index.ts     # Re-export for clean imports
│   │   └── Card/
│   │       ├── Card.tsx
│   │       └── Card.module.css
│   ├── pages/               # Pages / views
│   │   ├── Home.tsx
│   │   └── About.tsx
│   ├── hooks/               # Custom hooks
│   │   └── useCounter.ts
│   ├── types/               # Global types and interfaces
│   │   └── index.ts
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## 📝 Naming Conventions

### Components → `PascalCase`

```tsx
// ✅ Correct
function UserCard() { ... }
const ProductList = () => { ... }

// ❌ Incorrect
function userCard() { ... }
function user_card() { ... }
```

### Component files → `PascalCase.tsx`

```text
Button.tsx       ✅
userCard.tsx     ❌
user-card.tsx    ❌
```

### Variables, functions, hooks → `camelCase`

```tsx
const userName = "Juan";
const [isOpen, setIsOpen] = useState(false);
function handleClick() { ... }
const useMyHook = () => { ... };
```

### Interfaces and Types → `PascalCase` (optional `I` prefix)

```ts
interface UserProps { ... }       // common React style
interface IUser { ... }           // prefixed style

type ButtonVariant = "primary" | "secondary";
```

### Global constants → `UPPER_SNAKE_CASE`

```ts
const MAX_RETRIES = 3;
const API_URL = "https://api.example.com";
```

### CSS Modules → `camelCase` in the object, `kebab-case` in the file

```css
/* Button.module.css */
.primary-btn { ... }   /* accessed as styles.primaryBtn */
```

---

## 💡 Tip: Re-exports with `index.ts`

```ts
// components/Button/index.ts
export { Button } from './Button';

// Now you can import like this (cleaner):
import { Button } from '@/components/Button';
// Instead of:
import { Button } from '@/components/Button/Button';
```
