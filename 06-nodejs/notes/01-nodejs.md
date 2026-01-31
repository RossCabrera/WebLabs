# ✏️ Node.js Study Notes

## 📚 Table of Contents

- [🌐 Understanding Node.js](#understanding-nodejs)
- [⚙️ Installation & Setup](#installation-setup)
- [📦 Package Management](#package-management)
- [📁 File System (fs)](#file-system)
- [🔄 Modules & Imports](#modules-imports)
- [🚀 Building Servers](#building-servers)

---

## <a name="understanding-nodejs"></a>🌐 Understanding Node.js

> **💡 Key Concept:** Node.js is not a framework—it's a JavaScript runtime that allows you to run JavaScript outside the browser, enabling server-side development.

### 🤔 What is Node.js?

**Definition:** An asynchronous, event-driven JavaScript runtime built on Chrome's V8 Engine (written in C/C++)

| Concept | Reality |
| :--- | :--- |
| ✅ Runtime environment | ❌ Framework |
| ✅ JavaScript on servers | ❌ Programming language |
| ✅ Asynchronous & event-driven | ❌ Browser-dependent |
| ✅ Asynchronous & event-driven | ❌ Browser-dependent |

### 🧠 Why Node.js Exists

**The Problem:** JavaScript originally only worked in browsers

**The Solution:** Node.js uses the V8 Engine to run JavaScript anywhere

**What You Can Build:**

- Backend applications & APIs
- Web servers
- Desktop applications
- Command-line tools
- Full-stack applications with one language

### 🔄 Core Architecture Concepts

#### Synchronous vs. Asynchronous

| Type | Behavior | Real-World Analogy |
| :--- | :--- | :--- |
| **Synchronous (Blocking)** | Code runs step-by-step, waiting for each task | Standing at the door until a package arrives |
| **Asynchronous (Non-Blocking)** | Tasks run in background, code continues | Ordering a package and doing other things while waiting |

#### Event-Driven Programming

Your code responds to **events** (triggers) rather than running sequentially:

- A request arrives
- A file finishes loading
- A user clicks a button
- A timer completes

```javascript
// Event-driven example
server.on('request', (req, res) => {
  res.end('Request received!');
});
```

### 🚀 Why Use Node.js?

| Benefit | Description |
| :--- | :--- |
| **One Language** | JavaScript for frontend & backend |
| **Fast** | Powered by Google's V8 Engine |
| **Non-Blocking** | Handles many concurrent users efficiently |
| **Scalable** | Ideal for real-time, data-intensive applications |
| **Huge Ecosystem** | 2+ million packages via npm |
| **Strong Community** | Extensive documentation and support |

### 🏢 Who Uses Node.js?

Major companies trust Node.js for production:

- Netflix
- LinkedIn
- NASA
- Twitter
- PayPal
- Uber

### 🆚 Node.js vs. Other Technologies

| Technology | Best For |
| :--- | :--- |
| **Node.js** | Modern web apps, APIs, real-time services |
| **Python (Flask/Django)** | Machine learning, data science, AI |
| **PHP** | Legacy systems, CMS (WordPress/Laravel), rapid deployment |

### ✅ Section Summary

| Concept | Key Point |
| :--- | :--- |
| **Runtime** | Runs JavaScript outside browsers |
| **Asynchronous** | Non-blocking I/O for efficiency |
| **Event-Driven** | Code responds to events/triggers |
| **Use Cases** | Servers, APIs, real-time apps, full-stack development |

---

## <a name="installation-setup"></a>⚙️ Installation & Setup

> **💡 Key Concept:** Proper installation and version management ensure consistency across different environments and projects.

### 📥 Installing Node.js

#### Official Installation

Download from: **[https://nodejs.org](https://nodejs.org)**

**Recommended:** Install the **LTS (Long-Term Support)** version for stability.

#### Verify Installation

```bash
node -v   # Check Node.js version (e.g., v20.10.0)
npm -v    # Check npm version (e.g., 10.2.3)
```

### 🔧 Version Management with nvm (Optional)

**nvm** (Node Version Manager) lets you switch between Node.js versions easily.

```bash
# Install a specific version
nvm install 20

# Use a specific version
nvm use 20

# List installed versions
nvm list
```

**Use Case:** Different projects may require different Node.js versions.

### 📁 Project Structure

A typical Node.js project starts with:

```plaintext
my-project/
├── node_modules/     # Dependencies (auto-generated, don't commit)
├── package.json      # Project configuration
├── package-lock.json # Dependency tree (auto-generated)
├── index.js          # Main entry point
└── .gitignore        # Files to ignore in Git
```

### 📄 Initializing a Project

```bash
# Interactive setup
npm init

# Quick setup (use defaults)
npm init -y
```

**Creates `package.json`:**

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "My Node.js application",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {}
}
```

### 🔑 Understanding package.json

| Field | Purpose |
| :--- | :--- |
| `name` | Project identifier |
| `version` | Semantic versioning (MAJOR.MINOR.PATCH) |
| `description` | Brief project summary |
| `main` | Entry point file |
| `scripts` | Custom commands (`npm run start`) |
| `dependencies` | Production packages |
| `devDependencies` | Development-only packages |

### 📋 .gitignore Setup

**Always ignore `node_modules/`:**

```bash
# .gitignore
node_modules/
.env
*.log
```

**Why?**

- `node_modules/` is huge (can be 100+ MB)
- Can be recreated with `npm install`
- Contains platform-specific binaries

### ✅ Section Summary

| Concept | Key Point |
| :--- | :--- |
| **Installation** | Download LTS from nodejs.org |
| **Verification** | `node -v` and `npm -v` |
| **Initialization** | `npm init -y` creates package.json |
| **Git** | Always ignore node_modules/ |

---

## <a name="package-management"></a>📦 Package Management

> **💡 Key Concept:** Package managers (npm/pnpm) handle dependencies, allowing you to use thousands of pre-built solutions instead of writing everything from scratch.

### 🔍 npm vs. pnpm

| Feature | npm | pnpm |
| :--- | :--- | :--- |
| **Speed** | Standard | ⚡ Faster |
| **Disk Space** | Duplicates packages | Shared via symlinks |
| **Default** | ✅ Built into Node.js | Requires installation |
| **Commands** | `npm install` | `pnpm add` |
| **Best For** | General projects | Large projects, monorepos |

### 📦 Using npm

#### Installing Packages

```bash
# Local (project-specific)
npm install express

# Global (system-wide CLI tools)
npm install -g nodemon

# Development only
npm install --save-dev jest
```

#### Removing Packages

```bash
npm uninstall lodash
```

#### Installing All Dependencies

```bash
# Run this when cloning a project
npm install
```

**What it does:** Reads `package.json` and installs all listed dependencies.

#### Running Scripts

```json
// package.json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest"
  }
}
```

```bash
npm run start   # Runs "node index.js"
npm run dev     # Runs "nodemon index.js"
npm test        # Runs "jest" (shorthand, no "run" needed)
```

### 🚀 Using pnpm

#### Installation

```bash
npm install -g pnpm
```

#### Command Equivalents

| Task | npm | pnpm |
| :--- | :--- | :--- |
| Install package | `npm install express` | `pnpm add express` |
| Remove package | `npm uninstall express` | `pnpm remove express` |
| Install all deps | `npm install` | `pnpm install` |
| Run script | `npm run dev` | `pnpm run dev` |

#### Why pnpm?

- **30-50% faster** installs
- **Saves disk space** (100s of MB on multiple projects)
- **Identical `package.json`** (fully compatible with npm)

### 📚 Popular Packages

| Package | Purpose | Install |
| :--- | :--- | :--- |
| **express** | Web server framework | `npm install express` |
| **nodemon** | Auto-restart on file changes | `npm install -g nodemon` |
| **chalk** | Colorful terminal output | `npm install chalk` |
| **lodash** | Utility functions | `npm install lodash` |
| **axios** | HTTP requests | `npm install axios` |

### 📖 Example Usage

```javascript
import express from 'express';
import chalk from 'chalk';
import _ from 'lodash';

console.log(chalk.green('Server starting...'));
console.log(_.shuffle([1, 2, 3, 4, 5]));

const app = express();
app.listen(3000);
```

### 📊 Semantic Versioning

**Format:** `MAJOR.MINOR.PATCH` (e.g., `4.18.2`)

| Symbol | Meaning | Example | Allows |
| :---: | :---: | :---: | :---: |
| `^` | Compatible with (default) | `^4.18.2` | 4.x.x updates |
| `~` | Approximately | `~4.18.2` | 4.18.x updates |
| None | Exact version | `4.18.2` | No updates |

### ✅ Best Practices

| ✅ Do | ❌ Don't |
| :--- | :--- |
| Commit `package.json` and lock files | Commit `node_modules/` |
| Use semantic versioning | Delete dependencies manually from node_modules |
| Keep dependencies updated | Install unnecessary global packages |
| Use `.gitignore` for node_modules | Mix npm and pnpm in the same project |

### 🔗 Resources

- **npm registry:** [https://www.npmjs.com](https://www.npmjs.com)
- **pnpm docs:** [https://pnpm.io](https://pnpm.io)

### ✅ Section Summary

| Concept | Key Point |
| :--- | :--- |
| **npm** | Default package manager, stable and reliable |
| **pnpm** | Faster alternative, saves disk space |
| **package.json** | Tracks dependencies and scripts |
| **node_modules/** | Never commit to Git |

---

## <a name="file-system"></a>📁 File System (fs)

> **💡 Key Concept:** The `fs` module is your bridge between Node.js and your computer's file system—use the promise-based version with async/await for clean, modern code.

### 🔹 What is the fs Module?

The **File System (fs)** module allows Node.js to interact with files and directories:

- Read files (text, JSON, images)
- Write/create files
- Delete files
- Create/remove directories
- Check if files exist
- Get file information

### 🔹 Importing fs

#### Modern (Recommended) - Promise-based

```javascript
import fs from 'fs/promises';

// Now you can use async/await
const data = await fs.readFile('file.txt', 'utf-8');
```

#### Traditional - Callback-based

```javascript
import fs from 'fs';

// Requires callbacks
fs.readFile('file.txt', 'utf-8', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

#### CommonJS (Older projects)

```javascript
const fs = require('fs');
```

### 🔹 Three fs Styles

| Style       | Code Pattern                     | Use Case                                     |
|-------------|----------------------------------|----------------------------------------------|
| **Sync**    | `fs.readFileSync()`              | Blocks code until complete                   |
| **Callback**| `fs.readFile((err, data) => {})` | Old async pattern                            |
| **Promise** | `await fs.readFile()`            | Modern async/await (**Best for everything**) |

**Recommendation:** Always use **promise-based** fs with async/await.

### 🔹 Reading Files

#### Read Text File

```javascript
const data = await fs.readFile('file.txt', 'utf-8');
console.log(data);
```

**Note:** `'utf-8'` tells Node.js to interpret the file as text.

#### Read Binary File (Images, PDFs)

```javascript
const imageData = await fs.readFile('photo.png');
// Returns a Buffer (binary data)
```

### 🔹 Writing Files

#### Create or Overwrite

```javascript
await fs.writeFile('output.txt', 'Hello World');
```

**Behavior:** If file exists, it's replaced. If not, it's created.

#### Append to File

```javascript
await fs.appendFile('log.txt', '\nNew log entry');
```

**Behavior:** Adds content to the end without erasing existing content.

### 🔹 Deleting Files

```javascript
await fs.unlink('old-file.txt');
```

**Note:** `unlink` is the Unix term for deleting files.

### 🔹 Working with Directories

#### Create Directory

```javascript
await fs.mkdir('uploads');
```

#### Create Nested Directories

```javascript
await fs.mkdir('logs/errors', { recursive: true });
```

**Without `recursive: true`:** Throws error if parent directory doesn't exist.

#### Delete Directory

```javascript
await fs.rmdir('old-folder');
```

**Note:** Directory must be empty, or use `{ recursive: true }`.

#### List Directory Contents

```javascript
const files = await fs.readdir('./');
console.log(files); // ['index.js', 'package.json', 'node_modules']
```

### 🔹 Checking File Existence

```javascript
try {
  await fs.access('file.txt');
  console.log('File exists');
} catch {
  console.log('File does not exist');
}
```

**Note:** `access()` throws an error if the file doesn't exist.

### 🔹 Getting File Information

```javascript
const stats = await fs.stat('file.txt');

console.log(stats.size);         // File size in bytes
console.log(stats.isFile());     // true
console.log(stats.isDirectory()); // false
console.log(stats.mtime);        // Last modified time
```

### 🔹 Copying Files

```javascript
await fs.copyFile('source.txt', 'destination.txt');
```

### 🔹 Streams (For Large Files)

**Use Case:** Videos, large logs, real-time data

```javascript
import fs from 'fs';

const readStream = fs.createReadStream('large-video.mp4');
const writeStream = fs.createWriteStream('copy.mp4');

readStream.pipe(writeStream);
```

**Why Streams?**

- Don't load entire file into memory
- Process data chunk by chunk
- Essential for large files (500MB+)

### 🔹 Path Handling (Critical!)

**Problem:** Windows uses `\`, Unix uses `/`

**Solution:** Use the `path` module

```javascript
import path from 'path';

// ✅ Cross-platform
const filePath = path.join(process.cwd(), 'data', 'users.json');

// ❌ Windows-only (breaks on Mac/Linux)
const filePath = 'data\\users.json';
```

**Common path methods:**

```javascript
path.join('folder', 'file.txt')     // folder/file.txt
path.resolve('file.txt')            // Absolute path
process.cwd()                        // Current working directory
path.dirname(filePath)               // Get directory name
path.basename(filePath)              // Get file name
path.extname(filePath)               // Get extension (.txt)
```

### 🔹 Error Handling

**Always use try-catch with async operations:**

```javascript
try {
  const data = await fs.readFile('config.json', 'utf-8');
  console.log(JSON.parse(data));
} catch (error) {
  console.error('File error:', error.message);
}
```

### 🔹 Common Use Cases

| Feature              | Code Example                                                  |
|----------------------|---------------------------------------------------------------|
| **Save Logs**        | `await fs.appendFile('logs.txt', error)`                      |
| **User Uploads**     | `await fs.writeFile('uploads/image.png', data)`               |
| **Config Files**     | `const config = JSON.parse(await fs.readFile('config.json'))` |
| **Generate Reports** | `await fs.writeFile('report.csv', csvData)`                   |
| **Cache API Data**   | `await fs.writeFile('cache.json', JSON.stringify(data))`      |

### 🔹 Sync vs. Async Performance

| Operation          | Sync (Blocks)                           | Async (Non-blocking)                            |
|--------------------|-----------------------------------------|-------------------------------------------------|
| **Read 100 files** | Takes 10 seconds, nothing else runs     | Takes 10 seconds, server handles other requests |
| **API Endpoints**  | ❌ Never use                            | ✅ Always use                                   |
| **Startup Scripts**| ✅ Acceptable                           | ✅ Better                                       |

### 📋 fs Cheat Sheet

```javascript
// Read
await fs.readFile('file.txt', 'utf-8')

// Write (create/overwrite)
await fs.writeFile('file.txt', 'content')

// Append
await fs.appendFile('file.txt', 'more content')

// Delete file
await fs.unlink('file.txt')

// Create folder
await fs.mkdir('folder', { recursive: true })

// Delete folder
await fs.rmdir('folder')

// List folder
await fs.readdir('./')

// File info
await fs.stat('file.txt')

// Copy file
await fs.copyFile('src.txt', 'dest.txt')

// Check existence
await fs.access('file.txt')
```

### ✅ Section Summary

| Concept            | Key Point                        |
|--------------------|----------------------------------|
| **fs/promises**    | Modern async/await API           |
| **path module**    | Cross-platform file paths        |
| **Error handling** | Always use try-catch             |
| **Streams**        | For large files (videos, logs)   |
| **Async > Sync**   | Never block the server           |

---

## <a name="modules-imports"></a>🔄 Modules & Imports

> **💡 Key Concept:** Node.js supports two module systems—CommonJS (older, default) and ES Modules (modern, recommended). Choose one per project and stick with it.

### 🔍 Module Systems Comparison

| Feature                | CommonJS (CJS)                 | ES Modules (ESM)            |
|------------------------|--------------------------------|-----------------------------|
| **Syntax**             | `require()` / `module.exports` | `import` / `export`         |
| **Default**            | ✅ Yes (Node.js default)       | Opt-in via package.json     |
| **Browser Compatible** | ❌ No                          | ✅ Yes                      |
| **Dynamic Imports**    | ✅ Yes                         | ✅ Yes (better)             |
| **Future**             | Legacy                         | Modern standard             |

### 🧩 CommonJS (Traditional)

#### Importing Modules

```javascript
// Built-in module
const fs = require('fs');

// npm package
const express = require('express');

// Local file (your code)
const utils = require('./utils.js');
```

#### Exporting Modules

```javascript
// Export single function
function greet(name) {
  return `Hello, ${name}!`;
}
module.exports = greet;

// Export multiple items
module.exports = {
  greet,
  sayGoodbye: (name) => `Goodbye, ${name}!`
};
```

#### Using Exported Modules

```javascript
// Import single export
const greet = require('./greet.js');
greet('Alice'); // "Hello, Alice!"

// Import multiple exports
const { greet, sayGoodbye } = require('./greet.js');
```

### 🚀 ES Modules (Modern)

#### Enabling ESM

**Add to package.json:**

```json
{
  "type": "module"
}
```

**Or:** Use `.mjs` file extension (`index.mjs`)

#### Importing Modules

```javascript
// Built-in module
import fs from 'fs/promises';

// npm package
import express from 'express';

// Local file
import { greet } from './utils.js';
```

**Important:** Always include `.js` extension for local files in ESM.

#### Exporting Modules

```javascript
// Named exports
export function greet(name) {
  return `Hello, ${name}!`;
}

export const PI = 3.14159;

// Default export
export default function(name) {
  return `Hello, ${name}!`;
}
```

#### Import Variations

```javascript
// Named imports
import { greet, PI } from './utils.js';

// Default import
import greet from './greet.js';

// Import everything
import * as utils from './utils.js';
utils.greet('Bob');

// Rename imports
import { greet as sayHello } from './utils.js';
```

### 🔄 Converting Between Systems

#### CommonJS → ES Modules

```javascript
// Before (CommonJS)
const express = require('express');
module.exports = { app };

// After (ES Modules)
import express from 'express';
export { app };
```

### 🧭 Module Resolution

**Built-in modules:** No path needed

```javascript
import fs from 'fs';
```

**npm packages:** Name only

```javascript
import express from 'express';
```

**Local files:** Relative path required

```javascript
import { utils } from './utils.js';   // ✅ Same directory
import { db } from '../db/config.js'; // ✅ Parent directory
```

### ⚠️ Common Pitfalls

| Issue                         | CommonJS                        | ESM                                   |
|-------------------------------|---------------------------------|---------------------------------------|
| **Missing .js extension**     | Optional                        | ❌ Required                           |
| **Top-level await**           | ❌ Not allowed                  | ✅ Allowed                            |
| **`__dirname` / `__filename`**| ✅ Available                    | ❌ Not available (use alternatives)   |

#### ESM Alternatives for __dirname

```javascript
// ESM equivalent
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

### 🎯 Which System to Choose?

| Use CommonJS When           | Use ES Modules When          |
|-----------------------------|------------------------------|
| Working with legacy code    | Starting new projects        |
| Maximum compatibility needed| Want modern JavaScript       |
| Rapid prototyping           | Building for the browser too |

**Recommendation:** Use **ES Modules** for all new projects.

### 📋 Quick Reference

#### CommonJS Syntax

```javascript
// Import
const module = require('module');
const { func } = require('./file');

// Export
module.exports = value;
module.exports = { func1, func2 };
```

#### ES Modules Syntax

```javascript
// Import
import module from 'module';
import { func } from './file.js';
import * as all from './file.js';

// Export
export default value;
export { func1, func2 };
export const constant = 42;
```

### ✅ Section Summary

| Concept             | Key Point                                |
|:-------------------:|:----------------------------------------:|
| **CommonJS**        | `require()` / `module.exports` (default) |
| **ES Modules**      | `import` / `export` (modern)             |
| **Enable ESM**      | Add `"type": "module"` to package.json   |
| **File extensions** | Always include `.js` in ESM imports      |
| **Recommendation**  | Use ESM for new projects                 |

---

## <a name="building-servers"></a>🚀 Building Servers

> **💡 Key Concept:** While you can build servers with Node's built-in `http` module, frameworks like Express make it dramatically easier and more maintainable.

### 🌐 Basic HTTP Server

#### Using Built-in `http` Module

```javascript
import http from 'http';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
```

**Run it:**

```bash
node index.js
```

**Visit:** `http://localhost:3000`

### ⚡ Express.js (Recommended)

Express is the most popular Node.js web framework—it simplifies routing, middleware, and HTTP handling.

#### Installation

```bash
npm install express
```

#### Basic Express Server

```javascript
import express from 'express';

const app = express();

// Route: Handle GET request to homepage
app.get('/', (req, res) => {
  res.send('Hello Express!');
});

// Route: Handle POST request
app.post('/submit', (req, res) => {
  res.json({ message: 'Data received' });
});

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

### 🛣️ Routing

```javascript
// Different routes
app.get('/', (req, res) => {
  res.send('Home Page');
});

app.get('/about', (req, res) => {
  res.send('About Page');
});

app.get('/users/:id', (req, res) => {
  res.send(`User ID: ${req.params.id}`);
});
```

**URL Parameters:**

- Visit `/users/123` → Returns "User ID: 123"
- `req.params.id` extracts the dynamic value

### 📦 Middleware

Middleware functions run **before** route handlers.

```javascript
// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // Pass control to next middleware/route
});

// JSON parsing middleware
app.use(express.json());

// Serve static files (CSS, images, JS)
app.use(express.static('public'));
```

### 📨 Handling Requests & Responses

#### Request Object (`req`)

```javascript
app.get('/search', (req, res) => {
  console.log(req.query);      // URL query parameters (?name=value)
  console.log(req.params);     // URL route parameters (/users/:id)
  console.log(req.body);       // POST/PUT data (requires middleware)
  console.log(req.headers);    // HTTP headers
});
```

#### Response Object (`res`)

```javascript
// Send text
res.send('Hello');

// Send JSON
res.json({ name: 'Alice', age: 30 });

// Send file
res.sendFile('/path/to/file.html');

// Redirect
res.redirect('/new-url');

// Set status code
res.status(404).send('Not Found');
```

### 🔗 Complete Example

```javascript
import express from 'express';

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ]);
});

