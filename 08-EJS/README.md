# 🟪 EJS Section

## 📚 Overview

This section covers **EJS (Embedded JavaScript templates)**, a templating engine used to generate **dynamic HTML pages** in Node.js applications.
The content progresses from understanding EJS basics to rendering templates, passing data, and using partials for reusable components.
It includes notes, practice snippets, and a **capstone project** demonstrating a server-side rendered blog app using Express and in-memory storage.

---

## 🌐 What Is EJS?

**EJS** allows you to write HTML pages with embedded JavaScript logic.
It is commonly used in **Express.js applications** to render dynamic content on the server before sending it to the client.

💡 While Express handles routing and server logic, EJS **generates the HTML output dynamically** using templates and data passed from the server.

---

## 📘 Topics Covered

* EJS setup and integration with Express
* EJS syntax: tags, loops, conditionals, and expressions
* Passing data from server to template
* Handling client input and sending data back to server
* Using control flow within templates
* Creating partials for reusable components
* Serving static files alongside EJS templates

> 💡 Detailed explanations and examples are in the `notes/` folder.

---

## 🧩 Learning Stages

### 1️⃣ What is EJS & Setup

* Installing EJS, configuring Express to use it, and creating your first template.

### 2️⃣ EJS Syntax Reference

* Exploring `<%= %>`, `<%- %>`, `<% %>` tags and their usage.

### 3️⃣ Passing Data: Server → Template

* Sending variables, arrays, and objects from Express routes to templates.

### 4️⃣ Receiving Data: Client → Server

* Using forms, query parameters, and request bodies to send data to the server.

### 5️⃣ Control Flow

* Conditionals and loops in templates for dynamic rendering.

### 6️⃣ Partials (Reusable Components)

* Breaking templates into reusable header, footer, and component files.

### 7️⃣ Static Files

* Serving CSS, JS, and images alongside EJS templates.

---

## 🧩 Folder Structure

```plaintext
08-EJS/
├── capstone-project/ 
│   ├── README.md
│   └── blog-app/
├── notes/
│   └── 01-ejs.md
├── practice-snippets/
│   ├── 01-ejs/
│   ├── 02-ejs-tags/
│   ├── 03-passing-data/
│   └── 04-partials/
├── project/
└── README.md
```

---

## 🏆 Capstone Project

**Server-Side Rendered Blog App** – Build a blog application using Express and EJS with in-memory storage.

The project consolidates all concepts learned in this section including template rendering, passing data, control flow, partials, and static files.

📄 Full project instructions and requirements are available in:

```text
capstone-project/README.md
```

---

## 🎯 Goal

By the end of this section, you will be able to:

* Integrate EJS with Express for server-side rendering
* Render dynamic HTML using templates and passed data
* Handle data flow between server and client
* Apply loops and conditionals inside templates
* Use partials to organize and reuse template components
* Serve static assets alongside dynamic templates
* Build a complete server-side rendered blog application

---
