import React from 'react';
import '../styles/ReciboVenta.css';

const ReciboVenta = ({ venta, onVolver }) => {
  const handleImprimir = () => {
    window.print();
  };

  return (
    <div className="recibo-venta">
      <h1>Recibo de Venta</h1>
      <p><strong>ID de Venta:</strong> {venta.id}</p>
      <p><strong>Fecha:</strong> {new Date().toLocaleString()}</p>
      <h2>Productos</h2>
      <ul>
        {venta.productos.map((producto, index) => (
          <li key={producto.id}>
            <span><strong>Producto {index + 1}</strong></span>
            <span><strong>Nombre:</strong> {producto.nombre}</span>
            <span><strong>Cantidad:</strong> {producto.cantidad}</span>
            <span><strong>Precio:</strong> {producto.precio}</span>
            <span><strong>Total:</strong> {producto.cantidad * producto.precio}</span>
          </li>
        ))}
      </ul>
      <h3>Total: {venta.total}</h3>
      <button onClick={handleImprimir}>Imprimir Recibo</button>
      <button onClick={onVolver}>Volver al Módulo de Ventas</button>
    </div>
  );
};

export default ReciboVenta;