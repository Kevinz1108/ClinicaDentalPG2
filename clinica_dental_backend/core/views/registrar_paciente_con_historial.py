from rest_framework import serializers
from datetime import datetime
from core.models.pacientes_model import Paciente
from core.models.historialMedico_model import HistorialPaciente
from core.models.historialOdontologico_model import Diagnostico
from core.models.radiografias_model import Radiografia
from core.models.tratamientos_model import Tratamiento,Categoria
from core.models.pagos_model import Pago
from core.models.citas_model import Cita
from core.serializers.pacientes_serializer import PacienteSerializer
from core.serializers.historialMedico_serializer import HistorialPacienteSerializer
from core.serializers.historialOdontologico_serializer import DiagnosticoSerializer
from core.serializers.radiografias_serializer import RadiografiaSerializer
from core.serializers.tratamientos_serializer import TratamientoSerializer
from core.serializers.pagos_serializer import PagoSerializer
from core.serializers.citas_serializer import CitaSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from rest_framework import serializers
from core.models.pacientes_model import Paciente
from core.models.historialMedico_model import HistorialPaciente
from core.models.historialOdontologico_model import Diagnostico
from core.models.radiografias_model import Radiografia
from core.models.tratamientos_model import Tratamiento
from core.models.pagos_model import Pago
from core.models.citas_model import Cita
from core.serializers.pacientes_serializer import PacienteSerializer
from core.serializers.historialMedico_serializer import HistorialPacienteSerializer
from core.serializers.historialOdontologico_serializer import DiagnosticoSerializer
from core.serializers.radiografias_serializer import RadiografiaSerializer
from core.serializers.tratamientos_serializer import TratamientoSerializer
from core.serializers.pagos_serializer import PagoSerializer
from core.serializers.citas_serializer import CitaSerializer



