import pandas as pd
import numpy as np
import matplotlib
import matplotlib.pyplot as plt
import seaborn as sns
from statsmodels.tsa.arima.model import ARIMA

# 📌 Evita errores de matplotlib en Django
matplotlib.use('Agg')

# 📌 Ruta del CSV con datos de ventas
CSV_PATH = "ventas.csv"

# 📌 Cargar los datos desde el CSV
def cargar_datos():
    df = pd.read_csv(CSV_PATH, parse_dates=["fecha"])
    df["fecha"] = pd.to_datetime(df["fecha"], errors="coerce")
    return df

# 📌 Obtener los productos más vendidos (ajustado para fechas futuras)
def obtener_productos_mas_vendidos(fecha_inicio, fecha_fin):
    df = cargar_datos()
    
    # 📌 Obtener la última fecha disponible en los datos históricos
    ultima_fecha_disponible = df["fecha"].max()
    
    # 📌 Si la fecha de inicio es futura, usar toda la serie histórica para el modelo
    if fecha_inicio > ultima_fecha_disponible:
        df_filtrado = df  # Usa toda la serie histórica
    else:
        df_filtrado = df[(df["fecha"] >= fecha_inicio) & (df["fecha"] <= fecha_fin)]
    
    if df_filtrado.empty:
        print("⚠️ No se encontraron productos más vendidos en el rango de fechas.")
        return pd.DataFrame()

    # 📌 Obtener los 10 productos más vendidos
    df_ventas = df_filtrado.groupby(["producto_id", "nombre"])["cantidad"].sum().reset_index()
    df_ventas = df_ventas.sort_values(by="cantidad", ascending=False).head(5)
    
    return df_ventas

# 📌 Obtener ventas de un producto específico (ajustado para fechas futuras)
def obtener_ventas_producto(producto_id, fecha_inicio, fecha_fin):
    df = cargar_datos()
    
    # 📌 Obtener la última fecha disponible en los datos históricos
    ultima_fecha_disponible = df["fecha"].max()
    
    # 📌 Si la fecha de inicio es futura, usa todas las ventas históricas
    if fecha_inicio > ultima_fecha_disponible:
        df_filtrado = df[df["producto_id"] == producto_id]
    else:
        df_filtrado = df[(df["producto_id"] == producto_id) & (df["fecha"] >= fecha_inicio) & (df["fecha"] <= fecha_fin)]
    
    if df_filtrado.empty:
        return pd.DataFrame()
    
    # 📌 Agrupar por fecha
    df_ventas = df_filtrado.groupby("fecha")["cantidad"].sum().reset_index()
    df_ventas.set_index("fecha", inplace=True)

    # 📌 Agregar días faltantes con 0 ventas para evitar problemas en ARIMA
    df_ventas = df_ventas.asfreq("D").fillna(0)

    return df_ventas

# 📌 Entrenar modelo ARIMA y predecir la demanda (ajustado para fechas futuras)
def entrenar_modelo(fecha_inicio, fecha_fin):
    # 📌 Convertir fechas a formato datetime
    fecha_inicio = pd.to_datetime(fecha_inicio, format="%Y-%m-%d", errors="coerce")
    fecha_fin = pd.to_datetime(fecha_fin, format="%Y-%m-%d", errors="coerce")

    if pd.isna(fecha_inicio) or pd.isna(fecha_fin):
        return {"error": "Fechas inválidas. Usa el formato correcto (YYYY-MM-DD)."}

    if fecha_inicio >= fecha_fin:
        return {"error": "La fecha de inicio debe ser anterior a la fecha de fin."}

    print(f"📌 Rango de fechas: {fecha_inicio} - {fecha_fin}")

    # 📌 Obtener los productos más vendidos
    productos_mas_vendidos = obtener_productos_mas_vendidos(fecha_inicio, fecha_fin)

    if productos_mas_vendidos.empty:
        return {"error": "No hay datos de ventas en el rango seleccionado."}

    predicciones_resultado = {}

    # 📌 Calcular el número de días para la predicción
    dias_prediccion = (fecha_fin - fecha_inicio).days

    for _, row in productos_mas_vendidos.iterrows():
        producto_id = row["producto_id"]
        nombre_producto = row["nombre"]

        datos = obtener_ventas_producto(producto_id, fecha_inicio, fecha_fin)

        if datos.empty or len(datos) < 10:
            predicciones_resultado[nombre_producto] = {"error": "No hay suficientes datos para predecir."}
            continue

        # 📌 Entrenar modelo ARIMA
        try:
            modelo = ARIMA(datos, order=(5, 1, 2))  # Parámetros (p, d, q)
            modelo_fit = modelo.fit()
        except Exception as e:
            print(f"⚠️ Error entrenando el modelo para {nombre_producto}: {str(e)}")
            predicciones_resultado[nombre_producto] = {"error": f"Error al entrenar el modelo: {str(e)}"}
            continue

        # 📌 Generar predicción en función del rango de fechas
        predicciones = modelo_fit.forecast(steps=dias_prediccion)
        fechas_pred = pd.date_range(start=fecha_inicio, periods=dias_prediccion, freq="D")

        # 📌 Crear resumen textual para el usuario
        min_pred = round(min(predicciones), 2)
        max_pred = round(max(predicciones), 2)
        promedio_pred = round(np.mean(predicciones), 2)
        recomendacion_stock = int(max_pred * 1.2)  # Sugerencia del 20% extra

        descripcion = (f"📢 **Predicción de Demanda para {nombre_producto}:**\n"
                       f"📆 Periodo: {fecha_inicio.date()} - {fecha_fin.date()}\n"
                       f"📊 Demanda mínima esperada: {min_pred} unidades\n"
                       f"📈 Demanda máxima esperada: {max_pred} unidades\n"
                       f"📉 Demanda promedio esperada: {promedio_pred} unidades\n"
                       f"📦 **Recomendación de stock**: Tener al menos **{recomendacion_stock} unidades** disponibles.")

        predicciones_resultado[nombre_producto] = {
            "predicciones": predicciones.tolist(),
            "descripcion": descripcion
        }

        # 📌 Graficar la predicción
        plt.figure(figsize=(12, 6))
        plt.plot(datos.index, datos["cantidad"], label="📈 Ventas Reales", color="blue", linewidth=1)
        plt.plot(fechas_pred, predicciones, label="🔮 Predicción", color="red", linestyle="dashed", linewidth=2)
        plt.fill_between(fechas_pred, predicciones * 0.9, predicciones * 1.1, color="red", alpha=0.2)

        plt.title(f"📊 Predicción de Demanda para {nombre_producto}", fontsize=14)
        plt.xlabel("Fecha", fontsize=12)
        plt.ylabel("Cantidad Vendida", fontsize=12)
        plt.xticks(rotation=45)
        plt.legend()
        plt.close()

    return {"predicciones": predicciones_resultado}
