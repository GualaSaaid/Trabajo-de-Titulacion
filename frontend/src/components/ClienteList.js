import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ClienteList.css';

const ClienteList = () => {
  const [clientes, setClientes] = useState([]);
  const navigate = useNavigate();

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

  return (
    <div className="cliente-list">
      <h1>Lista de Clientes</h1>
      <button onClick={() => navigate('/clientes/nuevo')}>Crear Cliente</button>
      <ul className="list-group">
        {clientes.map((cliente) => (
          <li className="list-group-item" key={cliente.id}>
            <div>
              <strong>Nombre:</strong> {cliente.nombre}
              <strong>Email:</strong> {cliente.correo}
              <strong>Teléfono:</strong> {cliente.telefono}
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