from rest_framework import serializers
from core.models.dentistas_model import Dentista
from core.models.pacientes_model import Paciente
from core.models.historialMedico_model import HistorialPaciente
from core.models.historialOdontologico_model import Diagnostico
from core.models.radiografias_model import Radiografia
from core.models.tratamientos_model import Tratamiento
from core.models.pagos_model import Pago
from core.models.citas_model import Cita

from core.serializers.historialMedico_serializer import HistorialPacienteSerializer
from core.serializers.dentistas_serializer import DentistaSerializer
from core.serializers.historialOdontologico_serializer import DiagnosticoSerializer
from core.serializers.radiografias_serializer import RadiografiaSerializer
from core.serializers.tratamientos_serializer import TratamientoSerializer
from core.serializers.pagos_serializer import PagoSerializer
from core.serializers.citas_serializer import CitaSerializer


# Datos Informacion de pacientes
class PacienteSerializer(serializers.ModelSerializer):
    odontologo = DentistaSerializer(read_only=True)
    odontologo_id = serializers.PrimaryKeyRelatedField(queryset=Dentista.objects.all(), source='odontologo', write_only=True)

    # Hacer que los campos anidados sean opcionales
    historial_medico = HistorialPacienteSerializer(required=False)
    historial_odontologico = DiagnosticoSerializer(required=False)
    radiografias = RadiografiaSerializer(many=True, required=False)
    tratamientos = TratamientoSerializer(many=True, required=False)
    pagos = PagoSerializer(many=True, required=False)
    citas = CitaSerializer(many=True, required=False)

    class Meta:
        model = Paciente
        fields = [
            'id', 'nombre', 'apellido', 'telefono', 'email', 'direccion',
            'fecha_nacimiento', 'edad', 'genero', 'odontologo', 'odontologo_id',
            'historial_medico', 'historial_odontologico', 'radiografias',
            'tratamientos', 'pagos', 'citas', 'departamento','municipio'
        ]

    def create(self, validated_data):
        # Extraer los datos relacionados, pero con manejo opcional
        historial_medico_data = validated_data.pop('historial_medico', None)
        historial_odontologico_data = validated_data.pop('historial_odontologico', None)
        radiografias_data = validated_data.pop('radiografias', [])
        tratamientos_data = validated_data.pop('tratamientos', [])
        pagos_data = validated_data.pop('pagos', [])
        citas_data = validated_data.pop('citas', [])

        # Crear el paciente
        paciente = Paciente.objects.create(**validated_data)

        # Crear los registros relacionados si existen
        if historial_medico_data:
            HistorialPaciente.objects.create(paciente=paciente, **historial_medico_data)
        if historial_odontologico_data:
            Diagnostico.objects.create(paciente=paciente, **historial_odontologico_data)
        for radiografia_data in radiografias_data:
            Radiografia.objects.create(paciente=paciente, **radiografia_data)
        for tratamiento_data in tratamientos_data:
            Tratamiento.objects.create(paciente=paciente, **tratamiento_data)
        for pago_data in pagos_data:
            Pago.objects.create(paciente=paciente, **pago_data)
        for cita_data in citas_data:
            Cita.objects.create(paciente=paciente, **cita_data)

        return paciente
