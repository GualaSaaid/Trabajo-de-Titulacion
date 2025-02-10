import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./reporte.css";

const Reporte = () => {
  const [data, setData] = useState({
    total_ventas: 0,
    total_pagos: 0,
    total_entradas: 0,
    total_salidas: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchReportes();
  }, []);

  const fetchReportes = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/reporte/");
      setData(response.data);
    } catch (error) {
      console.error("Error al obtener los reportes:", error);
    }
  };

  // Datos para el gráfico de pastel
  const pieData = {
    labels: ["Ventas", "Pagos a Proveedores"],
    datasets: [
      {
        data: [data.total_ventas, data.total_pagos],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#2E86C1", "#E74C3C"],
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  // Datos para el gráfico de barras
  const barData = {
    labels: ["Entradas", "Salidas"],
    datasets: [
      {
        label: "Movimientos de Caja",
        data: [data.total_entradas, data.total_salidas],
        backgroundColor: ["#4CAF50", "#F44336"],
        hoverBackgroundColor: ["#388E3C", "#C62828"],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="reporte-container">
      <h1 className="reporte-title">📊 Reporte de Ventas y Movimientos</h1>

      <div className="chart-container">
        <h2>📈 Ventas vs Pagos a Proveedores</h2>
        <Pie data={pieData} />
      </div>

      <div className="chart-container">
        <h2>📊 Entradas y Salidas</h2>
        <Bar data={barData} />
      </div>

      {/* Botón para regresar */}
      <div className="home-button-container">
        <button className="home-button" onClick={() => navigate("/home")}>🏠 Volver a Inicio</button>
      </div>
    </div>
  );
};

export default Reporte;
