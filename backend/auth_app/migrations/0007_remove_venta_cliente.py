# Generated by Django 5.1.3 on 2025-01-03 04:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('auth_app', '0006_alter_detalleventa_venta'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='venta',
            name='cliente',
        ),
    ]
