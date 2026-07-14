from django.shortcuts import render
from django.views import View
from django.http import HttpResponseRedirect
from django.views.generic.edit import CreateView
from django.views.generic import ListView

from .forms import ProfileForm
from .models import UserProfile

# Create your views here

# ============================================================
# CreateProfileView — handles GET (show form) and POST (save image)
# Built on Django's generic CreateView
#
# NOTE: fields = "__all__" automatically includes all model fields.
#   The UserProfile model only has one field: ImageField(upload_to="images")
#   Files are saved to: MEDIA_ROOT / "images" / <filename>
#
# success_url → where to redirect after a successful upload
# ============================================================
class CreateProfileView(CreateView):
    template_name = "profiles/create_profile.html"
    model = UserProfile
    fields = "__all__"
    # NOTE: redirect to the profiles list after a successful upload
    # The URL prefix "/profiles/" comes from feedback/urls.py:
    #   path('profiles/', include("profiles.urls"))
    success_url = "/profiles/list"


# ============================================================
# ProfilesView — lists all UserProfile objects
# Built on Django's generic ListView
#
# NOTE: context_object_name = "profiles" means the queryset is
#   available as {{ profiles }} inside the template (instead of
#   the default "object_list")
# ============================================================
class ProfilesView(ListView):
    model = UserProfile
    template_name = "profiles/user_profiles.html"
    context_object_name = "profiles"
