from reviews.models import Review
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.views import View
from django.views.generic.base import TemplateView
from django.views.generic import ListView, DetailView
from django.views.generic.edit import CreateView

from .forms import ReviewForm
from .models import Review

# ============================================================
# APPROACH 1 — MANUAL FORM HANDLING (function-based view)
# This is the most verbose approach. Useful to understand what
# Django's Form classes do under the hood.
# ============================================================
# def review(request):
#   if request.method == 'POST':
#     entered_username = request.POST['username']
#
#     # NOTE: Manual validation — check empty string AND max length
#     if entered_username == "" and len(entered_username) >= 100:
#       return render(request, "reviews/review.html", {
#         "has_error": True
#       })
#     print(entered_username)
#     return HttpResponseRedirect("/thank-you")
#
#   return render(request, "reviews/review.html", {
#     "has_error": False
#   })


# def thank_you(request):
#   return render(request, "reviews/thank_you.html")


# ============================================================
# APPROACH 2 — DJANGO FORMS (function-based view)
# Django's Form class handles validation via is_valid().
# cleaned_data contains validated + sanitized values.
# ============================================================
# def review(request):
#   if request.method == 'POST':
#     form = ReviewForm(request.POST)
#
#     # NOTE: is_valid() runs all field validators + any clean_<field> methods
#     if form.is_valid():
#       print(form.cleaned_data)          # dict of validated data
#       return HttpResponseRedirect("/thank-you")
#
#   else:
#     form = ReviewForm()                 # empty unbound form on GET
#
#   return render(request, "reviews/review.html", {
#     "form": form
#   })


# def thank_you(request):
#   return render(request, "reviews/thank_you.html")


# ============================================================
# APPROACH 3 — CLASS-BASED VIEWS 
# CBVs let Django handle the boilerplate (GET/POST routing,
# form instantiation, validation, saving) automatically.
# ============================================================

class ReviewView(CreateView):
    # NOTE: CreateView automatically handles:
    #   GET  → renders an empty form
    #   POST → validates, saves to DB, redirects to success_url
    model = Review
    form_class = ReviewForm
    template_name = "reviews/review.html"
    success_url = "/thank-you"


class ThankYouView(TemplateView):
    # Simple template view — no model needed
    template_name = "reviews/thank_you.html"

    def get_context_data(self, **kwargs):
        # NOTE: Always call super() first to get the default context dict,
        # then add/override keys. This avoids accidentally losing Django's
        # built-in context variables (e.g. request, view).
        context = super().get_context_data(**kwargs)
        context["message"] = "This works!"   
        return context


class ReviewsListView(ListView):
    template_name = "reviews/review_list.html"
    model = Review
    context_object_name = "reviews"   # available as {{ reviews }} in template

    # NOTE: Uncomment get_queryset() to filter reviews with rating > 4.
    # override get_queryset() whenever you need custom filtering/ordering.
    # def get_queryset(self):
    #     base_query = super().get_queryset()
    #     data = base_query.filter(rating__gt=4)
    #     return data


class SingleReviewView(DetailView):
    template_name = "reviews/single_review.html"
    model = Review
    # NOTE: DetailView looks up the object by <int:pk> from the URL automatically

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Use get_object() to fetch the Review instance by pk from the URL
        loaded_review = self.get_object()
        request = self.request

        # NOTE: Sessions let us store small amounts of data per browser without
        # requiring authentication. The session dict is backed by the DB
        # (django.contrib.sessions is in INSTALLED_APPS).
        favorite_id = request.session.get("favorite_review")

        # Compare as strings because session stores strings
        context["is_favorite"] = favorite_id == str(loaded_review.pk)
        return context


class AddFavoriteView(View):
    # NOTE: Only handles POST — no GET needed (the button is in single_review.html)
    def post(self, request):
        review_id = request.POST["review_id"]

        # Store the favorite review ID in the user's session
        # This persists in the DB until the session expires or is cleared
        request.session["favorite_review"] = review_id

        # Redirect back to the same review's detail page
        return HttpResponseRedirect("/reviews/" + review_id)