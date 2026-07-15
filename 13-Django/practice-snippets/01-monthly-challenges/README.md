# 01 — Monthly Challenges

A simple Django app that serves monthly challenge data through dynamic URL routing and function-based views.

---

## 🎯 What This Covers

- Project and app structure
- URL routing with `path()` and dynamic segments (`<str:month>`, `<int:month>`)
- Function-based views (FBVs)
- `render()`, `HttpResponseRedirect`, `Http404`
- `reverse()` for URL generation
- Template inheritance and Django Template Language (DTL)
- Static files

---

## 🚀 Getting Started

```bash
cd 01-monthly-challenges
python manage.py runserver
```

Visit `http://localhost:8000/challenges/` to see the list of months, then navigate to `/challenges/january/` or `/challenges/1/` to see routing in action.
