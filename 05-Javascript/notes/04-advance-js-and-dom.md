# ✏️ Advanced JavaScript and DOM Manipulation

## 📚 Table of Contents

- [🎧 Event Listeners](#event-listeners)
- [🔼 Higher-Order Functions & Callbacks](#higher-order-functions)
- [🛠️ Developer Tools & Debugging](#developer-tools)
- [🔤 Anonymous vs. Named Functions](#anonymous-named)
- [🎵 Playing Sounds on Websites](#playing-sounds)
- [🔀 Switch Statements](#switch-statements)
- [📦 JavaScript Objects](#javascript-objects)
- [🏗️ Constructor Functions](#constructor-functions)
- [📝 Naming Conventions in JavaScript](#naming-conventions)
- [⚙️ Methods and Calling Methods](#methods)
- [⌨️ Keyboard Events](#keyboard-events)
- [✨ Adding Animations](#adding-animations)

---

## <a name="event-listeners"></a>🎧 Event Listeners

> **💡 Key Concept:** Event listeners "watch" for user interactions (clicks, keypresses, hovers) and execute code when those events occur.

### 🎯 What is an Event Listener?

An **event listener** waits for a specific event to happen on an element, then runs a function in response.

**Common Events:**

- `click` - User clicks the element
- `keydown` - User presses a key
- `keyup` - User releases a key
- `mouseover` - Mouse hovers over element
- `mouseout` - Mouse leaves element
- `change` - Input value changes
- `submit` - Form is submitted

### 📝 Basic Syntax

```javascript
element.addEventListener(eventType, functionName);
```

| Parameter     | Description                           | Example           |
|:-------------:|:-------------------------------------:|:-----------------:|
| `eventType`   | Type of event to listen for (string)  | `"click"`         |
| `functionName`| Code to run when event happens        | `handleClick`     |

### 🔧 Adding Event Listeners

#### Example 1: Simple Click Handler

```javascript
document.querySelector("button").addEventListener("click", handleClick);

function handleClick() {
  alert("Button was clicked!");
}
```

**⚠️ Key Detail:** Pass the function name **without parentheses** `()`. You're passing the function itself, not calling it immediately.

```javascript
// ❌ Wrong: Calls function immediately
document.querySelector("button").addEventListener("click", handleClick());

// ✅ Right: Passes function to be called later
document.querySelector("button").addEventListener("click", handleClick);
```

#### Example 2: Adding Listeners to Multiple Elements

```javascript
var buttons = document.querySelectorAll(".drum");

// Add listener to each button using a loop
for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function() {
    alert("Drum button clicked!");
  });
}
```

#### Example 3: Using `this` Inside Event Listeners

The `this` keyword refers to the element that triggered the event.

```javascript
document.querySelector("button").addEventListener("click", function() {
  this.style.color = "white";  // 'this' refers to the button
});
```

### 🎨 Practical Example: Button Color Change

```javascript
var buttons = document.querySelectorAll(".btn");

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function() {
    this.classList.toggle("active");
  });
}
```

### 📚 Resources

- **MDN addEventListener:** [developer.mozilla.org/docs/Web/API/EventTarget/addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
- **MDN DOM Events:** [developer.mozilla.org/docs/Web/API/Document_Object_Model/Events](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Events)

### ✅ Section Summary

| Concept              | Key Point                                        |
|:--------------------:|:------------------------------------------------:|
| **Event Listener**   | Waits for events and executes functions          |
| **No parentheses**   | Pass function name, don't call it immediately    |
| **`this` keyword**   | Refers to element that triggered the event       |
| **Multiple elements**| Use loops to add listeners to multiple elements  |

---

## <a name="higher-order-functions"></a>🔼 Higher-Order Functions & Callbacks

> **💡 Key Concept:** Higher-order functions are functions that take other functions as arguments or return functions. Callback functions are functions passed to other functions to be executed later.

### 🔄 What are Higher-Order Functions?

A **higher-order function** is a function that does at least one of the following:

1. Takes one or more functions as arguments
2. Returns a function as its result

**Common Examples:**

- `addEventListener()` - Takes a callback function
- `setTimeout()` - Takes a callback function
- `map()`, `filter()`, `reduce()` - Array methods that take callbacks

### 📞 What are Callback Functions?

A **callback function** is a function passed into another function as an argument, which is then invoked inside the outer function.

```javascript
function calculator(num1, num2, operator) {
  return operator(num1, num2);  // operator is the callback
}

function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

// Passing functions as arguments
calculator(3, 4, add);       // Returns: 7
calculator(3, 4, multiply);  // Returns: 12
```

### 🎯 Real-World Example: Event Listeners

```javascript
// addEventListener is a higher-order function
// handleClick is the callback function
document.querySelector("button").addEventListener("click", handleClick);

function handleClick() {
  console.log("Button clicked!");
}
```

**What's happening:**

1. `addEventListener` is the higher-order function
2. `handleClick` is the callback function
3. When the click event occurs, `addEventListener` calls `handleClick`

### ⏱️ Example: setTimeout (Higher-Order Function)

```javascript
setTimeout(function() {
  console.log("This runs after 2 seconds");
}, 2000);
```

**Breakdown:**

- `setTimeout` is the higher-order function
- The anonymous function is the callback
- `setTimeout` calls the callback after 2000 milliseconds

### 🔗 Callback Chain Example

```javascript
function greet(name, callback) {
  console.log("Hello " + name);
  callback();
}

function sayGoodbye() {
  console.log("Goodbye!");
}

greet("Alice", sayGoodbye);
// Output:
// Hello Alice
// Goodbye!
```

### 📊 Benefits of Higher-Order Functions

| Benefit              | Explanation                                         |
|:--------------------:|:---------------------------------------------------:|
| **Code Reusability** | Write generic functions that work with any callback |
| **Abstraction**      | Hide complex implementation details                 |
| **Flexibility**      | Change behavior by passing different callbacks      |

### ✅ Section Summary

| Concept                   | Key Point                                        |
|:-------------------------:|:------------------------------------------------:|
| **Higher-Order Function** | Function that takes or returns functions         |
| **Callback Function**     | Function passed as argument to another function  |
| **addEventListener**      | Classic example of higher-order function         |
| **Flexibility**           | Allows for more modular and reusable code        |

---

## <a name="developer-tools"></a>🛠️ Developer Tools & Debugging

> **💡 Key Concept:** Browser developer tools provide powerful ways to inspect, test, and debug your JavaScript code in real-time.

### 🔍 The `$0` Variable (Console Shortcut)

The `$0` variable in the browser console always refers to the **most recently selected element** in the Elements/Inspector tab.

#### How to Use `$0`

1. Open Developer Tools (F12 or Right-Click → Inspect)
2. Go to the **Elements** tab
3. Click on any element
4. Switch to the **Console** tab
5. Type `$0` and press Enter

```javascript
// In console after selecting an element
$0                    // Returns the selected element
$0.style.color = "red"  // Changes its color
$0.innerHTML          // Gets its content
```

**Additional Console Variables:**

- `$1` - Previously selected element
- `$2` - Element selected before that
- `$_` - Result of last expression

### 🐛 The `debugger` Statement

The `debugger` statement pauses code execution and opens the debugger if available.

```javascript
function calculateTotal(price, quantity) {
  debugger;  // Execution pauses here
  var total = price * quantity;
  return total;
}

calculateTotal(10, 5);
```

**When `debugger` runs:**

1. Code execution freezes
2. Developer Tools opens automatically
3. You can inspect variables
4. Step through code line by line

### 🎮 Debugger Controls

| Button/Key     | Action                          |
|:--------------:|:-------------------------------:|
| **F8 / ▶️**    | Resume script execution         |
| **F10 / ⤵️**   | Step over (next line)           |
| **F11 / ⬇️**   | Step into (enter function)      |
| **Shift+F11**  | Step out (exit function)        |

### 🔧 Practical Debugging Workflow

```javascript
var buttons = document.querySelectorAll(".btn");

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function() {
    debugger;  // Pause when any button is clicked
    console.log("Button clicked: ", this);
    this.classList.toggle("active");
  });
}
```

### 💡 Console Methods for Debugging

| Method              | Purpose                          | Example                           |
|:-------------------:|:--------------------------------:|:---------------------------------:|
| `console.log()`     | Print values                     | `console.log(variable)`           |
| `console.error()`   | Print error messages             | `console.error("Error!")`         |
| `console.warn()`    | Print warnings                   | `console.warn("Warning!")`        |
| `console.table()`   | Display data as table            | `console.table(array)`            |
| `console.clear()`   | Clear console                    | `console.clear()`                 |

### ✅ Section Summary

| Concept        | Key Point                                        |
|:--------------:|:------------------------------------------------:|
| **`$0`**       | References currently selected element in DevTools|
| **`debugger`** | Pauses execution for inspection                  |
| **Step Over**  | Execute current line, move to next               |
| **Step Into**  | Enter function to debug line by line             |

---

## <a name="anonymous-named"></a>🔤 Anonymous vs. Named Functions

> **💡 Key Concept:** Functions can be named or anonymous. Named functions are easier to debug, while anonymous functions are useful for one-time use.

### 📛 Named Functions

A **named function** has an identifier that can be referenced.

```javascript
// Function declaration
function greet() {
  console.log("Hello!");
}

greet();  // Call by name
```

**Benefits:**

- ✅ Easier to debug (shows function name in stack traces)
- ✅ Can be called before declaration (hoisting)
- ✅ More readable code

### 👤 Anonymous Functions

An **anonymous function** has no name identifier.

```javascript
// Anonymous function as event listener
document.querySelector("button").addEventListener("click", function() {
  console.log("Button clicked!");
});
```

**Benefits:**

- ✅ Quick for one-time use
- ✅ No namespace pollution

### 🆚 Comparison

| Feature              | Named Function           | Anonymous Function          |
|:--------------------:|:------------------------:|:---------------------------:|
| **Debugging**        | Easy (shows name)        | Harder (shows "anonymous")  |
| **Reusability**      | Can call multiple times  | Single use typically        |
| **Hoisting**         | Yes (declarations)       | No                          |
| **Readability**      | More clear               | Less clear for complex logic|

### 📝 Converting Anonymous to Named

**Anonymous (harder to debug):**

```javascript
document.querySelector("button").addEventListener("click", function() {
  alert("Clicked!");
});
```

**Named (easier to debug):**

```javascript
function handleClick() {
  alert("Clicked!");
}

document.querySelector("button").addEventListener("click", handleClick);
```

### 🎯 When to Use Each

**Use Named Functions when:**

- Function will be reused
- Debugging is important
- Code readability matters

**Use Anonymous Functions when:**

- One-time, simple operation
- Inline callbacks with minimal logic
- Arrow functions for brevity (modern JavaScript)

### ⚡ Modern Alternative: Arrow Functions

```javascript
// Anonymous arrow function
document.querySelector("button").addEventListener("click", () => {
  console.log("Clicked!");
});

// Arrow function with parameter
var numbers = [1, 2, 3, 4];
var doubled = numbers.map(num => num * 2);
```

### ✅ Section Summary

| Concept               | Key Point                                    |
|:---------------------:|:--------------------------------------------:|
| **Named Function**    | Has identifier, easier to debug and reuse    |
| **Anonymous Function**| No name, good for one-time callbacks         |
| **Best Practice**     | Use named functions for complex logic        |
| **Arrow Functions**   | Modern syntax for anonymous functions        |

---

## <a name="playing-sounds"></a>🎵 Playing Sounds on Websites

> **💡 Key Concept:** The HTML5 Audio API allows JavaScript to play, pause, and control audio files dynamically.

### 🎼 Creating an Audio Object

```javascript
var audio = new Audio("sounds/crash.mp3");
```

This creates an audio object but **does not** play it automatically.

### ▶️ Playing Audio

```javascript
audio.play();
```

### ⏸️ Basic Audio Controls

| Method      | Description              | Example            |
|:-----------:|:------------------------:|:------------------:|
| `play()`    | Start/resume playback    | `audio.play()`     |
| `pause()`   | Pause playback           | `audio.pause()`    |
| `load()`    | Reload audio file        | `audio.load()`     |

### 🎹 Practical Example: Drum Kit

```javascript
// HTML: <button class="w">W</button>

var button = document.querySelector(".w");

button.addEventListener("click", function() {
  var audio = new Audio("sounds/crash.mp3");
  audio.play();
});
```

### 🔊 Audio Properties

| Property     | Description                    | Example                     |
|:------------:|:------------------------------:|:---------------------------:|
| `volume`     | Volume (0.0 to 1.0)            | `audio.volume = 0.5`        |
| `currentTime`| Current playback position (sec)| `audio.currentTime = 0`     |
| `duration`   | Total length (read-only)       | `audio.duration`            |
| `loop`       | Loop playback (boolean)        | `audio.loop = true`         |

### 🎮 Complete Interactive Example

```javascript
var drumButtons = document.querySelectorAll(".drum");

for (var i = 0; i < drumButtons.length; i++) {
  drumButtons[i].addEventListener("click", function() {
    var buttonKey = this.innerHTML;
    playSound(buttonKey);
  });
}

function playSound(key) {
  switch(key) {
    case "w":
      var audio = new Audio("sounds/crash.mp3");
      audio.play();
      break;
    case "a":
      var audio = new Audio("sounds/kick.mp3");
      audio.play();
      break;
    case "s":
      var audio = new Audio("sounds/snare.mp3");
      audio.play();
      break;
    default:
      console.log("No sound for: " + key);
  }
}
```

### 🎯 Performance Tip: Preload Audio

For better performance, create audio objects once and reuse them:

```javascript
// ❌ Creates new object every click (slower)
button.addEventListener("click", function() {
  var audio = new Audio("sound.mp3");
  audio.play();
});

// ✅ Creates once, reuses (faster)
var audio = new Audio("sound.mp3");
button.addEventListener("click", function() {
  audio.currentTime = 0;  // Reset to start
  audio.play();
});
```

### ⚠️ Browser Autoplay Restrictions

Modern browsers block autoplay without user interaction. Audio must be triggered by user action (click, keypress, etc.).

```javascript
// ❌ Won't work on page load (blocked by browser)
window.onload = function() {
  var audio = new Audio("music.mp3");
  audio.play();  // Blocked!
}

// ✅ Works (user interaction)
button.addEventListener("click", function() {
  var audio = new Audio("music.mp3");
  audio.play();  // Allowed!
});
```

### ✅ Section Summary

| Concept           | Key Point                                    |
|:-----------------:|:--------------------------------------------:|
| **Audio Object**  | Created with `new Audio("path/to/file.mp3")` |
| **play()**        | Starts audio playback                        |
| **Preloading**    | Create once, reuse for better performance    |
| **User Action**   | Required to bypass browser autoplay blocking |

---

## <a name="switch-statements"></a>🔀 Switch Statements

> **💡 Key Concept:** Switch statements provide a cleaner alternative to multiple if-else statements when comparing one value against many possibilities.

### 🎯 Basic Syntax

```javascript
switch (expression) {
  case value1:
    // Code to execute if expression === value1
    break;
  case value2:
    // Code to execute if expression === value2
    break;
  default:
    // Code to execute if no cases match
}
```

### 🔑 The `break` Statement

**Critical:** `break` prevents "fall-through" to the next case.

```javascript
var day = 2;

switch (day) {
  case 1:
    console.log("Monday");
    break;  // Without this, it continues to next case!
  case 2:
    console.log("Tuesday");
    break;
  case 3:
    console.log("Wednesday");
    break;
  default:
    console.log("Invalid day");
}
// Output: Tuesday
```

### ⚠️ Fall-Through Behavior (Without `break`)

```javascript
var grade = "B";

switch (grade) {
  case "A":
    console.log("Excellent!");
    // No break - falls through
  case "B":
    console.log("Good job!");
    // No break - falls through
  case "C":
    console.log("Passed");
    break;
  default:
    console.log("Failed");
}
// Output:
// Good job!
// Passed
```

### 🆚 Switch vs. If-Else

**If-Else (Verbose):**

```javascript
if (key === "w") {
  console.log("Crash");
} else if (key === "a") {
  console.log("Kick");
} else if (key === "s") {
  console.log("Snare");
} else {
  console.log("Unknown");
}
```

**Switch (Cleaner):**

```javascript
switch (key) {
  case "w":
    console.log("Crash");
    break;
  case "a":
    console.log("Kick");
    break;
  case "s":
    console.log("Snare");
    break;
  default:
    console.log("Unknown");
}
```

### 🎵 Real-World Example: Drum Kit

```javascript
function makeSound(key) {
  switch (key) {
    case "w":
      var crash = new Audio("sounds/crash.mp3");
      crash.play();
      break;
    case "a":
      var kick = new Audio("sounds/kick-bass.mp3");
      kick.play();
      break;
    case "s":
      var snare = new Audio("sounds/snare.mp3");
      snare.play();
      break;
    case "d":
      var tom1 = new Audio("sounds/tom-1.mp3");
      tom1.play();
      break;
    default:
      console.log("No sound assigned to: " + key);
  }
}
```

### 📋 Multiple Cases for Same Action

You can stack cases when multiple values should trigger the same code:

```javascript
var month = "December";

switch (month) {
  case "December":
  case "January":
  case "February":
    console.log("Winter");
    break;
  case "March":
  case "April":
  case "May":
    console.log("Spring");
    break;
  default:
    console.log("Other season");
}
// Output: Winter
```

### ✅ Section Summary

| Concept           | Key Point                                     |
|:-----------------:|:---------------------------------------------:|
| **Switch**        | Cleaner than multiple if-else statements      |
| **break**         | Required to prevent fall-through              |
| **default**       | Executes when no cases match (like else)      |
| **Multiple cases**| Stack cases for same action                   |

---

## <a name="javascript-objects"></a>📦 JavaScript Objects

> **💡 Key Concept:** Objects are collections of key-value pairs that allow you to group related data and functionality together.

### 🗂️ What is an Object?

An **object** is a data structure that stores properties (data) and methods (functions) together.

**Analogy:** Think of an object like a real-world object (a car, a person) that has:

- **Properties** - Characteristics (color, name, age)
- **Methods** - Actions it can perform (drive, speak)

### 🔧 Creating Objects

#### Object Literal Syntax

```javascript
var person = {
  name: "John",
  age: 30,
  city: "New York"
};
```

#### Accessing Properties

**Dot Notation (Preferred):**

```javascript
console.log(person.name);  // Output: John
person.age = 31;           // Change value
```

**Bracket Notation:**

```javascript
console.log(person["name"]);  // Output: John
person["age"] = 31;           // Change value
```

**When to use bracket notation:**

- Property name is in a variable
- Property name has spaces or special characters

```javascript
var property = "name";
console.log(person[property]);  // Output: John

var person = {
  "first name": "John"  // Has space
};
console.log(person["first name"]);  // Must use brackets
```

### 📦 Object Structure Example

```javascript
var car = {
  // Properties
  make: "Toyota",
  model: "Camry",
  year: 2020,
  color: "blue",
  
  // Method
  honk: function() {
    console.log("Beep beep!");
  }
};

// Accessing
console.log(car.make);     // Output: Toyota
console.log(car.year);     // Output: 2020
car.honk();                // Output: Beep beep!
```

### 🏠 Nested Objects

Objects can contain other objects:

```javascript
var person = {
  name: "Alice",
  age: 25,
  address: {
    street: "123 Main St",
    city: "Boston",
    zipCode: "02101"
  }
};

console.log(person.address.city);  // Output: Boston
```

### 📊 Objects vs. Arrays

| Feature        | Array                  | Object                    |
|:--------------:|:----------------------:|:-------------------------:|
| **Structure**  | Ordered list           | Key-value pairs           |
| **Access**     | By index `[0]`         | By key `["name"]`         |
| **Use Case**   | List of similar items  | Related properties/methods|

```javascript
// Array - ordered list
var colors = ["red", "green", "blue"];
console.log(colors[0]);  // red

// Object - related data
var user = {
  username: "alice123",
  email: "alice@example.com"
};
console.log(user.username);  // alice123
```

### ✅ Section Summary

| Concept              | Key Point                                    |
|:--------------------:|:--------------------------------------------:|
| **Object**           | Collection of key-value pairs                |
| **Dot notation**     | `object.property` (preferred)                |
| **Bracket notation** | `object["property"]` (for special cases)     |
| **Methods**          | Functions stored as object properties        |

---

## <a name="constructor-functions"></a>🏗️ Constructor Functions

> **💡 Key Concept:** Constructor functions are blueprints for creating multiple objects with the same structure but different values.

### 🎨 What is a Constructor Function?

A **constructor function** is a template that defines the structure and behavior of objects. It allows you to create multiple objects with the same properties and methods.

**Analogy:** Think of it as a cookie cutter - one shape (constructor) can create many cookies (objects).

### 📝 Basic Syntax

```javascript
function Person(name, age, city) {
  this.name = name;
  this.age = age;
  this.city = city;
}

// Create new objects using the constructor
var person1 = new Person("John", 30, "New York");
var person2 = new Person("Alice", 25, "Boston");
```

**Key Elements:**

- Function name is capitalized (convention)
- Uses `this` keyword to set properties
- Called with `new` keyword

### 🔑 The `this` Keyword

Inside a constructor, `this` refers to the **new object being created**.

```javascript
function Car(make, model) {
  this.make = make;      // Sets property on new object
  this.model = model;    // Sets property on new object
}

var myCar = new Car("Toyota", "Camry");
console.log(myCar.make);   // Output: Toyota
console.log(myCar.model);  // Output: Camry
```

### 🆚 Constructor vs. Object Literal

**Object Literal (Create one object):**

```javascript
var person1 = {
  name: "John",
  age: 30
};

var person2 = {
  name: "Alice",
  age: 25
};
```

**Constructor Function (Reusable blueprint):**

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

var person1 = new Person("John", 30);
var person2 = new Person("Alice", 25);
```

### 🎯 Initialized Objects

An **initialized object** is an object created using a constructor function with the `new` keyword.

```javascript
// Constructor function
function BellBoy(name, age, languages) {
  this.name = name;
  this.age = age;
  this.hasWorkPermit = true;
  this.languages = languages;
}

// Initialize (create) new objects
var bellBoy1 = new BellBoy("Timmy", 19, ["English", "Spanish"]);
var bellBoy2 = new BellBoy("Jimmy", 21, ["French", "German"]);

console.log(bellBoy1.name);      // Output: Timmy
console.log(bellBoy2.languages); // Output: ["French", "German"]
```

### ⚠️ Common Mistake: Forgetting `new`

```javascript
function Person(name) {
  this.name = name;
}

// ❌ Without 'new' - doesn't work as expected
var person1 = Person("John");
console.log(person1);  // Output: undefined

// ✅ With 'new' - creates object properly
var person2 = new Person("Alice");
console.log(person2);  // Output: Person { name: "Alice" }
```

### 📦 Constructor with Default Values

```javascript
function Product(name, price, inStock) {
  this.name = name;
  this.price = price;
  this.inStock = inStock !== undefined ? inStock : true;  // Default: true
  this.discount = 0;  // Default value for all products
}

var product1 = new Product("Laptop", 999);
console.log(product1.inStock);  // Output: true (default)
console.log(product1.discount); // Output: 0 (default)
```

### ✅ Section Summary

| Concept                  | Key Point                                    |
|:------------------------:|:--------------------------------------------:|
| **Constructor Function** | Blueprint for creating multiple objects      |
| **`new` keyword**        | Required to create objects from constructor  |
| **`this` keyword**       | Refers to the new object being created       |
| **Initialization**       | Creating an object using `new Constructor()` |
| **Capitalization**       | Constructor names should start with capital  |

---

## <a name="naming-conventions"></a>📝 Naming Conventions in JavaScript

> **💡 Key Concept:** Consistent naming conventions make code more readable and help other developers (and your future self) understand your code.

### 📏 General Rules

| Rule                | Example             | Explanation                           |
|:-------------------:|:-------------------:|:-------------------------------------:|
| **Camel Case**      | `myVariableName`    | Standard for variables and functions  |
| **Pascal Case**     | `MyConstructor`     | For constructor functions and classes |
| **All Caps**        | `MAX_SIZE`          | For constants                         |
| **Descriptive**     | `userAge` not `ua`  | Use meaningful names                  |

### 🐪 camelCase (Standard)

Used for variables, regular functions, and object properties.

```javascript
var firstName = "John";
var userAge = 25;
var isLoggedIn = true;

function calculateTotal() {
  // function code
}

function getUserData() {
  // function code
}
```

**Rules:**

- Start with lowercase letter
- Capitalize first letter of each subsequent word
- No spaces or underscores

### 🏛️ PascalCase (Constructors & Classes)

Used for constructor functions and class names.

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

function BankAccount(balance) {
  this.balance = balance;
}

var user = new Person("Alice", 30);
var account = new BankAccount(1000);
```

**Why:** Helps distinguish constructors from regular functions.

### 🔤 UPPER_SNAKE_CASE (Constants)

Used for values that never change.

```javascript
const MAX_USERS = 100;
const API_KEY = "abc123";
const PI = 3.14159;
const DEFAULT_TIMEOUT = 5000;
```

### 📝 Meaningful Names

**❌ Bad (cryptic, unclear):**

```javascript
var x = 25;
var temp = getData();
var fn = "John";

function doStuff() {
  // What does this do?
}
```

**✅ Good (descriptive, clear):**

```javascript
var userAge = 25;
var userData = getUserData();
var firstName = "John";

function calculateMonthlyPayment() {
  // Clear purpose
}
```

### 🎯 Boolean Variable Naming

Start with `is`, `has`, `can`, `should`:

```javascript
var isLoggedIn = true;
var hasPermission = false;
var canEdit = true;
var shouldUpdate = false;
```

### 🔢 Array Naming (Use Plurals)

```javascript
var users = ["Alice", "Bob", "Charlie"];
var products = [product1, product2, product3];
var phoneNumbers = ["555-1234", "555-5678"];
```

### 📊 Quick Reference Table

| Type              | Convention         | Example                     |
|:-----------------:|:------------------:|:---------------------------:|
| Variables         | camelCase          | `userName`, `totalPrice`    |
| Functions         | camelCase          | `calculateTotal()`          |
| Constructors      | PascalCase         | `Person()`, `BankAccount()` |
| Constants         | UPPER_SNAKE_CASE   | `MAX_SIZE`, `API_KEY`       |
| Booleans          | is/has/can prefix  | `isActive`, `hasAccess`     |
| Arrays            | Plural nouns       | `users`, `items`            |

### ⚠️ Reserved Keywords

Avoid using JavaScript reserved words as variable names:

```javascript
// ❌ Don't use these as variable names
var class = "Math";     // Reserved word
var function = getData; // Reserved word
var new = 10;          // Reserved word

// ✅ Use alternative names
var className = "Math";
var callback = getData;
var newValue = 10;
```

### ✅ Section Summary

| Concept          | Key Point                                    |
|:----------------:|:--------------------------------------------:|
| **camelCase**    | Standard for variables and functions         |
| **PascalCase**   | For constructors and classes                 |
| **UPPER_CASE**   | For constants that never change              |
| **Descriptive**  | Always use clear, meaningful names           |

---

## <a name="methods"></a>⚙️ Methods and Calling Methods

> **💡 Key Concept:** Methods are functions that belong to objects. They define what an object can do.

### 🔧 What is a Method?

A **method** is a function stored as a property of an object.

**Property vs. Method:**

```javascript
var person = {
  name: "John",           // Property (data)
  greet: function() {     // Method (action)
    console.log("Hello!");
  }
};
```

### 📞 Calling Methods

Use dot notation followed by parentheses:

```javascript
person.greet();  // Output: Hello!
```

**⚠️ Don't forget the parentheses `()`!**

```javascript
person.greet;    // Returns the function itself (doesn't call it)
person.greet();  // Calls the function (executes it)
```

### 🎯 Methods with Parameters

```javascript
var calculator = {
  add: function(a, b) {
    return a + b;
  },
  multiply: function(a, b) {
    return a * b;
  }
};

var sum = calculator.add(5, 3);        // Returns: 8
var product = calculator.multiply(4, 2); // Returns: 8
```

### 🔑 Using `this` in Methods

The `this` keyword refers to the object the method belongs to:

```javascript
var person = {
  name: "Alice",
  age: 25,
  introduce: function() {
    console.log("Hi, I'm " + this.name + " and I'm " + this.age + " years old.");
  }
};

person.introduce();
// Output: Hi, I'm Alice and I'm 25 years old.
```

### 🏗️ Adding Methods to Constructor Functions

You can add methods inside constructor functions:

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
  
  // Method inside constructor
  this.greet = function() {
    console.log("Hello, my name is " + this.name);
  };
}

var person1 = new Person("John", 30);
person1.greet();  // Output: Hello, my name is John
```

### ⚡ Better Approach: Prototype Methods

Adding methods via prototype saves memory (all instances share one method):

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// Add method to prototype
Person.prototype.greet = function() {
  console.log("Hello, my name is " + this.name);
};

Person.prototype.celebrateBirthday = function() {
  this.age++;
  console.log("Happy birthday! Now I'm " + this.age);
};

var person1 = new Person("Alice", 25);
person1.greet();                 // Output: Hello, my name is Alice
person1.celebrateBirthday();     // Output: Happy birthday! Now I'm 26
```

**Why use prototype?**

- All instances share the same method (saves memory)
- Methods not duplicated for each object

### 🎮 Real-World Example: Drum Kit

```javascript
function Drum(name, sound) {
  this.name = name;
  this.sound = sound;
}

// Add method via prototype
Drum.prototype.play = function() {
  var audio = new Audio(this.sound);
  audio.play();
  console.log(this.name + " played!");
};

var crash = new Drum("Crash Cymbal", "sounds/crash.mp3");
var snare = new Drum("Snare", "sounds/snare.mp3");

crash.play();  // Plays crash sound
snare.play();  // Plays snare sound
```

### 🆚 Method vs. Function

| Aspect         | Function                    | Method                      |
|:--------------:|:---------------------------:|:---------------------------:|
| **Definition** | Standalone                  | Belongs to an object        |
| **Calling**    | `functionName()`            | `object.methodName()`       |
| **`this`**     | Refers to global/window     | Refers to the object        |

```javascript
// Regular function
function greet() {
  console.log("Hello!");
}
greet();  // Call directly

// Method
var person = {
  greet: function() {
    console.log("Hello!");
  }
};
person.greet();  // Call on object
```

### ✅ Section Summary

| Concept              | Key Point                                    |
|:--------------------:|:--------------------------------------------:|
| **Method**           | Function that belongs to an object           |
| **Calling**          | Use `object.method()` with parentheses       |
| **`this`**           | Refers to the object the method belongs to   |
| **Prototype**        | Efficient way to add methods to constructors |
| **Constructor**      | Can add methods inside or via prototype      |

---

## <a name="keyboard-events"></a>⌨️ Keyboard Events

> **💡 Key Concept:** Keyboard events allow you to detect and respond to key presses and releases, enabling keyboard-driven interactions.

### ⌨️ Types of Keyboard Events

| Event      | When it Fires                    | Use Case                  |
|:----------:|:--------------------------------:|:-------------------------:|
| `keydown`  | Key is pressed down              | Detecting key press       |
| `keyup`    | Key is released                  | Detecting key release     |
| `keypress` | ⚠️ Deprecated (don't use)        | Use `keydown` instead     |

### 📝 Basic Syntax

```javascript
document.addEventListener("keydown", function(event) {
  console.log("Key pressed: " + event.key);
});
```

### 🔑 The Event Object

When a keyboard event occurs, an **event object** is passed to the callback function with useful information:

```javascript
document.addEventListener("keydown", function(event) {
  console.log(event.key);      // The key pressed (e.g., "a", "Enter")
  console.log(event.code);     // Physical key code (e.g., "KeyA")
  console.log(event.keyCode);  // ⚠️ Deprecated numeric code
});
```

### 🎯 Important Event Properties

| Property   | Description                          | Example Value    |
|:----------:|:------------------------------------:|:----------------:|
| `key`      | The actual key value                 | `"a"`, `"Enter"` |
| `code`     | Physical keyboard key                | `"KeyA"`         |
| `keyCode`  | ⚠️ Deprecated numeric code           | `65` (for "A")   |

**Use `event.key` (preferred)** - gives you the actual character or key name.

### 🎹 Practical Example: Drum Kit with Keyboard

```javascript
document.addEventListener("keydown", function(event) {
  makeSound(event.key);
});

function makeSound(key) {
  switch(key) {
    case "w":
      var crash = new Audio("sounds/crash.mp3");
      crash.play();
      break;
    case "a":
      var kick = new Audio("sounds/kick.mp3");
      kick.play();
      break;
    case "s":
      var snare = new Audio("sounds/snare.mp3");
      snare.play();
      break;
    default:
      console.log("No sound for: " + key);
  }
}
```

### 🎮 Detecting Specific Keys

```javascript
document.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    console.log("Enter key pressed");
  }
  
  if (event.key === " ") {  // Space bar
    console.log("Space bar pressed");
  }
  
  if (event.key === "Escape") {
    console.log("Escape key pressed");
  }
});
```

### 🔤 Special Keys Reference

| Key           | event.key Value |
|:-------------:|:---------------:|
| Enter         | `"Enter"`       |
| Space         | `" "`           |
| Escape        | `"Escape"`      |
| Arrow Up      | `"ArrowUp"`     |
| Arrow Down    | `"ArrowDown"`   |
| Arrow Left    | `"ArrowLeft"`   |
| Arrow Right   | `"ArrowRight"`  |
| Backspace     | `"Backspace"`   |
| Tab           | `"Tab"`         |
| Shift         | `"Shift"`       |
| Control       | `"Control"`     |

### 🎯 Combining Mouse and Keyboard Events

```javascript
var buttons = document.querySelectorAll(".drum");

// Mouse click event
for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function() {
    var buttonKey = this.innerHTML;
    makeSound(buttonKey);
    buttonAnimation(buttonKey);
  });
}

// Keyboard event
document.addEventListener("keydown", function(event) {
  makeSound(event.key);
  buttonAnimation(event.key);
});

function makeSound(key) {
  // Play sound based on key
}

function buttonAnimation(key) {
  var activeButton = document.querySelector("." + key);
  activeButton.classList.add("pressed");
  
  setTimeout(function() {
    activeButton.classList.remove("pressed");
  }, 100);
}
```

### 🔍 Modifier Keys

Check if modifier keys are held down:

```javascript
document.addEventListener("keydown", function(event) {
  if (event.shiftKey) {
    console.log("Shift key is held");
  }
  
  if (event.ctrlKey) {
    console.log("Control key is held");
  }
  
  if (event.altKey) {
    console.log("Alt key is held");
  }
  
  // Combination: Ctrl + S
  if (event.ctrlKey && event.key === "s") {
    event.preventDefault();  // Prevent browser save dialog
    console.log("Save shortcut detected!");
  }
});
```

### 📚 Resources

- **MDN keydown Event:** [developer.mozilla.org/docs/Web/API/Document/keydown_event](https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event)

### ✅ Section Summary

| Concept           | Key Point                                    |
|:-----------------:|:--------------------------------------------:|
| **keydown**       | Fires when key is pressed down               |
| **keyup**         | Fires when key is released                   |
| **event.key**     | Preferred way to get key value               |
| **Modifier keys** | Check `shiftKey`, `ctrlKey`, `altKey`        |
| **document**      | Attach keyboard listeners to document        |

---

## <a name="adding-animations"></a>✨ Adding Animations

> **💡 Key Concept:** CSS animations triggered by JavaScript allow you to create smooth, performant visual effects when users interact with your site.

### 🎨 The CSS + JavaScript Approach

The best way to add animations:

1. **Define animation in CSS** (style layer)
2. **Trigger with JavaScript** (behavior layer)

This maintains separation of concerns.

### 📝 Basic Animation Setup

**In `styles.css`:**

```css
.pressed {
  box-shadow: 0 3px 4px 0 #DBEDF3;
  opacity: 0.5;
}
```

**In `index.js`:**

```javascript
button.addEventListener("click", function() {
  this.classList.add("pressed");
});
```

### ⏱️ Temporary Animations with `setTimeout`

Add a class, then remove it after a delay:

```javascript
function buttonAnimation(currentKey) {
  var activeButton = document.querySelector("." + currentKey);
  
  // Add animation class
  activeButton.classList.add("pressed");
  
  // Remove after 100ms
  setTimeout(function() {
    activeButton.classList.remove("pressed");
  }, 100);
}
```

### 🎯 Complete Example: Button Press Animation

**HTML:**

```html
<button class="w drum">W</button>
<button class="a drum">A</button>
<button class="s drum">S</button>
```

**CSS:**

```css
.drum {
  font-size: 5rem;
  background-color: white;
  border: 10px solid #404B69;
  border-radius: 15px;
}

.pressed {
  box-shadow: 0 3px 4px 0 #DBEDF3;
  opacity: 0.5;
  transform: scale(0.95);
}
```

**JavaScript:**

```javascript
// Click event
var buttons = document.querySelectorAll(".drum");
for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function() {
    buttonAnimation(this.innerHTML);
  });
}

// Keyboard event
document.addEventListener("keydown", function(event) {
  buttonAnimation(event.key);
});

function buttonAnimation(key) {
  var activeButton = document.querySelector("." + key);
  activeButton.classList.add("pressed");
  
  setTimeout(function() {
    activeButton.classList.remove("pressed");
  }, 100);
}
```

### 🎬 CSS Transitions

For smooth animations, use CSS transitions:

```css
.drum {
  transition: all 0.1s ease;
}

.pressed {
  opacity: 0.5;
  transform: scale(0.95);
}
```

**How it works:**

- `transition` tells CSS to animate changes smoothly
- `0.1s` is the duration
- `ease` is the timing function (how fast it accelerates/decelerates)

### 🌀 CSS Keyframe Animations

For more complex animations:

```css
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.pulse-animation {
  animation: pulse 0.3s ease;
}
```

**JavaScript:**

```javascript
button.addEventListener("click", function() {
  this.classList.add("pulse-animation");
  
  // Remove after animation completes
  setTimeout(() => {
    this.classList.remove("pulse-animation");
  }, 300);
});
```

### 🎨 Common Animation Properties

| CSS Property      | Effect                          | Example                    |
|:-----------------:|:-------------------------------:|:--------------------------:|
| `opacity`         | Transparency                    | `opacity: 0.5`             |
| `transform`       | Move, rotate, scale             | `transform: scale(0.95)`   |
| `box-shadow`      | Shadow effect                   | `box-shadow: 0 3px 4px`    |
| `background-color`| Change color                    | `background-color: red`    |

### ⚡ Performance Tips

**✅ Use these properties (GPU-accelerated):**

- `transform`
- `opacity`

**❌ Avoid animating these (slower):**

- `width` / `height`
- `top` / `left` / `right` / `bottom`
- `margin` / `padding`

```css
/* ✅ Good - uses transform */
.animated {
  transform: translateX(100px);
}

/* ❌ Bad - uses left */
.animated {
  left: 100px;
}
```

### 🎮 Animation on Multiple Events

```javascript
function addAnimation(element) {
  element.classList.add("pressed");
  setTimeout(() => element.classList.remove("pressed"), 100);
}

// Mouse click
button.addEventListener("click", function() {
  addAnimation(this);
});

// Keyboard
document.addEventListener("keydown", function(event) {
  var button = document.querySelector("." + event.key);
  if (button) {
    addAnimation(button);
  }
});
```

### 📊 Animation Timing Functions

| Function      | Effect                             |
|:-------------:|:----------------------------------:|
| `linear`      | Constant speed                     |
| `ease`        | Slow start, fast middle, slow end  |
| `ease-in`     | Slow start, fast end               |
| `ease-out`    | Fast start, slow end               |
| `ease-in-out` | Slow start and end                 |

```css
.button {
  transition: all 0.3s ease-in-out;
}
```

### ✅ Section Summary

| Concept               | Key Point                                    |
|:---------------------:|:--------------------------------------------:|
| **CSS + JS**          | Define animation in CSS, trigger with JS     |
| **classList**         | Add/remove classes to trigger animations     |
| **setTimeout**        | Remove animation class after delay           |
| **transform/opacity** | Best properties for smooth performance       |
| **transitions**       | Smooth animation between states              |

---

## 🔗 Useful Resources

| Resource                    | Link                                                                                                                                             |
|:---------------------------:|:------------------------------------------------------------------------------------------------------------------------------------------------:|
| **MDN addEventListener**    | [developer.mozilla.org/docs/Web/API/EventTarget/addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) |
| **MDN DOM Events**          | [developer.mozilla.org/docs/Web/API/Document_Object_Model/Events](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Events) |
| **MDN keydown Event**       | [developer.mozilla.org/docs/Web/API/Document/keydown_event](https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event)             |
| **Web Audio API**           | [developer.mozilla.org/docs/Web/API/Web_Audio_API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)                               |
| **CSS Animations**          | [developer.mozilla.org/docs/Web/CSS/CSS_Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)                             |

---

## 🧾 Summary

**Event Listeners** allow code to respond to user interactions through `addEventListener()`. **Higher-order functions** take callbacks as arguments, enabling flexible, reusable code. Use **debugger** and **$0** for efficient debugging. **Anonymous functions** work for one-time use while **named functions** improve debugging. Play audio with `new Audio()` and `.play()`. **Switch statements** provide cleaner alternatives to multiple if-else comparisons. **Objects** store related data in key-value pairs. **Constructor functions** create object blueprints using `this` and `new`. Follow **naming conventions**: camelCase for variables, PascalCase for constructors. Add **methods** to objects directly or via prototype. **Keyboard events** detect keypresses with `keydown` and `event.key`. Combine **CSS animations** with JavaScript class manipulation for smooth, performant effects.

---
