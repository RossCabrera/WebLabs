# 🚀 Modern JavaScript (ES6+) Complete Guide

## 📚 Table of Contents

- [1️⃣ Arrow Functions](#arrow-functions)
- [2️⃣ Template Literals](#template-literals)
- [3️⃣ Destructuring](#destructuring)
- [4️⃣ Spread Operator](#spread-operator)
- [5️⃣ Array Methods (map, filter, reduce)](#array-methods)
- [6️⃣ Promises](#promises)
- [7️⃣ Async/Await](#async-await)
- [8️⃣ Modules (import/export)](#modules)
- [9️⃣ Classes](#classes)

---

## <a name="arrow-functions"></a>1️⃣ Arrow Functions

## What are they?

A shorter way to write functions in JavaScript.

## Old Way vs New Way

```javascript
// ❌ Old way (function keyword)
function greet(name) {
  return "Hello " + name;
}

// ✅ New way (arrow function)
const greet = (name) => {
  return "Hello " + name;
};

// ✅ Even shorter (implicit return)
const greet = (name) => "Hello " + name;
```

## Basic Syntax

```javascript
// With multiple parameters
const add = (a, b) => a + b;
console.log(add(2, 3)); // 5

// With one parameter (parentheses optional)
const double = num => num * 2;
console.log(double(4)); // 8

// With no parameters
const sayHi = () => "Hi!";
console.log(sayHi()); // "Hi!"

// With multiple lines (need curly braces and return)
const multiply = (a, b) => {
  const result = a * b;
  return result;
};
```

## Real-World Examples

```javascript
// Example 1: Array operations
const numbers = [1, 2, 3, 4, 5];

// Old way
const doubled = numbers.map(function(num) {
  return num * 2;
});

// New way (much cleaner!)
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// Example 2: Event handlers
const button = document.querySelector('.btn');

// Old way
button.addEventListener('click', function() {
  console.log('Clicked!');
});

// New way
button.addEventListener('click', () => {
  console.log('Clicked!');
});

// Example 3: setTimeout
setTimeout(() => {
  console.log('2 seconds passed');
}, 2000);
```

## Important Difference: 'this' keyword

```javascript
// Arrow functions DON'T have their own 'this'
const person = {
  name: 'John',
  
  // Regular function - has its own 'this'
  sayHello: function() {
    console.log('Hello, ' + this.name); // Works! ✅
  },
  
  // Arrow function - uses parent's 'this'
  sayBye: () => {
    console.log('Bye, ' + this.name); // Doesn't work! ❌
  }
};

person.sayHello(); // "Hello, John"
person.sayBye();   // "Bye, undefined"
```

## When to Use Arrow Functions

✅ **USE arrow functions:**

- Array methods (map, filter, reduce)
- Callbacks
- Short functions
- When you don't need 'this'

❌ **DON'T use arrow functions:**

- Object methods (use regular functions)
- When you need 'this' context
- Constructors

## Practice Exercises

```javascript
// Exercise 1: Convert to arrow function
// Old:
function square(x) {
  return x * x;
}
// Your answer:
const square = x => x * x;

// Exercise 2: Filter even numbers using arrow function
const nums = [1, 2, 3, 4, 5, 6];
// Your answer:
const evens = nums.filter(num => num % 2 === 0);

// Exercise 3: Create a greeting function
// Should return "Good morning, [name]"
const greeting = name => `Good morning, ${name}`;
```

---

## <a name="template-literals"></a>2️⃣ Template Literals

## What are they?

A better way to create strings, especially with variables.

## Old Way vs New Way

```javascript
const name = "John";
const age = 25;

// ❌ Old way (string concatenation)
const message = "My name is " + name + " and I am " + age + " years old.";

// ✅ New way (template literals)
const message = `My name is ${name} and I am ${age} years old.`;
```

## Basic Syntax

Use **backticks** ` `` ` instead of quotes, and `${}` for variables.

```javascript
// Simple variable
const user = "Alice";
console.log(`Hello, ${user}!`); // "Hello, Alice!"

// Expressions inside ${}
const a = 5;
const b = 10;
console.log(`${a} + ${b} = ${a + b}`); // "5 + 10 = 15"

// Function calls
const getName = () => "Bob";
console.log(`User: ${getName()}`); // "User: Bob"
```

## Multi-line Strings

```javascript
// ❌ Old way (ugly!)
const oldHtml = '<div>\n' +
                '  <h1>Title</h1>\n' +
                '  <p>Content</p>\n' +
                '</div>';

// ✅ New way (beautiful!)
const newHtml = `
  <div>
    <h1>Title</h1>
    <p>Content</p>
  </div>
`;
```

## Real-World Examples

```javascript
// Example 1: Creating HTML dynamically
const user = {
  name: "Sarah",
  age: 28,
  city: "New York"
};

const userCard = `
  <div class="card">
    <h2>${user.name}</h2>
    <p>Age: ${user.age}</p>
    <p>City: ${user.city}</p>
  </div>
`;

document.querySelector('.container').innerHTML = userCard;

// Example 2: API URLs
const userId = 123;
const apiUrl = `https://api.example.com/users/${userId}/posts`;

// Example 3: Dynamic messages
const items = 5;
const total = 49.99;
const message = `You have ${items} items. Total: $${total.toFixed(2)}`;
console.log(message); // "You have 5 items. Total: $49.99"

// Example 4: Conditional content
const isLoggedIn = true;
const greeting = `${isLoggedIn ? 'Welcome back!' : 'Please login'}`;
```

## Practice Exercises

```javascript
// Exercise 1: Create a product card
const product = {
  name: "Laptop",
  price: 999,
  inStock: true
};
// Create HTML using template literals
const productHTML = `
  <div class="product">
    <h3>${product.name}</h3>
    <p>Price: $${product.price}</p>
    <p>${product.inStock ? 'In Stock' : 'Out of Stock'}</p>
  </div>
`;

// Exercise 2: Format a date message
const day = 15;
const month = 'January';
const year = 2025;
const dateMsg = `Today is ${month} ${day}, ${year}`;

// Exercise 3: Create an email template
const recipientName = "Alex";
const subject = "Welcome!";
const email = `
  Dear ${recipientName},
  
  Subject: ${subject}
  
  Thank you for joining us!
  
  Best regards,
  The Team
`;
```

---

## <a name="destructuring"></a>3️⃣ Destructuring

## What is it?

A way to unpack values from arrays or properties from objects into separate variables.

## Object Destructuring

```javascript
// Without destructuring
const user = {
  name: "John",
  age: 30,
  email: "john@example.com"
};

const name = user.name;
const age = user.age;
const email = user.email;

// ✅ With destructuring (cleaner!)
const { name, age, email } = user;

console.log(name);  // "John"
console.log(age);   // 30
console.log(email); // "john@example.com"
```

## Renaming Variables

```javascript
const user = {
  name: "Sarah",
  age: 25
};

// Rename while destructuring
const { name: userName, age: userAge } = user;

console.log(userName); // "Sarah"
console.log(userAge);  // 25
```

## Default Values

```javascript
const user = {
  name: "Bob"
  // no age property
};

const { name, age = 18 } = user;

console.log(name); // "Bob"
console.log(age);  // 18 (default value)
```

## Nested Object Destructuring

```javascript
const user = {
  name: "Alice",
  address: {
    city: "NYC",
    country: "USA"
  }
};

// Get nested values
const { 
  name, 
  address: { city, country } 
} = user;

console.log(name);    // "Alice"
console.log(city);    // "NYC"
console.log(country); // "USA"
```

## Array Destructuring

```javascript
const colors = ["red", "green", "blue"];

// Old way
const first = colors[0];
const second = colors[1];

// ✅ New way
const [first, second, third] = colors;

console.log(first);  // "red"
console.log(second); // "green"
console.log(third);  // "blue"

// Skip elements
const [primaryColor, , tertiaryColor] = colors;
console.log(primaryColor);  // "red"
console.log(tertiaryColor); // "blue"
```

## Rest in Destructuring

```javascript
const numbers = [1, 2, 3, 4, 5];

const [first, second, ...rest] = numbers;

console.log(first);  // 1
console.log(second); // 2
console.log(rest);   // [3, 4, 5]
```

## Real-World Examples

```javascript
// Example 1: Function parameters
function displayUser({ name, age, city }) {
  console.log(`${name} is ${age} years old and lives in ${city}`);
}

const user = { name: "Tom", age: 35, city: "Boston" };
displayUser(user); // "Tom is 35 years old and lives in Boston"

// Example 2: API responses
async function getUser() {
  const response = await fetch('https://api.example.com/user/1');
  const { data: { name, email } } = await response.json();
  
  console.log(name, email);
}

// Example 3: React (very common!)
function UserCard({ name, age, image }) {
  return `
    <div>
      <img src="${image}" />
      <h2>${name}</h2>
      <p>Age: ${age}</p>
    </div>
  `;
}

// Example 4: Swapping variables
let a = 1;
let b = 2;

[a, b] = [b, a]; // Swap!

console.log(a); // 2
console.log(b); // 1
```

## Practice Exercises

```javascript
// Exercise 1: Extract user data
const userData = {
  firstName: "Emma",
  lastName: "Smith",
  age: 28,
  email: "emma@example.com"
};
// Extract firstName, lastName, email
const { firstName, lastName, email } = userData;

// Exercise 2: Get first and last item from array
const items = ["apple", "banana", "orange", "grape"];
// Get first and last (skip middle items)
const [first, , , last] = items;

// Exercise 3: Function with destructured params
function createGreeting({ name, time = "day" }) {
  return `Good ${time}, ${name}!`;
}
console.log(createGreeting({ name: "Alex" })); 
// "Good day, Alex!"
console.log(createGreeting({ name: "Sam", time: "morning" })); 
// "Good morning, Sam!"
```

---

## <a name="spread-operator"></a>4️⃣ Spread Operator (...)

## What is it?

The `...` operator that expands/spreads elements.

## Array Spreading

```javascript
// Combining arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// Old way
const combined = arr1.concat(arr2);

// ✅ New way
const combined = [...arr1, ...arr2];
console.log(combined); // [1, 2, 3, 4, 5, 6]

// Adding elements
const fruits = ["apple", "banana"];
const moreFruits = ["orange", ...fruits, "grape"];
console.log(moreFruits); 
// ["orange", "apple", "banana", "grape"]
```

## Copying Arrays

```javascript
const original = [1, 2, 3];

// ❌ Wrong (reference copy)
const copy1 = original;
copy1.push(4);
console.log(original); // [1, 2, 3, 4] - Changed!

// ✅ Right (spread creates new array)
const copy2 = [...original];
copy2.push(4);
console.log(original); // [1, 2, 3] - Unchanged!
```

## Object Spreading

```javascript
const user = {
  name: "John",
  age: 30
};

// Add properties
const updatedUser = {
  ...user,
  email: "john@example.com",
  city: "NYC"
};
console.log(updatedUser);
// { name: "John", age: 30, email: "john@example.com", city: "NYC" }

// Override properties
const olderUser = {
  ...user,
  age: 31  // Overrides age
};
console.log(olderUser);
// { name: "John", age: 31 }
```

## Copying Objects

```javascript
const original = { name: "Alice", age: 25 };

// Create a copy
const copy = { ...original };

copy.age = 26;
console.log(original.age); // 25 - Unchanged!
console.log(copy.age);     // 26 - Changed!
```

## Function Arguments

```javascript
// Pass array elements as individual arguments
const numbers = [5, 10, 15];

// Old way
Math.max.apply(null, numbers);

// ✅ New way
Math.max(...numbers); // 15

// Example with custom function
function sum(a, b, c) {
  return a + b + c;
}

const nums = [1, 2, 3];
console.log(sum(...nums)); // 6
```

## Real-World Examples

```javascript
// Example 1: Merging user data
const defaultSettings = {
  theme: "light",
  notifications: true,
  language: "en"
};

const userSettings = {
  theme: "dark"
};

const finalSettings = {
  ...defaultSettings,
  ...userSettings  // Overrides theme
};
console.log(finalSettings);
// { theme: "dark", notifications: true, language: "en" }

// Example 2: Adding items to cart
const cart = [
  { id: 1, name: "Laptop" },
  { id: 2, name: "Mouse" }
];

const newItem = { id: 3, name: "Keyboard" };
const updatedCart = [...cart, newItem];

// Example 3: Removing an item
const todos = [
  { id: 1, text: "Buy milk" },
  { id: 2, text: "Walk dog" },
  { id: 3, text: "Code" }
];

const idToRemove = 2;
const filtered = todos.filter(todo => todo.id !== idToRemove);
const newTodos = [...filtered];

// Example 4: Form state update (React pattern)
const formData = {
  username: "",
  email: "",
  password: ""
};

// Update one field
const updatedForm = {
  ...formData,
  email: "user@example.com"
};
```

## Rest vs Spread

```javascript
// SPREAD: Expands an array
const arr = [1, 2, 3];
console.log(...arr); // 1 2 3

// REST: Collects into an array
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}
console.log(sum(1, 2, 3, 4)); // 10
```

## Practice Exercises

```javascript
// Exercise 1: Merge arrays
const fruits = ["apple", "banana"];
const vegetables = ["carrot", "broccoli"];
// Create combined array with "orange" in the middle
const combined = [...fruits, "orange", ...vegetables];

// Exercise 2: Update user object
const user = { name: "Bob", age: 25, city: "NYC" };
// Create new object with age = 26 and new email
const updated = { ...user, age: 26, email: "bob@email.com" };

// Exercise 3: Copy and modify
const product = { name: "Phone", price: 599 };
// Create discounted version (10% off)
const discounted = { ...product, price: product.price * 0.9 };
```

---

## <a name="array-methods">5️⃣ Array Methods (map, filter, reduce)

**These are SUPER important for modern JavaScript!**

## map() - Transform each element

```javascript
// What it does: Creates a NEW array by applying a function to each element

const numbers = [1, 2, 3, 4, 5];

// Double each number
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// Old way (with for loop)
const doubled = [];
for (let i = 0; i < numbers.length; i++) {
  doubled.push(numbers[i] * 2);
}
```

## Real map() Examples

```javascript
// Example 1: Get all names
const users = [
  { name: "John", age: 30 },
  { name: "Jane", age: 25 },
  { name: "Bob", age: 35 }
];

const names = users.map(user => user.name);
console.log(names); // ["John", "Jane", "Bob"]

// Example 2: Format prices
const prices = [10, 20, 30];
const formatted = prices.map(price => `$${price}.00`);
console.log(formatted); // ["$10.00", "$20.00", "$30.00"]

// Example 3: Create HTML elements
const items = ["Apple", "Banana", "Orange"];
const html = items.map(item => `<li>${item}</li>`);
console.log(html);
// ["<li>Apple</li>", "<li>Banana</li>", "<li>Orange</li>"]

// Join them
const listHTML = `<ul>${html.join('')}</ul>`;
```

## filter() - Keep only matching elements

```javascript
// What it does: Creates a NEW array with elements that pass a test

const numbers = [1, 2, 3, 4, 5, 6];

// Get only even numbers
const evens = numbers.filter(num => num % 2 === 0);
console.log(evens); // [2, 4, 6]

// Get only numbers > 3
const large = numbers.filter(num => num > 3);
console.log(large); // [4, 5, 6]
```

## Real filter() Examples

```javascript
// Example 1: Filter users by age
const users = [
  { name: "John", age: 17 },
  { name: "Jane", age: 25 },
  { name: "Bob", age: 16 }
];

const adults = users.filter(user => user.age >= 18);
console.log(adults);
// [{ name: "Jane", age: 25 }]

// Example 2: Search functionality
const products = [
  { name: "Laptop", price: 1000 },
  { name: "Mouse", price: 25 },
  { name: "Keyboard", price: 75 }
];

const searchTerm = "lap";
const results = products.filter(product => 
  product.name.toLowerCase().includes(searchTerm.toLowerCase())
);
console.log(results);
// [{ name: "Laptop", price: 1000 }]

// Example 3: Remove completed todos
const todos = [
  { text: "Buy milk", completed: true },
  { text: "Code", completed: false },
  { text: "Exercise", completed: true }
];

const activeTodos = todos.filter(todo => !todo.completed);
console.log(activeTodos);
// [{ text: "Code", completed: false }]
```

## reduce() - Combine all elements into one value

```javascript
// What it does: Reduces array to a SINGLE value
// Syntax: array.reduce((accumulator, current) => ..., initialValue)

const numbers = [1, 2, 3, 4, 5];

// Sum all numbers
const sum = numbers.reduce((total, num) => total + num, 0);
console.log(sum); // 15

// How it works:
// total=0, num=1 → returns 0+1=1
// total=1, num=2 → returns 1+2=3
// total=3, num=3 → returns 3+3=6
// total=6, num=4 → returns 6+4=10
// total=10, num=5 → returns 10+5=15
```

## Real reduce() Examples

```javascript
// Example 1: Calculate total price
const cart = [
  { name: "Laptop", price: 1000 },
  { name: "Mouse", price: 25 },
  { name: "Keyboard", price: 75 }
];

const total = cart.reduce((sum, item) => sum + item.price, 0);
console.log(total); // 1100

// Example 2: Count occurrences
const fruits = ["apple", "banana", "apple", "orange", "banana", "apple"];

const count = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});

console.log(count);
// { apple: 3, banana: 2, orange: 1 }

// Example 3: Flatten array
const nested = [[1, 2], [3, 4], [5, 6]];

const flat = nested.reduce((acc, arr) => [...acc, ...arr], []);
console.log(flat); // [1, 2, 3, 4, 5, 6]

// Example 4: Group by category
const products = [
  { name: "Laptop", category: "Electronics" },
  { name: "Shirt", category: "Clothing" },
  { name: "Phone", category: "Electronics" },
  { name: "Pants", category: "Clothing" }
];

const grouped = products.reduce((acc, product) => {
  const category = product.category;
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push(product);
  return acc;
}, {});

console.log(grouped);
// {
//   Electronics: [{ name: "Laptop", ... }, { name: "Phone", ... }],
//   Clothing: [{ name: "Shirt", ... }, { name: "Pants", ... }]
// }
```

## Chaining Methods

```javascript
// You can chain map, filter, reduce!

const users = [
  { name: "John", age: 17, score: 85 },
  { name: "Jane", age: 25, score: 92 },
  { name: "Bob", age: 30, score: 78 },
  { name: "Alice", age: 22, score: 95 }
];

// Get average score of adults
const avgAdultScore = users
  .filter(user => user.age >= 18)           // Keep adults
  .map(user => user.score)                   // Get scores
  .reduce((sum, score) => sum + score, 0)    // Sum scores
  / users.filter(user => user.age >= 18).length; // Divide by count

console.log(avgAdultScore); // 88.33
```

## Comparison Chart

| Method   | Returns        | Use Case                          |
|----------|----------------|-----------------------------------|
| map()    | New array      | Transform each item               |
| filter() | New array      | Keep items that match condition   |
| reduce() | Single value   | Combine all items into one thing  |

## Practice Exercises

```javascript
// Exercise 1: Use map
const temperatures = [0, 10, 20, 30];
// Convert to Fahrenheit: (C × 9/5) + 32
const fahrenheit = temperatures.map(c => (c * 9/5) + 32);

// Exercise 2: Use filter
const words = ["spray", "limit", "elite", "exuberant", "destruction"];
// Get words longer than 6 characters
const longWords = words.filter(word => word.length > 6);

// Exercise 3: Use reduce
const expenses = [10.25, 5.50, 15.75, 3.00];
// Calculate total
const totalExpenses = expenses.reduce((sum, amount) => sum + amount, 0);

// Exercise 4: Chain them
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// Get sum of even numbers doubled
const result = numbers
  .filter(num => num % 2 === 0)  // [2, 4, 6, 8, 10]
  .map(num => num * 2)           // [4, 8, 12, 16, 20]
  .reduce((sum, num) => sum + num, 0); // 60
```

---

## <a name="promises">6️⃣ Promises

## What is a Promise?

An object representing the eventual completion (or failure) of an asynchronous operation.

**Think of it like:** Ordering food delivery

- **Pending**: Food is being prepared
- **Fulfilled**: Food arrived! 🎉
- **Rejected**: Restaurant closed 😞

## Basic Promise

```javascript
// Creating a promise
const myPromise = new Promise((resolve, reject) => {
  const success = true;
  
  if (success) {
    resolve("It worked!"); // Success
  } else {
    reject("It failed!"); // Failure
  }
});

// Using the promise
myPromise
  .then(result => console.log(result))    // "It worked!"
  .catch(error => console.log(error));    // If rejected
```

## Real Promise Example: Delayed Response

```javascript
function wait(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`Waited ${ms}ms`);
    }, ms);
  });
}

wait(2000)
  .then(message => console.log(message)); // After 2 seconds: "Waited 2000ms"
```

## Promise States

```javascript
const promise = new Promise((resolve, reject) => {
  // State 1: PENDING (promise is working)
  
  setTimeout(() => {
    const random = Math.random();
    
    if (random > 0.5) {
      // State 2: FULFILLED (success!)
      resolve("Success!");
    } else {
      // State 3: REJECTED (failure!)
      reject("Failed!");
    }
  }, 1000);
});

promise
  .then(result => console.log(result))   // Handles fulfilled
  .catch(error => console.log(error));   // Handles rejected
```

## Chaining Promises

```javascript
function step1() {
  return new Promise(resolve => {
    setTimeout(() => resolve("Step 1 complete"), 1000);
  });
}

function step2() {
  return new Promise(resolve => {
    setTimeout(() => resolve("Step 2 complete"), 1000);
  });
}

function step3() {
  return new Promise(resolve => {
    setTimeout(() => resolve("Step 3 complete"), 1000);
  });
}

// Chain them
step1()
  .then(result => {
    console.log(result); // "Step 1 complete"
    return step2();
  })
  .then(result => {
    console.log(result); // "Step 2 complete"
    return step3();
  })
  .then(result => {
    console.log(result); // "Step 3 complete"
  })
  .catch(error => {
    console.log("Error:", error);
  });
```

## Promise.all() - Wait for multiple promises

```javascript
const promise1 = Promise.resolve(3);
const promise2 = new Promise(resolve => setTimeout(() => resolve('foo'), 100));
const promise3 = new Promise(resolve => setTimeout(() => resolve('bar'), 200));

Promise.all([promise1, promise2, promise3])
  .then(results => {
    console.log(results); // [3, 'foo', 'bar']
  });

// Real example: Fetch multiple users
const user1 = fetch('/api/user/1').then(r => r.json());
const user2 = fetch('/api/user/2').then(r => r.json());
const user3 = fetch('/api/user/3').then(r => r.json());

Promise.all([user1, user2, user3])
  .then(users => {
    console.log("All users loaded:", users);
  });
```

## Real-World Example: API Call

```javascript
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    fetch(`https://api.example.com/users/${id}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          reject("User not found");
        }
      })
      .then(data => resolve(data))
      .catch(error => reject(error));
  });
}

fetchUser(123)
  .then(user => {
    console.log("User:", user);
  })
  .catch(error => {
    console.log("Error:", error);
  });
```

---

## <a name="async-await">7️⃣ Async/Await

## What is it?

A cleaner way to work with Promises. Makes async code look synchronous!

## Basic Syntax

```javascript
// Old way (Promises with .then)
function getUser() {
  fetch('/api/user')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error));
}

// ✅ New way (async/await)
async function getUser() {
  try {
    const response = await fetch('/api/user');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}
```

## The Rules

1. `async` keyword goes before function
2. `await` can only be used inside `async` functions
3. `await` pauses execution until Promise resolves
4. Always use `try/catch` for errors

## Simple Example

```javascript
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function demo() {
  console.log('Start');
  
  await wait(2000); // Wait 2 seconds
  
  console.log('2 seconds later');
  
  await wait(1000); // Wait 1 more second
  
  console.log('3 seconds total');
}

demo();
// Output:
// Start (immediately)
// 2 seconds later (after 2s)
// 3 seconds total (after 3s total)
```

## Real Example: Fetch Data

```javascript
async function getUsers() {
  try {
    // Wait for response
    const response = await fetch('https://api.example.com/users');
    
    // Check if successful
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    
    // Wait for JSON parsing
    const users = await response.json();
    
    console.log(users);
    return users;
    
  } catch (error) {
    console.error('Error:', error);
  }
}

getUsers();
```

## Multiple Async Operations

```javascript
// ❌ Sequential (slow - one after another)
async function getSlow() {
  const user = await fetch('/api/user').then(r => r.json());     // Wait
  const posts = await fetch('/api/posts').then(r => r.json());   // Then wait
  const comments = await fetch('/api/comments').then(r => r.json()); // Then wait
  
  return { user, posts, comments };
}

// ✅ Parallel (fast - all at once!)
async function getFast() {
  const [user, posts, comments] = await Promise.all([
    fetch('/api/user').then(r => r.json()),
    fetch('/api/posts').then(r => r.json()),
    fetch('/api/comments').then(r => r.json())
  ]);
  
  return { user, posts, comments };
}
```

## Error Handling

```javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    if (error.message.includes('HTTP error')) {
      console.log('Server error');
    } else if (error.name === 'TypeError') {
      console.log('Network error');
    } else {
      console.log('Unknown error:', error);
    }
  }
}
```

## Real-World Examples

```javascript
// Example 1: Login function
async function login(email, password) {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const data = await response.json();
    localStorage.setItem('token', data.token);
    
    return data.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Example 2: Load user profile
async function loadProfile(userId) {
  try {
    // Get user data
    const userResponse = await fetch(`/api/users/${userId}`);
    const user = await userResponse.json();
    
    // Get user's posts
    const postsResponse = await fetch(`/api/users/${userId}/posts`);
    const posts = await postsResponse.json();
    
    // Display on page
    displayUser(user);
    displayPosts(posts);
    
  } catch (error) {
    showError('Failed to load profile');
  }
}

// Example 3: Form submission
async function submitForm(formData) {
  try {
    showLoading();
    
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    if (response.ok) {
      showSuccess('Message sent!');
    } else {
      throw new Error('Submission failed');
    }
    
  } catch (error) {
    showError('Failed to send message');
  } finally {
    hideLoading(); // Always runs
  }
}
```

## Practice Exercises

```javascript
// Exercise 1: Create a delay function
async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function test() {
  console.log('Start');
  await delay(1000);
  console.log('1 second passed');
  await delay(1000);
  console.log('2 seconds passed');
}

// Exercise 2: Fetch and process data
async function getTopUsers() {
  try {
    const response = await fetch('/api/users');
    const users = await response.json();
    
    // Get users with score > 90
    const topUsers = users.filter(user => user.score > 90);
    
    return topUsers;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// Exercise 3: Sequential API calls
async function getUserPosts(userId) {
  try {
    // First get the user
    const userRes = await fetch(`/api/users/${userId}`);
    const user = await userRes.json();
    
    // Then get their posts
    const postsRes = await fetch(`/api/users/${userId}/posts`);
    const posts = await postsRes.json();
    
    return {
      userName: user.name,
      postCount: posts.length,
      posts: posts
    };
  } catch (error) {
    console.error('Error:', error);
  }
}
```

---

## <a name="modules">8️⃣ Modules (import/export)

## What are Modules?

A way to split code into separate files and share between them.

## Why Use Modules?

- ✅ Organize code better
- ✅ Reuse code across files
- ✅ Avoid naming conflicts
- ✅ Easier to maintain

## Named Exports

```javascript
// ========== math.js ==========
// Export individual items
export const pi = 3.14159;

export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

// Or export all at once
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

export { multiply, divide };
```

```javascript
// ========== main.js ==========
// Import specific items
import { add, subtract, pi } from './math.js';

console.log(add(2, 3));      // 5
console.log(subtract(5, 2)); // 3
console.log(pi);             // 3.14159

// Import with different name
import { add as sum } from './math.js';
console.log(sum(1, 2)); // 3

// Import everything
import * as math from './math.js';
console.log(math.add(1, 2));      // 3
console.log(math.pi);             // 3.14159
```

## Default Export

```javascript
// ========== User.js ==========
// Only ONE default export per file
export default class User {
  constructor(name) {
    this.name = name;
  }
  
  greet() {
    return `Hello, I'm ${this.name}`;
  }
}

