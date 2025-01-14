import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/ProductoList.css';
import '../Login/homepage.css';

function ProductoList() {
  // Estados
  const [allProducts, setAllProducts] = useState([]); // Todos los productos
  const [products, setProducts] = useState([]); // Productos de la página actual
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(0); // Total de páginas
  const [editingProduct, setEditingProduct] = useState(null); // Producto en edición
  const [formData, setFormData] = useState({}); // Datos del formulario de edición
  const itemsPerPage = 5; // Número de productos por página
  const navigate = useNavigate();
  const [showSubMenu, setShowSubMenu] = useState(false);

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProducts();
  }, []);

  // Función para obtener los productos
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/auth/productos/');
      const data = response.data; // API devuelve un array de objetos
      setAllProducts(data); // Guarda todos los productos
      setTotalPages(Math.ceil(data.length / itemsPerPage)); // Calcula total de páginas
      setProducts(data.slice(0, itemsPerPage)); // Muestra los primeros productos
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      setAllProducts([]);
      setProducts([]);
      setTotalPages(0);
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("¿Estás seguro de que deseas salir?");
    if (confirmLogout) {
      // Aquí puedes limpiar datos de sesión si es necesario
      navigate("/"); // Redirige al login
    }
  };
  const toggleSubMenu = () => {
    setShowSubMenu(!showSubMenu);
  };
  // Función para eliminar un producto
  const eliminarProducto = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/auth/productos/${id}/`); // Barra añadida al final
      fetchProducts(); // Refresca la lista después de eliminar
    } catch (error) {
      console.error('Error al eliminar el producto:', error.response?.data || error.message);
      alert(
        error.response?.data?.error || 
        'No se pudo eliminar el producto. Verifica si está relacionado con otros registros.'
      );
    }
  };
  
  

  // Función para activar el modo de edición
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

  // Función para manejar cambios en el formulario de edición
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Función para guardar cambios en un producto
  const actualizarProducto = async (id) => {
    try {
      await axios.put(`http://localhost:8000/api/auth/productos/${id}/`, formData); // Nota la barra al final
      fetchProducts(); // Refresca la lista después de actualizar
      setEditingProduct(null); // Cierra el modo de edición
    } catch (error) {
      console.error('Error al actualizar el producto:', error.response?.data || error.message);
      alert(
        error.response?.data?.error || 
        'No se pudo actualizar el producto. Por favor, verifica el servidor.'
      );
    }
  };

  // Cambiar a la página anterior
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      const startIndex = (newPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setProducts(allProducts.slice(startIndex, endIndex));
      setCurrentPage(newPage);
    }
  };

  // Cambiar a la página siguiente
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      const startIndex = (newPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setProducts(allProducts.slice(startIndex, endIndex));
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="main-content">
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
            {products.length > 0 ? (
              products.map((product) => (
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
                  <td>{editingProduct === product.id ? (
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
                  <td>{editingProduct === product.id ? (
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
                  <td>{editingProduct === product.id ? (
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
                  <td>{editingProduct === product.id ? (
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
                  <td>{product.fecha_caducidad}</td>
                  <td>{product.fecha_elaboracion}</td>
                  <td>{product.codigobarra}</td>
                  <td>{product.marca}</td>
                  <td>
                    {editingProduct === product.id ? (
                      <button onClick={() => actualizarProducto(product.id)}>Guardar</button>
                    ) : (
                      <>
                        <button onClick={() => editarProducto(product)}>Editar</button>
                        <button onClick={() => eliminarProducto(product.id)}>Eliminar</button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11">No hay productos disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="pagination">
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>Anterior</button>
          <span>Página {currentPage} de {totalPages > 0 ? totalPages : 1}</span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>Siguiente</button>
        </div>
      </div>
    </div>
  );
}

export default ProductoList;
