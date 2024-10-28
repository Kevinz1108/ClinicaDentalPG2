from django.db import models


class HistorialPaciente(models.Model):
    paciente = models.ForeignKey('core.Paciente', on_delete=models.CASCADE, related_name='historiales')
    enfermedades_sistemicas = models.CharField(max_length=255, choices=[
        ('Ninguna', 'Ninguna'),
        ('Diabetes', 'Diabetes'),
        ('Hipertensión', 'Hipertensión'),
        ('Otra', 'Otra'),
    ])
    alergias = models.CharField(max_length=255, choices=[
        ('Ninguna', 'Ninguna'),
        ('Medicamentos', 'Medicamentos'),
        ('Alimentos', 'Alimentos'),
    ], default='Ninguna')
    detalle_alergia = models.CharField(max_length=255, blank=True, null=True)
    tratamiento_medico = models.CharField(max_length=255, choices=[
        ('Ninguna', 'Ninguna'),
        ('Si', 'Si'),
    ], default='Ninguna')
    detalle_tratamiento = models.CharField(max_length=255, blank=True, null=True)
    motivo_consulta = models.CharField(max_length=255, choices=[
        ('Dolor', 'Dolor'),
        ('Revisión', 'Revisión'),
        ('Tratamiento Estético', 'Tratamiento Estético'),
    ], default='Revisión')
    fecha_consulta = models.DateField(auto_now_add=True)
    tratamientos_previos = models.CharField(max_length=255, choices=[
        ('Ninguna', 'Ninguna'),
        ('Extracciones', 'Extracciones'),
        ('Ortodoncia', 'Ortodoncia'),
        ('Endodoncia', 'Endodoncia'),
        
    ])

    def __str__(self):
        return f"Historial de {self.paciente.nombre}"