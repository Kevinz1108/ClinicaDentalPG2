from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum
from rest_framework.views import APIView



from core.models.pacientes_model import Paciente
from core.models.tratamientos_model import Tratamiento
from core.models.pagos_model import Pago

from core.serializers.pagos_serializer import PagoSerializer

# Registrar Pagos

@api_view(['POST'])
def registrar_pago(request, paciente_id):
    try:
        paciente = Paciente.objects.get(id=paciente_id)
        tratamiento_id = request.data.get('tratamiento_id')
        fecha = request.data.get('fecha')
        monto = request.data.get('monto')

        # Buscar el tratamiento correspondiente
        tratamiento = Tratamiento.objects.get(id=tratamiento_id, paciente=paciente)

        # Crear el nuevo pago
        pago = Pago.objects.create(
            paciente=paciente,
            tratamiento=tratamiento,
            fecha=fecha,
            monto=monto
        )

        serializer = PagoSerializer(pago)
        return Response(serializer.data, status=201)
    except Paciente.DoesNotExist:
        return Response({'error': 'Paciente no encontrado'}, status=404)
    except Tratamiento.DoesNotExist:
        return Response({'error': 'Tratamiento no encontrado'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

# Obtener los saldos de los pacientes

@api_view(['GET'])
def obtener_saldo_paciente(request, paciente_id):
    try:
        paciente = Paciente.objects.get(id=paciente_id)
        tratamientos = paciente.tratamientos.all()
        saldo_data = []
        saldo_total = 0
        
        for tratamiento in tratamientos:
            total_abonado = sum(float(pago.monto) for pago in Pago.objects.filter(tratamiento=tratamiento, paciente=paciente))
            saldo = float(tratamiento.precio_unitario) - total_abonado
            saldo_total += saldo
            
            primer_pago = Pago.objects.filter(tratamiento=tratamiento, paciente=paciente).order_by('fecha').first()
            fecha_abono = primer_pago.fecha if primer_pago else None
            
            saldo_data.append({
                'tratamiento_id': tratamiento.id,
                'tratamiento_nombre': tratamiento.tipo_tratamiento.nombre,  # Acceso directo al nombre del tratamiento
                'precio_tratamiento': float(tratamiento.precio_unitario),
                'fecha': fecha_abono,
                'abono': total_abonado,
                'saldo': saldo,
            })

        return Response({'saldos': saldo_data, 'saldo_total': saldo_total}, status=200)
    except Paciente.DoesNotExist:
        return Response({'error': 'Paciente no encontrado'}, status=404)




# Obtener los pagos de los pacientes

@api_view(['GET'])
def obtener_pagos_paciente(request, paciente_id):
    try:
        paciente = Paciente.objects.get(id=paciente_id)
        pagos = Pago.objects.filter(paciente=paciente)
        pagos_data = []

        for pago in pagos:
            tratamiento = pago.tratamiento  # Obtener el tratamiento relacionado

            if tratamiento:
                tipo_tratamiento_nombre = tratamiento.tipo_tratamiento  # Acceder directamente al valor de tipo_tratamiento
                total_abonado = Pago.objects.filter(tratamiento=tratamiento).aggregate(total=Sum('monto'))['total'] or 0.0
                saldo_restante = float(tratamiento.precio_unitario) - float(total_abonado)

                pagos_data.append({
                    'id': pago.id,
                    'tratamiento_id': tratamiento.id,
                    'tratamiento_nombre': tratamiento.tipo_tratamiento.nombre, 
                    'precio_tratamiento': float(tratamiento.precio_unitario),
                    'fecha': pago.fecha.isoformat() if pago.fecha else None,
                    'monto': float(pago.monto),
                    'saldo': saldo_restante
                })
            else:
                pagos_data.append({
                    'id': pago.id,
                    'tratamiento_id': None,
                    'tratamiento_nombre': 'Tratamiento no disponible',
                    'precio_tratamiento': 0,
                    'fecha': pago.fecha.isoformat() if pago.fecha else None,
                    'monto': float(pago.monto),
                    'saldo': 0,
                })

        return Response({'pagos': pagos_data}, status=200)

    except Paciente.DoesNotExist:
        return Response({'error': 'Paciente no encontrado'}, status=404)





# Actualizar detalle de pagos de los pacientes

@api_view(['PUT'])
def modificar_pago(request, pago_id):
    try:
        pago = Pago.objects.get(id=pago_id)
        data = request.data

        # Actualizar los campos de tratamiento y monto
        pago.tratamiento_id = data.get('tratamiento_id', pago.tratamiento_id)
        pago.monto = data.get('monto', pago.monto)

        # Guardar los cambios
        pago.save()

        return Response({'message': 'Pago actualizado con éxito'}, status=200)
    except Pago.DoesNotExist:
        return Response({'error': 'Pago no encontrado'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=400)



# Vista para eliminar un pago
@api_view(['DELETE'])
def eliminar_pago(request, pago_id):
    try:
        pago = Pago.objects.get(id=pago_id)
        pago.delete()
        return Response({'message': 'Pago eliminado con éxito.'}, status=status.HTTP_204_NO_CONTENT)

    except Pago.DoesNotExist:
        return Response({'error': 'Pago no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

# Detalle Saldo Paciente    
class SaldoPacienteView(APIView):
    def get(self, request, paciente_id):
        paciente = Paciente.objects.get(id=paciente_id)
        pagos = Pago.objects.filter(paciente=paciente)
        
        # Calcular saldo pendiente (ejemplo simplificado)
        total_pagado = sum(pago.monto for pago in pagos)
        saldo_pendiente = 1000 - total_pagado  # Suponiendo un monto fijo por simplicidad

        pagos_data = [
            {
                'monto': pago.monto,
                'fecha': pago.fecha,
                'medio_pago': pago.medio_pago,
            } for pago in pagos
        ]

        data = {
            'pagos': pagos_data,
            'saldoPendiente': saldo_pendiente
        }
        return Response(data)