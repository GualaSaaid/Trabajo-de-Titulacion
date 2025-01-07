import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AddProductManual.css';

function AddProductManual() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    contenido: '',
    fecha_elaboracion: '',
    fecha_caducidad: '',
    codigobarra: '', // Aquí se agrega el campo de código de barras
    marca: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  

  const agregarProducto = async (e) => {
    e.preventDefault();
    console.log('Formulario enviado');
    // Validaciones
    if (
      !formData.nombre ||
      !formData.precio ||
      !formData.stock ||
      !formData.fecha_elaboracion ||
      !formData.fecha_caducidad ||
      !formData.codigobarra||
      !formData.contenido ||
      !formData.marca
    ) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }
  
    if (formData.fecha_caducidad <= formData.fecha_elaboracion) {
      alert('La fecha de caducidad debe ser posterior a la fecha de elaboración.');
      return;
    }
  
    // Lógica para enviar los datos al backend
    try {
      console.log('Enviando datos al servidor:', formData);
    
      const response = await fetch('http://localhost:8000/api/products/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
    
      console.log('Respuesta del servidor:', response);
    
      if (response.ok) {
        alert('Producto agregado exitosamente.');
        navigate('/products');
      } else {
        alert('Hubo un error al guardar el producto.');
        console.error('Error del servidor:', await response.text());
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      alert('Error al conectar con el servidor.');
    }
    
  };

  return (
    <div className="home-container">
      {/* Barra Lateral */}
      <div className="sidebar">
        <ul>
          <li><span>☰</span></li>
          <li>📊 VENTAS</li>
          <li>
            📦 PRODUCTOS
            <ul className="submenu">
              <li onClick={() => navigate('/add-product')}>Crear Producto</li>
              <li onClick={() => navigate('/products')}>Lista de Productos</li>
              <li onClick={() => navigate('/add-product-manual')}>Ingresar Producto</li>
            </ul>
          </li>
          <li>👥 CLIENTES</li>
          <li>🧺 INVENTARIO</li>
          <li>💲 PROVEEDORES</li>
          <li>💼 CAJA</li>
          <li>🚀 PREDICCIÓN</li>
          <li onClick={() => console.log('logout')} style={{ cursor: "pointer" }}>🚪 SALIR</li>
        </ul>
      </div>

      {/* Contenido Principal */}
      <div className="main-content">
        <h1>Agregar Producto</h1>
        <form onSubmit={agregarProducto} className="add-product-form">
          <div className="form-row">
            <div className="form-group">
              <label>Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Precio:</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Stock:</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Marca:</label>
              <input
                type="text"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
          <div className="form-group">
              <label>Contenido:</label>
              <input
                type="text"
                name="contenido"
                value={formData.contenido}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Descripción:</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="form-group">
              <label>Fecha de Elaboración:</label>
              <input
                type="date"
                name="fecha_elaboracion"
                value={formData.fecha_elaboracion}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Fecha de Caducidad:</label>
              <input
                type="date"
                name="fecha_caducidad"
                value={formData.fecha_caducidad}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Código de Barra:</label>
              <input
                type="text"
                name="codigobarra"
                value={formData.codigobarra}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button type="submit" className="add-product-button">
            Agregar Producto
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProductManual;
