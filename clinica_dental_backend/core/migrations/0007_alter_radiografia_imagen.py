# Generated by Django 4.2.16 on 2024-10-27 20:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0006_remove_dentista_especializacion_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='radiografia',
            name='imagen',
            field=models.ImageField(blank=True, null=True, upload_to='radiografias/'),
        ),
    ]
