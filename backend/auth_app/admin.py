from django.contrib import admin
from .models import Producto

admin.site.register(Producto)

class ProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'precio', 'stock', 'fecha_creacion')
    search_fields = ('nombre',)
    list_filter = ('fecha_creacion',)
