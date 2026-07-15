# 03 — Forms & Validation

---

## 🧠 Two Approaches to Forms

> **💡 Key Concept:** Django gives you two form classes. Use `forms.Form` when the form is independent of any model. Use `forms.ModelForm` when the form maps directly to a model — it generates fields and handles saving automatically.

| | `forms.Form` | `forms.ModelForm` |
| :- | :----------- | :---------------- |
| **Fields** | Defined manually | Auto-generated from model |
| **Saving** | Manual (`form.cleaned_data` → `Model.save()`) | `form.save()` handles it |
| **Use when** | Custom/computed data | CRUD for a model |

---

## 📝 forms.Form (Manual)

```python
# reviews/forms.py
from django import forms

class ReviewForm(forms.Form):
    user_name = forms.CharField(
        label="Your Name",
        max_length=100,
        error_messages={
            "required": "Your name must not be empty!",
            "max_length": "Please enter a shorter name!"
        }
    )
    review_text = forms.CharField(
        label="Your Feedback",
        widget=forms.Textarea,
        max_length=200
    )
    rating = forms.IntegerField(label="Your Rating", min_value=1, max_value=5)
```

```python
# reviews/views.py
def add_review(request):
    if request.method == "POST":
        form = ReviewForm(request.POST)
        if form.is_valid():
            # Manually save using cleaned_data
            Review.objects.create(
                user_name=form.cleaned_data["user_name"],
                review_text=form.cleaned_data["review_text"],
                rating=form.cleaned_data["rating"]
            )
            return redirect("thank-you")
    else:
        form = ReviewForm()

    return render(request, "reviews/review.html", {"form": form})
```

---

## ⚡ ModelForm (Recommended for CRUD)

```python
# reviews/forms.py
from django import forms
from .models import Review

class ReviewForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = "__all__"          # include all model fields
        # exclude = ["owner_comment"]  # OR use exclude, never both
        labels = {
            "user_name": "Your Name",
            "review_text": "Your Feedback",
            "rating": "Your Rating"
        }
        error_messages = {
            "user_name": {
                "required": "Your name must not be empty!",
                "max_length": "Please enter a shorter name!"
            }
        }
```

```python
# reviews/views.py
def add_review(request):
    if request.method == "POST":
        form = ReviewForm(request.POST)
        if form.is_valid():
            form.save()             # one line — no manual mapping
            return redirect("thank-you")
    else:
        form = ReviewForm()

    return render(request, "reviews/review.html", {"form": form})
```

---

## 🔍 Validation

### Built-in Field Validation

Django validates automatically:
- `required` — non-empty
- `max_length`, `min_length` — for CharField
- `min_value`, `max_value` — for IntegerField, FloatField
- `EmailField`, `URLField` — format checks

### Custom Validation — `clean_<fieldname>()`

```python
class ReviewForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = "__all__"

    def clean_user_name(self):
        name = self.cleaned_data["user_name"]
        if len(name) < 2:
            raise forms.ValidationError("Name must be at least 2 characters.")
        return name
```

### Cross-field Validation — `clean()`

```python
    def clean(self):
        cleaned = super().clean()
        rating = cleaned.get("rating")
        text = cleaned.get("review_text")

        if rating == 1 and not text:
            raise forms.ValidationError("Low ratings require a review text.")

        return cleaned
```

---

## 📄 Rendering Forms in Templates

```html
<!-- Manual field rendering (most control) -->
<form action="" method="POST">
    {% csrf_token %}
    
    {% for field in form %}
        <div class="form-field">
            {{ field.label_tag }}
            {{ field }}
            {% if field.errors %}
                <ul class="errors">
                    {% for error in field.errors %}
                        <li>{{ error }}</li>
                    {% endfor %}
                </ul>
            {% endif %}
        </div>
    {% endfor %}
    
    <button type="submit">Submit</button>
</form>
```

> **💡 Key Concept:** `{% csrf_token %}` is mandatory in every POST form. Django rejects POST requests without it.

### Quick Rendering Options

```html
{{ form.as_p }}       <!-- each field wrapped in <p> -->
{{ form.as_ul }}      <!-- each field as <li> -->
{{ form.as_table }}   <!-- each field as <tr> -->
```

---

## 📁 File Uploads

```python
# models.py
class UserProfile(models.Model):
    user_name = models.CharField(max_length=100)
    image = models.ImageField(upload_to="images/", null=True, blank=True)
```

```python
# settings.py
MEDIA_ROOT = BASE_DIR / "uploads"
MEDIA_URL = "/files/"
```

```python
# core/urls.py
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [...] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

```html
<!-- Template: add enctype for file uploads -->
<form action="" method="POST" enctype="multipart/form-data">
    {% csrf_token %}
    {{ form.as_p }}
    <button type="submit">Upload</button>
</form>
```

```python
# views.py — pass request.FILES for file uploads
form = ProfileForm(request.POST, request.FILES)
```

---

## ✅ Section Summary

| Concept | Key Point |
| :------ | :-------- |
| **forms.Form** | Manual field definition, manual saving |
| **ModelForm** | Auto-generates fields from model, `form.save()` handles the rest |
| **`is_valid()`** | Runs all field and custom validators, populates `cleaned_data` |
| **`clean_<field>()`** | Single-field custom validation |
| **`clean()`** | Cross-field validation |
| **`{% csrf_token %}`** | Required in every POST form |
| **File uploads** | Add `enctype="multipart/form-data"` + pass `request.FILES` |

---
