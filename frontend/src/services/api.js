import axios from "axios";

// Configuración de la instancia de Axios
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // Reemplaza con la URL de tu backend
  timeout: 5000, // Tiempo de espera de 5 segundos
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default api;
