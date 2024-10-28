from django.urls import path
from core import views
from django.conf import settings


from core.views.pacientes_view import eliminar_paciente,obtener_pacientes,actualizar_paciente,obtener_paciente
from core.views.registrar_paciente_con_historial import registrar_paciente_con_historial

urlpatterns = [
#Datos para Pacientes
    #Registro Pacientes
    path('registrar-paciente/', registrar_paciente_con_historial, name='registrar-paciente'),
    #Obtener todos los Pacientes
    path('obtener-pacientes/', obtener_pacientes, name='obtener-paciente'),
    #Obtener Pacientes por ID
    path('obtener-paciente/<int:id>/', obtener_paciente, name='obtener-paciente'),
    #Actualizar Pacientes por ID
    path('actualizar-paciente/<int:id>/', actualizar_paciente, name='actualizar-paciente'),
    #Eliminar Pacientes por ID
    path('eliminar-paciente/<int:id>/', eliminar_paciente, name='eliminar_paciente'),
    
    

    ]


