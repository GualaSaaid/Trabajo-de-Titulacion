// src/components/AddProductForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ExcelUpload from './ExcelUpload';

function AddProductForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    contenido: '',
    fecha_elaboracion: '',
    fecha_caducidad: '',
    codigobarra: '',
    marca: '',
  });
  const [products, setProducts] = useState([]);
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

  const agregarProducto = (e) => {
    e.preventDefault();
    if (
      !formData.nombre ||
      !formData.precio ||
      !formData.stock ||
      !formData.fecha_elaboracion ||
      !formData.fecha_caducidad
    ) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    if (formData.fecha_caducidad <= formData.fecha_elaboracion) {
      alert('La fecha de caducidad debe ser posterior a la fecha de elaboración.');
      return;
    }

    axios
      .post('http://localhost:8000/api/auth/productos/', formData)
      .then(() => {
        alert('Producto agregado exitosamente.');
        navigate('/products');
      })
      .catch((error) => console.error('Error al agregar el producto:', error));
  };

  const handleExcelUpload = (data) => {
    setProducts(data.products || []);
  };

  return (
    <div className="add-product-container">
            <div className="sidebar">
        <ul>
          <li onClick={() => navigate('/home')}>☰</li>
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
          <li onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>💲 PROVEEDORES</li>
          <li>💼 CAJA</li>
          <li>🚀 PREDICCIÓN</li>
          <li onClick={() => navigate('/registro-ventas')} style={{ cursor: 'pointer' }}>🛒 REGISTRO DE VENTAS</li>
          <li onClick={handleLogout} style={{ cursor: "pointer" }}>🚪 SALIR</li>
        </ul>
      </div>
      <h1>Agregar Producto</h1>
      <form onSubmit={agregarProducto} className="add-product-form">
        {/* Formulario de productos */}
      </form>
      <hr />
      <h2>Cargar Productos desde Excel</h2>
      <ExcelUpload onFileUploaded={handleExcelUpload} />
    </div>
  );
}

export default AddProductForm;
