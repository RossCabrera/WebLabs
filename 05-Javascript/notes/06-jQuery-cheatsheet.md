# 🚀 jQuery Complete Cheat Sheet & Learning Guide

## 🧠 The Mental Model (Remember This First!)

```**jQuery Flow:** Select → Find → Change → Animate → React```

If your code follows this order, you'll rarely get lost.

---

## 📋 Quick Reference Table

| I Want To...              | jQuery                     | Vanilla JS                          |
|---------------------------|----------------------------|-------------------------------------|
| Select one element        | `$(".x")`                  | `document.querySelector(".x")`      |
| Select all elements       | `$(".x")`                  | `document.querySelectorAll(".x")`   |
| Listen for click          | `.click(fn)`               | `.addEventListener("click", fn)`    |
| Reference clicked element | `$(this)`                  | `this` or `e.currentTarget`         |
| Next sibling              | `.next()`                  | `.nextElementSibling`               |
| Previous sibling          | `.prev()`                  | `.previousElementSibling`           |
| Parent                    | `.parent()`                | `.parentElement`                    |
| Children                  | `.children()`              | `.children`                         |
| Find inside               | `.find(".x")`              | `.querySelector(".x")`              |
| Add class                 | `.addClass("x")`           | `.classList.add("x")`               |
| Remove class              | `.removeClass("x")`        | `.classList.remove("x")`            |
| Toggle class              | `.toggleClass("x")`        | `.classList.toggle("x")`            |
| Check if has class        | `.hasClass("x")`           | `.classList.contains("x")`          |
| Change text               | `.text("hi")`              | `.textContent = "hi"`               |
| Change HTML               | `.html("<b>hi</b>")`       | `.innerHTML = "<b>hi</b>"`          |
| Get/set value             | `.val()` / `.val("x")`     | `.value` / `.value = "x"`           |
| Hide                      | `.hide()`                  | `.style.display = "none"`           |
| Show                      | `.show()`                  | `.style.display = "block"`          |

---

## 🎯 DOM Traversal Power

```javascript
$(this).next()       // siguiente hermano
$(this).prev()       // anterior hermano
$(this).parent()     // elemento padre
$(this).children()   // hijos directos
$(this).siblings()   // todos los hermanos
$(this).find(".x")   // buscar dentro
```

**Golden Rule:** If you don't know what to select, start with `$(this)` and navigate!

---

## 🔥 20 Essential Patterns

### 1️⃣ Basic Toggle

**Use for:** Buttons, likes, favorites, dark mode

```javascript
// jQuery
$(".btn").click(function() {
  $(this).toggleClass("active");
});

// Vanilla
document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("click", function() {
    this.classList.toggle("active");
  });
});
```

### 2️⃣ Accordion (FAQ / Panels)

```javascript
// jQuery
$(".question").click(function() {
  var $q = $(this);
  var $a = $q.next();

  $(".answer").not($a).slideUp();
  $(".question").not($q).removeClass("active");

  $a.stop(true, true).slideToggle();
  $q.toggleClass("active");
});

// Vanilla
document.querySelectorAll(".question").forEach(q => {
  q.addEventListener("click", function() {
    const a = this.nextElementSibling;

    document.querySelectorAll(".answer").forEach(ans => {
      if (ans !== a) ans.style.display = "none";
    });

    a.style.display = a.style.display === "block" ? "none" : "block";
  });
});
```

### 3️⃣ Tabs

```javascript
// jQuery
$(".tab").click(function() {
  var index = $(this).index();

  $(".tab").removeClass("active");
  $(this).addClass("active");

  $(".panel").hide().eq(index).fadeIn();
});

// Vanilla
document.querySelectorAll(".tab").forEach((tab, i) => {
  tab.addEventListener("click", function() {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    this.classList.add("active");
    
    document.querySelectorAll(".panel").forEach(p => p.style.display = "none");
    document.querySelectorAll(".panel")[i].style.display = "block";
  });
});
```

### 4️⃣ Modal

```javascript
// jQuery
$(".open").click(function() {
  $(".modal").fadeIn();
});

$(".close").click(function() {
  $(".modal").fadeOut();
});

// Vanilla
document.querySelector(".open").addEventListener("click", () => {
  document.querySelector(".modal").style.display = "block";
});

document.querySelector(".close").addEventListener("click", () => {
  document.querySelector(".modal").style.display = "none";
});
```

### 5️⃣ Dropdown

```javascript
// jQuery
$(".menu-btn").click(function() {
  $(".menu").slideToggle();
});

// Vanilla
document.querySelector(".menu-btn").addEventListener("click", () => {
  const menu = document.querySelector(".menu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
});
```

### 6️⃣ Search Filter

```javascript
// jQuery
$("#search").keyup(function() {
  var value = $(this).val().toLowerCase();

  $(".item").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
  });
});

// Vanilla
document.querySelector("#search").addEventListener("keyup", function() {
  const val = this.value.toLowerCase();

  document.querySelectorAll(".item").forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(val)
      ? "block"
      : "none";
  });
});
```

### 7️⃣ Dark Mode

```javascript
// jQuery
$(".theme").click(function() {
  $("body").toggleClass("dark");
});

// Vanilla
document.querySelector(".theme").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
```

### 8️⃣ Form Validation

```javascript
// jQuery
$("form").submit(function(e) {
  if ($("#email").val() === "") {
    e.preventDefault();
    alert("Email required");
  }
});

// Vanilla
document.querySelector("form").addEventListener("submit", e => {
  if (document.querySelector("#email").value === "") {
    e.preventDefault();
    alert("Email required");
  }
});
```

### 9️⃣ Character Counter

