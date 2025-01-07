import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ClienteForm = () => {
  const [cliente, setCliente] = useState({ nombre: '', correo: '', telefono: '', direccion: '', ruc_nit: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetch(`http://127.0.0.1:8000/api/clientes/${id}/`)
        .then((response) => response.json())
        .then((data) => setCliente(data))
        .catch((error) => console.error('Error al obtener el cliente:', error));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente({ ...cliente, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = id ? 'PUT' : 'POST';
    const url = id ? `http://127.0.0.1:8000/api/clientes/${id}/` : 'http://127.0.0.1:8000/api/clientes/';
    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cliente),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.detail || 'Network response was not ok');
          });
        }
        return response.json();
      })
      .then(() => navigate('/clientes'))
      .catch((error) => {
        console.error('Error al guardar el cliente:', error);
        setError(error.message);
      });
  };

  return (
    <div>
      <h1>{id ? 'Editar Cliente' : 'Crear Cliente'}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input type="text" name="nombre" value={cliente.nombre} onChange={handleChange} required />
        </div>
        <div>
          <label>Correo:</label>
          <input type="email" name="correo" value={cliente.correo} onChange={handleChange} required />
        </div>
        <div>
          <label>Teléfono:</label>
          <input type="text" name="telefono" value={cliente.telefono} onChange={handleChange} />
        </div>
        <div>
          <label>Dirección:</label>
          <input type="text" name="direccion" value={cliente.direccion} onChange={handleChange} />
        </div>
        <div>
          <label>RUC/NIT:</label>
          <input type="text" name="ruc_nit" value={cliente.ruc_nit} onChange={handleChange} required />
        </div>
        <button type="submit">Guardar</button>
      </form>
      <button onClick={() => navigate('/clientes')}>Cancelar</button>
    </div>
  );
};

export default ClienteForm;