# 04 · Arrays and Destructuring

## Declaring and Typing Arrays

```typescript
// Two equivalent syntaxes
const numbers: number[] = [1, 2, 3, 4, 5];
const words: Array<string> = ["hello", "world"];

// Arrays of objects
interface Product {
  id: number;
  name: string;
  price: number;
}

const products: Product[] = [
  { id: 1, name: "Laptop", price: 1500 },
  { id: 2, name: "Mouse", price: 25 },
  { id: 3, name: "Keyboard", price: 80 },
];

// Readonly array (cannot be mutated)
const fixed: ReadonlyArray<number> = [1, 2, 3];
// fixed.push(4); // ❌ Error
```

---

## Essential Array Methods

```typescript
const nums = [1, 2, 3, 4, 5, 6];

// forEach - iterates without returning (side effects only)
nums.forEach((n) => console.log(n));

// map - transforms each element, returns a new array
const doubled = nums.map((n) => n * 2); // [2, 4, 6, 8, 10, 12]

// filter - filters elements by condition
const evens = nums.filter((n) => n % 2 === 0); // [2, 4, 6]

// find - returns the first element that meets the condition
const firstOver3 = nums.find((n) => n > 3); // 4

// findIndex - returns the index of the first match
const idx = nums.findIndex((n) => n > 3); // 3

// some - true if at least one element matches
const hasNegatives = nums.some((n) => n < 0); // false

// every - true if all elements match
const allPositive = nums.every((n) => n > 0); // true

// reduce - accumulates a value
const sum = nums.reduce((acc, n) => acc + n, 0); // 21

// includes - checks if a value exists
nums.includes(3); // true

// slice - sub-array without mutating the original
const part = nums.slice(1, 4); // [2, 3, 4]

// splice - modifies the original array (insert/remove)
const arr = [1, 2, 3, 4];
arr.splice(1, 2); // removes 2 elements from index 1 → arr = [1, 4]

// flat - flattens nested arrays
const nested = [[1, 2], [3, [4, 5]]];
nested.flat();    // [1, 2, 3, [4, 5]]
nested.flat(2);   // [1, 2, 3, 4, 5]

// flatMap - map + flat in one step
const sentences = ["hello world", "typescript is great"];
const words2 = sentences.flatMap((s) => s.split(" "));
// ["hello", "world", "typescript", "is", "great"]
```

---

## Iterating Arrays with `for...of`

```typescript
const colors = ["red", "green", "blue"];

// for...of (preferred for iterating values)
for (const color of colors) {
  console.log(color);
}

// With index using entries()
for (const [i, color] of colors.entries()) {
  console.log(`${i}: ${color}`);
}

// Working with objects
for (const product of products) {
  console.log(`${product.name} - $${product.price}`);
}
```

---

## Spread in Arrays

```typescript
const a = [1, 2, 3];
const b = [4, 5, 6];

// Copy
const copy = [...a];

// Combine
const combined = [...a, ...b]; // [1, 2, 3, 4, 5, 6]

// Insert at a position
const withExtra = [...a, 99, ...b]; // [1, 2, 3, 99, 4, 5, 6]

// Pass array as arguments
const max = Math.max(...a); // 3
```

---

## Array Destructuring

```typescript
const coordinates = [10, 20, 30];

// Basic
const [x, y, z] = coordinates;

// Skip elements with a comma
const [first, , third] = coordinates;

// Default value
const [p = 0, q = 0, r = 0, s = 0] = coordinates;

// Rest: capture the remainder
const [head, ...tail] = [1, 2, 3, 4, 5];
// head = 1, tail = [2, 3, 4, 5]

// Swap values (elegant)
let val1 = "A";
let val2 = "B";
[val1, val2] = [val2, val1];

// In function parameters
function processPoint([x, y]: [number, number]) {
  console.log(`x=${x}, y=${y}`);
}
processPoint([5, 10]);
```

---

## Object Destructuring

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
}

const user: User = { id: 1, name: "Ana", email: "ana@mail.com", age: 28 };

// Basic
const { name, email } = user;

// Rename on destructure
const { name: userName, email: userEmail } = user;
console.log(userName); // "Ana"

// Default value
const { age = 18 } = user;

// Rest in objects
const { id, ...withoutId } = user;
// withoutId = { name: "Ana", email: "ana@mail.com", age: 28 }

// In function parameters
function showUser({ name, email, age = 0 }: User) {
  console.log(`${name} (${age}) - ${email}`);
}
showUser(user);

// Nested destructuring
const config = {
  server: {
    host: "localhost",
    port: 3000,
  },
  db: {
    name: "my_db",
  },
};

const { server: { host, port }, db: { name: dbName } } = config;
```
