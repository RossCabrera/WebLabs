# 01 — Django Fundamentals: MVT, URLs, Views & Templates

---

## 🧠 The MVT Pattern

> **💡 Key Concept:** Django follows the MVT (Model–View–Template) pattern. It looks like MVC but Django's View acts as the controller, and the Template handles presentation.

| Layer | Django Component | Responsibility |
| :---- | :--------------- | :------------- |
| **Model** | `models.py` | Data structure and database logic |
| **View** | `views.py` | Business logic, fetches data, decides response |
| **Template** | `.html` files | Presentation — what the user sees |

**Request lifecycle:**

```plaintext
Browser → urls.py → views.py → models.py (if needed) → template → Browser
```

---

## ⚙️ Project Setup

```bash
# Install Django
uv add django

# Create project (the dot keeps manage.py at root level)
django-admin startproject core .

# Create an app
python manage.py startapp challenges
```

### Project Structure

```text
myproject/
├── core/               ← project config (settings, main urls, wsgi)
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
├── challenges/         ← an app (one feature area)
│   ├── migrations/
│   ├── templates/
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── urls.py         ← app-level urls (you create this)
│   └── views.py
└── manage.py
```

> **💡 Key Concept:** A Django **project** is the whole site. A Django **app** is one self-contained feature within it. One project, many apps.

### Register an App

```python
# core/settings.py
INSTALLED_APPS = [
    ...
    "challenges",   # add your app here
]
```

---

## 🌐 URL Routing

> **💡 Key Concept:** Django matches URLs top-to-bottom against `urlpatterns`. The first match wins.

### Project URLs → App URLs

```python
# core/urls.py
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("challenges/", include("challenges.urls")),  # delegate to app
]
```

```python
# challenges/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("<int:month>/", views.monthly_challenge_by_number, name="month-challenge-number"),
    path("<str:month>/", views.monthly_challenge, name="month-challenge"),
]
```

### URL Patterns

| Pattern | Example URL | Captured Value |
| :------ | :---------- | :------------- |
| `<str:name>` | `/challenges/january/` | `"january"` |
| `<int:month>` | `/challenges/3/` | `3` |
| `<slug:slug>` | `/posts/my-first-post/` | `"my-first-post"` |
| `<uuid:id>` | `/users/abc-123/` | UUID object |

### Reverse URL Lookup

```python
from django.urls import reverse

# Instead of hardcoding "/challenges/january/"
url = reverse("month-challenge", args=["january"])
```

---

## 👁️ Views

> **💡 Key Concept:** A view is any callable that takes a `request` and returns a `response`. The simplest are function-based views (FBVs).

### Function-Based Views (FBVs)

```python
from django.shortcuts import render
from django.http import Http404, HttpResponseRedirect
from django.urls import reverse

def index(request):
    months = ["january", "february", "march"]
    return render(request, "challenges/index.html", {
        "months": months
    })

def monthly_challenge(request, month):
    challenges = {"january": "Read a book", "february": "Exercise daily"}
    
    if month not in challenges:
        raise Http404()
    
    return render(request, "challenges/challenge.html", {
        "text": challenges[month],
        "month_name": month.capitalize()
    })

def redirect_by_number(request, month_number):
    months = list(challenges.keys())
    redirect_path = reverse("month-challenge", args=[months[month_number - 1]])
    return HttpResponseRedirect(redirect_path)
```

### Response Types

| Response | When to Use |
| :------- | :---------- |
| `render(request, template, context)` | Render an HTML template |
| `HttpResponseRedirect(url)` | Redirect to another URL |
| `HttpResponse(content)` | Return raw content |
| `raise Http404()` | Trigger a 404 page |
| `JsonResponse(data)` | Return JSON (without DRF) |

---

## 📄 Templates

> **💡 Key Concept:** Django templates use their own language (DTL — Django Template Language). Logic lives in the view, not the template.

### Configure Template Dirs

```python
# core/settings.py
TEMPLATES = [
    {
        ...
        "DIRS": [BASE_DIR / "templates"],   # global templates folder
        "APP_DIRS": True,                   # also looks in app/templates/
    }
]
```

### Template Syntax

```html
<!-- Variables -->
{{ month_name }}
{{ user.username }}

<!-- Filters -->
{{ month_name|upper }}
{{ date|date:"Y-m-d" }}
{{ text|truncatewords:20 }}

<!-- Tags -->
{% if challenge %}
    <p>{{ challenge }}</p>
{% else %}
    <p>No challenge this month.</p>
{% endif %}

{% for month in months %}
    <li><a href="{% url 'month-challenge' month %}">{{ month|capfirst }}</a></li>
{% endfor %}

<!-- URL tag (use this instead of hardcoded paths) -->
<a href="{% url 'month-challenge' 'january' %}">January</a>
```

### Template Inheritance

```html
<!-- templates/base.html -->
<!DOCTYPE html>
<html>
<head>
    <title>{% block title %}My Site{% endblock %}</title>
    {% load static %}
    <link rel="stylesheet" href="{% static 'style.css' %}">
</head>
<body>
    {% block content %}{% endblock %}
</body>
</html>
```

```html
<!-- challenges/templates/challenges/index.html -->
{% extends "base.html" %}

{% block title %}Challenges{% endblock %}

{% block content %}
<ul>
    {% for month in months %}
    <li>{{ month|capfirst }}</li>
    {% endfor %}
</ul>
{% endblock %}
```

### Static Files

```python
# core/settings.py
STATIC_URL = "static/"
```

```html
{% load static %}
<link rel="stylesheet" href="{% static 'challenges/challenges.css' %}">
```

---

## ✅ Section Summary

| Concept | Key Point |
| :------ | :-------- |
| **MVT** | Model = data, View = logic, Template = presentation |
| **Apps** | Self-contained feature modules within a project |
| **URL routing** | `include()` delegates to app urls, `reverse()` avoids hardcoded paths |
| **FBVs** | Functions that take `request`, return `response` |
| **Templates** | DTL for rendering HTML; always extend a base template |
| **Static files** | Use `{% load static %}` + `{% static '...' %}` |

---
