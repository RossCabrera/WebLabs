# 04 — DRF Basics

A minimal Django REST Framework API for managing posts. Focuses on the core DRF building blocks: serializers, ViewSets, and the DefaultRouter — no authentication, no custom actions, just the essentials.

---

## What This Covers

- DRF installation and setup
- `ModelSerializer` — converting a model to/from JSON
- `ModelViewSet` — full CRUD with minimal code
- `DefaultRouter` — auto-generated URL patterns
- Browsable API

---

## Getting Started

```bash
cd 04-drf-basics/posts_api
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

Visit `http://localhost:8000/api/` to see the browsable API root, then `http://localhost:8000/api/posts/` to interact with the posts endpoint.

---

## Endpoints

| Method | URL | Action |
| :----- | :-- | :----- |
| GET | `/api/posts/` | List all posts |
| POST | `/api/posts/` | Create a post |
| GET | `/api/posts/<id>/` | Retrieve a post |
| PUT | `/api/posts/<id>/` | Full update |
| PATCH | `/api/posts/<id>/` | Partial update |
| DELETE | `/api/posts/<id>/` | Delete a post |
