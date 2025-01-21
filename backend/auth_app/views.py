from django.contrib.auth import authenticate
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes
from rest_framework.pagination import PageNumberPagination
from rest_framework import status, viewsets, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Producto, Venta
from .models import DetalleVenta
from django.core.exceptions import ValidationError
from django.template.loader import render_to_string
from django.template import Context
import openpyxl
from .serializers import ProductoSerializer, VentaSerializer, DetalleVentaSerializer, ProveedorSerializer, ProductoPagination, ClienteSerializer, CompraSerializer
from django.contrib.auth.models import User
import random
import pandas as pd
import string
from django.core.mail import send_mail
from django.http import JsonResponse
from .models import Venta, DetalleVenta, Producto, Proveedor, Cliente, Compra
from django.db import transaction


@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    
    if user is not None:
        return Response({"message": "Credenciales exitosas. ¡Bienvenido!"}, status=status.HTTP_200_OK)
    else:
        return Response({"message": "Error en las credenciales."}, status=status.HTTP_400_BAD_REQUEST)


class ProductoList(APIView):
    def get(self, request):
        productos = Producto.objects.all()
        serializer = ProductoSerializer(productos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post (self, request):
        serializer = ProductoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ProductoDetailView(APIView):
    def delete(self, request, pk):
        try:
            producto = Producto.objects.get(pk=pk)
            # Desvincula los detalles de venta
            DetalleVenta.objects.filter(producto=producto).update(producto=None)
            producto.delete()
            return Response({"message": "Producto eliminado correctamente"}, status=status.HTTP_204_NO_CONTENT)
        except Producto.DoesNotExist:
            return Response({"error": "Producto no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ProductoDetail(APIView):
    def delete(self, request, pk):
        try:
            producto = Producto.objects.get(pk=pk)
            producto.detalles.all().delete()  # Si related_name='detalles'
            producto.delete()
            return Response({"message": "Producto eliminado con éxito"}, status=status.HTTP_204_NO_CONTENT)
        except Producto.DoesNotExist:
            return Response({"error": "Producto no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def put(self, request, pk):
        try:
            producto = Producto.objects.get(pk=pk)
            serializer = ProductoSerializer(producto, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Producto.DoesNotExist:
            return Response({"error": "Producto no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"Error inesperado: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ProductoViewSet(ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

class CrearDetalleVentaAPIView(APIView):
    def post(self, request):
        try:
            venta_id = request.data.get('venta_id')
            producto_id = request.data.get('producto_id')
            cantidad = request.data.get('cantidad')
            precio_unitario = request.data.get('precio_unitario')

            venta = Venta.objects.get(id=venta_id)
            producto = Producto.objects.get(id=producto_id)

            detalle = DetalleVenta.objects.create(
                venta=venta,
                producto=producto,
                cantidad=cantidad,
                precio_unitario=precio_unitario
            )

            return Response({
                "message": "Detalle de venta creado exitosamente",
                "subtotal": detalle.subtotal
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def reset_password_request(request):
    email = request.data.get('email')  # Obtiene el email del cuerpo JSON
    if not email:
        return JsonResponse({'error': 'El campo email es obligatorio.'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Busca el usuario asociado con el correo
        user = User.objects.get(email=email)
        # Genera una nueva contraseña aleatoria
        new_password = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
        user.set_password(new_password)  # Establece la nueva contraseña
        user.save()

        # Envía la nueva contraseña al correo electrónico del usuario
        send_mail(
            'Recuperación de contraseña',
            f'Tu nueva contraseña es: {new_password}',
            'tucorreo@gmail.com',  # Asegúrate de poner tu correo de remitente
            [email],                   # Email destinatario
            fail_silently=False,
        )

        return JsonResponse({'message': 'Se envió la nueva contraseña a tu correo.'}, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return JsonResponse({'error': 'El correo no está registrado.'}, status=status.HTTP_404_NOT_FOUND)

class DetalleVentaViewSet(viewsets.ModelViewSet):
    queryset = DetalleVenta.objects.all()
    serializer_class = DetalleVentaSerializer


@api_view(['POST'])
def upload_products_excel(request):
    if request.method == 'POST' and request.FILES.get('excel_file'):
        excel_file = request.FILES['excel_file']

        try:
            # Leer el archivo Excel usando pandas
            df = pd.read_excel(excel_file)

            # Iterar sobre cada fila del DataFrame y crear un objeto Producto
            for index, row in df.iterrows():
                try:
                    # Manejar valores faltantes
                    nombre = row['nombre'] if pd.notna(row['nombre']) else f"Producto_{index}"
                    descripcion = row['descripcion'] if pd.notna(row['descripcion']) else "Sin descripción"
                    precio = row['precio'] if pd.notna(row['precio']) else 0.0
                    stock = row['stock'] if pd.notna(row['stock']) else 0
                    contenido = row['contenido'] if pd.notna(row['contenido']) else "Sin contenido"
                    codigobarra = row['codigobarra'] if pd.notna(row['codigobarra']) else "Sin código"
                    marca = row['marca'] if pd.notna(row['marca']) else "Sin marca"

                    # Validar fechas
                    fecha_elaboracion = (
                        pd.to_datetime(row['fecha_elaboracion']).replace(tzinfo=None)
                        if pd.notna(row['fecha_elaboracion'])
                        else None
                    )
                    fecha_caducidad = (
                        pd.to_datetime(row['fecha_caducidad']).replace(tzinfo=None)
                        if pd.notna(row['fecha_caducidad'])
                        else None
                    )

                    # Crear el producto y validarlo
                    producto = Producto(
                        nombre=nombre,
                        descripcion=descripcion,
                        precio=precio,
                        stock=stock,
                        contenido=contenido,
                        fecha_elaboracion=fecha_elaboracion,
                        fecha_caducidad=fecha_caducidad,
                        codigobarra=codigobarra,
                        marca=marca,
                    )

                    # Validar y guardar el producto
                    producto.clean()
                    producto.save()

                except ValidationError as ve:
                    return JsonResponse({"error": f"Error en el producto {nombre}: {str(ve)}"}, status=400)
                except Exception as e:
                    return JsonResponse({"error": f"Error al procesar el producto {nombre}: {str(e)}"}, status=400)

            return JsonResponse({"message": "Productos cargados exitosamente."}, status=200)

        except Exception as e:
            return JsonResponse({"error": f"Hubo un error al procesar el archivo: {str(e)}"}, status=400)

    return JsonResponse({"error": "No se recibió ningún archivo Excel."}, status=400)


class VentaViewSet(viewsets.ModelViewSet):
    queryset = Venta.objects.all()
    serializer_class = VentaSerializer

    def list(self, request, *args, **kwargs):
        ventas = self.queryset
        data = [
            {
                "id": venta.id,
                "fecha": venta.fecha.strftime("%Y-%m-%d %H:%M:%S"),
                "total": float(venta.total),
                "estado": venta.estado,
                "cliente": venta.cliente.nombre if venta.cliente else "Consumidor Final",
                "productos": [
                    {
                        "producto_id": detalle.producto.id,
                        "nombre": detalle.producto.nombre,
                        "cantidad": detalle.cantidad,
                        "precio_unitario": float(detalle.precio_unitario),
                        "subtotal": float(detalle.subtotal),
                    }
                    for detalle in venta.detalles.all()
                ],
            }
            for venta in ventas
        ]
        return Response(data)


@api_view(['GET'])
def buscar_producto_por_codigo_barra(request, codigo_barra):
    try:
        producto = Producto.objects.get(codigobarra=codigo_barra)
        return Response(ProductoSerializer(producto).data)
    except Producto.DoesNotExist:
        return Response({"error": "Producto no encontrado"}, status=status.HTTP_404_NOT_FOUND)




venta_actual = []

def escanear_producto(request):
    codigo_barras = request.GET.get('codigo_barras')  # Obtén el código de barras de la URL
    try:
        # Buscar el producto por código de barras
        producto = Producto.objects.get(codigo_barras=codigo_barras)

        # Verificar si el producto ya está en la venta
        for item in venta_actual:
            if item['codigo_barras'] == codigo_barras:
                item['cantidad'] += 1
                item['subtotal'] = item['cantidad'] * float(producto.precio)
                break
        else:
            # Si no está en la lista, agregarlo
            venta_actual.append({
                'codigo_barras': producto.codigo_barras,
                'nombre': producto.nombre,
                'precio': float(producto.precio),
                'cantidad': 1,
                'subtotal': float(producto.precio),
            })

        # Calcular el total
        total = sum(item['subtotal'] for item in venta_actual)

        return JsonResponse({
            'productos': venta_actual,
            'total': total
        })
    except Producto.DoesNotExist:
        return JsonResponse({'error': 'Producto no encontrado'}, status=404)
    


@api_view(['POST'])
def procesar_venta(request):
    try:
        datos_venta = request.data
        # Procesa la venta aquí (ejemplo)
        # Guardar datos en la base de datos, actualizar stock, etc.
        return Response({'mensaje': 'Venta procesada correctamente'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
def registrar_venta(request):
    """
    Registra una venta con productos y opcionalmente un cliente asociado o datos de factura.
    """
    data = request.data

    try:
        # Verificar si se proporciona un cliente o datos de factura
        cliente_id = data.get('cliente_id')
        cliente = None
        venta_tipo = "Venta rápida"  # Por defecto es una venta rápida

        if cliente_id:
            cliente = get_object_or_404(Cliente, id=cliente_id)
            venta_tipo = f"Venta asociada al cliente: {cliente.nombre}"
        else:
            # Cliente genérico o datos de factura
            cedula = data.get('cedula', None)
            if cedula:
                cliente = Cliente.objects.get_or_create(
                    ruc_nit=cedula,
                    defaults={"nombre": "Cliente Factura"}
                )[0]
                venta_tipo = f"Venta con factura, cliente: {cliente.nombre}"
            else:
                cliente = Cliente.objects.get_or_create(
                    ruc_nit='99999999',
                    defaults={"nombre": "Consumidor Final"}
                )[0]

        # Crear la venta
        venta = Venta(cliente=cliente, estado="PENDIENTE", total=0)
        venta.save()

        # Procesar los productos de la venta
        productos = data.get('productos', [])
        total = 0

        for producto_data in productos:
            producto_id = producto_data.get('producto_id')
            cantidad = producto_data.get('cantidad', 1)

            producto = get_object_or_404(Producto, id=producto_id)
            subtotal = producto.precio * cantidad
            total += subtotal

            # Crear detalle de la venta
            detalle = DetalleVenta(
                venta=venta,
                producto=producto,
                cantidad=cantidad,
                precio=producto.precio,
                subtotal=subtotal,
            )
            detalle.save()

            # Actualizar stock del producto
            producto.stock -= cantidad
            producto.save()

        # Actualizar el total de la venta
        venta.total = total
        venta.estado = "COMPLETADA"
        venta.save()

        return JsonResponse({
            "id": venta.id,
            "cliente": cliente.nombre,
            "cedula": cliente.ruc_nit if cedula else None,
            "productos": [
                {
                    "producto_id": detalle.producto.id,
                    "nombre": detalle.producto.nombre,
                    "cantidad": detalle.cantidad,
                    "precio_unitario": float(detalle.precio),
                    "subtotal": float(detalle.subtotal),
                }
                for detalle in venta.detalles.all()
            ],
            "total": float(total),
        }, status=201)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)



@api_view(['GET'])
def listar_ventas(request):
    if request.method == 'GET':
        try:
            ventas = Venta.objects.all()
            serializer = VentaSerializer(ventas, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': f'Error al obtener las ventas: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def obtener_ventas(request):
    if request.method == 'GET':
        ventas = Venta.objects.all()
        # serializar datos de ventas y enviarlos como respuesta
        return Response({"ventas": "datos_serializados"})
    

class ProveedorViewSet(ModelViewSet):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer


class CompraViewSet(ModelViewSet):
    queryset = Compra.objects.all()
    serializer_class = CompraSerializer


class ProductoPagination(PageNumberPagination):
    page_size = 5  # Cambia esto si deseas más productos por página

class ProductoListView(ListAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    pagination_class = ProductoPagination



@api_view(['GET'])
def listar_clientes(request):
    """
    Devuelve una lista de todos los clientes registrados.
    """
    clientes = Cliente.objects.all()
    clientes_data = [{"id": cliente.id, "nombre": cliente.nombre} for cliente in clientes]
    return JsonResponse(clientes_data, safe=False)


class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_products_excel(request):
    if 'excel_file' not in request.FILES:
        return Response({'error': 'No se recibió ningún archivo Excel.'}, status=status.HTTP_400_BAD_REQUEST)

    excel_file = request.FILES['excel_file']
    try:
        df = pd.read_excel(excel_file)
        # Procesa el archivo Excel aquí
        for index, row in df.iterrows():
            try:
                nombre = row['nombre'] if pd.notna(row['nombre']) else f"Producto_{index}"
                descripcion = row['descripcion'] if pd.notna(row['descripcion']) else "Sin descripción"
                precio = row['precio'] if pd.notna(row['precio']) else 0.0
                stock = row['stock'] if pd.notna(row['stock']) else 0
                contenido = row['contenido'] if pd.notna(row['contenido']) else "Sin contenido"
                codigobarra = row['codigobarra'] if pd.notna(row['codigobarra']) else "Sin código"
                marca = row['marca'] if pd.notna(row['marca']) else "Sin marca"
                fecha_elaboracion = (
                    pd.to_datetime(row['fecha_elaboracion']).replace(tzinfo=None)
                    if pd.notna(row['fecha_elaboracion'])
                    else None
                )
                fecha_caducidad = (
                    pd.to_datetime(row['fecha_caducidad']).replace(tzinfo=None)
                    if pd.notna(row['fecha_caducidad'])
                    else None
                )
                producto = Producto(
                    nombre=nombre,
                    descripcion=descripcion,
                    precio=precio,
                    stock=stock,
                    contenido=contenido,
                    fecha_elaboracion=fecha_elaboracion,
                    fecha_caducidad=fecha_caducidad,
                    codigobarra=codigobarra,
                    marca=marca,
                )
                producto.clean()
                producto.save()
            except ValidationError as ve:
                return Response({"error": f"Error en el producto {nombre}: {str(ve)}"}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({"error": f"Error al procesar el producto {nombre}: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "Productos cargados exitosamente."}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': f'Hubo un error al procesar el archivo: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
    

    # Vista para generar el recibo
def generar_recibo(request, venta_id):
    try:
        venta = Venta.objects.get(id=venta_id)
        # Aquí podrías agregar más datos que quieras mostrar en el recibo
        detalles_venta = venta.detalleventa_set.all()  # Si tienes detalles de productos
        total = venta.total
        
        # Renderizar un recibo en formato HTML
        context = {
            'venta': venta,
            'detalles': detalles_venta,
            'total': total
        }
        recibo_html = render_to_string('recibo_template.html', context)

        return JsonResponse({'recibo_html': recibo_html}, safe=False)

    except Venta.DoesNotExist:
        return JsonResponse({'error': 'Venta no encontrada'}, status=404)
    

@api_view(['GET'])
def listar_compras(request):
    compras = Compra.objects.prefetch_related('detalles').all()
    serializer = CompraSerializer(compras, many=True)
    return Response(serializer.data)    