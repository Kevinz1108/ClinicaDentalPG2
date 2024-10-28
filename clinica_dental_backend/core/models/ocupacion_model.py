from django.db import models

class Ocupacion(models.Model):
    nombre = models.CharField(max_length=100, unique=True)  # Evita nombres duplicados

    def __str__(self):
        return self.nombre