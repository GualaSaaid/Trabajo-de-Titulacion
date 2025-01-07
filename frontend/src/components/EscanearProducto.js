import React, { useState } from 'react';
import BarcodeReader from 'react-barcode-reader';
import axios from 'axios';

const EscanearProducto = () => {
  const [productos, setProductos] = useState([]);
  const [total, setTotal] = useState(0);
  const [codigoBarra, setCodigoBarra] = useState(''); // Agregado para manejar el código de barra ingresado manualmente
  const [cantidad, setCantidad] = useState(1);

  const agregarProducto = (producto) => {
    setProductos((prevProductos) => {
      const productoExistente = prevProductos.find((item) => item.codigobarra === producto.codigobarra);
      if (productoExistente) {
        return prevProductos.map((item) =>
          item.codigobarra === producto.codigobarra
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        return [...prevProductos, { ...producto, cantidad: 1 }];
      }
    });
    setTotal((prevTotal) => prevTotal + parseFloat(producto.precio));
  };

  const manejarEscaneo = async (codigoBarraEscaneado) => {
    try {
        const codigo = codigoBarraEscaneado || codigoBarra;
        if (!codigo) return;
        const respuesta = await axios.get(`http://127.0.0.1:8000/api/productos/codigo_barra/${codigo}/`);
        const cantidad = parseInt(prompt("Ingrese la cantidad"));
        agregarProducto({ ...respuesta.data, cantidad });
        setCodigoBarra('');
    } catch (error) {
        // ...
    }
};

  const manejarCambio = (e) => {
    const valor = e.target.value;
    setCodigoBarra(valor);

    if (valor.length === 13) {
      agregarProducto(); // Llama a la función para agregar el producto
      setCodigoBarra(""); // Limpia el campo automáticamente
    }
  };

  const manejarCambioCantidad = (e) => {
    setCantidad(e.target.value);
  };

  const manejarSubmit = (e) => {
    e.preventDefault();
    const ventaData = {
        cliente: "cliente x", // Reemplaza con el nombre del cliente real
        detalles: productos.map(producto => ({
            producto: producto.id,
            cantidad: producto.cantidad
        }))
    };
    axios.post('/api/ventas/', ventaData)
        .then(response => {
            console.log('Venta realizada:', response.data);
            // Limpiar el estado y mostrar un mensaje de éxito
            setProductos([]);
            setTotal(0);
            setCodigoBarra('');
        })
        .catch(error => {
            console.error('Error al realizar la venta:', error);
        });
        agregarProducto({ ...respuesta.data, cantidad });
};

  return (
    <div>
      <h2>Escanear Producto</h2>
      <BarcodeReader
        onScan={manejarEscaneo} // Escaneo automático con lector de códigos de barra
        onError={(err) => console.error(err)}
      />
      <form onSubmit={manejarSubmit}>
        <input
          type="text"
          value={codigoBarra}
          onChange={manejarCambio}
          placeholder="Escanea o ingresa un código"
          autoFocus
        />
        <button type="submit">Agregar</button>
      </form>
      <div>
        <h3>Productos Escaneados</h3>
        <ul>
          {productos.map((item, index) => (
            <li key={index}>
              {item.nombre} - {item.cantidad} x {item.precio} = {item.cantidad * item.precio}
            </li>
          ))}
        </ul>
        <h3>Total: {total}</h3>
      </div>
    </div>
  );
};

export default EscanearProducto;
