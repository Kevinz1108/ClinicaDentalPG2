# Generated by Django 4.2.16 on 2024-10-27 02:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='historialpaciente',
            name='fecha_consulta',
            field=models.DateField(auto_now_add=True),
        ),
    ]
