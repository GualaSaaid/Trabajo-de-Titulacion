import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const GestionComprasFEFO = () => {
    const [proveedores, setProveedores] = useState([]);
    const [productos, setProductos] = useState([]);
    const [formCompra, setFormCompra] = useState({ proveedor: "", detalles: [] });
    const [detalles, setDetalles] = useState([]);

    // Refs para los campos de entrada
    const productoRef = useRef(null);
    const cantidadRef = useRef(null);
    const precioUnitarioRef = useRef(null);
    const fechaCaducidadRef = useRef(null);

    useEffect(() => {
        cargarProveedores();
        cargarProductos();
    }, []);

    const cargarProveedores = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/proveedores/");
            setProveedores(response.data.results || response.data || []);
        } catch (error) {
            console.error("Error al cargar proveedores:", error.response?.data || error.message);
            alert("Error al cargar proveedores.");
        }
    };

    const cargarProductos = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/auth/productos/");
            setProductos(response.data);
        } catch (error) {
            console.error("Error al cargar productos:", error);
        }
    };

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setFormCompra({ ...formCompra, [name]: value });
    };

    const agregarDetalle = () => {
        const productoId = productoRef.current.value;
        const cantidad = cantidadRef.current.value;
        const precioUnitario = precioUnitarioRef.current.value;
        const fechaCaducidad = fechaCaducidadRef.current.value;

        if (!productoId || !cantidad || !precioUnitario || !fechaCaducidad) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        const detalle = {
            producto: parseInt(productoId, 10),
            cantidad: parseInt(cantidad, 10),
            precio_unitario: parseFloat(precioUnitario),
            fecha_caducidad: fechaCaducidad,
        };

        setDetalles((prevDetalles) => [...prevDetalles, detalle]);

        // Limpiar los campos después de agregar
        productoRef.current.value = "";
        cantidadRef.current.value = "";
        precioUnitarioRef.current.value = "";
        fechaCaducidadRef.current.value = "";
    };

    const eliminarDetalle = (index) => {
        setDetalles((prevDetalles) => prevDetalles.filter((_, i) => i !== index));
    };

    const guardarCompra = async () => {
        if (!formCompra.proveedor || detalles.length === 0) {
            alert("Debe seleccionar un proveedor y agregar al menos un detalle.");
            return;
        }

        try {
            const payload = {
                proveedor: formCompra.proveedor,
                detalles,
            };

            console.log("Payload enviado al backend:", payload);

            await axios.post("http://127.0.0.1:8000/api/compras/", payload);
            alert("Compra registrada exitosamente.");
            setFormCompra({ proveedor: "", detalles: [] });
            setDetalles([]);
        } catch (error) {
            console.error("Error al registrar la compra:", error.response?.data || error.message);
            alert("Error al registrar la compra. Verifique los datos.");
        }
    };

    return (
        <div>
            <h2>Gestión de Compras (FEFO)</h2>
            <form>
                <label>Proveedor:</label>
                <select
                    name="proveedor"
                    value={formCompra.proveedor}
                    onChange={manejarCambio}
                >
                    <option value="">Seleccione un proveedor</option>
                    {proveedores.map((proveedor) => (
                        <option key={proveedor.id} value={proveedor.id}>
                            {proveedor.nombre}
                        </option>
                    ))}
                </select>
                <h3>Detalles de la Compra</h3>
                {detalles.map((detalle, index) => (
                    <div key={index}>
                        <span>
                            {detalle.producto} - {detalle.cantidad} unidades - $
                            {detalle.precio_unitario.toFixed(2)} - Caduca: {detalle.fecha_caducidad}
                        </span>
                        <button
                            type="button"
                            onClick={() => eliminarDetalle(index)}
                        >
                            Eliminar
                        </button>
                    </div>
                ))}
                <div>
                    <h4>Agregar Detalle</h4>
                    <select ref={productoRef}>
                        <option value="">Seleccione un producto</option>
                        {productos.map((producto) => (
                            <option key={producto.id} value={producto.id}>
                                {producto.nombre}
                            </option>
                        ))}
                    </select>
                    <input
                        ref={cantidadRef}
                        type="number"
                        placeholder="Cantidad"
                        min="1"
                    />
                    <input
                        ref={precioUnitarioRef}
                        type="number"
                        placeholder="Precio Unitario"
                        min="0.01"
                        step="0.01"
                    />
                    <input ref={fechaCaducidadRef} type="date" />
                    <button
                        type="button"
                        onClick={agregarDetalle}
                    >
                        Agregar
                    </button>
                </div>
                <button type="button" onClick={guardarCompra}>
                    Registrar Compra
                </button>
            </form>
        </div>
    );
};

export default GestionComprasFEFO;
