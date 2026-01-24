# ✏️ Intermediate JavaScript Study Notes

## 📚 Table of Contents

- [🎲 Randomness with Math.random()](#randomness)
- [🚦 Control Flow: Logic & Conditionals](#control-flow)
- [📦 Working with Arrays](#arrays)
- [🔄 While Loops vs. For Loops](#loops)

---

## <a name="randomness"></a>🎲 Randomness with Math.random()

> **💡 Key Concept:** JavaScript's random function isn't truly random (it's "pseudo-random"), but it's perfect for most games and logic.

### 🎯 How it Works

`Math.random()` generates a decimal between $0$ (inclusive) and $1$ (exclusive).

### 🔢 The "Whole Number" Trick

To get a range, multiply the decimal by your maximum number and use `Math.floor()` to chop off the decimals.

#### Example: A 6-sided Dice Roller

```javascript
var diceRoll = Math.floor(Math.random() * 6) + 1;
console.log("You rolled a: " + diceRoll);
```

**How it works:**

1. `Math.random()` → generates `0.0` to `0.999...`
2. Multiply by `6` → generates `0.0` to `5.999...`
3. `Math.floor()` → rounds down to `0`, `1`, `2`, `3`, `4`, or `5`
4. Add `1` → final range: `1`, `2`, `3`, `4`, `5`, or `6`

### ✅ Section Summary

| Function                         | Returns                                 | Example                                |
|:--------------------------------:|:---------------------------------------:|:--------------------------------------:|
| `Math.random()`                  | Decimal between 0 and 1                 | `0.8472...`                            |
| `Math.floor(n)`                  | Rounds down to integer                  | `Math.floor(3.9)` → `3`                |
| **Formula**                      | `Math.floor(Math.random() * max) + min` | Range from min to max                  |

---

## <a name="control-flow"></a>🚦 Control Flow: Logic & Conditionals

> **💡 Key Concept:** Conditionals allow your code to "branch" based on whether a statement is truthy or falsy.

### ⚖️ Comparators & Equality

| Operator | Name              | Example (x = 10)       | Result |
|:--------:|:-----------------:|:----------------------:|:------:|
| `===`    | Strict Equality   | `x === "10"`           | `false`|
| `!==`    | Strict Inequality | `x !== 20`             | `true` |
| `&&`     | Logical AND       | `x > 5 && x < 15`      | `true` |
| `\|\|`   | Logical OR        | `x === 10 \|\| x === 5`| `true` |

### 🔍 Additional Operators

| Operator | Name                     | Example   | Result |
|:--------:|:------------------------:|:---------:|:------:|
| `>`      | Greater than             | `10 > 5`  | `true` |
| `<`      | Less than                | `10 < 5`  | `false`|
| `>=`     | Greater than or equal    | `10 >= 10`| `true` |
| `<=`     | Less than or equal       | `10 <= 5` | `false`|

### 🌳 If/Else Structure

> **💡 Key Concept:** If/else statements execute different code blocks based on conditions. Only ONE block will run.

#### Basic If Statement

```javascript
if (condition) {
    // Runs if condition is true
}
```

#### If/Else

```javascript
if (condition) {
    // Runs if condition is true
} else {
    // Runs if condition is false
}
```

#### If/Else If/Else

```javascript
if (condition1) {
    // Runs if condition1 is true
} else if (condition2) {
    // Runs if condition1 is false AND condition2 is true
} else {
    // Runs if ALL conditions are false
}
```

**⚠️ Important Rules:**

- Conditions are checked **top to bottom**
- Only the **first matching** condition executes
- Once a condition is true, remaining conditions are **skipped**
- `else` is optional (but recommended for handling all cases)

### 🧪 Example: The Love Calculator

```javascript
var score = Math.floor(Math.random() * 100) + 1;

if (score > 70) {
    alert("You love each other like Kanye loves Kanye!");
} else if (score > 30 && score <= 70) {
    alert("There's potential here.");
} else {
    alert("Run away. Fast.");
}
```

**How it works:**

1. Generate random score between 1-100
2. Check conditions from top to bottom
3. Execute the first matching block
4. Skip remaining conditions

### 🎯 If/Else Flow Diagram

```javascript
var age = 18;

if (age < 13) {
    console.log("Child");
} else if (age < 18) {
    console.log("Teenager");
} else if (age < 65) {
    console.log("Adult");        // ✅ This runs (18 < 65)
} else {
    console.log("Senior");       // ❌ Skipped (condition already met)
}
```

**Order matters:**

```javascript
// ❌ BAD: This will never work correctly
if (age < 65) {
    console.log("Adult");        // ✅ Runs first for age 18
} else if (age < 18) {
    console.log("Teenager");     // ❌ Never reached for teenagers!
}

// ✅ GOOD: Start with most specific conditions
if (age < 13) {
    console.log("Child");
} else if (age < 18) {
    console.log("Teenager");
} else if (age < 65) {
    console.log("Adult");
}
```

### ✅ Section Summary

| Concept            | Key Point                                              |
|:------------------:|:------------------------------------------------------:|
| **`===` vs `==`**  | Always use `===` (checks value AND type)               |
| **`&&`**           | Both conditions must be true                           |
| **`\|\|`**         | At least one condition must be true                    |
| **if/else if/else**| Executes first matching condition only                 |
| **Condition order**| Most specific conditions should come first             |
| **else block**     | Catches all remaining cases (optional but recommended) |

---

## <a name="arrays"></a>📦 Working with Arrays (Deep Dive)

> **💡 Key Concept:** Arrays are zero-indexed collections, meaning the first item is always at position `[0]`.

### 🔑 Key Array Methods

| Method        | Purpose              | Returns      | Example                        |
|:-------------:|:--------------------:|:------------:|:------------------------------:|
| `.length`     | Number of items      | Number       | `arr.length` → `3`             |
| `.includes()` | Check if item exists | Boolean      | `arr.includes("Pam")` → `true` |
| `.push()`     | Add to end           | New length   | `arr.push("James")` → `4`      |
| `.pop()`      | Remove from end      | Removed item | `arr.pop()` → `"James"`        |

### 🧪 Example: Managing a Guest List

```javascript
var guestList = ["Angela", "Jack", "Pam"];

// Adding a new guest
guestList.push("James"); 

// Checking the list
var nameToCheck = "Pam";
if (guestList.includes(nameToCheck)) {
    console.log(nameToCheck + " is on the list!");
}

// Checking the total number of guests
console.log("Total guests: " + guestList.length); // Output: 4
```

### 📋 Array Index Reference

```javascript
var fruits = ["Apple", "Banana", "Cherry"];
//             [0]      [1]       [2]

console.log(fruits[0]);  // "Apple"
console.log(fruits[2]);  // "Cherry"
console.log(fruits[3]);  // undefined (doesn't exist)
```

### ⚠️ Common Mistakes

| Mistake                           | Why it's wrong      | Correct way                       |
|:---------------------------------:|:-------------------:|:---------------------------------:|
| `arr[arr.length]`                 | Index out of bounds | `arr[arr.length - 1]` (last item) |
| `arr.includes(5)` on string array | Type mismatch       | `arr.includes("5")`               |
| Forgetting arrays start at 0      | Logic errors        | Remember: first item = `[0]`      |

### ✅ Section Summary

| Concept                  | Key Point                         |
|:------------------------:|:---------------------------------:|
| **Zero-indexed**         | First item is `[0]`, not `[1]`    |
| **`.length`**            | Total count (not the last index)  |
| **`.includes()`**        | Checks existence (case-sensitive) |
| **`.push()` / `.pop()`** | Add/remove from the end           |

---

## <a name="loops"></a>🔄 While Loops vs. For Loops

> **💡 Key Concept:** The biggest difference is intent. Use `while` for conditions, `for` for counts.

### 🔁 The While Loop (State-based)

Used when you want to keep doing something **until a condition changes**.

```javascript
var i = 1;
while (i <= 5) {
    console.log("Iteration number: " + i);
    i++; // Don't forget to increment!
}
```

**⚠️ Warning:** If the condition never becomes `false`, you create an **infinite loop**, which will crash your browser!

```javascript
// ❌ DANGER: Infinite loop
var i = 1;
while (i <= 5) {
    console.log("This will run forever!");
    // Missing i++ means i is always 1
}
```

### 🔂 The For Loop (Count-based)

Used when you know **exactly how many times** you want to iterate (usually over a range or an array).

```javascript
// Structure: for (Start; Condition; Step)
for (var i = 0; i < guestList.length; i++) {
    console.log("Welcome, " + guestList[i]);
}
```

**How it works:**

1. **Start:** `var i = 0` (runs once at the beginning)
2. **Condition:** `i < guestList.length` (checked before each iteration)
3. **Step:** `i++` (runs after each iteration)

### 🧪 Practical Examples

#### Counting to 10

```javascript
// For loop (when you know the count)
for (var i = 1; i <= 10; i++) {
    console.log(i);
}
```

#### Waiting for User Input

```javascript
// While loop (when condition is uncertain)
var correctPassword = "secret123";
var userInput = "";

while (userInput !== correctPassword) {
    userInput = prompt("Enter password:");
}
alert("Access granted!");
```

#### Iterating Through an Array

```javascript
var colors = ["red", "green", "blue"];

// For loop is cleaner for arrays
for (var i = 0; i < colors.length; i++) {
    console.log("Color: " + colors[i]);
}
```

### ⚖️ When to Use Which?

| Use Case                                 | Recommended Loop |
|:----------------------------------------:|:----------------:|
| Running code 100 times                   | `for` loop       |
| Iterating through every item in an array | `for` loop       |
| Waiting for a specific user input        | `while` loop     |
| Repeating a game until the player dies   | `while` loop     |
| Counting from 1 to N                     | `for` loop       |
| Unknown number of iterations             | `while` loop     |

### 🎯 Loop Comparison

| Feature            | While Loop                    | For Loop                      |
|:------------------:|:-----------------------------:|:-----------------------------:|
| **Best for**       | Condition-based repetition    | Count-based repetition        |
| **Syntax**         | Simple condition              | Three-part structure          |
| **Iteration count**| Unknown beforehand            | Known beforehand              |
| **Common use**     | User input, game loops        | Array iteration, counting     |
| **Risk**           | Easy to create infinite loops | Safer with built-in counter   |

### ✅ Section Summary

| Concept             | Key Point                                     |
|:-------------------:|:---------------------------------------------:|
| **`while` loop**    | Runs until condition is false                 |
| **`for` loop**      | Runs a specific number of times               |
| **Infinite loops**  | Always ensure your condition can become false |
| **Array iteration** | `for` loop with `.length` is standard         |

---

## 🔗 Useful Resources

- **MDN Array Methods:** [developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- **MDN Math.random():** [developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Math/random](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
- **Conditional Statements:** [developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/if...else](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else)
- **Loops Guide:** [developer.mozilla.org/docs/Web/JavaScript/Guide/Loops_and_iteration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration)

---

## 🧾 Summary

JavaScript provides **`Math.random()`** for generating pseudo-random numbers, perfect for games and simulations. **Conditionals** (`if/else if/else`) use comparison operators (`===`, `!==`, `&&`, `||`) to create branching logic. **Arrays** are zero-indexed collections with key methods like `.length`, `.includes()`, `.push()`, and `.pop()`. **`while` loops** run until a condition changes (state-based), while **`for` loops** run a specific number of times (count-based) - use `for` for arrays and counting, `while` for uncertain conditions.

---
