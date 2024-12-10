// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './Login/loginform';  // Suponiendo que LoginForm es tu componente de login
import HomePage from './Login/homepage';    // El componente de la nueva interfaz
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/home" element={<HomePage/>} />  {/* Página a la que se redirige tras el login */}
      </Routes>
    </Router>
  );
}

export default App;
