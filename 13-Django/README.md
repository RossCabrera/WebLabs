# 13 — Django

Django web framework — from fundamentals to real-world patterns.

## Topics
- Models, views, templates (MVT)
- ORM and migrations
- Forms, authentication, admin
- Django REST Framework
- PostgreSQL integration

## Structure
```
13-Django/
├── notes/          ← concept notes per topic
├── lesson-01/      ← monthly challenges
├── lesson-02/      ← book store / book outlet
├── lesson-03/      ← feedback app (profiles, reviews)
├── lesson-04/      ← in progress
└── projects/
    └── blog_app/
```

## Setup
```bash
mise install                  # activates pinned Python version
uv sync                       # installs dependencies
mise run db                   # starts PostgreSQL container (when needed)
python manage.py migrate      # from inside a lesson folder
python manage.py runserver
```

## Database
- SQLite for basic lessons (auto, no setup)
- PostgreSQL via `docker-compose.dev.yml` for lessons that practice DB integration
