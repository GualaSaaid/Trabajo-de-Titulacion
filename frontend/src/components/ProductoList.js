import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ProductoList.css';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get('http://localhost:8000/api/auth/productos/')
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Error al obtener los productos:', error));
  };

  const eliminarProducto = (id) => {
    axios.delete(`http://localhost:8000/api/auth/productos/${id}/`)
      .then(() => fetchProducts())
      .catch((error) => console.error('Error al eliminar el producto:', error));
  };

  const editarProducto = (producto) => {
    setEditingProduct(producto.id);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const actualizarProducto = (id) => {
    axios.put(`http://localhost:8000/api/auth/productos/${id}/`, formData)
      .then(() => {
        fetchProducts();
        setEditingProduct(null);
      })
      .catch((error) => console.error('Error al actualizar el producto:', error));
  };

  return (
    <div className="product-container">
      <h1>Gestión de Productos</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>
                {editingProduct === product.id ? (
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                  />
                ) : (
                  product.nombre
                )}
              </td>
              <td>
                {editingProduct === product.id ? (
                  <input
                    type="text"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                  />
                ) : (
                  product.descripcion
                )}
              </td>
              <td>
                {editingProduct === product.id ? (
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                  />
                ) : (
                  `$${product.precio}`
                )}
              </td>
              <td>
                {editingProduct === product.id ? (
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                  />
                ) : (
                  product.stock
                )}
              </td>
              <td>
                {editingProduct === product.id ? (
                  <button className="save" onClick={() => actualizarProducto(product.id)}>
                    Guardar
                  </button>
                ) : (
                  <>
                    <button className="edit" onClick={() => editarProducto(product)}>
                      Editar
                    </button>
                    <button className="delete" onClick={() => eliminarProducto(product.id)}>
                      Eliminar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;
