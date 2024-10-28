from rest_framework import serializers
from django.contrib.auth.hashers import make_password

from core.models.empleados_model import Empleado
from core.models.empleados_model import Cargo

class EmpleadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empleado
        fields = '__all__'
        extra_kwargs = {
            'contrasena': {'write_only': True, 'required': False},  # No obligatorio en actualizaciones
        }

    def create(self, validated_data):
        # Encriptar la contraseña al crear un nuevo empleado
        if 'contrasena' in validated_data:
            validated_data['contrasena'] = make_password(validated_data['contrasena'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Encriptar la contraseña solo si está presente en los datos enviados
        if 'contrasena' in validated_data:
            validated_data['contrasena'] = make_password(validated_data['contrasena'])
        else:
            validated_data.pop('contrasena', None)  # Eliminar la contraseña si no fue proporcionada
        return super().update(instance, validated_data)

class CargoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cargo
        fields = '__all__'