// Or with functions
export default function greet(name) {
  return `Hello, ${name}!`;
}
```

```javascript
// ========== main.js ==========
// Import default (can use any name)
import User from './User.js';

const user = new User('John');
console.log(user.greet()); // "Hello, I'm John"

// Can name it anything
import MyUser from './User.js'; // Same thing!
```

## Mixing Named and Default Exports

```javascript
// ========== utils.js ==========
// Default export
export default function mainFunction() {
  return "Main";
}

// Named exports
export const helper1 = () => "Helper 1";
export const helper2 = () => "Helper 2";
```

```javascript
// ========== main.js ==========
// Import both
import mainFunction, { helper1, helper2 } from './utils.js';

console.log(mainFunction()); // "Main"
console.log(helper1());      // "Helper 1"
```

## Real-World Example: Todo App

```javascript
// ========== api.js ==========
const API_URL = 'https://api.example.com';

export async function getTodos() {
  const response = await fetch(`${API_URL}/todos`);
  return await response.json();
}

export async function createTodo(text) {
  const response = await fetch(`${API_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, completed: false })
  });
  return await response.json();
}

export async function deleteTodo(id) {
  await fetch(`${API_URL}/todos/${id}`, {
    method: 'DELETE'
  });
}
```

```javascript
// ========== ui.js ==========
export function displayTodos(todos) {
  const container = document.querySelector('.todos');
  container.innerHTML = todos
    .map(todo => `
      <div class="todo">
        <span>${todo.text}</span>
        <button data-id="${todo.id}">Delete</button>
      </div>
    `)
    .join('');
}

export function showLoading() {
  document.querySelector('.loader').style.display = 'block';
}

export function hideLoading() {
  document.querySelector('.loader').style.display = 'none';
}
```

```javascript
// ========== main.js ==========
import { getTodos, createTodo, deleteTodo } from './api.js';
import { displayTodos, showLoading, hideLoading } from './ui.js';

async function loadTodos() {
  showLoading();
  const todos = await getTodos();
  displayTodos(todos);
  hideLoading();
}

async function addTodo(text) {
  await createTodo(text);
  await loadTodos(); // Refresh list
}

// Start app
loadTodos();
```

## HTML Setup for Modules

```html
<!-- IMPORTANT: Add type="module" to script tag -->
<!DOCTYPE html>
<html>
<head>
  <title>My App</title>
</head>
<body>
  <div class="todos"></div>
  <div class="loader">Loading...</div>
  
  <!-- This enables modules -->
  <script type="module" src="main.js"></script>
</body>
</html>
```

## Practice Exercise

```javascript
// ========== Exercise: Create a user management system ==========

// ========== user.js ==========
// TODO: Export a User class with name and email
// TODO: Add a getInfo() method that returns user details
export default class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  
  getInfo() {
    return `${this.name} (${this.email})`;
  }
}

// ========== validation.js ==========
// TODO: Export functions to validate email and name
export function isValidEmail(email) {
  return email.includes('@');
}

export function isValidName(name) {
  return name.length >= 2;
}

// ========== main.js ==========
// TODO: Import User class and validation functions
// TODO: Create a user and validate their data
import User from './user.js';
import { isValidEmail, isValidName } from './validation.js';

const user = new User('John', 'john@example.com');

if (isValidName(user.name) && isValidEmail(user.email)) {
  console.log('Valid user:', user.getInfo());
} else {
  console.log('Invalid user data');
}
```

---

## <a name="classes">9️⃣ Classes

## What are Classes?

A blueprint for creating objects with shared properties and methods.

## Basic Class

```javascript
// Define a class
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  greet() {
    return `Hi, I'm ${this.name}`;
  }
  
  haveBirthday() {
    this.age++;
    return `I'm now ${this.age}!`;
  }
}

