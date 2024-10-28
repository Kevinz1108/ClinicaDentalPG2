from core.models.dentistas_model import Dentista


from rest_framework.decorators import api_view
from core.serializers.dentistas_serializer import DentistaSerializer
from rest_framework.response import Response
from rest_framework import status

# Crear un nuevo dentista
@api_view(['POST'])

def registrar_dentista(request):
    print(request.data) 
    serializer = DentistaSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Obtener la lista de dentistas registrados
@api_view(['GET'])

def obtener_dentistas(request):
    dentistas = Dentista.objects.all()
    serializer = DentistaSerializer(dentistas, many=True)
    return Response(serializer.data)

 # Editar un dentista

@api_view(['PUT'])
def editar_dentista(request, dentista_id):
    try:
        dentista = Dentista.objects.get(id=dentista_id)
    except Dentista.DoesNotExist:
        return Response({'error': 'Dentista no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = DentistaSerializer(dentista, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)