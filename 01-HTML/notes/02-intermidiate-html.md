# ✏️ HTML Intermediate Study Notes

## 📚 Table of Contents

- [List Elements](#list-elements)
- [Nesting and Indentation](#nesting-indentation)
- [Anchor Elements](#anchor-elements)
- [Image Elements](#image-elements)

---

## 📋 List Elements {#list-elements}

> **💡 Key Concept:** Lists organize content with **bullets** or **numbers**.

### 🔤 List Types

| Element | Type           | Display        |
| ------- | -------------- | -------------- |
| `<ul>`  | Unordered list | Bullet points  |
| `<ol>`  | Ordered list   | Numbers        |
| `<li>`  | List item      | Single item    |

### 💬 Examples

```html
<ul>
  <li>Apple</li>
  <li>Banana</li>
</ul>

<ol start="3">        <!-- Start from 3 -->
  <li>Item three</li>
  <li>Item four</li>
</ol>
```

### 🧾 Quick Summary

Use proper indentation for readability

---

## 🏗️ Nesting and Indentation {#nesting-indentation}

> **💡 Key Concept:** Nested lists embed one list **inside another** for hierarchy.

### 💬 Example

```html
<ul>
  <li>Fruits
    <ul>
      <li>Apple</li>
      <li>Banana</li>
    </ul>
  </li>
</ul>
```

### 🧾 Quick Summary

Proper indentation improves readability and helps catch missing closing tags

---

## 🔗 Anchor Elements {#anchor-elements}

> **💡 Key Concept:** The `<a>` tag creates **hyperlinks**.

### 🔑 Key Attribute

| Attribute | Purpose          | Example              |
| --------- | ---------------- | -------------------- |
| `href`    | URL or path      | `href="about.html"`  |

### 💬 Examples

```html
<a href="about.html">About Page</a>
<a href="https://example.com">Visit Site</a>
```

### 🧾 Quick Summary

Global attributes (e.g., `draggable`) can be applied to any element

**📖 [MDN: Anchor Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a)**

---

## 🖼️ Image Elements {#image-elements}

> **💡 Key Concept:** The `<img>` tag displays images and is a **void element**.

### 🔑 Key Attributes

| Attribute | Purpose                         | Required  |
| --------- | ------------------------------  | --------  |
| `src`     | Image source (path or URL)      | ✅ Yes    |
| `alt`     | Alternative text (accessibility)| ✅ Yes    |

### 💬 Example

```html
<img src="cat.gif" alt="A playful cat">
```

### 🧾 Quick Summary

- Self-closing void element (no closing tag)
- GIFs, PNGs, JPEGs all work; GIFs animate automatically
- `alt` is essential for screen readers

---

## 🔑 Summary

Intermediate HTML introduces lists, nesting, links, and images.  
Proper use of indentation, attributes, and semantic elements improves readability, accessibility, and maintainability of HTML documents.

---
