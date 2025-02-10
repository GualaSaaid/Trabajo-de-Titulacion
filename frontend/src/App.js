import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login/Login';
import HomePage from "./components/home/HomePage";
import Ventas from "./components/ventas/Ventas";
import ProductsList from './components/Productos/ProductList';
import ProductForm from './components/Productos/ProductForm';
import ClientList from './components/clientes/ClientList';
import ClientForm from './components/clientes/ClientForm';
import HistorialVentas from './components/ventas/HistorialVentas';
import UploadExcel from './components/Productos/UploadExcel';
import Comprobante from './components/ventas/Comprobante';
import Compras from './components/compras/Compras';
import PagosCompra from './components/compras/PagosCompra';
import ControlCaja from './components/caja/ControlCaja';
import HistorialCaja from './components/caja/HistorialCaja';
import Proveedores from './components/proveedores/Proveedores';
import ProveedorList from './components/proveedores/ProveedorList';
import Reporte from './components/Reportes/reporte';
import Factura  from './components/ventas/Factura';
import PrediccionDemanda from './components/prediccion_demanda/PrediccionDemanda';
import RecuperarContrasena from './components/login/RecuperarContrasena';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/products" element={<ProductsList />} />
        <Route path="/add-product" element={<ProductForm />} />
        <Route path="/edit-product/:id" element={<ProductForm />} />
        <Route path="/clients" element={<ClientList />} />
        <Route path="/add-client" element={<ClientForm />} />
        <Route path="/edit-client/:id" element={<ClientForm />} />
        <Route path="/historial-ventas" element={<HistorialVentas />} />
        <Route path="/cargar-excel" element={<UploadExcel />} />
        <Route path="/comprobante/:id" element={<Comprobante />} />
        <Route path="/compras" element={<Compras />} />
        <Route path="/pagos" element={<PagosCompra />} />
        <Route path="/control-caja" element={<ControlCaja />} />
        <Route path="/historial-caja" element={<HistorialCaja />} />
        <Route path="/proveedores" element={<ProveedorList />} />
        <Route path="/nuevo-proveedor" element={<Proveedores />} />
        <Route path="/edit-proveedor/:id" element={<Proveedores />} />
        <Route path="/reporte" element={<Reporte />} />
        <Route path="factura/" element={<Factura />} />
        <Route path="/prediccion-demanda" element={<PrediccionDemanda />} />
        <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
      </Routes>
    </Router>
  );
}

export default App;
