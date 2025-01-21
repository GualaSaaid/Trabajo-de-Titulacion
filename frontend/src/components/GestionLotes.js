import React, { useState, useEffect } from "react";
import axios from "axios";

const GestionLotes = () => {
  const [productos, setProductos] = useState([]); // Lista de productos
  const [lotes, setLotes] = useState([]); // Lotes del producto seleccionado
  const [productoSeleccionado, setProductoSeleccionado] = useState(""); // ID del producto seleccionado

  useEffect(() => {
    cargarProductos();
  }, []);

  // Cargar la lista de productos
  const cargarProductos = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/auth/productos/");
      setProductos(response.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  // Cargar los lotes de un producto
  const cargarLotes = async (productoId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/lotes/?producto=${productoId}`);
      setLotes(response.data);
    } catch (error) {
      console.error("Error al cargar lotes:", error);
    }
  };

  // Manejar la selección de un producto
  const manejarCambioProducto = (e) => {
    const productoId = e.target.value;
    setProductoSeleccionado(productoId);
    if (productoId) {
      cargarLotes(productoId);
    } else {
      setLotes([]);
    }
  };

  // Eliminar un lote
  const eliminarLote = async (loteId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este lote?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/lotes/${loteId}/`);
        setLotes((prevLotes) => prevLotes.filter((lote) => lote.id !== loteId));
        alert("Lote eliminado con éxito.");
      } catch (error) {
        console.error("Error al eliminar el lote:", error);
        alert("No se pudo eliminar el lote.");
      }
    }
  };

  return (
    <div>
      <h1>Gestión de Lotes</h1>
      <div>
        <label htmlFor="producto">Seleccione un producto:</label>
        <select id="producto" value={productoSeleccionado} onChange={manejarCambioProducto}>
          <option value="">Seleccione un producto</option>
          {productos.map((producto) => (
            <option key={producto.id} value={producto.id}>
              {producto.nombre}
            </option>
          ))}
        </select>
      </div>

      {lotes.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>ID Lote</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Fecha de Caducidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lotes.map((lote) => (
              <tr key={lote.id}>
                <td>{lote.id}</td>
                <td>{lote.cantidad}</td>
                <td>${lote.precio_unitario.toFixed(2)}</td>
                <td>{new Date(lote.fecha_caducidad).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => eliminarLote(lote.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GestionLotes;
