# 🐙 Docker Compose

## 📚 Table of Contents
- [📄 File structure](#file-structure)
- [🗂️ Per-project pattern](#per-project-pattern)
- [❤️ Healthchecks](#healthchecks)
- [🌱 Auto-initialization](#auto-initialization)
- [🔗 depends_on](#depends_on)
- [🔄 Restart policies](#restart-policies)
- [🏷️ Naming conventions](#naming-conventions)

---

## <a name="file-structure"></a>📄 File structure

```yaml
services:
  service-name:
    image: postgres:17              # use an existing image
    # OR
    build:
      context: .
      dockerfile: Dockerfile.prod   # build from a specific Dockerfile
    container_name: my-db           # explicit name (optional)
    ports:
      - "5432:5432"                 # host:container
    environment:
      POSTGRES_USER: myuser
      POSTGRES_PASSWORD: mypassword
      POSTGRES_DB: mydb
    env_file:
      - .env                        # load vars from .env file
    volumes:
      - db_data:/var/lib/postgresql/data  # named volume
      - ./db:/docker-entrypoint-initdb.d  # bind mount
    networks:
      - app-network
    depends_on:
      db:
        condition: service_healthy  # wait for healthcheck to pass
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U myuser -d mydb"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  db_data:                          # declare named volumes used above

networks:
  app-network:                      # declare custom networks
```

---

## <a name="per-project-pattern"></a>🗂️ Per-project pattern

> **💡 Key Concept:** Each project gets its own compose file and its own DB container on a **unique port**. This avoids conflicts when multiple projects run simultaneously.

```
projects/
├── 01-flag-quiz/
│   └── docker-compose.dev.yml     # postgres on 5433
├── 02-bucket-list/
│   └── docker-compose.dev.yml     # postgres on 5434
└── 03-teslo-shop/
    └── docker-compose.dev.yml     # postgres on 5435
```

Each compose file is fully self-contained with its own DB name, credentials, and port.

```yaml
# ✅ Per-project — isolated, safe to reset independently
services:
  db:
    image: postgres:17
    ports:
      - "5433:5432"   # unique port per project
    environment:
      POSTGRES_DB: flag_quiz_db
      POSTGRES_USER: flag_user
      POSTGRES_PASSWORD: flag_password

# ❌ Shared container — one reset affects all projects
```

**Why not a shared container?** Running migrations or resetting one project's data would affect all projects sharing the same container. Per-project isolation is simpler and safer.

---

## <a name="healthchecks"></a>❤️ Healthchecks

> **💡 Key Concept:** A container can be *running* but the process inside still initializing. Healthchecks let `depends_on` wait until the service is actually *ready*.

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U myuser -d mydb"]
  interval: 5s      # how often to run the check
  timeout: 5s       # how long to wait for a response
  retries: 5        # failures before marking unhealthy
  start_period: 10s # grace period before checks count as failures
```

### ⚠️ Common gotcha — pg_isready

`pg_isready` defaults to the database named after the user. Always pass both flags:

```bash
# ❌ Wrong — tries to connect to database named "myuser"
pg_isready -U myuser

# ✅ Correct
pg_isready -U myuser -d mydb
```

---

## <a name="auto-initialization"></a>🌱 Auto-initialization

The official Postgres image runs any `.sql` or `.sh` files in `/docker-entrypoint-initdb.d` on **first startup only** (only when the data volume is empty).

```yaml
volumes:
  - ./db:/docker-entrypoint-initdb.d
```

```
db/
├── init.sql      # schema + seed queries
├── data.csv      # referenced by COPY in init.sql
```

```sql
-- init.sql example
CREATE TABLE IF NOT EXISTS capitals (
  id SERIAL PRIMARY KEY,
  country VARCHAR(100) NOT NULL,
  capital VARCHAR(100)
);

COPY capitals (id, country, capital)
FROM '/docker-entrypoint-initdb.d/data.csv' CSV HEADER;

SELECT setval('capitals_id_seq', (SELECT MAX(id) FROM capitals));
```

> **💡 Key Concept:** This only runs once on the very first initialization. If the volume already has data, these files are ignored. To re-initialize: `docker compose down -v` then `up -d`.

---

## <a name="depends_on"></a>🔗 depends_on

```yaml
services:
  api:
    depends_on:
      db:
        condition: service_healthy  # ✅ waits for healthcheck to pass
      redis:
        condition: service_started  # waits for container to start (not ready)
```

| Condition | Waits for |
|-----------|-----------|
| `service_started` | Container is running (default) |
| `service_healthy` | Healthcheck passes ✓ |
| `service_completed_successfully` | Container exited with code 0 |

Always use `service_healthy` when the dependent service needs the process to be fully ready (e.g. API connecting to DB on startup).

---

## <a name="restart-policies"></a>🔄 Restart policies

| Policy | Behavior |
|--------|----------|
| `no` | Never restart (default) |
| `always` | Always restart, including after Docker daemon restarts |
| `unless-stopped` | Restart unless manually stopped |
| `on-failure` | Only restart on non-zero exit code |

✅ Use `unless-stopped` for dev DB containers — survives reboots without being overly aggressive.

---

## <a name="naming-conventions"></a>🏷️ Naming conventions

### Files

| File | Purpose |
|------|---------|
| `docker-compose.dev.yml` | Development setup (local DB, bind mounts) |
| `docker-compose.yml` | Production or base config |
| `docker-compose.override.yml` | Auto-applied overrides on top of base |
| `Dockerfile` | Default image build |
| `Dockerfile.prod` | Production-optimized multi-stage build |

### Services — lowercase kebab-case

```yaml
# ✅
services:
  api:
  db:
  redis:
  worker:
  nginx:

# ❌ Avoid
services:
  MyAPI:
  Database:
  REDIS_CACHE:
```

### Container names — `project-service-env`

```yaml
# ✅
container_name: flag-quiz-db-dev
container_name: teslo-shop-api-dev

# Without container_name, Docker generates: <folder>_<service>_<number>
# e.g. 01-flag-quiz-db-1 — fine for local dev, use explicit names for scripts
```

### Volumes — `project_service_data`

```yaml
volumes:
  flag_quiz_postgres_data:
  teslo_shop_postgres_data:
```

### Networks — `project-network`

```yaml
networks:
  flag-quiz-network:
  teslo-shop-network:
```
