import React, { useState, useEffect } from "react";
import axios from "axios";

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [form, setForm] = useState({ nombre: "", direccion: "", contacto: "", ruc: "" });

  // Obtener proveedores
  useEffect(() => {
    axios.get("http://localhost:8000/api/proveedores/")
      .then((response) => setProveedores(response.data))
      .catch((error) => console.error(error));
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Crear proveedor
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:8000/api/proveedores/", form)
      .then((response) => {
        setProveedores([...proveedores, response.data]);
        setForm({ nombre: "", direccion: "", contacto: "", ruc: "" });
      })
      .catch((error) => console.error(error));
  };

  // Eliminar proveedor
  const handleDelete = (id) => {
    axios.delete(`http://localhost:8000/api/proveedores/${id}/`)
      .then(() => setProveedores(proveedores.filter((prov) => prov.id !== id)))
      .catch((error) => console.error(error));
  };

  // Renderizar proveedores
  return (
    <div>
      <h1>Gestión de Proveedores</h1>
      <form onSubmit={handleSubmit}>
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
        <input name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} required />
        <input name="contacto" placeholder="Contacto" value={form.contacto} onChange={handleChange} required />
        <input name="ruc" placeholder="RUC" value={form.ruc} onChange={handleChange} required />
        <button type="submit">Agregar</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Contacto</th>
            <th>RUC</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((prov) => (
            <tr key={prov.id}>
              <td>{prov.id}</td>
              <td>{prov.nombre}</td>
              <td>{prov.direccion}</td>
              <td>{prov.contacto}</td>
              <td>{prov.ruc}</td>
              <td>
                <button onClick={() => handleDelete(prov.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Proveedores;
