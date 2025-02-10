import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./HistorialVentas.css";

const HistorialVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ventasPorPagina = 5;
  const navigate = useNavigate();
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

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/ventas/");
        setVentas(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar el historial de ventas.");
        setLoading(false);
      }
    };

    fetchVentas();
  }, []);

  // Función para manejar detalles
  const manejarDetalles = (id) => {
    alert(`Mostrando detalles para la venta con ID: ${id}`);
  };

  // Paginación
  const indexOfLastVenta = currentPage * ventasPorPagina;
  const indexOfFirstVenta = indexOfLastVenta - ventasPorPagina;
  const ventasActuales = ventas.slice(indexOfFirstVenta, indexOfLastVenta);
  const totalPaginas = Math.ceil(ventas.length / ventasPorPagina);

  if (loading) {
    return <div>Cargando historial de ventas...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="historial-ventas-container">
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
          <li className="menu-item">🚀 PREDICCIÓN</li>
          <li onClick={() => navigate("/historial-ventas")} className="menu-item">🛒 REGISTRO DE VENTAS</li>
          <li onClick={() => navigate("/compras")} className="menu-item">🛍️ COMPRAS</li>
          <li onClick={() => navigate("/pagos")} className="menu-item">🗂️ PAGOS</li>
          <li onClick={handleLogout} className="menu-item">🚪 SALIR</li>
        </ul>
      </div>
      <div className="historial-ventas-content">
        <h1 className="historial-title">🛒 Historial de Ventas</h1>

        <table className="ventas-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventasActuales.length > 0 ? (
              ventasActuales.map((venta) => (
                <tr key={venta.id}>
                  <td>{venta.id}</td>
                  <td>{venta.cliente_nombre || "Consumidor Final"}</td>
                  <td>{new Date(venta.fecha).toLocaleString()}</td>
                  <td>
                    $
                    {venta.total && !isNaN(parseFloat(venta.total))
                      ? parseFloat(venta.total).toFixed(2)
                      : "0.00"}
                  </td>
                  <td>
                    <button
                      onClick={() => manejarDetalles(venta.id)}
                      className="detalle-button"
                    >
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-results">No hay ventas registradas.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="pagination">
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>««</button>
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>«</button>

            {Array.from({ length: totalPaginas }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={currentPage === index + 1 ? "active" : ""}
              >
                {index + 1}
              </button>
            ))}

            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPaginas))} disabled={currentPage === totalPaginas}>»</button>
            <button onClick={() => setCurrentPage(totalPaginas)} disabled={currentPage === totalPaginas}>»»</button>
          </div>
        )}

        {/* Botón Atrás */}
        <div className="back-button-container">
          <button className="back-button" onClick={() => navigate("/home")}>← Atrás</button>
        </div>
      </div>
    </div>
  );
};

export default HistorialVentas;
