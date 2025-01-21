import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './homepage.css';

function HomePage() {
  const navigate = useNavigate();
  const [showSubMenu, setShowSubMenu] = useState(false);

  const toggleSubMenu = () => {
    setShowSubMenu(!showSubMenu);
  };
  const handleLogout = () => {
    const confirmLogout = window.confirm("¿Estás seguro de que deseas salir?");
    if (confirmLogout) {
      // Aquí puedes limpiar datos de sesión si es necesario
      navigate("/"); // Redirige al login
    }
  };

  return (
    <div className="home-container">
      <div className="sidebar">
      <ul>
          <li onClick={() => navigate('/ventas')} style={{ cursor: 'pointer' }}>📊 VENTAS</li>
          <li onClick={toggleSubMenu} style={{ cursor: 'pointer' }}>
            📦 PRODUCTOS
            {showSubMenu && (
              <ul className="submenu">
                <li onClick={() => navigate('/add-product')}>Crear Producto</li>
                <li onClick={() => navigate('/products')}>Lista de Productos</li>
                <li onClick={() => navigate('/add-product-manual')}>Ingresar Producto</li>
              </ul>
            )}
          </li>
          <li onClick={() => navigate('/clientes')} style={{ cursor: 'pointer' }}>👥 CLIENTES</li>
          <li>🧺 INVENTARIO</li>
          <li onClick={() => navigate('/proveedores')} style={{ cursor: 'pointer' }}>💲 PROVEEDORES</li>
          <li>💼 CAJA</li>
          <li>🚀 PREDICCIÓN</li>
          <li onClick={() => navigate('/registro-ventas')} style={{ cursor: 'pointer' }}>🛒 REGISTRO DE VENTAS</li>
          <li onClick={() => navigate('/compras')} style={{ cursor: 'pointer' }}>🛍️ COMPRAS</li>
          <li onClick={() => navigate('/lista-compras')} style={{ cursor: 'pointer' }}>📋 LISTA DE COMPRAS</li> {/* Nuevo elemento */}
          <li onClick={handleLogout} style={{ cursor: "pointer" }}>🚪 SALIR</li>
        </ul>

      </div>
      <div className="main-content">
        <h1>ABASTOS EL AHORRO</h1>
        <div className="logo-container">
          <img src="/imagenes/logo.jpg" alt="Abastos El Ahorro" />
        </div>
        <footer>
          <div className="footer-info">
            <p>Provincia - Bolívar</p>
            <p>Guaranda - Las colinas</p>
          </div>
          <p className="slogan">MÁS QUE UN MINIMARKET</p>
        </footer>
      </div>
    </div>
  );
}

export default HomePage;