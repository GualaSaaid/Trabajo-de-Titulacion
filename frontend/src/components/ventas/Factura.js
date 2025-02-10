import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Factura.css";

const Factura = () => {
  const location = useLocation();
  const { productos, totalVenta } = location.state;
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [cliente, setCliente] = useState({
    nombre: "",
    cedula: "",
    direccion: "",
    email: "",
    telefono: "",
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSeleccionarCliente = (e) => {
    const clienteId = e.target.value;
    setClienteSeleccionado(clienteId);

    if (clienteId) {
      const cliente = clientes.find((c) => c.id === parseInt(clienteId));
      if (cliente) {
        setCliente(cliente);
      }
    } else {
      setCliente({ nombre: "", cedula: "", direccion: "", email: "", telefono: "" });
    }
  };

  const enviarFactura = async () => {
    try {
      const data = {
        cliente,
        productos: productos.map((p) => p.codigobarra),
        cantidades: productos.map((p) => p.cantidad),
      };

      const response = await axios.post("http://127.0.0.1:8000/api/ventas/", data);
      alert("Factura enviada con éxito");

      navigate(`/comprobante/${response.data.id}`);
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Hubo un error al enviar la factura");
    }
  };

  return (
    <div className="factura-container">
      <h1 className="factura-title">Factura</h1>
      <div className="factura-datos">
        <h3>Detalle de la Venta</h3>
        <ul>
          {productos.map((producto, index) => (
            <li key={index}>
              {producto.nombre} - ${Number(producto.precio).toFixed(2)} x {producto.cantidad}
            </li>
          ))}
        </ul>
        <h3>Total: ${totalVenta.toFixed(2)}</h3>
      </div>
      <div className="factura-cliente">
        <h3>Datos del Cliente</h3>
        <select
          className="cliente-dropdown"
          value={clienteSeleccionado}
          onChange={handleSeleccionarCliente}
        >
          <option value="">Seleccionar Cliente</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre} - {c.cedula}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={cliente.nombre}
          onChange={handleChange}
        />
        <input
          type="text"
          name="cedula"
          placeholder="Cédula"
          value={cliente.cedula}
          onChange={handleChange}
        />
        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={cliente.direccion}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={cliente.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={cliente.telefono}
          onChange={handleChange}
        />
      </div>
      <button className="factura-button" onClick={enviarFactura}>Enviar Factura</button>
      <div>
      <button className="back-button" onClick={() => navigate("/ventas")}>← Atrás</button>
      </div>
    </div>
  );
};

export default Factura;