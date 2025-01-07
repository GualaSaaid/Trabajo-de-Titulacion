import React from 'react';
import { Link } from "react-router-dom";

const Login = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <form style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
                <h2>Login</h2>
                <label>Email</label>
                <input type="email" placeholder="Enter your email" required />
                <label>Password</label>
                <input type="password" placeholder="Enter your password" required />
                <button type="submit" style={{ marginTop: '20px' }}>Login</button>
                <p>
                    ¿Olvidaste tu contraseña?{" "}
                    <Link to="/recuperar-password">Recupérala aquí</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
