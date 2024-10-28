from django.urls import path


from core.views.pagos_view import registrar_pago, obtener_pagos_paciente,obtener_saldo_paciente,modificar_pago,eliminar_pago,SaldoPacienteView

urlpatterns = [

    #Abono Paciente Nuevo
    path('registrar-pago/<int:paciente_id>/', registrar_pago, name='registrar_pago'),
    #Abonar de pago
    path('pacientes/<int:paciente_id>/abonar/', registrar_pago, name='registrar_pago'),
    #Obtener Saldos de tratamientos
    path('pacientes/<int:paciente_id>/saldo/', obtener_saldo_paciente, name='obtener_saldo_paciente'),
    #Obtener todos los pagos
    path('pacientes/<int:paciente_id>/pagos/', obtener_pagos_paciente, name='obtener_pagos_paciente'),
    #Actualizar detalles de pagos
    path('pagos/<int:pago_id>/modificar/', modificar_pago, name='modificar_pago'),
    #Eliminar de pagos
    path('pagos/<int:pago_id>/eliminar/', eliminar_pago, name='eliminar_pago'),  
    #Obtener Saldo por paciente por ID
    path('pacientes/<int:paciente_id>/saldo/', SaldoPacienteView.as_view(), name='saldo-paciente'),

    ]


