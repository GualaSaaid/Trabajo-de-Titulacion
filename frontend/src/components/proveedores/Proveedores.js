import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./Proveedores.css";

const Proveedores = () => {
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    email: "",
    contacto: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();

  // Estado del panel de navegación
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

  const fetchProveedor = useCallback(async () => {
    if (!id) return;
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/proveedores/${id}/`);
      setForm(response.data);
    } catch (error) {
      console.error("Error al cargar el proveedor:", error);
      alert("Error al cargar el proveedor.");
      navigate("/proveedores");
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchProveedor();
  }, [fetchProveedor]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`http://127.0.0.1:8000/api/proveedores/${id}/`, form);
        alert("Proveedor actualizado correctamente.");
      } else {
        await axios.post("http://127.0.0.1:8000/api/proveedores/", form);
        alert("Proveedor creado correctamente.");
      }
      navigate("/proveedores");
    } catch (error) {
      console.error("Error al guardar el proveedor:", error);
      alert("Hubo un error al guardar el proveedor.");
    }
  };

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

      {/* Contenedor del Formulario */}
      <div className="proveedor-container">
        <h1>{id ? "Editar Proveedor" : "Nuevo Proveedor"}</h1>
        <form onSubmit={handleSubmit} className="proveedor-form">
          <div className="form-row">
            <div className="input-group">
              <label>Nombre:</label>
              <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Dirección:</label>
              <input type="text" name="direccion" value={form.direccion} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Teléfono:</label>
              <input type="text" name="telefono" value={form.telefono} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>Email:</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} />
            </div>
          </div>

          <div className="input-group">
            <label>Contacto:</label>
            <input type="text" name="contacto" value={form.contacto} onChange={handleChange} />
          </div>

          <div className="form-buttons">
            <button type="button" className="form-button back-button" onClick={() => navigate("/home")}>
              ⬅️ Atrás
            </button>
            <button type="submit" className="form-button submit-button">
              {id ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Proveedores;
