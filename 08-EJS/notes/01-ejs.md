# ✏️ EJS (Embedded JavaScript) Study Notes

## 📚 Table of Contents

- [🎯 What is EJS & Setup](#what-is-ejs)
- [📝 EJS Syntax Reference](#syntax-reference)
- [📤 Passing Data: Server → Template](#passing-data)
- [📥 Receiving Data: Client → Server](#receiving-data)
- [🔄 Control Flow](#control-flow)
- [🧩 Partials (Reusable Components)](#partials)
- [📁 Static Files](#static-files)
- [✅ Best Practices](#best-practices)

---

## <a name="what-is-ejs"></a>🎯 What is EJS & Setup

> **💡 Key Concept:** EJS is a **templating language** that embeds JavaScript inside HTML to create **dynamic web pages**.

### 📊 Why Use EJS?

| Without EJS | With EJS |
| ----------- | -------- |
| `res.send()` with inline HTML strings | Separate `.ejs` template files |
| Messy for complex pages | Clean, maintainable code |
| Mixed HTML and JavaScript logic | Separation of concerns |
| Hard to scale | Easy to scale and organize |

### 🔧 Installation & Setup

```bash
# Install EJS
npm install ejs
```

```javascript
// Configure Express
app.set('view engine', 'ejs');
app.set('views', './views'); // default folder for .ejs files
```

### 📂 Folder Structure

```plaintext
project/
├─ public/          # Static files (CSS, images, JS)
│  ├─ styles/
│  └─ images/
├─ views/           # EJS templates
│  ├─ partials/     # Reusable components
│  └─ index.ejs
└─ server.js
```

### 📋 Key Benefits

- Separates frontend (HTML/CSS) from backend (JavaScript logic)
- Renders dynamic content from server-side data
- Supports loops, conditionals, and variable injection
- Keeps code clean and maintainable

### 🧾 Quick Summary

```javascript
npm install ejs
app.set('view engine', 'ejs');
```

**When to use:** Complex pages requiring dynamic content, reusable components, and separation of concerns

---

## <a name="syntax-reference"></a>📝 EJS Syntax Reference

> **💡 Key Concept:** EJS uses **special tags** to embed JavaScript within HTML, each serving a different purpose.

### 📊 Tag Types

| Tag | Purpose | Example |
| --- | ------- | ------- |
| `<%= %>` | Output value (HTML escaped - safe) | `<h1><%= name %></h1>` |
| `<%- %>` | Output unescaped HTML | `<div><%- htmlContent %></div>` |
| `<% %>` | Execute JavaScript (no output) | `<% if(user){ %> ... <% } %>` |
| `<%# %>` | Comment (not rendered) | `<%# TODO: Fix this %>` |
| `<%- include() %>` | Include partial template | `<%- include('partials/header') %>` |

### 💬 Examples

```html
<!-- Output a variable (safe) -->
<h1>Hello <%= name %>!</h1>

<!-- Run code without output -->
<% const greeting = 'Hello'; %>

<!-- Conditional logic -->
<% if (user) { %>
  <p>Welcome, <%= user.name %>!</p>
<% } %>

<!-- Include a partial -->
<%- include('partials/header') %>
```

### ⚠️ Security Warning

```html
<!-- ✅ SAFE: HTML is escaped -->
<p>Comment: <%= userComment %></p>

<!-- ❌ DANGEROUS: Script tags will execute -->
<p>Comment: <%- userComment %></p>
```

### 📋 Key Rules

- **Always use `<%= %>` for user input** to prevent XSS attacks
- Only use `<%- %>` for trusted HTML content you control
- Use `<% %>` for logic that doesn't output anything
- Comments with `<%# %>` don't appear in final HTML

### 🧾 Quick Summary

```html
<%= variable %>           <!-- Output (escaped) -->
<%- htmlContent %>        <!-- Output (unescaped) -->
<% code %>                <!-- Execute code -->
<%- include('file') %>    <!-- Include partial -->
```

**📖 [EJS Documentation](https://ejs.co/#docs)**

---

## <a name="passing-data"></a>📤 Passing Data: Server → Template

> **💡 Key Concept:** Use `res.render()` to send data from your Express server to EJS templates, **replacing static HTML with dynamic content**.

### 📊 Rendering Methods

| Method | Purpose | Use Case |
| ------ | ------- | -------- |
| `res.send()` | Send static HTML string | Simple responses, APIs |
| `res.sendFile()` | Send static HTML file | Static pages only |
| `res.render()` | Render EJS template with data | Dynamic pages |

### 💬 Basic Example

```javascript
// server.js
app.get('/', (req, res) => {
  res.render('index', { 
    name: 'Angela',
    age: 25 
  });
});
```

```html
<!-- index.ejs -->
<h1>Hello <%= name %>!</h1>
<p>You are <%= age %> years old.</p>
```

**Output:** Hello Angela! You are 25 years old.

### 🔧 Passing Arrays & Objects

```javascript
app.get('/fruits', (req, res) => {
  res.render('fruits', { 
    fruits: ['Apple', 'Banana', 'Orange'],
    user: { name: 'John', role: 'admin' }
  });
});
```

```html
<!-- fruits.ejs -->
<h2>Welcome, <%= user.name %> (<%= user.role %>)</h2>
<ul>
  <% fruits.forEach(fruit => { %>
    <li><%= fruit %></li>
  <% }) %>
</ul>
```

### 🛡️ Safe Variable Access with `locals`

```javascript
res.render('profile', { username: 'Alice' });
// Notice: 'email' is not passed
```

```html
<!-- profile.ejs -->
<h1><%= locals.username || 'Guest' %></h1>

<% if (locals.email) { %>
  <p>Email: <%= email %></p>
<% } else { %>
  <p>No email provided</p>
<% } %>
```

### 📋 Key Rules

- Use `res.render('file', { key: value })` syntax
- Key names must match variable names in EJS
- Use `locals` to prevent crashes from undefined variables
- Provide default values: `<%= locals.title || 'Default' %>`

### 🧾 Quick Summary

```javascript
res.render('index', { name: 'Alice', age: 25 });
```

```html
<h1><%= name %></h1>
<p><%= locals.email || 'No email' %></p>
```

**Why `locals`?** It always exists in EJS, making it safe to check for undefined variables

---

## <a name="receiving-data"></a>📥 Receiving Data: Client → Server

> **💡 Key Concept:** HTML forms send data from the client to the server, which you access using `req.body` **after configuring middleware**.

### 📊 Data Flow

| Step | Location | Action |
| ---- | -------- | ------ |
| 1. User fills form | Client (browser) | Input data |
| 2. Form submits | Client → Server | POST request |
| 3. Server receives | Server | Access via `req.body` |
| 4. Server responds | Server → Client | Render template |

### 💬 Form Example

```html
<!-- form.ejs -->
<form action="/submit" method="POST">
  <input type="text" name="fName" placeholder="First Name" required>
  <input type="text" name="lName" placeholder="Last Name" required>
  <button type="submit">Submit</button>
</form>
```

### 🔧 Server-Side Handling

```javascript
// server.js - Middleware required!
app.use(express.urlencoded({ extended: true }));

app.post('/submit', (req, res) => {
  const firstName = req.body.fName;  // matches name="fName"
  const lastName = req.body.lName;   // matches name="lName"
  
  res.render('greeting', { 
    fullName: `${firstName} ${lastName}` 
  });
});
```

### 📋 Key Requirements

- ✅ Form inputs must have `name` attributes
- ✅ Use `express.urlencoded()` middleware to parse form data
- ✅ Access data via `req.body.fieldName`
- ✅ Field names in HTML must match `req.body` property names

### ✨ Complete Workflow

```text
1. User visits /form
2. User types "Alice" in name field
3. Form submits to /submit via POST
4. req.body.name = "Alice"
5. res.render('greeting', { name: 'Alice' })
6. Browser displays: "Hello Alice!"
```

### 🧾 Quick Summary

```html
<input type="text" name="fName">
```

```javascript
app.use(express.urlencoded({ extended: true }));
const data = req.body.fName;
```

**Remember:** The `name` attribute in HTML connects to `req.body` properties

---

## <a name="control-flow"></a>🔄 Control Flow

> **💡 Key Concept:** EJS supports **JavaScript control structures** (conditionals and loops) to create dynamic, data-driven templates.

### 📊 Control Flow Types

| Type | Purpose | Common Use |
| ---- | ------- | ---------- |
| Conditionals | Show/hide content | User authentication, status |
| Loops | Repeat elements | Display lists, tables, cards |

### 💬 Conditionals

```html
<!-- If/Else -->
<% if (user) { %>
  <p>Welcome back, <%= user.name %>!</p>
<% } else { %>
  <p>Please <a href="/login">log in</a>.</p>
<% } %>

<!-- Ternary operator -->
<p>Status: <%= isActive ? 'Online' : 'Offline' %></p>
```

### 🔁 For Loop

```html
<ul>
  <% for(let i = 0; i < items.length; i++) { %>
    <li>#<%= i + 1 %>: <%= items[i] %></li>
  <% } %>
</ul>
```

### 🔁 ForEach Loop (Preferred)

```html
<ul>
  <% items.forEach(item => { %>
    <li><%= item %></li>
  <% }) %>
</ul>
```

### 🔁 For...of Loop

```html
<% for(const product of products) { %>
  <div class="product">
    <h3><%= product.name %></h3>
    <p>$<%= product.price %></p>
  </div>
<% } %>
```

### 📋 Key Rules

- Use standard JavaScript syntax inside `<% %>`
- Close all opening braces properly
- Preferred: `forEach` for simple lists
- Use `for` loops when you need the index

### 🧾 Quick Summary

```html
<!-- Conditional -->
<% if (condition) { %> ... <% } %>

<!-- Loop -->
<% items.forEach(item => { %>
  <li><%= item %></li>
<% }) %>
```

***All JavaScript control flow works in EJS***

---

## <a name="partials"></a>🧩 Partials (Reusable Components)

> **💡 Key Concept:** Partials **eliminate code duplication** by extracting common elements into separate reusable files.

### 📊 Common Partials

| Partial | Purpose | Typical Content |
| ------- | ------- | --------------- |
| `header.ejs` | Page top | `<head>`, navigation, logo |
| `footer.ejs` | Page bottom | Copyright, links, scripts |
| `nav.ejs` | Navigation | Menu, links |

### 💬 Creating Partials

```html
<!-- views/partials/header.ejs -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title><%= title || 'My Website' %></title>
  <link rel="stylesheet" href="/styles/main.css">
</head>
<body>
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
  </nav>
```

```html
<!-- views/partials/footer.ejs -->
  <footer>
    <p>&copy; <%= new Date().getFullYear() %> My Website</p>
  </footer>
</body>
</html>
```

### 🔧 Using Partials

```html
<!-- views/index.ejs -->
<%- include('partials/header') %>

<main>
  <h1>Welcome to my website!</h1>
  <p>This is the main content.</p>
</main>

<%- include('partials/footer') %>
```

### ✨ Benefits

- **DRY principle** (Don't Repeat Yourself)
- Update header/footer once, applies to all pages
- Cleaner, more maintainable code
- Only main content changes per page

### 📋 Key Rules

- Use `<%- include() %>` (with hyphen) to render HTML properly
- Partial paths are relative to `views/` folder
- Variables passed to parent template are accessible in partials
- Organize partials in `views/partials/` folder

### 🧾 Quick Summary

```html
<!-- Create partial -->
<!-- views/partials/header.ejs -->

<!-- Use partial -->
<%- include('partials/header') %>
```

***One change updates all pages***

---

## <a name="static-files"></a>📁 Static Files

> **💡 Key Concept:** Static files (CSS, images, client-side JavaScript) **don't need dynamic rendering** and are served directly by Express.

### 📊 File Types

| Type | Examples | Location |
| ---- | -------- | -------- |
| Stylesheets | `.css` | `public/styles/` |
| Images | `.png`, `.jpg`, `.svg` | `public/images/` |
| Scripts | `.js` | `public/scripts/` |

### 🔧 Setup

```javascript
// server.js
app.use(express.static('public'));
```

### 📂 File Structure

```plaintext
public/
├─ styles/
│  ├─ main.css
│  └─ layout.css
├─ images/
│  └─ logo.png
└─ scripts/
   └─ app.js
```

### 💬 Linking in EJS

```html
<!-- Path starts from public/ -->
<link rel="stylesheet" href="/styles/main.css">
<img src="/images/logo.png" alt="Logo">
<script src="/scripts/app.js"></script>
```

### 📋 Key Rules

- ✅ Put static files in `public/` folder
- ✅ Use `express.static('public')` middleware
- ✅ Link paths start from public folder: `/styles/...`
- ❌ Don't include "public" in the path

### 🔍 Why Separate?

| Dynamic Pages (EJS) | Static Files |
| ------------------- | ------------ |
| Rendered by backend | Served directly |
| Use routes | No routes needed |
| `.ejs` extension | `.css`, `.js`, `.png` |
| In `views/` folder | In `public/` folder |

### 🧾 Quick Summary

```javascript
app.use(express.static('public'));
```

```html
<link href="/styles/main.css">
<img src="/images/logo.png">
```

**Express serves files from `public/` directory directly**

---

## <a name="best-practices"></a>✅ Best Practices

> **💡 Key Concept:** Following best practices ensures **secure, maintainable, and performant** EJS applications.

### 🔒 Security

```html
<!-- ✅ Good: Escaped output (prevents XSS) -->
<p>Comment: <%= userComment %></p>

<!-- ❌ Bad: Unescaped (XSS vulnerability) -->
<p>Comment: <%- userComment %></p>
```

### 🛡️ Error Prevention

| Problem | Solution |
| ------- | -------- |
| Undefined variables crash page | Use `locals` to check safely |
| Missing data breaks template | Provide default values |
| Nested properties error | Check parent exists first |

```html
<!-- ✅ Safe variable access -->
<h1><%= locals.title || 'Default Title' %></h1>

<% if (locals.user) { %>
  <p>Email: <%= user.email %></p>
<% } %>
```

### 📂 Code Organization

```html
<!-- ✅ Good: Logic in routes -->
// server.js
const processedData = rawData.map(/* process */);
res.render('page', { data: processedData });

<!-- ❌ Avoid: Complex logic in templates -->
<% data.map(item => { /* complex processing */ }) %>
```

### ⚡ Performance

- Minimize logic in templates
- Pre-process data in routes before rendering
- Use partials to avoid duplicating HTML
- Cache static assets properly

### 📋 Organization Checklist

- ✅ Use partials for headers, footers, navigation
- ✅ Keep logic in server routes, not in templates
- ✅ Pass processed data to EJS rather than raw data
- ✅ Always escape user input with `<%= %>`
- ✅ Check for undefined with `locals`

### 🧾 Quick Summary

```html
<!-- Security -->
<%= userInput %>    ✅
<%- userInput %>    ❌

<!-- Error Prevention -->
<%= locals.var || 'default' %>    ✅

<!-- Organization -->
Keep logic in routes, not templates    ✅
```

***Security and maintainability come first***

---

## 🎯 Common Patterns

### 🔗 Dynamic Navigation (Active Link)

```javascript
res.render('page', { currentPage: 'about' });
```

```html
<nav>
  <a href="/" class="<%= currentPage === 'home' ? 'active' : '' %>">Home</a>
  <a href="/about" class="<%= currentPage === 'about' ? 'active' : '' %>">About</a>
</nav>
```

### 📅 Passing Functions

```javascript
res.render('index', { 
  formatDate: (date) => date.toLocaleDateString() 
});
```

```html
<p>Today is: <%= formatDate(new Date()) %></p>
```

### 🗂️ Nested Data

```javascript
res.render('products', {
  categories: [
    { name: 'Electronics', items: ['Phone', 'Laptop'] },
    { name: 'Books', items: ['Fiction', 'Non-fiction'] }
  ]
});
```

```html
<% categories.forEach(category => { %>
  <h2><%= category.name %></h2>
  <ul>
    <% category.items.forEach(item => { %>
      <li><%= item %></li>
    <% }) %>
  </ul>
<% }) %>
```

---

## 📋 Quick Reference

| Task | Solution |
| :------ | :---------- |
| Render template | `res.render('file', { data })` |
| Output variable | `<%= variable %>` |
| Output HTML | `<%- htmlContent %>` |
| Run JS code | `<% code %>` |
| Loop through array | `<% array.forEach(item => { %> ... <% }) %>` |
| Conditional | `<% if(condition) { %> ... <% } %>` |
| Include partial | `<%- include('partials/name') %>` |
| Safe access | `` <%= locals.var \|\| 'default' %> `` |
| Static files | `app.use(express.static('public'))` |
| Form data | `req.body.fieldName` (requires middleware) |

---

## 🔑 Summary

EJS is a powerful templating language that bridges the gap between static HTML and dynamic web applications.  
It enables separation of concerns by keeping HTML structure in template files while allowing JavaScript logic to inject dynamic content from the server.  
With features like partials for reusable components, built-in control flow for conditionals and loops, and safe variable handling with `locals`, EJS makes building multi-page dynamic websites clean and maintainable.  
Understanding the difference between output tags (`<%= %>` for safe escaped output vs `<%- %>` for raw HTML) is crucial for security.  
Static files are served separately through Express middleware, while dynamic content flows from server routes through `res.render()` to EJS templates.  
Mastering these fundamentals allows you to build scalable, organized web applications with proper separation between frontend structure and backend logic.

**📖 [EJS Official Documentation](https://ejs.co/)**

---
