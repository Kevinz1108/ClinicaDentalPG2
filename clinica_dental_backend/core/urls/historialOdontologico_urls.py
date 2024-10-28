from django.urls import path
from core import views
from django.conf import settings
from django.conf.urls.static import static

from core.views.historialOdontologico_view import obtener_diagnostico_paciente,crear_actualizar_diagnostico_paciente



urlpatterns = [
#Obtener diagnostico del paciente por ID
    path('obtener-diagnostico-paciente/<int:paciente_id>/', obtener_diagnostico_paciente, name='obtener_diagnostico_paciente'),
    #Crear-Actualizar diagnostico del paciente por ID
    path('crear-actualizar-diagnostico-paciente/<int:paciente_id>/', crear_actualizar_diagnostico_paciente, name='crear_actualizar_diagnostico_paciente'),
    
    ]

