# 01 · Variables and Template Strings

## `var`, `let`, and `const`

| Keyword | Scope | Reassignable | Reusable (redeclare) |
| :--------- | :------- | :------------- | :---------------------- |
| `var` | function | ✅ | ✅ (avoid) |
| `let` | block | ✅ | ❌ |
| `const` | block | ❌ | ❌ |

> **Golden rule:** use `const` by default. Switch to `let` only if you need to reassign. Never use `var`.

```typescript
// ❌ var - confusing scope, allows redeclaration
var name = "Ana";
var name = "Luis"; // no error — dangerous

// ✅ let - when the value changes
let counter = 0;
counter = 1; // ok
// let counter = 2; // ❌ Error: already declared

// ✅ const - value that doesn't change (most common)
const PI = 3.14159;
// PI = 3; // ❌ Error: cannot reassign

// ⚠️ const with objects/arrays: the reference doesn't change, the contents can
const user = { name: "Ana", age: 25 };
user.age = 26; // ✅ ok, we're modifying a property
// user = {}; // ❌ Error: we can't reassign the reference
```

---

## Basic Types in TypeScript

```typescript
const name: string = "Ana";
const age: number = 25;
const active: boolean = true;
const nothing: null = null;
const nothing2: undefined = undefined;

// TypeScript infers the type automatically (preferred)
const country = "Mexico";   // inferred as string
const year = 2024;          // inferred as number
```

---

## Template Strings (Template Literals)

Use backticks `` ` `` and allow expressions with `${}`.

```typescript
const name = "Carlos";
const age = 30;
const city = "Monterrey";

// ❌ old-style concatenation
const greeting1 = "Hello, " + name + ". You are " + age + " years old.";

// ✅ template string
const greeting2 = `Hello, ${name}. You are ${age} years old.`;

// Expressions inside ${}
const message = `In 5 years you will be ${age + 5} years old.`;

// Multi-line (no \n needed)
const html = `
  <div>
    <h1>Welcome, ${name}</h1>
    <p>City: ${city}</p>
  </div>
`;

// Function call inside ${}
const toUpperCase = (s: string) => s.toUpperCase();
const shout = `¡${toUpperCase(name)}!`; // "¡CARLOS!"

// Ternary inside ${}
const hasAccess = true;
const status = `The user ${hasAccess ? "has" : "does not have"} access.`;
```

---

## Tagged Template Literals (advanced)

```typescript
function highlight(strings: TemplateStringsArray, ...values: unknown[]): string {
  return strings.reduce((result, str, i) => {
    return result + str + (values[i] !== undefined ? `**${values[i]}**` : "");
  }, "");
}

const product = "TypeScript";
const version = 5;
const phrase = highlight`I am learning ${product} version ${version}`;
// "I am learning **TypeScript** version **5**"
```
