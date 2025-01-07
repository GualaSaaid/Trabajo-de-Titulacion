# auth_app/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError

class Producto(models.Model):
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True, null=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()
    contenido = models.CharField(max_length=100, blank=True, null=True)
    fecha_elaboracion = models.DateTimeField(default=timezone.now)
    fecha_caducidad = models.DateTimeField(default=timezone.now)
    codigobarra = models.CharField(max_length=255, blank=True, null=True)
    marca = models.CharField(max_length=100, blank=True, null=True)

    def clean(self):
        if self.fecha_caducidad <= self.fecha_elaboracion:
            raise ValidationError('La fecha de caducidad debe ser posterior a la fecha de elaboración.')

    def __str__(self):
        return self.nombre


class CustomUser(AbstractUser):
    # Agrega campos personalizados aquí si es necesario
    pass



class Cliente(models.Model):
    nombre = models.CharField(max_length=100, verbose_name="Nombre")
    direccion = models.CharField(max_length=255, blank=True, null=True, verbose_name="Dirección")
    correo = models.EmailField(max_length=100, blank=True, null=True, verbose_name="Correo Electrónico")
    telefono = models.CharField(max_length=15, blank=True, null=True, verbose_name="Teléfono")
    ruc_nit = models.CharField(max_length=20, unique=True, verbose_name="RUC o NIT")
    fecha_registro = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Registro")

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "Cliente"
        verbose_name_plural = "Clientes"


class Venta(models.Model):
    cliente = models.ForeignKey(
    Cliente, on_delete=models.CASCADE, related_name="ventas", null=True, blank=True
    )
    fecha = models.DateTimeField(default=timezone.now)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    estado = models.CharField(max_length=50, choices=[('pendiente', 'Pendiente'), ('pagada', 'Pagada')], default='pendiente')

    def __str__(self):
        return f"Venta {self.id} - Total: {self.total}"

    def calcular_total(self):
        # Recalcular el total de la venta basado en los productos relacionados
        total = sum(detalle.subtotal for detalle in self.detalleventa_set.all())
        self.total = total
        self.save()

class DetalleVenta(models.Model):
    venta = models.ForeignKey(Venta, related_name='detalles', on_delete=models.CASCADE)
    producto = models.ForeignKey('Producto', on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        # Calcular el subtotal al momento de guardar
        self.subtotal = self.cantidad * self.precio_unitario
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.cantidad} x {self.producto.nombre} - Subtotal: {self.subtotal}"


class Proveedor(models.Model):
    nombre = models.CharField(max_length=255, verbose_name="Nombre del Proveedor")
    contacto = models.CharField(max_length=255, verbose_name="Persona de Contacto", blank=True, null=True)
    telefono = models.CharField(max_length=15, verbose_name="Teléfono", blank=True, null=True)
    email = models.EmailField(verbose_name="Correo Electrónico", blank=True, null=True)
    direccion = models.TextField(verbose_name="Dirección", blank=True, null=True)
    ruc = models.CharField(max_length=20, verbose_name="RUC", blank=True, null=True, unique=True)

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "Proveedor"
        verbose_name_plural = "Proveedores" 


from django.db import models

