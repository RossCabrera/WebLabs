# Library API

A REST API for managing a library's book inventory built with Django REST Framework. Demonstrates the full DRF stack: serializers, ViewSets, token authentication, search/ordering filters, and custom action endpoints.

---

## What This Covers

- `ModelSerializer` with custom validation
- `ModelViewSet` + `DefaultRouter` for full CRUD
- Token authentication (`TokenAuthentication`)
- `IsAuthenticatedOrReadOnly` permissions
- Search and ordering via `django-filter`
- Custom `@action` endpoints

---

## Getting Started

```bash
cd projects/library_api
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

---

## Get a Token

```bash
curl -X POST http://localhost:8000/api/token/ \
  -d "username=admin&password=yourpassword"
```

---

## Endpoints

| Method | URL | Auth | Description |
| :----- | :-- | :--- | :---------- |
| GET | `/api/books/` | No | List all books |
| POST | `/api/books/` | Yes | Create a book |
| GET | `/api/books/<id>/` | No | Get a book |
| PUT | `/api/books/<id>/` | Yes | Update a book |
| PATCH | `/api/books/<id>/` | Yes | Partial update |
| DELETE | `/api/books/<id>/` | Yes | Delete a book |
| GET | `/api/books/available/` | No | List available books |
| POST | `/api/books/<id>/checkout/` | Yes | Check out a book |
| POST | `/api/books/<id>/return_book/` | Yes | Return a book |

---

## Example Requests

```bash
# List books
curl http://localhost:8000/api/books/

# Create a book
curl -X POST http://localhost:8000/api/books/ \
  -H "Authorization: Token <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Dune", "author": "Frank Herbert", "published_year": 1965, "genre": "sci-fi"}'

# Search
curl "http://localhost:8000/api/books/?search=dune"

# Order by year
curl "http://localhost:8000/api/books/?ordering=published_year"
```
