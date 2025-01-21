# auth_app/models.py
from django.contrib.auth.models import AbstractUser
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

class Lote(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name="lotes")
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_caducidad = models.DateField()

    def __str__(self):
        return f"Lote de {self.producto.nombre} - Cantidad: {self.cantidad}"



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
    venta = models.ForeignKey(
        Venta,
        on_delete=models.CASCADE,
        related_name="detalles"  # Relación para acceder desde Venta
    )
    producto = models.ForeignKey(
        Producto,
        on_delete=models.CASCADE,
        related_name="detalles"
    )
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, editable=False)

    def save(self, *args, **kwargs):
        self.subtotal = self.cantidad * self.precio_unitario
        super().save(*args, **kwargs)

    def __str__(self):
        return f"DetalleVenta (Producto: {self.producto}, Cantidad: {self.cantidad}, Subtotal: {self.subtotal})"


class Proveedor(models.Model):
    nombre = models.CharField(max_length=255)
    ruc = models.CharField(max_length=20, unique=True, default="DEFAULT_RUC")  # Agrega un valor predeterminado aquí
    telefono = models.CharField(max_length=15, blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nombre



class Compra(models.Model):
    proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE, related_name="compras")
    fecha = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"Compra {self.id} - Proveedor: {self.proveedor.nombre} - Total: {self.total}"
    

class DetalleCompra(models.Model):
    compra = models.ForeignKey(Compra, on_delete=models.CASCADE, related_name="detalles")
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name="compras")
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, editable=False)

    def save(self, *args, **kwargs):
        self.subtotal = self.cantidad * self.precio_unitario
        super().save(*args, **kwargs)

    def __str__(self):
        return f"DetalleCompra (Producto: {self.producto.nombre}, Cantidad: {self.cantidad}, Subtotal: {self.subtotal})"
        