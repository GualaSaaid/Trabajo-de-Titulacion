# Generated by Django 5.1.3 on 2025-01-03 04:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth_app', '0004_venta_detalleventa'),
    ]

    operations = [
        migrations.AlterField(
            model_name='producto',
            name='contenido',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='producto',
            name='marca',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
