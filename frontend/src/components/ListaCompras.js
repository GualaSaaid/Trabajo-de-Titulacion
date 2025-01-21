import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ListaCompras = () => {
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/compras/');
        console.log('Datos de compras:', response.data.results); // Para verificar los datos recibidos
        setCompras(response.data.results);
      } catch (error) {
        console.error('Error al cargar las compras:', error);
      }
    };

    fetchCompras();
  }, []);

  return (
    <div>
      <h1>Lista de Compras</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>PROVEEDOR</th>
            <th>FECHA</th>
            <th>TOTAL</th>
            <th>DETALLES</th>
          </tr>
        </thead>
        <tbody>
          {compras.map((compra) => (
            <tr key={compra.id}>
              <td>{compra.id}</td>
              <td>{compra.nombre_proveedor}</td> {/* Usar nombre_proveedor */}
              <td>{new Date(compra.fecha).toLocaleDateString()}</td>
              <td>${compra.total}</td>
              <td>
                {compra.detalles.map((detalle, index) => (
                  <div key={index}>
                    {detalle.nombre_producto}, Cantidad: {detalle.cantidad}, Precio Unitario: ${detalle.precio_unitario}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaCompras;
