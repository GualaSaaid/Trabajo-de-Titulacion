# auth_app/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import Producto, Venta, DetalleVenta, Proveedor, Compra, DetalleCompra
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Credenciales inválidas")
        return {"user": user}


class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'



class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'
    def validate(self, data):
        if data['fecha_caducidad'] <= data['fecha_elaboracion']:
            raise serializers.ValidationError(
                "La fecha de caducidad debe ser posterior a la fecha de elaboración."
            )
        return data


from rest_framework import serializers
from .models import Cliente

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'


class DetalleVentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleVenta
        fields = ['__all__']

class VentaSerializer(serializers.ModelSerializer):
    detalles = DetalleVentaSerializer(many=True, read_only=True)

    class Meta:
        model = Venta
        fields = ['id', 'fecha', 'estado', 'total', 'detalles'] 


class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor
        fields = '__all__'

    def validate_ruc(self, value):
        if not value.isdigit() or len(value) != 13:
            raise serializers.ValidationError("El RUC debe tener 13 dígitos.")
        return value



class DetalleCompraSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleCompra
        fields = ['producto', 'cantidad', 'precio_unitario', 'subtotal']



class CompraSerializer(serializers.ModelSerializer):
    detalles = DetalleCompraSerializer(many=True)

    class Meta:
        model = Compra
        fields = ['id', 'proveedor', 'fecha', 'total', 'detalles']

    def create(self, validated_data):
        detalles_data = validated_data.pop('detalles')
        compra = Compra.objects.create(**validated_data)

        total = 0
        for detalle_data in detalles_data:
            producto = detalle_data['producto']
            cantidad = detalle_data['cantidad']
            precio_unitario = detalle_data['precio_unitario']

            # Crear el detalle de la compra
            DetalleCompra.objects.create(
                compra=compra,
                producto=producto,
                cantidad=cantidad,
                precio_unitario=precio_unitario,
                subtotal=cantidad * precio_unitario,
            )

            # Actualizar el stock del producto
            producto.stock += cantidad
            producto.save()

            total += cantidad * precio_unitario

        # Actualizar el total de la compra
        compra.total = total
        compra.save()

        return compra


class ProductoPagination(PageNumberPagination):
    page_size = 5  # Número de productos por página

    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })