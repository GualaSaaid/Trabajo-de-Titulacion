import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Ventas.css";

const Ventas = () => {
  const [productos, setProductos] = useState([]);
  const [codigoBarra, setCodigoBarra] = useState("");
  const [nombreProducto, setNombreProducto] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [clienteId, setClienteId] = useState("");
  const [clientes, setClientes] = useState([]);
  const [factura, setFactura] = useState(false);
  const [cliente, setCliente] = useState({
    nombre: "",
    cedula: "",
    direccion: "",
    email: "",
    telefono: "",
  });

  const navigate = useNavigate();
  const [showSubMenu, setShowSubMenu] = useState(false);
    const [showSubMenu2, setShowSubMenu2] = useState(false);
    const [showSubMenu3, setShowSubMenu3] = useState(false);
    const [showSubMenu4, setShowSubMenu4] = useState(false);
  
    const toggleSubMenu = () => {
      setShowSubMenu(!showSubMenu);
    };
    const toggleSubMenu2 = () => {
      setShowSubMenu2(!showSubMenu2);
    };
  
    const toggleSubMenu3 = () => {
      setShowSubMenu3(!showSubMenu3);
    };
  
    const toggleSubMenu4 = () => {
      setShowSubMenu4(!showSubMenu4);
    };
  
    const handleLogout = () => {
      const confirmLogout = window.confirm("¿Estás seguro de que deseas salir?");
      if (confirmLogout) {
        navigate("/"); // Redirige al login
      }
    };
  

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/clientes/");
        setClientes(response.data);
      } catch (error) {
        console.error("Error al cargar los clientes:", error);
        alert("No se pudieron cargar los clientes.");
      }
    };
    fetchClientes();
  }, []);

  useEffect(() => {
    if (clienteId) {
      const clienteSeleccionado = clientes.find(c => c.id === parseInt(clienteId));
      if (clienteSeleccionado) {
        setCliente(clienteSeleccionado);
      }
    } else {
      setCliente({ nombre: "", cedula: "", direccion: "", email: "", telefono: "" });
    }
  }, [clienteId, clientes]);

  const buscarProductoPorCodigo = async (codigoBarra) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/productos/buscar-por-codigo/?codigo=${codigoBarra}`
      );
      return response.data;
    } catch (error) {
      console.error("Error al buscar producto:", error);
      alert("Producto no encontrado");
      return null;
    }
  };

  const buscarProductoPorNombre = async (nombre) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/productos/buscar/?nombre=${nombre}`
      );
      return response.data;
    } catch (error) {
      console.error("Error al buscar producto por nombre:", error);
      return [];
    }
  };

  const handleBuscarProducto = async (e) => {
    const nombre = e.target.value;
    setNombreProducto(nombre);

    if (nombre.length >= 2) { // Solo buscar si el usuario ha escrito al menos 2 caracteres
      const resultados = await buscarProductoPorNombre(nombre);
      setSugerencias(resultados);
    } else {
      setSugerencias([]); // Limpiar sugerencias si el campo está vacío o tiene menos de 2 caracteres
    }
  };

  const agregarProducto = async () => {
    if (!codigoBarra.trim()) {
      alert("Por favor, ingresa un código de barras válido.");
      return;
    }

    const producto = await buscarProductoPorCodigo(codigoBarra);

    if (producto) {
      setProductos((prev) => {
        const productoExistente = prev.find((p) => p.codigobarra === producto.codigobarra);
        if (productoExistente) {
          return prev.map((p) =>
            p.codigobarra === producto.codigobarra
              ? { ...p, cantidad: Math.min(p.cantidad + 1, producto.stock) }
              : p
          );
        }
        return [...prev, { ...producto, cantidad: 1 }];
      });
      setCodigoBarra("");
    }
  };

  const agregarProductoDesdeSugerencia = (producto) => {
    setProductos((prev) => {
      const productoExistente = prev.find((p) => p.codigobarra === producto.codigobarra);
      if (productoExistente) {
        return prev.map((p) =>
          p.codigobarra === producto.codigobarra
            ? { ...p, cantidad: Math.min(p.cantidad + 1, producto.stock) }
            : p
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
    setNombreProducto(""); // Limpiar el campo de búsqueda
    setSugerencias([]); // Limpiar las sugerencias
  };

  const actualizarCantidad = (index, cantidad, stock) => {
    if (cantidad < 1) return;
    if (cantidad > stock) {
      alert("No puedes vender más de lo que hay en stock.");
      return;
    }
    setProductos((prev) =>
      prev.map((p, i) => (i === index ? { ...p, cantidad: cantidad } : p))
    );
  };
  const calcularTotalVenta = () => {
    return productos.reduce((total, producto) => {
      return total + producto.precio * producto.cantidad;
    }, 0);
  };

  const eliminarProducto = (index) => {
    setProductos((prev) => prev.filter((_, i) => i !== index));
  };

  const manejarVenta = async () => {
    const totalVenta = calcularTotalVenta();
  
    // Obligatorio facturar si el total supera los $50
    if (totalVenta > 50) {
      alert("El monto supera los $50. Se requiere factura.");
      setFactura(true); // Forzar factura
    }
  
    // Redirigir a factura si es necesario
    if (factura) {
      navigate("/factura", {
        state: {
          productos,
          cliente,
          totalVenta,
        },
      });
    } else {
      try {
        if (productos.length === 0) {
          alert("Debe agregar al menos un producto antes de realizar la venta.");
          return;
        }
  
        const codigos_barras = productos.map((p) => p.codigobarra);
        const cantidades = productos.map((p) => p.cantidad);
  
        const data = {
          cliente_id: clienteId || "0000000000",
          productos: codigos_barras,
          cantidades: cantidades,
        };
  
        const response = await axios.post("http://127.0.0.1:8000/api/ventas/", data);
        alert("Venta realizada con éxito");
  
        setProductos([]);
        setCliente({ nombre: "", cedula: "", direccion: "", email: "", telefono: "" });
        setClienteId("");
  
        navigate(`/comprobante/${response.data.id}`);
      } catch (error) {
        console.error(error.response?.data || error.message);
        alert("Hubo un error al procesar la venta");
      }
    }
  };

  return (
    <div className="ventas-container">
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
          <li onClick={() => navigate("/prediccion-demanda")} className="menu-item">🚀 PREDICCIÓN</li>
          <li onClick={() => navigate("/historial-ventas")} className="menu-item">🛒 REGISTRO DE VENTAS</li>
          <li onClick={() => navigate("/compras")} className="menu-item">🛍️ COMPRAS</li>
          <li onClick={() => navigate("/pagos")} className="menu-item">🗂️ PAGOS</li>
          <li onClick={() => navigate("/reporte")} className="menu-item"> 📊 REPORTES</li>
          <li onClick={handleLogout} className="menu-item">🚪 SALIR</li>
        </ul>
      </div>
      <h1 className="ventas-title">Ventas</h1>
      <input
        type="text"
        className="ventas-input"
        placeholder="Escanea el código de barras"
        value={codigoBarra}
        onChange={(e) => setCodigoBarra(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && agregarProducto()}
      />
      <div className="buscar-producto-container">
        <input
          type="text"
          className="ventas-input"
          placeholder="Buscar producto por nombre"
          value={nombreProducto}
          onChange={handleBuscarProducto}
        />
        {sugerencias.length > 0 && (
          <ul className="sugerencias-lista">
            {sugerencias.map((producto, index) => (
              <li
                key={index}
                className="sugerencia-item"
                onClick={() => agregarProductoDesdeSugerencia(producto)}
              >
                {producto.nombre} - ${Number(producto.precio).toFixed(2)}
              </li>
            ))}
          </ul>
        )}
      </div>
      <table className="ventas-table">
        <thead>
          <tr>
            <th>Producto</th><th>Precio</th><th>Cantidad</th><th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto, index) => (
            <tr key={index}>
              <td>{producto.nombre}</td>
              <td>${Number(producto.precio).toFixed(2)}</td>
              <td>
                <input
                  type="number"
                  className="cantidad-input"
                  value={producto.cantidad}
                  onChange={(e) => actualizarCantidad(index, parseInt(e.target.value) || 1, producto.stock)}
                  min="1"
                  max={producto.stock}
                />
              </td>
              <td>
                <button
                  className="eliminar-btn"
                  onClick={() => eliminarProducto(index)}
                  style={{
                    background: "red",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    padding: "5px 10px",
                    borderRadius: "5px"
                  }}
                >
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
  
      <h3>Total de la Venta: ${calcularTotalVenta().toFixed(2)}</h3>
  
      {calcularTotalVenta() > 50 && (
        <p className="factura-obligatoria">
          El monto supera los $50. Se requiere factura.
        </p>
      )}
  
      <button className="ventas-button" onClick={manejarVenta}>Realizar Venta</button>
      <button
        className="ventas-button factura-button"
        onClick={() => navigate("/factura", { state: { productos, cliente, totalVenta: calcularTotalVenta() } })}
      >
        Factura
      </button>
      <button className="ventas-button back-button" onClick={() => navigate("/home")}>
        ← Volver
      </button>
    </div>
  );
}
  export default Ventas;