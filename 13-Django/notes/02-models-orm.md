# 02 — Models & ORM: Database Design and Queries

---

## 🧠 What is the Django ORM?

> **💡 Key Concept:** The ORM (Object-Relational Mapper) lets you interact with the database using Python objects instead of raw SQL. Each model class maps to a database table.

```plaintext
Python class  →  Database table
Class field   →  Table column
Class instance →  Table row
```

---

## 🏗️ Defining Models

```python
# books/models.py
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.text import slugify

class Book(models.Model):
    # Field types
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    slug = models.SlugField(unique=True, blank=True)
    is_bestselling = models.BooleanField(default=False)
    published_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.rating}/5)"

    class Meta:
        ordering = ["-rating"]
        verbose_name_plural = "Books"
```

### Common Field Types

| Field | Use Case |
| :---- | :------- |
| `CharField(max_length=n)` | Short text |
| `TextField()` | Long text (no max_length) |
| `IntegerField()` | Whole numbers |
| `FloatField()` | Decimal numbers |
| `BooleanField()` | True / False |
| `DateField()` | Date only |
| `DateTimeField()` | Date + time |
| `SlugField()` | URL-friendly string |
| `ImageField()` | File path for images |
| `EmailField()` | Validated email string |

### Common Field Options

| Option | Effect |
| :----- | :----- |
| `null=True` | Allows NULL in DB |
| `blank=True` | Allows empty in forms |
| `default=value` | Sets a default value |
| `unique=True` | Enforces unique constraint |
| `auto_now_add=True` | Set on creation only |
| `auto_now=True` | Update on every save |

---

## 🔗 Relationships

> **💡 Key Concept:** Django relationships are defined on the model that "belongs to" another. The related model gets a reverse manager automatically.

### ForeignKey (Many-to-One)

```python
class Author(models.Model):
    name = models.CharField(max_length=100)
    country = models.ForeignKey(
        "Country",
        on_delete=models.SET_NULL,
        null=True,
        related_name="authors"
    )

class Book(models.Model):
    author = models.ForeignKey(
        Author,
        on_delete=models.CASCADE,
        related_name="books"
    )
```

### OneToOneField

```python
class Address(models.Model):
    street = models.CharField(max_length=80)
    city = models.CharField(max_length=50)

class Author(models.Model):
    name = models.CharField(max_length=100)
    address = models.OneToOneField(
        Address,
        on_delete=models.SET_NULL,
        null=True
    )
```

### ManyToManyField

```python
class Book(models.Model):
    title = models.CharField(max_length=200)
    genres = models.ManyToManyField("Genre", blank=True)
```

### on_delete Options

| Option | Behavior |
| :----- | :------- |
| `CASCADE` | Delete related rows too |
| `SET_NULL` | Set FK to NULL (requires `null=True`) |
| `SET_DEFAULT` | Set FK to default value |
| `PROTECT` | Raise error, prevent deletion |
| `DO_NOTHING` | Do nothing (risky) |

---

## 🔄 Migrations

```bash
# Generate migration files from model changes
python manage.py makemigrations

# Apply pending migrations to the database
python manage.py migrate

# See migration status
python manage.py showmigrations

# See the SQL a migration would run
python manage.py sqlmigrate books 0001
```

> **💡 Key Concept:** Migrations are versioned files that track every change to your models. Always commit them alongside model changes.

---

## 🔍 ORM Queries

### Creating Records

```python
# Method 1 — create() (one step)
book = Book.objects.create(title="Dune", author="Frank Herbert", rating=5)

# Method 2 — save() (two steps, useful when you need the instance first)
book = Book(title="Dune", author="Frank Herbert", rating=5)
book.save()
```

### Reading Records

```python
# All records
books = Book.objects.all()

# Single record (raises DoesNotExist if not found)
book = Book.objects.get(id=1)
book = Book.objects.get(slug="dune")

# Filter (returns QuerySet)
books = Book.objects.filter(rating=5)
books = Book.objects.filter(author__name="Frank Herbert")   # across FK

# Exclude
books = Book.objects.exclude(is_bestselling=False)

# Order
books = Book.objects.all().order_by("title")       # ASC
books = Book.objects.all().order_by("-rating")     # DESC

# Limit / Slice
books = Book.objects.all()[:5]

# Check existence
exists = Book.objects.filter(slug="dune").exists()
```

### Filter Lookups

```python
Book.objects.filter(rating__gte=4)        # rating >= 4
Book.objects.filter(rating__lte=3)        # rating <= 3
Book.objects.filter(title__icontains="d") # case-insensitive contains
Book.objects.filter(title__startswith="D")
Book.objects.filter(published_date__year=2023)
Book.objects.filter(author__isnull=False)
```

### Updating Records

```python
# Single instance
book = Book.objects.get(id=1)
book.rating = 4
book.save()

# Bulk update (efficient, no Python loop)
Book.objects.filter(author="Frank Herbert").update(is_bestselling=True)
```

### Deleting Records

```python
# Single instance
book = Book.objects.get(id=1)
book.delete()

# Bulk delete
Book.objects.filter(rating__lt=2).delete()
```

### Related Manager (Reverse Lookups)

```python
author = Author.objects.get(id=1)

# Get all books for this author (uses related_name="books")
books = author.books.all()
books = author.books.filter(rating__gte=4)

# Count
author.books.count()
```

---

## 🛠️ Django Admin

```python
# books/admin.py
from django.contrib import admin
from .models import Book, Author

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "rating", "is_bestselling")
    list_filter = ("is_bestselling", "rating")
    search_fields = ("title", "author__name")
    prepopulated_fields = {"slug": ("title",)}
```

```bash
python manage.py createsuperuser
# then visit /admin
```

---

## ✅ Section Summary

| Concept | Key Point |
| :------ | :-------- |
| **Models** | Python classes → DB tables. Each field → column. |
| **ForeignKey** | Many-to-one. `on_delete=CASCADE` is the most common. |
| **Migrations** | Auto-generated. Always run `makemigrations` + `migrate` after changes. |
| **QuerySets** | Lazy — evaluated only when iterated. Chain filters freely. |
| **`get()` vs `filter()`** | `get()` raises exception if not found; `filter()` returns empty QuerySet. |
| **Admin** | Register models in `admin.py`. Customize with `list_display`, `search_fields`. |

---
