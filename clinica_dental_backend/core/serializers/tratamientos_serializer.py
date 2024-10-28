from rest_framework import serializers
from core.models.tratamientos_model import TipoTratamiento, Tratamiento, FacturaTratamiento, Especialidad, Categoria
from core.models.pagos_model import Pago

# Serializador para Tipo de Tratamiento
class TipoTratamientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoTratamiento
        fields = ['id', 'nombre', 'precio']

# Serializador para Tratamiento
class TratamientoSerializer(serializers.ModelSerializer):
    tipo_tratamiento = serializers.PrimaryKeyRelatedField(queryset=TipoTratamiento.objects.all())
    tratamiento_nombre = serializers.CharField(source='tipo_tratamiento.nombre', read_only=True)  # Obtener el nombre de TipoTratamiento

    class Meta:
        model = Tratamiento
        fields = ['id', 'tipo_tratamiento', 'tratamiento_nombre', 'cantidad', 'precio_unitario', 'subtotal', 'notas', 'paciente']


# Serializador de Pago
class PagoSerializer(serializers.ModelSerializer):
    tratamiento_id = serializers.IntegerField(source='tratamiento.id', read_only=True)
    tratamiento_nombre = serializers.CharField(source='tratamiento.tipo_tratamiento.nombre', read_only=True)  # Obtener nombre directamente

    class Meta:
        model = Pago
        fields = ['tratamiento_id', 'tratamiento_nombre', 'id', 'paciente', 'fecha', 'monto']

# Serializador de Factura que incluye Tratamientos
class FacturaTratamientoSerializer(serializers.ModelSerializer):
    tratamientos = TratamientoSerializer(many=True)

    class Meta:
        model = FacturaTratamiento
        fields = '__all__'

# Serializador de Especialidad
class EspecialidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Especialidad
        fields = ['id', 'nombre']

# Serializador de Categoría
class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'especialidad']
