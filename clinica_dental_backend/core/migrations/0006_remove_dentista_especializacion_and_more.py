# Generated by Django 4.2.16 on 2024-10-27 06:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_especialidad_alter_facturatratamiento_tratamientos_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='dentista',
            name='especializacion',
        ),
        migrations.AddField(
            model_name='dentista',
            name='especialidad',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='core.especialidad'),
            preserve_default=False,
        ),
    ]