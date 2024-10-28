from django.db import models



class Diagnostico(models.Model):
    paciente = models.ForeignKey('Paciente', on_delete=models.CASCADE)  # Relacionar con el paciente
    dientes = models.CharField(max_length=255, choices=[('Presentes', 'Presentes'), ('Ausentes', 'Ausentes'), ('Restaurados', 'Restaurados')], default='Presentes')
    notas_dientes = models.TextField(blank=True, null=True)
    caries = models.CharField(max_length=255, choices=[('Si', 'Si'), ('No', 'No')], default='No')
    notas_caries = models.TextField(blank=True, null=True)
    encias = models.CharField(max_length=255, choices=[('Saludables', 'Saludables'), ('Inflamadas', 'Inflamadas'), ('Recesión Gingival', 'Recesión Gingival')], default='Saludables')
    notas_encias = models.TextField(blank=True, null=True)
    maloclusiones = models.CharField(max_length=255, choices=[('Clase I', 'Clase I'), ('Clase II', 'Clase II'), ('Clase III', 'Clase III')], default='Clase I')
    notas_maloclusiones = models.TextField(blank=True, null=True)
    lesiones = models.CharField(max_length=255, choices=[('Ninguna', 'Ninguna'), ('Úlceras', 'Úlceras'), ('Herpes', 'Herpes')], default='Ninguna')
    notas_lesiones = models.TextField(blank=True, null=True)
    hueso_maxilar = models.CharField(max_length=255, choices=[('Sano', 'Sano'), ('Reabsorción', 'Reabsorción'), ('Otro', 'Otro')], default='Sano')
    notas_hueso_maxilar = models.TextField(blank=True, null=True)

    def __str__(self):
        return f'Diagnóstico de {self.paciente.nombre}'  