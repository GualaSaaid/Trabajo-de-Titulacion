import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VentasList = () => {
  const [ventas, setVentas] = useState([]);
  const navigate = useNavigate();

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
            <strong>ID:</strong> {venta.id} | <strong>Fecha:</strong> {venta.fecha} | <strong>Total:</strong> ${!isNaN(parseFloat(venta.total)) ? parseFloat(venta.total).toFixed(2) : 'N/A'} | <strong>Estado:</strong> {venta.estado}
          </li>
        ))}
      </ul>
      <button onClick={() => navigate('/')}>Volver al inicio</button>
    </div>
  );
};

export default VentasList;