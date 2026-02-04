# ✏️ Express.js Study Notes

## 📚 Table of Contents

- [🎯 Introduction to Express.js](#introduction)
- [⚙️ Setting Up an Express Server](#setup)
- [🌐 HTTP Fundamentals](#http-fundamentals)
- [🛤️ Express Routing](#routing)
- [🔧 Middleware Deep Dive](#middleware)
- [🧪 Testing with Postman](#postman)
- [💻 Complete Working Example](#example)

---

## <a name="introduction"></a>🎯 Introduction to Express.js

> **💡 Key Concept:** Express.js is a web framework built on top of Node.js that makes building backends faster, cleaner, and more organized.

### 🧩 The JavaScript Backend Stack

Understanding how the pieces fit together:

| Layer | Type | What It Does |
| :----- | :---- | :------------ |
| **JavaScript** | Programming Language | The code you write |
| **Node.js** | Runtime Environment | Lets JavaScript run on servers |
| **Express.js** | Web Framework | Simplifies backend development |

**Mental Model:**

- **Node** provides the power (ability to run JavaScript on servers)
- **Express** provides the focus (structure for building web applications)

### ⚖️ Node.js vs Express.js

**Node.js (Runtime Environment):**

- General-purpose JavaScript runtime
- Can build: servers, desktop apps (VS Code), IoT devices
- Powerful but requires more low-level code
- **Analogy:** Manual screwdriver (flexible but requires more effort)

**Express.js (Web Framework):**

- Specialized tool for web backends
- Handles routing, requests, and responses automatically
- Less code, better readability
- Built-in middleware system
- **Analogy:** Electric screwdriver (faster, easier, purpose-built)

### 📊 Code Comparison

Building a simple two-page website:

| Approach | Lines of Code | Readability |
| :-------- | :------------- | :----------- |
| **Plain Node.js** | ~50+ lines | Complex, hard to follow |
| **Express.js** | ~15 lines | Clean, organized |

### ✅ Section Summary

| Concept | Key Point |
| :------- | :--------- |
| **Express.js** | Web framework built on Node.js |
| **Node.js** | Runtime that lets JavaScript run on servers |
| **Why Express?** | Reduces code, improves readability, adds structure |
| **Industry standard** | Most popular Node.js backend framework |

---

## <a name="setup"></a>⚙️ Setting Up an Express Server

> **💡 Key Concept:** Setting up Express requires npm (Node Package Manager) to install dependencies and organize your project.

### 🏗️ Project Setup (Step-by-Step)

#### Step 1 — Create Project Folder

```bash
mkdir my-express-app
cd my-express-app
```

#### Step 2 — Initialize npm

```bash
npm init -y
```

Creates `package.json` with default settings.

#### Step 3 — Install Express

```bash
npm install express
```

Creates `node_modules` folder and adds Express to dependencies.

#### Step 4 — Enable ES Modules

Add to `package.json`:

```json
"type": "module"
```

This allows modern `import` syntax instead of `require`.

#### Step 5 — Create Server File

```bash
touch index.js
```

#### Step 6 — Write Basic Server Code

```javascript
import express from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
```

#### Step 7 — Run the Server

```bash
node index.js
```

Visit `http://localhost:3000` in your browser.

### 🚪 Understanding Localhost and Ports

**Localhost:**

- Refers to your own computer
- IP address: `127.0.0.1`
- Used for local development and testing

**Ports = Numbered Doors:**

Think of your computer as a building with numbered doors. Each service listens on a specific door (port).

```plaintext
http://localhost:3000  → Your Express app (door 3000)
http://localhost:5432  → PostgreSQL database (door 5432)
http://localhost:27017 → MongoDB database (door 27017)
```

**Why this matters:**

- Multiple apps can run simultaneously on different ports
- Common convention: port 3000 for development
- Prevents services from conflicting with each other

### 🛠️ Development Tools

#### Nodemon (Auto-Restart)

**Problem:** Every code change requires manually stopping and restarting the server.

**Solution:** Nodemon automatically restarts your server when files change.

**Install globally:**

```bash
npm install -g nodemon
```

**Usage:**

```bash
nodemon index.js
```

Now every save triggers an automatic restart! 🎉

#### Working with Downloaded Projects

When cloning or downloading a Node project:

1. The `node_modules` folder is usually **excluded** (too large)
2. Navigate to project folder: `cd project-folder`
3. Install dependencies: `npm install`

This reads `package.json` and installs all required packages.

#### Checking for Port Conflicts

If you see **"Address already in use"** error:

| Operating System | Command |
| :---------------- | :------- |
| **Mac/Linux** | `sudo lsof -i -P -n \| grep LISTEN` |
| **Windows** | `netstat -ano \| findstr "LISTENING"` |

**Fix:** Stop the conflicting process with `Ctrl + C` or use a different port.

### ✅ Section Summary

| Concept | Key Point |
| :------- | :--------- |
| **npm init -y** | Initialize project with `package.json` |
| **npm install express** | Add Express to your project |
| **"type": "module"** | Enable modern `import` syntax |
| **Localhost** | Your own computer (`127.0.0.1`) |
| **Ports** | Numbered doors for different services |
| **Nodemon** | Auto-restart server on file changes |

---

## <a name="http-fundamentals"></a>🌐 HTTP Fundamentals

> **💡 Key Concept:** HTTP is the language computers use to communicate over the web. Understanding requests, methods, and status codes is essential for backend development.

### 🤝 The Client-Server Model

**The Complete Flow:**

```plaintext
Client (Browser)
      ↓
1. Sends HTTP Request (e.g., GET /about)
      ↓
Server (Your Express App)
      ↓
2. Processes Request (runs route handler)
      ↓
3. Sends HTTP Response (HTML, JSON, etc.)
      ↓
Client displays the result
```

**Key Players:**

| Role | Description | Examples |
| :---- | :----------- | :-------- |
| **Client** | Initiates requests | Browser, mobile app, Postman |
| **Server** | Processes & responds | Your Express app, database |

### 📬 HTTP Request Methods

HTTP methods (verbs) define **what action** to perform:

| Method | Purpose | Example Use Case | Data Location |
| :------ | :------- | :---------------- | :------------- |
| **GET** | Retrieve data | Load webpage, fetch user profile | URL (visible) |
| **POST** | Create new resource | Submit form, create account | Body (hidden) |
| **PUT** | Replace entire resource | Update entire user profile | Body |
| **PATCH** | Update part of resource | Change only email or password | Body |
| **DELETE** | Remove resource | Delete post or user | URL |

### 🔑 Key Differences

**PUT vs PATCH:**

- **PUT:** Replaces the **entire** resource (all fields required)
- **PATCH:** Updates **only specified** fields (partial update)

**GET vs POST:**

- **GET:** Data in URL (visible in browser, limited size ~2KB)
- **POST:** Data in body (hidden, unlimited size)

### 📊 HTTP Status Codes

Status codes communicate the outcome of a request:

| Range | Category | Meaning (The "Sander Hoogendoorn" Summary) |
| :----- | :-------- | :------------------------------------------ |
| **100-199** | Informational | "Hold on, something is happening" |
| **200-299** | Success | "Here you go, everything went A-OK" |
| **300-399** | Redirection | "Go away" (resource moved) |
| **400-499** | Client Error | "You screwed up" |
| **500-599** | Server Error | "I screwed up" |

### 🎯 Common Status Codes

**Success Codes:**

| Code | Name | When to Use |
| :---- | :---- | :----------- |
| `200` | OK | Standard success (GET, PUT, PATCH, DELETE) |
| `201` | Created | Resource successfully created (POST) |

**Client Error Codes:**

| Code | Name | When to Use |
| :---- | :---- | :----------- |
| `400` | Bad Request | Invalid request format |
| `401` | Unauthorized | Authentication required |
| `403` | Forbidden | Authenticated but not permitted |
| `404` | Not Found | Resource doesn't exist |

**Server Error Codes:**

| Code | Name | When to Use |
| :---- | :---- | :----------- |
| `500` | Internal Server Error | Generic server error |
| `503` | Service Unavailable | Server temporarily down |

### 🧪 Using Status Codes in Express

```javascript
// Success - User created
app.post("/users", (req, res) => {
  res.status(201).json({ message: "User created" });
});

// Client Error - Page not found
app.get("/missing", (req, res) => {
  res.status(404).send("Page not found");
});

// Server Error - Something broke
app.get("/broken", (req, res) => {
  res.status(500).json({ error: "Internal server error" });
});
```

### ✅ Section Summary

| Concept | Key Point |
| :------- | :--------- |
| **Client-Server** | Client requests, server responds |
| **HTTP Methods** | GET (retrieve), POST (create), PUT (replace), PATCH (update), DELETE (remove) |
| **Status Codes** | 2xx (success), 4xx (client error), 5xx (server error) |
| **Common codes** | 200 (OK), 201 (Created), 404 (Not Found), 500 (Server Error) |

---

## <a name="routing"></a>🛤️ Express Routing

> **💡 Key Concept:** Routes define how your server responds to specific requests. Think of them as directions: "When someone goes to this URL, do this."

### 🎯 Basic Route Structure

```javascript
app.METHOD(PATH, HANDLER)
```

| Part | What It Is | Example |
| :---- | :---------- | :------- |
| **METHOD** | HTTP method | `get`, `post`, `put`, `patch`, `delete` |
| **PATH** | URL endpoint | `/`, `/about`, `/api/users` |
| **HANDLER** | Function to execute | `(req, res) => { ... }` |

### 📦 Request and Response Objects

Every route handler receives two objects:

**Request Object (`req`):**

Contains information about the incoming request.

```javascript
req.method        // HTTP method (GET, POST, etc.)
req.url           // Request URL
req.headers       // Request headers
req.body          // Request body (requires middleware)
req.params        // URL parameters (/user/:id)
req.query         // Query string parameters (?name=John)
req.rawHeaders    // Raw header array
```

**Response Object (`res`):**

Used to send data back to the client.

```javascript
res.send()        // Send response (auto-detects content type)
res.json()        // Send JSON response
res.status()      // Set HTTP status code
res.sendStatus()  // Send status code only
res.redirect()    // Redirect to another URL
res.render()      // Render view template (with template engines)
```

### 🧪 Multiple Routes Example

```javascript
import express from "express";
const app = express();

// Home page
app.get("/", (req, res) => {
  res.send("<h1>Welcome Home</h1>");
});

// About page
app.get("/about", (req, res) => {
  res.send("<h1>About Us</h1><p>We build awesome apps.</p>");
});

// Contact page
app.get("/contact", (req, res) => {
  res.send("<h1>Contact</h1><p>Email: hello@example.com</p>");
});

// API endpoint (JSON response)
app.get("/api/users", (req, res) => {
  res.json([
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" }
  ]);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

**URLs you can visit:**

- `http://localhost:3000/` → Home page
- `http://localhost:3000/about` → About page
- `http://localhost:3000/contact` → Contact page
- `http://localhost:3000/api/users` → JSON user data

### ❌ Understanding "Cannot GET /" Error

When you see this error:

```bash
Cannot GET /
```

**What it means:**

1. Browser sent a **GET request** to `/` (root)
2. No route handler defined for **GET `/`**
3. Express doesn't know how to respond

**How to fix:**

```javascript
app.get("/", (req, res) => {
  res.send("Hello World");
});
```

### 🎯 Route Flow Diagram

```javascript
User visits http://localhost:3000/about
            ↓
Browser sends: GET /about
            ↓
Express checks routes for: app.get("/about", ...)
            ↓
Match found! Run the handler function
            ↓
res.send("<h1>About Us</h1>")
            ↓
Response sent back to browser
            ↓
User sees "About Us" page
```

### ✅ Section Summary

| Concept | Key Point |
| :------- | :--------- |
| **Route structure** | `app.METHOD(PATH, HANDLER)` |
| **`req` object** | Contains request information (method, headers, body) |
| **`res` object** | Sends responses (send, json, status, redirect) |
| **Multiple routes** | Each URL gets its own handler |
| **"Cannot GET /"** | No route handler defined for that path |

---

## <a name="middleware"></a>🔧 Middleware Deep Dive

> **💡 Key Concept:** Middleware functions execute during the request-response cycle, **before** your route handler runs. Think of them as checkpoints or processing stations.

### 🧱 What is Middleware?

**Three Key Metaphors:**

1. **Lego Blocks:** Snap together different functionalities
2. **Assembly Line:** Each station processes the request
3. **Security Checkpoints:** Each layer validates or modifies the request

**Middleware Signature:**

```javascript
(req, res, next) => {
  // Do something with req or res
  next(); // Pass control to the next middleware
}
```

**The `next()` Function:**

- Passes control to the next middleware in the chain
- **Must be called** unless you're ending the request (sending a response)
- Forgetting `next()` causes the request to **hang forever**

### 🔄 How Middleware Works (The Flow)

```plaintext
Client Request (http://localhost:3000/api/users)
            ↓
[Middleware 1] → Logging (Morgan)
            ↓
[Middleware 2] → Authentication (Check token)
            ↓
[Middleware 3] → Parse JSON (express.json())
            ↓
[Route Handler] → Business logic (send user data)
            ↓
Response sent to Client
```

### 🏗️ Built-in Express Middleware

**1. Parse JSON bodies:**

```javascript
app.use(express.json());
```

- Enables `req.body` for JSON data
- Required for POST/PUT/PATCH requests with JSON
- Must come **before** routes that use `req.body`

**2. Parse URL-encoded form data:**

```javascript
app.use(express.urlencoded({ extended: true }));
```

- Enables `req.body` for form submissions
- Handles `application/x-www-form-urlencoded` content type

**3. Serve static files:**

```javascript
app.use(express.static('public'));
```

- Serves files from `public` folder (CSS, images, JS)
- Files accessible at: `http://localhost:3000/style.css`

**Complete Setup:**

```javascript
import express from "express";
const app = express();

// Middleware (order matters!)
app.use(express.json());                        // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse forms
app.use(express.static('public'));               // Serve static files

// Routes come AFTER middleware
app.post("/submit", (req, res) => {
  console.log(req.body); // Now accessible!
  res.json({ received: req.body });
});
```

### 🎨 Custom Middleware Examples

**1. Logging Middleware:**

```javascript
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
```

**Output:**

```bash
[2026-02-03T23:59:59.123Z] GET /about
[2026-02-03T23:59:59.456Z] POST /submit
```

**2. Authentication Middleware:**

```javascript
function checkAuth(req, res, next) {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).send("Not authorized");
  }
  
  // Token validation logic here
  next(); // User is authorized, continue
}

// Apply to specific routes
app.get("/protected", checkAuth, (req, res) => {
  res.send("You are authorized!");
});
```

**3. Request Timer:**

```javascript
app.use((req, res, next) => {
  req.requestTime = Date.now();
  next();
});

app.get("/", (req, res) => {
  res.send(`Request received at: ${req.requestTime}`);
});
```

**4. Error-Handling Middleware:**

```javascript
// Must have 4 parameters (err, req, res, next)
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Something went wrong!" });
});
```

**⚠️ Important:** Error-handling middleware must be defined **LAST**, after all routes.

### 📝 Morgan (Logging Middleware)

Morgan is a popular HTTP request logger.

**Install:**

```bash
npm install morgan
```

**Usage:**

```javascript
import morgan from "morgan";

// Development format (colored output)
app.use(morgan("dev"));

// Example output:
// GET /users 200 4.321 ms - 11
```

**Common Formats:**

| Format | Description | Output Example |
| :------ | :----------- | :-------------- |
| `"dev"` | Concise colored output | `GET /users 200 4.321 ms` |
| `"combined"` | Apache-style logs | Includes IP, date, user-agent |
| `"tiny"` | Minimal logs | Method, URL, status, content length |

**Custom Format:**

```javascript
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
```

### ⚠️ Middleware Best Practices

**1. Order matters:**

```javascript
// ✅ CORRECT ORDER
app.use(express.json());        // Parse first
app.post("/data", handler);     // Then routes

// ❌ WRONG ORDER (req.body will be undefined!)
app.post("/data", handler);     // Routes before parsing
app.use(express.json());        // Too late!
```

**2. Always call `next()` or send response:**

```javascript
// ✅ CORRECT
app.use((req, res, next) => {
  console.log("Logging...");
  next(); // Continue to next middleware
});

// ❌ WRONG (request hangs forever!)
app.use((req, res, next) => {
  console.log("Logging...");
  // Forgot next()!
});
```

**3. Error handlers go last:**

```javascript
// Routes first
app.get("/", handler);
app.post("/data", handler);

// 404 handler
app.use((req, res) => {
  res.status(404).send("Route not found");
});

// Error handler LAST
app.use((err, req, res, next) => {
  res.status(500).send("Error!");
});
```

### 🗂️ Middleware Types Summary

| Type | Purpose | Example |
| :---- | :------- | :------- |
| **Parsing** | Process request data | `express.json()`, `express.urlencoded()` |
| **Logging** | Record requests | Morgan, custom logger |
| **Authentication** | Verify identity | Check tokens, sessions |
| **Authorization** | Check permissions | Role verification |
| **Error Handling** | Catch and handle errors | Error middleware (4 params) |
| **Static Files** | Serve CSS, images, JS | `express.static()` |
| **Custom** | Any business logic | Timers, flags, data processing |

### ✅ Section Summary

| Concept | Key Point |
| :------- | :--------- |
| **Middleware** | Functions that run before route handlers |
| **`next()`** | Passes control to next middleware (must be called!) |
| **Order matters** | Middleware runs top-to-bottom |
| **Built-in** | `express.json()`, `express.urlencoded()`, `express.static()` |
| **Morgan** | Popular logging middleware |
| **Error handlers** | Must have 4 parameters, goes last |
| **Common mistake** | Forgetting `next()` causes request to hang |

---

## <a name="postman"></a>🧪 Testing with Postman

> **💡 Key Concept:** Postman lets you test your API endpoints without building a frontend. It's like a playground for your backend.

### 🎯 What is Postman?

Postman is a tool for testing APIs by manually sending HTTP requests and viewing responses.

**Key Features:**

| Feature | Description |
| :------- | :----------- |
| **Send requests** | GET, POST, PUT, DELETE, PATCH |
| **Add headers** | Content-Type, Authorization, custom headers |
| **Send bodies** | JSON, form-data, raw text, files |
| **View responses** | Body, status code, headers, timing |
| **Save requests** | Organize in collections for reuse |
| **Test before frontend** | Verify API works before building UI |

### 🔄 Basic Postman Workflow

```plaintext
1. Select HTTP method → GET, POST, etc.
            ↓
2. Enter URL → http://localhost:3000/api/users
            ↓
3. Add headers (if needed) → Content-Type: application/json
            ↓
4. Add body (for POST/PUT/PATCH) → { "name": "John" }
            ↓
5. Click "Send" → Request sent to server
            ↓
6. View response → Body, status code, headers
```

### 📬 Testing Different Request Types

**GET Request (No body needed):**

```bash
Method: GET
URL: http://localhost:3000/users
```

No body or headers required for simple GET requests.

**POST Request with JSON:**

```bash
Method: POST
URL: http://localhost:3000/users
Headers: Content-Type: application/json
Body (raw → JSON):
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**POST Request with Form Data:**

```bash
Method: POST
URL: http://localhost:3000/submit
Body (form-data):
┌──────┬──────────────────┐
│ Key  │ Value            │
├──────┼──────────────────┤
│ name │ Ross             │
│ email│ ross@example.com │
└──────┴──────────────────┘
```

**Testing Authentication:**

```bash
Method: GET
URL: http://localhost:3000/protected
Headers:
┌───────────────┬──────────────────────┐
│ Key           │ Value                │
├───────────────┼──────────────────────┤
│ Authorization │ Bearer your-token-123│
└───────────────┴──────────────────────┘
```

### 📦 Request Body Types in Postman

| Type | When to Use | Server Requirement |
| :---- | :----------- | :------------------ |
| **JSON (raw)** | Modern APIs, most common | `express.json()` |
| **form-data** | HTML forms, file uploads | `express.urlencoded()` |
| **x-www-form-urlencoded** | Traditional forms | `express.urlencoded()` |
| **raw** | Plain text, XML, custom | Manual parsing |

### 🧪 Complete Example (Server + Postman)

**Server Code:**

```javascript
import express from "express";
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test endpoint
app.post("/submit", (req, res) => {
  console.log("Received data:", req.body);
  res.status(201).json({
    message: "Data received successfully",
    data: req.body
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

**Postman Test:**

```JSON
Method: POST
URL: http://localhost:3000/submit
Headers: Content-Type: application/json
Body (JSON):
{
  "username": "alice",
  "password": "secret123"
}
```

**Expected Response:**

```json
Status: 201 Created

{
  "message": "Data received successfully",
  "data": {
    "username": "alice",
    "password": "secret123"
  }
}
```

### 🎯 Testing Checklist

Before building your frontend, test these scenarios in Postman:

- [ ] **GET requests** return correct data
- [ ] **POST requests** create resources (status 201)
- [ ] **PUT/PATCH requests** update resources (status 200)
- [ ] **DELETE requests** remove resources (status 200)
- [ ] **Invalid data** returns 400 Bad Request
- [ ] **Missing auth** returns 401 Unauthorized
- [ ] **Wrong permissions** returns 403 Forbidden
- [ ] **Non-existent resources** return 404 Not Found
- [ ] **Server errors** return 500 Internal Server Error

### ✅ Section Summary

| Concept | Key Point |
| :------- | :--------- |
| **Postman** | Tool for testing APIs without a frontend |
| **Workflow** | Select method → Enter URL → Add headers/body → Send |
| **Body types** | JSON (most common), form-data, x-www-form-urlencoded |
| **Test first** | Verify API works before building UI |
| **Check responses** | Status code, body, headers, timing |

---

## <a name="example"></a>💻 Complete Working Example

> **💡 Key Concept:** This comprehensive example demonstrates all Express.js concepts working together in a real-world server.

### 🏗️ Full Server Code

```javascript
import express from "express";
import morgan from "morgan";

const app = express();
const port = 3000;

// ===== MIDDLEWARE =====

// Logging (Morgan)
app.use(morgan("dev"));

// Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static("public"));

// Custom logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Authentication middleware (reusable)
function requireAuth(req, res, next) {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  
  // Token validation would go here
  // For demo purposes, we'll accept any token
  next();
}

// ===== ROUTES =====

// Home page
app.get("/", (req, res) => {
  res.send("<h1>Welcome to Express Server</h1>");
});

// About page (JSON response)
app.get("/about", (req, res) => {
  res.json({
    name: "Express API",
    version: "1.0.0",
    description: "A comprehensive Express.js example"
  });
});

// GET all users
app.get("/api/users", (req, res) => {
  const users = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" }
  ];
  res.json(users);
});

// POST create user
app.post("/api/users", (req, res) => {
  const { name, email } = req.body;
  
  // Validation
  if (!name || !email) {
    return res.status(400).json({ 
      error: "Name and email are required" 
    });
  }
  
  // Create new user
  const newUser = {
    id: Date.now(),
    name,
    email
  };
  
  res.status(201).json({
    message: "User created successfully",
    user: newUser
  });
});

// Protected route (requires authentication)
app.get("/api/protected", requireAuth, (req, res) => {
  res.json({ 
    message: "You have access to protected data",
    secretData: "Top secret information"
  });
});

// ===== ERROR HANDLING =====

// 404 handler (must be after all routes)
app.use((req, res) => {
  res.status(404).json({ 
    error: "Route not found",
    path: req.url
  });
});

// Error handler (must be last)
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ 
    error: "Something went wrong!",
    message: err.message
  });
});

// ===== START SERVER =====

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`
Available endpoints:
  GET  /                 → Home page
  GET  /about            → About (JSON)
  GET  /api/users        → Get all users
  POST /api/users        → Create user
  GET  /api/protected    → Protected route (requires auth)
  `);
});
```

### 🧪 Testing the Example Server

**1. Start the server:**

```bash
nodemon index.js
```

**2. Test routes in Postman:**

| Method | URL | Body | Expected Status |
| :------ | :--- | :---- | :--------------- |
| GET | `http://localhost:3000/` | None | 200 |
| GET | `http://localhost:3000/about` | None | 200 |
| GET | `http://localhost:3000/api/users` | None | 200 |
| POST | `http://localhost:3000/api/users` | `{"name":"John","email":"john@test.com"}` | 201 |
| POST | `http://localhost:3000/api/users` | `{}` (empty) | 400 |
| GET | `http://localhost:3000/api/protected` | No auth header | 401 |
| GET | `http://localhost:3000/api/protected` | Header: `Authorization: Bearer token123` | 200 |
| GET | `http://localhost:3000/invalid` | None | 404 |

### ✅ What This Example Demonstrates

| Concept | Location in Code |
| :------- | :---------------- |
| **Middleware order** | Lines 6-20 (logging, parsing, static files) |
| **Custom middleware** | Lines 17-20, 23-32 (logging, auth) |
| **Multiple routes** | Lines 37-82 (home, about, users, protected) |
| **HTTP methods** | GET (retrieve), POST (create) |
| **Status codes** | 200, 201, 400, 401, 404, 500 |
| **Request validation** | Lines 60-64 (check name & email) |
| **Protected routes** | Line 76 (requires auth middleware) |
| **Error handling** | Lines 87-99 (404 handler, error middleware) |

---

## 🎯 Quick Reference

### Common Commands

```bash
# Initialize project
npm init -y

# Install Express
npm install express

# Install dev tools
npm install -g nodemon
npm install morgan

# Run server
node index.js           # Manual restart
nodemon index.js        # Auto-restart on changes

# Install dependencies (downloaded projects)
npm install
```

### Essential Express Patterns

| Pattern | Code |
| :------- | :---- |
| **Basic server** | `const app = express();` <br> `app.listen(3000);` |
| **Middleware setup** | `app.use(express.json());` <br> `app.use(express.urlencoded({ extended: true }));` |
| **GET route** | `app.get("/path", (req, res) => { res.send("Hi"); });` |
| **Send JSON** | `res.json({ key: "value" });` |
| **Set status** | `res.status(201).json({ message: "Created" });` |
| **Custom middleware** | `app.use((req, res, next) => { next(); });` |

### ⚠️ Common Gotchas

| Problem | Why It Happens | Solution |
| :------- | :-------------- | :-------- |
| **Port already in use** | Another server running on same port | Stop with `Ctrl + C` or use different port |
| **`req.body` undefined** | Forgot parsing middleware | Add `express.json()` BEFORE routes |
| **Request hangs** | Forgot `next()` or response | Call `next()` or send response |
| **404 on all routes** | Routes after error handler | Define routes BEFORE 404/error handlers |
| **Cannot find module** | Missing dependencies | Run `npm install` |

---

## 🔗 Useful Resources

**Official Documentation:**

- **Express.js:** [https://expressjs.com/](https://expressjs.com/)
- **HTTP Status Codes:** [https://developer.mozilla.org/en-US/docs/Web/HTTP/Status](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- **Node.js:** [https://nodejs.org/](https://nodejs.org/)

**Learning Resources:**

- **Express Routing Guide:** [https://expressjs.com/en/guide/routing.html](https://expressjs.com/en/guide/routing.html)
- **MDN HTTP Methods:** [https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
- **REST API Tutorial:** [https://restfulapi.net/](https://restfulapi.net/)

**Tools:**

- **Postman:** [https://www.postman.com/](https://www.postman.com/)
- **Morgan (logging):** [https://github.com/expressjs/morgan](https://github.com/expressjs/morgan)
- **Nodemon:** [https://nodemon.io/](https://nodemon.io/)

---

## 🧾 Summary

**Express.js** is a web framework built on **Node.js** that simplifies backend development. It provides **routing** (defining how the server responds to requests), **middleware** (processing requests before they reach route handlers), and built-in tools for **parsing JSON and forms**. **HTTP methods** (GET, POST, PUT, PATCH, DELETE) define intent, while **status codes** (200, 201, 404, 500) communicate outcomes. The **`req` object** contains request data, and the **`res` object** sends responses. **Middleware runs in order** (top-to-bottom), and you must **always call `next()` or send a response** to avoid hanging requests. **Postman** lets you test APIs before building a frontend. Master these fundamentals to build production-quality web applications efficiently.

---
