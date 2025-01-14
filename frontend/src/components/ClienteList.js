import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ClienteList.css';

const ClienteList = () => {
  const [clientes, setClientes] = useState([]);
  const navigate = useNavigate();
  const [showSubMenu, setShowSubMenu] = useState(false);
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/clientes/')
      .then((response) => response.json())
      .then((data) => {
        if (data.results && Array.isArray(data.results)) {
          setClientes(data.results);
        } else {
          console.error('La respuesta de la API no contiene un array en results:', data);
        }
      })
      .catch((error) => console.error('Error al obtener los clientes:', error));
  }, []);

  const handleDelete = (id) => {
    fetch(`http://127.0.0.1:8000/api/clientes/${id}/`, {
      method: 'DELETE',
    })
      .then(() => setClientes(clientes.filter((cliente) => cliente.id !== id)))
      .catch((error) => console.error('Error al eliminar el cliente:', error));
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("¿Estás seguro de que deseas salir?");
    if (confirmLogout) {
      // Aquí puedes limpiar datos de sesión si es necesario
      navigate("/"); // Redirige al login
    }
  };
  
  const toggleSubMenu = () => {
    setShowSubMenu(!showSubMenu);
  };

  return (
    <div className="cliente-list">
            <div className="sidebar">
        <ul>
          <li><span>☰</span></li>
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
          <li onClick={handleLogout} style={{ cursor: "pointer" }}>🚪 SALIR</li>
        </ul>
      </div>
      <h1>Lista de Clientes</h1>
      <button onClick={() => navigate('/clientes/nuevo')}>Crear Cliente</button>
      <ul className="list-group">
        {clientes.map((cliente) => (
          <li className="list-group-item" key={cliente.id}>
            <div>
              <strong>Nombre:</strong> {cliente.nombre}
              <strong>Teléfono:</strong> {cliente.telefono}
              <strong>Cédula:</strong> {cliente.ruc_nit}
            </div>
            <div>
              <button onClick={() => navigate(`/clientes/${cliente.id}/editar`)}>Editar</button>
              <button onClick={() => handleDelete(cliente.id)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate('/home')}>Volver al inicio</button>
    </div>
  );
};

export default ClienteList;