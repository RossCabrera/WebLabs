# 🐳 Docker Concepts

## 📚 Table of Contents
- [🖼️ Image vs Container](#image-vs-container)
- [📄 Dockerfile basics](#dockerfile-basics)
- [💾 Volumes](#volumes)
- [🌐 Networks](#networks)
- [📦 Registries](#registries)
- [📖 Key terms](#key-terms)

---

## <a name="image-vs-container"></a>🖼️ Image vs Container

| | Image | Container |
|--|-------|-----------|
| What | Read-only template (blueprint) | Running instance of an image |
| Analogy | Class | Object |
| Created with | `docker build` or `docker pull` | `docker run` |
| Stored | Locally or in a registry | Only on the host while running |

> **💡 Key Concept:** An image is built in **layers**. Each instruction in a `Dockerfile` adds a layer. Layers are cached — if a layer hasn't changed, Docker reuses it instead of rebuilding.

---

## <a name="dockerfile-basics"></a>📄 Dockerfile basics

```dockerfile
FROM node:22-alpine           # base image
WORKDIR /app                  # sets working directory inside container
COPY package*.json ./         # copy dependency files first (cache layer)
RUN npm install               # install deps (cached until package.json changes)
COPY . .                      # copy rest of source
EXPOSE 3000                   # documents the port (doesn't actually publish it)
CMD ["node", "dist/main.js"]  # default command when container starts
```

> **💡 Key Concept:** Copy dependency files (`package.json`, `requirements.txt`) and install **before** copying source code. Source changes frequently; dependencies don't. This keeps the install layer cached on rebuilds.

```dockerfile
# ✅ Cache-friendly order
COPY package*.json ./
RUN npm install
COPY . .

# ❌ Invalidates cache on every source change
COPY . .
RUN npm install
```

---

## <a name="volumes"></a>💾 Volumes

> **💡 Key Concept:** Without a volume, data written inside a container is **lost when the container is removed**. Volumes persist data beyond the container lifecycle.

### Types

| Type | Syntax | Use case |
|------|--------|----------|
| Named volume | `myvolume:/data` | Persisting DB data between restarts |
| Bind mount | `./local/path:/container/path` | Sharing local files (config, seed data) |
| Anonymous volume | `/data` | Temporary, managed by Docker — avoid |

```yaml
# ✅ Named volume — Docker manages the storage location
volumes:
  - postgres_data:/var/lib/postgresql/data

# ✅ Bind mount — maps a local directory into the container
volumes:
  - ./db:/docker-entrypoint-initdb.d
```

### ⚠️ Volume lifecycle

Named volumes survive `docker compose down`. They are only deleted with:

```bash
docker compose down -v        # deletes volumes declared in compose file
docker volume rm volume-name  # deletes a specific volume
```

---

## <a name="networks"></a>🌐 Networks

> **💡 Key Concept:** Containers in the same Docker network can reach each other by **service name** as the hostname — no IP addresses needed.

```yaml
services:
  api:
    networks:
      - app-network
  db:
    networks:
      - app-network

networks:
  app-network:
```

Inside the `api` container, connect to the database at `db:5432` — Docker's internal DNS resolves the service name automatically.

When no network is defined in compose, Docker creates a default network named `<project>_default` and all services join it automatically.

---

## <a name="registries"></a>📦 Registries

A registry stores and distributes Docker images.

| Registry | URL | Notes |
|----------|-----|-------|
| Docker Hub | `hub.docker.com` | Default public registry |
| GitHub Container Registry | `ghcr.io` | Free for public repos |
| AWS ECR | `*.dkr.ecr.*.amazonaws.com` | Private, integrates with ECS/EKS |

```bash
docker pull postgres:17            # pulls from Docker Hub by default
docker pull ghcr.io/org/image      # pulls from GitHub Container Registry
docker push myuser/myimage:1.0     # push to Docker Hub (must be logged in)
```

---

## <a name="key-terms"></a>📖 Key terms

| Term | Meaning |
|------|---------|
| `Dockerfile` | Recipe to build a custom image |
| `docker-compose.yml` | Defines multi-container apps declaratively |
| `entrypoint` | Fixed command that always runs (hard to override) |
| `cmd` | Default args — overridden when you pass a command to `docker run` |
| `healthcheck` | Command Docker runs to decide if a container is ready |
| `service` | A container definition inside a compose file |
| `layer` | One step in an image build — cached independently |
| `tag` | A label on an image, e.g. `postgres:17` — `17` is the tag |
