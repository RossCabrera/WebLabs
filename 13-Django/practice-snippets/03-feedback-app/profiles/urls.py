from django.urls import path
from . import views

# ============================================================
# PROFILES APP URL PATTERNS
# Included under the "/profiles/" prefix from feedback/urls.py:
#   path('profiles/', include("profiles.urls"))
#
# So the final URLs are:
#   /profiles/       → CreateProfileView (upload a profile image)
#   /profiles/list   → ProfilesView      (browse all profiles)
# ============================================================
urlpatterns = [
    path("", views.CreateProfileView.as_view()),
    path("list", views.ProfilesView.as_view()),
]
