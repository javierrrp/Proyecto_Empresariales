import React, { useEffect, useState } from "react";
<<<<<<< Updated upstream
import { Bar } from "react-chartjs-2";
import { supabase } from "../../../supabase";
import "chart.js/auto";
import "./Principal.css";

const PrincipalAdmin = () => {
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
        <h2>Accesos Directos</h2>
      </div>
=======
import { supabase } from '../../../supabase.js';
import { useUser } from '../../../Context/UserContext.jsx';
import { FaPiggyBank } from "react-icons/fa";
import "./Principal.css";

const PrincipalAdmin = () => {
  const [budget, setBudget] = useState([]);
  const { user } = useUser();
  
  useEffect(() => {
    const GetBudget = async () => {
      const { data: presupuestos, error } = await supabase
        .from('presupuestos')
        .select('*')
        .eq('id_usuario', user.id);

      if (error || presupuestos.length === 0) {
        console.log('Error');
      } else {
        setBudget(presupuestos);
      }
    };
    GetBudget();
  }, [user]);

  return (
    <div className="presupuestos"> 
      {budget.map((budgets, index) => (
        <div className="card" key={index} style={{ width: '18rem' }}>
          <div className="card-body">
            <FaPiggyBank className="icono" />
            <h5 className="card-title">{budgets.nombre}</h5>
            <h6 className="card-subtitle mb-2 text-body-secondary">{budgets.id}</h6>
            <h1 className="card-text">${budgets.monto_total}</h1>
            <a href="#" className="card-link">Ver Movimientos</a>
          </div>
        </div>
      ))}
>>>>>>> Stashed changes
    </div>
  );
};

export default PrincipalAdmin;
