import React, { useState } from 'react';

const Factura = () => {
  const [esConsumidorFinal, setEsConsumidorFinal] = useState(false);
  const [datosCliente, setDatosCliente] = useState({
    cedula: '',
    nombre: '',
    direccion: '',
  });

  const handleConsumidorFinal = () => {
    setEsConsumidorFinal(true);
    setDatosCliente({
      cedula: '5198561632', // Número predeterminado para consumidor final
      nombre: 'Consumidor Final',
      direccion: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDatosCliente({ ...datosCliente, [name]: value });
  };

  return (
    <div>
      <h2>Factura</h2>
      <button onClick={handleConsumidorFinal}>Consumidor Final</button>
      <form>
        {!esConsumidorFinal && (
          <>
            <div>
              <label>Cédula:</label>
              <input
                type="text"
                name="cedula"
                value={datosCliente.cedula}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={datosCliente.nombre}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Dirección:</label>
              <input
                type="text"
                name="direccion"
                value={datosCliente.direccion}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}
        {esConsumidorFinal && (
          <p>Cliente: {datosCliente.nombre} - Cédula: {datosCliente.cedula}</p>
        )}
      </form>
    </div>
  );
};

export default Factura;
