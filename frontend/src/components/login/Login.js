import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/logoabastos.jpg";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/", {
        username,
        password,
      });
      alert("Login exitoso: " + response.data.token);
      navigate("/home");
    } catch (err) {
      setError("Credenciales inválidas");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Ilustración a la izquierda */}
        <div className="login-illustration">
          <img src={logo} alt="logo" />
        </div>

        {/* Formulario a la derecha */}
        <div className="login-form-container">
          <h1 className="login-title">¡Bienvenido!</h1>
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
            <p>
              <a href="/recuperar-contrasena">¿Olvidaste tu contraseña?</a>
            </p>
            {error && <p className="login-error">{error}</p>}
            <button type="submit" className="login-button">
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
