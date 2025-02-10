import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UploadExcel.css";

const UploadExcel = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("Ningún archivo seleccionado aún");
  const [nuevosProductos, setNuevosProductos] = useState(null);
  const [productosDuplicados, setProductosDuplicados] = useState(null);
  
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? `📄 ${selectedFile.name}` : "📂 Ningún archivo seleccionado");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("⚠️ Por favor selecciona un archivo.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/cargar-archivo/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(response.data.message || "✅ Archivo cargado correctamente.");
      setNuevosProductos(response.data.nuevos_productos);
      setProductosDuplicados(response.data.productos_duplicados);
    } catch (error) {
      setMessage(error.response?.data?.error || "❌ Error al procesar el archivo.");
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

      {/* Contenido principal */}
      <div className="upload-excel-container">
        <h1 className="upload-title">Cargar Productos</h1>
        <form onSubmit={handleUpload} className="upload-form">
          <label className="file-label">
            <input type="file" accept=".xlsx" onChange={handleFileChange} className="file-input" />
            <span className="file-button">📂 Seleccionar Archivo</span>
          </label>
          <p className="file-name">{fileName}</p>
          <button type="submit" className="upload-button">📤 Cargar Archivo</button>
        </form>
        
        {message && <p className="message">{message}</p>}

        {nuevosProductos !== null && productosDuplicados !== null && (
          <div className="upload-summary">
            <p>📦 Nuevos productos: <strong>{nuevosProductos}</strong></p>
            <p>🔄 Productos ya existentes: <strong>{productosDuplicados}</strong></p>
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

export default UploadExcel;
