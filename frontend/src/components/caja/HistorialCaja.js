import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./HistorialCaja.css";

const HistorialCaja = () => {
  const [registros, setRegistros] = useState([]);
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const registrosPorPagina = 10;
  const navigate = useNavigate();

  // Panel de navegación
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [showSubMenu2, setShowSubMenu2] = useState(false);
  const [showSubMenu3, setShowSubMenu3] = useState(false);
  const [showSubMenu4, setShowSubMenu4] = useState(false);

  const toggleSubMenu = () => setShowSubMenu(!showSubMenu);
  const toggleSubMenu2 = () => setShowSubMenu2(!showSubMenu2);
  const toggleSubMenu3 = () => setShowSubMenu3(!showSubMenu3);
  const toggleSubMenu4 = () => setShowSubMenu4(!showSubMenu4);

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro de que deseas salir?")) {
      navigate("/");
    }
  };

  const fetchRegistros = async (fecha) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/caja/?fecha=${fecha}`);
      setRegistros(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error al obtener el historial de caja:", error.response?.data);
    }
  };

  const handleBuscarPorFecha = () => {
    if (fechaFiltro) {
      fetchRegistros(fechaFiltro);
    } else {
      alert("Por favor, selecciona una fecha válida.");
    }
  };

  const indexOfLastRegistro = currentPage * registrosPorPagina;
  const indexOfFirstRegistro = indexOfLastRegistro - registrosPorPagina;
  const registrosActuales = registros.slice(indexOfFirstRegistro, indexOfLastRegistro);
  const totalPaginas = Math.ceil(registros.length / registrosPorPagina);

  return (
    <div className="container">
      {/* Panel de Navegación */}
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

      {/* Contenido del historial */}
      <div className="historial-caja-container">
        <div className="historial-content">
          <h1 className="title">📜 Historial de Movimientos</h1>

          <div className="filter-container">
            <input
              type="date"
              id="fecha"
              value={fechaFiltro}
              onChange={(e) => setFechaFiltro(e.target.value)}
            />
            <button onClick={handleBuscarPorFecha}>🔍 Filtrar</button>
          </div>

          <table className="historial-table">
            <thead>
              <tr>
                <th>Fecha y Hora</th>
                <th>Tipo</th>
                <th>Monto</th>
                <th>Descripción</th>
                <th>Saldo Actual</th>
              </tr>
            </thead>
            <tbody>
              {registrosActuales.length > 0 ? (
                registrosActuales.map((reg, index) => (
                  <tr key={index}>
                    <td>{new Date(reg.fecha_hora).toLocaleString()}</td>
                    <td>{reg.tipo}</td>
                    <td>${reg.monto}</td>
                    <td>{reg.descripcion}</td>
                    <td>${reg.saldo_actual}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-results">No hay movimientos para esta fecha.</td>
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
    </div>
  );
};

export default HistorialCaja;
