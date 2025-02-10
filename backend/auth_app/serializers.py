from rest_framework import serializers
from .models import Producto, Lote, Cliente, Venta, DetalleVenta, Proveedor, Compra, DetalleCompra, PagoProveedor
from django.db.models import Sum


class LoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lote
        fields = ['id', 'producto', 'cantidad', 'fecha_caducidad', 'creado_en']

class ProductoSerializer(serializers.ModelSerializer):
    # Incluye los lotes relacionados como un campo anidado
    lotes = LoteSerializer(many=True, read_only=True)
    
    class Meta:
        model = Producto
        fields = [
            'id',
            'nombre',
            'descripcion',
            'precio',
            'stock',
            'contenido',
            'fecha_elaboracion',
            'fecha_caducidad',
            'codigobarra',
            'marca',
            'lotes',  # Asegúrate de incluir este campo
        ]

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ['id', 'nombre', 'email', 'telefono', 'direccion', 'cedula']


class DetalleVentaSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.ReadOnlyField(source='producto.nombre')

    class Meta:
        model = DetalleVenta
        fields = ['id', 'producto', 'producto_nombre', 'cantidad', 'precio_unitario', 'subtotal']


class VentaSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.CharField(
        source='cliente.nombre', default='Consumidor Final', read_only=True
    )  # Mostrará "Consumidor Final" si el cliente es NULL
    detalles = DetalleVentaSerializer(many=True, read_only=True)

    class Meta:
        model = Venta
        fields = ['id', 'cliente', 'cliente_nombre', 'fecha', 'total', 'detalles']
    def get_cliente_nombre(self, obj):
        # Si no hay cliente, devuelve "Consumidor Final"
        if obj.cliente:
            return obj.cliente.nombre
        return "Consumidor Final"
    


class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor
        fields = ['id', 'nombre', 'direccion', 'telefono', 'email', 'contacto']



class DetalleCompraSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.ReadOnlyField(source="producto.nombre")

    class Meta:
        model = DetalleCompra
        fields = ["id", "producto", "producto_nombre", "cantidad", "precio_unitario", "subtotal"]


class CompraSerializer(serializers.ModelSerializer):
    detalles = DetalleCompraSerializer(many=True, read_only=True)
    proveedor_nombre = serializers.ReadOnlyField(source="proveedor.nombre")
    pagos = serializers.SerializerMethodField()
    productos = serializers.SerializerMethodField()

    def get_pagos(self, obj):
        return PagoProveedor.objects.filter(compra=obj).aggregate(total_pagado=Sum("monto"))["total_pagado"] or 0

    def get_productos(self, obj):
        return [detalle.producto.nombre for detalle in obj.detalles.all()]
    
    class Meta:
        model = Compra
        fields = ["id", "proveedor", "proveedor_nombre", "fecha", "total", "saldo_pendiente", "estado", "detalles", "pagos", "productos"]


class PagoProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = PagoProveedor
        fields = "__all__"


