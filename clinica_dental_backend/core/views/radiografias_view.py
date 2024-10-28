from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from core.models.radiografias_model import Radiografia
from core.models.pacientes_model import Paciente
from core.serializers.radiografias_serializer import RadiografiaSerializer

# Guardar Radiografias

# Subir nueva radiografía
@api_view(['POST'])
def subir_radiografia(request, paciente_id):
    if 'imagen' not in request.FILES:
        return Response({"error": "No se proporcionó ninguna imagen."}, status=status.HTTP_400_BAD_REQUEST)
    
    imagen = request.FILES['imagen']
    
    # Validar el tipo de archivo (ejemplo: solo imágenes)
    if not imagen.content_type.startswith('image/'):
        return Response({"error": "El archivo no es una imagen válida."}, status=status.HTTP_400_BAD_REQUEST)
    
    # Obtener el nombre del archivo
    nombre_archivo = imagen.name  # Extraer el nombre del archivo
    
    notas = request.data.get('notas', 'Sin observaciones')  # Obtén las notas del request
    
    # Crear la nueva radiografía
    radiografia = Radiografia(
        paciente_id=paciente_id, 
        imagen=imagen, 
        notas=notas, 
        nombre_archivo=nombre_archivo  # Guardar el nombre del archivo
    )
    radiografia.save()
    
    # Serializar la respuesta
    serializer = RadiografiaSerializer(radiografia)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

# Listar radiografías de un paciente
@api_view(['GET'])
def listar_radiografias_paciente(request, paciente_id):
    paciente = get_object_or_404(Paciente, id=paciente_id)
    radiografias = Radiografia.objects.filter(paciente=paciente)
    serializer = RadiografiaSerializer(radiografias, many=True, context={'request': request})
    return Response(serializer.data)



# Eliminar radiografía
@api_view(['DELETE'])
def eliminar_radiografia(request, radiografia_id):
    radiografia = get_object_or_404(Radiografia, id=radiografia_id)
    radiografia.delete()
    return Response({"message": "Radiografía eliminada correctamente."}, status=status.HTTP_204_NO_CONTENT)

# Descargar radiografía
@api_view(['GET'])
def descargar_radiografia(request, radiografia_id):
    radiografia = get_object_or_404(Radiografia, id=radiografia_id)
    imagen_url = radiografia.imagen.url
    return Response({"imagen_url": imagen_url})

# Actualizar Detalles Radiografia
@api_view(['PUT'])
def editar_radiografia(request, radiografia_id):
    try:
        radiografia = Radiografia.objects.get(id=radiografia_id)
        
        # Si se envía una nueva imagen, actualiza la imagen
        if 'imagen' in request.FILES:
            radiografia.imagen = request.FILES['imagen']
        
        # Usamos un serializador para actualizar otros campos como 'fecha_tomada' y 'notas'
        serializer = RadiografiaSerializer(radiografia, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=400)
    
    except Radiografia.DoesNotExist:
        return Response({'error': 'Radiografía no encontrada'}, status=404)