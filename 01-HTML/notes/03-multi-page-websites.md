# ✏️ Multi-Page Websites Study Notes

## 📚 Table of Contents

- [🗂️ Computer File Paths](#file-paths)
- [🌐 What Are Webpages?](#webpages)
- [🏗️ HTML Boilerplate](#boilerplate)
- [☁️ Hosting Your Website with GitHub](#github-hosting)

---

## <a name="file-paths"></a>🗂️ Computer File Paths

> **💡 Key Concept:** File paths identify the **exact location** of files or folders on a computer.

### 📊 Path Types

| Type         | Description                   | Example                                 |
| --------     | ----------------------------- | --------------------------------------- |
| **Absolute** | Full path from root directory | `C:/Users/Documents/project/index.html` |
| **Relative** | Path relative to current file | `./images/photo.jpg` or `../about.html` |

### 🧭 Relative Path Symbols

```html
<!-- Current directory -->
./file.html

<!-- Parent directory -->
../folder/file.html
```

### 📋 Key Rules

- **Relative paths are preferred** in web development for portability
- Use `./` for current directory
- Use `../` for parent directory
- Relative paths work across different systems

### 🧾 Quick Summary

```text
./images/logo.png     <!-- Current folder → images → logo.png -->
../about.html         <!-- Parent folder → about.html -->
```

**Best Practice:** Always use relative paths in web projects

---

## <a name="webpages"></a>🌐 What Are Webpages?

> **💡 Key Concept:** Multi-page websites are **multiple HTML files** linked together.

### 🔗 Linking Pages

| Element | Attribute | Purpose |
| ------- | --------- | ------- |
| `<a>` | `href` | Links to other pages |
| `<img>` | `src` | Displays images |

### 💬 Examples

```html
<!-- Link to another page -->
<a href="about.html">About Us</a>

<!-- Display an image -->
<img src="logo.png" alt="Company Logo">

<!-- Clickable image link -->
<a href="about.html">
  <img src="logo.png" alt="About Us">
</a>
```

### 🔧 Navigation Structure

```html
<!-- Using relative paths -->
<nav>
  <a href="./index.html">Home</a>
  <a href="./about.html">About</a>
  <a href="./contact.html">Contact</a>
</nav>
```

### 🧾 Quick Summary

- Use `<a href="">` to link pages
- Use relative paths for flexibility
- Combine `<a>` and `<img>` for clickable images

---

## <a name="boilerplate"></a>🏗️ HTML Boilerplate

> **💡 Key Concept:** The boilerplate is the **standard starting structure** for all HTML documents.

### 📝 Essential Components

| Component | Purpose |
| --------- | ------- |
| `<!DOCTYPE html>` | Declares HTML5 document type |
| `<html lang="en">` | Root element with language |
| `<head>` | Contains metadata |
| `<body>` | Contains visible content |

### 🔤 Standard Boilerplate

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title</title>
</head>
<body>
  <!-- Your content here -->
</body>
</html>
```

### ✨ VS Code Shortcut

```html
<!-- Type ! and press Enter to auto-generate -->
!
```

### 📋 Key Rules

- **Always start with `<!DOCTYPE html>`**
- Use proper nesting and indentation
- Include charset UTF-8 for character encoding
- Set viewport for responsive design
- Remove deprecated meta tags (like IE compatibility)

### 🧾 Quick Summary

The boilerplate provides structure for every HTML page with proper document declaration, metadata, and content areas.

**📖 [MDN: HTML Document Structure](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Document_and_website_structure)**

---

## <a name="github-hosting"></a>☁️ Hosting Your Website with GitHub

> **💡 Key Concept:** **GitHub Pages** offers free hosting for static websites.

### 🎯 Development vs Hosting

| Stage | Location | Access |
| ----- | -------- | ------ |
| **Local Development** | Your computer | Only you |
| **Web Hosting** | Server online | Everyone |

### 🚀 GitHub Pages Setup

```text
1. Create a public repository
2. Upload your website files
3. Name your main file: index.html
4. GitHub automatically serves it as homepage
```

### 💬 Example Structure

```text
my-website/
├── index.html    ← Main page (required)
├── about.html
├── contact.html
└── images/
    └── logo.png
```

### 📋 Key Requirements

- Repository must be **public**
- Main file must be named **`index.html`**
- All files uploaded to repository
- GitHub automatically renders the site

### 🧾 Quick Summary

GitHub Pages provides free hosting for static sites by uploading files to a public repository with `index.html` as the homepage.

**📖 [GitHub Pages Documentation](https://pages.github.com/)**

---

## 🔑 Summary

Multi-page websites connect multiple HTML files using **relative file paths** for navigation and images.  
Every page starts with the **HTML boilerplate** structure, and **GitHub Pages** makes hosting simple and free.  
Understanding paths, structure, and hosting enables you to build and publish complete websites.

**📖 [MDN Web Docs on HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)**

---