```javascript
// jQuery
$("textarea").keyup(function() {
  var count = $(this).val().length;
  $(".count").text(count + "/200");
});

// Vanilla
document.querySelector("textarea").addEventListener("keyup", function() {
  const count = this.value.length;
  document.querySelector(".count").textContent = count + "/200";
});
```

### 🔟 Scroll Spy

```javascript
// jQuery
$(window).scroll(function() {
  if ($(this).scrollTop() > 100) {
    $(".nav").addClass("sticky");
  }
});

// Vanilla
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    document.querySelector(".nav").classList.add("sticky");
  }
});
```

### 1️⃣1️⃣ Event Delegation (PRO MOVE)

#### **For dynamically created content**

```javascript
// jQuery
$(document).on("click", ".dynamic-btn", function() {
  $(this).toggleClass("active");
});

// Vanilla
document.addEventListener("click", e => {
  if (e.target.matches(".dynamic-btn")) {
    e.target.classList.toggle("active");
  }
});
```

### 1️⃣2️⃣ Fake Loader

```javascript
// jQuery
$(".load").click(function() {
  $(".spinner").show().delay(1000).fadeOut();
});
```

### 1️⃣3️⃣ Save State (LocalStorage)

```javascript
// jQuery
$(".theme").click(function() {
  $("body").toggleClass("dark");
  localStorage.setItem("theme", $("body").hasClass("dark"));
});
```

### 1️⃣4️⃣ Smooth Scroll

```javascript
// jQuery
$("a").click(function(e) {
  e.preventDefault();
  $("html, body").animate({
    scrollTop: $($(this).attr("href")).offset().top
  }, 500);
});
```

### 1️⃣5️⃣ Live Formatting

```javascript
// jQuery
$("#phone").keyup(function() {
  this.value = this.value.replace(/\D/g, "");
});
```

### 1️⃣6️⃣ Hover Effects

```javascript
// jQuery
$(".card").hover(
  function() { $(this).addClass("hover"); },
  function() { $(this).removeClass("hover"); }
);
```

### 1️⃣7️⃣ Clone Elements

```javascript
// jQuery
$(".add").click(function() {
  $(".item:first").clone().appendTo(".list");
});
```

### 1️⃣8️⃣ Visual Reset

```javascript
// jQuery
$(".reset").click(function() {
  $(".box").removeAttr("style").removeClass();
});
```

### 1️⃣9️⃣ Multi-step Form

```javascript
// jQuery
$(".next").click(function() {
  $(".step.active").removeClass("active").next().addClass("active");
});
```

### 2️⃣0️⃣ Global State

```javascript
// jQuery
var isOpen = false;

$(".toggle").click(function() {
  isOpen = !isOpen;
  $(".panel").toggle(isOpen);
});
```

---

## ⚡ PRO Pattern (Use This!)

When something repeats, save it in a variable:

```javascript
$(".question").click(function() {
  var $q = $(this);        // Cache the question
  var $a = $q.next();      // Cache the answer

  $a.slideToggle();
  $q.toggleClass("active");
});
```

**Benefits:**

- More readable
- Faster performance
- More professional

---

## 🧠 Super Mental Map

When you're stuck, ask yourself:

1. **What triggered this?** → `click`, `submit`, `hover`, `keypress`
2. **Where am I?** → `$(this)`
3. **Where do I want to go?** → `next`, `parent`, `find`, `siblings`
4. **What do I want to change?** → `class`, `text`, `css`, `animation`

---

## 🎯 Common Patterns Summary

| **Pattern**          | **Code**                  |
|----------------------|---------------------------|
| Listen for click     | `.click()`                |
| Find something nearby| `.next()`, `.find()`      |
| Change class         | `.toggleClass()`          |
| Animate              | `.slideToggle()`          |
| Prevent bugs         | `.stop()`                 |
| Check if active      | `.hasClass()`             |
| Show/hide            | `.show()`, `.hide()`      |

---

## 🔧 Animation Tips

**Always use `.stop()` to prevent animation bugs with rapid clicks:**

```javascript
$(this).stop(true, true).slideToggle(300);
```

---

## 💡 Key Translation Rules (jQuery → Vanilla)

When translating to Vanilla JS, ask yourself:

1. **One or many?** → `querySelector` vs `querySelectorAll`
2. **What event?** → `addEventListener`
3. **What change?** → `classList`, `style`, `textContent`

---

## 🏆 Classes = Visual States

Think of classes as the element's "mode":

```javascript
.addClass("open")
.removeClass("open")
.toggleClass("open")
.hasClass("open")
```

---

## 🎯 Mini Reference Card

```javascript
// SELECTION
$(".class")          // by class
$("#id")             // by id
$("div")             // by tag
$("[name='x']")      // by attribute

// EVENTS
.click(fn)
.submit(fn)
.keyup(fn)
.hover(fn1, fn2)

// TRAVERSAL
.next()
.prev()
.parent()
.children()
.siblings()
.find()

// MANIPULATION
.addClass()
.removeClass()
.toggleClass()
.hasClass()
.text()
.html()
.val()
.css()

// EFFECTS
.hide()
.show()
.toggle()
.fadeIn()
.fadeOut()
.slideUp()
.slideDown()
.slideToggle()
.stop()
```

---

## 💬 Remember

jQuery isn't "hard" — it just has its own mental language. Once you see it as **flows** (select → navigate → change → animate → react), it becomes almost automatic.

You're not learning syntax, you're learning **relationships between elements**.

---

**🔥 Hot Tip:** If you can build Accordion + Modal + Tabs + Search, you can build 70% of the web's UI. The rest is just better CSS!

---