// Create instances (objects)
const john = new Person('John', 30);
const jane = new Person('Jane', 25);

console.log(john.greet());        // "Hi, I'm John"
console.log(john.haveBirthday()); // "I'm now 31!"
console.log(jane.greet());        // "Hi, I'm Jane"
```

## Constructor

```javascript
class Car {
  // Constructor runs when you create a new Car
  constructor(brand, model, year) {
    this.brand = brand;
    this.model = model;
    this.year = year;
    this.mileage = 0;
  }
  
  drive(miles) {
    this.mileage += miles;
    return `Drove ${miles} miles. Total: ${this.mileage}`;
  }
  
  getInfo() {
    return `${this.year} ${this.brand} ${this.model}`;
  }
}

const myCar = new Car('Toyota', 'Camry', 2020);
console.log(myCar.getInfo()); // "2020 Toyota Camry"
console.log(myCar.drive(100)); // "Drove 100 miles. Total: 100"
```

## Getters and Setters

```javascript
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
  
  // Getter - access like a property
  get area() {
    return this.width * this.height;
  }
  
  // Setter - set like a property
  set dimensions(dims) {
    this.width = dims.width;
    this.height = dims.height;
  }
}

const rect = new Rectangle(10, 5);
console.log(rect.area); // 50 (no parentheses!)

