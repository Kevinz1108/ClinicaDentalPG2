from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from decimal import Decimal

from core.models.tratamientos_model import TipoTratamiento,Tratamiento,Especialidad,Categoria
from core.models.pacientes_model import Paciente



from core.serializers.tratamientos_serializer import TipoTratamientoSerializer,TratamientoSerializer,FacturaTratamiento
from core.serializers.tratamientos_serializer import EspecialidadSerializer,CategoriaSerializer




@api_view(['GET'])
def listar_especialidades(request):
    especialidades = Especialidad.objects.all()
    serializer = EspecialidadSerializer(especialidades, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def listar_categorias_por_especialidad(request, especialidad_id):
    categorias = Categoria.objects.filter(especialidad_id=especialidad_id)
    serializer = CategoriaSerializer(categorias, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def listar_tratamientos_por_categoria(request, categoria_id):
    tratamientos = TipoTratamiento.objects.filter(categoria_id=categoria_id)
    serializer = TipoTratamientoSerializer(tratamientos, many=True)
    return Response(serializer.data)


# Obtener y agregar Tipos de tratamiento Dental

@api_view(['GET'])
def obtener_tipos_tratamiento(request):
    print("Solicitud recibida para obtener tipos de tratamientos")
    tratamientos = TipoTratamiento.objects.all()
    serializer = TipoTratamientoSerializer(tratamientos, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def agregar_tipo_tratamiento(request):
    serializer = TipoTratamientoSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


# Guardar Tratamiento y el costo

@api_view(['GET'])
def obtener_tratamientos_paciente(request, paciente_id):
    try:
        print("Solicitud recibida para obtener tratamientos del paciente:", paciente_id) 
        paciente = Paciente.objects.get(id=paciente_id)
        tratamientos = paciente.tratamientos.all()
        factura = paciente.facturas.last()  # La última factura si existe
        data = {
            'tratamientos': TratamientoSerializer(tratamientos, many=True).data,
            'total': factura.total if factura else 0
        }
        return Response(data, status=200)
    except Paciente.DoesNotExist:
        return Response({'error': 'Paciente no encontrado'}, status=404)

@api_view(['POST'])
def guardar_tratamiento_paciente(request, paciente_id):
    try:
        print("Datos recibidos:", request.data)  # Log para verificar los datos recibidos
        paciente = Paciente.objects.get(id=paciente_id)

        tratamientos_data = request.data.get('tratamientos', [])
        if not tratamientos_data:
            return Response({'error': 'No se recibieron tratamientos.'}, status=400)

        # Crear una nueva factura para el paciente
        factura = FacturaTratamiento.objects.create(paciente=paciente)

        for tratamiento_data in tratamientos_data:
            print("Tratamiento:", tratamiento_data)  # Verifica el contenido de cada tratamiento
            tipo_tratamiento = tratamiento_data.get('tipo_tratamiento')
            cantidad = int(tratamiento_data.get('cantidad', 1))  # Convertir cantidad a entero
            precio_unitario = Decimal(tratamiento_data.get('precio_unitario', 0))  # Convertir precio_unitario a Decimal
            notas = tratamiento_data.get('notas', '')

            # Validar que los datos clave están presentes y son correctos
            if not tipo_tratamiento or cantidad <= 0 or precio_unitario <= 0:
                print("Error en los datos: ", tipo_tratamiento, cantidad, precio_unitario)
                return Response({'error': 'Datos de tratamiento inválidos.'}, status=400)

            # Crear el tratamiento
            tratamiento = Tratamiento.objects.create(
                paciente=paciente,
                tipo_tratamiento=tipo_tratamiento,
                cantidad=cantidad,
                precio_unitario=precio_unitario,
                notas=notas
            )
            factura.tratamientos.add(tratamiento)

        # Calcular el total de la factura
        factura.calcular_total()

        return Response({'message': 'Tratamiento guardado con éxito.'}, status=201)

    except Paciente.DoesNotExist:
        print(f"Paciente con ID {paciente_id} no encontrado.")
        return Response({'error': 'Paciente no encontrado.'}, status=404)

    except Exception as e:
        import traceback
        traceback.print_exc()  # Imprime el traceback completo
        print(f"Error en guardar_tratamiento_paciente: {e}")
        return Response({'error': 'Error interno del servidor.'}, status=500)
    
@api_view(['PUT'])
def modificar_tratamiento(request, tratamiento_id):
    try:
        tratamiento = Tratamiento.objects.get(id=tratamiento_id)
    except Tratamiento.DoesNotExist:
        return Response({'error': 'Tratamiento no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
    
    # Deserializamos los datos y los validamos
    serializer = TratamientoSerializer(tratamiento, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Tratamiento modificado con éxito.'}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def eliminar_tratamiento(request, tratamiento_id):
    try:
        # Intentar obtener el tratamiento por su ID
        tratamiento = Tratamiento.objects.get(id=tratamiento_id)
        tratamiento.delete()  # Eliminar el tratamiento
        return Response({'message': 'Tratamiento eliminado con éxito.'}, status=status.HTTP_204_NO_CONTENT)
    except Tratamiento.DoesNotExist:
        return Response({'error': 'Tratamiento no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error al eliminar el tratamiento: {e}")
        return Response({'error': 'Error interno del servidor.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    