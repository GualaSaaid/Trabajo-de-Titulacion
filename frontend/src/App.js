import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './Login/loginform';
import HomePage from './Login/homepage';
import AddProductForm from "./components/AddProductForm";
import AddProductManual from './components/AddProductManual';
import ProductList from './components/ProductoList';
import PasswordResetForm from "../src/Login/PasswordResetForm";
import './App.css';
import ModuloVentas from './components/ModuloVentas';
import RegistroVentas from './components/RegistroVentas';
import VentasList from './components/VentasList';
import GestionProveedores from './components/GestionProveedores';
import ClienteList from './components/ClienteList';
import ClienteForm from './components/ClienteForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/add-product" element={<AddProductForm />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/recuperar-password" element={<PasswordResetForm />} />
        <Route path="/add-product-manual" element={<AddProductManual />} />
        <Route path="/ventas" element={<ModuloVentas />} />
        <Route path="/registro-ventas" element={<VentasList />} />
        <Route path="/proveedores" element={<GestionProveedores />} />
        <Route path="/clientes" element={<ClienteList />} />
        <Route path="/clientes/nuevo" element={<ClienteForm />} />
        <Route path="/clientes/:id/editar" element={<ClienteForm />} />
      </Routes>
    </Router>
  );
}

export default App;

