from django.urls import path
from core.views.agregar_ocupacion_view import agregar_ocupacion

urlpatterns = [
    path('agregar-ocupacion/', agregar_ocupacion, name='agregar_ocupacion'),
   
]