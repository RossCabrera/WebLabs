# 03 — Feedback App

A Django app with two sub-apps (profiles and reviews) demonstrating form handling, ModelForms, validation, and file uploads.

---

## 🎯 What This Covers

- `forms.Form` vs `forms.ModelForm` — both approaches side by side
- Form field types, widgets, and labels
- Built-in validation and custom `clean_<field>()` methods
- Rendering forms in templates with error display
- CSRF protection
- File uploads with `ImageField` and `enctype="multipart/form-data"`
- Media file configuration (`MEDIA_ROOT`, `MEDIA_URL`)

---

## 🚀 Getting Started

```bash
cd 03-feedback-app
python manage.py migrate
python manage.py runserver
```

Visit `http://localhost:8000/reviews/` to submit a review and see form validation in action.
