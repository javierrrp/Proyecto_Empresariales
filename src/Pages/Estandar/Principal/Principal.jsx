import React, { useEffect, useState } from "react";
import { FaPiggyBank } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { supabase } from "../../../supabase";
import { useUser } from '../../../Context/UserContext.jsx';
import "chart.js/auto";

import './Principal.css'

const PrincipalEstandar = () => {
  const [graficoData, setGraficoData] = useState(null);
  const [budget, setBudget] = useState([]);
  const { user } = useUser();

  const [mostrarGrafico, setMostrarGrafico] = useState(false)

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



 


  const handleMostrarGrafico = (e) => {
    e.preventDefault();
    setMostrarGrafico(true);
  };

  const cerrarGrafico = () => {
    setMostrarGrafico(false);
  }

  return (
    <div style={{display: 'flex'}}className="admin-container">
      <div className="panel-superior-derecho">
        <aside className="sidebar">
                <nav>
                    <ul>
                        <li><a href="#dashboard">Dashboard</a></li>
                        <li><a href="#presupuestos">Presupuestos</a></li>
                        <li><a onClick={handleMostrarGrafico}>Resumen Financiero</a></li>
                        <li><a href="/settingsestandar">Configuración</a></li>
                    </ul>
                </nav>
            </aside>
 

        {mostrarGrafico && (
          <div className="modal-overlay" onClick={cerrarGrafico}>
            <div className="modal-content" onClick={e => e.stopPropagation()}> 
              <h2>Resumen Financiero</h2>
              {graficoData ? (
                <Bar data={graficoData} />
              ) : (
              <p>Cargando gráfico...</p>
              )}
            </div>
          </div>
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