import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Elimina el token
        navigate('/login'); // Redirige al login
    };

    return (
        <div>
            <h1>Bienvenido al Dashboard</h1>
            <button onClick={handleLogout}>Cerrar Sesión</button>
        </div>
    );
};

export default Dashboard;
