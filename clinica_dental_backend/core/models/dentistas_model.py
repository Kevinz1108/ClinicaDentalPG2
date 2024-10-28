from django.db import models
from django.contrib.auth.hashers import make_password

# Creacion de modelos Dentista
class Dentista(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    correo = models.EmailField(unique=True)
    telefono = models.CharField(max_length=15)
    colegiado = models.CharField(max_length=100)
    especialidad = models.ForeignKey('core.Especialidad', on_delete=models.CASCADE)

    nombre_usuario = models.CharField(max_length=100, unique=True)
    contrasena = models.CharField(max_length=100)
    roles = models.JSONField()  # Almacena roles como JSON

    def save(self, *args, **kwargs):
        if not self.pk:  # Si el dentista es nuevo, ciframos la contraseña
            self.contrasena = make_password(self.contrasena)
        super(Dentista, self).save(*args, **kwargs)

    class Meta:
        app_label = 'core'

    def __str__(self):
        return f'{self.nombre} {self.apellido}'
