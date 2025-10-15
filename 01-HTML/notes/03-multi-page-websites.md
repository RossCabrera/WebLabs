# ✏️ Topic: Multi-Page Websites

## 🌟 Cues / Questions

- What is the difference between absolute and relative file paths?  
- How do we link multiple pages together?  
- What is an HTML boilerplate and why is it important?  
- How can I host a website for free using GitHub?

---

## 📝 Notes

### 🗂️ Computer File Paths

- File paths identify the exact **location of files or folders** on a computer.  
- **Absolute paths** start from the root directory and include the full path.  
- **Relative paths** are written **relative to the current file’s location**, making them more flexible for web projects.  
- Use:
  - `./` → current directory  
  - `../` → parent directory  
- Relative paths are **preferred in web development** for better portability.

---

### 🌐 What Are Webpages?

- A multi-page website is made of **multiple HTML files** linked together through navigation.  
- The anchor tag `<a>` uses the `href` attribute to **link to other pages**.  
- The image tag `<img>` uses the `src` attribute to **display images**.  
- Combining both lets you create **clickable image links**:  
  `<a href="about.html"><img src="logo.png" alt="About Us"></a>`  
- Understanding **relative file paths** ensures links and images work correctly within folders.

---

### 🏗️ HTML Boilerplate

- The **HTML boilerplate** is the standard starting structure for all HTML documents.  
- Key parts include:
  - `<!DOCTYPE html>` → declares the document type (HTML5).  
  - `<html lang="en">` → root element, defines the language.  
  - `<head>` → holds metadata (like charset and title).  
  - `<body>` → contains visible page content.  
- Proper **nesting and indentation** make your code more readable.  
- In VS Code, type `!` and press **Enter** to auto-generate the boilerplate.  
- Some older meta tags (like those for IE compatibility) are now deprecated and can be safely removed.

---

### ☁️ Hosting Your Website with GitHub

- **Web hosting** makes your site accessible online by placing files on a server.  
- During **local development**, files are only visible on your own computer.  
- **GitHub Pages** offers free hosting for static websites:  
  1. Create a **public repository**.  
  2. Upload your website files.  
  3. Ensure your main file is named **`index.html`**.  
- GitHub automatically renders this as your site’s homepage.

---

## 🔑 Summary

Multi-page websites use multiple linked HTML files organized through proper **file paths**.  
The **HTML boilerplate** provides the foundation for every page, and **GitHub Pages** makes it easy to host your projects online for free.  
Understanding how pages connect and how hosting works is key to building complete, real-world websites.
