import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { supabase } from "../../../supabase";
import "chart.js/auto";

const PrincipalAuditor = () => {
  const [presupuesto, setPresupuesto] = useState(0);
  const [ingresos, setIngresos] = useState([]);
  const [graficoData, setGraficoData] = useState(null);

  useEffect(() => {
    const fetchDatos = async () => {
      const { data: presupuestos } = await supabase
        .from("Presupuestos")
        .select("Monto_Total")
        .order("id", { ascending: false })
        .limit(1);

      if (presupuestos && presupuestos.length > 0) {
        setPresupuesto(presupuestos[0].Monto_Total);
      }

      const { data: transacciones } = await supabase
        .from("Transacciones")
        .select("*")
        .order("Fecha", { ascending: false })
        .limit(10);

      const ingresosFiltrados = (transacciones || []).filter(t => t.tipo === "ingreso");
      setIngresos(ingresosFiltrados);

      const resumen = (transacciones || []).reduce((acc, t) => {
        const fecha = new Date(t.Fecha).toLocaleDateString();
        acc[fecha] = (acc[fecha] || 0) + (t.tipo === "ingreso" ? t.Monto : -t.Monto);
        return acc;
      }, {});

      setGraficoData({
        labels: Object.keys(resumen),
        datasets: [
          {
            label: "Balance diario",
            data: Object.values(resumen),
            backgroundColor: Object.values(resumen).map(m => m > 0 ? "#4ade80" : "#f87171")
          }
        ]
      });
    };

    fetchDatos();
  }, []);

  return (
    <div className="admin-container">
      <div className="panel-izquierdo">
        <div className="presupuesto">
          <h2>Presupuesto Actual</h2>
          <p className="monto">${presupuesto?.toLocaleString()}</p>
        </div>

        <div className="historial">
          <h3>Historial de Ingresos</h3>
          <ul>
            {ingresos.map((ing, idx) => (
              <li key={idx}>+ ${ing.Monto} - {new Date(ing.Fecha).toLocaleDateString()}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="panel-superior-derecho">
        <h2>Resumen Financiero</h2>
        {graficoData ? (
          <Bar data={graficoData} />
        ) : (
          <p>Cargando gráfico...</p>
        )}
      </div>

      <div className="panel-inferior-derecho">
        <h2>Accesos de Solo Lectura</h2>
        <p className="text-gray-600">Como auditor, puedes revisar la información, pero no puedes modificarla.</p>
        <ul>
          <li>Visualización de presupuestos</li>
          <li>Revisión de transacciones</li>
          <li>Consulta de reportes</li>
          <li>Auditoría de historial de cambios</li>
        </ul>
      </div>
    </div>
  );
};

export default PrincipalAuditor;