# 04 — Django REST Framework (DRF)

---

## 🧠 What is DRF?

> **💡 Key Concept:** Django REST Framework is a toolkit built on top of Django for building Web APIs. Instead of returning HTML templates, your views return JSON (or XML). DRF adds serializers, viewsets, routers, and authentication on top of Django's core.

| Django (standard) | Django + DRF |
| :---------------- | :----------- |
| Views return HTML templates | Views return JSON responses |
| Forms validate HTML input | Serializers validate API input |
| `render()` renders templates | `Response()` returns serialized data |
| Manual URL patterns | Routers auto-generate CRUD URLs |

---

## ⚙️ Setup

```bash
uv add djangorestframework
```

```python
# settings.py
INSTALLED_APPS = [
    ...
    "rest_framework",
]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
}
```

---

## 📦 Serializers

> **💡 Key Concept:** A serializer converts complex Python objects (model instances, QuerySets) to native Python types that can be rendered to JSON — and vice versa (deserializes incoming JSON into validated Python data).

### ModelSerializer (Most Common)

```python
# books/serializers.py
from rest_framework import serializers
from .models import Book, Author

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ["id", "name", "bio"]

class BookSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)          # nested read
    author_id = serializers.PrimaryKeyRelatedField(    # write by ID
        queryset=Author.objects.all(),
        source="author",
        write_only=True
    )

    class Meta:
        model = Book
        fields = ["id", "title", "author", "author_id", "published_year", "genre", "available"]
```

### Custom Validation in Serializers

```python
class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = "__all__"

    def validate_published_year(self, value):
        if value > 2025:
            raise serializers.ValidationError("Year cannot be in the future.")
        return value

    def validate(self, data):
        if data.get("available") and not data.get("published_year"):
            raise serializers.ValidationError("Available books must have a published year.")
        return data
```

---

## 👁️ Views — Three Levels

> **💡 Key Concept:** DRF offers three layers of abstraction. Pick the lowest one that covers your needs. ViewSets are the most concise for standard CRUD.

### Level 1 — `@api_view` (Function-Based)

```python
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Book
from .serializers import BookSerializer

@api_view(["GET", "POST"])
def book_list(request):
    if request.method == "GET":
        books = Book.objects.all()
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET", "PUT", "DELETE"])
def book_detail(request, pk):
    book = get_object_or_404(Book, pk=pk)

    if request.method == "GET":
        return Response(BookSerializer(book).data)

    if request.method == "PUT":
        serializer = BookSerializer(book, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "DELETE":
        book.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
```

### Level 2 — `APIView` (Class-Based)

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

class BookListView(APIView):
    def get(self, request):
        books = Book.objects.all()
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BookDetailView(APIView):
    def get_object(self, pk):
        return get_object_or_404(Book, pk=pk)

    def get(self, request, pk):
        book = self.get_object(pk)
        return Response(BookSerializer(book).data)

    def put(self, request, pk):
        book = self.get_object(pk)
        serializer = BookSerializer(book, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        self.get_object(pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
```

### Level 3 — `ViewSet` + Router (Most Concise)

```python
# books/views.py
from rest_framework import viewsets, permissions, filters
from .models import Book
from .serializers import BookSerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "author__name"]
    ordering_fields = ["published_year", "title"]
```

```python
# books/urls.py
from rest_framework.routers import DefaultRouter
from .views import BookViewSet

router = DefaultRouter()
router.register("books", BookViewSet)

urlpatterns = router.urls
```

```python
# core/urls.py
urlpatterns = [
    path("api/", include("books.urls")),
]
```

**Auto-generated routes from `DefaultRouter`:**

| URL | Method | Action |
| :-- | :----- | :----- |
| `/api/books/` | GET | List all books |
| `/api/books/` | POST | Create a book |
| `/api/books/{id}/` | GET | Retrieve a book |
| `/api/books/{id}/` | PUT | Full update |
| `/api/books/{id}/` | PATCH | Partial update |
| `/api/books/{id}/` | DELETE | Delete a book |

---

## 🔐 Authentication & Permissions

### Token Authentication

```bash
uv add djangorestframework
```

```python
# settings.py
INSTALLED_APPS = [..., "rest_framework.authtoken"]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.TokenAuthentication",
    ],
}
```

```bash
python manage.py migrate    # creates authtoken table
```

```python
# core/urls.py
from rest_framework.authtoken import views as auth_views

urlpatterns = [
    path("api/token/", auth_views.obtain_auth_token),
    ...
]
```

```bash
# Get a token
curl -X POST http://localhost:8000/api/token/ \
  -d "username=admin&password=secret"

# Use the token
curl http://localhost:8000/api/books/ \
  -H "Authorization: Token <your-token>"
```

### Common Permission Classes

| Class | Behavior |
| :---- | :------- |
| `AllowAny` | No restrictions |
| `IsAuthenticated` | Must be logged in |
| `IsAdminUser` | Must be staff/superuser |
| `IsAuthenticatedOrReadOnly` | Read is open, write requires login |

### Custom Permission

```python
from rest_framework.permissions import BasePermission

class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in ("GET", "HEAD", "OPTIONS"):
            return True
        return obj.owner == request.user
```

---

## 📄 Pagination

```python
# settings.py
REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
}
```

Response format with pagination:

```json
{
    "count": 100,
    "next": "http://localhost:8000/api/books/?page=2",
    "previous": null,
    "results": [...]
}
```

---

## 🧩 Custom Actions

```python
from rest_framework.decorators import action
from rest_framework.response import Response

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    @action(detail=False, methods=["get"])
    def available(self, request):
        books = self.queryset.filter(available=True)
        serializer = self.get_serializer(books, many=True)
        return Response(serializer.data)
    # → GET /api/books/available/

    @action(detail=True, methods=["post"])
    def checkout(self, request, pk=None):
        book = self.get_object()
        book.available = False
        book.save()
        return Response({"status": "checked out"})
    # → POST /api/books/{id}/checkout/
```

---

## ✅ Section Summary

| Concept | Key Point |
| :------ | :-------- |
| **Serializer** | Converts model ↔ JSON. Use `ModelSerializer` for model-based APIs. |
| **`@api_view`** | Simplest DRF view — good for one-off endpoints |
| **`APIView`** | Class-based, more control, one method per HTTP verb |
| **`ModelViewSet`** | Full CRUD in ~5 lines; pair with `DefaultRouter` |
| **Router** | Auto-generates all CRUD URLs from a ViewSet |
| **Token auth** | Send `Authorization: Token <token>` header |
| **`IsAuthenticatedOrReadOnly`** | Most common permission for public APIs |
| **`@action`** | Add non-CRUD endpoints to a ViewSet |

---
