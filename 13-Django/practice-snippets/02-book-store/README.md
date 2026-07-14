# 02 — Book Store

A Django app that manages a book catalog using the ORM, relational models, and the Django admin panel.

---

## 🎯 What This Covers

- Model definition with field types and validators
- Relationships: `ForeignKey`, `OneToOneField` (Book → Author → Country → Address)
- Slugs and `auto_now_add` / `auto_now` timestamps
- Migrations: `makemigrations` and `migrate`
- ORM queries: `filter`, `get`, `order_by`, `exclude`
- Django admin customization (`list_display`, `search_fields`, `prepopulated_fields`)

---

## 🚀 Getting Started

```bash
cd 02-book-store
python manage.py migrate
python manage.py loaddata book_outlet/fixtures/initial_data.json
python manage.py runserver
```

Visit `http://localhost:8000/` for the book listing and `http://localhost:8000/admin/` to explore and edit the data.

> The fixture pre-loads 4 authors, 5 countries, and 8 books so the app is immediately usable without manual data entry.
