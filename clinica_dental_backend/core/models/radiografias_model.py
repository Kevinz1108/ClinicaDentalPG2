from django.db import models
from core.models.pacientes_model import Paciente

class Radiografia(models.Model):
    paciente = models.ForeignKey(Paciente, related_name='radiografias', on_delete=models.CASCADE)
    imagen = models.ImageField(upload_to='radiografias/', blank=True, null=True)  # Para almacenar las imágenes
    fecha_tomada = models.DateField(auto_now_add=True)
    notas = models.TextField(blank=True, null=True)
    nombre_archivo = models.CharField(max_length=255,default='sin_nombre')

    def __str__(self):
        return f"Radiografía de {self.paciente.nombre} - {self.fecha_tomada}"