import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { supabase } from "../../../supabase";
import "chart.js/auto";

const PrincipalEstandar = () => {
  const [graficoData, setGraficoData] = useState(null);

  useEffect(() => {
    const fetchDatos = async () => {
      const { data: transacciones } = await supabase
        .from("Transacciones")
        .select("*")
        .order("Fecha", { ascending: false })
        .limit(10);

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
            backgroundColor: Object.values(resumen).map(m => m > 0 ? "#60a5fa" : "#fca5a5")
          }
        ]
      });
    };

    fetchDatos();
  }, []);

  return (
    <div className="admin-container">
      <div className="panel-superior-derecho">
        <h2>Resumen Financiero</h2>
        {graficoData ? (
          <Bar data={graficoData} />
        ) : (
          <p>Cargando gráfico...</p>
        )}
      </div>

      <div className="panel-inferior-derecho">
        <h2>Gestión de Fondos</h2>
        <p className="text-gray-600">Puedes registrar nuevas transacciones de ingreso o gasto.</p>
        <Link to="/estandar/nuevo-ingreso">Agregar Ingreso</Link>
        <Link to="/estandar/nuevo-gasto">Agregar Gasto</Link>
        <Link to="/estandar/transacciones">Ver Mis Transacciones</Link>
      </div>
    </div>
  );
};

export default PrincipalEstandar;