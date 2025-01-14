import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RegistroVentas = () => {
  const [ventas, setVentas] = useState([]);
  const navigate = useNavigate(); // Asegúrate de definir navigate aquí

  useEffect(() => {
    // Llamar a la API para obtener las ventas
    fetch('http://127.0.0.1:8000/api/auth/ventas/listar/')
      .then((response) => response.json())
      .then((data) => setVentas(data))
      .catch((error) => console.error('Error al obtener las ventas:', error));
  }, []);

  return (
    <div>
      <h1>Registro de Ventas</h1>
      <ul className="list-group">
        {ventas.map((venta) => (
          <li className="list-group-item" key={venta.id}>
            <strong>ID:</strong> {venta.id} | <strong>Cliente:</strong> {venta.cliente.nombre || 'Consumidor Final'} | 
            <strong>Comprobante:</strong> {venta.tipo_comprobante} | <strong>Fecha:</strong> {venta.fecha} | 
            <strong>Total:</strong> ${venta.total} | <strong>Estado:</strong> {venta.estado}
          </li>
        ))}
      </ul>
      <button onClick={() => navigate('/home')}>Volver al inicio</button>
    </div>
  );
};

export default RegistroVentas;