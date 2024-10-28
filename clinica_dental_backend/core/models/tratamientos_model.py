from django.db import models
from core.models.pacientes_model import Paciente

# Modelo para especialidades
class Especialidad(models.Model):
    nombre = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nombre

# Modelo para categorías dentro de una especialidad
class Categoria(models.Model):
    especialidad = models.ForeignKey(Especialidad, on_delete=models.CASCADE, related_name='categorias')
    nombre = models.CharField(max_length=100)

    class Meta:
        unique_together = ('especialidad', 'nombre')  # Cada categoría es única dentro de una especialidad

    def __str__(self):
        return f"{self.nombre} ({self.especialidad.nombre})"

# Modelo para tratamientos dentro de una categoría
class TipoTratamiento(models.Model):
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='tipos_tratamientos')
    nombre = models.CharField(max_length=100)
    precio = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        unique_together = ('categoria', 'nombre')  # Nombre único dentro de cada categoría

    def __str__(self):
        return f"{self.nombre} - {self.categoria.especialidad.nombre}"

# Modelo de Tratamiento
class Tratamiento(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='tratamientos')
    tipo_tratamiento = models.ForeignKey(TipoTratamiento, on_delete=models.CASCADE)  # Cambiado para usar TipoTratamiento
    cantidad = models.PositiveIntegerField(default=1)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2, editable=False)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, editable=False)
    notas = models.TextField(blank=True, null=True)
    
    def save(self, *args, **kwargs):
        # Asignar el precio solo si tipo_tratamiento existe
        if self.tipo_tratamiento:
            self.precio_unitario = self.tipo_tratamiento.precio
            self.subtotal = self.cantidad * self.precio_unitario
        super().save(*args, **kwargs)


    def __str__(self):
        return f'Tratamiento {self.tipo_tratamiento.nombre} para {self.paciente.nombre}'


# Modelo de Factura de Tratamiento
class FacturaTratamiento(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='facturas')
    tratamientos = models.ManyToManyField(Tratamiento, related_name='facturas')
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def calcular_total(self):
        try:
            self.total = sum([tratamiento.subtotal for tratamiento in self.tratamientos.all()])
            self.save()
        except Exception as e:
            print(f"Error al calcular el total: {e}")

    def __str__(self):
        return f'Factura para {self.paciente.nombre} - Total: {self.total} Q'
