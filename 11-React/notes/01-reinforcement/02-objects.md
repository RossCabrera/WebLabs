# 02 · Objects in TypeScript

## Object Literals

The most direct way to create an object.

```typescript
// Basic object literal
const person = {
  name: "Ana",
  age: 28,
  active: true,
};

// Accessing properties
console.log(person.name);    // "Ana"
console.log(person["age"]);  // 28 (bracket notation)
```

---

## Properties: shorthand, methods, and computed keys

```typescript
const name = "Luis";
const age = 22;

// ✅ Shorthand: when the variable has the same name as the property
const user = { name, age }; // equivalent to { name: name, age: age }

// Methods inside the object
const calculator = {
  value: 10,
  double() {
    return this.value * 2;
  },
  triple: function () {
    return this.value * 3;
  },
};

// Computed property keys (dynamic key)
const field = "email";
const contact = {
  [field]: "ana@example.com", // property with a dynamic name
};
console.log(contact.email); // "ana@example.com"
```

---

## Object Types in TypeScript

```typescript
// Inline type
const product: { name: string; price: number; available: boolean } = {
  name: "Laptop",
  price: 1500,
  available: true,
};

// Optional properties with ?
const settings: { theme: string; language?: string } = {
  theme: "dark",
  // language is optional, can be omitted
};

// Readonly: cannot be modified
const config: Readonly<{ apiUrl: string }> = {
  apiUrl: "https://api.example.com",
};
// config.apiUrl = "other"; // ❌ Error
```

---

## Spread Operator (`...`)

Copies or combines objects (shallow copy).

```typescript
const base = { name: "Ana", age: 25 };

// Copy an object
const copy = { ...base };
copy.age = 30; // does not affect base

// Combine objects (last one wins if there are duplicate keys)
const extra = { city: "NYC", age: 30 };
const combined = { ...base, ...extra };
// { name: "Ana", age: 30, city: "NYC" }

// Override a specific property
const updated = { ...base, age: 26 };
// { name: "Ana", age: 26 }

// Add new property when combining
const withEmail = { ...base, email: "ana@mail.com" };
```

---

## Structured Clone (deep copy)

`structuredClone` makes a deep clone, ideal when there are nested objects.

```typescript
const original = {
  name: "Carlos",
  address: {
    city: "Guadalajara",
    zip: "44100",
  },
  hobbies: ["reading", "programming"],
};

// ❌ Spread is shallow: nested objects are still references
const spreadCopy = { ...original };
spreadCopy.address.city = "Monterrey"; // also changes in original!

// ✅ structuredClone: true deep copy
const deepCopy = structuredClone(original);
deepCopy.address.city = "Monterrey"; // original is untouched
deepCopy.hobbies.push("running");    // original is untouched

console.log(original.address.city); // "Guadalajara" ✅
console.log(original.hobbies);      // ["reading", "programming"] ✅
```

> `structuredClone` does not copy functions — only serializable data.

---

## Useful Object Utilities

```typescript
const obj = { a: 1, b: 2, c: 3 };

// Get keys, values, entries
Object.keys(obj);    // ["a", "b", "c"]
Object.values(obj);  // [1, 2, 3]
Object.entries(obj); // [["a", 1], ["b", 2], ["c", 3]]

// Create object from entries
const obj2 = Object.fromEntries([["x", 10], ["y", 20]]);
// { x: 10, y: 20 }

// Merge objects (mutates first, prefer spread)
const merged = Object.assign({}, obj, { d: 4 });

// Check if a property exists
"a" in obj;                    // true
obj.hasOwnProperty("a");       // true
```
