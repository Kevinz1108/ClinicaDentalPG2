# Generated by Django 4.2.16 on 2024-10-27 03:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_tipotratamiento_categoria'),
    ]

    operations = [
        migrations.AddField(
            model_name='tipotratamiento',
            name='especialidad',
            field=models.CharField(default=1, max_length=100, unique=True),
            preserve_default=False,
        ),
    ]
