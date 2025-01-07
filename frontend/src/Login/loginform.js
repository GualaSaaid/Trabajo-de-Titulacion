// src/LoginForm.js
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './login.css'; // Asegúrate de crear este archivo para los estilos

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Hook para la navegación

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { username, password };

    try {
      // Realiza la solicitud POST al backend de Django
      const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      // Verifica la respuesta del backend
      if (response.ok) {
        setMessage(data.message); // Mostrar mensaje de éxito
        navigate('/home'); // Redirigir al usuario
      } else {
        setMessage(data.message); // Mostrar mensaje de error
      }
    } catch (error) {
      setMessage("Hubo un error al intentar iniciar sesión.");
    }
  };

  return (
    <div className="login-container">
      {/* Contenedor para la imagen */}
      <div className="image-container">
        <img src="/imagenes/logo.jpg" alt="Logo" className="logo" />
      </div>

      {/* Contenedor para el formulario */}
      <div className="form-container">
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre de usuario:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Iniciar sesión</button>
        </form>
        <div className="password-reset">
          <Link to="/recuperar-password">¿Olvidaste tu contraseña?</Link>
        </div>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default LoginForm;
