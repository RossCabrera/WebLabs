# 🌍 APIs Section

## 📚 Overview

This section covers **APIs (Application Programming Interfaces)** and how to integrate them into backend applications using Node.js and Express.
The content progresses from understanding what an API is to consuming external APIs, handling JSON data, and implementing authentication.

It includes notes, practice snippets, and a capstone project focused on building a full web application powered by a third-party API.

---

## 🌐 What Is an API?

An **API (Application Programming Interface)** is a way for different software systems to communicate with each other.

💡 APIs allow applications to request data or services from other systems — for example, fetching movie data, weather information, or payment processing.

APIs act as a **bridge between client and server**, defining how requests and responses should be structured.

---

## 📘 Topics Covered

* What APIs are and how they work
* API types and architectural styles
* REST fundamentals and HTTP principles
* Endpoints, parameters, and URL structure
* API documentation and testing tools
* Working with JSON data
* Making API requests from Node.js and Express
* Authentication and authorization concepts

> 💡 Detailed explanations and examples are available in the `notes/` folder.

---

## 🧩 Learning Stages

### 1️⃣ What is an API?

* Core concepts, request–response cycle, and real-world examples.

### 2️⃣ REST API Fundamentals

* HTTP methods (GET, POST, PUT, DELETE), status codes, headers, and stateless communication.

### 3️⃣ Endpoints, Parameters & URL Structure

* Route structure, path parameters, query parameters, and request bodies.

### 4️⃣ API Documentation & Tooling

* Reading API documentation and testing endpoints using tools like Postman.

### 5️⃣ JSON

* Understanding JSON structure, parsing, and stringifying data.

### 6️⃣ Making API Requests from Node/Express

* Using libraries such as Axios or native fetch to consume external APIs.

### 7️⃣ API Authentication & Authorization

* API keys, tokens, environment variables, and securing requests.

---

## 🧩 Folder Structure

```plaintext
09-APIs/
├─ capstone-project/
│  └─ 01-movie-finder/
│     ├─ .env
│     ├─ README.md
├─ notes/
│  └─ 01-application-programming-interface.md
├─ practice-snippets/
│  ├─ 01-json/
│  ├─ 02-axios/
│  ├─ 03-api-auth/
│  └─ 04-rest-apis/
└─ project/
   └─ README
```

---

## 🏆 Capstone Project

### 🎬 Movie Finder Web Application

Build a **Movie Finder Web Application** using Node.js, Express.js, and EJS, integrated with the OMDb API.

The application must allow users to search for movies, browse results
with pagination, and access detailed information about each selected
movie.

📄 Full project instructions and requirements are available in:

```text
capstone-project/01-movie-finder/README.md
```

---

## 🎯 Goal

By the end of this section, you will be able to:

* Understand how APIs enable communication between systems
* Work confidently with REST APIs and HTTP methods
* Parse and manipulate JSON data
* Integrate third-party APIs into Node.js applications
* Secure API requests using authentication methods
* Build complete applications powered by external data

---
