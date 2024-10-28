# pagos_serializer.py

from rest_framework import serializers
from core.models.pagos_model import Pago
from .tratamientos_serializer import TratamientoSerializer

class PagoSerializer(serializers.ModelSerializer):
    tratamiento = TratamientoSerializer(read_only=True)  # Anida el tratamiento completo

    class Meta:
        model = Pago
        fields = ['id', 'fecha', 'monto', 'paciente_id', 'tratamiento']
