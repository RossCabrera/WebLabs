from django.urls import path
from . import views

# ============================================================
# REVIEWS APP URL PATTERNS
# All of these are included at the root prefix "" by feedback/urls.py:
#   path('', include("reviews.urls"))
#
# So the final URLs are:
#   /               → ReviewView      (submit a review)
#   /thank-you      → ThankYouView    (success page after submission)
#   /reviews        → ReviewsListView (browse all reviews)
#   /reviews/favorite → AddFavoriteView (POST only — set session favorite)
#   /reviews/<int:pk> → SingleReviewView (detail page for one review)
#
# NOTE: /reviews/favorite must be listed BEFORE /reviews/<int:pk>
# so Django matches the literal "favorite" before trying to cast it as int.
# ============================================================
urlpatterns = [
    path("", views.ReviewView.as_view()),
    path("thank-you", views.ThankYouView.as_view()),
    path("reviews", views.ReviewsListView.as_view()),
    path("reviews/favorite", views.AddFavoriteView.as_view()),  # must come before <int:pk>
    path("reviews/<int:pk>", views.SingleReviewView.as_view()),
]
