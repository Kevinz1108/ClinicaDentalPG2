from rest_framework import serializers
from core.models.historialMedico_model import HistorialPaciente
from core.models.pacientes_model import Paciente

#Datos historial de pacientes

class HistorialPacienteSerializer(serializers.ModelSerializer):
    # Asegúrate de no requerir el campo paciente explícitamente, ya que lo crearemos en la vista
    class Meta:
        model = HistorialPaciente
        fields = ['paciente', 'enfermedades_sistemicas', 'alergias', 'detalle_alergia', 
                  'tratamiento_medico', 'detalle_tratamiento', 'motivo_consulta', 'tratamientos_previos','fecha_consulta']
        
        extra_kwargs = {
            'enfermedades_sistemicas': {'required': False},  # Esto hace que no sea obligatorio
            'alergias': {'required': False},
            # Haz esto con los demás campos
        }
    def create(self, validated_data):
        # Obtener el paciente de los datos validados y crear el historial médico
        paciente = validated_data.pop('paciente', None)  # Lo asignaremos en la vista
        historial = HistorialPaciente.objects.create(paciente=paciente, **validated_data)
        return historial
