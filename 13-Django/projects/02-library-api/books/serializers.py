from rest_framework import serializers
from .models import Book


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ["id", "title", "author", "published_year", "genre", "available", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_published_year(self, value):
        if value < 0 or value > 2025:
            raise serializers.ValidationError("Enter a valid published year.")
        return value