from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
def registrar_paciente_con_historial(request):
    print("Datos recibidos en el request:", request.data)
    print("Datos recibidos en historial_medico:", request.data.get('historial_medico'))


    

    # Crear el paciente
    paciente_data = {
        'nombre': request.data.get('nombre'),
        'apellido': request.data.get('apellido'),
        'telefono': request.data.get('telefono'),
        'email': request.data.get('email'),
        'departamento': request.data.get('departamento'),
        'municipio': request.data.get('municipio'),
        'direccion': request.data.get('direccion'),
        'fecha_nacimiento': request.data.get('fecha_nacimiento'),
        'genero': request.data.get('genero'),
        'odontologo_id': request.data.get('odontologo_id'),
        'edad': request.data.get('edad'),
        'ocupacion': request.data.get('ocupacion'),
    }

    paciente_serializer = PacienteSerializer(data=paciente_data)
    if not paciente_serializer.is_valid():
        
        return Response(paciente_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    paciente = paciente_serializer.save()
    print("Paciente ID:", paciente.id)
    # Verificar si el paciente tiene un ID asignado
    if not paciente.id:
        print("Error: el paciente no tiene un ID asignado")
        return Response({"error": "No se pudo crear el paciente correctamente"}, status=status.HTTP_400_BAD_REQUEST)


    # Construir el diccionario del historial médico con la fecha formateada
    historial_medico_data = {
        'paciente': paciente.id,
        'enfermedades_sistemicas': request.data.get('historial_medico[enfermedades_sistemicas]'),
        'alergias': request.data.get('historial_medico[alergias]'),
        'detalle_alergia': request.data.get('historial_medico[detalle_alergia]'),
        'tratamiento_medico': request.data.get('historial_medico[tratamiento_medico]'),
        'detalle_tratamiento': request.data.get('historial_medico[detalle_tratamiento]'),
        'motivo_consulta': request.data.get('historial_medico[motivo_consulta]'),
        
        'tratamientos_previos': request.data.get('historial_medico[tratamientos_previos]')
    }

    # Serializar y guardar el historial médico
    historial_medico_serializer = HistorialPacienteSerializer(data=historial_medico_data)
    if not historial_medico_serializer.is_valid():
        print("Errores del serializer Historial Medico:", historial_medico_serializer.errors)
        paciente.delete()  # Si el historial médico falla, eliminar el paciente para evitar inconsistencias
        return Response(historial_medico_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    historial_medico_serializer.save()

# Procesar y guardar el diagnóstico odontológico
    diagnostico_data = {
        'paciente': paciente.id,
        'dientes': request.data.get('historial_odontologico[dientes]', 'Presentes'),
        'notas_dientes': request.data.get('historial_odontologico[notas_dientes]', ''),
        'caries': request.data.get('historial_odontologico[caries]', 'No'),
        'notas_caries': request.data.get('historial_odontologico[notas_caries]', ''),
        'encias': request.data.get('historial_odontologico[encias]', 'Saludables'),
        'notas_encias': request.data.get('historial_odontologico[notas_encias]', ''),
        'maloclusiones': request.data.get('historial_odontologico[maloclusiones]', 'Clase I'),
        'notas_maloclusiones': request.data.get('historial_odontologico[notas_maloclusiones]', ''),
        'lesiones': request.data.get('historial_odontologico[lesiones]', 'Ninguna'),
        'notas_lesiones': request.data.get('historial_odontologico[notas_lesiones]', ''),
        'hueso_maxilar': request.data.get('historial_odontologico[hueso_maxilar]', 'Sano'),
        'notas_hueso_maxilar': request.data.get('historial_odontologico[notas_hueso_maxilar]', ''),
    }

    diagnostico_serializer = DiagnosticoSerializer(data=diagnostico_data)
    if not diagnostico_serializer.is_valid():
        print("Errores del serializer Diagnóstico Odontológico:", diagnostico_serializer.errors)
        paciente.delete()
        return Response(diagnostico_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    diagnostico_serializer.save()



    # Procesar citas
    citas_length = len(request.data.getlist('citas[0][tipo_cita]'))
    for i in range(citas_length):
        cita_data = {
            'tipo_cita': request.data.get(f'citas[{i}][tipo_cita]'),
            'fecha_cita': request.data.get(f'citas[{i}][fecha_cita]'),
            'hora_inicio': request.data.get(f'citas[{i}][hora_inicio]'),
            'hora_fin': request.data.get(f'citas[{i}][hora_fin]'),
            'paciente': paciente.id,
            'odontologo': request.data.get(f'citas[{i}][odontologo_id]'),
        }
        

        cita_serializer = CitaSerializer(data=cita_data)
        if not cita_serializer.is_valid():
            print(f"Errores del serializer Cita para cita {i}:", cita_serializer.errors)
            paciente.delete()  # Si la cita falla, eliminamos el paciente para evitar inconsistencias
            return Response(cita_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        cita_serializer.save()

    # Procesar radiografías
    radiografias = request.FILES.getlist('radiografias[0][imagen]')
    if not radiografias:
        print("No se recibieron radiografías")
    else:
        for i, imagen in enumerate(radiografias):
            radiografia_data = {
                'paciente': paciente.id,
                'imagen': imagen,
                'notas': request.data.get(f'radiografias[{i}][notas]', 'Sin observaciones'),
                'fecha_tomada': request.data.get(f'radiografias[{i}][fecha_tomada]'),
                'nombre_archivo': imagen.name  # Captura el nombre del archivo subido
            }

            radiografia_serializer = RadiografiaSerializer(data=radiografia_data)
            if not radiografia_serializer.is_valid():
                print(f"Errores del serializer Radiografía para radiografía {i}:", radiografia_serializer.errors)
                paciente.delete()  # Si la radiografía falla, eliminamos el paciente para evitar inconsistencias
                return Response(radiografia_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            radiografia_serializer.save()

    especialidad_id = request.data.get('odontologo_id')
    categorias = Categoria.objects.filter(especialidad_id=especialidad_id)

    # Procesar tratamientos y guardar una lista con los tratamientos creados

# Procesar tratamientos y guardar una lista con los tratamientos creados
    tratamientos_creados = []
    tratamientos_length = len(request.data.getlist('tratamientos[0][tipo_tratamiento]'))
    for i in range(tratamientos_length):
        tratamiento_tipo_id = request.data.get(f'tratamientos[{i}][tipo_tratamiento]')
        
        # Asegúrate de que el ID es un entero y que existe un tipo de tratamiento
        if not tratamiento_tipo_id:
            print(f"Error: tipo_tratamiento no encontrado para tratamiento {i}")
            paciente.delete()  # Elimina al paciente si no se puede asignar correctamente el tipo de tratamiento
            return Response({"error": "tipo_tratamiento no proporcionado"}, status=status.HTTP_400_BAD_REQUEST)

        tratamiento_data = {
            'paciente': paciente.id,
            'tipo_tratamiento': int(tratamiento_tipo_id),  # Convertir a entero si está disponible
            'cantidad': request.data.get(f'tratamientos[{i}][cantidad]'),
            'notas': request.data.get(f'tratamientos[{i}][notas]', '')
        }

        print("ID de tipo_tratamiento recibido:", tratamiento_data['tipo_tratamiento'])

        tratamiento_serializer = TratamientoSerializer(data=tratamiento_data)
        if not tratamiento_serializer.is_valid():
            print(f"Errores del serializer de tratamiento {i}: {tratamiento_serializer.errors}")
            paciente.delete()  # Si el tratamiento falla, eliminamos el paciente
            return Response(tratamiento_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        tratamiento = tratamiento_serializer.save()
        tratamientos_creados.append(tratamiento)


            

    # Procesar pagos y vincularlos a los tratamientos creados
    pagos_creados = []
  
    pagos_length = len(request.data.getlist('pagos[0][monto]'))
    
    for i in range(pagos_length):
            if pagos_length > len(tratamientos_creados):
                print(f"Error: No hay suficientes tratamientos para asociar a los {pagos_length} pagos. Solo se crearon {len(tratamientos_creados)} tratamientos.")
                paciente.delete()  # Evitar inconsistencias si no se puede vincular un pago
                return Response({"error": "El número de pagos excede el número de tratamientos."}, status=status.HTTP_400_BAD_REQUEST)

    for i in range(pagos_length):
            tratamiento = tratamientos_creados[i]  # Vincular cada pago con el tratamiento correspondiente

            # Verificar que el tratamiento esté presente y no sea nulo
            if not tratamiento.id:
                print(f"Error: El tratamiento {i} es nulo o no se ha creado correctamente.")
                paciente.delete()
                return Response({"error": "Tratamiento no válido para el pago."}, status=status.HTTP_400_BAD_REQUEST)

            # Crear y vincular el pago
            print(f"Vinculando tratamiento ID {tratamiento.id} al pago {i}")
            pago_data = {
                'paciente': paciente.id,
                'tratamiento': tratamiento.id,
                'monto': request.data.get(f'pagos[{i}][monto]'),
            }
            print(f"Datos de pago {i} antes de guardar: {pago_data}")

            pago_serializer = PagoSerializer(data=pago_data)
            if not pago_serializer.is_valid():
                print(f"Errores del serializer Pago para pago {i}: {pago_serializer.errors}")
                paciente.delete()  # Si el pago falla, eliminar el paciente para evitar inconsistencias
                return Response(pago_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            pago = pago_serializer.save()
            pagos_creados.append(pago)
            print(f"Guardando pago {i} vinculado al tratamiento {tratamiento.id}")
           

# Devolver la respuesta de éxito
    return Response({
        'message': 'Paciente registrado con citas y pagos exitosamente.',
        'paciente': paciente_serializer.data,
        'tratamientos': TratamientoSerializer(tratamientos_creados, many=True).data  # Serializar los tratamientos creados
    }, status=status.HTTP_201_CREATED)
