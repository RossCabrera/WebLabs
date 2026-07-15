# 🦸 01 — Heroes App

A Marvel / DC heroes browser built with React + TypeScript. Demonstrates component architecture, React Router with protected routes, custom hooks, and unit/integration testing with Vitest and React Testing Library.

The app is split into a React frontend and a NestJS backend that serves hero data.

---

## 📌 What This Covers

- React Router with nested layouts, dynamic routes, and private route guards
- Custom hooks and separation of concerns
- `useContext` for global auth state
- TanStack Query for server state
- Unit and integration testing with Vitest and React Testing Library
- NestJS REST API with in-memory data (no database)

---

## 🚀 Getting Started

**1. Install dependencies for both parts:**

```bash
cd 01-heroes-app-frontend
bun install

cd ../02-heroes-app-backend
bun install
```

**2. Create a `.env` file in `01-heroes-app-frontend/`:**

```bash
VITE_API_URL=http://localhost:3000
```

**3. Start both servers in separate terminals:**

```bash
# Terminal 1 — Backend
cd 02-heroes-app-backend
bun run start:dev

# Terminal 2 — Frontend
cd 01-heroes-app-frontend
bun run dev
```

Visit `http://localhost:5173`.

---

## 🧪 Running Tests

```bash
cd 01-heroes-app-frontend
bun run test
```
