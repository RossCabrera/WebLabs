# 🛠️ 16 — Dev Tooling

Reference notes for the core development toolchain — version managers, package managers, and workflow patterns.
Not a tutorial — written to answer "which tool, and how" quickly.

## 📚 What's covered

| File | Content |
|------|---------|
| `notes/01-mise.md` | Runtime version manager — config, commands, tasks |
| `notes/02-uv.md` | Python package manager — commands, workflow |
| `notes/03-package-managers.md` | Node.js / npm / yarn / pnpm / bun / deno comparison |
| `notes/04-workflow.md` | Decision guide — given project type, use these tools |

## ⚡ Quick reference

```bash
# Pin a runtime version for the current project
mise use node@22
mise use python@3.13

# Install a Python dependency
uv add fastapi

# Install all deps from lockfile
uv sync
bun install
```
