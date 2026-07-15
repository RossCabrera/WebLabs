from django import forms
from .models import Review

# ============================================================
# APPROACH 1 — Plain forms.Form 
# Use this when the form is NOT tied directly to a model.
# You handle saving manually in the view.
# ============================================================
# class ReviewForm(forms.Form):
#     user_name = forms.CharField(label="Your Name", max_length=100, error_messages={
#         "required": "Your name must not be empty!",
#         "max_length": "Please enter a shorter name!"
#     })
#     review_text = forms.CharField(label="Your Feedback", widget=forms.Textarea, max_length=200)
#     rating = forms.IntegerField(label="Your Rating", min_value=1, max_value=5)


# ============================================================
# APPROACH 2 — ModelForm 
# Generates form fields automatically from the Review model.
# Calling form.save() in the view creates a Review DB row.
#
# fields = "__all__" → include every field on the model
# exclude = ['owner_comment'] → example of how to hide a field
# labels → override the default label text
# error_messages → per-field, per-error-code custom messages
# ============================================================
class ReviewForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = "__all__"
        # exclude = ['owner_comment']   # NOTE: use exclude OR fields, not both
        labels = {
            "user_name": "Your Name",
            "review_text": "Your Feedback",
            "rating": "Your Rating"
        }
        error_messages = {
            "user_name": {
                "required": "Your name must not be empty!",
                "max_length": "Please enter a shorter name!"
            }
        }