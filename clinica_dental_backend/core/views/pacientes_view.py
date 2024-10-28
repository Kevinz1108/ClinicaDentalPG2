from core.models.dentistas_model import Dentista
from core.models.pacientes_model import Paciente
from core.models.historialMedico_model import HistorialPaciente
from core.models.historialOdontologico_model import Diagnostico
from core.models.tratamientos_model import Tratamiento
from core.models.radiografias_model import Radiografia
from core.models.pagos_model import Pago
from core.models.citas_model import Cita

from core.serializers.pacientes_serializer import PacienteSerializer
from core.serializers.historialMedico_serializer import HistorialPacienteSerializer
from core.serializers.historialOdontologico_serializer import DiagnosticoSerializer
from core.serializers.tratamientos_serializer import TratamientoSerializer
from core.serializers.radiografias_serializer import RadiografiaSerializer
from core.serializers.pagos_serializer import PagoSerializer
from core.serializers.citas_serializer import CitaSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.http import JsonResponse

# Vista para registrar paciente junto con los datos anidados
@api_view(['POST'])
def registrar_paciente(request):
    # Extraer los datos del request
    paciente_data = request.data

    # Guardar el paciente
    paciente_serializer = PacienteSerializer(data=paciente_data)
    if paciente_serializer.is_valid():
        paciente = paciente_serializer.save()

        # Guardar el historial médico asociado al paciente
        historial_medico_data = paciente_data.get('historial_medico', {})
        historial_medico_data['paciente'] = paciente.id  # Asociamos el historial al paciente
        historial_medico_serializer = HistorialPacienteSerializer(data=historial_medico_data)
        
        if historial_medico_serializer.is_valid():
            historial_medico_serializer.save()
        else:
            return Response(historial_medico_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Guardar el historial odontológico
        historial_odontologico_data = paciente_data.get('historial_odontologico', {})
        historial_odontologico_data['paciente'] = paciente.id  # Asociar al paciente
        historial_odontologico_serializer = DiagnosticoSerializer(data=historial_odontologico_data)
        if historial_odontologico_serializer.is_valid():
            historial_odontologico_serializer.save()
        else:
            return Response(historial_odontologico_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Guardar las radiografías
        radiografias_data = paciente_data.get('radiografias', [])
        for radiografia_data in radiografias_data:
            radiografia_data['paciente'] = paciente.id
            radiografia_serializer = RadiografiaSerializer(data=radiografia_data)
            if radiografia_serializer.is_valid():
                radiografia_serializer.save()
            else:
                return Response(radiografia_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Guardar los tratamientos
        tratamientos_data = paciente_data.get('tratamientos', [])
        for tratamiento_data in tratamientos_data:
            tratamiento_data['paciente'] = paciente.id
            tratamiento_serializer = TratamientoSerializer(data=tratamiento_data)
            if tratamiento_serializer.is_valid():
                tratamiento_serializer.save()
            else:
                return Response(tratamiento_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Guardar los pagos
        pagos_data = paciente_data.get('pagos', [])
        for pago_data in pagos_data:
            pago_data['paciente'] = paciente.id
            pago_serializer = PagoSerializer(data=pago_data)
            if pago_serializer.is_valid():
                pago_serializer.save()
            else:
                return Response(pago_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Guardar las citas
        citas_data = paciente_data.get('citas', [])
        for cita_data in citas_data:
            cita_data['paciente'] = paciente.id
            cita_serializer = CitaSerializer(data=cita_data)
            if cita_serializer.is_valid():
                cita_serializer.save()
            else:
                return Response(cita_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({'message': 'Paciente y sus datos asociados registrados correctamente'}, status=201)
    else:
        return Response(paciente_serializer.errors, status=400)

# Vista para obtener todos los pacientes
@api_view(['GET'])
def obtener_pacientes(request):
    pacientes = Paciente.objects.all()
    serializer = PacienteSerializer(pacientes, many=True)
    return Response(serializer.data)

# Vista para obtener un paciente específico por su ID
def obtener_paciente(request, id):
    paciente = get_object_or_404(Paciente, id=id)
    data = {
        'id': paciente.id,
        'nombre': paciente.nombre,
        'apellido': paciente.apellido,
        'telefono': paciente.telefono,
        'email': paciente.email,
        'fecha_nacimiento': paciente.fecha_nacimiento,
        'genero': paciente.genero,
        'direccion': paciente.direccion,
        # Puedes añadir más campos si es necesario
    }
    return JsonResponse(data)

# Vista para obtener un paciente y actualizar su ficha del paciente.
@api_view(['PUT'])
def actualizar_paciente(request, id):
    try:
        paciente = get_object_or_404(Paciente, id=id)
    except Paciente.DoesNotExist:
        return Response({'error': 'Paciente no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    # Deserializar los datos y validar
    serializer = PacienteSerializer(paciente, data=request.data, partial=True)
    if serializer.is_valid():
        odontologo_id = request.data.get('odontologo_id')  # Obtener el ID del odontólogo del request
        if odontologo_id:
            try:
                odontologo = Dentista.objects.get(id=odontologo_id)
                paciente.odontologo = odontologo  # Vincular el odontólogo con el paciente
            except Dentista.DoesNotExist:
                return Response({'error': 'Odontólogo no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        # Guardar los datos actualizados del paciente
        serializer.save()
        return Response({'message': 'Paciente actualizado con éxito'}, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Eliminar Paciente
@api_view(['DELETE'])
def eliminar_paciente(request, id):
    # Obtener el paciente a eliminar
    paciente = get_object_or_404(Paciente, id=id)

    # Eliminar el paciente
    paciente.delete()

    # Devolver una respuesta de éxito
    return Response({'message': 'Paciente eliminado con éxito'}, status=status.HTTP_200_OK)
