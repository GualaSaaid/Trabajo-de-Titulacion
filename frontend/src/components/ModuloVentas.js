import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReciboVenta from '../components/ReciboVenta.js';
import '../styles/ModuloVentas.css'; // Importación del CSS

const ModuloVentas = () => {
    const [productos, setProductos] = useState([]);
    const [productosVenta, setProductosVenta] = useState([]);
    const [total, setTotal] = useState(0);
    const [codigoBarra, setCodigoBarra] = useState('');
    const [ventaProcesada, setVentaProcesada] = useState(null);
    const [tipoCliente, setTipoCliente] = useState('');

    const [facturaDatos, setFacturaDatos] = useState({
        nombre: '',
        correo: '',
        telefono: '',
        direccion: '',
        ruc: '',
    });
    const navigate = useNavigate();
    const [showSubMenu, setShowSubMenu] = useState(false); 
    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const respuesta = await axios.get('http://127.0.0.1:8000/api/products/');
                setProductos(respuesta.data);
            } catch (error) {
                console.error('Error al cargar los productos:', error);
            }
        };

        cargarProductos();
    }, []);
    

    useEffect(() => {
        const nuevoTotal = productosVenta.reduce(
            (acumulado, item) => acumulado + item.precio * item.cantidad,
            0
        );
        setTotal(nuevoTotal);
    }, [productosVenta]);

    
    const toggleSubMenu = () => {
        setShowSubMenu(!showSubMenu);
      };
    
      const handleLogout = () => {
        const confirmLogout = window.confirm("¿Estás seguro de que deseas salir?");
        if (confirmLogout) {
          // Aquí puedes limpiar datos de sesión si es necesario
          navigate("/"); // Redirige al login
        }
      };
    const procesarVenta = async () => {
        if (productosVenta.length === 0) {
            alert('No hay productos en la venta.');
            return;
        }

        if (tipoCliente === 'Factura' && (!facturaDatos.nombre || !facturaDatos.ruc)) {
            alert('Por favor, complete todos los datos de la factura.');
            return;
        }

        try {
            const payload = {
                tipo_comprobante: tipoCliente === 'Factura' ? 'Factura' : 'Ticket',
                cliente: tipoCliente === 'Factura' ? facturaDatos : null,
                productos: productosVenta.map((item) => ({
                    producto_id: item.id,
                    cantidad: item.cantidad,
                })),
                total: total,
            };

            const respuesta = await axios.post('http://127.0.0.1:8000/api/ventas/', payload);

            setVentaProcesada({
                id: respuesta.data.id,
                productos: productosVenta,
                total: total,
                cliente: tipoCliente === 'Factura' ? facturaDatos : null,
                tipo_comprobante: tipoCliente,
            });

            setProductosVenta([]);
            setTotal(0);
            setFacturaDatos({
                nombre: '',
                correo: '',
                telefono: '',
                direccion: '',
                ruc: '',
            });
        } catch (error) {
            console.error('Error al procesar la venta:', error);
            alert('Hubo un error al procesar la venta.');
        }
    };

    const agregarProductoAVenta = (codigoBarra) => {
        const producto = productos.find((p) => p.codigobarra === codigoBarra);
        if (producto) {
            setProductosVenta((prevVenta) => {
                const productoExistente = prevVenta.find((item) => item.codigobarra === producto.codigobarra);
                if (productoExistente) {
                    return prevVenta.map((item) =>
                        item.codigobarra === producto.codigobarra
                            ? { ...item, cantidad: item.cantidad + 1 }
                            : item
                    );
                } else {
                    return [...prevVenta, { ...producto, cantidad: 1 }];
                }
            });
        } else {
            alert('Producto no encontrado.');
        }
    };

    const manejarCambio = (e) => {
        const valor = e.target.value;
        setCodigoBarra(valor);

        if (valor.length === 13) {
            agregarProductoAVenta(valor);
            setCodigoBarra('');
        }
    };

    if (ventaProcesada) {
        return (
            <ReciboVenta
                venta={ventaProcesada}
                onVolver={() => setVentaProcesada(null)}
            />
        );
    }

    return (
        <div className="modulo-ventas">
            <div className="sidebar">
                <ul>
                <li><span>☰</span></li>
                <li onClick={() => navigate('/ventas')} style={{ cursor: 'pointer' }}>📊 VENTAS</li>
                <li onClick={toggleSubMenu} style={{ cursor: 'pointer' }}>
                    📦 PRODUCTOS
                    {showSubMenu && (
                    <ul className="submenu">
                        <li onClick={() => navigate('/add-product')}>Crear Producto</li>
                        <li onClick={() => navigate('/products')}>Lista de Productos</li>
                        <li onClick={() => navigate('/add-product-manual')}>Ingresar Producto</li>
                    </ul>
                    )}
                </li>
                <li onClick={() => navigate('/clientes')} style={{ cursor: 'pointer' }}>👥 CLIENTES</li>
                <li>🧺 INVENTARIO</li>
                <li onClick={() => navigate('/proveedores')} style={{ cursor: 'pointer' }}>💲 PROVEEDORES</li>
                <li>💼 CAJA</li>
                <li>🚀 PREDICCIÓN</li>
                <li onClick={() => navigate('/registro-ventas')} style={{ cursor: 'pointer' }}>🛒 REGISTRO DE VENTAS</li>
                <li onClick={handleLogout} style={{ cursor: "pointer" }}>🚪 SALIR</li>
                </ul>
            </div>
            <div className="ventas-column">
                <h2>Módulo de Ventas</h2>
                <div>
                    <h3>Seleccionar tipo de cliente:</h3>
                    <button className="btn-cliente" onClick={() => setTipoCliente('Consumidor Final')}>
                        Consumidor Final
                    </button>
                    <button className="btn-cliente" onClick={() => setTipoCliente('Factura')}>
                        Factura
                    </button>
                </div>
                <div className="escaneo">
                    <h3>Escanear código de barras</h3>
                    <input
                        type="text"
                        value={codigoBarra}
                        onChange={manejarCambio}
                        autoFocus
                    />
                </div>
                <div className="productos-venta">
                    <h3>Productos en la venta:</h3>
                    <ul>
                        {productosVenta.map((producto) => (
                            <li key={producto.id}>
                                <span>{producto.nombre}</span>
                                <span>{producto.cantidad} x {producto.precio} = {producto.cantidad * producto.precio}</span>
                            </li>
                        ))}
                    </ul>
                    <h3>Total: {total}</h3>
                </div>
            </div>
            <div className="procesar-venta-container">
                <button onClick={procesarVenta}>Procesar Venta</button>
            </div>
            {tipoCliente === 'Factura' && (
                <div className="factura-form">
                    <h3>Datos de la Factura</h3>
                    <form>
                        <label>Nombre:</label>
                        <input
                            type="text"
                            value={facturaDatos.nombre}
                            onChange={(e) => setFacturaDatos({ ...facturaDatos, nombre: e.target.value })}
                        />
                        <label>Correo:</label>
                        <input
                            type="email"
                            value={facturaDatos.correo}
                            onChange={(e) => setFacturaDatos({ ...facturaDatos, correo: e.target.value })}
                        />
                        <label>Teléfono:</label>
                        <input
                            type="text"
                            value={facturaDatos.telefono}
                            onChange={(e) => setFacturaDatos({ ...facturaDatos, telefono: e.target.value })}
                        />
                        <label>Dirección:</label>
                        <input
                            type="text"
                            value={facturaDatos.direccion}
                            onChange={(e) => setFacturaDatos({ ...facturaDatos, direccion: e.target.value })}
                        />
                        <label>RUC/NIT:</label>
                        <input
                            type="text"
                            value={facturaDatos.ruc}
                            onChange={(e) => setFacturaDatos({ ...facturaDatos, ruc: e.target.value })}
                        />
                    </form>
                </div>
            )}
        </div>
    );
};

export default ModuloVentas;
