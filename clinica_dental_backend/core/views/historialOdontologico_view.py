from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404


from core.models.historialOdontologico_model import Diagnostico
from core.models.pacientes_model import Paciente
from core.serializers.historialOdontologico_serializer import DiagnosticoSerializer


# Obtener diagnóstico del paciente
@api_view(['GET'])
def obtener_diagnostico_paciente(request, paciente_id):
    try:
        diagnostico = Diagnostico.objects.get(paciente__id=paciente_id)
        serializer = DiagnosticoSerializer(diagnostico)
        return Response(serializer.data, status=200)
    except Diagnostico.DoesNotExist:
        return Response({'message': 'No se ha encontrado diagnóstico para este paciente.'}, status=404)

# Crear o actualizar diagnóstico
@api_view(['POST'])
def crear_actualizar_diagnostico_paciente(request, paciente_id):
    paciente = get_object_or_404(Paciente, id=paciente_id)
    try:
        diagnostico = Diagnostico.objects.get(paciente=paciente)
    except Diagnostico.DoesNotExist:
        diagnostico = Diagnostico(paciente=paciente)  # Crear un nuevo diagnóstico si no existe
    
    serializer = DiagnosticoSerializer(diagnostico, data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Diagnóstico guardado con éxito.'}, status=200)
    return Response(serializer.errors, status=400)