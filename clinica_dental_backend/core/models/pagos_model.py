from django.db import models

from core.models.pacientes_model import Paciente
from core.models.tratamientos_model import Tratamiento

class Pago(models.Model):
    paciente = models.ForeignKey(Paciente, related_name='pagos', on_delete=models.CASCADE)
    tratamiento = models.ForeignKey(Tratamiento, related_name='pagos', on_delete=models.CASCADE)
    fecha = models.DateField(auto_now_add=True)
    monto = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Pago de {self.paciente.nombre} {self.paciente.apellido} - {self.monto} Q"