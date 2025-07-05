import React, { useEffect, useState } from "react";
import { FaPiggyBank } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { supabase } from "../../../supabase";
import { useUser } from '../../../Context/UserContext.jsx';
import "chart.js/auto";

import './Principal.css';

const PrincipalEstandar = () => {
  const [presupuestos, setPresupuestos] = useState([]);
  const [graficoData, setGraficoData] = useState(null);
  const [mostrarGrafico, setMostrarGrafico] = useState(false);
  const [mostrarFormularioGasto, setMostrarFormularioGasto] = useState(false);
  const [nuevoGasto, setNuevoGasto] = useState({ descripcion: "", monto: "", id_presupuesto: "" });

  const { user } = useUser();

  useEffect(() => {
    const GetBudget = async () => {
      const { data, error } = await supabase
        .from('presupuestos')
        .select('*')
        .eq('id_usuario', user.id);

      if (!error) {
        setPresupuestos(data);
      } else {
        console.error("Error obteniendo presupuestos:", error.message);
      }
    };

    if (user?.id) GetBudget();
  }, [user]);

  useEffect(() => {
    const fetchTransacciones = async () => {
      if (presupuestos.length === 0) return;

      const idsPresupuesto = presupuestos.map(p => p.id);

      const { data: transacciones, error } = await supabase
        .from("transacciones")
        .select("*")
        .in("id_presupuesto", idsPresupuesto)
        .order("fecha", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error al obtener transacciones:", error.message);
        return;
      }

      const resumen = transacciones.reduce((acc, t) => {
        const fecha = new Date(t.fecha).toLocaleDateString();
        acc[fecha] = (acc[fecha] || 0) + (t.tipo === "ingreso" ? t.monto : -t.monto);
        return acc;
      }, {});

      setGraficoData({
        labels: Object.keys(resumen),
        datasets: [
          {
            label: "Balance Diario",
            data: Object.values(resumen),
            backgroundColor: Object.values(resumen).map(m => m >= 0 ? "#60a5fa" : "#f87171")
          }
        ]
      });
    };

    fetchTransacciones();
  }, [presupuestos]);

  const abrirGrafico = () => setMostrarGrafico(true);
  const cerrarGrafico = () => setMostrarGrafico(false);
  const abrirFormularioGasto = () => setMostrarFormularioGasto(true);
  const cerrarFormularioGasto = () => setMostrarFormularioGasto(false);

  const handleChange = (e) => {
    setNuevoGasto({ ...nuevoGasto, [e.target.name]: e.target.value });
  };

  const handleSubmitGasto = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from('transacciones').insert([{
      tipo: 'gasto',
      monto: parseFloat(nuevoGasto.monto),
      origen: 'manual',
      destinatario: nuevoGasto.descripcion,
      fecha: new Date().toISOString(),
      id_presupuesto: parseInt(nuevoGasto.id_presupuesto),
    }]);

    if (error) {
      console.error("Error al insertar gasto:", error.message);
    } else {
      alert("Gasto registrado correctamente");
      setNuevoGasto({ descripcion: "", monto: "", id_presupuesto: "" });
      cerrarFormularioGasto();
    }
  };

  return (
    <div className="presupuestos">
      {presupuestos.map((p, index) => (
        <div className="card" key={index} style={{ width: '18rem' }}>
          <div className="card-body">
            <FaPiggyBank className="icono" />
            <h5 className="card-title">{p.nombre}</h5>
            <p className="card-subtitle mb-2 text-muted">ID Presupuesto: {p.id}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link to="/estandar/nuevo-ingreso" className="card-link">Agregar Ingreso</Link>
              <a href="#" className="card-link" onClick={abrirFormularioGasto}>Agregar Gasto</a>
              <a href="#" className="card-link" onClick={abrirGrafico}>Ver Resumen Financiero</a>
            </div>
          </div>
        </div>
      ))}

      {/* Modal Gráfico */}
      {mostrarGrafico && (
        <div className="modal-overlay" onClick={cerrarGrafico}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Resumen de Ganancias y Pérdidas</h3>
            {graficoData ? (
              <Bar data={graficoData} />
            ) : (
              <p>Cargando datos del gráfico...</p>
            )}
          </div>
        </div>
      )}

      {/* Modal Formulario Gasto */}
      {mostrarFormularioGasto && (
        <div className="modal-overlay" onClick={cerrarFormularioGasto}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Registrar Gasto</h3>
            <form onSubmit={handleSubmitGasto}>
              <label>Descripción:</label>
              <input
                type="text"
                name="descripcion"
                value={nuevoGasto.descripcion}
                onChange={handleChange}
                required
              />
              <label>Monto:</label>
              <input
                type="number"
                name="monto"
                value={nuevoGasto.monto}
                onChange={handleChange}
                required
                step="0.01"
              />
              <label>Presupuesto:</label>
              <select
                name="id_presupuesto"
                value={nuevoGasto.id_presupuesto}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona...</option>
                {presupuestos.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>

              <br /><br />
              <button type="submit">Guardar</button>
              <button type="button" onClick={cerrarFormularioGasto} style={{ marginLeft: "10px" }}>
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrincipalEstandar;
