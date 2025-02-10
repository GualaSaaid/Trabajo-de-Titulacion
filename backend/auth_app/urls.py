from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .views import LoginView, ProductoViewSet, LoteViewSet, ClienteViewSet, VentaView, CargarArchivoView, ProveedorViewSet, CompraView, PagoProveedorView, RegistroCajaView, CorteCajaView, ReporteView, predecir_demanda, solicitar_recuperacion, cambiar_contrasena


router = DefaultRouter()
router.register(r'productos', ProductoViewSet, basename='producto')
router.register(r'lotes', LoteViewSet, basename='lote')
router.register(r'clientes', ClienteViewSet, basename='cliente')
router.register(r'proveedores', ProveedorViewSet, basename='proveedor')

urlpatterns = [
    path("", include(router.urls)),
    path("login/", LoginView.as_view(), name="login"),
    path('ventas/', VentaView.as_view(), name='ventas'),
    path('cargar-archivo/', CargarArchivoView.as_view(), name='cargar_archivo'),
    path('ventas/<int:pk>/', VentaView.as_view(), name='venta-detalle'),  # Para obtener una venta específica
    path("compras/", CompraView.as_view(), name="compras"),
    path("pagos/", PagoProveedorView.as_view(), name="pago-proveedor"),
    path('caja/', RegistroCajaView.as_view(), name='registro-caja'),
    path('corte-caja/', CorteCajaView.as_view(), name='corte-caja'),
    path('reporte/', ReporteView.as_view(), name='reporte'),
    path("predecir-demanda/", predecir_demanda, name="predecir_demanda"),
    path("solicitar-recuperacion/", solicitar_recuperacion, name="solicitar_recuperacion"),
    path("cambiar-contrasena/", cambiar_contrasena, name="cambiar_contrasena"),

]
