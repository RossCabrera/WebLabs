# ⚛️ React

## 📚 Overview

This section covers **React** and the **TypeScript** ecosystem, progressing from first principles to production-level patterns used in real-world applications.

The content is organized into **seven stages**, moving from TypeScript fundamentals and component basics all the way to authentication, server state management, admin panel features, and file uploads.

It includes notes, practice snippets, and two full projects that reinforce every concept introduced in the notes.

---

## 🌐 What Is React?

**React** is a JavaScript library for building **component-based user interfaces**. It was created by Meta and is the most widely used UI library in the industry.

💡 React components describe **what the UI should look like** for a given state — React takes care of efficiently updating the DOM when that state changes.

Modern React is written in **TypeScript**, paired with tools like **Vite**, **TanStack Query**, **Zustand**, and **React Router** to build complete, production-grade applications.

---

## 📘 Topics Covered

* TypeScript fundamentals (types, interfaces, generics, async)
* React components, props, and JSX
* Unit testing with Vitest and React Testing Library
* State management with `useState`, `useReducer`, and Zustand
* Core hooks: `useEffect`, `useRef`, `useMemo`, `useCallback`, `useContext`
* Custom hooks and separation of concerns
* Performance optimisation and memoisation
* React Router — nested layouts, private routes, role-based guards
* TanStack Query — caching, mutations, pagination, query keys
* UI design with Tailwind CSS and Shadcn/UI
* JWT-based authentication and session persistence
* Admin panel patterns — forms, validations, product CRUD
* File uploads and drag & drop with native browser APIs

> 💡 Detailed explanations and examples are available in the `notes/` folder.

---

## 🧩 Learning Stages

### 1️⃣ TypeScript Reinforcement

* TypeScript syntax, variables, objects, interfaces, enums, arrays, destructuring, functions, callbacks, modules, async/await, and Fetch API basics.

### 2️⃣ First Steps with React

* Project setup with Vite, JSX, functional components, props, `useState`, event handling, and building a small Gifs app.

### 3️⃣ Unit Testing

* Testing fundamentals with Vitest and React Testing Library — rendering components, querying the DOM, mocking, and async tests.

### 4️⃣ Hooks & Testing

* `useEffect`, `useRef`, debounce, HTTP requests, custom hooks, environment variables, separation of concerns, performance caching, and advanced testing (hooks, async, timers, Axios, CI).

### 5️⃣ Deepening Hooks

* `useReducer`, Zod validation, localStorage/sessionStorage persistence, memoisation (`useMemo`, `useCallback`, `React.memo`), `useOptimistic`, `useTransition`, `useContext`, and React Router with protected routes.

### 6️⃣ UI, Queries & Testing

* Shadcn/UI component library, Tailwind CSS patterns, code segmentation, lazy loading, TanStack Query (caching, pagination, mutations, query key factories, URL-synced params), and advanced integration testing.

### 7️⃣ Admin Panel, Auth & File Uploads

* Admin panel structure, route subtrees, stateless URL persistence, Google Fonts with Tailwind, server-side pagination with argument transformations, Zustand global state, JWT authentication, session management, axios interceptors, role-based route guards, product CRUD with `useForm` and validations (required / min-max / regex), TanStack mutations, cache invalidation, and native drag-and-drop file uploads.

---

## 🧩 Folder Structure

```plaintext
11-React/
├── README.md
├── notes/
│   ├── 01-reinforcement/
│   ├── 02-first-steps/
│   ├── 03-unit-testing/
│   ├── 04-hooks-and-testing/
│   ├── 05-deepen-hooks/
│   ├── 06-ui-queries-and-testing/
│   └── 07-admin-panel-and-auth/
├── practice-snippets/
│   ├── 01-reinforcement/
│   ├── 02-first-steps/
│   ├── 03-unit-testing/
│   ├── 04-gifs-app/
│   └── 05-hooks-app/
└── projects/
    ├── 01-heroes-app/
    └── 02-teslo-shop/
```

---

## 🚀 Projects

### 🦸 01 — Heroes App

A Marvel / DC heroes browser built with React + TypeScript that demonstrates:

* Component-based architecture and prop drilling
* React Router with nested layouts and dynamic routes
* Private and public route guards
* Search with debounced filtering
* Unit and integration testing with Vitest and React Testing Library

**Concepts Applied:**

* Custom hooks
* `useContext` for global auth state
* URL-driven navigation
* Mocking and async testing

---

### 🛍️ 02 — Teslo Shop

A full-featured e-commerce admin panel built with React + TypeScript + Vite, serving as the capstone for the entire section.

* Product listing with server-side filtering, gender pages, and URL-synced pagination
* JWT authentication with Zustand global state and axios interceptors
* Role-based route protection (admin vs. user)
* Product CRUD — create and edit forms with `useForm` and field validations
* Image upload with native drag-and-drop (no external libraries)
* TanStack Query for all server state — caching, mutations, and cache invalidation
* Shadcn/UI + Tailwind CSS + Google Fonts for the design system

**Concepts Applied:**

* TanStack Query key factories and surgical cache invalidation
* Zustand `persist` middleware for session storage
* `useForm` with required, min/max, and regex validations
* `FormData` multipart uploads
* Native `DragEvent` API with flicker-free drop zones

---

## 🎯 Goal

By the end of this section, you will be able to:

* Build production-quality React applications with TypeScript
* Manage local and server state cleanly using Zustand and TanStack Query
* Implement JWT-based authentication and role-based authorization
* Design reusable, variant-driven UI components with Tailwind and Shadcn/UI
* Write meaningful unit and integration tests with Vitest and React Testing Library
* Handle file uploads and drag-and-drop interactions using only native browser APIs
* Structure large React applications with maintainable separation of concerns

---
