import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './homepage.css';

function HomePage() {
  const navigate = useNavigate();
  const [showSubMenu, setShowSubMenu] = useState(false);

  const toggleSubMenu = () => {
    setShowSubMenu(!showSubMenu);
  };

  return (
    <div className="home-container">
      <div className="sidebar">
        <ul>
          <li><span>☰</span></li>
          <li>📊 VENTAS</li>
          <li onClick={toggleSubMenu} style={{ cursor: 'pointer' }}>
            📦 PRODUCTOS
            {showSubMenu && (
              <ul className="submenu">
                <li onClick={() => navigate('/add-product')}>Crear Producto</li>
                <li onClick={() => navigate('/products')}>Lista de Productos</li>
              </ul>
            )}
          </li>
          <li>👥 CLIENTES</li>
          <li>🧺 INVENTARIO</li>
          <li>💲 PROVEEDORES</li>
          <li>💼 CAJA</li>
          <li>🚀 PREDICCIÓN</li>
          <li>🚪 SALIR</li>
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