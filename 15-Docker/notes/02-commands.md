# 🧰 Docker Commands Cheat Sheet

## 📚 Table of Contents
- [🖼️ Images](#images)
- [📦 Containers](#containers)
- [💾 Volumes](#volumes)
- [🌐 Networks](#networks)
- [🐙 Docker Compose](#docker-compose)
- [🔍 Inspection & Debugging](#inspection--debugging)
- [🧹 System Cleanup](#system-cleanup)
- [🚩 Common flags](#common-flags)

---

## <a name="images"></a>🖼️ Images

```bash
docker images                        # list local images
docker pull postgres:17              # pull image from registry
docker build -t myapp:1.0 .          # build from Dockerfile in current dir
docker build -t myapp:1.0 -f Dockerfile.prod .  # use a specific Dockerfile
docker rmi myapp:1.0                 # remove image
docker image prune                   # remove all dangling (untagged) images
docker image prune -a                # remove all unused images
```

---

## <a name="containers"></a>📦 Containers

```bash
docker run postgres:17               # run container (foreground)
docker run -d postgres:17            # run detached (background)
docker run -d -p 5432:5432 postgres:17          # map port host:container
docker run -d --name my-db postgres:17          # give it a name
docker run -d -e POSTGRES_PASSWORD=secret postgres:17  # set env var
docker run --rm -it node:22 bash     # temp container, removed on exit

docker ps                            # list running containers
docker ps -a                         # list all (including stopped)
docker stop my-db                    # graceful stop
docker start my-db                   # start a stopped container
docker restart my-db                 # restart
docker rm my-db                      # remove stopped container
docker rm -f my-db                   # force remove (even if running)

docker logs my-db                    # show logs
docker logs -f my-db                 # follow logs (live)
docker logs --tail 50 my-db          # last 50 lines

docker exec -it my-db bash           # open shell inside running container
docker exec -it my-db psql -U user -d dbname  # run specific command inside
```

---

## <a name="volumes"></a>💾 Volumes

```bash
docker volume ls                     # list volumes
docker volume inspect my-volume      # show details and mount path
docker volume rm my-volume           # remove volume
docker volume prune                  # remove all unused volumes
```

---

## <a name="networks"></a>🌐 Networks

```bash
docker network ls                    # list networks
docker network inspect my-network    # show details + connected containers
docker network create my-network     # create a network
docker network rm my-network         # remove network
```

---

## <a name="docker-compose"></a>🐙 Docker Compose

```bash
# Always specify the file explicitly for dev setups
docker compose -f docker-compose.dev.yml up -d         # start all services
docker compose -f docker-compose.dev.yml up -d db      # start one service
docker compose -f docker-compose.dev.yml down          # stop and remove containers
docker compose -f docker-compose.dev.yml down -v       # also delete volumes
docker compose -f docker-compose.dev.yml restart db    # restart one service
docker compose -f docker-compose.dev.yml logs -f       # follow all logs
docker compose -f docker-compose.dev.yml logs -f db    # follow one service
docker compose -f docker-compose.dev.yml ps            # list services and status
docker compose -f docker-compose.dev.yml exec db bash  # shell into service
docker compose -f docker-compose.dev.yml build         # rebuild images
docker compose -f docker-compose.dev.yml pull          # pull latest images
```

---

## <a name="inspection--debugging"></a>🔍 Inspection & Debugging

```bash
docker inspect my-db                 # full JSON details about a container
docker inspect my-db | grep IPAddress  # grep specific info
docker stats                         # live resource usage (CPU, memory)
docker stats my-db                   # resource usage for one container
docker top my-db                     # running processes inside container
docker diff my-db                    # files changed since container started
docker cp my-db:/etc/config ./       # copy file from container to host
docker cp ./file.sql my-db:/tmp/     # copy file from host to container
```

---

## <a name="system-cleanup"></a>🧹 System Cleanup

```bash
docker system df                     # disk usage breakdown
docker system prune                  # remove stopped containers, unused networks, dangling images
docker system prune -a               # also remove unused images
docker system prune -a --volumes     # ⚠️ removes everything unused including volumes
```

---

## <a name="common-flags"></a>🚩 Common flags

| Flag | Meaning |
|------|---------|
| `-d` | Detached — run in background |
| `-it` | Interactive terminal |
| `-p host:container` | Publish port |
| `-e KEY=value` | Set environment variable |
| `--name` | Give container a name |
| `--rm` | Auto-remove container when it stops |
| `-v host:container` | Mount volume or bind mount |
| `--network` | Connect to a specific network |
| `-f` | Specify file (compose) or force (rm) |
