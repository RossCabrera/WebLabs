from django.db import models


class Book(models.Model):
    GENRE_CHOICES = [
        ("fiction", "Fiction"),
        ("non-fiction", "Non-Fiction"),
        ("sci-fi", "Science Fiction"),
        ("fantasy", "Fantasy"),
        ("biography", "Biography"),
        ("other", "Other"),
    ]

    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    published_year = models.IntegerField()
    genre = models.CharField(max_length=20, choices=GENRE_CHOICES, default="other")
    available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} — {self.author}"

    class Meta:
        ordering = ["title"]
