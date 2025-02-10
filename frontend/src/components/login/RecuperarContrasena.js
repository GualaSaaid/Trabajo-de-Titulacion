import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RecuperarContrasena.css"; // 📌 Importamos el CSS

const RecuperarContrasena = () => {
    const [email, setEmail] = useState("");
    const [codigo, setCodigo] = useState("");
    const [nuevaContrasena, setNuevaContrasena] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [fase, setFase] = useState(1); // 📌 Fase 1: Pedir email | Fase 2: Validar código y cambiar contraseña
    
    // 📌 Enviar solicitud para recuperar contraseña
    const solicitarRecuperacion = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/solicitar-recuperacion/", { email });
            setMensaje(response.data.message);
            setFase(2); // 📌 Pasar a la fase de validación del código
        } catch (error) {
            setMensaje("❌ Error al enviar la solicitud.");
            setMensaje("	El usuario no existe.");
        }
    };
    const navigate = useNavigate();


    // 📌 Enviar código y nueva contraseña
    const cambiarContrasena = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/cambiar-contrasena/", {
                email,
                codigo,
                nueva_contrasena: nuevaContrasena,
            });
            setMensaje(response.data.message);
            setFase(3); // 📌 Finalizado
        } catch (error) {
            setMensaje("❌ Error al cambiar la contraseña.");
        }
    };

    return (
        <div className="recuperar-contrasena-container">
            <div className="recuperar-contrasena">
                <h2>Recuperar Contraseña</h2>

                {fase === 1 && (
                    <form onSubmit={solicitarRecuperacion}>
                        <label>Email:</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <button type="submit">Enviar Código</button>
                    </form>
                )}

                {fase === 2 && (
                    <form onSubmit={cambiarContrasena}>
                        <label>Código de recuperación:</label>
                        <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} required />

                        <label>Nueva contraseña:</label>
                        <input type="password" value={nuevaContrasena} onChange={(e) => setNuevaContrasena(e.target.value)} required />

                        <button type="submit">Cambiar Contraseña</button>
                    </form>
                    
                )}

                {fase === 3 && <p className="exito">✅ Tu contraseña ha sido cambiada correctamente.</p>}

                {mensaje && <p>{mensaje}</p>}
                <button className="boton-regresar" onClick={() => navigate("/")}>Cancelar</button>
            </div>
        </div>
    );
};

export default RecuperarContrasena;
