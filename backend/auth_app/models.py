from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.timezone import now
from django.core.validators import RegexValidator


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)  # Hacer que el correo sea único
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return self.email


class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    contenido = models.CharField(max_length=50)
    fecha_elaboracion = models.DateTimeField(blank=True, null=True)
    fecha_caducidad = models.DateTimeField(blank=True, null=True)
    codigobarra = models.CharField(max_length=50, default="SIN-CODIGO")
    marca = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre


class Lote(models.Model):
    producto = models.ForeignKey(
        Producto, on_delete=models.CASCADE, related_name='lotes')
    cantidad = models.IntegerField()
    fecha_caducidad = models.DateField(null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.producto.nombre} - Lote {self.id} ({self.cantidad} unidades)"


class Cliente(models.Model):
    nombre = models.CharField(max_length=200)
    email = models.EmailField(blank=True, null=True)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)
    cedula = models.CharField(
        max_length=10,
        validators=[
            RegexValidator(
                regex=r'^\d{10}$',
                message='La cédula debe tener exactamente 10 dígitos.'
            )
        ],
        unique=True
    )

    def __str__(self):
        return self.nombre


class Venta(models.Model):
    cliente = models.ForeignKey(
        Cliente,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )  # Cliente asociado a la venta (opcional para consumidor final)
    fecha = models.DateTimeField(default=now)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def calcular_total(self):
        self.total = sum(item.subtotal for item in self.detalles.all())
        self.save()

    def __str__(self):
        return f"Venta {self.id} - Total: ${self.total}"


class DetalleVenta(models.Model):
    venta = models.ForeignKey(
        Venta,  # Referencia al modelo Venta
        on_delete=models.CASCADE,
        related_name="detalles"
    )
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, editable=False)

    def save(self, *args, **kwargs):
        self.subtotal = self.cantidad * self.precio_unitario
        super().save(*args, **kwargs)

    def __str__(self):
        return f"DetalleVenta ({self.producto.nombre}, {self.cantidad})"


class Proveedor(models.Model):
    nombre = models.CharField(max_length=100)
    direccion = models.CharField(max_length=200, blank=True, null=True)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    contacto = models.CharField(max_length=100, blank=True, null=True)  # Nombre del contacto

    def __str__(self):
        return self.nombre

class Compra(models.Model):
    proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    saldo_pendiente = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    estado = models.CharField(
        max_length=20,
        choices=[("pendiente", "Pendiente"), ("pagado", "Pagado")],
        default="pendiente",
    )

    def __str__(self):
        return f"Compra {self.id} - {self.proveedor.nombre}"


class DetalleCompra(models.Model):
    compra = models.ForeignKey(Compra, on_delete=models.CASCADE, related_name="detalles")
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Detalle Compra {self.compra.id} - {self.producto.nombre}"


class PagoProveedor(models.Model):
    compra = models.ForeignKey(Compra, on_delete=models.CASCADE, related_name="pagos")
    fecha = models.DateTimeField(auto_now_add=True)
    monto = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Pago {self.id} - Compra {self.compra.id}"
    

class RegistroCaja(models.Model):
    fecha_hora = models.DateTimeField(auto_now_add=True)  # Fecha y hora del registro
    tipo = models.CharField(max_length=10, choices=[('entrada', 'Entrada'), ('salida', 'Salida')])
    monto = models.DecimalField(max_digits=10, decimal_places=2)  # Monto del movimiento
    descripcion = models.TextField()  # Razón o descripción del movimiento
    saldo_actual = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # Saldo después del movimiento

    def __str__(self):
        return f"{self.fecha_hora} - {self.tipo}: ${self.monto}"


class CorteCaja(models.Model):
    fecha = models.DateField(auto_now_add=True)  # Fecha del corte
    saldo_inicial = models.DecimalField(max_digits=10, decimal_places=2)
    total_entradas = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_salidas = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    saldo_final = models.DecimalField(max_digits=10, decimal_places=2)
    efectivo_real = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Efectivo contado
    discrepancia = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # Diferencia entre saldo final y real
    cerrado = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Corte de Caja {self.fecha} - Saldo Final: ${self.saldo_final}"