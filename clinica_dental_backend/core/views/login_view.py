from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password
import json
from core.models.dentistas_model import Dentista
from core.models.empleados_model import Empleado

# Login para Dashboard
@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email_or_username = data.get('emailOrUsername')
        password = data.get('password')

        # Verificar si el usuario es superusuario
        user = authenticate(username=email_or_username, password=password)
        if user is not None:
            if user.is_superuser:
                return JsonResponse({
                    'message': 'Superuser autenticado exitosamente',
                    'nombre': user.first_name,
                    'apellido': user.last_name,
                    'is_superuser': True
                }, status=200)
            else:
                return JsonResponse({
                    'message': 'Usuario autenticado exitosamente',
                    'nombre': user.first_name,
                    'apellido': user.last_name,
                    'is_superuser': False
                }, status=200)

        # Verificar en la tabla core_dentista
        try:
            dentista = Dentista.objects.get(correo=email_or_username)
        except Dentista.DoesNotExist:
            try:
                dentista = Dentista.objects.get(nombre_usuario=email_or_username)
            except Dentista.DoesNotExist:
                dentista = None

        if dentista and check_password(password, dentista.contrasena):
            return JsonResponse({
                'message': 'Dentista autenticado exitosamente',
                'nombre': dentista.nombre,
                'apellido': dentista.apellido,
                'is_dentista': True  # Indicar que es un dentista
            }, status=200)

        # Verificar en la tabla core_empleado
        try:
            empleado = Empleado.objects.get(correo=email_or_username)
        except Empleado.DoesNotExist:
            try:
                empleado = Empleado.objects.get(usuario=email_or_username)
            except Empleado.DoesNotExist:
                empleado = None

        if empleado and check_password(password, empleado.contrasena):
            return JsonResponse({
                'message': 'Empleado autenticado exitosamente',
                'nombre': empleado.nombre,
                'apellido': empleado.apellido,
                'is_dentista': False  # No es un dentista
            }, status=200)

        return JsonResponse({'error': 'Credenciales incorrectas'}, status=400)

    return JsonResponse({'error': 'Método no permitido'}, status=405)
