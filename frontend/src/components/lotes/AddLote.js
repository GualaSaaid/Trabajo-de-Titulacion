import React, { useState } from "react";
import axios from "axios";

const AddLote = () => {
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [fechaCaducidad, setFechaCaducidad] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/lotes/add_lote/", {
        producto_id: productoId,
        cantidad: cantidad,
        fecha_caducidad: fechaCaducidad,
      });
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert("Error al crear el lote");
    }
  };

  return (
    <div>
      <h1>Agregar Lote</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Producto ID:</label>
          <input
            type="text"
            value={productoId}
            onChange={(e) => setProductoId(e.target.value)}
          />
        </div>
        <div>
          <label>Cantidad:</label>
          <input
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
          />
        </div>
        <div>
          <label>Fecha de Caducidad:</label>
          <input
            type="date"
            value={fechaCaducidad}
            onChange={(e) => setFechaCaducidad(e.target.value)}
          />
        </div>
        <button type="submit">Agregar Lote</button>
      </form>
    </div>
  );
};

export default AddLote;
