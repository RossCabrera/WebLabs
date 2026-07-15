from django.contrib import admin
from .models import Post, Author, Tag

# Register your models here.

class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "date")
    list_filter = ("author", "tags", "date")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "excerpt")


class AuthorAdmin(admin.ModelAdmin):
    list_display = ("first_name", "last_name", "email")


admin.site.register(Post, PostAdmin)
admin.site.register(Author, AuthorAdmin)
admin.site.register(Tag)