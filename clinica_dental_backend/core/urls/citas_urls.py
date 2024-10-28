from django.urls import path


from core.views.citas_view import agendar_cita, obtener_citas,  verificar_traslape, guardar_evento_google_id

# Deja comentada la importación del webhook, ya que no se utilizará ahora
# from core.views.google_calendar import google_calendar_webhook

urlpatterns = [

    # Agendar Cita
    path('agendar-cita/', agendar_cita, name='agendar_cita'),
    
    # Obtener Citas
    path('obtener-citas/', obtener_citas, name='obtener_citas'),
    
    # Actualizar Cita
     #path('actualizar-cita/<int:id>/', actualizar_cita, name='actualizar_cita'),
    
    # Eliminar Cita
     #path('eliminar-cita/<int:id>/', eliminar_cita, name='eliminar_cita'),
    
    # Verificar traslape de citas
    path('verificar-traslape/', verificar_traslape, name='verificar_traslape'),
    
    # Guardar evento de Google Calendar en la base de datos
    path('guardar-evento-google-id/', guardar_evento_google_id, name='guardar_evento_google_id'),
    
    # Obtener cita por Google Event ID
     #path('obtener-citas/<str:google_event_id>/', obtener_cita_por_google_event_id, name='obtener_cita_google'),
    
    # Eliminar cita por Google Event ID
     #path('eliminar-cita/<str:google_event_id>/', eliminar_cita_por_google_event_id, name='eliminar_cita_google'),

    # Ruta para el webhook de Google Calendar (comentada para futura implementación)
    # path('webhook/google-calendar', google_calendar_webhook, name='google_calendar_webhook'),
]