app.post('/api/users', (req, res) => {
  const newUser = req.body;
  res.status(201).json({ message: 'User created', user: newUser });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

### 🧰 Common HTTP Methods

| Method     | Purpose                | Example                |
|:---------- |:---------------------  |:---------------------  |
| **GET**    | Retrieve data          | Get list of users      |
| **POST**   | Create data            | Add new user           |
| **PUT**    | Update data (full)     | Replace user info      |
| **PATCH**  | Update data (partial)  | Change user email      |
| **DELETE** | Remove data            | Delete user            |

### 📊 HTTP Status Codes

| Code    | Meaning                | Use Case                     |
|:------: |:---------------------: |:----------------------------:|
| **200** | OK                     | Successful request           |
| **201** | Created                | Resource created successfully|
| **400** | Bad Request            | Invalid data sent            |
| **401** | Unauthorized           | Login required               |
| **404** | Not Found              | Resource doesn't exist       |
| **500** | Internal Server Error  | Server crashed               |

### 🛑 Error Handling Example

```javascript
app.get('/users/:id', (req, res) => {
  const user = findUser(req.params.id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});
```

### 🔥 Nodemon (Auto-Restart)

**Problem:** Manually restarting server after every code change is tedious.

**Solution:** `nodemon` watches files and auto-restarts.

```bash
# Install globally
npm install -g nodemon

# Run with nodemon instead of node
nodemon index.js
```

**Or add to package.json scripts:**

```json
{
  "scripts": {
    "dev": "nodemon index.js"
  }
}
```

```bash
npm run dev
```

### 📋 Server Cheat Sheet

```javascript
// Basic HTTP server
import http from 'http';
http.createServer((req, res) => {
  res.end('Hello');
}).listen(3000);

// Express server
import express from 'express';
const app = express();

app.get('/', (req, res) => res.send('Hello'));
app.listen(3000, () => console.log('Running'));

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/path', handler);
app.post('/path', handler);
app.put('/path', handler);
app.delete('/path', handler);

// Response methods
res.send('text');
res.json({ data });
res.status(404).send('Not Found');
res.redirect('/other');
```

### ✅ Section Summary

| Concept         | Key Point                                         |
|:---------------:|:-------------------------------------------------:|
| **http module** | Built-in, low-level server creation               |
| **Express**     | Framework that simplifies routing & middleware    |
| **Routing**     | Map URLs to functions (`app.get()`, `app.post()`) |
| **Middleware**  | Functions that process requests before routes     |
| **Nodemon**     | Auto-restart server on file changes               |

---

## 🔗 Useful Resources

| Resource                      | Link                                                                                                     |
|-------------------------------|----------------------------------------------------------------------------------------------------------|
| **Official Node.js Docs**     | [https://nodejs.org/docs](https://nodejs.org/docs)                                                       |
| **npm Registry**              | [https://www.npmjs.com](https://www.npmjs.com)                                                           |
| **pnpm Docs**                 | [https://pnpm.io](https://pnpm.io)                                                                       |
| **W3Schools Node.js Tutorial**| [https://www.w3schools.com/nodejs](https://www.w3schools.com/nodejs)                                     |
| **Express.js Docs**           | [https://expressjs.com](https://expressjs.com)                                                           |
| **MDN HTTP Status Codes**     | [https://developer.mozilla.org/docs/Web/HTTP/Status](https://developer.mozilla.org/docs/Web/HTTP/Status) |

---

## 🧾 Summary

**Node.js** is a JavaScript runtime built on Chrome's V8 engine that enables server-side development with JavaScript. It's **asynchronous and event-driven**, making it ideal for scalable applications.

**Installation** is simple via nodejs.org—initialize projects with `npm init` and manage dependencies through **package.json**. Use **npm** (default) or **pnpm** (faster) to install packages. Always ignore `node_modules/` in Git.

The **fs module** provides file system operations—use the **promise-based version** (`fs/promises`) with async/await for clean code. Handle paths with the **path module** for cross-platform compatibility.

**Module systems**: Node.js supports **CommonJS** (default, uses `require`) and **ES Modules** (modern, uses `import/export`). Enable ESM by adding `"type": "module"` to package.json. ES Modules are recommended for new projects.

Build **web servers** using the built-in `http` module or (better) the **Express framework**. Express simplifies routing, middleware, and request handling. Use **nodemon** for automatic server restarts during development.

**The complete Node.js toolkit:** Runtime → Package Management → File System → Modules → Servers

---
