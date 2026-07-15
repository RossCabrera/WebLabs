# 🗺️ Workflow — Tool Decision Guide

The "given this project, use these tools" reference.

## 📚 Table of Contents
- [🗺️ Workflow — Tool Decision Guide](#️-workflow--tool-decision-guide)
  - [📚 Table of Contents](#-table-of-contents)
  - [🧠 Mental model](#-mental-model)
  - [🌐 JavaScript / TypeScript project](#-javascript--typescript-project)
  - [🐍 Python project](#-python-project)
  - [🐳 Any project with a database](#-any-project-with-a-database)
  - [📁 WebLabs setup](#-weblabs-setup)
  - [🔄 Starting a new project checklist](#-starting-a-new-project-checklist)
    - [JavaScript / TypeScript](#javascript--typescript)
    - [Python](#python)
    - [Adding a database to any project](#adding-a-database-to-any-project)

---

## <a name="mental-model"></a>🧠 Mental model

> **💡 Key Concept:** Each tool has one job. They compose together — mise handles runtime versions, the package manager handles libraries, Docker handles infrastructure.

```
mise          → pins runtime versions (Node, Python, Bun) per directory
  └── bun     → manages JS/TS packages + runs scripts
  └── uv      → manages Python packages + virtual environments
Docker        → runs infrastructure (databases, caches, queues)
```

They don't overlap. If you find yourself thinking "do I use mise or uv for this?" — mise pins Python version, uv manages packages inside that Python.

---

## <a name="javascript--typescript-project"></a>🌐 JavaScript / TypeScript project

```
mise → pins Node.js or Bun version
bun  → installs packages, runs scripts
```

```toml
# .mise.toml
[tools]
bun = "1.2"
# or
node = "22"
```

```bash
bun install          # install deps
bun run dev          # start dev server
bun run build        # build for production
bun run test         # run tests
```

**Lock file to commit:** `bun.lock`  
**To gitignore:** `node_modules/`, `dist/`

---

## <a name="python-project"></a>🐍 Python project

```
mise → pins Python version
uv   → manages packages + virtual environment
```

```toml
# .mise.toml
[tools]
python = "3.13"
```

```toml
# pyproject.toml (created by uv init)
[project]
requires-python = ">=3.13"
dependencies = ["fastapi", "sqlalchemy"]
```

```bash
uv sync              # install all deps from lockfile
uv add fastapi       # add a package
uv run python main.py   # run without manual venv activation
uv run pytest           # run tests
```

**Files to commit:** `pyproject.toml`, `uv.lock`, `.mise.toml`  
**To gitignore:** `.venv/`, `__pycache__/`, `*.pyc`

---

## <a name="any-project-with-a-database"></a>🐳 Any project with a database

```
Docker Compose → runs the database (Postgres, Redis, etc.)
mise tasks     → shortcuts for starting/stopping
```

```toml
# .mise.toml tasks
[tasks.db]
run = "docker compose -f docker-compose.dev.yml up -d"

[tasks.db-stop]
run = "docker compose -f docker-compose.dev.yml down"

[tasks.db-reset]
run = "docker compose -f docker-compose.dev.yml down -v && docker compose -f docker-compose.dev.yml up -d"
```

```bash
mise run db           # start database
mise run db-stop      # stop database
mise run db-reset     # wipe and restart (re-runs init.sql)
```

One compose file per project, each on a unique port. Never a shared database container across projects.

---

## <a name="weblabs-setup"></a>📁 WebLabs setup

```
WebLabs/
├── 11-React/
│   ├── .mise.toml           # node = "22", bun = "1.2"
│   └── projects/
│       └── 01-heroes-app/
│           ├── 01-heroes-app-frontend/   → bun install && bun run dev
│           └── 02-heroes-app-backend/    → bun install && bun run start:dev
├── 12-Python/
│   └── .mise.toml           # python = "3.13"
├── 13-Django/
│   ├── .mise.toml           # python = "3.13"
│   ├── pyproject.toml
│   └── uv.lock
└── 15-Docker/               # notes only, no runtime needed
```

> **💡 Key Concept:** Each section gets its own `.mise.toml` so runtimes are isolated. `cd 13-Django` activates Python 3.13 automatically; `cd 11-React` activates Node 22 and Bun — without any manual switching.

---

## <a name="starting-a-new-project-checklist"></a>🔄 Starting a new project checklist

### JavaScript / TypeScript

```bash
# 1. Create directory
mkdir my-project && cd my-project

# 2. Pin runtime
mise use bun@1.2       # writes .mise.toml

# 3. Initialize project
bun init               # or: bunx create-vite, bunx create-next-app, etc.

# 4. Start building
bun install
bun run dev
```

**Commit:** `.mise.toml`, `package.json`, `bun.lock`

---

### Python

```bash
# 1. Create directory
mkdir my-project && cd my-project

# 2. Pin Python version
mise use python@3.13   # writes .mise.toml

# 3. Initialize project
uv init                # creates pyproject.toml + uv.lock

# 4. Add dependencies
uv add fastapi uvicorn
uv add --dev pytest ruff

# 5. Start building
uv run python main.py
```

**Commit:** `.mise.toml`, `pyproject.toml`, `uv.lock`  
**Gitignore:** `.venv/`, `__pycache__/`

---

### Adding a database to any project

```bash
# 1. Create docker-compose.dev.yml (see examples/postgres-dev.md in 15-Docker)
# 2. Create .env + .env.example
# 3. Add mise tasks for db start/stop/reset
# 4. Start the DB
mise run db
```

**Commit:** `docker-compose.dev.yml`, `.env.example`, `.mise.toml`  
**Gitignore:** `.env`
