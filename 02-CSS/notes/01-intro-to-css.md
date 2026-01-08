# ✏️ CSS Introduction Study Notes

## 📚 Table of Contents

- [🎨 Adding CSS to HTML](#adding-css)
- [🧩 CSS Selectors](#selectors)
- [⚖️ Specificity](#specificity-link)
- [📦 Box Model & Box-Sizing](#box-model)

---

## <a name="adding-css"></a>🎨 Adding CSS to HTML

> **💡 Key Concept:** There are **three ways** to add CSS to HTML.

### 🧵 CSS Integration Methods

| Method       | Location                      | Use Case                        |
| ------------ | ----------------------------- | --------------------------------|
| **Inline**   | In HTML tag                   | Quick single-element styles     |
| **Internal** | `<style>` in `<head>`         | Single-page styling             |
| **External** | Separate `.css` file          | ✅ **Production (most common)** |

#### 🧪 Examples

```html
<!-- 1. Inline CSS -->
<p style="color: red;">Hello World</p>

<!-- 2. Internal CSS -->
<style>
  p { color: blue; }
</style>

<!-- 3. External CSS (recommended) -->
<link rel="stylesheet" href="style.css">
```

### 🧾 Quick Summary

```html
<!-- Best practice: External CSS -->
<head>
  <link rel="stylesheet" href="style.css">
</head>
```

---

## <a name="selectors"></a>🧩 CSS Selectors

### 🎯 Selector Types

| Selector       | Syntax              | Targets                        | Example                        |
| -------------- | ------------------- | ------------------------------ | -------------------------------|
| **Element**    | `element`           | All tags of a type             | `h2 { color: green; }`         |
| **Class**      | `.classname`        | Elements with specific class   | `.red-text { color: red; }`    |
| **ID**         | `#idname`           | Unique element by ID           | `#main { font-size: 20px; }`   |
| **Attribute**  | `[attribute]`       | Elements with attribute        | `p[draggable="false"] { }`     |
| **Universal**  | `*`                 | All elements                   | `* { box-sizing: border-box; }`|

### 🧾 Quick Summary

```css
/* Common selector patterns */
h2 { color: green; }                  /* Element */
.red-text { color: red; }             /* Class */
#main { font-size: 20px; }            /* ID */
p[draggable="false"] { cursor: default; } /* Attribute */
* { box-sizing: border-box; }         /* Universal */
```

---

## <a name="specificity-link"></a>⚖️ Specificity

> **💡 Key Concept:** Specificity determines which style takes precedence when multiple rules apply.

### 🧮 Specificity Calculation

Specificity is calculated as **(a, b, c, d)**:

| Level | What Counts                           | Example                            | Value       |
| ----- | ------------------------------------- | --------------------------------   | ----------- |
| **a** | Inline styles                         | `<div style="color:red;">`         | (1,0,0,0)   |
| **b** | IDs                                   | `#header`                          | (0,1,0,0)   |
| **c** | Classes, attributes, pseudo-classes   | `.menu`, `[type="text"]`, `:hover` | (0,0,1,0)   |
| **d** | Elements and pseudo-elements          | `div`, `p`, `::before`             | (0,0,0,1)   |

**Comparison:** Left to right (a > b > c > d)

### 🧪 Examples

```css
/* Specificity values */
p { }                          /* (0,0,0,1) - Element */
.highlight { }                 /* (0,0,1,0) - Class */
#main { }                      /* (0,1,0,0) - ID */
```

```html
<p style="color: yellow;">     <!-- (1,0,0,0) - Inline -->
```

**Result:** Inline > ID > Class > Element

### 🧬 Combinations

```css
div p { }                      /* (0,0,0,2) - 2 elements */
.menu li a:hover { }           /* (0,0,3,2) - 3 class/pseudo + 2 elements */
#content .menu li a { }        /* (0,1,2,2) - 1 ID + 2 classes + 2 elements */
```

### 🧾 Quick Summary

- Higher specificity wins
- Compare left to right: (a, b, c, d)
- `!important` overrides specificity (use sparingly)

---

## <a name="box-model"></a>📦 Box Model & Box-Sizing

> **💡 Key Concept:** Every element is a box with content, padding, border, and margin.

### 📐 Box-Sizing Models

| Model            | Width Calculation                  | Total Width Formula                         |
| ---------------- | ---------------------------------- | ------------------------------------------- |
| **content-box**  | Width applies only to content      | Content + Padding + Border                  |
| **border-box**   | Width includes padding & border    | Defined Width (constant) ✅ **Recommended** |

#### 📄 Content-Box (Default)

```css
div {
  width: 200px;
  padding: 20px;
  border: 5px solid;
  /* Total width = 250px */
}
```

#### 📦 Border-Box (Recommended)

```css
* { box-sizing: border-box; }

div {
  width: 200px;
  padding: 20px;
  border: 5px solid;
  /* Total width = 200px (content shrinks) */
}
```

### 🧾 Quick Summary

```css
/* Always add this */
* { box-sizing: border-box; }
```

**Benefits:** Predictable sizing when adding padding or borders

---

## 🔑 Summary

CSS is the **language for styling HTML**, allowing you to control **colors, fonts, layout, and spacing**.  
You can add styles **inline, internally, or externally**, with external stylesheets being the most maintainable.  
CSS selectors let you target elements efficiently, and **specificity** decides which styles are applied when rules conflict.  
Understanding the **box model** and using `box-sizing: border-box` helps create more predictable and maintainable layouts.

---
