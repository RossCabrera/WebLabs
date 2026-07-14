from django.db import models

# ============================================================
# UserProfile Model
# Represents a user profile with a single uploaded image.
#
# Fields:
#   image — ImageField: stores the file path in DB, file on disk
#     upload_to="images" → files go to MEDIA_ROOT / "images" /
#     e.g. uploads/images/photo.jpg
#
# NOTE: ImageField requires the Pillow library to be installed:
#   pip install Pillow
#   Without it, Django raises an error when you try to use ImageField.
#
# NOTE: Django automatically adds an 'id' (BigAutoField) primary key.
# ============================================================
class UserProfile(models.Model):
    id: int  
    image = models.ImageField(upload_to="images")

    def __str__(self):
        # NOTE: __str__ makes this readable in admin and the shell
        return f"UserProfile #{self.id}"