rect.dimensions = { width: 20, height: 10 };
console.log(rect.area); // 200
```

## Static Methods

```javascript
class MathHelper {
  // Static method - called on class, not instance
  static add(a, b) {
    return a + b;
  }
  
  static multiply(a, b) {
    return a * b;
  }
}

// Call without creating instance
console.log(MathHelper.add(2, 3));      // 5
console.log(MathHelper.multiply(4, 5)); // 20

// Can't call on instance
const helper = new MathHelper();
// helper.add(1, 2); // ERROR!
```

## Inheritance (extends)

```javascript
// Parent class
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    return `${this.name} makes a sound`;
  }
}

// Child class
class Dog extends Animal {
  constructor(name, breed) {
    super(name); // Call parent constructor
    this.breed = breed;
  }
  
  // Override parent method
  speak() {
    return `${this.name} barks!`;
  }
  
  // New method
  getBreed() {
    return `${this.name} is a ${this.breed}`;
  }
}

const dog = new Dog('Max', 'Golden Retriever');
console.log(dog.speak());    // "Max barks!"
console.log(dog.getBreed()); // "Max is a Golden Retriever"
```

## Real-World Example: Todo App

```javascript
class Todo {
  static idCounter = 0; // Track IDs
  
  constructor(text) {
    this.id = ++Todo.idCounter;
    this.text = text;
    this.completed = false;
    this.createdAt = new Date();
  }
  
