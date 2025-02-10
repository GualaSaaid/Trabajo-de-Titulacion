import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ProductList.css";

const ProductsList = () => {
  const [productos, setProductos] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;
  const navigate = useNavigate();

  // Panel de navegación
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [showSubMenu2, setShowSubMenu2] = useState(false);
  const [showSubMenu3, setShowSubMenu3] = useState(false);
  const [showSubMenu4, setShowSubMenu4] = useState(false);

  const toggleSubMenu = () => setShowSubMenu(!showSubMenu);
  const toggleSubMenu2 = () => setShowSubMenu2(!showSubMenu2);
  const toggleSubMenu3 = () => setShowSubMenu3(!showSubMenu3);
  const toggleSubMenu4 = () => setShowSubMenu4(!showSubMenu4);

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro de que deseas salir?")) {
      navigate("/");
    }
  };

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/productos/");
        setProductos(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      }
    };

    fetchProductos();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/productos/${id}/`);
        setProductos((prev) => prev.filter((p) => p.id !== id));
        setFilteredProducts((prev) => prev.filter((p) => p.id !== id));
        alert("Producto eliminado correctamente.");
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
      }
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredProducts(
      productos.filter(
        (producto) =>
          producto.nombre.toLowerCase().includes(value) ||
          producto.codigobarra.includes(value)
      )
    );
    setCurrentPage(1);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="container">
      {/* Panel de Navegación */}
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
          <li className="menu-item">🚀 PREDICCIÓN</li>
          <li onClick={() => navigate("/historial-ventas")} className="menu-item">🛒 REGISTRO DE VENTAS</li>
          <li onClick={() => navigate("/compras")} className="menu-item">🛍️ COMPRAS</li>
          <li onClick={() => navigate("/pagos")} className="menu-item">🗂️ PAGOS</li>
          <li onClick={handleLogout} className="menu-item">🚪 SALIR</li>
        </ul>
      </div>

      <div className="products-list-container">
        <h1>Inventario</h1>
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Buscar por nombre o código de barra..."
          value={searchTerm}
          onChange={handleSearch}
        />

        <table className="products-table">
          <thead>
            <tr>
              <th className="column-nombre">Nombre</th>
              <th className="column-medium">Descripción</th>
              <th className="column-small">Precio</th>
              <th className="column-small">Stock</th>
              <th className="column-small">Código</th>
              <th className="column-acciones">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.nombre}</td>
                <td>{producto.descripcion}</td>
                <td>${producto.precio}</td>
                <td>{producto.stock}</td>
                <td>{producto.codigobarra}</td>
                <td className="action-buttons">
                  <button className="edit-button" onClick={() => navigate(`/edit-product/${producto.id}`)}>✏️ Editar</button>
                  <button className="delete-button" onClick={() => handleDelete(producto.id)}>🗑️ Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          {currentPage > 1 && <button onClick={() => setCurrentPage(currentPage - 1)}>«</button>}
          <span>Página {currentPage} de {totalPages}</span>
          {currentPage < totalPages && <button onClick={() => setCurrentPage(currentPage + 1)}>»</button>}
        </div>

        <button className="home-button" onClick={() => navigate("/home")}>
          🏠 Volver a Inicio
        </button>
      </div>
    </div>
  );
};

export default ProductsList;
