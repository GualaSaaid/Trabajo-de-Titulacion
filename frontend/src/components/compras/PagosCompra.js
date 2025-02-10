import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./PagosCompra.css";

const PagosCompra = () => {
  const [compras, setCompras] = useState([]);
  const [pago, setPago] = useState({
    compra: "",
    monto: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pagosPorPagina = 5;
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

  // Cargar compras
  useEffect(() => {
    fetchCompras();
  }, []);

  const fetchCompras = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/compras/");
      setCompras(response.data);
    } catch (error) {
      console.error("Error al cargar las compras:", error);
    }
  };

  const handleChange = (e) => {
    setPago({ ...pago, [e.target.name]: e.target.value });
  };

  const handlePago = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/pagos/", pago);
      setPago({ compra: "", monto: "" });
      fetchCompras();
    } catch (error) {
      console.error("Error al realizar el pago:", error);
    }
  };

  // Paginación
  const indexOfLastPago = currentPage * pagosPorPagina;
  const indexOfFirstPago = indexOfLastPago - pagosPorPagina;
  const pagosActuales = compras.slice(indexOfFirstPago, indexOfLastPago);
  const totalPaginas = Math.ceil(compras.length / pagosPorPagina);

  return (
    <div className="pagos-compra-container">
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
      <div className="pagos-compra-content">
        <h1 className="pagos-title">💳 Pagos de Compras</h1>

        <form onSubmit={handlePago} className="pagos-form">
          <label>Compra:</label>
          <select name="compra" value={pago.compra} onChange={handleChange} required>
            <option value="">Seleccione una compra</option>
            {compras.map((compra) => (
              <option key={compra.id} value={compra.id}>
                {compra.proveedor_nombre} - Productos: {compra.productos.join(", ")} - Saldo pendiente: ${compra.saldo_pendiente}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="monto"
            placeholder="Monto a pagar"
            value={pago.monto}
            min="0.01"
            step="0.01"
            onChange={handleChange}
            required
          />
          <button type="submit" className="registrar-pago">💾 Registrar Pago</button>
        </form>

        <h2>📜 Historial de Pagos</h2>
        <table className="pagos-table">
          <thead>
            <tr>
              <th>Compra</th>
              <th>Proveedor</th>
              <th>Productos</th>
              <th>Monto</th>
              <th>Saldo Pendiente</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {pagosActuales.map((compra) => (
              <tr key={compra.id}>
                <td>{compra.id}</td>
                <td>{compra.proveedor_nombre}</td>
                <td>{compra.productos ? compra.productos.join(", ") : "N/A"}</td>
                <td>${parseFloat(compra.total).toFixed(2)}</td>
                <td>${parseFloat(compra.saldo_pendiente).toFixed(2)}</td>
                <td>{new Date(compra.fecha).toLocaleString()}</td>
                <td>{compra.estado}</td>
              </tr>
            ))}
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

export default PagosCompra;
