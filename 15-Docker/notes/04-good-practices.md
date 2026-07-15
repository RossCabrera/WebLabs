# ✅ Good Practices & Naming Conventions

## 📚 Table of Contents
- [🙈 .dockerignore](#dockerignore)
- [🔐 Secrets & environment variables](#secrets--environment-variables)
- [❤️ Healthchecks](#healthchecks)
- [🏷️ Image tagging strategy](#image-tagging-strategy)
- [🔒 Don't run as root](#dont-run-as-root)
- [📦 Keep images small](#keep-images-small)
- [🏷️ Naming conventions](#naming-conventions)

---

## <a name="dockerignore"></a>🙈 .dockerignore

> **💡 Key Concept:** `.dockerignore` prevents files from being sent to the Docker build context. Without it, `node_modules`, `.git`, and other large directories are included in every build — making it slow and bloated.

```
# .dockerignore
node_modules/
.git/
.env
.env.*
dist/
*.log
.DS_Store
coverage/
__pycache__/
.venv/
*.pyc
```

```dockerfile
# ✅ With .dockerignore — node_modules excluded, COPY . . is safe
COPY . .

# ❌ Without .dockerignore — copies gigabytes of node_modules into the image
COPY . .
```

---

## <a name="secrets--environment-variables"></a>🔐 Secrets & environment variables

### For development

Use `.env` files — never hardcode credentials in compose files.

```yaml
# ✅ Load from .env
env_file:
  - .env

# ❌ Hardcoded credentials in compose
environment:
  POSTGRES_PASSWORD: mysecretpassword
```

Always have an `.env.example` with placeholder values committed to git:

```
# .env.example
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp_db
DB_USERNAME=myuser
DB_PASSWORD=your_password
```

```
# .gitignore
.env
.env.local
.env.*.local
```

> **💡 Key Concept:** Commit `.env.example` — never commit `.env`. The example tells collaborators what variables are needed without exposing real values.

### For production

Never use `.env` files in production. Use your platform's secret management:

| Platform | Tool |
|----------|------|
| AWS | Secrets Manager / Parameter Store |
| GCP | Secret Manager |
| Railway / Render | Environment variable UI |
| Docker Swarm | `docker secret` |
| Kubernetes | Secrets (+ external-secrets operator) |

---

## <a name="healthchecks"></a>❤️ Healthchecks

Always add healthchecks to services that other containers depend on.

```yaml
# ✅ Postgres healthcheck
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
  interval: 5s
  timeout: 5s
  retries: 5
  start_period: 10s

# ✅ HTTP API healthcheck
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 10s
  timeout: 5s
  retries: 3
```

```yaml
# ✅ Use service_healthy so dependent services wait properly
depends_on:
  db:
    condition: service_healthy

# ❌ service_started doesn't guarantee the DB is ready to accept connections
depends_on:
  - db
```

---

## <a name="image-tagging-strategy"></a>🏷️ Image tagging strategy

> **💡 Key Concept:** Never rely on `latest` in production. It's unpredictable — pulling `latest` today and tomorrow may give you different images.

```bash
# ❌ Unpredictable in production
FROM node:latest
image: myapp:latest

# ✅ Pin to a specific version
FROM node:22-alpine
image: myapp:1.4.2

# ✅ Use semantic versioning for your own images
docker build -t myapp:1.0.0 .
docker tag myapp:1.0.0 myapp:1.0
docker tag myapp:1.0.0 myapp:1
```

### Tag naming pattern

| Tag | Meaning |
|-----|---------|
| `1.0.0` | Exact version — fully pinned |
| `1.0` | Minor series — gets patch updates |
| `1` | Major series — gets minor + patch updates |
| `latest` | Most recent build — avoid in prod |
| `sha-abc1234` | Git commit SHA — fully reproducible |

For dev images, using the git short SHA as the tag gives you full traceability:

```bash
docker build -t myapp:$(git rev-parse --short HEAD) .
```

---

## <a name="dont-run-as-root"></a>🔒 Don't run as root

By default, processes inside containers run as root. If an attacker escapes the container, they have root on the host.

```dockerfile
# ✅ Create a non-root user and switch to it
FROM node:22-alpine
WORKDIR /app
COPY --chown=node:node . .
USER node

# ✅ Many official images already have a non-root user
USER node        # node image
USER www-data    # nginx/apache images
```

---

## <a name="keep-images-small"></a>📦 Keep images small

```dockerfile
# ✅ Use alpine variants — much smaller base image
FROM node:22-alpine     # ~50MB
# vs
FROM node:22            # ~300MB+

# ✅ Multi-stage builds — build artifacts in one stage, copy only what's needed to final image
FROM node:22-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/main.js"]

# ✅ Combine RUN commands to reduce layers
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# ❌ Each RUN is a separate layer
RUN apt-get update
RUN apt-get install -y curl
RUN rm -rf /var/lib/apt/lists/*
```

---

## <a name="naming-conventions"></a>🏷️ Naming conventions

### Images — `owner/project-service:version`

```bash
# Public / Docker Hub
myusername/myapp-api:1.0.0
myusername/myapp-worker:1.0.0

# Private registry
ghcr.io/myorg/myapp-api:1.0.0
123456789.dkr.ecr.us-east-1.amazonaws.com/myapp-api:1.0.0
```

### Compose file names

| Name | When to use |
|------|-------------|
| `docker-compose.dev.yml` | Local development |
| `docker-compose.yml` | Production base |
| `docker-compose.override.yml` | Local overrides (auto-applied) |
| `docker-compose.test.yml` | CI/test environment |

### Services — lowercase kebab-case, descriptive

```yaml
# ✅
api / backend / server
db / postgres / mysql
cache / redis
queue / worker
proxy / nginx
```

### Container names — `project-service-env`

```yaml
# ✅
container_name: myapp-db-dev
container_name: myapp-api-prod
container_name: flag-quiz-postgres-dev
```

### Volumes — `project_service_purpose`

```yaml
# ✅
volumes:
  myapp_postgres_data:
  myapp_redis_data:
  flag_quiz_postgres_data:
```

### Networks — `project-purpose`

```yaml
# ✅
networks:
  myapp-backend:
  myapp-frontend:
  flag-quiz-network:
```

### Environment variables — `SCREAMING_SNAKE_CASE`

```bash
# ✅
DB_HOST=localhost
DB_PORT=5432
POSTGRES_USER=myuser
JWT_SECRET=supersecret

# ❌
db-host=localhost
dbPort=5432
```
