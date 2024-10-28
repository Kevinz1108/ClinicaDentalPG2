from django.db import models

from core.models.dentistas_model import Dentista
from core.models.pacientes_model import Paciente

class Cita(models.Model):
    TIPO_CITA_CHOICES = [
        ('Consulta', 'Consulta'),
        ('Limpieza', 'Limpieza'),
        ('Ortodoncia', 'Ortodoncia'),
    ]

    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name="citas")
    odontologo = models.ForeignKey(Dentista, on_delete=models.CASCADE, related_name="citas")
    tipo_cita = models.CharField(max_length=100, choices=TIPO_CITA_CHOICES)
    fecha_cita = models.DateField()
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    google_event_id = models.CharField(max_length=255, null=True, blank=True, unique=True)  # ID de evento de Google Calendar

    def __str__(self):
        return f"{self.paciente} - {self.tipo_cita} - {self.fecha_cita}"