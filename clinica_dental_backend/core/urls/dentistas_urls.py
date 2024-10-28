from django.urls import path
from core.views.dentistas_view import registrar_dentista,obtener_dentistas,editar_dentista

urlpatterns = [

 #Datos para Dentistas
    #Registrar Dentistas
    path('registrar-dentista/', registrar_dentista, name='registrar_dentista'),
    #Obtener Dentistas
    path('obtener-dentistas/', obtener_dentistas, name='obtener_dentistas'),
    #Editar Dentistas
     path('editar-dentista/<int:dentista_id>/', editar_dentista, name='editar-dentista'),  


     ]


