import React, { useEffect, useState, useRef } from "react";
import { Bar } from "react-chartjs-2";
import { supabase } from "../../../supabase";
import "chart.js/auto";
import { FaPiggyBank } from "react-icons/fa";
import * as XLSX from "xlsx";

const PrincipalAuditor = () => {
  const [budget, setBudget] = useState([]);
  const [graficoData, setGraficoData] = useState(null);
  const graficoRef = useRef();
  const [mostrarGrafico, setMostrarGrafico] = useState(false);
  const [resumenFinanciero, setResumenFinanciero] = useState({
    ingresos: 0,
    egresos: 0,
    balance: 0,
  });

  useEffect(() => {
    const fetchDatos = async () => {
      // Obtener presupuestos
      const { data: presupuestos, error: errorPresupuestos } = await supabase
        .from("presupuestos")
        .select("*");

      if (errorPresupuestos) {
        console.log("Error al obtener presupuestos:", errorPresupuestos);
      } else {
        setBudget(presupuestos || []);
      }

      // Obtener transacciones
      const { data: transacciones, error: errorTransacciones } = await supabase
        .from("transacciones")
        .select("*")
        .order("fecha", { ascending: false });

      if (errorTransacciones) {
        console.log("Error al obtener transacciones:", errorTransacciones);
        return;
      }

      // Resumen financiero
      let ingresos = 0;
      let egresos = 0;

      const resumenDiario = {};

      (transacciones || []).forEach((t) => {
        const fecha = new Date(t.fecha).toLocaleDateString();
        const monto = t.monto;

        if (t.tipo === "ingreso") {
          ingresos += monto;
          resumenDiario[fecha] = (resumenDiario[fecha] || 0) + monto;
        } else if (t.tipo === "egreso") {
          egresos += monto;
          resumenDiario[fecha] = (resumenDiario[fecha] || 0) - monto;
        }
      });

      const balance = ingresos - egresos;
      setResumenFinanciero({ ingresos, egresos, balance });

      // Datos para el gráfico
      setGraficoData({
        labels: Object.keys(resumenDiario),
        datasets: [
          {
            label: "Balance diario",
            data: Object.values(resumenDiario),
            backgroundColor: Object.values(resumenDiario).map((m) =>
              m >= 0 ? "#60a5fa" : "#fca5a5"
            ),
          },
        ],
      });
    };

    fetchDatos();
  }, []);

  const handleMostrarGrafico = (e) => {
    e.preventDefault();
    setMostrarGrafico(true);
  };

  const cerrarGrafico = () => {
    setMostrarGrafico(false);
  };

  const exportar_excel = () => {
    const wb = XLSX.utils.book_new();

  // Hoja 1: Resumen financiero
    const resumenData = [
      ["Resumen Financiero"],
      ["Ingresos", resumenFinanciero.ingresos],
      ["Egresos", resumenFinanciero.egresos],
      ["Balance", resumenFinanciero.balance],
    ];
    const resumenSheet = XLSX.utils.aoa_to_sheet(resumenData);
    XLSX.utils.book_append_sheet(wb, resumenSheet, "Resumen");

    // Hoja 2: Datos del gráfico
    const graficoRaw = graficoData?.labels.map((label, index) => ({
      Fecha: label,
      Balance: graficoData.datasets[0].data[index],
    })) || [];

    const graficoSheet = XLSX.utils.json_to_sheet(graficoRaw);
    XLSX.utils.book_append_sheet(wb, graficoSheet, "Gráfico Diario");

    // Exportar archivo
    XLSX.writeFile(wb, "resumen-financiero.xlsx");
  };


  return (
    <div style={{ display: "flex" }} className="admin-container">
      <div className="panel-superior-derecho">


        {mostrarGrafico && (
          <div className="modal-overlay" onClick={cerrarGrafico}>
            <div className="modal-content" ref={graficoRef} onClick={(e) => e.stopPropagation()}>
              <h2>Resumen Financiero</h2>
              <div style={{ marginBottom: "1rem" }}>
                <p>Ingresos totales: <strong>${resumenFinanciero.ingresos}</strong></p>
                <p>Egresos totales: <strong>${resumenFinanciero.egresos}</strong></p>
                <p>Balance total: <strong>${resumenFinanciero.balance}</strong></p>
                <button className='btn btn-warning' onClick={exportar_excel}>Exportar</button>
              </div>
              {graficoData ? (
                <Bar data={graficoData} />
              ) : (
                <p>No hay datos para mostrar.</p>
              )}
            </div>
            
          </div>
        )}
      </div>

      <div className="panel-inferior-derecho">
        <h2>Accesos de Solo Lectura</h2>
        <p className="text-gray-600">
          Como auditor, puedes revisar la información, pero no puedes modificarla.
        </p>

        {budget.length === 0 ? (
          <p>No hay presupuestos disponibles.</p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            {budget.map((budgets, index) => (
              <div className="card" key={index} style={{ width: "18rem" }}>
                <div className="card-body">
                  <FaPiggyBank className="icono" />
                  <h5 className="card-title">{budgets.nombre || "Sin nombre"}</h5>
                  <h6 className="card-subtitle mb-2 text-body-secondary">
                    ID: {budgets.id}
                  </h6>
                  <h1 className="card-text">${budgets.monto_total}</h1>
                  <a href="#" className="card-link">Ver Movimientos</a>
                </div>
               
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrincipalAuditor;
