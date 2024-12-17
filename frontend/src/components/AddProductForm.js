import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Importa el hook useNavigate
import "../styles/AddProductForm.css"; // Importa los estilos CSS

const AddProductForm = ({ fetchProducts }) => {
    const [newProduct, setNewProduct] = useState({
        nombre: "",
        precio: "",
        stock: "",
        descripcion: "",
    });

    const navigate = useNavigate(); // Hook para redirigir

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                "http://127.0.0.1:8000/api/auth/productos/",
                newProduct
            );
            alert("¡Producto agregado correctamente!");
            setNewProduct({ nombre: "", precio: "", stock: "", descripcion: "" });
            fetchProducts();
        } catch (error) {
            console.error("Error al agregar producto:", error);
        }
    };

    const handleCancel = () => {
        navigate("/home"); // Redirige a la home page
    };

    return (
        <div className="product-form-container">
            <h2>Gestión de Productos</h2>
            <form onSubmit={handleSubmit} className="product-form">
                <div className="form-group">
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="nombre"
                        value={newProduct.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Precio:</label>
                    <input
                        type="number"
                        name="precio"
                        value={newProduct.precio}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Stock:</label>
                    <input
                        type="number"
                        name="stock"
                        value={newProduct.stock}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Descripción:</label>
                    <textarea
                        name="descripcion"
                        value={newProduct.descripcion}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="button-group">
                    <button type="button" className="cancel-btn" onClick={handleCancel}>
                        Cancelar
                    </button>
                    <button type="submit" className="submit-btn">
                        Agregar Producto
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProductForm;
