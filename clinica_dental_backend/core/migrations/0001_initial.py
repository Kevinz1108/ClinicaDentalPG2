# Generated by Django 4.2.16 on 2024-10-26 23:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Cargo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Dentista',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('apellido', models.CharField(max_length=100)),
                ('correo', models.EmailField(max_length=254, unique=True)),
                ('telefono', models.CharField(max_length=15)),
                ('colegiado', models.CharField(max_length=100)),
                ('especializacion', models.CharField(choices=[('General', 'General'), ('Ortodoncia', 'Ortodoncia'), ('Endodoncia', 'Endodoncia'), ('Maxilofacial', 'Maxilofacial')], max_length=100)),
                ('nombre_usuario', models.CharField(max_length=100, unique=True)),
                ('contrasena', models.CharField(max_length=100)),
                ('roles', models.JSONField()),
            ],
        ),
        migrations.CreateModel(
            name='Empleado',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('apellido', models.CharField(max_length=100)),
                ('correo', models.EmailField(max_length=254, unique=True)),
                ('telefono', models.CharField(max_length=15)),
                ('rol', models.CharField(max_length=50)),
                ('usuario', models.CharField(max_length=100, unique=True)),
                ('contrasena', models.CharField(max_length=128)),
            ],
        ),
        migrations.CreateModel(
            name='Ocupacion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Paciente',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('apellido', models.CharField(max_length=100)),
                ('telefono', models.CharField(max_length=20)),
                ('email', models.EmailField(blank=True, default='Sin Datos', max_length=254, null=True)),
                ('direccion', models.TextField()),
                ('fecha_nacimiento', models.DateField()),
                ('edad', models.IntegerField()),
                ('fecha_de_registro', models.DateTimeField(auto_now_add=True)),
                ('genero', models.CharField(choices=[('M', 'Masculino'), ('F', 'Femenino'), ('O', 'Otro')], max_length=1)),
                ('ocupacion', models.CharField(blank=True, max_length=100, null=True)),
                ('departamento', models.CharField(max_length=100)),
                ('municipio', models.CharField(max_length=100)),
                ('odontologo', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='core.dentista')),
            ],
        ),
        migrations.CreateModel(
            name='TipoTratamiento',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100, unique=True)),
                ('precio', models.DecimalField(decimal_places=2, max_digits=10)),
            ],
        ),
        migrations.CreateModel(
            name='Tratamiento',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tipo_tratamiento', models.CharField(choices=[('Limpieza Dental', 'Limpieza Dental'), ('Aplicación de Fluoruro', 'Aplicación de Fluoruro'), ('Selladores Dentales', 'Selladores Dentales'), ('Consulta', 'Consulta'), ('Empaste Dental', 'Empaste Dental'), ('Corona Dental', 'Corona Dental'), ('Puente Dental', 'Puente Dental'), ('Implante Dental', 'Implante Dental'), ('Prótesis Dental', 'Prótesis Dental'), ('Brakets Tradicionales', 'Brakets Tradicionales'), ('Brakets Cerámicos', 'Brakets Cerámicos'), ('Invisalign', 'Invisalign'), ('Retenedores', 'Retenedores'), ('Blanqueamiento Dental', 'Blanqueamiento Dental'), ('Carillas Dentales', 'Carillas Dentales'), ('Contorneado Dental', 'Contorneado Dental'), ('Limpieza Profunda', 'Limpieza Profunda'), ('Cirugía Periodontal', 'Cirugía Periodontal'), ('Otro', 'Otro')], max_length=255)),
                ('cantidad', models.PositiveIntegerField(default=1)),
                ('precio_unitario', models.DecimalField(decimal_places=2, max_digits=10)),
                ('subtotal', models.DecimalField(decimal_places=2, max_digits=10)),
                ('notas', models.TextField(blank=True, null=True)),
                ('paciente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tratamientos', to='core.paciente')),
            ],
        ),
        migrations.CreateModel(
            name='Radiografia',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('imagen', models.ImageField(upload_to='radiografias/')),
                ('fecha_tomada', models.DateField(auto_now_add=True)),
                ('notas', models.TextField(blank=True, null=True)),
                ('nombre_archivo', models.CharField(default='sin_nombre', max_length=255)),
                ('paciente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='radiografias', to='core.paciente')),
            ],
        ),
        migrations.CreateModel(
            name='Pago',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha', models.DateField(auto_now_add=True)),
                ('monto', models.DecimalField(decimal_places=2, max_digits=10)),
                ('paciente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pagos', to='core.paciente')),
                ('tratamiento', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pagos', to='core.tratamiento')),
            ],
        ),
        migrations.CreateModel(
            name='HistorialPaciente',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('enfermedades_sistemicas', models.CharField(choices=[('Ninguna', 'Ninguna'), ('Diabetes', 'Diabetes'), ('Hipertensión', 'Hipertensión'), ('Otra', 'Otra')], max_length=255)),
                ('alergias', models.CharField(choices=[('Ninguna', 'Ninguna'), ('Medicamentos', 'Medicamentos'), ('Alimentos', 'Alimentos')], default='Ninguna', max_length=255)),
                ('detalle_alergia', models.CharField(blank=True, max_length=255, null=True)),
                ('tratamiento_medico', models.CharField(choices=[('Ninguna', 'Ninguna'), ('Si', 'Si')], default='Ninguna', max_length=255)),
                ('detalle_tratamiento', models.CharField(blank=True, max_length=255, null=True)),
                ('motivo_consulta', models.CharField(choices=[('Dolor', 'Dolor'), ('Revisión', 'Revisión'), ('Tratamiento Estético', 'Tratamiento Estético')], default='Revisión', max_length=255)),
                ('fecha_consulta', models.DateField()),
                ('tratamientos_previos', models.CharField(choices=[('Ninguna', 'Ninguna'), ('Extracciones', 'Extracciones'), ('Ortodoncia', 'Ortodoncia'), ('Endodoncia', 'Endodoncia')], max_length=255)),
                ('paciente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='historiales', to='core.paciente')),
            ],
        ),
        migrations.CreateModel(
            name='FacturaTratamiento',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('paciente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='facturas', to='core.paciente')),
                ('tratamientos', models.ManyToManyField(to='core.tratamiento')),
            ],
        ),
        migrations.CreateModel(
            name='Diagnostico',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dientes', models.CharField(choices=[('Presentes', 'Presentes'), ('Ausentes', 'Ausentes'), ('Restaurados', 'Restaurados')], default='Presentes', max_length=255)),
                ('notas_dientes', models.TextField(blank=True, null=True)),
                ('caries', models.CharField(choices=[('Si', 'Si'), ('No', 'No')], default='No', max_length=255)),
                ('notas_caries', models.TextField(blank=True, null=True)),
                ('encias', models.CharField(choices=[('Saludables', 'Saludables'), ('Inflamadas', 'Inflamadas'), ('Recesión Gingival', 'Recesión Gingival')], default='Saludables', max_length=255)),
                ('notas_encias', models.TextField(blank=True, null=True)),
                ('maloclusiones', models.CharField(choices=[('Clase I', 'Clase I'), ('Clase II', 'Clase II'), ('Clase III', 'Clase III')], default='Clase I', max_length=255)),
                ('notas_maloclusiones', models.TextField(blank=True, null=True)),
                ('lesiones', models.CharField(choices=[('Ninguna', 'Ninguna'), ('Úlceras', 'Úlceras'), ('Herpes', 'Herpes')], default='Ninguna', max_length=255)),
                ('notas_lesiones', models.TextField(blank=True, null=True)),
                ('hueso_maxilar', models.CharField(choices=[('Sano', 'Sano'), ('Reabsorción', 'Reabsorción'), ('Otro', 'Otro')], default='Sano', max_length=255)),
                ('notas_hueso_maxilar', models.TextField(blank=True, null=True)),
                ('paciente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.paciente')),
            ],
        ),
        migrations.CreateModel(
            name='Cita',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tipo_cita', models.CharField(choices=[('Consulta', 'Consulta'), ('Limpieza', 'Limpieza'), ('Ortodoncia', 'Ortodoncia')], max_length=100)),
                ('fecha_cita', models.DateField()),
                ('hora_inicio', models.TimeField()),
                ('hora_fin', models.TimeField()),
                ('google_event_id', models.CharField(blank=True, max_length=255, null=True, unique=True)),
                ('odontologo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='citas', to='core.dentista')),
                ('paciente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='citas', to='core.paciente')),
            ],
        ),
    ]