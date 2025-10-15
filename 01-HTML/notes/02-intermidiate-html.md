# ✏️ Topic: Intermediate HTML

## 🌟 Cues / Questions  

- How do unordered and ordered lists work in HTML?  
- How does nesting affect readability and structure?  
- What is the purpose of anchor (`<a>`) elements and their attributes?  
- How do image (`<img>`) elements work and why is `alt` important?  

---

## 📝 Notes  

### 📋 List Elements  

- `<ul>` → unordered list (bullet points)  
- `<ol>` → ordered list (numbers or letters)  
- `<li>` → list item inside `<ul>` or `<ol>`  
- Use proper indentation to **improve readability**  
- Ordered lists can use `start` attribute to define starting number  
- **Example:**

```html
    <ol start="3">
    <li>Item three</li>
    <li>Item four</li>
    </ol>
```

### 🏗️ Nesting and Indentation

- **Nested lists:** embed a list inside a `<li>` of another list
- Proper indentation helps **readability and debugging**
- Editors like Visual Studio Code auto-indent nested lists
- Indentation also helps catch **missing closing tags**
- **Example:**
  
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

### 🔗 Anchor Elements (<a>)

- Used to create **hyperlinks**
- **Key attribute:** `href` → URL or path the link points to
- Global attributes (e.g., `draggable`) can be applied to any element
- **Example:**

```html
<a href="about.html">About Page</a>
```

- [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a)

### 🖼️ Image Elements (`<img>`)

- Adds images to a webpage
- Key attributes:
  - `src` → image source (file path or URL)
  - `alt` → descriptive text for accessibility (screen readers)
- `<img>` is a self-closing void element; no closing tag required
- GIFs, PNGs, JPEGs all work the same; GIFs animate automatically
- **Example:**

```html
<img src="cat.gif" alt="A playful cat">
```

---

## 🔑 Summary

Intermediate HTML introduces lists, nesting, links, and images.
Proper use of indentation, attributes, and semantic elements improves readability, accessibility, and maintainability of HTML documents.

---
