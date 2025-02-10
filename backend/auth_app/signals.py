from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Venta, PagoProveedor, RegistroCaja

# Registrar ingreso en caja tras una venta
@receiver(post_save, sender=Venta)
def registrar_venta_en_caja(sender, instance, created, **kwargs):
    if created and instance.total > 0:  # Asegúrate de que el total sea mayor a 0
        saldo_actual = RegistroCaja.objects.last().saldo_actual if RegistroCaja.objects.exists() else 0
        RegistroCaja.objects.create(
            tipo="entrada",
            monto=instance.total,
            descripcion=f"Ingreso por venta #{instance.id}",
            saldo_actual=saldo_actual + instance.total
        )
        
# Registrar salida en caja tras un pago a proveedor
@receiver(post_save, sender=PagoProveedor)
def registrar_pago_a_proveedor_en_caja(sender, instance, created, **kwargs):
    if created:
        # Crear un registro de caja con la salida por el pago al proveedor
        saldo_actual = RegistroCaja.objects.last().saldo_actual if RegistroCaja.objects.exists() else 0
        RegistroCaja.objects.create(
            tipo="salida",
            monto=instance.monto,
            descripcion=f"Pago a proveedor por compra #{instance.compra.id}",
            saldo_actual=saldo_actual - instance.monto
        )
