# ✏️ HTML Introduction Study Notes

## 📚 Table of Contents

- [Heading Elements](#heading-elements)
- [Paragraph Element](#paragraph-element)
- [Void Elements](#void-elements)

---

## 🏷️ Heading Elements {#heading-elements}

> **💡 Key Concept:** Headings define **content hierarchy** from most to least important.

### 📊 Heading Levels

| Tag    | Importance | Use Case                       |
| ------ | ---------- | ---------------------------    |
| `<h1>` | Highest    | Main page title (one per page) |
| `<h2>` | High       | Section headings               |
| `<h3>` | Medium     | Subsection headings            |
| `<h4>` | Lower      | Sub-subsections                |
| `<h5>` | Lower      | Minor headings                 |
| `<h6>` | Lowest     | Least important                |

### ✨ Best Practices

```html
<!-- ✅ Correct hierarchy -->
<h1>Main Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>

<!-- ❌ Avoid skipping levels -->
<h1>Main Title</h1>
<h4>Don't skip to h4</h4>
```

### 📋 Key Rules

- **Always use one `<h1>` per page** for accessibility and SEO
- Don't skip heading levels (e.g., `<h1>` → `<h3>`)
- Use headings for structure, not styling

### 🧾 Quick Summary

```html
<h1>Page Title</h1>        <!-- One per page -->
<h2>Section Heading</h2>   <!-- Main sections -->
<h3>Subsection</h3>        <!-- Subdivisions -->
```

**📖 [MDN: Heading Elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements)**

---

## 📄 Paragraph Element {#paragraph-element}

> **💡 Key Concept:** The `<p>` tag structures text into **readable paragraphs**.

### 🎯 Purpose

| Without `<p>` | With `<p>` |
| ------------- | ---------- |
| All text in one block | Separated, readable paragraphs |
| Hard to navigate | Screen reader accessible |
| Poor readability | Clear content structure |

### 💬 Example

```html
<!-- ❌ Without paragraphs -->
Welcome to our site. We offer great services. Contact us today.

<!-- ✅ With paragraphs -->
<p>Welcome to our site.</p>
<p>We offer great services.</p>
<p>Contact us today.</p>
```

### 🔧 Placeholder Text Tools

- **[Lorem Ipsum](https://www.lipsum.com/)** - Classic placeholder text
- **[Bro Ipsum](https://www.broipsum.com/)** - Fun developer variant

### 🧾 Quick Summary

```html
<p>First paragraph of text.</p>
<p>Second paragraph of text.</p>
```

**Benefits:** Improves readability and accessibility

---

## ⚙️ Void Elements {#void-elements}

> **💡 Key Concept:** Void elements are **self-closing tags** that don't contain content.

### 📝 Common Void Elements

| Element  | Purpose                | Example                    |
| -------- | ---------------------- | -------------------------- |
| `<br />` | Line break             | `Line one<br />Line two`   |
| `<hr />` | Horizontal separator   | `Section 1<hr />Section 2` |

### 🔤 Syntax

```html
<!-- Void element syntax -->
<br />
<hr />

<!-- NOT like regular tags -->
<p>Content here</p>
```

### 🔤 Usage Examples

```html
<!-- Line breaks within text -->
<p>
  First line<br />
  Second line<br />
  Third line
</p>

<!-- Section separator -->
<section>First section content</section>
<hr />
<section>Second section content</section>
```

### 🔍 Key Differences

| Regular Elements | Void Elements |
| ---------------- | ------------- |
| Opening & closing tags | Self-closing |
| Can contain content | No content |
| `<p>Text</p>` | `<br />` |

### 🧾 Quick Summary

```html
<br />  <!-- Line break -->
<hr />  <!-- Horizontal line -->
```

**Use for:** Structure without content

---

## 🔑 Summary

HTML structures and organizes web content using elements.  
Headings define hierarchy, paragraphs separate blocks of text, and void elements add structure without content.  
Understanding these basics creates the foundation for building well-structured, accessible web pages.

**📖 [MDN Web Docs on HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)**

---
