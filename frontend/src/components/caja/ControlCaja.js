import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ControlCaja.css";

const ControlCaja = () => {
  const [registros, setRegistros] = useState([]);
  const [corte, setCorte] = useState(null);
  const [efectivoReal, setEfectivoReal] = useState("");
  const [saldoInicial, setSaldoInicial] = useState("");
  const [mostrarSaldoInicial, setMostrarSaldoInicial] = useState(false);
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const registrosPorPagina = 5;
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
  const navigate = useNavigate();

  useEffect(() => {
    fetchRegistros();
    fetchCorteCaja();
  }, []);

  const fetchRegistros = async (fecha = null) => {
    let url = "http://127.0.0.1:8000/api/caja/";
    if (fecha) url += `?fecha=${fecha}`;

    try {
      const response = await axios.get(url);
      const hoy = fecha || new Date().toISOString().split("T")[0];
      const registrosHoy = response.data.filter(
        (reg) => reg.fecha_hora.split("T")[0] === hoy
      );
      setRegistros(registrosHoy);
      setCurrentPage(1);

      if (!registrosHoy.some((reg) => reg.tipo === "entrada" && reg.descripcion === "Saldo inicial")) {
        setMostrarSaldoInicial(true);
      }
    } catch (error) {
      console.error("Error al obtener los registros de caja:", error.response?.data);
    }
  };

  const fetchCorteCaja = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/corte-caja/");
      setCorte(response.data);
    } catch (error) {
      console.error("Error al obtener el corte de caja:", error.response?.data);
    }
  };

  const registrarSaldoInicial = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/caja/", {
        tipo: "entrada",
        monto: saldoInicial,
        descripcion: "Saldo inicial",
      });
      setMostrarSaldoInicial(false);
      fetchRegistros();
    } catch (error) {
      console.error("Error al registrar el saldo inicial:", error.response?.data);
    }
  };

  const realizarCorteCaja = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/corte-caja/", {
        efectivo_real: efectivoReal,
      });
      setEfectivoReal("");
      fetchRegistros();
      fetchCorteCaja();
    } catch (error) {
      console.error("Error al realizar el corte de caja:", error.response?.data);
    }
  };

  const handleFiltrarPorFecha = () => {
    fetchRegistros(fechaFiltro);
  };

  const indexOfLastRegistro = currentPage * registrosPorPagina;
  const indexOfFirstRegistro = indexOfLastRegistro - registrosPorPagina;
  const registrosActuales = registros.slice(indexOfFirstRegistro, indexOfLastRegistro);
  const totalPaginas = Math.ceil(registros.length / registrosPorPagina);

  return (
    <div className="control-caja-container">
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
      <div className="control-caja-content">
        <h1 className="title">💰 Control de Caja</h1>

        {mostrarSaldoInicial ? (
          <div className="saldo-inicial-container">
            <h3>💰 Configurar Saldo Inicial</h3>
            <div className="saldo-input-group">
              <input
                type="number"
                placeholder="Ingrese el saldo inicial del día"
                value={saldoInicial}
                onChange={(e) => setSaldoInicial(e.target.value)}
              />
              <button onClick={registrarSaldoInicial}>💾 Guardar</button>
            </div>
          </div>
        ) : (
          <>
            <h2>📊 Resumen del Día</h2>
            {corte && (
              <div className="resumen-caja">
                <p>Inicio de Caja: <strong>${corte.saldo_inicial}</strong></p>
                <p>Ingresos + Caja: <strong>${corte.total_entradas}</strong></p>
                <p>Total de Salidas: <strong>${corte.total_salidas}</strong></p>
                <p>Final en Caja: <strong>${corte.saldo_final}</strong></p>
              </div>
            )}

            <h3>📝 Realizar Corte de Caja</h3>
            <input
              type="number"
              placeholder="Efectivo real en caja"
              value={efectivoReal}
              onChange={(e) => setEfectivoReal(e.target.value)}
            />
            <button onClick={realizarCorteCaja}>Realizar Corte</button>
          </>
        )}

        <h2>📜 Historial de Movimientos</h2>
        <div className="filter-container">
          <input
            type="date"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
          />
          <button onClick={handleFiltrarPorFecha}>🔍 Filtrar</button>
        </div>

        <table className="caja-table">
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
  );
};

export default ControlCaja;