import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ProveedorList.css";

const ProveedorList = () => {
  const [proveedores, setProveedores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const navigate = useNavigate();

  // Estado del panel de navegación
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
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/proveedores/");
      setProveedores(response.data);
    } catch (error) {
      console.error("Error al cargar los proveedores:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de eliminar este proveedor?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/proveedores/${id}/`);
        setProveedores((prev) => prev.filter((p) => p.id !== id));
        alert("Proveedor eliminado correctamente.");
      } catch (error) {
        console.error("Error al eliminar el proveedor:", error);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-proveedor/${id}`);
  };

  const filteredProveedores = proveedores.filter(
    (proveedor) =>
      proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProveedores.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProveedores.length / itemsPerPage);

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

      {/* Contenido de la Lista de Proveedores */}
      <div className="proveedores-list-container">
        <div className="proveedores-content">
          <h1 className="list-title">Lista de Proveedores</h1>

          <div className="search-container">
            <input
              type="text"
              placeholder="🔍 Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <table className="proveedores-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Dirección</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Contacto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((proveedor) => (
                  <tr key={proveedor.id}>
                    <td>{proveedor.nombre}</td>
                    <td>{proveedor.direccion}</td>
                    <td>{proveedor.telefono}</td>
                    <td>{proveedor.email}</td>
                    <td>{proveedor.contacto}</td>
                    <td className="actions">
                      <button className="edit" onClick={() => handleEdit(proveedor.id)}>✏️ Editar</button>
                      <button className="delete" onClick={() => handleDelete(proveedor.id)}>🗑️ Eliminar</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-results">No se encontraron proveedores</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>««</button>
              <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>«</button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button key={index + 1} onClick={() => setCurrentPage(index + 1)} className={currentPage === index + 1 ? "active" : ""}>
                  {index + 1}
                </button>
              ))}

              <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>»</button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>»»</button>
            </div>
          )}

          <div className="home-button-container">
            <button className="home-button" onClick={() => navigate("/home")}>🏠 Regresar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProveedorList;