  toggle() {
    this.completed = !this.completed;
  }
  
  update(newText) {
    this.text = newText;
  }
  
  get status() {
    return this.completed ? 'Completed' : 'Active';
  }
}

class TodoList {
  constructor() {
    this.todos = [];
  }
  
  add(text) {
    const todo = new Todo(text);
    this.todos.push(todo);
    return todo;
  }
  
  remove(id) {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }
  
  toggle(id) {
    const todo = this.todos.find(todo => todo.id === id);
    if (todo) todo.toggle();
  }
  
  get active() {
    return this.todos.filter(todo => !todo.completed);
  }
  
  get completed() {
    return this.todos.filter(todo => todo.completed);
  }
}

// Usage
const myList = new TodoList();
myList.add('Buy milk');
myList.add('Walk dog');
myList.add('Code');

myList.toggle(1); // Complete first todo

console.log('Active:', myList.active);
console.log('Completed:', myList.completed);
```

## Practice Exercises

```javascript
// Exercise 1: Create a BankAccount class
class BankAccount {
  constructor(owner, balance = 0) {
    this.owner = owner;
    this.balance = balance;
  }
  
  deposit(amount) {
    this.balance += amount;
    return `Deposited $${amount}. New balance: $${this.balance}`;
  }
  
  withdraw(amount) {
    if (amount > this.balance) {
      return 'Insufficient funds';
    }
    this.balance -= amount;
    return `Withdrew $${amount}. New balance: $${this.balance}`;
  }
  
