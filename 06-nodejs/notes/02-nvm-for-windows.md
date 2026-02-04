# ✏️ NVM for Windows Study Notes

## 📚 Table of Contents

- [🔧 Understanding NVM](#understanding-nvm)
- [📥 Installation & Setup](#installation-setup)
- [🎯 Version Management](#version-management)
- [📦 Global vs Local Packages](#global-local-packages)
- [🔄 Multi-Project Workflow](#multi-project-workflow)
- [💻 VS Code Integration](#vscode-integration)

---

## <a name="understanding-nvm"></a>🔧 Understanding NVM

> **💡 Key Concept:** NVM allows you to install and switch between multiple Node.js versions on the same machine.

### 🤔 What is NVM?

**Definition:** A version management tool for Node.js

| Concept | Reality |
| :--- | :--- |
| ✅ Version manager | ❌ Node.js itself |
| ✅ Switches between versions | ❌ Package manager |
| ✅ Isolates global packages per version | ❌ Programming language |

### 🪟 Windows vs Unix

**Important:** Windows uses **nvm-windows** (different from Unix nvm)

| Platform | Tool | Auto-read .nvmrc? |
| :--- | :--- | :---: |
| **Windows** | nvm-windows | ❌ No |
| **macOS/Linux** | nvm | ✅ Yes |

### 🔄 Core Concept

Each Node version has its own:

- npm/pnpm
- Global packages
- Completely isolated environment

### ✅ Section Summary

| Concept | Key Point |
| :--- | :--- |
| **Purpose** | Manage multiple Node versions |
| **Windows Tool** | nvm-windows (not Unix nvm) |
| **Isolation** | Each version has separate globals |

---

## <a name="installation-setup"></a>📥 Installation & Setup

> **💡 Key Concept:** Install location determines admin privilege requirements.

### 📥 Installation

**Download:** [nvm-windows releases](https://github.com/coreybutler/nvm-windows/releases)

**Get:** `nvm-setup.exe` (not the zip)

**Verify:**

```bash
nvm version
```

### ✅ Section Summary

| Concept | Key Point |
| :--- | :--- |
| **Download** | nvm-setup.exe from GitHub |
| **Verify** | `nvm version` |

---

## <a name="version-management"></a>🎯 Version Management

> **💡 Key Concept:** Each version is isolated. Switching affects only the current terminal session.

### 📥 Installing Versions

```bash
nvm install 20        # Install latest v20
nvm install 18.19.0   # Install exact version
nvm list available    # See all available versions
```

### 🔄 Switching Versions

```bash
nvm use 20            # Switch to version 20
nvm list              # List installed versions
nvm current           # Show active version
```

### 📌 Using .nvmrc Files

**⚠️ Windows Limitation:** Must explicitly read the file

**Create .nvmrc:**

```bash
echo 20 > .nvmrc
```

**Use it:**

```bash
# Windows requires this syntax
nvm use (Get-Content .nvmrc)

# macOS/Linux (for reference)
nvm use
```

### 💡 Helper Function (Optional)

Add to PowerShell profile (`notepad $PROFILE`):

```powershell
function nvmuse {
    if (Test-Path .nvmrc) {
        nvm use (Get-Content .nvmrc)
    } else {
        Write-Host "No .nvmrc found" -ForegroundColor Red
    }
}
```

Then use: `nvmuse`

### 📋 Essential Commands

```bash
nvm install 20                   # Install Node 20
nvm use 20                       # Switch to Node 20
nvm use (Get-Content .nvmrc)     # Use from .nvmrc (Windows)
nvm list                         # Show installed
nvm current                      # Show active
nvm uninstall 18                 # Remove version
```

### ✅ Section Summary

| Concept | Key Point |
| :--- | :--- |
| **Install** | `nvm install 20` |
| **Switch** | `nvm use 20` |
| **.nvmrc** | Must use `Get-Content` on Windows |
| **Isolation** | Each terminal session independent |

---

## <a name="global-local-packages"></a>📦 Global vs Local Packages

> **💡 Key Concept:** Local packages belong to projects. Global packages belong to Node versions.

### 📊 Comparison

| Type | Command | Tied To | Needs Admin? |
| :--- | :--- | :--- | :---: |
| **Local** | `npm install express` | Project | ❌ |
| **Global** | `npm install -g nodemon` | Node version | ⚠️ Maybe |

### 📁 Local Packages

```bash
npm install express       # Goes to node_modules/
pnpm add lodash          # Same concept
```

**Key Points:**

- ✅ In project's `node_modules/`
- ✅ Tracked in `package.json`
- ✅ Not tied to Node version
- ✅ Each project isolated

### 🌍 Global Packages

```bash
npm install -g nodemon
pnpm add -g typescript
```

**Key Points:**

- ⚠️ Tied to active Node version
- ⚠️ Must reinstall for each version
- ⚠️ Not in `package.json`
- ⚠️ Used as CLI commands

### 🎯 When to Use Each

| Use Local For | Use Global For |
| :--- | :--- |
| Project dependencies | CLI tools |
| Anything imported in code | Development utilities |
| Libraries (Express, React) | Project generators |

### 🔄 Example

```bash
# Node 20
nvm use 20
npm install -g nodemon     # Only in Node 20

# Node 18
nvm use 18
nodemon --version          # ❌ Not found! Must reinstall
npm install -g nodemon     # Now in Node 18 too
```

### ✅ Section Summary

| Concept | Key Point |
| :--- | :--- |
| **Local** | Project-specific, in node_modules/ |
| **Global** | CLI tools, tied to Node version |
| **Reinstall** | Globals needed per Node version |

---

## <a name="multi-project-workflow"></a>🔄 Multi-Project Workflow

> **💡 Key Concept:** Each project can use different Node versions and package managers.

### 🎯 Example Scenario

| Project | Node | Package Manager |
| :--- | :---: | :---: |
| Legacy App | 18 | npm |
| Modern API | 20 | pnpm |
| Experimental | 22 | npm |

### 📋 Project Setup

```bash
# Create project
mkdir my-project && cd my-project

# Pin Node version
echo 20 > .nvmrc

# Activate
nvm use (Get-Content .nvmrc)

# Initialize
npm init -y
npm install
```

### 🔄 Switching Projects

```bash
# Project A
cd ~/projects/legacy-app
nvm use (Get-Content .nvmrc)    # → Node 18
npm run dev

# Project B
cd ~/projects/modern-api
nvm use (Get-Content .nvmrc)    # → Node 20
pnpm run dev
```

### 🗂️ Package Managers

**No Conflict:** npm and pnpm can coexist

```bash
# Project with npm
cd project-a
nvm use 20
npm install

# Project with pnpm
cd project-b
nvm use 20
pnpm install
```

### ✅ Best Practices

| ✅ Do | ❌ Don't |
| :--- | :--- |
| Create .nvmrc per project | Forget to run nvm use |
| Document global deps in README | Mix npm and pnpm in same project |
| Use LTS for production | Assume version is correct |

### ✅ Section Summary

| Concept | Key Point |
| :--- | :--- |
| **.nvmrc** | Pin version per project |
| **Switching** | Use `Get-Content .nvmrc` |
| **Isolation** | Each project independent |

---

## <a name="vscode-integration"></a>💻 VS Code Integration

> **💡 Key Concept:** Automate version switching so terminals always use the correct Node version.

### 🔧 Workspace Settings (Recommended)

**Create:** `.vscode/settings.json`

```json
{
  "terminal.integrated.shellArgs.windows": [
    "-NoExit",
    "-Command",
    "nvm use (Get-Content .nvmrc)"
  ]
}
```

**Result:** New terminals auto-run the command

### 📋 Complete Project Setup

```plaintext
my-project/
├── .vscode/
│   └── settings.json    ← Auto nvm use
├── .nvmrc               ← Version (e.g., "20")
├── node_modules/
└── package.json
```

### 🎯 Global Settings (All Projects)

**Edit:** VS Code User Settings (`Ctrl + ,` → settings.json)

```json
{
  "terminal.integrated.profiles.windows": {
    "PowerShell": {
      "source": "PowerShell",
      "args": [
        "-NoExit", 
        "-Command", 
        "if (Test-Path .nvmrc) { nvm use (Get-Content .nvmrc) }"
      ]
    }
  }
}
```

### 🐛 Troubleshooting

**Terminal doesn't switch?**

- ✅ Check `.nvmrc` exists
- ✅ Verify settings.json syntax
- ✅ Ensure PowerShell execution policy allows scripts

### ✅ Section Summary

| Concept | Key Point |
| :--- | :--- |
| **Automation** | Use workspace settings.json |
| **Command** | `nvm use (Get-Content .nvmrc)` |
| **Benefit** | Never manually switch versions |

---

## 📋 Quick Reference

```bash
# Install & Setup
nvm version                      # Verify installation
nvm install 20                   # Install Node 20
nvm use 20                       # Switch to 20

# .nvmrc Usage (Windows)
echo 20 > .nvmrc                 # Create file
nvm use (Get-Content .nvmrc)     # Use it

# Packages
npm install express              # Local
npm install -g nodemon           # Global (per version)

# Info
nvm list                         # Installed versions
nvm current                      # Active version
node -v                          # Node version
```

---

## 🎯 Essential Workflow

```bash
# New Project
mkdir my-project && cd my-project
echo 20 > .nvmrc
nvm use (Get-Content .nvmrc)
npm init -y

# Clone Project
git clone repo-url && cd repo
nvm install
nvm use (Get-Content .nvmrc)
npm install

# Daily Use
cd project
nvm use (Get-Content .nvmrc)
npm run dev
```

---

## ✅ Summary

**NVM for Windows** manages multiple Node.js versions. Install via `nvm-setup.exe`. Each version has isolated global packages.

**Windows Limitation:** Unlike Unix, must use `nvm use (Get-Content .nvmrc)` to read .nvmrc files.

**Package Types:** Local packages (`npm install`) go to project's node_modules. Global packages (`npm install -g`) are per Node version.

**Workflow:** Create `.nvmrc` per project. Use VS Code settings to auto-switch versions. Each project completely isolated.

---
