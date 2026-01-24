# ✏️ The Document Object Model

## 📚 Table of Contents

- [🏗️ Project Setup & Script Integration](#project-setup)
- [🌳 Understanding the DOM](#understanding-dom)
- [🎯 Selecting DOM Elements](#selecting-elements)
- [🎨 Manipulating Styles](#manipulating-styles)
- [📝 Changing Content](#changing-content)
- [🏷️ Working with Attributes](#working-attributes)

---

## <a name="project-setup"></a>🏗️ Project Setup & Script Integration

> **💡 Key Concept:** The DOM is how JavaScript interacts with HTML. Proper setup and script placement are critical for everything to work correctly.

### 📁 Standard Project Structure

| File         | Purpose                     |
|:------------:|:---------------------------:|
| `index.html` | The structure of the site   |
| `styles.css` | The visual presentation     |
| `index.js`   | The logic and behavior      |

### 🔧 Methods of Adding JavaScript

| Method       | Implementation         | Example                              | Pros/Cons                                      |
|:------------:|:----------------------:|:------------------------------------:|:----------------------------------------------:|
| **Inline**   | Attribute on HTML tags | `<body onload="alert('Hello');">`    | ❌ Hard to debug, not modular, messy           |
| **Internal** | `<script>` tag in HTML | `<script> alert("Hello"); </script>` | ⚠️ Good for tiny scripts, clutters HTML        |
| **External** | Separate `.js` file    | `<script src="index.js"></script>`   | ✅ Best practice, clean, modular               |

#### 💡 The "Quote" Rule for Inline JS

When using inline JavaScript, nest single quotes inside double quotes to avoid confusing the browser.

```html
<!-- ❌ Wrong: Browser thinks string ends at second " -->
<body onload="alert("Hello")">

<!-- ✅ Right: Single quotes inside double quotes -->
<body onload="alert('Hello')">
```

### 📍 Script Placement (Critical!)

> **💡 Key Concept:** The browser reads code line-by-line from top to bottom. Placement affects when your code runs.

#### CSS Placement: `<head>`

```html
<head>
  <link rel="stylesheet" href="styles.css">
</head>
```

**Why:** Styles load before content to prevent "flash" of unstyled text.

#### JavaScript Placement: Two Approaches

**Traditional: Bottom of `<body>`**

```html
<body>
  <h1>Hello</h1>
  <!-- All HTML content here -->
  <script src="index.js"></script>
</body>
```

**Why this works:**

- ✅ All HTML elements exist when script runs
- ✅ Content loads first → site feels faster
- ✅ No risk of `null` errors

**Modern: `<head>` with `defer`**

```html
<head>
  <script src="index.js" defer></script>
</head>
```

**How `defer` works:**

1. Script downloads in parallel with HTML parsing
2. Script executes **after** HTML is fully parsed
3. All elements exist when script runs

**⚠️ Avoid `async`:** Runs script as soon as downloaded, possibly before HTML is ready.

### 🧪 Practical Example: Why Placement Matters

```javascript
// index.js
document.querySelector("h1").innerHTML = "Good Bye";
```

| Script Location        | Result      | Reason                                |
|:----------------------:|:-----------:|:-------------------------------------:|
| In `<head>` (no defer) | ❌ Error    | `<h1>` doesn't exist yet              |
| Bottom of `<body>`     | ✅ Works    | `<h1>` exists by the time script runs |

### ✅ Section Summary

| Concept           | Key Point                                        |
|:-----------------:|:------------------------------------------------:|
| **External JS**   | Always use separate `.js` files                  |
| **CSS placement** | Always in `<head>`                               |
| **JS placement**  | Bottom of `<body>` OR `<head>` with `defer`      |
| **Quote nesting** | Single quotes inside double quotes for inline JS |

---

## <a name="understanding-dom"></a>🌳 Understanding the DOM

> **💡 Key Concept:** The DOM converts your HTML into a tree structure of objects that JavaScript can manipulate on the fly.

### 🤔 What is the DOM?

The **Document Object Model** is a programming interface for web documents that represents the page as a tree of objects.

**The Problem:** HTML and CSS are static. You can't manually update code every time a user clicks a button.

**The Solution:** The browser converts HTML into a tree structure where each element becomes an object that JavaScript can "grab" and manipulate.

### 🌲 The DOM Tree Structure

```plaintext
document (Root)
    └── html
        ├── head
        │   ├── title
        │   └── link
        └── body
            ├── h1
            ├── p
            └── button
```

### 🧭 Navigating the DOM Tree

| Navigation Property  | Description               | Example                                 |
|:--------------------:|:-------------------------:|:---------------------------------------:|
| `document`           | Root object (entire page) | `document`                              |
| `firstElementChild`  | First nested element      | `document.firstElementChild` → `<html>` |
| `lastElementChild`   | Last nested element       | `document.lastElementChild` → `<body>`  |

#### Example: Stepping Through the Tree

To reach an `<h1>` inside `<body>`:

```javascript
// Step 1: The whole page
document

// Step 2: The <body> tag
document.lastElementChild

// Step 3: The first child of <body> (the <h1>)
document.lastElementChild.firstElementChild
```

### 🎯 Selection and Manipulation

**Best Practice:** Store selected elements in variables.

```javascript
// Instead of this long path every time...
document.lastElementChild.firstElementChild.innerHTML = "Good Bye";

// Do this:
var heading = document.querySelector("h1");
heading.innerHTML = "Good Bye";
```

### 🚗 Properties vs. Methods (The Car Analogy)

The DOM treats every HTML element as an **Object**. Objects have two main features:

| Type         | Car Analogy      | DOM Example                 | Syntax            |
|:------------:|:----------------:|:---------------------------:|:-----------------:|
| **Property** | color, seats     | `innerHTML`, `style`        | `object.property` |
| **Method**   | drive(), brake() | `click()`, `setAttribute()` | `object.method()` |

#### Getters and Setters

**Getter:** Reading the current value

```javascript
var color = car.color;  // Returns "Red"
```

**Setter:** Changing the value with `=`

```javascript
car.numberOfDoors = 0;  // The car now has no doors
```

### ✅ Section Summary

| Concept        | Key Point                                       |
|:--------------:|:-----------------------------------------------:|
| **DOM**        | Tree structure of HTML elements as objects      |
| **Navigation** | Use `firstElementChild`, `lastElementChild`     |
| **Properties** | What an element is (read/write with `=`)        |
| **Methods**    | What an element does (call with `()`)           |

---

## <a name="selecting-elements"></a>🎯 Selecting DOM Elements

> **💡 Key Concept:** Modern methods (`querySelector`) use CSS selector syntax and are more flexible than older methods (`getElementById`).

### 📌 The "Get Element" Methods (Traditional)

#### `getElementsByTagName()`

Returns an **array** (HTMLCollection) of all elements with that tag.

```javascript
// Selects all list items and changes the 3rd one to purple
var listItems = document.getElementsByTagName("li");
listItems[2].style.color = "purple";
```

**⚠️ Key Detail:** Even if you only want one, you must use an index `[0]`.

#### `getElementsByClassName()`

Returns an **array** of all elements that share a class.

```javascript
// Even if there's only one element, it's still an array!
var buttons = document.getElementsByClassName("btn");
buttons[0].style.fontWeight = "bold";
```

#### `getElementById()`

Returns a **single object** (no array).

```javascript
// No index needed because IDs are unique
document.getElementById("title").innerHTML = "Good Bye";
```

**Key Detail:** No "s" in "Element" because IDs must be unique.

### 🔍 Query Selector Methods (Modern)

#### `querySelector()`

Returns the **first element** that matches the selector.

```javascript
document.querySelector("h1");       // First h1
document.querySelector("#title");   // Element with ID "title"
document.querySelector(".btn");     // First element with class "btn"
```

**Uses CSS selector syntax:**

- `#` for IDs
- `.` for classes
- Tag name for elements

#### `querySelectorAll()`

Returns an **array** (NodeList) of all matching elements.

```javascript
var allItems = document.querySelectorAll("#list .item");
allItems[1].style.color = "blue";  // Changes the second item
```

### 🎓 Advanced Selector Logic

| Type             | Logic           | Syntax                     | Explanation                                |
|:----------------:|:---------------:|:--------------------------:|:------------------------------------------:|
| **Hierarchical** | Parent to Child | `querySelector("li a")`    | Anchor inside list item (space required)   |
| **Combined**     | Same Element    | `querySelector("li.item")` | List item that has class "item" (no space) |

### 📊 Method Comparison

| Method                | Return Type | Flexibility            | Recommended?                  |
|:---------------------:|:-----------:|:----------------------:|:-----------------------------:|
| `getElementById()`    | Single Item | Low (ID only)          | ✅ Yes (Fast for IDs)         |
| `getElementsBy...`    | Array       | Low                    | ❌ No (Less flexible)         |
| `querySelector()`     | Single Item | High (Any CSS)         | ✅ Yes (Best for general use) |
| `querySelectorAll()`  | Array       | High (Any CSS)         | ✅ Yes (Best for groups)      |

### 🔑 Key Rules to Remember

#### 1. The Selector Symbol

**Query Selectors:** Must include CSS symbols

```javascript
document.querySelector("#header");    // # for IDs
document.querySelector(".highlight"); // . for classes
document.querySelector("h1");         // No symbol for tags
```

**Get Element Methods:** No symbols needed

```javascript
document.getElementById("header");       // No # needed
document.getElementsByClassName("btn");  // No . needed
```

#### 2. Handling Arrays

If a method returns an array, you **must** specify an index.

```javascript
// ❌ Wrong: Cannot manipulate array directly
document.getElementsByClassName("btn").style.color = "red";

// ✅ Right: Specify which item
document.getElementsByClassName("btn")[0].style.color = "red";
```

#### 3. Specificity with Query Selectors

```javascript
// Space = Hierarchy (find link inside list item)
document.querySelector("li a");

// No space = Combination (list item WITH class "item")
document.querySelector("li.item");
```

### 📋 Quick Reference Table

| Method                    | Target Type | Syntax Example                           | Return Type            |
|:-------------------------:|:-----------:|:----------------------------------------:|:----------------------:|
| `getElementById()`        | ID          | `document.getElementById("title")`       | Single Item            |
| `getElementsByClassName()`| Class       | `document.getElementsByClassName("btn")` | Array (HTMLCollection) |
| `getElementsByTagName()`  | Tag         | `document.getElementsByTagName("li")`    | Array (HTMLCollection) |
| `querySelector()`         | Any CSS     | `document.querySelector("#title")`       | Single Item            |
| `querySelector()`         | Any CSS     | `document.querySelector(".btn")`         | Single Item (First)    |
| `querySelectorAll()`      | Any CSS     | `document.querySelectorAll(".item")`     | Array (NodeList)       |

### 💡 Pro-Tip

Instead of typing `document.getElementsByClassName("my-class")[0]`, use `document.querySelector(".my-class")`. It's cleaner and less prone to errors!

### ✅ Section Summary

| Concept              | Key Point                                 |
|:--------------------:|:-----------------------------------------:|
| **querySelector()**  | Modern, flexible, uses CSS syntax         |
| **getElementById()** | Fast for single IDs, no array             |
| **getElementsBy...** | Returns arrays, less flexible             |
| **CSS symbols**      | Required for query selectors (`#` `.`)    |
| **Array handling**   | Always use index `[0]` for array methods  |

---

## <a name="manipulating-styles"></a>🎨 Manipulating Styles

> **💡 Key Concept:** Use `.classList` to add/remove CSS classes instead of manipulating individual style properties. This keeps your code clean and maintainable.

### 🎨 The `.style` Property

Once you've selected an element, you can access its CSS properties through the `.style` object.

```javascript
document.querySelector("h1").style.color = "red";
```

### 🐫 Naming Convention: Camel Case

**CSS uses kebab-case**, but **JavaScript uses camelCase**.

| CSS Property       | JavaScript Property           |
|:------------------:|:-----------------------------:|
| `background-color` | `backgroundColor`             |
| `font-size`        | `fontSize`                    |
| `padding-top`      | `paddingTop`                  |
| `visibility`       | `visibility` (same, one word) |

**💡 Rule:** Remove dashes and capitalize the next letter.

### 📝 Values Must Be Strings

In JavaScript, all CSS values must be enclosed in quotation marks.

```javascript
// Numbers/Units
document.querySelector("h1").style.fontSize = "10rem";

// Percentages
document.querySelector("img").style.width = "50%";

// Keywords
document.querySelector("button").style.visibility = "hidden";
```

### ⚠️ Why Not Use `.style`?

**Problem:** Mixing Style (CSS) with Behavior (JavaScript) violates **Separation of Concerns**.

| Concern         | Language    | Responsibility        |
|:---------------:|:-----------:|:---------------------:|
| **Content**     | HTML        | What the website says |
| **Style**       | CSS         | How the website looks |
| **Behavior**    | JavaScript  | How the website acts  |

**The "Bad" Way:**

```javascript
// ❌ Writing styles in JavaScript
document.querySelector("h1").style.color = "red";
document.querySelector("h1").style.fontSize = "10rem";
document.querySelector("h1").style.fontWeight = "bold";
```

### ✅ The Better Way: `.classList`

Define CSS classes for different states, then use JavaScript to add/remove them.

**In `styles.css`:**

```css
.invisible {
  visibility: hidden;
}

.huge {
  font-size: 10rem;
  color: orange;
}
```

**In `index.js`:**

```javascript
// Add or remove classes instead of individual styles
document.querySelector("button").classList.add("huge");
```

### 🔧 Essential `.classList` Methods

#### `.add()`

Adds a new class to the element.

```javascript
document.querySelector("button").classList.add("invisible");
```

#### `.remove()`

Removes a class from the element.

```javascript
document.querySelector("button").classList.remove("invisible");
```

#### `.toggle()`

The most versatile! If the class exists, it removes it. If it doesn't exist, it adds it.

```javascript
// Switches the class on and off every time this runs
document.querySelector("button").classList.toggle("invisible");
```

### 🎯 Why `.classList` is Better

| Benefit              | Explanation                                                    |
|:--------------------:|:--------------------------------------------------------------:|
| **Easier Debugging** | CSS problems → check CSS file. Logic problems → check JS file. |
| **Cleaner Code**     | JavaScript focuses on logic, not styling details.              |
| **Efficiency**       | Change 10 style properties by adding one class.                |

### 📚 Additional Resources

- **W3Schools Style Property:** [w3schools.com/jsref/dom_obj_style.asp](https://www.w3schools.com/jsref/dom_obj_style.asp)

### ✅ Section Summary

| Concept                    | Key Point                                        |
|:--------------------------:|:------------------------------------------------:|
| **`.style`**               | Access individual CSS properties (use sparingly) |
| **Camel case**             | CSS `font-size` → JS `fontSize`                  |
| **Values as strings**      | All CSS values must be in quotes                 |
| **`.classList`**           | Better practice: add/remove CSS classes          |
| **`.toggle()`**            | Switches class on/off (most useful)              |
| **Separation of Concerns** | Keep styles in CSS, behavior in JS               |

---

## <a name="changing-content"></a>📝 Changing Content

> **💡 Key Concept:** Use `innerHTML` to work with HTML tags, `textContent` for plain text only.

### 📄 `innerHTML` vs. `textContent`

Both properties get or set content, but they "see" content differently.

Given this HTML:

```html
<h1>Hello <strong>World</strong></h1>
```

| Property        | What it sees/does                         | Result                          |
|:---------------:|:-----------------------------------------:|:-------------------------------:|
| `textContent`   | Returns only raw text (ignores HTML tags) | `"Hello World"`                 |
| `innerHTML`     | Returns text + all HTML tags              | `"Hello <strong>World</strong>"`|

### 🔧 Using `innerHTML` to Manipulate Structure

The biggest advantage of `innerHTML` is injecting new HTML elements dynamically.

```javascript
// Setting the innerHTML
document.querySelector("h1").innerHTML = "<em>Good Bye</em>";
```

**Result:** Text appears italicized because `<em>` is interpreted as HTML.

**Contrast with `textContent`:**

```javascript
document.querySelector("h1").textContent = "<em>Good Bye</em>";
```

**Result:** Literally displays `<em>Good Bye</em>` as plain text on screen.

### 📖 Retrieving Content (Getters)

You can use these properties to "read" what's currently inside an element.

```html
<h1 id="title">Hello <strong>User</strong></h1>
```

```javascript
document.querySelector("#title").textContent;
// Returns: "Hello User"

document.querySelector("#title").innerHTML;
// Returns: "Hello <strong>User</strong>"
```

### ⚠️ Critical Reminder: String Values

The value you assign must be a **string**.

```javascript
// ✅ Correct: String with HTML
element.innerHTML = "<h1>New Title</h1>";

// ❌ Incorrect: Not a string (syntax error)
element.innerHTML = <h1>New Title</h1>;
```

### ✅ Section Summary

| Concept                   | Key Point                                   |
|:-------------------------:|:-------------------------------------------:|
| **`textContent`**         | Plain text only, ignores HTML tags          |
| **`innerHTML`**           | Text + HTML tags (can inject new elements)  |
| **Use `innerHTML` for**   | Adding emphasis, links, or structure        |
| **Use `textContent` for** | Simple text replacement                     |
| **Values as strings**     | Always wrap content in quotes               |

---

## <a name="working-attributes"></a>🏷️ Working with Attributes

> **💡 Key Concept:** Attributes provide additional information about HTML elements. Use `getAttribute()` to read them and `setAttribute()` to change them.

### 🔍 What are Attributes?

Attributes provide additional information about HTML elements. They're usually highlighted in a different color in code editors.

**Examples:** `href`, `src`, `class`, `id`, `alt`, `value`

### 👀 Viewing Attributes

#### The `.attributes` Property

Returns a **NamedNodeMap** (list) of every attribute on the element.

```javascript
document.querySelector("a").attributes;
// Returns: {0: href, length: 1}
```

#### The `getAttribute()` Method

Reads the specific value of a known attribute.

```javascript
var link = document.querySelector("a").getAttribute("href");
console.log(link);  // Output: "https://www.google.com"
```

**Syntax:** `element.getAttribute("attributeName")`

### ✏️ Modifying Attributes: `setAttribute()`

This is the "Setter" method. It changes an attribute's value or adds a new one.

**Important:** Requires **two parameters**:

1. The name of the attribute (as a string)
2. The new value (as a string)

**Syntax:** `element.setAttribute("name", "value")`

#### Example: Redirecting a Link

```javascript
// Change a Google link to a Bing link
document.querySelector("a").setAttribute("href", "https://www.bing.com");
```

#### Example: Changing an Image

```javascript
// Swap the source of an image
document.querySelector("img").setAttribute("src", "new-image.png");
```

### 📊 Key Differences

| Goal                   | Method                          | Parameters             |
|:----------------------:|:-------------------------------:|:----------------------:|
| **Read** a value       | `getAttribute("name")`          | 1 (The name)           |
| **Change/Add** a value | `setAttribute("name", "value")` | 2 (Name + new value)   |

### ✅ Section Summary

| Concept              | Key Point                                        |
|:--------------------:|:------------------------------------------------:|
| **Attributes**       | Extra info about elements (href, src, class, id) |
| **`.attributes`**    | View all attributes as a list                    |
| **`getAttribute()`** | Read specific attribute value (1 parameter)      |
| **`setAttribute()`** | Change/add attribute value (2 parameters)        |

---

## 🔗 Useful Resources

| Resource                    | Link                                                                                                                                 |
|:---------------------------:|:------------------------------------------------------------------------------------------------------------------------------------:|
| **W3Schools DOM Reference** | [w3schools.com/js/js_htmldom.asp](https://www.w3schools.com/js/js_htmldom.asp)                                                       |
| **MDN DOM Introduction**    | [developer.mozilla.org/docs/Web/API/Document_Object_Model](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)   |
| **MDN querySelector**       | [developer.mozilla.org/docs/Web/API/Document/querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) |
| **MDN classList**           | [developer.mozilla.org/docs/Web/API/Element/classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)           |

---

## 🧾 Summary

The **DOM** converts HTML into a tree of objects that JavaScript can manipulate. Use **external JS files** and place scripts at the bottom of `<body>` or in `<head>` with `defer`. **Select elements** with modern `querySelector()` (uses CSS syntax) over older `getElementBy...` methods. **Manipulate styles** using `.classList.add/remove/toggle()` instead of `.style` to maintain separation of concerns. **Change content** with `innerHTML` (for HTML) or `textContent` (for plain text). **Work with attributes** using `getAttribute()` (read) and `setAttribute(name, value)` (write).

The complete DOM manipulation toolkit: Selection → Styles → Content → Attributes.

---
