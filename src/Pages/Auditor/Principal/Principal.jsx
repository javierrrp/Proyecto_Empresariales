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

  const [movimientos, setMovimientos] = useState([]);
  const [showMovimientos, setShowMovimientos] = useState(false);
  const [tituloMovs, setTituloMovs] = useState("");

  useEffect(() => {
    const fetchDatos = async () => {
      const { data: presupuestos, error: errorPresupuestos } = await supabase
        .from("presupuestos")
        .select("*, usuarios:usuarios(nombre)");

      if (errorPresupuestos) {
        console.log("Error al obtener presupuestos:", errorPresupuestos);
      } else {
        setBudget(presupuestos || []);
      }

      const { data: transacciones, error: errorTransacciones } = await supabase
        .from("transacciones")
        .select("*")
        .order("fecha", { ascending: false });

      if (errorTransacciones) {
        console.log("Error al obtener transacciones:", errorTransacciones);
        return;
      }

      let ingresos = 0;
      let egresos = 0;
      const resumenDiario = {};

      (transacciones || []).forEach((t) => {
        const fecha = new Date(t.fecha).toLocaleDateString();
        const monto = t.monto;

        if (t.tipo === "ingreso") {
          ingresos += monto;
          resumenDiario[fecha] = (resumenDiario[fecha] || 0) + monto;
        } else if (t.tipo === "egreso" || t.tipo === "gasto") {
          egresos += monto;
          resumenDiario[fecha] = (resumenDiario[fecha] || 0) - monto;
        }
      });

      const balance = ingresos - egresos;
      setResumenFinanciero({ ingresos, egresos, balance });

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

  const handleVerMovimientos = async (id_presupuesto, nombre) => {
    const { data, error } = await supabase
      .from("transacciones")
      .select("*")
      .eq("id_presupuesto", id_presupuesto)
      .order("fecha", { ascending: false });

    if (error) {
      console.error("Error al obtener movimientos:", error);
    } else {
      setMovimientos(data);
      setTituloMovs(nombre);
      setShowMovimientos(true);
    }
  };

  const exportarPresupuesto = async (id_presupuesto, nombre) => {
    const { data: presupuesto } = await supabase
      .from("presupuestos")
      .select("*")
      .eq("id", id_presupuesto)
      .single();

    const { data: transacciones } = await supabase
      .from("transacciones")
      .select("*")
      .eq("id_presupuesto", id_presupuesto);

    const wb = XLSX.utils.book_new();

    const hojaPresupuesto = [
      ["Presupuesto", nombre],
      ["Año", presupuesto.anio],
      ["Mes", presupuesto.mes],
      ["Periodo", presupuesto.periodo],
      ["Monto Total", presupuesto.monto_total],
    ];
    const resumenSheet = XLSX.utils.aoa_to_sheet(hojaPresupuesto);
    XLSX.utils.book_append_sheet(wb, resumenSheet, "Resumen");

    const hojaMovimientos = transacciones.map((t) => ({
      Fecha: new Date(t.fecha).toLocaleDateString(),
      Tipo: t.tipo,
      Monto: t.monto,
      Destinatario: t.destinatario,
      Origen: t.origen,
    }));
    const movimientosSheet = XLSX.utils.json_to_sheet(hojaMovimientos);
    XLSX.utils.book_append_sheet(wb, movimientosSheet, "Movimientos");

    XLSX.writeFile(wb, `Presupuesto-${nombre}.xlsx`);
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
                <button className="btn btn-warning" onClick={() => exportarPresupuesto(null, "General")}>Exportar</button>
              </div>
              {graficoData ? (
                <Bar data={graficoData} />
              ) : (
                <p>No hay datos para mostrar.</p>
              )}
            </div>
          </div>
        )}

        {showMovimientos && (
          <div className="modal-overlay" onClick={() => setShowMovimientos(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Movimientos - {tituloMovs}</h3>
              {movimientos.length === 0 ? (
                <p>No hay movimientos.</p>
              ) : (
                <ul className="list-group">
                  {movimientos.map((mov) => (
                    <li key={mov.id} className="list-group-item d-flex justify-content-between">
                      <span>{mov.tipo}</span>
                      <span>${mov.monto}</span>
                      <span>{mov.destinatario}</span>
                      <span>{new Date(mov.fecha).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="panel-inferior-derecho">

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
                    Cuenta de: {budgets.usuarios?.nombre?.split(" ")[0] || "Desconocido"} (ID: {budgets.id})
                  </h6>
                  <h1 className="card-text">${budgets.monto_total}</h1>
                  <a href="#" className="card-link" onClick={() => handleVerMovimientos(budgets.id, budgets.nombre)}>
                    Ver Movimientos
                  </a><br />
                  <a href="#" className="card-link" onClick={() => exportarPresupuesto(budgets.id, budgets.nombre)}>
                    Exportar
                  </a><br />
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
