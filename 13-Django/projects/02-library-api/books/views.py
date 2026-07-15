from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Book
from .serializers import BookSerializer


class BookViewSet(viewsets.ModelViewSet):
    """
    CRUD for books.

    list:        GET  /api/books/
    create:      POST /api/books/
    retrieve:    GET  /api/books/{id}/
    update:      PUT  /api/books/{id}/
    partial_update: PATCH /api/books/{id}/
    destroy:     DELETE /api/books/{id}/
    available:   GET  /api/books/available/
    """

    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "author", "genre"]
    ordering_fields = ["title", "published_year"]

    @action(detail=False, methods=["get"])
    def available(self, request):
        books = self.queryset.filter(available=True)
        serializer = self.get_serializer(books, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def checkout(self, request, pk=None):
        book = self.get_object()
        if not book.available:
            return Response({"error": "Book is already checked out."}, status=400)
        book.available = False
        book.save()
        return Response({"status": "checked out", "book": book.title})

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def return_book(self, request, pk=None):
        book = self.get_object()
        book.available = True
        book.save()
        return Response({"status": "returned", "book": book.title})
