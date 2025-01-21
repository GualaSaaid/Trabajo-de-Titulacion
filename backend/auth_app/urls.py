from django.urls import path
from .views import (
    login_user,
    ProductoList,
    ProductoDetail,
    reset_password_request,
    upload_products_excel,
    procesar_venta,
    listar_ventas,
    registrar_venta,
    buscar_producto_por_codigo_barra,
    escanear_producto,
    ProductoListView,
    listar_clientes,
    generar_recibo,
    listar_compras,
)
from rest_framework.routers import DefaultRouter
from .views import VentaViewSet, ProveedorViewSet, ClienteViewSet, DetalleVentaViewSet, CrearDetalleVentaAPIView, ProductoViewSet, CompraViewSet

# Rutas del enrutador
router = DefaultRouter()
router.register(r'ventas', VentaViewSet, basename='ventas')
router.register(r'proveedores', ProveedorViewSet, basename='proveedor')
router.register(r'clientes', ClienteViewSet)
router.register(r'detalleventa', DetalleVentaViewSet)
router.register(r'productos', ProductoViewSet, basename='productos')
router.register(r'compras', CompraViewSet, basename='compra')

# Rutas manuales
urlpatterns = [
    path('login/', login_user, name='login'),
    path('productos/', ProductoList.as_view(), name='producto-list'),
    # path('productos/', ProductoListView.as_view(), name='producto-list'),
    path('productos/<int:pk>/', ProductoDetail.as_view(), name='producto-detail'),
    path('reset_password/', reset_password_request, name='reset-password'),
    path('upload_products_excel/', upload_products_excel, name='upload-products-excel'),
    path('ventas/procesar/', procesar_venta, name='procesar_venta'),
    path('ventas/listar/', listar_ventas, name='listar_ventas'),
    path('ventas/registrar/', registrar_venta, name='registrar_venta'),    
    path('productos/codigo_barra/<str:codigo_barra>/', buscar_producto_por_codigo_barra, name='buscar_producto_codigo_barra'),
    path('escanear_producto/', escanear_producto, name='escanear_producto'),
    path('venta/<int:venta_id>/recibo/', generar_recibo, name='generar_recibo'),
    path('crear-detalleventa/', CrearDetalleVentaAPIView.as_view(), name='crear-detalleventa'),
    path('api/compras/', listar_compras, name='listar_compras'),

]

# Incluye las rutas del enrutador
urlpatterns += router.urls