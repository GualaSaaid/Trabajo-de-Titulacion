from django.urls import path
from . import views 
from .views import ProductoList, ProductoDetail

urlpatterns = [
    # Login
    path('login/', views.login_user, name='login'),
    
    # Listado y creación de productos
    path('productos/', ProductoList.as_view(), name='producto-list'),
    
    # Detalle de producto y eliminación (usando el método DELETE de ProductoDetail)
    path('productos/<int:pk>/', ProductoDetail.as_view(), name='producto-detail'),
    path('productos/<int:pk>/', ProductoDetail.as_view(), name='producto-detail')
]

