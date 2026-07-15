# 🐳 15 — Docker

Reference notes from a Docker workshop and hands-on usage across projects.
Not a tutorial — assumes you know the basics and need a fast lookup.

## 📚 What's covered

| File | Content |
|------|---------|
| `notes/01-concepts.md` | Images, containers, volumes, networks, registries |
| `notes/02-commands.md` | Command cheat sheet grouped by category |
| `notes/03-compose.md` | Compose structure, per-project pattern, naming |
| `notes/04-good-practices.md` | .dockerignore, secrets, healthchecks, naming conventions |
| `notes/examples/postgres-dev.md` | Per-project Postgres dev setup |
| `notes/examples/multi-service.md` | Multi-container app with networking |

## ⚡ Quick reference

```bash
docker compose -f docker-compose.dev.yml up -d    # start in background
docker compose -f docker-compose.dev.yml down -v  # stop + delete volumes
docker compose -f docker-compose.dev.yml logs -f  # follow logs
```
