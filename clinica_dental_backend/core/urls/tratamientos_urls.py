from django.urls import path


from core.views.tratamientos_view import obtener_tipos_tratamiento,agregar_tipo_tratamiento,obtener_tratamientos_paciente,guardar_tratamiento_paciente,modificar_tratamiento,eliminar_tratamiento
from core.views.tratamientos_view import listar_especialidades,listar_categorias_por_especialidad,listar_tratamientos_por_categoria
urlpatterns = [

    #Obetener los tipos de tratamiento menu desplegable
    path('tipos-tratamiento/', obtener_tipos_tratamiento, name='obtener_tipos_tratamiento'),
    #Agregar tipos de tratamiento menu desplegable
    path('tipos-tratamiento/agregar/', agregar_tipo_tratamiento, name='agregar_tipo_tratamiento'),

    #Obtener Tratamiento del paciente por ID
    path('obtener-tratamientos-paciente/<int:paciente_id>/', obtener_tratamientos_paciente, name='obtener_tratamientos_paciente'),
    #Guardar Tratamiento del paciente por ID
    path('guardar-tratamiento-paciente/<int:paciente_id>/', guardar_tratamiento_paciente, name='guardar_tratamiento_paciente'),
    #Actualizar Tratamiento del paciente por ID
    path('modificar-tratamiento/<int:tratamiento_id>/', modificar_tratamiento, name='modificar_tratamiento'),
    #Eliminar Tratamiento del paciente por ID
    path('eliminar-tratamiento/<int:tratamiento_id>/', eliminar_tratamiento, name='eliminar_tratamiento'),

    #Obtener Especialidad
    path('especialidades/', listar_especialidades, name='obtener_tipos_tratamiento'),
    #Obtener Categoria
    path('categorias/<int:especialidad_id>/', listar_categorias_por_especialidad, name='obtener_tipos_tratamiento'),
    #Obtener tratamientos
    path('tratamientos/<int:categoria_id>/', listar_tratamientos_por_categoria, name='obtener_tipos_tratamiento'),

]

