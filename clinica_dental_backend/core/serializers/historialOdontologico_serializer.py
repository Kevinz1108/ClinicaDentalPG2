from rest_framework import serializers
from core.models.historialOdontologico_model import Diagnostico

# Datos Diagnostico de pacientes
class DiagnosticoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diagnostico
        fields = '__all__'
        

    def create(self, validated_data):
        # Crear el diagnóstico odontológico asignando el paciente después
        paciente = validated_data.pop('paciente', None)  # El paciente será manejado en la vista
        diagnostico = Diagnostico.objects.create(paciente=paciente, **validated_data)
        return diagnostico