import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import abastoLogo from "../../assets/logoabastos.jpg"; // Ruta a la imagen del logo

const HomePage = () => {
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

  return (
    <div className="homepage-container">
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
      <div className="homepage-content">
        <img src={abastoLogo} alt="Abasto El Ahorro" className="homepage-logo" />
        <h1 className="homepage-text">¡Bienvenido a Abastos El Ahorro!</h1>
      </div>
    </div>
  );
};

export default HomePage;