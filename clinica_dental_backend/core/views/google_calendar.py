from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.auth.transport.requests import Request
import os

# Definir el alcance que necesitas para Google Calendar
SCOPES = ['https://www.googleapis.com/auth/calendar']

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def obtener_servicio_google_calendar():
    """Autentica y devuelve el servicio de Google Calendar"""
    creds = None
    token_path = os.path.join(BASE_DIR, 'token.json')  # Guarda el token de sesión aquí
    cred_path = os.path.join(BASE_DIR, 'credentials.json')  # Ruta a tu archivo credentials.json

    # Si hay un token previamente almacenado, úsalo.
    if os.path.exists(token_path):
        creds = Credentials.from_authorized_user_file(token_path, SCOPES)

    # Si no hay credenciales disponibles o expiran, se solicitan de nuevo.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(cred_path, SCOPES)
            creds = flow.run_local_server(port=8080)
        
        # Guardar las credenciales para el próximo uso.
        with open(token_path, 'w') as token:
            token.write(creds.to_json())

    service = build('calendar', 'v3', credentials=creds)
    return service

def crear_evento_google_calendar(cita):
    try:
        service = obtener_servicio_google_calendar()
        event = {
            'summary': f"{cita.paciente.nombre} - {cita.tipo_cita}",
            'description': f"Cita con el odontólogo {cita.odontologo.nombre}",
            'start': {
                'dateTime': f"{cita.fecha_cita}T{cita.hora_inicio}",
                'timeZone': 'America/Guatemala',
            },
            'end': {
                'dateTime': f"{cita.fecha_cita}T{cita.hora_fin}",
                'timeZone': 'America/Guatemala',
            },
        }

        # Insertar el evento en Google Calendar
        event_result = service.events().insert(
            calendarId='94418f6b74dd3706717eee03d82f34deb6e758232b4a8d683d844cccf4c80854@group.calendar.google.com', 
            body=event
        ).execute()

        # Retorna el google_event_id
        return event_result.get('id')

    except HttpError as error:
        print(f"An error occurred with the Google Calendar API: {error}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None

# Comentado para futura implementación
# def eliminar_evento_google_calendar(google_event_id):
#     try:
#         service = obtener_servicio_google_calendar()
#         service.events().delete(calendarId='94418f6b74dd3706717eee03d82f34deb6e758232b4a8d683d844cccf4c80854@group.calendar.google.com', eventId=google_event_id).execute()
#         print(f"Evento con google_event_id {google_event_id} eliminado correctamente de Google Calendar")
#     except HttpError as error:
#         print(f"Error al eliminar el evento de Google Calendar: {error}")
#     except Exception as e:
#         print(f"An unexpected error occurred: {e}")

# Comentado para futura implementación
# def actualizar_evento_google_calendar(cita):
#     """Actualiza un evento de Google Calendar."""
#     try:
#         service = obtener_servicio_google_calendar()
#         event = {
#             'summary': f"{cita.paciente.nombre} - {cita.tipo_cita}",
#             'description': f"Cita con el odontólogo {cita.odontologo.nombre}",
#             'start': {
#                 'dateTime': f"{cita.fecha_cita}T{cita.hora_inicio}",
#                 'timeZone': 'America/Guatemala',
#             },
#             'end': {
#                 'dateTime': f"{cita.fecha_cita}T{cita.hora_fin}",
#                 'timeZone': 'America/Guatemala',
#             },
#         }

#         # Actualizar el evento en Google Calendar
#         service.events().update(
#             calendarId='94418f6b74dd3706717eee03d82f34deb6e758232b4a8d683d844cccf4c80854@group.calendar.google.com',
#             eventId=cita.google_event_id,
#             body=event
#         ).execute()
#         print(f"Evento actualizado con éxito en Google Calendar")
#     except HttpError as error:
#          print(f"Error al actualizar el evento de Google Calendar: {error}")
#     except HttpError as e:
#         print(f"Ocurrió un error inesperado: {e}")

# Comentado para futura implementación
# @csrf_exempt
# def google_calendar_webhook(request):
#     if request.method == 'POST':
#         try:
#             # Procesar la notificación de Google Calendar
#             data = json.loads(request.body)
#             event_type = request.headers.get('X-Goog-Resource-State')

#             # Verificar el tipo de evento: creación, actualización o eliminación
#             if event_type == 'exists':
#                 print("Webhook verificado exitosamente.")
#             elif event_type == 'sync':
#                 print("Sincronización requerida:", data)
#             elif event_type == 'create':
#                 print("Evento creado:", data)
#             elif event_type == 'update':
#                 print("Evento actualizado:", data)
#             elif event_type == 'delete':
#                 print("Evento eliminado:", data)
            
#             return JsonResponse({'status': 'success'}, status=200)
#         except Exception as e:
#             print(f"Error al procesar la notificación de Google Calendar: {e}")
#             return JsonResponse({'error': str(e)}, status=500)
    
#     return JsonResponse({'error': 'Invalid request'}, status=400)

# Comentado para futura implementación
# def suscribir_a_notificaciones_google_calendar():
#     service = obtener_servicio_google_calendar()

#     body = {
#         'id': str(uuid.uuid4()),  # Genera un ID único
#         'type': 'web_hook',
#         'address': 'https://a492-181-209-144-49.ngrok-free.app/webhook/google-calendar',  # Tu endpoint público de webhook
#         'params': {
#             'ttl': 3600  # Tiempo de vida del webhook en segundos
#         }
#     }

#     calendar_id = 'primary'  # O el ID de tu calendario específico
#     response = service.events().watch(calendarId=calendar_id, body=body).execute()
#     print('Subscription response:', response)
