# 🎛️ mise — Runtime Version Manager

## 📚 Table of Contents
- [🤔 What is mise?](#what-is-mise)
- [⚙️ Configuration](#configuration)
- [🧰 Commands](#commands)
- [📋 Tasks](#tasks)
- [💡 How it works](#how-it-works)
- [✅ Good practices](#good-practices)

---

## <a name="what-is-mise"></a>🤔 What is mise?

> **💡 Key Concept:** mise (pronounced "meez") is a runtime version manager — it pins the exact version of Node, Python, Bun, or any other tool **per project directory**. When you `cd` into a project, mise automatically activates the right versions.

It replaces tools like `nvm`, `pyenv`, `rbenv`, and `asdf` with a single unified tool.

| Instead of | Use mise |
|-----------|---------|
| `nvm use 22` | `mise use node@22` |
| `pyenv local 3.13` | `mise use python@3.13` |
| Managing multiple version managers | Just mise |

---

## <a name="configuration"></a>⚙️ Configuration

mise uses a `.mise.toml` file at the root of a project (or directory):

```toml
[tools]
node = "22"
python = "3.13"
bun = "1.2"

[env]
NODE_ENV = "development"   # automatically set when you cd into this directory
```

### 🌍 The `[env]` section

`[env]` sets shell-level environment variables whenever you enter that directory — before any process starts. It is **not** for app secrets or credentials (those go in `.env`). It's for variables that affect **CLI tools and the shell itself**.

#### ✅ Good use cases

```toml
[env]
# Enable Docker BuildKit for every docker build in this project
DOCKER_BUILDKIT = "1"

# Point kubectl to a specific cluster config
KUBECONFIG = "~/.kube/my-cluster-config"

# Use a specific AWS profile when running AWS CLI commands
AWS_PROFILE = "my-project-staging"

# Stop Python from generating __pycache__ folders
PYTHONDONTWRITEBYTECODE = "1"

# Force colored terminal output in tools that support it
FORCE_COLOR = "1"
```

#### ❌ What NOT to put in `[env]`

```toml
# ❌ Secrets and credentials — use .env instead
DB_PASSWORD = "mysecret"
API_KEY = "abc123"

# ❌ Variables your app reads at runtime — use .env / dotenv
DATABASE_URL = "postgres://..."
```

> **💡 Key Concept:** The difference between `[env]` in mise and `.env` files — mise `[env]` is set by the **shell** when you enter the directory (affects all commands you run). `.env` is loaded by the **app** at runtime (only affects that process). Most app config belongs in `.env`; `[env]` is for tooling.

```toml
# Pin exact versions for full reproducibility
[tools]
node = "22.3.0"
python = "3.13.1"
```

> **💡 Key Concept:** mise resolves the **nearest** config file by walking up the directory tree. A `.mise.toml` in `13-Django/` only activates when you're inside that directory — it doesn't affect other projects.

### Where to put the config

| Location | Scope |
|----------|-------|
| `~/.config/mise/config.toml` | Global defaults for all projects |
| `~/Learning/Active/WebLabs/.mise.toml` | All WebLabs sections |
| `WebLabs/13-Django/.mise.toml` | Only the Django section |

---

## <a name="commands"></a>🧰 Commands

```bash
# Pin a tool version for the current directory (writes to .mise.toml)
mise use node@22
mise use python@3.13
mise use bun@latest

# Pin globally
mise use -g node@22

# Install all tools declared in the nearest .mise.toml
mise install

# List installed versions
mise list

# List all available versions of a tool
mise ls-remote node
mise ls-remote python

# Show which version is currently active
mise current
mise current node

# Run a command with a specific version (without activating globally)
mise exec node@18 -- node --version

# Show which .mise.toml is active
mise config
```

---

## <a name="tasks"></a>📋 Tasks

mise can also run project tasks, similar to `npm run` or `make`:

```toml
# .mise.toml
[tasks.dev]
run = "bun run dev"

[tasks.db]
run = "docker compose -f docker-compose.dev.yml up -d"

[tasks.db-stop]
run = "docker compose -f docker-compose.dev.yml down"

[tasks.install]
run = "bun install"
```

```bash
mise run dev        # start dev server
mise run db         # start the database
mise run db-stop    # stop the database
```

> **💡 Key Concept:** Tasks are especially useful for hiding long compose commands — `mise run db` is much easier to remember than `docker compose -f docker-compose.dev.yml up -d`.

---

## <a name="how-it-works"></a>💡 How it works

mise hooks into your shell (`~/.bashrc` or `~/.zshrc`) and intercepts every directory change. When you `cd` into a directory, mise:

1. Walks up the tree looking for `.mise.toml` files
2. Activates the versions declared in those files
3. Prepends the right tool binaries to your `PATH`

```bash
# Shell hook (added by mise activate)
eval "$(mise activate zsh)"   # in ~/.zshrc
eval "$(mise activate bash)"  # in ~/.bashrc
```

---

## <a name="good-practices"></a>✅ Good practices

```toml
# ✅ Commit .mise.toml — it's the source of truth for tool versions
# ❌ Don't commit .mise.local.toml — it's for personal overrides

# ✅ Pin major versions at minimum
[tools]
node = "22"        # gets latest 22.x

# ✅ Pin exact versions for production environments
[tools]
node = "22.3.0"

# ✅ One .mise.toml per track/section in WebLabs
# 12-Python/.mise.toml  →  python = "3.13"
# 11-React/.mise.toml   →  node = "22", bun = "1.2"
```

| Do | Don't |
|----|-------|
| Commit `.mise.toml` | Commit `.mise.local.toml` |
| Pin at least major version | Leave versions unpinned |
| One config per project/track | One global config for everything |
| Use tasks for frequent commands | Write long commands every time |
