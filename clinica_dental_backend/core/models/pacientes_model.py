from django.db import models
from django.utils import timezone
from core.models.dentistas_model import Dentista

# Creacion de modelos Paciente
class Paciente(models.Model):
    GENERO_CHOICES = [
        ('M', 'Masculino'),
        ('F', 'Femenino'),
        ('O', 'Otro'),
    ]
    
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True, default='Sin Datos')
    direccion = models.TextField()
    fecha_nacimiento = models.DateField()
    edad = models.IntegerField()
    fecha_de_registro = models.DateTimeField(auto_now_add=True)
    genero = models.CharField(max_length=1, choices=GENERO_CHOICES)
    ocupacion = models.CharField(max_length=100, blank=True, null=True)
    departamento = models.CharField(max_length=100)
    municipio = models.CharField(max_length=100)

    # Relación con Dentista
    odontologo = models.ForeignKey(Dentista, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f'{self.nombre} {self.apellido}'