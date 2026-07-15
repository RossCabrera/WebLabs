# 📦 Node.js Package Managers

## 📚 Table of Contents
- [🟢 Node.js — the runtime](#nodejs--the-runtime)
- [📊 Comparison table](#comparison-table)
- [🔵 npm](#npm)
- [🟡 yarn](#yarn)
- [🟠 pnpm](#pnpm)
- [⚡ bun](#bun)
- [🦕 deno](#deno)
- [✅ Recommendation](#recommendation)

---

## <a name="nodejs--the-runtime"></a>🟢 Node.js — the runtime

> **💡 Key Concept:** Node.js is the **runtime** — it executes JavaScript outside the browser. Package managers are separate tools that install and manage the libraries your Node.js project depends on. You need the runtime first; then you choose a package manager.

```
Node.js (runtime)
    └── npm (comes bundled with Node.js)
    └── yarn (alternative, install separately)
    └── pnpm (alternative, install separately)

Bun (runtime + package manager bundled together)
Deno (runtime + package manager bundled together)
```

---

## <a name="comparison-table"></a>📊 Comparison table

| | npm | yarn | pnpm | bun | deno |
|-|-----|------|------|-----|------|
| Runtime | Node.js | Node.js | Node.js | Bun (own) | Deno (own) |
| Speed | Slow | Medium | Fast | ⚡ Fastest | Fast |
| Disk usage | High | High | Low (hardlinks) | Low | Low |
| Lock file | `package-lock.json` | `yarn.lock` | `pnpm-lock.yaml` | `bun.lock` | `deno.lock` |
| Workspaces | ✅ | ✅ | ✅ (best) | ✅ | ✅ |
| Node compat | ✅ Native | ✅ | ✅ | ✅ Mostly | ⚠️ Partial |
| TypeScript | Via tsc/esbuild | Via tsc/esbuild | Via tsc/esbuild | ✅ Native | ✅ Native |
| Test runner | ❌ | ❌ | ❌ | ✅ Built-in | ✅ Built-in |
| Maturity | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |

---

## <a name="npm"></a>🔵 npm

Comes bundled with Node.js — no extra install needed. The default choice when you create a new Node project with `npm init`.

```bash
npm install              # install from package.json
npm install express      # add a dependency
npm install -D vitest    # add dev dependency
npm uninstall express    # remove a dependency
npm run dev              # run a script
npm run build
npm update               # update packages
npm ci                   # clean install from lockfile (CI use)
```

**Lock file:** `package-lock.json` — always commit this.

```
# ✅ Commit
package-lock.json

# ❌ Never commit
node_modules/
```

> **When to use:** When a project requires npm specifically, or when working with legacy projects. Most tutorials default to npm so it's good to know.

---

## <a name="yarn"></a>🟡 yarn

Created by Meta to solve early npm speed and reliability issues. Yarn v1 (Classic) is widely used; Yarn v4 (Berry) uses plug'n'play and is more opinionated.

```bash
yarn install             # install from package.json
yarn add express         # add a dependency
yarn add -D vitest       # add dev dependency
yarn remove express      # remove a dependency
yarn dev                 # run a script (no "run" needed)
yarn build
yarn upgrade             # update packages
```

**Lock file:** `yarn.lock` — always commit this.

> **When to use:** Projects that already use yarn, or when required by a team. For new projects, pnpm or bun are better choices today. Yarn v1 is in maintenance mode.

---

## <a name="pnpm"></a>🟠 pnpm

Uses a content-addressable store with hardlinks — packages are stored once on disk and shared across projects. Significant disk space savings and faster installs than npm/yarn.

```bash
pnpm install             # install from package.json
pnpm add express         # add a dependency
pnpm add -D vitest       # add dev dependency
pnpm remove express      # remove a dependency
pnpm run dev             # run a script
pnpm run build
pnpm update              # update packages
pnpm dlx create-next-app # run a package without installing (like npx)
```

**Lock file:** `pnpm-lock.yaml` — always commit this.

> **When to use:** Monorepos (pnpm workspaces are excellent), large projects with many dependencies, or when disk space matters. Growing standard in the JS ecosystem.

---

## <a name="bun"></a>⚡ bun

A full runtime + package manager + bundler + test runner in one binary. Significantly faster than Node.js + npm for most operations. Written in Zig.

```bash
bun install              # install from package.json (very fast)
bun add express          # add a dependency
bun add -d vitest        # add dev dependency
bun remove express       # remove a dependency
bun run dev              # run a script
bun run build
bun update               # update packages
bun x create-next-app    # run a package without installing (like npx)

# Bun-specific
bun test                 # run tests with bun's built-in test runner
bun build ./src/index.ts # bundle TypeScript directly
bun ./src/index.ts       # run TypeScript directly (no compile step)
```

**Lock file:** `bun.lock` — always commit this.

> **When to use:** New projects where you control the runtime. Excellent for learning, rapid prototyping, and projects that want TypeScript without build steps. Node compatibility is very good but not 100%.

---

## <a name="deno"></a>🦕 deno

A secure runtime with built-in TypeScript, testing, linting, and formatting. Uses URLs for imports by default (like browsers) instead of `node_modules`. Created by the original author of Node.js.

```bash
deno install             # install dependencies
deno add npm:express     # add an npm package
deno run dev             # run a task from deno.json
deno test                # run tests
deno fmt                 # format code
deno lint                # lint code
deno compile main.ts     # compile to executable
```

**Config:** `deno.json` — imports and tasks live here.

```json
{
  "imports": {
    "express": "npm:express@5"
  },
  "tasks": {
    "dev": "deno run --watch main.ts"
  }
}
```

> **When to use:** Scripts, CLIs, or projects where security isolation matters (Deno sandboxes file/network access by default). Node.js ecosystem compatibility has improved a lot with Deno 2, but it's still not 100%. Best for greenfield projects where you own all the choices.

---

## <a name="recommendation"></a>✅ Recommendation

| Scenario | Use |
|----------|-----|
| New Node.js project | **bun** — fastest, built-in TS, great DX |
| Existing npm project | **npm** — stay consistent with what's there |
| Monorepo | **pnpm** — best workspace support, disk efficient |
| Team already uses yarn | **yarn** — consistency beats switching cost |
| Secure script / CLI | **deno** — built-in permissions, zero config TS |
| Following a tutorial | Match whatever the tutorial uses |

### For this repo (WebLabs)

All JS/TS sections use **bun** — it was migrated from npm during the reorganization.

```bash
# ✅ Install deps
bun install

# ✅ Run scripts (same as npm run X)
bun run dev
bun run build
bun run test
```
