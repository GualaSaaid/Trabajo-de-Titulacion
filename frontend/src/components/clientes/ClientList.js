import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ClientList.css";

const ClientList = () => {
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 5;
  const navigate = useNavigate();

  const [showSubMenu, setShowSubMenu] = useState(false);
  const [showSubMenu2, setShowSubMenu2] = useState(false);
  const [showSubMenu3, setShowSubMenu3] = useState(false);
  const [showSubMenu4, setShowSubMenu4] = useState(false);

  const toggleSubMenu = () => setShowSubMenu(!showSubMenu);
  const toggleSubMenu2 = () => setShowSubMenu2(!showSubMenu2);
  const toggleSubMenu3 = () => setShowSubMenu3(!showSubMenu3);
  const toggleSubMenu4 = () => setShowSubMenu4(!showSubMenu4);

  const handleLogout = () => {
    const confirmLogout = window.confirm("¿Estás seguro de que deseas salir?");
    if (confirmLogout) {
      navigate("/");
    }
  };

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/clientes/");
        setClientes(response.data);
      } catch (error) {
        console.error("Error al cargar los clientes:", error);
      }
    };

    fetchClientes();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de eliminar este cliente?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/clientes/${id}/`);
        setClientes((prevClientes) => prevClientes.filter((c) => c.id !== id));
        alert("Cliente eliminado correctamente.");
      } catch (error) {
        console.error("Error al eliminar el cliente:", error);
        alert("Hubo un error al eliminar el cliente.");
      }
    }
  };

  // Filtrar clientes por nombre o cédula
  const filteredClients = clientes.filter(
    (cliente) =>
      (cliente.nombre && cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (cliente.cedula && cliente.cedula.includes(searchTerm))
  );

  // Paginación
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

  return (
    <div className="container">
      {/* Sidebar */}
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

      {/* Contenido principal */}
      <div className="clients-list-container">
        <h1 className="list-title">Lista de Clientes</h1>

        {/* Campo de búsqueda */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar por nombre o cédula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <table className="clients-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Cédula</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentClients.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nombre || "N/A"}</td>
                <td>{cliente.email || "N/A"}</td>
                <td>{cliente.telefono || "N/A"}</td>
                <td>{cliente.cedula || "N/A"}</td>
                <td className="action-buttons">
                  <button className="edit-button" onClick={() => navigate(`/edit-client/${cliente.id}`)}>✏️ Editar</button>
                  <button className="delete-button" onClick={() => handleDelete(cliente.id)}>🗑️ Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>⬅️ Anterior</button>
            <span>Página {currentPage} de {totalPages}</span>
            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Siguiente ➡️</button>
          </div>
        )}

        {/* Botón de regresar a Home */}
        <div className="home-button-container">
          <button className="home-button" onClick={() => navigate("/home")}>🏠 Regresar</button>
        </div>
      </div>
    </div>
  );
};

export default ClientList;
