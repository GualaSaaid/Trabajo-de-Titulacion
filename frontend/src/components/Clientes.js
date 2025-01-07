import React, { useEffect, useState } from "react";
import api from "../services/api"; // Importa la configuración de Axios

const Clientes = () => {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    // Llama a la API para obtener los clientes
    api
      .get("/clientes/") // Reemplaza este endpoint con el correspondiente en tu backend
      .then((response) => {
        setClientes(response.data); // Actualiza el estado con los datos recibidos
      })
      .catch((error) => {
        console.error("Error al obtener clientes:", error);
      });
  }, []);

  return (
    <div>
      <h1>Lista de Clientes</h1>
      <ul>
        {clientes.map((cliente) => (
          <li key={cliente.id}>{cliente.nombre}</li>
        ))}
      </ul>
    </div>
  );
};

export default Clientes;
