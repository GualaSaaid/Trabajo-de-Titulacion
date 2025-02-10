import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./ProductForm.css";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    contenido: "",
    fecha_elaboracion: "",
    fecha_caducidad: "",
    codigobarra: "",
    marca: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estados para el panel de navegación
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [showSubMenu2, setShowSubMenu2] = useState(false);
  const [showSubMenu3, setShowSubMenu3] = useState(false);
  const [showSubMenu4, setShowSubMenu4] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchProducto = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/productos/${id}/`);
          const data = response.data;
          setFormData({
            ...data,
            fecha_elaboracion: data.fecha_elaboracion || "",
            fecha_caducidad: data.fecha_caducidad || "",
            codigobarra: data.codigobarra || "",
          });
        } catch (error) {
          console.error("Error al cargar el producto:", error);
        }
      };
      fetchProducto();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`http://127.0.0.1:8000/api/productos/${id}/`, formData);
        alert("Producto actualizado correctamente.");
      } else {
        await axios.post("http://127.0.0.1:8000/api/productos/", formData);
        alert("Producto creado correctamente.");
      }
      navigate("/products");
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      alert("Hubo un error al guardar el producto.");
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("¿Estás seguro de que deseas salir?");
    if (confirmLogout) {
      navigate("/");
    }
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <ul>
          <li onClick={() => navigate("/ventas")} className="menu-item">📊 VENTAS</li>
          <li onClick={() => setShowSubMenu(!showSubMenu)} className="menu-item">
            📦 PRODUCTOS
            <ul className={`submenu ${showSubMenu ? "show" : ""}`}>
              <li onClick={() => navigate("/add-product")}>Crear Producto</li>
              <li onClick={() => navigate("/cargar-excel")}>Carga de Productos</li>
            </ul>
          </li>
          <li onClick={() => setShowSubMenu3(!showSubMenu3)} className="menu-item">
            👥 CLIENTES
            <ul className={`submenu ${showSubMenu3 ? "show" : ""}`}>
              <li onClick={() => navigate("/add-client")}>Añadir Cliente</li>
              <li onClick={() => navigate("/clients")}>Lista de Clientes</li>
            </ul>
          </li>
          <li onClick={() => navigate("/products")} className="menu-item">🧺 INVENTARIO</li>
          <li onClick={() => setShowSubMenu4(!showSubMenu4)} className="menu-item">
            💲 PROVEEDORES
            <ul className={`submenu ${showSubMenu4 ? "show" : ""}`}>
              <li onClick={() => navigate("/nuevo-proveedor")}>Crear Proveedor</li>
              <li onClick={() => navigate("/proveedores")}>Lista Proveedores</li>
            </ul>
          </li>
          <li onClick={() => setShowSubMenu2(!showSubMenu2)} className="menu-item">
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
      <div className="product-form-container">
        <h1 className="form-title">{id ? "Editar Producto" : "Crear Producto"}</h1>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre:</label>
              <input type="text" name="nombre" value={formData.nombre || ""} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Descripción:</label>
              <input type="text" name="descripcion" value={formData.descripcion || ""} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Precio:</label>
              <input type="number" name="precio" value={formData.precio || ""} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Stock:</label>
              <input type="number" name="stock" value={formData.stock || ""} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Contenido:</label>
              <input type="text" name="contenido" value={formData.contenido || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Marca:</label>
              <input type="text" name="marca" value={formData.marca || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Fecha de Elaboración:</label>
              <input type="date" name="fecha_elaboracion" value={formData.fecha_elaboracion || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Fecha de Caducidad:</label>
              <input type="date" name="fecha_caducidad" value={formData.fecha_caducidad || ""} onChange={handleChange} />
            </div>
            <div className="form-group full-width">
              <label>Código de Barra:</label>
              <input type="text" name="codigobarra" value={formData.codigobarra || ""} onChange={handleChange} />
            </div>
          </div>

          <div className="button-group">
            <button type="button" className="home-button" onClick={() => navigate("/home")}>🏠 Inicio</button>
            <button type="submit" className="save-button">{id ? "Actualizar" : "Guardar"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
