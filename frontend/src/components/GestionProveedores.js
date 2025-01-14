import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GestionProveedores = () => {
    const [proveedores, setProveedores] = useState([]);
    const [form, setForm] = useState({ nombre: '', ruc: '', telefono: '', direccion: '' });

    useEffect(() => {
        cargarProveedores(); // Carga los proveedores al montar el componente
    }, []);

    // Cargar proveedores desde la API
    const cargarProveedores = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/proveedores/');
            console.log("Respuesta de la API:", response.data); // Verifica qué devuelve la API
            setProveedores(response.data.results); // Correcto
        } catch (error) {
            console.error("Error al cargar proveedores:", error.response?.data || error.message);
            alert("Error al cargar proveedores.");
        }
    };
    

    // Manejar cambios en el formulario
    const manejarCambio = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Guardar un nuevo proveedor o actualizar uno existente
    const guardarProveedor = async () => {
        const proveedor = {
            ...form,
            telefono: form.telefono.trim() || null, // Envía null si el campo está vacío
        };
    
        try {
            if (form.id) {
                await axios.put(`http://127.0.0.1:8000/api/proveedores/${form.id}/`, proveedor);
            } else {
                await axios.post('http://127.0.0.1:8000/api/proveedores/', proveedor);
            }
            setForm({ nombre: '', ruc: '', telefono: '', direccion: '' });
            cargarProveedores();
        } catch (error) {
            console.error("Error al guardar el proveedor:", error.response?.data || error.message);
            alert("Error al guardar el proveedor. Verifica los datos.");
        }
    };
    
    

    // Cargar datos del proveedor al formulario para editar
    const editarProveedor = (proveedor) => {
        setForm(proveedor);
    };

    // Eliminar un proveedor
    const eliminarProveedor = async (id) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este proveedor?")) {
            return;
        }
        try {
            await axios.delete(`http://127.0.0.1:8000/api/proveedores/${id}/`);
            alert("Proveedor eliminado exitosamente.");
            cargarProveedores(); // Recarga la lista de proveedores
        } catch (error) {
            console.error("Error al eliminar el proveedor:", error.response?.data || error.message);
            alert("Error al eliminar el proveedor.");
        }
    };

    return (
        <div>
            <h2>Gestión de Proveedores</h2>
            <form>
                <input
                    name="nombre"
                    value={form.nombre}
                    onChange={manejarCambio}
                    placeholder="Nombre *"
                />
                <input
                    name="ruc"
                    value={form.ruc}
                    onChange={manejarCambio}
                    placeholder="RUC *"
                />
                <input
                    name="telefono"
                    value={form.telefono}
                    onChange={manejarCambio}
                    placeholder="Teléfono"
                />
                <input
                    name="direccion"
                    value={form.direccion}
                    onChange={manejarCambio}
                    placeholder="Dirección"
                />
                <button type="button" onClick={guardarProveedor}>
                    {form.id ? "Actualizar" : "Guardar"}
                </button>
            </form>
            <h3>Lista de Proveedores</h3>
            <ul>
                {Array.isArray(proveedores) && proveedores.length > 0 ? (
                    proveedores.map((p) => (
                        <li key={p.id}>
                            <span>{p.nombre} - {p.ruc} - {p.telefono} - {p.direccion}</span>
                            <button onClick={() => editarProveedor(p)}>Editar</button>
                            <button onClick={() => eliminarProveedor(p.id)}>Eliminar</button>
                        </li>
                    ))
                ) : (
                    <li>No hay proveedores disponibles</li> // Mensaje si no hay proveedores
                )}
            </ul>
        </div>
    );
};

export default GestionProveedores;
