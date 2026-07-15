# 🛍️ 02 — Teslo Shop

A full-featured e-commerce admin panel built with React + TypeScript + NestJS. Covers JWT authentication, role-based route guards, product CRUD, TanStack Query, Zustand, and file uploads.

The app is split into a React frontend and a NestJS backend backed by PostgreSQL.

---

## 📌 What This Covers

- JWT authentication with Zustand global state and axios interceptors
- Role-based route protection (admin vs. user)
- TanStack Query — caching, mutations, pagination, cache invalidation
- Product CRUD with `useForm` and field validations
- File uploads with native drag-and-drop (no external libraries)
- Shadcn/UI + Tailwind CSS design system
- NestJS + TypeORM + PostgreSQL backend
- WebSockets with Socket.io

---

## 🚀 Getting Started

**1. Start the database:**

```bash
cd 02-teslo-shop-backend
docker compose -f docker-compose.dev.yml up -d
```

**2. Create `.env` files:**

`02-teslo-shop-backend/.env` (use `.env.example` as reference):
```bash
DB_HOST=localhost
DB_PORT=5435
DB_NAME=teslo_shop_db
DB_USERNAME=teslo_user
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
PORT=3000
STAGE=dev
```

`01-teslo-shop-frontend/.env`:
```bash
VITE_API_URL=http://localhost:3000/api
```

**3. Install dependencies:**

```bash
cd 02-teslo-shop-backend && bun install
cd ../01-teslo-shop-frontend && bun install
```

**4. Start both servers in separate terminals:**

```bash
# Terminal 1 — Backend
cd 02-teslo-shop-backend
bun run start:dev

# Terminal 2 — Frontend
cd 01-teslo-shop-frontend
bun run dev
```

**5. Seed the database** (first run only):

```bash
curl http://localhost:3000/api/seed
```

Visit `http://localhost:5173`.

---

## 🐳 Docker Commands

| Command | What it does |
|:--------|:-------------|
| `docker compose -f docker-compose.dev.yml up -d` | Start the database |
| `docker compose -f docker-compose.dev.yml down` | Stop the database (data kept) |
| `docker compose -f docker-compose.dev.yml down -v` | Stop and wipe the database |
