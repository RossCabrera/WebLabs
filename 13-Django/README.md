# 🐍 Django

This section covers Django from the ground up — MVT architecture, ORM, forms, and building production-ready REST APIs with Django REST Framework.

---

## 📚 What is Django?

Django is a high-level Python web framework that follows the MVT (Model–View–Template) pattern. It is known for:

- Batteries-included philosophy (ORM, admin, auth, forms out of the box)
- A powerful and intuitive ORM
- Built-in migrations system
- The Django admin panel
- Django REST Framework for API development
- Strong security defaults (CSRF, XSS, SQL injection protection)

It is widely used for full-stack web applications, internal tools, and as the backend for React/mobile frontends via DRF.

---

## 🧠 Learning Stages

### 01 — Django Fundamentals

**File:** `notes/01-django-fundamentals.md`

- MVT pattern and request lifecycle
- Project and app structure
- URL routing (`path`, `include`, `reverse`)
- Function-based views (FBVs)
- Templates and Django Template Language (DTL)
- Static files

**Practice:** `practice-snippets/01-monthly-challenges/`

---

### 02 — Models & ORM

**File:** `notes/02-models-orm.md`

- Model definition and field types
- Relationships (`ForeignKey`, `OneToOne`, `ManyToMany`)
- Migrations
- ORM CRUD: `create`, `get`, `filter`, `update`, `delete`
- Filter lookups and QuerySet chaining
- Related managers and reverse lookups
- Django admin customization

**Practice:** `practice-snippets/02-book-store/`

---

### 03 — Forms & Validation

**File:** `notes/03-forms-validation.md`

- `forms.Form` vs `forms.ModelForm`
- Form fields and widgets
- Built-in and custom validation (`clean_<field>`, `clean`)
- Rendering forms in templates
- CSRF protection
- File uploads (`ImageField`, `enctype="multipart/form-data"`)

**Practice:** `practice-snippets/03-feedback-app/`

---

### 04 — Django REST Framework

**File:** `notes/04-django-rest-framework.md`

- DRF setup and configuration
- `ModelSerializer` — convert models to/from JSON
- `@api_view` — function-based API views
- `APIView` — class-based with per-method handlers
- `ModelViewSet` — full CRUD in minimal code
- `DefaultRouter` — auto-generated CRUD URLs
- Token authentication
- Permissions (`IsAuthenticated`, `IsAuthenticatedOrReadOnly`)
- Filtering, ordering, pagination
- Custom `@action` endpoints

**Practice:** `practice-snippets/04-drf-basics/`

---

## 🧩 Folder Structure

```text
13-Django/
├── notes/
│   ├── 00-index.md
│   ├── 01-django-fundamentals.md
│   ├── 02-models-orm.md
│   ├── 03-forms-validation.md
│   └── 04-django-rest-framework.md
├── practice-snippets/
│   ├── 01-monthly-challenges/    ← URL routing, FBVs, templates
│   ├── 02-book-store/            ← Models, ORM, relationships, admin
│   ├── 03-feedback-app/          ← Forms, ModelForm, file uploads
│   └── 04-drf-basics/            ← DRF, ModelSerializer, ViewSet, Router
├── projects/
│   ├── 01-blog-app/              ← Full-stack blog (models, views, templates)
│   └── 02-library-api/           ← REST API with token auth and custom actions
├── mise.toml
└── README.md
```

---

## 🚀 Projects

### 📝 Blog App

A full-stack blog built with Django's MVT pattern.

**Concepts Applied:**

- Model design with relationships
- Function-based views
- Template inheritance
- Static files and media
- Django admin

---

### 📡 Library API

A REST API for managing a library's book inventory built with Django REST Framework.

**Concepts Applied:**

- `ModelViewSet` + `DefaultRouter` for CRUD
- Token authentication
- Search and ordering filters
- Custom actions (`/available/`, `/checkout/`, `/return_book/`)

---

## ⚙️ Setup

```bash
cd 13-Django
mise install          # activates Python 3.13.3
uv sync               # installs django + djangorestframework

# Run a practice snippet
cd projects/01-blog-app
python manage.py migrate
python manage.py loaddata blog/fixtures/initial_data.json
python manage.py runserver

# Or a practice snippet
cd practice-snippets/04-drf-basics/posts_api
python manage.py migrate
python manage.py runserver

# Run the library API project
cd projects/02-library-api
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

---

## 🎯 Goal

By the end of this module, you will:

- Understand Django's MVT architecture and request lifecycle
- Design relational database schemas using Django models
- Write ORM queries confidently without raw SQL
- Handle form input, validation, and file uploads
- Build REST APIs with DRF that a React frontend can consume
- Apply authentication and permission patterns to protect endpoints

---
