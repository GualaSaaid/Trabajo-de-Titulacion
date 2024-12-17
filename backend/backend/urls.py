from django.urls import path, include
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from auth_app.views import ProductoList

# Vista simple para la raíz
def home(request):
    return HttpResponse("Página de inicio de Django")

urlpatterns = [
    path('', home),  # Ruta de la raíz
    path('admin/', admin.site.urls),
    path('api/auth/', include('auth_app.urls')),
    path('api/products/', ProductoList.as_view(), name='product-list'),
]
