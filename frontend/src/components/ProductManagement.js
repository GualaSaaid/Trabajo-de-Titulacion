import React, { useState } from "react";
import axios from "axios";

const AddProductForm = ({ fetchProducts }) => {
    const [newProduct, setNewProduct] = useState({
        nombre: "",
        precio: "",
        stock: "",
        descripcion: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/auth/productos/",
                newProduct
            );
            console.log("Producto agregado:", response.data);
            fetchProducts(); // Actualiza la lista de productos
            setNewProduct({ nombre: "", precio: "", stock: "", descripcion: "" }); // Limpia el formulario
        } catch (error) {
            if (error.response) {
                // Si el servidor responde con un error (código 4xx o 5xx)
                console.error("Error en la respuesta del servidor:", error.response.data);
            } else if (error.request) {
                // Si no hay respuesta del servidor
                console.error("No se recibió respuesta del servidor:", error.request);
            } else {
                // Otros errores, como configuración incorrecta
                console.error("Error desconocido:", error.message);
            }
        }
    };
    

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Nombre:</label>
                <input
                    type="text"
                    name="nombre"
                    value={newProduct.nombre}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Precio:</label>
                <input
                    type="number"
                    name="precio"
                    value={newProduct.precio}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Stock:</label>
                <input
                    type="number"
                    name="stock"
                    value={newProduct.stock}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Descripción:</label>
                <textarea
                    name="descripcion"
                    value={newProduct.descripcion}
                    onChange={handleChange}
                    required
                ></textarea>
            </div>
            <button type="submit">Agregar Producto</button>
        </form>
    );
};

export default AddProductForm;
