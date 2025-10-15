# ✏️ Topic: Introduction to CSS

## 🌟 Cues / Questions  

- What are the three ways to add CSS to HTML?  
- What are the main types of CSS selectors?  
- How does specificity affect which styles are applied?  

---

## 📝 Notes  

### 🎨 Adding CSS to HTML

There are **three ways** to add CSS to an HTML website:

1. **Inline CSS**  
   - Styles a single element directly within its HTML tag.  
   - Example: `<p style="color: red;">Hello World</p>`  

2. **Internal CSS**  
   - Placed inside a `<style>` tag, usually in the `<head>` section.  
   - Example:
  
    ```html
        <style>
        p { color: blue; }
        </style>
    ```

3. **External CSS** *(most common & scalable)*  
   - Written in a separate `.css` file and linked via `<link>` in the `<head>`.  
   - Example:

    ```html
        <link rel="stylesheet" href="style.css">
    ```

---

### 🧩 CSS Selectors

- **Element Selector**  
  - Targets all tags of a type.  
  - Example: `h2 { color: green; }` → all `<h2>` elements  

- **Class Selector**  
  - Targets elements with a specific class.  
  - Example: `.red-text { color: red; }` → elements with `class="red-text"`  

- **ID Selector**  
  - Targets a unique element by ID.  
  - Example: `#main { font-size: 20px; }` → element with `id="main"`  

- **Attribute Selector**  
  - Targets elements with a specific attribute or attribute value.  
  - Example: `p[draggable="false"] { cursor: default; }`  

- **Universal Selector**  
  - Targets **all elements** on the page.  
  - Example: `* { box-sizing: border-box; }`  

- **Specificity**  
  - Determines which style takes precedence when multiple rules apply.  
  - Example: `#main` overrides `.red-text` if both apply to the same element  

---

## 🔑 Summary  

CSS is the **language for styling HTML**, allowing you to control **colors, fonts, layout, and spacing**.  
You can add styles **inline, internally, or externally**, with external stylesheets being the most maintainable.  
CSS selectors let you target elements efficiently, and **specificity** decides which styles are applied when rules conflict.

---
