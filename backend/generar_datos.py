import csv
import random
import datetime
import sqlite3

# 📌 Conectar a la base de datos y obtener productos
conn = sqlite3.connect("abastos.sqlite3")
cursor = conn.cursor()
cursor.execute("SELECT id, nombre FROM auth_app_producto")
productos = {row[0]: row[1] for row in cursor.fetchall()}
conn.close()

# 📌 Parámetros de generación
CANTIDAD_VENTAS = 40000  
PRODUCTOS_IDS = list(productos.keys())  
CLIENTES_IDS = list(range(1, 20))  
FECHA_INICIO = datetime.datetime(2019, 1, 1)
FECHA_FIN = datetime.datetime(2024, 12, 31)

# 📌 Generar una fecha aleatoria
def fecha_aleatoria(inicio, fin):
    delta = fin - inicio
    return (inicio + datetime.timedelta(days=random.randint(0, delta.days))).strftime("%Y-%m-%d")

# 📌 Generar datos y guardarlos en un CSV
with open("ventas.csv", mode="w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerow(["venta_id", "producto_id", "nombre", "fecha", "cantidad", "precio_unitario", "subtotal"])

    venta_id = 1
    for _ in range(CANTIDAD_VENTAS):
        fecha = fecha_aleatoria(FECHA_INICIO, FECHA_FIN)
        num_productos = random.randint(1, 5)

        for _ in range(num_productos):
            producto_id = random.choice(PRODUCTOS_IDS)
            nombre = productos[producto_id]  
            cantidad = random.randint(1, 10)
            precio_unitario = round(random.uniform(1, 50), 2)
            subtotal = round(precio_unitario * cantidad, 2)

            writer.writerow([venta_id, producto_id, nombre, fecha, cantidad, precio_unitario, subtotal])

        venta_id += 1

print("✅ CSV generado correctamente con fechas.")
