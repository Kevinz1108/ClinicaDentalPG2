from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password

from core.serializers.empleados_serializer import EmpleadoSerializer,CargoSerializer

from core.models.empleados_model import Empleado,Cargo


# Registrar un nuevo empleado
@api_view(['POST'])
def registrar_empleado(request):
    serializer = EmpleadoSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Obtener lista de empleados
@api_view(['GET'])
def lista_empleados(request):
    empleados = Empleado.objects.all()
    serializer = EmpleadoSerializer(empleados, many=True)
    return Response(serializer.data)

# Editar un empleado
@api_view(['PUT'])
def editar_empleado(request, id):
    try:
        empleado = Empleado.objects.get(id=id)
    except Empleado.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    # Si la contraseña está incluida, encriptarla
    if 'contrasena' in request.data and request.data['contrasena']:
        request.data['contrasena'] = make_password(request.data['contrasena'])
    
    serializer = EmpleadoSerializer(empleado, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Eliminar un empleado
@api_view(['DELETE'])
def eliminar_empleado(request, id):
    try:
        empleado = Empleado.objects.get(id=id)
    except Empleado.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    empleado.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

#-----------------------------------

# Crear Cargos Empleados
@api_view(['POST'])
def crear_cargo(request):
    serializer = CargoSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def lista_cargos(request):
    cargos = Cargo.objects.all()
    serializer = CargoSerializer(cargos, many=True)
    return Response(serializer.data)

# Editar un cargo
@api_view(['PUT'])
def editar_cargo(request, id):
    try:
        cargo = Cargo.objects.get(id=id)
    except Cargo.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = CargoSerializer(cargo, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Eliminar un cargo
@api_view(['DELETE'])
def eliminar_cargo(request, id):
    try:
        cargo = Cargo.objects.get(id=id)
    except Cargo.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    cargo.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

