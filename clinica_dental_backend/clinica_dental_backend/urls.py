
from django.contrib import admin


from django.urls import path,include
from django.conf.urls.static import static
from django.conf import settings

urlpatterns =  [
    path('admin/', admin.site.urls),
    path('api/',include('core.urls.login_urls') ),
    path('api/',include('core.urls.dentistas_urls') ),
    path('api/',include('core.urls.pacientes_urls')),
    path('api/',include('core.urls.ocupacion_urls')),
    path('api/',include('core.urls.historialMedico_urls')),
    path('api/',include('core.urls.historialOdontologico_urls')),
    path('api/',include('core.urls.radiografias_urls')),
    path('api/',include('core.urls.tratamientos_urls')),
    path('api/',include('core.urls.pagos_urls')),
    path('api/',include('core.urls.citas_urls')),
    path('api/',include('core.urls.empleados_urls')),


]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


