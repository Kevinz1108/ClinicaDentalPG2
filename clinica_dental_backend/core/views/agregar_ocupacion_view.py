# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from core.models.ocupacion_model import Ocupacion
@api_view(['POST'])
def agregar_ocupacion(request):
    nombre = request.data.get('nombre')
    if nombre:
        ocupacion, created = Ocupacion.objects.get_or_create(nombre=nombre)
        if created:
            return Response({'message': 'Ocupación agregada correctamente.'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'La ocupación ya existe.'}, status=status.HTTP_200_OK)
    return Response({'error': 'Nombre de ocupación no proporcionado.'}, status=status.HTTP_400_BAD_REQUEST)
