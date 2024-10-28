from rest_framework import serializers
from core.models.radiografias_model import Radiografia

class RadiografiaSerializer(serializers.ModelSerializer):
    imagen_url = serializers.SerializerMethodField()

    class Meta:
        model = Radiografia
        fields = ['id', 'paciente', 'imagen', 'fecha_tomada', 'notas', 'nombre_archivo', 'imagen_url']

    def get_imagen_url(self, obj):
        # Verifica que request no sea None antes de usar build_absolute_uri
        request = self.context.get('request')
        if request and obj.imagen:
            return request.build_absolute_uri(obj.imagen.url)
        return None
