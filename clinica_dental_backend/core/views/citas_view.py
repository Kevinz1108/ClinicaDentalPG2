from rest_framework.decorators import api_view
from datetime import datetime
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import status

from core.views.google_calendar import obtener_servicio_google_calendar, crear_evento_google_calendar


from googleapiclient.errors import HttpError

from core.models.citas_model import Cita

from core.serializers.citas_serializer import CitaSerializer


# Función que realiza la lógica para verificar el traslape
def verificar_traslape_logica(odontologo_id, fecha_cita, hora_inicio, hora_fin):
    citas_existentes = Cita.objects.filter(
        odontologo_id=odontologo_id,
        fecha_cita=fecha_cita,
        hora_inicio__lt=hora_fin,
        hora_fin__gt=hora_inicio
    )
    return citas_existentes.exists()

# API para verificar traslape (opcional si la quieres seguir usando como endpoint)
@api_view(['POST'])
def verificar_traslape(request):
    odontologo_id = request.data.get('odontologo')
    fecha_cita = request.data.get('fecha_cita')
    hora_inicio = request.data.get('hora_inicio')
    hora_fin = request.data.get('hora_fin')

    # Convertir strings a objetos datetime
    try:
        fecha_cita = datetime.strptime(fecha_cita, '%Y-%m-%d').date()  # Formato '2024-10-09'
        hora_inicio = datetime.strptime(hora_inicio, '%H:%M').time()   # Formato '10:30'
        hora_fin = datetime.strptime(hora_fin, '%H:%M').time()         # Formato '11:30'
    except ValueError as e:
        return JsonResponse({'error': 'Formato de fecha u hora inválido'}, status=400)

    # Verificar traslape
    if verificar_traslape_logica(odontologo_id, fecha_cita, hora_inicio, hora_fin):
        return JsonResponse({'traslape': True}, status=200)
    else:
        return JsonResponse({'traslape': False}, status=200)

@api_view(['POST'])
def guardar_evento_google_id(request):
    try:
        # Obtener los datos del request
        cita_id = request.data.get('citaId')
        google_event_id = request.data.get('googleEventId')

        # Buscar la cita en la base de datos
        cita = Cita.objects.get(id=cita_id)

        # Asignar el google_event_id a la cita y guardarlo
        cita.google_event_id = google_event_id
        cita.save()

        return Response({'message': 'Google Event ID guardado con éxito'}, status=status.HTTP_200_OK)
    except Cita.DoesNotExist:
        return Response({'error': 'Cita no encontrada'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Comentado porque no quieres implementar el webhook por ahora
# @api_view(['POST'])
# def iniciar_suscripcion_google_calendar(request):
#     try:
#         # Llamar a la función que registra el webhook (watch)
#         suscribir_a_notificaciones_google_calendar()
#         return Response({'message': 'Webhook registrado correctamente'}, status=200)
#     except Exception as e:
#         return Response({'error': str(e)}, status=500)

@api_view(['POST'])
def agendar_cita(request):
    try:
        # Obtener datos del request
        odontologo_id = request.data.get('odontologo')
        paciente_id = request.data.get('paciente')
        fecha_cita = request.data.get('fecha_cita')
        hora_inicio = request.data.get('hora_inicio')
        hora_fin = request.data.get('hora_fin')

        # Convertir las fechas y horas a formato adecuado
        fecha_cita = datetime.strptime(fecha_cita, '%Y-%m-%d').date()
        hora_inicio = datetime.strptime(hora_inicio, '%H:%M').time()
        hora_fin = datetime.strptime(hora_fin, '%H:%M').time()

        # Verificar traslape de citas (si tienes esa lógica implementada)
        if verificar_traslape_logica(odontologo_id, fecha_cita, hora_inicio, hora_fin):
            return Response({'error': 'Ya existe una cita en ese horario'}, status=status.HTTP_400_BAD_REQUEST)

        # Crear la cita en la base de datos
        cita_data = {
            'paciente': paciente_id,
            'odontologo': odontologo_id,
            'fecha_cita': fecha_cita,
            'hora_inicio': hora_inicio,
            'hora_fin': hora_fin,
            'tipo_cita': request.data.get('tipo_cita'),
        }
        serializer = CitaSerializer(data=cita_data)
        if serializer.is_valid():
            cita = serializer.save()

            # Crear el evento en Google Calendar
            google_event_id = crear_evento_google_calendar(cita)

            # Guardar el google_event_id en la base de datos
            cita.google_event_id = google_event_id
            cita.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        print(f"Error al agendar la cita: {e}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Obtener citas agendadas
@api_view(['GET'])
def obtener_citas(request):
    citas = Cita.objects.all()
    serializer = CitaSerializer(citas, many=True)
    return Response(serializer.data)

# Comentado porque no quieres implementar la eliminación de eventos por ahora
# Vista para eliminar una cita por google_event_id
# @api_view(['DELETE'])
# def eliminar_cita_por_google_event_id(request, google_event_id):
#     try:
#         # Buscar la cita por google_event_id
#         cita = Cita.objects.get(google_event_id=google_event_id)

#         # Intentar eliminar el evento de Google Calendar antes de eliminar la cita en la base de datos
#         try:
#             eliminar_evento_google_calendar(google_event_id)
#             print(f"Evento con google_event_id {google_event_id} eliminado de Google Calendar")
#         except HttpError as error:
#             print(f"Error al eliminar el evento de Google Calendar: {error}")

#         # Eliminar la cita de la base de datos
#         cita.delete()

#         return Response({'message': 'Cita eliminada con éxito'}, status=204)
#     except Cita.DoesNotExist:
#         return Response({'error': 'Cita no encontrada'}, status=404)


# API para actualizar una cita existente
#@api_view(['PUT'])
#def actualizar_cita(request, id):
#    try:
#        # Buscar la cita en la base de datos por ID
#        cita = Cita.objects.get(id=id)
#    except Cita.DoesNotExist:
#        return Response({'error': 'Cita no encontrada'}, status=status.HTTP_404_NOT_FOUND)

    # Actualizar los campos
#    serializer = CitaSerializer(cita, data=request.data, partial=True)
#    if serializer.is_valid():
#        cita = serializer.save()

        # Actualizar evento en Google Calendar
#        if cita.google_event_id:
#            actualizar_evento_google_calendar(cita)

#        return Response({'message': 'Cita actualizada con éxito', 'data': serializer.data})

 #   return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Comentado porque no quieres eliminar eventos de Google Calendar por ahora
# @api_view(['DELETE'])
# def eliminar_cita(request, id):
#     try:
#         # Buscar la cita
#         cita = Cita.objects.get(id=id)
#         # Eliminar el evento en Google Calendar si existe
#         if cita.google_event_id:
#             eliminar_evento_google_calendar(cita.google_event_id)

#         # Eliminar la cita en la base de datos
#         cita.delete()
#         return Response({'message': 'Cita eliminada con éxito'}, status=status.HTTP_204_NO_CONTENT)
#     except Cita.DoesNotExist:
#         return Response({'error': 'Cita no encontrada'}, status=status.HTTP_404_NOT_FOUND)
