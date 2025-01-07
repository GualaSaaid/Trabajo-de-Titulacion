import React, { useState } from "react";
import axios from "axios";

const PasswordResetForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/reset_password/",  // Asegúrate que esta URL sea correcta
        { email }
      );
      setMessage(response.data.message);
      setError("");  // Resetea errores si el correo se envió correctamente
    } catch (err) {
      setError("Ocurrió un error al enviar el correo.");
      setMessage("");  // Resetea el mensaje de éxito si hay error
    }
  };
  

  return (
    <div>
      <h2>Recuperación de Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Enviar</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default PasswordResetForm;
