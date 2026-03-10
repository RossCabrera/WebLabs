# 03 · Interfaces and Enums

## Interfaces

Interfaces define the **shape** an object must have. They are TypeScript-only (they don't exist in JS).

```typescript
// Basic definition
interface User {
  id: number;
  name: string;
  email: string;
  age?: number;          // optional property
  readonly created: Date; // read-only
}

// Using the interface
const user: User = {
  id: 1,
  name: "Ana",
  email: "ana@mail.com",
  created: new Date(),
};

// user.created = new Date(); // ❌ Error: readonly
```

---

## Methods in Interfaces

```typescript
interface Calculator {
  add(a: number, b: number): number;
  subtract: (a: number, b: number) => number; // alternative syntax
  description(): string;
}

const calc: Calculator = {
  add(a, b) { return a + b; },
  subtract: (a, b) => a - b,
  description() { return "Basic calculator"; },
};
```

---

## Extending Interfaces (inheritance)

```typescript
interface Person {
  name: string;
  age: number;
}

interface Employee extends Person {
  company: string;
  salary: number;
}

interface Manager extends Employee {
  team: string[];
}

const manager: Manager = {
  name: "Luis",
  age: 40,
  company: "TechCorp",
  salary: 80000,
  team: ["Ana", "Carlos"],
};
```

---

## Interface vs Type

```typescript
// Interface: better for objects, extensible with `extends`
interface Animal {
  name: string;
}

// Type alias: more flexible, supports unions, primitives, tuples
type ID = string | number;
type Point = { x: number; y: number };
type Coordinate = [number, number]; // tuple

// Both can be used for objects, but interface is preferred
// when defining the shape of an object that may be extended.
```

---

## Generic Interfaces

```typescript
interface Response<T> {
  data: T;
  status: number;
  message: string;
}

interface Product {
  id: number;
  name: string;
}

const response: Response<Product> = {
  data: { id: 1, name: "Laptop" },
  status: 200,
  message: "OK",
};

// Also useful for lists
const list: Response<Product[]> = {
  data: [{ id: 1, name: "Laptop" }, { id: 2, name: "Mouse" }],
  status: 200,
  message: "OK",
};
```

---

## Enums

Enums group a set of named constants.

```typescript
// Numeric enum (starts at 0 by default)
enum Direction {
  North,  // 0
  South,  // 1
  East,   // 2
  West,   // 3
}

const heading = Direction.North;
console.log(heading);           // 0
console.log(Direction[0]);      // "North" (reverse mapping)

// Numeric enum with custom values
enum HttpCode {
  OK = 200,
  Created = 201,
  NotFound = 404,
  Error = 500,
}

function handleResponse(code: HttpCode) {
  if (code === HttpCode.OK) {
    console.log("All good");
  }
}
```

---

## String Enum (safer and more readable)

```typescript
enum Role {
  Admin = "ADMIN",
  User = "USER",
  Moderator = "MOD",
}

const myRole: Role = Role.Admin;
console.log(myRole); // "ADMIN"

// Use it as a type
function checkAccess(role: Role): boolean {
  return role === Role.Admin;
}
```

---

## Const Enum (optimization)

```typescript
// Const enums are removed during compilation, replaced by their values
const enum Size {
  Small = "S",
  Medium = "M",
  Large = "L",
}

const size = Size.Medium; // compiled as: const size = "M"
```

---

## Enum + Interface Together

```typescript
enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
  Pending = "PENDING",
}

interface Account {
  id: number;
  holder: string;
  status: Status;
}

const account: Account = {
  id: 42,
  holder: "Maria",
  status: Status.Active,
};

// Change status
account.status = Status.Inactive;
```
