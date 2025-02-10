import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Compras.css";

const Compras = () => {
  const [compras, setCompras] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    proveedor: "",
    detalles: [],
  });
  const [nuevoDetalle, setNuevoDetalle] = useState({
    producto: "",
    cantidad: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const comprasPorPagina = 5;
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
    fetchCompras();
    fetchProveedores();
    fetchProductos();
  }, []);

  const fetchCompras = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/compras/");
      setCompras(response.data);
    } catch (error) {
      console.error("Error al cargar las compras:", error);
    }
  };

  const fetchProveedores = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/proveedores/");
      setProveedores(response.data);
    } catch (error) {
      console.error("Error al cargar los proveedores:", error);
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/productos/");
      setProductos(response.data);
    } catch (error) {
      console.error("Error al cargar los productos:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDetalleChange = (e) => {
    setNuevoDetalle({ ...nuevoDetalle, [e.target.name]: e.target.value });
  };

  const agregarDetalle = () => {
    const productoSeleccionado = productos.find(
      (prod) => prod.id === parseInt(nuevoDetalle.producto)
    );
    if (!productoSeleccionado) return;

    setForm({
      ...form,
      detalles: [
        ...form.detalles,
        {
          producto: nuevoDetalle.producto,
          cantidad: parseInt(nuevoDetalle.cantidad),
          producto_nombre: productoSeleccionado.nombre,
        },
      ],
    });
    setNuevoDetalle({ producto: "", cantidad: 1 });
  };

  // **Eliminar un producto agregado antes de registrar la compra**
  const quitarDetalle = (index) => {
    const nuevosDetalles = [...form.detalles];
    nuevosDetalles.splice(index, 1);
    setForm({ ...form, detalles: nuevosDetalles });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/compras/", form);
      setForm({ proveedor: "", detalles: [] });
      fetchCompras();
    } catch (error) {
      console.error("Error al guardar la compra:", error);
    }
  };

  // **Paginación**
  const indexOfLastCompra = currentPage * comprasPorPagina;
  const indexOfFirstCompra = indexOfLastCompra - comprasPorPagina;
  const comprasActuales = compras.slice(indexOfFirstCompra, indexOfLastCompra);
  const totalPaginas = Math.ceil(compras.length / comprasPorPagina);

  return (
    <div className="compras-container">
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
      <div className="compras-content">
        <h1 className="compras-title">🛍️ Gestión de Compras</h1>

        <form onSubmit={handleSubmit} className="compras-form">
          <label>Proveedor:</label>
          <select name="proveedor" value={form.proveedor} onChange={handleChange} required>
            <option value="">Seleccione un proveedor</option>
            {proveedores.map((proveedor) => (
              <option key={proveedor.id} value={proveedor.id}>
                {proveedor.nombre}
              </option>
            ))}
          </select>

          <h3>Detalles de la Compra:</h3>
          {form.detalles.map((detalle, index) => (
            <div key={index} className="detalle-item">
              {detalle.producto_nombre} - Cantidad: {detalle.cantidad}
              <button className="quitar-producto" onClick={() => quitarDetalle(index)}>🗑️</button>
            </div>
          ))}

          <div className="nuevo-detalle">
            <select name="producto" value={nuevoDetalle.producto} onChange={handleDetalleChange}>
              <option value="">Seleccione un producto</option>
              {productos.map((producto) => (
                <option key={producto.id} value={producto.id}>
                  {producto.nombre}
                </option>
              ))}
            </select>
            <input type="number" name="cantidad" value={nuevoDetalle.cantidad} min="1" onChange={handleDetalleChange} />
            <button type="button" className="agregar-producto" onClick={agregarDetalle}>
              ➕
            </button>
          </div>
          <button type="submit" className="registrar-compra">COMPRAR 💾</button>
        </form>

        <h2>📜 Historial de Compras</h2>
        <table className="compras-table">
          <thead>
            <tr>
              <th>Compra</th>
              <th>Proveedor</th>
              <th>Productos</th>
              <th>Monto</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {comprasActuales.map((compra) => (
              <tr key={compra.id}>
                <td>{compra.id}</td>
                <td>{compra.proveedor_nombre || "N/A"}</td>
                <td>{Array.isArray(compra.productos) ? compra.productos.join(", ") : "N/A"}</td>
                <td>${parseFloat(compra.saldo_pendiente || 0).toFixed(2)}</td>
                <td>{compra.fecha ? new Date(compra.fecha).toLocaleString() : "N/A"}</td>
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
          <button clazssName="back-button" onClick={() => navigate("/home")}>← Atrás</button>
        </div>
      </div>
    </div>
  );
};

export default Compras;
