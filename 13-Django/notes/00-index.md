# 🐍 Django Complete Guide

> A structured, project-ready reference. From MVT fundamentals to production-ready REST APIs.

---

## 📁 Files in This Guide

| File | Topic |
| :--- | :---- |
| `01-django-fundamentals.md` | MVT pattern, project setup, URL routing, views, templates |
| `02-models-orm.md` | Models, field types, relationships, migrations, ORM queries |
| `03-forms-validation.md` | forms.Form vs ModelForm, validation, file uploads |
| `04-django-rest-framework.md` | DRF, serializers, ViewSets, routers, auth, permissions |

---

## 🧠 Mental Model

```plaintext
Browser / API Client
       ↓
URL Dispatcher (urls.py)
       ↓
View (views.py — the controller)
       ↓           ↓
Model (ORM)    Template (.html) / Serializer (DRF)
       ↓
Database (SQLite / PostgreSQL)
```

---

## ⚡ Quick Reference

```bash
# Start a new project
django-admin startproject core .

# Start a new app
python manage.py startapp myapp

# Migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run dev server
python manage.py runserver

# Django shell
python manage.py shell
```

---

## 🏆 When to Use Django

✅ Full-stack web apps with HTML templates  
✅ REST APIs with Django REST Framework  
✅ Admin-heavy internal tools  
✅ Projects that need a battle-tested ORM  
✅ Rapid prototyping with built-in auth, forms, and admin  

---
