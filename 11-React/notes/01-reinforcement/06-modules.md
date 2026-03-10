# 06 · Modules: Import and Export

## Exports

```typescript
// ─── file: utils/math.ts ─────────────────────────────────────────

// Named export: you can have multiple
export const PI = 3.14159;

export function add(a: number, b: number): number {
  return a + b;
}

export interface Point {
  x: number;
  y: number;
}

export type Operation = (a: number, b: number) => number;

// Default export: only one per file
export default function calculateArea(radius: number): number {
  return PI * radius ** 2;
}
```

```typescript
// ─── file: models/user.ts ────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  email: string;
}

export enum Role {
  Admin = "ADMIN",
  User = "USER",
}

// Export at the end (equivalent to `export` in front of each declaration)
const DEFAULT_ROLE = Role.User;
export { DEFAULT_ROLE };
```

---

## Imports

```typescript
// ─── file: main.ts ───────────────────────────────────────────────

// Named imports
import { add, PI, Point } from "./utils/math";

// Default import
import calculateArea from "./utils/math";

// Both at once
import calculateArea2, { add as sum, PI as pi } from "./utils/math";

// Rename imports with `as`
import { add as addNumbers, PI as constant } from "./utils/math";

// Import everything with an alias
import * as Math from "./utils/math";
Math.add(2, 3);
Math.PI;

// Type-only import (TypeScript only)
import type { User, Role } from "./models/user";
```

---

## Re-exporting (Barrel Exports)

Useful for creating a single entry point (`index.ts`).

```typescript
// ─── file: utils/index.ts ────────────────────────────────────────

// Re-export everything from other files
export * from "./math";
export * from "./strings";

// Re-export with rename
export { formatDate as formatFormattedDate } from "./dates";

// Re-export only some
export { add, subtract } from "./math";
```

```typescript
// ─── file: main.ts ───────────────────────────────────────────────

// Now we import from the barrel, not from each individual file
import { add, formatFormattedDate, PI } from "./utils";
```

---

## Dynamic Modules (Dynamic Import)

Useful for lazy loading (load only when needed).

```typescript
async function loadModule() {
  const module = await import("./utils/math");
  console.log(module.add(1, 2));
}

// With default export
async function loadCalculator() {
  const { default: calculate } = await import("./utils/math");
  console.log(calculate(5));
}
```

---

## Relevant tsconfig.json for Modules

```json
{
  "compilerOptions": {
    "module": "ESNext",           // module format
    "moduleResolution": "bundler", // how paths are resolved
    "baseUrl": "src",             // root for absolute paths
    "paths": {                    // path aliases
      "@utils/*": ["utils/*"],
      "@models/*": ["models/*"]
    }
  }
}
```

```typescript
// With paths configured you can import like this:
import { add } from "@utils/math";
import type { User } from "@models/user";
```
