# Generated by Django 5.1.3 on 2025-01-03 04:22

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth_app', '0005_alter_producto_contenido_alter_producto_marca'),
    ]

    operations = [
        migrations.AlterField(
            model_name='detalleventa',
            name='venta',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='detalles', to='auth_app.venta'),
        ),
    ]
