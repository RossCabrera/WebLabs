# 🐘 Example — Per-project Postgres Dev Setup

This is the pattern used across the `10-PostgreSQL` and `11-React` projects in this repo.
Each project gets its own container, credentials, and port.

---

## 📁 Folder structure

```
my-project/
├── docker-compose.dev.yml
├── db/
│   ├── init.sql       # schema + seed queries
│   └── data.csv       # seed data (optional)
├── .env
└── .env.example
```

---

## 🐙 docker-compose.dev.yml

```yaml
services:
  db:
    image: postgres:17
    container_name: my-project-db-dev
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    ports:
      - "${DB_PORT}:5432"
    volumes:
      - my_project_postgres_data:/var/lib/postgresql/data
      - ./db:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USERNAME} -d ${DB_NAME}"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  my_project_postgres_data:
```

---

## 🔐 .env.example

```bash
DB_HOST=localhost
DB_PORT=5433          # unique per project to avoid conflicts
DB_NAME=my_project_db
DB_USERNAME=my_user
DB_PASSWORD=your_password
```

---

## 🌱 db/init.sql

```sql
CREATE TABLE IF NOT EXISTS items (
  id     SERIAL PRIMARY KEY,
  name   VARCHAR(100) NOT NULL,
  active BOOLEAN DEFAULT TRUE
);

-- Seed from CSV
COPY items (id, name, active)
FROM '/docker-entrypoint-initdb.d/data.csv' CSV HEADER;

-- Sync sequence after bulk insert
SELECT setval('items_id_seq', (SELECT MAX(id) FROM items));
```

---

## ⚡ Commands

```bash
# Start
docker compose -f docker-compose.dev.yml up -d

# Check it's healthy
docker compose -f docker-compose.dev.yml ps

# View logs
docker compose -f docker-compose.dev.yml logs -f db

# Connect with psql
docker compose -f docker-compose.dev.yml exec db psql -U my_user -d my_project_db

# Stop (keep data)
docker compose -f docker-compose.dev.yml down

# Stop and wipe data (re-runs init.sql on next up)
docker compose -f docker-compose.dev.yml down -v
```

---

## ⚠️ Gotchas

| Issue | Cause | Fix |
|-------|-------|-----|
| `role "postgres" does not exist` | Volume initialized with old credentials | `down -v` then `up -d` |
| `database "myuser" does not exist` | `pg_isready` defaults to DB named after user | Add `-d mydb` to healthcheck |
| `init.sql` not running | Volume already has data from a previous run | `down -v` to reset |
| Port conflict | Another project using the same host port | Use a unique port per project |
