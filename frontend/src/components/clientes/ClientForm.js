import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./ClientForm.css";

const ClientForm = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    cedula: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [showSubMenu2, setShowSubMenu2] = useState(false);
  const [showSubMenu3, setShowSubMenu3] = useState(false);
  const [showSubMenu4, setShowSubMenu4] = useState(false);

  const toggleSubMenu = () => setShowSubMenu(!showSubMenu);
  const toggleSubMenu2 = () => setShowSubMenu2(!showSubMenu2);
  const toggleSubMenu3 = () => setShowSubMenu3(!showSubMenu3);
  const toggleSubMenu4 = () => setShowSubMenu4(!showSubMenu4);

  const handleLogout = () => {
    const confirmLogout = window.confirm("¿Estás seguro de que deseas salir?");
    if (confirmLogout) navigate("/");
  };

  useEffect(() => {
    if (id) {
      const fetchCliente = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/clientes/${id}/`);
          setFormData(response.data);
        } catch (error) {
          console.error("Error al cargar el cliente:", error);
        }
      };

      fetchCliente();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        await axios.put(`http://127.0.0.1:8000/api/clientes/${id}/`, formData);
        alert("Cliente actualizado correctamente.");
      } else {
        await axios.post("http://127.0.0.1:8000/api/clientes/", formData);
        alert("Cliente creado correctamente.");
      }
      navigate("/clients");
    } catch (error) {
      console.error("Error al guardar el cliente:", error);
      alert("Cliente ya existente.");
    }
  };

  return (
    <div className="container">
      {/* Sidebar */}
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

      {/* Contenido del formulario */}
      <div className="client-form-container">
        <h1 className="form-title">{id ? "Editar Cliente" : "Datos del Cliente"}</h1>
        <form onSubmit={handleSubmit} className="client-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre:</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Teléfono:</label>
              <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Cédula:</label>
              <input
                type="text"
                name="cedula"
                value={formData.cedula}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,10}$/.test(value)) {
                    setFormData({ ...formData, cedula: value });
                  }
                }}
                required
              />
            </div>
            <div className="form-group full-width">
              <label>Dirección:</label>
              <textarea name="direccion" value={formData.direccion} onChange={handleChange} />
            </div>
          </div>
          <div className="button-group">
            <button type="submit" className="save-button">{id ? "Actualizar" : "Guardar"}</button>
            <button type="button" className="home-button" onClick={() => navigate("/home")}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientForm;
