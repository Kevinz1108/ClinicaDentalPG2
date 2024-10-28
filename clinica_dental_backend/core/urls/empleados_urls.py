from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from core.views.empleados_view import registrar_empleado,lista_empleados,editar_empleado,eliminar_empleado,crear_cargo,lista_cargos,editar_cargo,eliminar_cargo


urlpatterns = [
#Registrar Empleado
    path('registrar-empleado/', registrar_empleado, name='registrar_empleado'),
    #Registrar Empleado
    path('empleados/', lista_empleados, name='lista_empleados'),
    #Editar Empleado
    path('empleados/<int:id>/editar/', editar_empleado, name='editar_empleado'),
    #Eliminar Empleado
    path('empleados/<int:id>/eliminar/', eliminar_empleado, name='eliminar_empleado'),

    #Crear Cargos
    path('cargos/crear/', crear_cargo, name='crear_cargo'),
    #Ver lista de Cargos
    path('cargos/', lista_cargos, name='lista_cargos'),
    #Editar lista de Cargos
    path('cargos/<int:id>/editar/', editar_cargo, name='editar_cargo'),
    #Eliminar lista de Cargos
    path('cargos/<int:id>/eliminar/', eliminar_cargo, name='eliminar_cargo'),

]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)