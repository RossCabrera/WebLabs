# 🟩 Node.js Section

## 📚 Overview

This section covers **Node.js**, a JavaScript runtime that allows you to run JavaScript **outside the browser**.
The content is organized to move from understanding what Node.js is, to using native modules, managing packages, and building simple servers.

It includes notes, practice snippets, and a small project focused on using Node.js for backend logic and command-line tools.

---

## 🌐 What Is Node.js?

**Node.js** is a runtime built on Chrome’s V8 engine that allows JavaScript to run on the **server side**.

💡 While JavaScript in the browser handles user interaction and the DOM, Node.js is used for:

* Running scripts from the terminal
* Working with files and the operating system
* Creating servers and APIs
* Building backend services and developer tools

Node.js uses an **event-driven, non-blocking I/O model**, making it efficient and scalable.

---

## 📘 Topics Covered

* What Node.js is and how it works
* Installing and setting up Node.js
* Package managers (npm, pnpm) and `package.json`
* Using native Node.js modules
* Working with the File System (`fs`)
* Importing and exporting modules
* Creating basic HTTP servers

> 💡 Detailed explanations and summaries for each topic are in the `notes/` folder.

---

## 🧩 Learning Stages

### 1️⃣ Understanding Node.js

* What Node.js is, how it differs from browser JavaScript, and when to use it.

### 2️⃣ Installation & Setup

* Installing Node.js, verifying versions, and running JavaScript files from the terminal.

### 3️⃣ Package Management

* Using npm and pnpm, understanding `package.json`, dependencies, scripts, and best practices.

### 4️⃣ File System (fs)

* Reading and writing files, working with paths, and understanding synchronous vs asynchronous operations.

### 5️⃣ Modules & Imports

* CommonJS vs ES Modules, importing/exporting code, and using native Node.js modules.

### 6️⃣ Building Servers

* Creating basic HTTP servers and understanding request–response flow.

---

## 🧩 Folder Structure

```plaintext
06-nodejs/
├── README.md
├── notes/
│   └── 01-nodejs.md
├── practice-snippets/
│   ├── 01-using-node/
│   ├── 02-native-modules/
│   └── 03-npm/
└── project/
    └── qr-code-generator/
```

---

## 🎯 Goal

By the end of this section, you will be able to:

* Understand how Node.js works and when to use it
* Run JavaScript outside the browser
* Manage dependencies using npm or pnpm
* Work with files and native Node.js modules
* Structure small Node.js projects
* Build simple servers and CLI-based tools

---