  get info() {
    return `${this.owner}: $${this.balance}`;
  }
}

const account = new BankAccount('John', 1000);
console.log(account.deposit(500));
console.log(account.withdraw(200));
console.log(account.info);

// Exercise 2: Create a Product class
class Product {
  constructor(name, price, stock) {
    this.name = name;
    this.price = price;
    this.stock = stock;
  }
  
  buy(quantity) {
    if (quantity > this.stock) {
      return 'Not enough stock';
    }
    this.stock -= quantity;
    return `Bought ${quantity} ${this.name}. ${this.stock} left.`;
  }
  
  restock(quantity) {
    this.stock += quantity;
    return `Added ${quantity}. Now ${this.stock} in stock.`;
  }
  
  get available() {
    return this.stock > 0;
  }
}

// Exercise 3: Extend Product to create DiscountProduct
class DiscountProduct extends Product {
  constructor(name, price, stock, discount) {
    super(name, price, stock);
    this.discount = discount; // percentage
  }
  
  get finalPrice() {
    return this.price * (1 - this.discount / 100);
  }
}

const sale = new DiscountProduct('Laptop', 1000, 5, 20);
console.log(sale.finalPrice); // 800
```

---

## 🎯 Quick Reference Summary

```javascript
// Arrow Functions
const add = (a, b) => a + b;

// Template Literals
const msg = `Hello ${name}!`;

// Destructuring
const { name, age } = user;
const [first, second] = array;

// Spread
const combined = [...arr1, ...arr2];
const updated = { ...obj, newProp: 'value' };

// Map
const doubled = nums.map(n => n * 2);

// Filter
const evens = nums.filter(n => n % 2 === 0);

// Reduce
const sum = nums.reduce((total, n) => total + n, 0);

// Async/Await
async function getData() {
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

// Import/Export
export const util = () => {};
import { util } from './file.js';

// Classes
class User {
  constructor(name) {
    this.name = name;
  }
  greet() {
    return `Hi ${this.name}`;
  }
}
```

---
