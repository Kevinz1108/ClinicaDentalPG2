from django.urls import path
from core import views


from core.views.historialMedico_view import crear_actualizar_historial_paciente, obtener_historial_paciente



urlpatterns = [
#Crear o actualizar el historial del paciente por ID
    path('acrear-actualizar-historial-paciente/<int:paciente_id>/', crear_actualizar_historial_paciente, name='crear-historial-paciente'),
    #Obtener el historial del paciente por ID
    path('obtener-historial-paciente/<int:paciente_id>/', obtener_historial_paciente, name='obtener-historial-paciente'),
    

    
]


