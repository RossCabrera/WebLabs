from django.contrib import admin
from .models import Book


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "published_year", "genre", "available")
    list_filter = ("genre", "available")
    search_fields = ("title", "author")
