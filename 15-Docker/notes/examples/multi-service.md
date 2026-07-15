# 🏗️ Example — Multi-service App with Networking

A realistic dev setup: NestJS API + Postgres + Redis, all connected via an internal network.

---

## 📁 Folder structure

```
my-app/
├── docker-compose.dev.yml
├── Dockerfile.dev
├── .env
└── .env.example
```

---

## 🐙 docker-compose.dev.yml

```yaml
services:

  api:
    build:
      context: .
      dockerfile: Dockerfile.dev
    container_name: my-app-api-dev
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      DB_HOST: db              # service name — Docker DNS resolves this
      DB_PORT: 5432
      DB_NAME: ${DB_NAME}
      DB_USERNAME: ${DB_USERNAME}
      DB_PASSWORD: ${DB_PASSWORD}
      REDIS_HOST: cache
      REDIS_PORT: 6379
    volumes:
      - .:/app                 # bind mount for hot reload
      - /app/node_modules      # keep container's node_modules separate
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_healthy
    networks:
      - my-app-network

  db:
    image: postgres:17
    container_name: my-app-db-dev
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    ports:
      - "5433:5432"            # exposed for DBeaver / external tools
    volumes:
      - my_app_postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USERNAME} -d ${DB_NAME}"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - my-app-network

  cache:
    image: redis:7-alpine
    container_name: my-app-redis-dev
    restart: unless-stopped
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
    networks:
      - my-app-network

volumes:
  my_app_postgres_data:

networks:
  my-app-network:
```

---

## 🐳 Dockerfile.dev

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]
```

---

## 🔐 .env.example

```bash
DB_NAME=my_app_db
DB_USERNAME=my_user
DB_PASSWORD=your_password
```

---

## 💡 Key points in this setup

| Detail | Why |
|--------|-----|
| `DB_HOST: db` | Services talk to each other by service name — no IP needed |
| `- /app/node_modules` | Anonymous volume shadows the bind mount's node_modules — keeps container's deps |
| `depends_on: service_healthy` | API waits for DB and Redis to actually be ready, not just started |
| `ports` on db/cache | Exposed to host so you can connect from DBeaver / redis-cli on your machine |
| Separate network | Isolates this app's containers from other projects running locally |

---

## ⚡ Commands

```bash
# Start everything
docker compose -f docker-compose.dev.yml up -d

# View logs for all services
docker compose -f docker-compose.dev.yml logs -f

# Open a psql shell
docker compose -f docker-compose.dev.yml exec db psql -U my_user -d my_app_db

# Open a redis-cli shell
docker compose -f docker-compose.dev.yml exec cache redis-cli

# Rebuild the API image after Dockerfile changes
docker compose -f docker-compose.dev.yml build api
docker compose -f docker-compose.dev.yml up -d api

# Full reset
docker compose -f docker-compose.dev.yml down -v
docker compose -f docker-compose.dev.yml up -d
```
