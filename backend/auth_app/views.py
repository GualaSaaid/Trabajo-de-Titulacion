from django.contrib.auth import authenticate
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
import pandas as pd
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
from auth_app.utils.predecir_demanda import entrenar_modelo
from django.db.models import Sum
from datetime import datetime
from django.utils.timezone import now
from django.utils.timezone import localdate
from django.core.mail import send_mail
from django.shortcuts import render, redirect
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.core.cache import cache  # Para almacenar temporalmente el código
import random
import string
from decimal import Decimal
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Producto, Lote, Cliente, Venta, DetalleVenta, Proveedor, Compra, DetalleCompra, PagoProveedor, RegistroCaja, CorteCaja
from .serializers import ProductoSerializer, LoteSerializer, ClienteSerializer, VentaSerializer, DetalleVentaSerializer, ProveedorSerializer, CompraSerializer, DetalleCompraSerializer, PagoProveedorSerializer




class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if user is not None:
            return Response({"token": "dummy-token"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Credenciales inválidas"}, status=status.HTTP_400_BAD_REQUEST)

#-------------------------------------------------------------------------------------------------------
User = get_user_model()  # 📌 Obtiene el modelo de usuario personalizado

# 📌 Función para generar un código de recuperación aleatorio
def generar_codigo():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

# 📌 Vista para solicitar recuperación de contraseña
@csrf_exempt
def solicitar_recuperacion(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")

        if not email:
            return JsonResponse({"error": "Debes proporcionar un correo electrónico."}, status=400)

        try:
            user = User.objects.get(email=email)  # 📌 Busca el usuario
        except User.DoesNotExist:
            return JsonResponse({"error": "El usuario no existe."}, status=404)

        codigo_recuperacion = generar_codigo()  # 📌 Genera un código de recuperación

        # 📌 Almacenar el código en caché temporalmente (expira en 10 min)
        cache.set(f"recuperacion_{email}", codigo_recuperacion, timeout=600)

        try:
            send_mail(
                "Recuperación de Contraseña",
                f"Tu código de recuperación es: {codigo_recuperacion}\n\nPor favor, ingresa este código en el formulario de recuperación.",
                "abastosahorro@gmail.com",  # 📌 Remitente
                [email],  # 📌 Destinatario
                fail_silently=False,
            )
            return JsonResponse({"message": f"Se ha enviado un código a {email}"})
        except Exception as e:
            return JsonResponse({"error": f"Error al enviar el correo: {str(e)}"}, status=500)

# 📌 Vista para validar el código y cambiar la contraseña
@csrf_exempt
def cambiar_contrasena(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        codigo_usuario = data.get("codigo")
        nueva_contrasena = data.get("nueva_contrasena")

        if not email or not codigo_usuario or not nueva_contrasena:
            return JsonResponse({"error": "Faltan datos obligatorios."}, status=400)

        # 📌 Obtener el código almacenado
        codigo_guardado = cache.get(f"recuperacion_{email}")

        if not codigo_guardado or codigo_usuario != codigo_guardado:
            return JsonResponse({"error": "El código de recuperación es incorrecto o ha expirado."}, status=400)

        try:
            user = User.objects.get(email=email)  # 📌 Busca el usuario
        except User.DoesNotExist:
            return JsonResponse({"error": "El usuario no existe."}, status=404)

        user.password = make_password(nueva_contrasena)  # 📌 Guarda la nueva contraseña encriptada
        user.save()

        # 📌 Eliminar el código de recuperación después de su uso
        cache.delete(f"recuperacion_{email}")

        return JsonResponse({"message": "Contraseña cambiada."})

    return JsonResponse({"error": "Método no permitido."}, status=405)
#-----------------------------------------------------------------------------------------------

class ProductoViewSet(ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

    @action(detail=False, methods=['get'], url_path='buscar-por-codigo')
    def buscar_por_codigo(self, request):
        codigo = request.query_params.get('codigo', None)
        if codigo is not None:
            try:
                producto = Producto.objects.get(codigobarra=codigo)
                serializer = self.get_serializer(producto)
                return Response(serializer.data, status=200)
            except Producto.DoesNotExist:
                return Response({"detail": "No Producto matches the given query."}, status=404)
        return Response({"detail": "Código de barra no proporcionado."}, status=400)
    
    @action(detail=False, methods=['get'], url_path='buscar')
    def buscar_producto(self, request):
        nombre = request.query_params.get('nombre', None)
        if nombre:
            productos = Producto.objects.filter(nombre__icontains=nombre)
            serializer = self.get_serializer(productos, many=True)
            return Response(serializer.data, status=200)
        return Response({"error": "Debe proporcionar un nombre para la búsqueda"}, status=400)



#-------------------------------------------------------------------------------------------------------
class LoteViewSet(ModelViewSet):
    queryset = Lote.objects.order_by('fecha_caducidad')  # Orden FEFO
    serializer_class = LoteSerializer

    @action(detail=False, methods=['post'])
    def add_lote(self, request):
        """
        Agrega un nuevo lote a un producto.
        """
        producto_id = request.data.get("producto_id")
        cantidad = request.data.get("cantidad")
        fecha_caducidad = request.data.get("fecha_caducidad")

        try:
            producto = Producto.objects.get(id=producto_id)
            lote = Lote.objects.create(
                producto=producto,
                cantidad=cantidad,
                fecha_caducidad=fecha_caducidad
            )
            producto.stock += cantidad  # Actualizamos el stock del producto
            producto.save()
            return Response({"message": "Lote creado exitosamente."}, status=201)
        except Producto.DoesNotExist:
            return Response({"error": "Producto no encontrado."}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=400)


class VentaView(APIView):
    def post(self, request):
        cliente_id = request.data.get("cliente_id")
        cliente_data = request.data.get("cliente", None)
        codigos_barras = request.data.get("productos", [])
        cantidades = request.data.get("cantidades", [])

        if len(codigos_barras) != len(cantidades):
            return Response({"error": "Códigos de barra y cantidades no coinciden"}, status=400)

        try:
            # Asignar cliente correctamente
            cliente = None
            if cliente_id and cliente_id != "0000000000":
                cliente = Cliente.objects.filter(id=cliente_id).first()
            elif cliente_data:
                cliente, _ = Cliente.objects.update_or_create(
                    cedula=cliente_data.get("cedula", "0000000000"),
                    defaults={
                        "nombre": cliente_data.get("nombre", "Consumidor Final"),
                        "direccion": cliente_data.get("direccion", ""),
                        "email": cliente_data.get("email", ""),
                        "telefono": cliente_data.get("telefono", ""),
                    },
                )

            if not cliente:
                cliente, _ = Cliente.objects.get_or_create(
                    cedula="0000000000", defaults={"nombre": "Consumidor Final"}
                )

            # Crear la venta con el cliente asociado
            venta = Venta.objects.create(cliente=cliente)

            total_venta = Decimal("0.00")

            for codigo_barra, cantidad in zip(codigos_barras, cantidades):
                producto = get_object_or_404(Producto, codigobarra=codigo_barra)

                if producto.stock < cantidad:
                    return Response(
                        {"error": f"Stock insuficiente para {producto.nombre}"},
                        status=400,
                    )

                # Crear detalle de venta
                DetalleVenta.objects.create(
                    venta=venta,
                    producto=producto,
                    cantidad=cantidad,
                    precio_unitario=producto.precio,
                )

                # Actualizar stock
                producto.stock -= cantidad
                producto.save()

                total_venta += Decimal(cantidad) * Decimal(producto.precio)

            # Actualizar total de la venta
            venta.total = total_venta
            venta.save()

            # ✅ **REGISTRAR ENTRADA EN CAJA**
            ultimo_registro = RegistroCaja.objects.last()
            saldo_anterior = Decimal(ultimo_registro.saldo_actual) if ultimo_registro else Decimal("0.00")
            saldo_actual = saldo_anterior + total_venta

            RegistroCaja.objects.create(
                tipo="entrada",
                monto=total_venta,
                descripcion=f"Venta #{venta.id}",
                saldo_actual=saldo_actual
            )

            serializer = VentaSerializer(venta)
            return Response(serializer.data, status=201)

        except Cliente.DoesNotExist:
            return Response({"error": "Cliente no encontrado"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

    def get(self, request, pk=None):
        try:
            if pk:
                venta = get_object_or_404(Venta, pk=pk)
                serializer = VentaSerializer(venta)
                return Response(serializer.data, status=200)
            else:
                ventas = Venta.objects.all().order_by('-fecha')
                serializer = VentaSerializer(ventas, many=True)
                return Response(serializer.data, status=200)
        except Venta.DoesNotExist:
            return Response({"error": "Venta no encontrada"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

class ClienteViewSet(ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer



class CargarArchivoView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file', None)

        if not file:
            return Response({"error": "No se proporcionó ningún archivo."}, status=400)

        try:
            # Leer el archivo Excel
            data = pd.read_excel(file, engine='openpyxl')

            # Contadores de nuevos productos y duplicados
            nuevos_productos = 0
            productos_duplicados = 0

            # Procesar filas del Excel
            for _, row in data.iterrows():
                producto_existente = Producto.objects.filter(codigobarra=row['codigobarra']).first()

                if producto_existente:
                    # Si el producto ya existe, actualizar sin tocar stock
                    producto_existente.nombre = row['nombre']
                    producto_existente.descripcion = row['descripcion']
                    producto_existente.precio = row['precio']
                    producto_existente.contenido = row['contenido']
                    producto_existente.fecha_elaboracion = row['fecha_elaboracion']
                    producto_existente.fecha_caducidad = row['fecha_caducidad']
                    producto_existente.marca = row['marca']
                    producto_existente.save()
                    productos_duplicados += 1
                else:
                    # Si el producto no existe, crearlo con stock desde el archivo
                    Producto.objects.create(
                        codigobarra=row['codigobarra'],
                        nombre=row['nombre'],
                        descripcion=row['descripcion'],
                        precio=row['precio'],
                        contenido=row['contenido'],
                        fecha_elaboracion=row['fecha_elaboracion'],
                        fecha_caducidad=row['fecha_caducidad'],
                        marca=row['marca'],
                        stock=row['stock']  # Solo asignar stock a nuevos productos
                    )
                    nuevos_productos += 1

            return Response({
                "message": f"Archivo procesado correctamente.",
                "nuevos_productos": nuevos_productos,
                "productos_duplicados": productos_duplicados
            }, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=400)



class ProveedorViewSet(viewsets.ModelViewSet):
    queryset = Proveedor.objects.all().order_by('nombre')  # Ordenar alfabéticamente
    serializer_class = ProveedorSerializer



class CompraView(APIView):
    def get(self, request):
        """
        Recuperar todas las compras realizadas.
        """
        try:
            compras = Compra.objects.all().order_by('-fecha')
            serializer = CompraSerializer(compras, many=True)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

    def post(self, request):
        try:
            data = request.data
            proveedor_id = data.pop("proveedor")  # Extrae el ID del proveedor
            proveedor = get_object_or_404(Proveedor, id=proveedor_id)  # Busca el proveedor
            detalles = data.pop("detalles", [])

            compra = Compra.objects.create(proveedor=proveedor, **data)
            total = 0

            for detalle in detalles:
                producto = Producto.objects.get(id=detalle["producto"])
                DetalleCompra.objects.create(
                    compra=compra,
                    producto=producto,
                    cantidad=detalle["cantidad"],
                    precio_unitario=producto.precio,
                    subtotal=detalle["cantidad"] * producto.precio,
                )
                # Actualiza el stock del producto
                producto.stock += detalle["cantidad"]
                producto.save()
                total += detalle["cantidad"] * producto.precio

            compra.total = total
            compra.saldo_pendiente = total
            compra.save()

            serializer = CompraSerializer(compra)
            return Response(serializer.data, status=201)
        except Producto.DoesNotExist:
            return Response({"error": "Producto no encontrado."}, status=404)
        except Proveedor.DoesNotExist:
            return Response({"error": "Proveedor no encontrado."}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

        


class PagoProveedorView(APIView):
    def get(self, request):
        """
        Retrieve all payments to providers.
        """
        pagos = PagoProveedor.objects.all()
        serializer = PagoProveedorSerializer(pagos, many=True)
        return Response(serializer.data, status=200)

    def post(self, request):
        """
        Register a payment to a provider and update both the purchase balance and cash register.
        """
        compra_id = request.data.get("compra")
        monto = Decimal(request.data.get("monto", 0))

        if not compra_id or not monto:
            return Response({"error": "Compra y monto son requeridos"}, status=400)

        try:
            # Get the purchase record
            compra = Compra.objects.get(id=compra_id)

            # Validate that the payment amount does not exceed the pending balance
            if monto > compra.saldo_pendiente:
                return Response({"error": "El monto supera el saldo pendiente"}, status=400)

            # Register the payment
            PagoProveedor.objects.create(compra=compra, monto=monto)

            # Update the purchase's pending balance and status
            compra.saldo_pendiente -= monto
            compra.estado = "pagado" if compra.saldo_pendiente <= 0 else "pendiente"
            compra.save()

            # Update the cash register with a "salida"
            ultimo_registro = RegistroCaja.objects.last()
            saldo_anterior = ultimo_registro.saldo_actual if ultimo_registro else 0
            nuevo_saldo = saldo_anterior - monto

            RegistroCaja.objects.create(
                tipo="salida",
                monto=monto,
                descripcion=f"Pago a proveedor {compra.proveedor.nombre}",
                saldo_actual=nuevo_saldo
            )

            # Return the updated purchase information
            return Response(CompraSerializer(compra).data, status=201)

        except Compra.DoesNotExist:
            return Response({"error": "Compra no encontrada"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

        


class RegistroCajaView(APIView):
    def get(self, request):
        # Filtra por fecha específica si se pasa como parámetro
        fecha = request.query_params.get('fecha', None)
        if fecha:
            registros = RegistroCaja.objects.filter(fecha_hora__date=fecha).order_by('-fecha_hora')
        else:
            # Filtra por el día actual si no se pasa ninguna fecha
            registros = RegistroCaja.objects.filter(fecha_hora__date=now().date()).order_by('-fecha_hora')

        data = [
            {
                "fecha_hora": registro.fecha_hora,
                "tipo": registro.tipo,
                "monto": registro.monto,
                "descripcion": registro.descripcion,
                "saldo_actual": registro.saldo_actual,
            }
            for registro in registros
        ]
        return Response(data, status=200)


    def post(self, request):
        """
        Crea un nuevo registro de caja y actualiza el saldo actual.
        """
        try:
            data = request.data
            ultimo_registro = RegistroCaja.objects.last()
            saldo_anterior = Decimal(ultimo_registro.saldo_actual) if ultimo_registro else Decimal("0.00")

            # Convertir el monto ingresado a Decimal
            monto = Decimal(data['monto'])

            # Calcular el saldo actual
            if data['tipo'] == 'entrada':
                saldo_actual = saldo_anterior + monto
            elif data['tipo'] == 'salida':
                saldo_actual = saldo_anterior - monto
            else:
                return Response({"error": "Tipo de movimiento inválido"}, status=400)

            # Crear el registro
            registro = RegistroCaja.objects.create(
                tipo=data['tipo'],
                monto=monto,
                descripcion=data['descripcion'],
                saldo_actual=saldo_actual
            )

            return Response({
                "id": registro.id,
                "tipo": registro.tipo,
                "monto": str(registro.monto),
                "descripcion": registro.descripcion,
                "saldo_actual": str(registro.saldo_actual)
            }, status=201)
        except Exception as e:
            return Response({"error": str(e)}, status=400)
        

class CorteCajaView(APIView):
    def get(self, request):
        """
        Obtener el resumen del día actual.
        """
        try:
            registros_hoy = RegistroCaja.objects.filter(fecha_hora__date=now().date())
            saldo_inicial = registros_hoy.first().saldo_actual if registros_hoy.exists() else 0.00
            total_entradas = sum(registro.monto for registro in registros_hoy if registro.tipo == "entrada")
            total_salidas = sum(registro.monto for registro in registros_hoy if registro.tipo == "salida")
            saldo_final = total_entradas - total_salidas

            return Response({
                "saldo_inicial": saldo_inicial,
                "total_entradas": total_entradas,
                "total_salidas": total_salidas,
                "saldo_final": saldo_final,
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        """
        Realizar el corte de caja del día actual.
        """
        try:
            # Verificar si ya se realizó el corte de hoy
            if CorteCaja.objects.filter(fecha=now().date()).exists():
                return Response({"error": "Ya se realizó el corte de caja para el día de hoy."}, status=status.HTTP_400_BAD_REQUEST)

            registros_hoy = RegistroCaja.objects.filter(fecha_hora__date=now().date())
            saldo_inicial = registros_hoy.first().saldo_actual if registros_hoy.exists() else 0.00
            total_entradas = sum(registro.monto for registro in registros_hoy if registro.tipo == "entrada")
            total_salidas = sum(registro.monto for registro in registros_hoy if registro.tipo == "salida")
            saldo_final = total_entradas - total_salidas

            # Obtener el efectivo real ingresado por el usuario
            efectivo_real = Decimal(request.data.get("efectivo_real", saldo_final))
            discrepancia = efectivo_real - saldo_final

            # Crear el corte de caja
            corte = CorteCaja.objects.create(
                saldo_inicial=saldo_inicial,
                total_entradas=total_entradas,
                total_salidas=total_salidas,
                saldo_final=saldo_final,
                efectivo_real=efectivo_real,
                discrepancia=discrepancia,
            )

            return Response({
                "fecha": corte.fecha,
                "saldo_inicial": corte.saldo_inicial,
                "total_entradas": corte.total_entradas,
                "total_salidas": corte.total_salidas,
                "saldo_final": corte.saldo_final,
                "efectivo_real": corte.efectivo_real,
                "discrepancia": corte.discrepancia,
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ReporteView(APIView):
    def get(self, request):
        hoy = now().date()

        # Total de ventas del día
        total_ventas = Venta.objects.filter(fecha__date=hoy).aggregate(Sum('total'))['total__sum'] or 0

        # Total de pagos a proveedores del día
        total_pagos = PagoProveedor.objects.filter(fecha__date=hoy).aggregate(Sum('monto'))['monto__sum'] or 0

        # Total de entradas y salidas del día
        total_entradas = RegistroCaja.objects.filter(fecha_hora__date=hoy, tipo='entrada').aggregate(Sum('monto'))['monto__sum'] or 0
        total_salidas = RegistroCaja.objects.filter(fecha_hora__date=hoy, tipo='salida').aggregate(Sum('monto'))['monto__sum'] or 0

        return Response({
            "total_ventas": total_ventas,
            "total_pagos": total_pagos,
            "total_entradas": total_entradas,
            "total_salidas": total_salidas
        })
    

#VIEW PARA PODER BUSCAR POR NOMBRE EN MIS VENTAS


class ProductoView(APIView):
    def get(self, request):
        query = request.GET.get("nombre", None)
        if query:
            productos = Producto.objects.filter(Q(nombre__icontains=query))
            serializer = ProductoSerializer(productos, many=True)
            return Response(serializer.data, status=200)
        return Response({"error": "Debe proporcionar un nombre de producto"}, status=400)


@csrf_exempt
def predecir_demanda(request):
    if request.method == "POST":
        try:
            # Obtener los datos del cuerpo de la solicitud
            data = json.loads(request.body)
            fecha_inicio = data.get("fecha_inicio")
            fecha_fin = data.get("fecha_fin")

            # Validar que se proporcionaron las fechas
            if not fecha_inicio or not fecha_fin:
                return JsonResponse({"error": "Debes proporcionar una fecha de inicio y una fecha de fin."}, status=400)

            # Llamar a la función entrenar_modelo
            resultado = entrenar_modelo(fecha_inicio, fecha_fin)
            
            # Devolver el resultado como JSON
            return JsonResponse(resultado, safe=False)
        
        except json.JSONDecodeError:
            return JsonResponse({"error": "El cuerpo de la solicitud no es un JSON válido."}, status=400)
        
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    # Si el método no es POST, devolver un error
    return JsonResponse({"error": "Método no permitido"}, status=405)
