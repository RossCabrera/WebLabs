"""
URL configuration for the feedback project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

# NOTE: These two imports are needed to serve uploaded media files during
# development. In production you'd use a proper file server (nginx, S3, etc.)
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Django admin panel
    path('admin/', admin.site.urls),

    # Reviews app — handles: /, /thank-you, /reviews, /reviews/<pk>, /reviews/favorite
    path('', include("reviews.urls")),

    # Profiles app — handles: /profiles (create), /profiles/list (view all)
    # NOTE: This was added to connect the profiles app. Without this line,
    # the /profiles URLs are completely unreachable even though the app is
    # in INSTALLED_APPS (INSTALLED_APPS registers models/templates, not URLs).
    path('profiles/', include("profiles.urls")),
]

# NOTE: static() only adds routes in DEBUG=True mode — safe to leave here.
# It maps MEDIA_URL ("/user_media/") → MEDIA_ROOT (BASE_DIR / "uploads")
# so uploaded profile images can be served in development.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
