# 🪣 02 — Bucket List

A multi-user bucket list app where each user can add, complete, and delete personal goals. Demonstrates a relational PostgreSQL schema with foreign keys and full CRUD operations from Node.js/Express.

---

## 📌 What This Covers

- Relational schema with foreign keys (`bucket_items` → `users`)
- `ON DELETE CASCADE` to clean up child rows automatically
- MVC structure: routes, controllers, models
- PostgreSQL connection pool with `pg`
- Parameterized queries to prevent SQL injection
- Environment-based DB configuration via `dotenv`

---

## 🚀 Getting Started

**1. Start the database:**

```bash
docker compose -f docker-compose.dev.yml up -d
```

This spins up a PostgreSQL container on port `5434` and creates the `bucket_list_db` database with the required tables.

**2. Create a `.env` file** (use `.env.example` as reference):

```bash
DB_USER=bucket_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5434
DB_NAME=bucket_list_db
PORT=3000
```

The credentials must match what you set in `docker-compose.dev.yml`.

**3. Install dependencies and run:**

```bash
bun install
bun app.js
```

Visit `http://localhost:3000` to use the app.

---

## 🐳 Docker Commands

| Command | What it does |
|:--------|:-------------|
| `docker compose -f docker-compose.dev.yml up -d` | Start containers in the background |
| `docker compose -f docker-compose.dev.yml stop` | Pause containers without removing them |
| `docker compose -f docker-compose.dev.yml start` | Resume paused containers |
| `docker compose -f docker-compose.dev.yml down` | Stop and remove containers (data kept) |
| `docker compose -f docker-compose.dev.yml down -v` | Stop, remove containers and wipe the volume |
