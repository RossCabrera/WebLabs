# 09 · Best Practices and Optimization

## Strict Typing

```typescript
// Recommended tsconfig.json
{
  "compilerOptions": {
    "strict": true,              // enables all strict checks
    "noImplicitAny": true,       // disallows implicit `any`
    "strictNullChecks": true,    // null/undefined must be handled explicitly
    "noUnusedLocals": true,      // error on unused variables
    "noUnusedParameters": true,  // error on unused parameters
    "noImplicitReturns": true    // all branches must return
  }
}
```

```typescript
// ❌ Avoid `any`
function process(data: any) { return data; }

// ✅ Use generics or unknown
function process<T>(data: T): T { return data; }

// ✅ With unknown, forces verification before use
function log(value: unknown): void {
  if (typeof value === "string") {
    console.log(value.toUpperCase()); // TypeScript knows it's a string
  }
}
```

---

## Null Safety and Optional Chaining

```typescript
interface User {
  name: string;
  profile?: {
    avatar?: string;
    bio?: string;
  };
}

const u: User = { name: "Ana" };

// ❌ Dangerous without optional chaining
// const avatar = u.profile.avatar; // Runtime error

// ✅ Optional chaining (?.)
const avatar = u.profile?.avatar;       // undefined if profile doesn't exist
const bio = u.profile?.bio ?? "No bio"; // Nullish coalescing (??)

// ✅ Non-null assertion (only when you're sure)
// const name = u.profile!.bio; // tells TS "trust me"
```

---

## Type Guards

```typescript
interface Dog { type: "dog"; bark(): void; }
interface Cat { type: "cat"; meow(): void; }
type Pet = Dog | Cat;

// Type guard with discriminant property
function makeSound(pet: Pet): void {
  if (pet.type === "dog") {
    pet.bark(); // TypeScript knows it's a Dog
  } else {
    pet.meow(); // TypeScript knows it's a Cat
  }
}

// Type guard with typeof
function processID(id: string | number): string {
  if (typeof id === "string") return id.toUpperCase();
  return id.toFixed(2);
}

// Custom type guard (is)
function isString(value: unknown): value is string {
  return typeof value === "string";
}

// instanceof
function handleError(e: unknown): string {
  if (e instanceof Error) return e.message;
  return "Unknown error";
}
```

---

## Immutability

```typescript
// ✅ Prefer immutable patterns
const list = [1, 2, 3];

// ❌ Mutates the original array
list.push(4);
list.sort();

// ✅ Create new arrays
const listWithNew = [...list, 4];
const sortedList = [...list].sort();

// Useful utility types
interface Config {
  host: string;
  port: number;
  debug: boolean;
}

type ReadonlyConfig = Readonly<Config>;   // all readonly
type PartialConfig = Partial<Config>;     // all optional
type RequiredConfig = Required<Config>;   // all required
type HostOnly = Pick<Config, "host">;     // only some
type NoDebug = Omit<Config, "debug">;     // all except some
```

---

## Early Return (Guard Clauses)

```typescript
// ❌ Deep nesting
function processOrder(order: unknown) {
  if (order !== null) {
    if (typeof order === "object") {
      // main logic here...
    }
  }
}

// ✅ Early return: more readable
function processOrder2(order: unknown) {
  if (order === null) return;
  if (typeof order !== "object") return;

  // main logic without nesting
}
```

---

## Typed Error Handling

```typescript
// Custom error
class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public url?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Result type (alternative to exceptions)
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

async function safeFetch<T>(url: string): Promise<Result<T>> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new ApiError(res.status, `HTTP ${res.status}`, url);
    const data = await res.json() as T;
    return { ok: true, value: data };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e : new Error(String(e)) };
  }
}

// Usage without try/catch in the caller
const result = await safeFetch<{ name: string }>("https://api.example.com/user");
if (result.ok) {
  console.log(result.value.name);
} else {
  console.error(result.error.message);
}
```

---

## Performance: Memoization and Debounce

```typescript
// Simple memoization
function memoize<T extends unknown[], R>(
  fn: (...args: T) => R
): (...args: T) => R {
  const cache = new Map<string, R>();

  return (...args: T): R => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key)!;

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const fibonacci = memoize((n: number): number => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

// Debounce: delays execution until the user stops
function debounce<T extends unknown[]>(
  fn: (...args: T) => void,
  ms: number
): (...args: T) => void {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: T) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

// Useful for real-time search
const debouncedSearch = debounce(async (query: string) => {
  // Only runs 300ms after the user stops typing
  const results = await searchGifs(query);
  console.log(results);
}, 300);

// Throttle: executes at most once every N ms
function throttle<T extends unknown[]>(
  fn: (...args: T) => void,
  ms: number
): (...args: T) => void {
  let last = 0;

  return (...args: T) => {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn(...args);
    }
  };
}

declare function searchGifs(query: string): Promise<unknown[]>;
```

---

## Naming Conventions

```typescript
// Variables and functions: camelCase
const userName = "Ana";
function calculateTotal() {}

// Types, Interfaces, Classes, Enums: PascalCase
interface UserProfile {}
class AuthService {}
enum OrderStatus {}
type APIResult = {};

// Global constants: SCREAMING_SNAKE_CASE
const MAX_RETRIES = 3;
const API_BASE_URL = "https://api.example.com";

// Files: kebab-case
// user.service.ts
// giphy-api.ts
// calculate-total.utils.ts

// Useful prefixes:
// is/has/can for booleans
const isActive = true;
const hasPermission = false;
// get for getters
function getName() {}
// on for event handlers
function onButtonClick() {}
```
