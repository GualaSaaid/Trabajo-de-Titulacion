import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Comprobante.css";

const Comprobante = () => {
    const { id } = useParams(); // Obtener el ID desde la URL
    const [venta, setVenta] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVenta = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/ventas/${id}/`);
                setVenta(response.data);
            } catch (err) {
                setError("Error al cargar la venta.");
            }
        };

        fetchVenta();
    }, [id]);

      const [showSubMenu, setShowSubMenu] = useState(false);
      const [showSubMenu2, setShowSubMenu2] = useState(false);
      const [showSubMenu3, setShowSubMenu3] = useState(false);
      const [showSubMenu4, setShowSubMenu4] = useState(false);
    
      const toggleSubMenu = () => {
        setShowSubMenu(!showSubMenu);
      };
      const toggleSubMenu2 = () => {
        setShowSubMenu2(!showSubMenu2);
      };
    
      const toggleSubMenu3 = () => {
        setShowSubMenu3(!showSubMenu3);
      };
    
      const toggleSubMenu4 = () => {
        setShowSubMenu4(!showSubMenu4);
      };
    
      const handleLogout = () => {
        const confirmLogout = window.confirm("¿Estás seguro de que deseas salir?");
        if (confirmLogout) {
          navigate("/"); // Redirige al login
        }
      };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!venta) {
        return <div className="loading-message">Cargando datos de la venta...</div>;
    }

    return (
        <div className="comprobante-container">
            <div className="sidebar">
                <ul>
                <li onClick={() => navigate("/ventas")} className="menu-item">📊 VENTAS</li>
                <li onClick={toggleSubMenu} className="menu-item">
                    📦 PRODUCTOS
                    <ul className={`submenu ${showSubMenu ? "show" : ""}`}>
                    <li onClick={() => navigate("/add-product")}>Crear Producto</li>
                    <li onClick={() => navigate("/cargar-excel")}>Carga de Productos</li>
                    </ul>
                </li>
                <li onClick={toggleSubMenu3} className="menu-item">
                    👥 CLIENTES
                    <ul className={`submenu ${showSubMenu3 ? "show" : ""}`}>
                    <li onClick={() => navigate("/add-client")}>Añadir Cliente</li>
                    <li onClick={() => navigate("/clients")}>Lista de Clientes</li>
                    </ul>
                </li>
                <li onClick={() => navigate("/products")} className="menu-item">🧺 INVENTARIO</li>
                <li onClick={toggleSubMenu4} className="menu-item">
                    💲 PROVEEDORES
                    <ul className={`submenu ${showSubMenu4 ? "show" : ""}`}>
                    <li onClick={() => navigate("/nuevo-proveedor")}>Crear Proveedor</li>
                    <li onClick={() => navigate("/proveedores")}>Lista Proveedores</li>
                    </ul>
                </li>
                <li onClick={toggleSubMenu2} className="menu-item">
                    💼 CAJA
                    <ul className={`submenu ${showSubMenu2 ? "show" : ""}`}>
                    <li onClick={() => navigate("/historial-caja")}>Historial Caja</li>
                    <li onClick={() => navigate("/control-caja")}>Cierre de Caja</li>
                    </ul>
                </li>
                <li onClick={() => navigate("/prediccion-demanda")} className="menu-item">🚀 PREDICCIÓN</li>
                <li onClick={() => navigate("/historial-ventas")} className="menu-item">🛒 REGISTRO DE VENTAS</li>
                <li onClick={() => navigate("/compras")} className="menu-item">🛍️ COMPRAS</li>
                <li onClick={() => navigate("/pagos")} className="menu-item">🗂️ PAGOS</li>
                <li onClick={() => navigate("/reporte")} className="menu-item"> 📊 REPORTES</li>
                <li onClick={handleLogout} className="menu-item">🚪 SALIR</li>
                </ul>
            </div>
            <div className="comprobante-header">
                <h1>Comprobante de Venta</h1>
                <h3>Gracias por su compra</h3>
            </div>
            <div className="comprobante-details">
                <p><strong>Cliente:</strong> {venta.cliente_nombre}</p>
                <p><strong>Fecha:</strong> {new Date(venta.fecha).toLocaleString()}</p>
                <p><strong>Total:</strong> ${parseFloat(venta.total).toFixed(2)}</p>
            </div>
            <div className="table-container">
                <table className="comprobante-table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {venta.detalles.map((detalle) => (
                            <tr key={detalle.id}>
                                <td>{detalle.producto_nombre}</td>
                                <td>{detalle.cantidad}</td>
                                <td>${parseFloat(detalle.precio_unitario).toFixed(2)}</td>
                                <td>${(detalle.cantidad * parseFloat(detalle.precio_unitario)).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="comprobante-actions">
                <button onClick={() => window.print()}>Imprimir</button>
                <button onClick={() => navigate("/home")}>Regresar al inicio</button>
            </div>
        </div>
    );
};

export default Comprobante;
