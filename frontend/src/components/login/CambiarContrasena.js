import React, { useState } from "react";
import axios from "axios";

const CambiarContrasena = () => {
    const [email, setEmail] = useState("");
    const [nuevaContrasena, setNuevaContrasena] = useState("");
    const [mensaje, setMensaje] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/cambiar-contrasena/", 
                { email, nueva_contrasena: nuevaContrasena },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            setMensaje(response.data.message);
        } catch (error) {
            setMensaje("❌ Error al cambiar la contraseña.");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", textAlign: "center" }}>
            <h2>Cambiar Contraseña</h2>
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    style={{ display: "block", margin: "10px auto", padding: "8px", width: "100%" }}
                />

                <label>Nueva Contraseña:</label>
                <input 
                    type="password" 
                    value={nuevaContrasena} 
                    onChange={(e) => setNuevaContrasena(e.target.value)} 
                    required 
                    style={{ display: "block", margin: "10px auto", padding: "8px", width: "100%" }}
                />

                <button 
                    type="submit" 
                    style={{ padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", cursor: "pointer" }}
                >
                    Cambiar Contraseña
                </button>
            </form>
            {mensaje && <p>{mensaje}</p>}
        </div>
    );
};

export default CambiarContrasena;
