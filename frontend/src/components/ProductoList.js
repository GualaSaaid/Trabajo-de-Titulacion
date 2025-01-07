import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/ProductoList.css';

function ProductList() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    contenido: '',
    fecha_elaboracion: '',
    fecha_caducidad: '',
    codigobarra: '',
    marca: '',
  });
  const [showSubMenu, setShowSubMenu] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get('http://localhost:8000/api/auth/productos/')
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Error al obtener los productos:', error));
  };
  
  const fetchPaginatedProducts = (page = 1) => {
    axios.get(`http://localhost:8000/api/auth/productos/?page=${page}`)
      .then((response) => {
        setProducts(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 5)); // Supongamos 5 productos por página
        setCurrentPage(page);
      })
      .catch((error) => console.error('Error al obtener los productos paginados:', error));
  };
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      fetchPaginatedProducts(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchPaginatedProducts(currentPage + 1);
    }
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
      contenido: producto.contenido,
      fecha_elaboracion: producto.fecha_elaboracion,
      fecha_caducidad: producto.fecha_caducidad,
      codigobarra: producto.codigobarra,
      marca: producto.marca,
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

  const toggleSubMenu = () => {
    setShowSubMenu(!showSubMenu);
  };

  return (
    <div className="home-container">
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
          <li>👥 CLIENTES</li>
          <li>🧺 INVENTARIO</li>
          <li>💲 PROVEEDORES</li>
          <li>💼 CAJA</li>
          <li>🚀 PREDICCIÓN</li>
          <li onClick={() => navigate('/')} style={{ cursor: "pointer" }}>🚪 SALIR</li>
        </ul>
      </div>
      <div className="product-list">
        <h1>Gestión de Productos</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Contenido</th>
              <th>Fecha Caducidad</th>
              <th>Fecha Elaboración</th>
              <th>Código de Barras</th>
              <th>Marca</th>
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
                    <input
                      type="text"
                      name="contenido"
                      value={formData.contenido}
                      onChange={handleChange}
                    />
                  ) : (
                    product.contenido
                  )}
                </td>
                <td>
                  {editingProduct === product.id ? (
                    <input
                      type="date"
                      name="fecha_caducidad"
                      value={formData.fecha_caducidad}
                      onChange={handleChange}
                    />
                  ) : (
                    product.fecha_caducidad
                  )}
                </td>
                <td>{product.fecha_elaboracion}</td>
                <td>{product.codigobarra}</td>
                <td>{product.marca}</td>
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
        <div className="pagination">
                  <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                    Anterior
                  </button>
                  <span>Página {currentPage} de {totalPages}</span>
                  <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Siguiente
                  </button>
          </div>
      </div>
    </div>
  );
}

export default ProductList;
