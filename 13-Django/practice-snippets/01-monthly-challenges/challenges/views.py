from django.shortcuts import render
from django.http import Http404, HttpResponseNotFound, HttpResponseRedirect
from django.urls import reverse

monthly_challenges = {
    "january": "Read a new book",
    "february": "Exercise 3 times a week",
    "march": "Learn a new programming concept",
    "april": "Write daily journal entries",
    "may": "Wake up early every day",
    "june": "Drink 2 liters of water daily",
    "july": "Build a small project",
    "august": "Practice public speaking",
    "september": "Take an online course",
    "october": "Improve your diet",
    "november": "Practice gratitude daily",
    "december": None
}

# Create your views here.


def index(request):
    months = list(monthly_challenges.keys())

    return render(request, "challenges/index.html", {
        "months": months
    })


def monthly_challenge_by_number(request, month):
    months = list(monthly_challenges.keys())

    if month > len(months):
        raise Http404()

    redirect_month = months[month - 1]
    redirect_path = reverse(
        "month-challenge", args=[redirect_month])  # /challenge/january
    return HttpResponseRedirect(redirect_path)


def monthly_challenge(request, month):
    try:
        challenge_text = monthly_challenges[month]
        return render(request, "challenges/challenge.html", {
            "text": challenge_text,
            "month_name": month.capitalize()
        })
    except:
        raise Http404()
