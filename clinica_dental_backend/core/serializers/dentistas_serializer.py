from rest_framework import serializers
from core.models.dentistas_model import Dentista

class DentistaSerializer(serializers.ModelSerializer):
    especialidad_nombre = serializers.CharField(source='especialidad.nombre', read_only=True)

    class Meta:
        model = Dentista
        fields = ['id', 'nombre', 'apellido', 'correo', 'telefono', 'colegiado', 'especialidad', 'especialidad_nombre', 'nombre_usuario', 'contrasena', 'roles']
