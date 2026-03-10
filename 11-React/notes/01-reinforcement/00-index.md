# 📘 TypeScript Guide — Index

Mini-documentation with notes, examples, and ready-to-use TypeScript snippets.

---

## Files

| # | File | Topics |
| :--- | :------ | :-------- |
| 01 | `01-variables-and-strings.md` | `const`, `let`, `var`, basic types, template strings, tagged templates |
| 02 | `02-objects.md` | Object literals, shorthand, computed keys, spread, `structuredClone`, Object utilities |
| 03 | `03-interfaces-and-enums.md` | Interfaces, inheritance, generics, `Readonly`, numeric and string enums, const enum |
| 04 | `04-arrays-and-destructuring.md` | Typed arrays, essential methods, `for...of`, spread, array and object destructuring |
| 05 | `05-functions-and-callbacks.md` | Function types, parameters, returning multiple values, callbacks, HOF, currying, purity |
| 06 | `06-modules.md` | Named/default exports, imports, re-exports (barrel), dynamic imports, `tsconfig` paths |
| 07 | `07-promises-async-fetch.md` | Promises, chaining, `Promise.all/race/allSettled`, async/await, Fetch API, HTTP service |
| 08 | `08-giphy-api.md` | Giphy types, complete service, search with pagination, environment variables |
| 09 | `09-best-practices.md` | `strict`, null safety, type guards, immutability, early return, error handling, naming |

---

## Quick TypeScript Setup

```bash
# Initialize project
npm init -y
npm install -D typescript tsx @types/node

# Create tsconfig
npx tsc --init

# Run .ts files directly
npx tsx main.ts
```

---

## Recommended tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

---

## Quick Cheatsheet

```typescript
// Variables
const value = 42;         // immutable
let mutable = "hello";    // reassignable

// Template string
const msg = `Hello ${name}, you are ${age} years old`;

// Interface + Enum
interface User { id: number; name: string; role: Role; }
enum Role { Admin = "ADMIN", User = "USER" }

// Destructuring
const { name, age = 18 } = user;
const [first, ...rest] = array;

// Typed function
const add = (a: number, b: number): number => a + b;

// Async/Await + Fetch
async function getData<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

// Spread
const updated = { ...obj, property: "value" };
const combined = [...arr1, ...arr2];

// Optional chaining + nullish coalescing
const value2 = obj?.property?.subprop ?? "default";
```
