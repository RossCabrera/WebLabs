# 05 · Functions and Callbacks

## Function Types

```typescript
// 1. Function declaration (hoisted: can be used before it's declared)
function add(a: number, b: number): number {
  return a + b;
}

// 2. Function expression (no hoisting)
const subtract = function (a: number, b: number): number {
  return a - b;
};

// 3. Arrow function (most common in modern TS)
const multiply = (a: number, b: number): number => a * b;

// 4. Arrow function with a body
const divide = (a: number, b: number): number => {
  if (b === 0) throw new Error("Cannot divide by zero");
  return a / b;
};
```

---

## Parameters

```typescript
// Optional parameters (?)
function greet(name: string, greeting?: string): string {
  return `${greeting ?? "Hello"}, ${name}!`;
}
greet("Ana");               // "Hello, Ana!"
greet("Ana", "Good morning"); // "Good morning, Ana!"

// Parameters with default values
function createUser(name: string, role: string = "user", active: boolean = true) {
  return { name, role, active };
}

// Rest parameters (variable number of arguments)
function addAll(...numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}
addAll(1, 2, 3, 4, 5); // 15
```

---

## Returning Multiple Values

TypeScript cannot return multiple values directly, but there are idiomatic patterns:

```typescript
// 1. Return object (more descriptive, recommended)
function divideAndRemainder(a: number, b: number): { quotient: number; remainder: number } {
  return {
    quotient: Math.floor(a / b),
    remainder: a % b,
  };
}
const { quotient, remainder } = divideAndRemainder(17, 5);

// 2. Return tuple (more compact)
function minMax(nums: number[]): [number, number] {
  return [Math.min(...nums), Math.max(...nums)];
}
const [min, max] = minMax([3, 1, 7, 2, 9]);

// 3. [error, result] pattern (Go-style, useful in async)
function parseJSON<T>(text: string): [Error | null, T | null] {
  try {
    return [null, JSON.parse(text) as T];
  } catch (e) {
    return [e as Error, null];
  }
}
const [err, data] = parseJSON<{ name: string }>('{"name":"Ana"}');
```

---

## Advanced Function Typing

```typescript
// Function type
type Operation = (a: number, b: number) => number;

const sum: Operation = (a, b) => a + b;
const diff: Operation = (a, b) => a - b;

// Interface for functions
interface Transformer<T, R> {
  (value: T): R;
}

const toString: Transformer<number, string> = (n) => n.toString();

// Generic functions
function identity<T>(value: T): T {
  return value;
}
identity<string>("hello"); // "hello"
identity(42);              // 42 (TypeScript infers the type)

function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
```

---

## Callback Functions

A callback is a function passed as an argument to another function.

```typescript
// Basic callback
function runAfter(ms: number, callback: () => void): void {
  setTimeout(callback, ms);
}

runAfter(1000, () => {
  console.log("One second later!");
});

// Typed callback with parameters and return value
type Predicate<T> = (element: T) => boolean;

function customFilter<T>(arr: T[], predicate: Predicate<T>): T[] {
  const result: T[] = [];
  for (const item of arr) {
    if (predicate(item)) result.push(item);
  }
  return result;
}

const numbers = [1, 2, 3, 4, 5, 6];
const evens = customFilter(numbers, (n) => n % 2 === 0); // [2, 4, 6]

// Error callback (Node.js pattern)
type ResultCallback<T> = (error: Error | null, result?: T) => void;

function loadData(id: number, callback: ResultCallback<string>) {
  if (id <= 0) {
    callback(new Error("Invalid ID"));
    return;
  }
  // Simulates loading
  callback(null, `Data for id ${id}`);
}

loadData(1, (err, data) => {
  if (err) {
    console.error(err.message);
    return;
  }
  console.log(data);
});
```

---

## Higher-Order Functions (functions that return functions)

```typescript
// Function that returns a function (closure)
function createMultiplier(factor: number) {
  return (n: number) => n * factor;
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

double(5);  // 10
triple(5);  // 15

// Function composition
function compose<T>(
  ...functions: Array<(arg: T) => T>
): (arg: T) => T {
  return (value: T) => functions.reduceRight((acc, fn) => fn(acc), value);
}

const processText = compose<string>(
  (s) => s.trim(),
  (s) => s.toLowerCase(),
  (s) => s.replace(/\s+/g, "-"),
);

processText("  Hello World  "); // "hello-world"

// Basic currying
function multiply(a: number) {
  return (b: number) => a * b;
}

const times5 = multiply(5);
times5(3); // 15
```

---

## Pure vs Impure Functions

```typescript
// ✅ Pure: same input → same output, no side effects
function pureAdd(a: number, b: number): number {
  return a + b;
}

// ❌ Impure: depends on or modifies external state
let counter = 0;
function increment(): number {
  return ++counter; // modifies external variable
}

// ✅ Better pure alternative
function pureIncrement(counter: number): number {
  return counter + 1;
}
```
