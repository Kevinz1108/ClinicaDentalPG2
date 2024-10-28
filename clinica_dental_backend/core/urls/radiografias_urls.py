from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from core.views.radiografias_view import listar_radiografias_paciente,subir_radiografia,eliminar_radiografia,descargar_radiografia,editar_radiografia

urlpatterns = [
#Obtener radiografia por paciente por ID
    path('radiografias/<int:paciente_id>/', listar_radiografias_paciente, name='listar_radiografias'),
    #Subir radiografia por paciente por ID
    path('radiografias/subir/<int:paciente_id>/', subir_radiografia, name='subir_radiografia'),
    #eliminar radiografia por paciente por ID
    path('radiografias/eliminar/<int:radiografia_id>/', eliminar_radiografia, name='eliminar_radiografia'),
    #Descargar radiografia por paciente por ID
    path('radiografias/descargar/<int:radiografia_id>/', descargar_radiografia, name='descargar_radiografia'),
    #Descargar radiografia por paciente por ID
    path('radiografias/editar/<int:radiografia_id>/', editar_radiografia, name='editar_radiografia'),
]

