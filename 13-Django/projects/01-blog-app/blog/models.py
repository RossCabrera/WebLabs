from django.db import models
from django.core.validators import MinLengthValidator
from django.utils.text import slugify
import uuid

# Create your models here.
class Author(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()

    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    def __str__(self):
        return self.full_name()

class Tag(models.Model):
    caption = models.CharField(max_length=20)

    def __str__(self):
        return self.caption

class Post(models.Model):
    title = models.CharField(max_length=255)
    excerpt = models.CharField(max_length=350)
    image_name = models.CharField(max_length=100)
    date = models.DateField(auto_now_add=True)
    slug = models.SlugField(unique=True)
    content = models.TextField(validators=[MinLengthValidator(100)])
    # Relations
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="posts")
    tags = models.ManyToManyField(Tag)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = f"{slugify(self.title)}-{str(uuid.uuid4())[:5]}"
        super().save(*args, **kwargs)