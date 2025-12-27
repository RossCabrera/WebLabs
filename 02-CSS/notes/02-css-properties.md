# ✏️ Topic: CSS Properties

## 🌟 Cues / Questions

- What are CSS colors and how are they applied?
- How do font properties work and what units should be used?
- How to inspect and debug CSS in Chrome DevTools?
- What is the CSS Box Model and how do margin, padding, and border work?

---

## 📝 Notes

### 🎨 CSS Colors

CSS colors style **text** and **backgrounds** on a webpage.

#### 🧩 CSS Color Properties

1. **Text Color** (`color`)

   ```css
   h1 {
     color: red;
   }
   ```

2. **Background Color** (`background-color`)

   ```css
   body {
     background-color: antiquewhite;
   }
   ```

#### 🎯 CSS Rule Structure

```css
property: value;
```

#### 🏷️ Named Colors

- Examples: `red`, `blue`, `whitesmoke`, `cornflowerblue`
- Easy to use, full list: [MDN Named Colors](https://developer.mozilla.org/en-US/docs/Web/CSS/named-color)

#### 🔢 Hex Colors

- Format: `#RRGGBB` → RGB values

```css
h2 {
  color: #5d3891;
}
```

#### 🎨 Color Palettes

- Recommended: [colorhunt.co](https://colorhunt.co)
- Free, designer-made, with hex codes ready to use

---

### 🔤 CSS Font Properties

#### 📏 Font Size (`font-size`)

**Units:**

- **Pixels (px)** → fixed size
- **Points (pt)** → print size
- **Em (em)** → relative to parent
- **Rem (rem)** ✅ (recommended) → relative to root (`html`)

**Example:**

```css
h1 {
  font-size: 2rem;
}
```

#### 🔁 em vs rem

- `em` → scales with parent
- `rem` → scales with root
- ✅ `rem` avoids unexpected changes in nested elements

#### ⚖️ Font Weight (`font-weight`)

- **Keywords:** `normal`, `bold`
- **Numbers:** `100–900`
- **Relative:** `lighter`, `bolder`

```css
h2 {
  font-weight: 700;
}
```

**📖 Reference:** [MDN Font Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/font)

#### 🖋️ Font Family (`font-family`)

Specify typeface:

```css
body {
  font-family: Helvetica, sans-serif;
}
```

- Multi-word fonts need quotes: `"Times New Roman", serif`
- **Serif** → decorative edges
- **Sans-serif** → clean, modern
- Custom fonts via [Google Fonts](https://fonts.google.com)

#### 📐 Text Alignment (`text-align`)

- Options: `left`, `right`, `center`, `start`, `end` (direction-aware)

```css
p {
  text-align: center;
}
```

**📖 Reference:** [MDN Text Align](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align)

---

### 🔍 Inspecting CSS (Chrome DevTools)

#### 🧰 Chrome Developer Tools

**Open DevTools:**

- Menu → More Tools → Developer Tools
- **Mac:** `Cmd + Option + I`
- **Windows:** `Ctrl + Shift + I`
- `F12` or Right-click → Inspect

#### 🧱 Elements Tab & Styles Panel

- **Elements tab** → HTML structure
- **Styles panel** → applied CSS rules
- Click elements directly or use selector tool

#### ✏️ Live Editing CSS

- Add/edit rules → changes apply instantly
- Toggle rules on/off with checkboxes
- ⚠️ Changes are temporary, do not affect files

#### ⏱️ Temporary Changes

- Only affect local browser session
- Safe to experiment before updating source code

#### 🧠 CSS Overrides & Specificity

- Crossed-out styles → overridden
- Toggle rules to see active styles

#### 🧮 Computed Tab

- Shows final applied styles
- No crossed-out rules, values in RGB/resolved units

#### 📊 CSS Overview

- DevTools → More Tools → CSS Overview
- Shows colors, fonts, and general design stats

#### 🧪 Practice Exercise

**Try it yourself:** [Just Add CSS Exercise](https://appbrewery.github.io/just-add-css/)

Inspect elements, toggle/edit rules, explore Styles & Computed tabs

---

### 📝 CSS Inspection Quiz

**Practice:** [CSS Inspection Exercise](https://appbrewery.github.io/css-inspection)

---

### 📦 CSS Box Model — Margin, Padding & Border

#### 🧱 Elements as Boxes

- Each element is a box
- Control size with `width` and `height`

```css
div {
  width: 200px;
  height: 100px;
}
```

#### 🔲 Border

**Syntax:** `border: thickness style color;`

**Example:**

```css
div {
  border: 30px solid black;
}
```

- Individual sides: `border-top-width`, `border-right-width`

- **Shortcuts:**

  - 1 value → all sides
  - 2 values → top/bottom left/right
  - 4 values → top/right/bottom/left (clockwise)

#### 📏 Padding

Space **inside** the border, between content & border

```css
div {
  padding: 20px;
}
```

- 1–4 values allowed, clockwise

#### 🖼️ Margin

Space **outside** the border, separates elements

```css
div {
  margin: 10px;
}
```

- Two elements with 10px margin → 20px gap

#### 🧩 Visualizing the Box Model

- Use CSS inspector → shows margin, border, padding, content in colors
- Adjust live to see layout changes
- **Interactive demo:** [Box Model Example](https://appbrewery.github.io/box-model/) - Inspect this to see the differences

---

### 📦 Grouping Content with Divs

```html
<div class="box">
  <p>Text</p>
  <img src="image.jpg" />
</div>
```

- `<div>` → invisible container
- Apply `width`, `height`, `padding`, `border`, `margin` to group elements

---

### 🐞 Debugging Tools

**Pesticide Chrome extension** → outlines all boxes

- Shows classes/IDs, helps debug layout

---

## 🔑 Summary

- **CSS colors** → text & background (use named colors or hex)
- **Font properties** → size (use `rem`), weight, family, alignment
- **Chrome DevTools** → inspect & experiment safely with live CSS editing
- **Box model** → content, padding, border, margin (controls spacing & layout)

---

## 🔗 Useful Resources

### 📚 Documentation

- [MDN Named Colors](https://developer.mozilla.org/en-US/docs/Web/CSS/named-color)
- [MDN Font Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/font)
- [MDN Text Align](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align)

### 🎨 Design Tools

- [Color Hunt](https://colorhunt.co) - Color palette inspiration
- [Google Fonts](https://fonts.google.com) - Free web fonts

### 🧪 Practice Exercises

- [Just Add CSS](https://appbrewery.github.io/just-add-css/) - DevTools practice
- [CSS Inspection Exercise](https://appbrewery.github.io/css-inspection) - Find CSS values
- [Box Model Demo](https://appbrewery.github.io/box-model/) - Interactive box model

---
