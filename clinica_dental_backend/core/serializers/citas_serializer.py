from rest_framework import serializers
from core.models.citas_model import Cita

class CitaSerializer(serializers.ModelSerializer):
    paciente_nombre = serializers.CharField(source='paciente.nombre', read_only=True)
    odontologo_nombre = serializers.CharField(source='odontologo.nombre', read_only=True)

    class Meta:
        model = Cita
        fields = ['id', 'paciente', 'paciente_nombre', 'odontologo', 'odontologo_nombre', 'tipo_cita', 'fecha_cita', 'hora_inicio', 'hora_fin', 'google_event_id']
        extra_kwargs = {
            'paciente': {'required': True},  # Asegúrate de que es obligatorio
            'odontologo': {'required': True},  # Asegúrate de que es obligatorio
            'tipo_cita': {'required': True},  # Si es obligatorio
            'google_event_id': {'required': False, 'allow_null': True}  # Ejemplo de campo opcional
        }
