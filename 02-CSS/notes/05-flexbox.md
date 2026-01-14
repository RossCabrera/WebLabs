# ✏️ Flexbox Study Notes

## 📚 Table of Contents

- [🚀 Introduction to Flexbox](#intro)
- [🔧 Flex Container Basics](#flex-basics)
- [➡️ Flex Direction & Axes](#flex-direction)
- [📐 Flex Layout (Parent vs. Child)](#flex-layout)
- [⚖️ Flex Sizing](#flex-sizing)

---

## <a name="intro"></a>🚀 Introduction to Flexbox

> **💡 Key Concept:** Flexbox is a one-dimensional layout system designed to distribute space and align items efficiently within a container, even when their size is unknown or dynamic.

### 🕰️ Evolution of Web Layouts

| Method | Use Case | The Problem |
| :--- | :--- | :--- |
| **Tables** | Real data/reports | Breaks semantic HTML; hard to style. |
| **Inline-block** | Side-by-side items | Whitespace issues; vertical alignment is a nightmare. |
| **Absolute** | Precise placement | Not responsive; breaks the document flow. |
| **Floats** | Text wrapping | Requires "clearfix" hacks; unintuitive for layouts. |
| ✅ **Flexbox** | Modern Layouts | Natural responsiveness; predictable behavior. |

---

## <a name="flex-basics"></a>🔧 Flex Container Basics

When you apply `display: flex` to an element, it becomes a **Flex Container**, and all its direct children become **Flex Items**.

### 🧱 Container Behavior

- **Rule Reset:** Old display rules (block, inline) are ignored for children.
- **Spacing with `gap`:** Provides a much cleaner way to add space between items than using margins.
  - `gap: 10px;` (Fixed)
  - `gap: 1rem;` (Responsive)

### 🔁 `flex` vs `inline-flex`

| Property | Width Behavior |
| :--- | :--- |
| `display: flex;` | Takes full width of the page (like a block). |
| `display: inline-flex;` | Only takes the space needed for its content. |

---

## <a name="flex-direction"></a>➡️ Flex Direction & Axes

> **💡 Key Concept:** Flexbox works on two axes. Understanding which one is the **Main Axis** is the secret to mastering Flexbox.

### 🟦 Main Axis vs 🟥 Cross Axis

| flex-direction | Main Axis (Primary flow) | Cross Axis (Perpendicular) |
| :--- | :--- | :--- |
| **row** (default) | Horizontal (Left → Right) | Vertical (Top → Bottom) |
| **column** | Vertical (Top → Bottom) | Horizontal (Left → Right) |

#### 🧾 Quick Summary

Flexbox properties (like `flex-basis`) always apply along the **Main Axis**. If you change to `column`, your "width" effectively becomes "height."

---

## <a name="flex-layout"></a>📐 Flex Layout (Parent vs. Child)

### 🟦 Parent Properties (The Container)

These control the group behavior.

| Property | Controls... | Values |
| :--- | :--- | :--- |
| `flex-wrap` | Line breaking | `nowrap`, `wrap`, `wrap-reverse` |
| `justify-content` | Main Axis alignment | `center`, `space-between`, `space-evenly` |
| `align-items` | Cross Axis alignment | `stretch`, `center`, `flex-start`, `baseline` |
| `align-content` | Spacing between Rows | `center`, `space-between` (Requires `wrap`) |

### 🟩 Child Properties (The Items)

These control individual item behavior.

- **`order`:** Changes visual order (e.g., `order: 1` moves an item to the end).
- **`align-self`:** Overrides the parent's `align-items` for a single specific item.

---

## <a name="flex-sizing"></a>⚖️ Flex Sizing

> **💡 Key Concept:** Flexbox calculates size based on a priority list.

### 🥇 The Priority Order

1. `min-width` / `max-width` (Overrides everything)
2. `flex-basis` (The starting point)
3. `width` (Ignored if basis is set)
4. Content size (Default)

### 📈 Growing and Shrinking

| Property | Default | Effect |
| :--- | :--- | :--- |
| `flex-grow` | `0` | Allows item to expand to fill empty space. |
| `flex-shrink` | `1` | Allows item to shrink when space is tight. |
| `flex-basis` | `auto` | The initial size before growing/shrinking. |

### ✂️ The Shorthand (Best Practice)

Use the **flex** shorthand instead of individual properties:

```css
flex: [grow] [shrink] [basis];
```

```css
/* Examples */
.item { flex: 1; }       /* grow: 1, shrink: 1, basis: 0 (Equal width) */
.item { flex: 0 0 200px; } /* Fixed size: No grow, no shrink, exactly 200px */
```

---

## 🔗 Useful Resources

- **Practice:** [Flexbox Froggy Game](https://appbrewery.github.io/flexboxfroggy/)
- **Reference:** [CSS-Tricks Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- **Layout Practice:** [Flex Layout Exercise](https://appbrewery.github.io/flex-layout/)
- **Sizing Exercise:** [Flexbox Sizing Exercise](https://appbrewery.github.io/flexbox-sizing-exercise/)

---

## 🧾 Summary

Flexbox replaces old "hacks" like floats and tables with a logic-based system of **Axes**. Use **Parent properties** to arrange the group and **Child properties** to tweak individuals. Always remember: `flex: 1` is the fastest way to make a responsive, equal-width layout.

---
