from django.db import models

# ============================================================
# Review Model
# Represents a single user review stored in the DB.
#
# Fields:
#   user_name   — CharField: short text, max 100 chars
#   review_text — TextField: unlimited text (shown as <textarea>)
#   rating      — IntegerField: validated in the form to be 1–5
#
# NOTE: Django automatically adds an 'id' (BigAutoField) primary key.
#   This pk is used in the URL: /reviews/<int:pk>
# ============================================================
class Review(models.Model):
    user_name = models.CharField(max_length=100)
    review_text = models.TextField()
    rating = models.IntegerField()

    def __str__(self):
        # NOTE: __str__ makes the admin panel and shell much friendlier
        return f"{self.user_name} ({self.rating}/5)"