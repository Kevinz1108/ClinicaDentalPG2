from django.db import models

class Cargo(models.Model):
    nombre = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nombre

class Empleado(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    correo = models.EmailField(unique=True)
    telefono = models.CharField(max_length=15)
    rol = models.ForeignKey(Cargo, on_delete=models.SET_NULL, null=True, related_name='empleados')
    usuario = models.CharField(max_length=100, unique=True)
    contrasena = models.CharField(max_length=128)

    def __str__(self):
        return f'{self.nombre} {self.apellido} - {self.rol.nombre if self.rol else "Sin Rol"}'
