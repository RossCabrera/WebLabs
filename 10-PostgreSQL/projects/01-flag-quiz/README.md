# 🚩 01 — Flag Quiz

A geography quiz that shows a country's flag and asks you to identify its capital. Demonstrates connecting Node.js/Express to PostgreSQL using the `pg` driver and a connection pool.

---

## 📌 What This Covers

- PostgreSQL connection pool with `pg`
- Parameterized queries to prevent SQL injection
- JOIN across two tables (`capitals` + `flags`)
- Random row selection with `ORDER BY RANDOM()`
- Environment-based DB configuration via `dotenv`

---

## 🚀 Getting Started

**1. Start the database:**

```bash
docker compose -f docker-compose.dev.yml up -d
```

This spins up a PostgreSQL container on port `5433`, creates the `flag_quiz_db` database, and seeds it automatically from `db/init.sql` and the CSV files in `db/`.

**2. Create a `.env` file** (use `.env.example` as reference):

```bash
DB_USER=flag_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5433
DB_NAME=flag_quiz_db
```

The credentials must match what you set in `docker-compose.dev.yml`.

**3. Install dependencies and run:**

```bash
bun install
bun app.js
```

Visit `http://localhost:3000` to play.

---

## 🐳 Docker Commands

| Command | What it does |
|:--------|:-------------|
| `docker compose -f docker-compose.dev.yml up -d` | Start containers in the background |
| `docker compose -f docker-compose.dev.yml stop` | Pause containers without removing them |
| `docker compose -f docker-compose.dev.yml start` | Resume paused containers |
| `docker compose -f docker-compose.dev.yml down` | Stop and remove containers (volume kept) |
| `docker compose -f docker-compose.dev.yml down -v` | Stop, remove containers and wipe the volume |
