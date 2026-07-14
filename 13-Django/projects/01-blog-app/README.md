# Blog App

A full-stack blog built with Django's MVT pattern. Renders a home page with the three latest posts, an all-posts listing, and individual post detail pages — all driven by a relational database with authors, tags, and slugs.

---

## 🎯 What This Covers

- Multi-model design: `Post`, `Author`, `Tag` with `ForeignKey` and `ManyToManyField`
- Auto-generated slugs with UUID suffix to guarantee uniqueness
- `prefetch_related()` for efficient tag queries
- `get_object_or_404()` for clean 404 handling
- Template inheritance with a shared `base.html`
- Per-app and global static files
- Django admin with `list_display`, `list_filter`, `prepopulated_fields`

---

## 🗂️ Data Model

```text
Author ──< Post >── Tag
            │
          slug (auto: slugify(title) + uuid[:5])
          content (min 100 chars)
          image_name
```

---

## 🚀 Getting Started

```bash
cd blog_app
python manage.py migrate
python manage.py loaddata blog/fixtures/initial_data.json
python manage.py runserver
```

> The fixture pre-loads 3 authors, 4 tags, and 5 posts so the app is immediately usable without manual data entry.

To add or edit content, create a superuser and use the admin at `/admin/`:

```bash
python manage.py createsuperuser
```

---

## 📡 Routes

| URL | View | Description |
| :-- | :--- | :---------- |
| `/` | `starting_page` | Home — 3 latest posts |
| `/posts` | `posts` | All posts listing |
| `/posts/<slug>/` | `post_detail` | Single post detail |
