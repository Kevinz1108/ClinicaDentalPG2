from core.models.pacientes_model import Paciente
from core.models.historialMedico_model import HistorialPaciente
from core.serializers.historialMedico_serializer import HistorialPacienteSerializer
from core.serializers.pacientes_serializer import PacienteSerializer
from core.serializers.historialOdontologico_serializer import DiagnosticoSerializer


from rest_framework.decorators import api_view

from rest_framework.response import Response
from rest_framework import status


# Crear paciente y su diagnóstico en un solo paso
@api_view(['POST'])
def registrar_paciente_con_diagnostico(request):
    # Primero creamos al paciente
    paciente_data = {
        'nombre': request.data.get('nombre'),
        'apellido': request.data.get('apellido'),
        'telefono': request.data.get('telefono'),
        'correo': request.data.get('correo'),
        'departamento': request.data.get('departamento'),
        'municipio': request.data.get('municipio'),
        'direccion': request.data.get('direccion'),
        'fecha_nacimiento': request.data.get('fecha_nacimiento'),
        'genero': request.data.get('genero'),
        'odontologo_id': request.data.get('odontologo_id'),
    }

    # Serializar y crear el paciente
    paciente_serializer = PacienteSerializer(data=paciente_data)
    if paciente_serializer.is_valid():
        paciente = paciente_serializer.save()

        # Crear el diagnóstico odontológico y asociarlo al paciente creado
        diagnostico_data = request.data.get('historial_odontologico', {})
        diagnostico_data['paciente'] = paciente.id  # Asignamos el paciente creado
        diagnostico_serializer = DiagnosticoSerializer(data=diagnostico_data)

        if diagnostico_serializer.is_valid():
            diagnostico_serializer.save()
            return Response({
                'message': 'Paciente y diagnóstico odontológico registrados con éxito.',
                'paciente': paciente_serializer.data,
                'diagnostico': diagnostico_serializer.data
            }, status=status.HTTP_201_CREATED)
        else:
            # Si falla el diagnóstico, eliminar el paciente creado para evitar registros incompletos
            paciente.delete()
            return Response(diagnostico_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(paciente_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Crear paciente y su historial médico en un solo paso
@api_view(['POST'])
def registrar_paciente_con_historial(request):
    # Crear el paciente con la información básica
    paciente_data = {
        'nombre': request.data.get('nombre'),
        'apellido': request.data.get('apellido'),
        'telefono': request.data.get('telefono'),
        'correo': request.data.get('correo'),
        'departamento': request.data.get('departamento'),
        'municipio': request.data.get('municipio'),
        'direccion': request.data.get('direccion'),
        'fecha_nacimiento': request.data.get('fecha_nacimiento'),
        'genero': request.data.get('genero'),
        'odontologo_id': request.data.get('odontologo_id'),
    }

    # Serializar y crear el paciente
    paciente_serializer = PacienteSerializer(data=paciente_data)
    if paciente_serializer.is_valid():
        paciente = paciente_serializer.save()

        # Crear el historial médico y asociarlo con el paciente
        historial_data = request.data.get('historial_medico', {})
        historial_serializer = HistorialPacienteSerializer(data=historial_data)

        if historial_serializer.is_valid():
            historial_serializer.save(paciente=paciente)  # Asociamos el paciente creado
            return Response({
                'message': 'Paciente y su historial médico han sido registrados exitosamente.',
                'paciente': paciente_serializer.data,
                'historial_medico': historial_serializer.data
            }, status=status.HTTP_201_CREATED)
        else:
            # Si el historial médico tiene errores, eliminar el paciente
            paciente.delete()
            return Response(historial_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(paciente_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Vista para obtener un paciente y actualizar su ficha historial medica.

@api_view(['POST'])
def crear_actualizar_historial_paciente(request, paciente_id):
    try:
        paciente = Paciente.objects.get(id=paciente_id)
    except Paciente.DoesNotExist:
        return Response({'error': 'Paciente no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
    
    # Intentar obtener el historial existente
    historial = HistorialPaciente.objects.filter(paciente=paciente).first()

    if historial:
        # Si el historial existe, se actualiza
        serializer = HistorialPacienteSerializer(historial, data=request.data)
    else:
        # Si no existe, se crea uno nuevo
        serializer = HistorialPacienteSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save(paciente=paciente)
        return Response({'message': 'Historial del paciente guardado con éxito.'}, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Vista para obtener el historial de un paciente
@api_view(['GET'])
def obtener_historial_paciente(request, paciente_id):
    # Buscar el historial del paciente
    historial = HistorialPaciente.objects.filter(paciente_id=paciente_id)
    
    # Si no hay historial, devolver un mensaje claro
    if not historial.exists():
        return Response({'message': 'No hay historial disponible para este paciente.'}, status=status.HTTP_200_OK)
    
    # Si existe el historial, devolverlo en el formato esperado
    serializer = HistorialPacienteSerializer(historial, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)