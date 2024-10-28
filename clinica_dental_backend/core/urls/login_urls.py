from django.urls import path
from core.views.login_view import login_view

urlpatterns = [
    #Login para Dashboard

    path('login/', login_view, name='login'),
]