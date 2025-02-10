import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "./PrediccionDemanda.css"; // Importa el archivo CSS
import { useNavigate } from "react-router-dom"; // Para redirigir a /home

const PrediccionDemanda = () => {
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [predicciones, setPredicciones] = useState(null);
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(false);

    const navigate = useNavigate(); // Hook para navegación
      const [showSubMenu, setShowSubMenu] = useState(false);
      const [showSubMenu2, setShowSubMenu2] = useState(false);
      const [showSubMenu3, setShowSubMenu3] = useState(false);
      const [showSubMenu4, setShowSubMenu4] = useState(false);
    
      const toggleSubMenu = () => {
        setShowSubMenu(!showSubMenu);
      };
      const toggleSubMenu2 = () => {
        setShowSubMenu2(!showSubMenu2);
      };
    
      const toggleSubMenu3 = () => {
        setShowSubMenu3(!showSubMenu3);
      };
    
      const toggleSubMenu4 = () => {
        setShowSubMenu4(!showSubMenu4);
      };
    
      const handleLogout = () => {
        const confirmLogout = window.confirm("¿Estás seguro de que deseas salir?");
        if (confirmLogout) {
          navigate("/"); // Redirige al login
        }
      };

    // 📌 Función para obtener predicción desde la API
    const obtenerPrediccion = async () => {
        try {
            setCargando(true);
            setError(null);
            setPredicciones(null);

            const respuesta = await fetch("http://127.0.0.1:8000/api/predecir-demanda/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fecha_inicio: fechaInicio, fecha_fin: fechaFin })
            });

            setCargando(false);

            if (!respuesta.ok) {
                const errorData = await respuesta.json();
                throw new Error(errorData.error || "Error en la API");
            }

            const datos = await respuesta.json();
            console.log("📌 Respuesta del backend:", datos);

            if (datos.predicciones && Object.keys(datos.predicciones).length > 0) {
                setPredicciones(datos.predicciones);
            } else {
                setPredicciones(null);
                setError("No hay predicciones disponibles.");
            }
        } catch (error) {
            console.error("❌ Error obteniendo la predicción:", error);
            setError("No se pudo obtener la predicción.");
            setCargando(false);
        }
    };

    return (
        <div className="prediccion-demanda"> {/* Clase contenedora para aislar el CSS */}
        <div className="sidebar">
            <ul>
            <li onClick={() => navigate("/ventas")} className="menu-item">📊 VENTAS</li>
            <li onClick={toggleSubMenu} className="menu-item">
                📦 PRODUCTOS
                <ul className={`submenu ${showSubMenu ? "show" : ""}`}>
                <li onClick={() => navigate("/add-product")}>Crear Producto</li>
                <li onClick={() => navigate("/cargar-excel")}>Carga de Productos</li>
                </ul>
            </li>
            <li onClick={toggleSubMenu3} className="menu-item">
                👥 CLIENTES
                <ul className={`submenu ${showSubMenu3 ? "show" : ""}`}>
                <li onClick={() => navigate("/add-client")}>Añadir Cliente</li>
                <li onClick={() => navigate("/clients")}>Lista de Clientes</li>
                </ul>
            </li>
            <li onClick={() => navigate("/products")} className="menu-item">🧺 INVENTARIO</li>
            <li onClick={toggleSubMenu4} className="menu-item">
                💲 PROVEEDORES
                <ul className={`submenu ${showSubMenu4 ? "show" : ""}`}>
                <li onClick={() => navigate("/nuevo-proveedor")}>Crear Proveedor</li>
                <li onClick={() => navigate("/proveedores")}>Lista Proveedores</li>
                </ul>
            </li>
            <li onClick={toggleSubMenu2} className="menu-item">
                💼 CAJA
                <ul className={`submenu ${showSubMenu2 ? "show" : ""}`}>
                <li onClick={() => navigate("/historial-caja")}>Historial Caja</li>
                <li onClick={() => navigate("/control-caja")}>Cierre de Caja</li>
                </ul>
            </li>
            <li onClick={() => navigate("/prediccion-demanda")} className="menu-item">🚀 PREDICCIÓN</li>
            <li onClick={() => navigate("/historial-ventas")} className="menu-item">🛒 REGISTRO DE VENTAS</li>
            <li onClick={() => navigate("/compras")} className="menu-item">🛍️ COMPRAS</li>
            <li onClick={() => navigate("/pagos")} className="menu-item">🗂️ PAGOS</li>
            <li onClick={() => navigate("/reporte")} className="menu-item"> 📊 REPORTES</li>
            <li onClick={handleLogout} className="menu-item">🚪 SALIR</li>
            </ul>
        </div>
            <div className="prediccion-container">
                <h1 className="titulo">📊 Predicción de Demanda</h1>

                <div className="formulario">
                    <label>Fecha Inicio:</label>
                    <input
                        type="date"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                        className="input-fecha"
                    />
                </div>

                <div className="formulario">
                    <label>Fecha Fin:</label>
                    <input
                        type="date"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                        className="input-fecha"
                    />
                </div>

                <button onClick={obtenerPrediccion} disabled={cargando} className="boton">
                    {cargando ? "Cargando..." : "🔮 Obtener Predicción"}
                </button>

                {/* Botón de regresar */}
                <button onClick={() => navigate("/home")} className="boton-regresar">
                    ⬅️ Volver
                </button>

                {error && <p className="error">{error}</p>}

                {predicciones && Object.entries(predicciones).length > 0 ? (
                    <div className="graficos-container">
                        <h2 className="subtitulo">📊 Gráficos de Predicción:</h2>
                        {Object.entries(predicciones).map(([producto, datos], index) => {
                            if (datos.error) {
                                return <p key={index} className="error">⚠️ No hay datos suficientes para {producto}.</p>;
                            } else if (datos.predicciones && datos.predicciones.length > 0) {
                                return (
                                    <div key={index} className="grafico-card">
                                        <h3 className="nombre-producto">{producto}</h3>
                                        <p className="descripcion-container">{datos.descripcion}</p>
                                        <Line data={{
                                            labels: Array.from({ length: datos.predicciones.length }, (_, i) => `Día ${i + 1}`),
                                            datasets: [
                                                {
                                                    label: `Predicción de ${producto}`,
                                                    data: datos.predicciones,
                                                    borderColor: "blue",
                                                    backgroundColor: "rgba(0, 0, 255, 0.2)",
                                                    borderWidth: 2,
                                                    tension: 0.3,
                                                },
                                            ],
                                        }} />
                                    </div>
                                );
                            }
                        })}
                    </div>
                ) : <p className="mensaje">No hay predicciones disponibles.</p>}
            </div>
        </div>
    );
};

export default PrediccionDemanda;
