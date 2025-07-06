import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { FaPiggyBank } from "react-icons/fa";
import Swal from "sweetalert2";
import { supabase } from "../../../supabase.js";
import { useUser } from "../../../Context/UserContext.jsx";
import "./Principal.css";

/**
 * Vista principal para usuarios estándar.
 * Combina:
 *  1) Listado de presupuestos propios + movimientos + registrar gasto.
 *  2) Dashboard con gráfico de balance diario y enlaces rápidos.
 */
const PrincipalEstandar = () => {
  /* ------------------------------------------------------------------ */
  /* 📦  ESTADOS PRINCIPALES                                           */
  /* ------------------------------------------------------------------ */
  const { user } = useUser();
  const [budget, setBudget] = useState([]);

  /* Movimientos */
  const [mostrarMovimientos, setMostrarMovimientos] = useState(false);
  const [movimientos, setMovimientos] = useState([]);
  const [presupuestoActivo, setPresupuestoActivo] = useState(null);

  /* Gasto */
  const [showGastoModal, setShowGastoModal] = useState(false);
  const [gasto, setGasto] = useState({ descripcion: "", monto: "", id_presupuesto: "" });

  /* Gráfico */
  const [graficoData, setGraficoData] = useState(null);
  const [mostrarGrafico, setMostrarGrafico] = useState(false);

  /* ------------------------------------------------------------------ */
  /* 📡  SUPABASE                                                      */
  /* ------------------------------------------------------------------ */
  const fetchBudgets = async () => {
    const { data, error } = await supabase.from("presupuestos").select("*").eq("id_usuario", user.id);
    if (error) return console.error("Error al obtener presupuestos: ", error);
    setBudget(data);
  };

  const fetchMovimientos = async id_presupuesto => {
    const { data, error } = await supabase.from("transacciones").select("*").eq("id_presupuesto", id_presupuesto).order("fecha", { ascending: false });
    if (error) return console.error("Error al obtener movimientos: ", error);
    setMovimientos(data);
  };

  const fetchGrafico = async () => {
    const { data: trans } = await supabase.from("transacciones").select("fecha,tipo,monto").eq("id_usuario", user.id);
    const resumen = (trans || []).reduce((acc, t) => {
      const fecha = new Date(t.fecha).toLocaleDateString();
      const balance = t.tipo === "ingreso" ? t.monto : -t.monto;
      acc[fecha] = (acc[fecha] || 0) + balance;
      return acc;
    }, {});

    setGraficoData({
      labels: Object.keys(resumen),
      datasets: [
        {
          label: "Balance diario",
          data: Object.values(resumen),
          backgroundColor: Object.values(resumen).map(v => (v >= 0 ? "#60a5fa" : "#fca5a5")),
        },
      ],
    });
  };

  /* ------------------------------------------------------------------ */
  /* 💸  REGISTRAR GASTO                                               */
  /* ------------------------------------------------------------------ */
  const handleAddGasto = async () => {
    const { descripcion, monto, id_presupuesto } = gasto;
    if (!descripcion || !monto || !id_presupuesto) return Swal.fire("Campos incompletos", "Completa todos los campos", "warning");
    const { data: pto } = await supabase.from("presupuestos").select("monto_total").eq("id", id_presupuesto).single();
    if (pto.monto_total < parseFloat(monto)) return Swal.fire("Saldo insuficiente", "No hay suficiente saldo", "warning");

    await supabase.from("transacciones").insert([
      { tipo: "gasto", monto: parseFloat(monto), origen: "manual", destinatario: descripcion, fecha: new Date().toISOString(), id_presupuesto: parseInt(id_presupuesto), id_usuario: user.id },
    ]);

    await supabase.from("presupuestos").update({ monto_total: pto.monto_total - parseFloat(monto) }).eq("id", id_presupuesto);

    Swal.fire("Gasto registrado", "", "success");
    setGasto({ descripcion: "", monto: "", id_presupuesto: "" });
    setShowGastoModal(false);
    fetchBudgets();
  };

  /* ------------------------------------------------------------------ */
  /* 🌐  EFFECTS                                                       */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (user) fetchBudgets();
  }, [user]);

  /* ------------------------------------------------------------------ */
  /* 🖥️  RENDER                                                        */
  /* ------------------------------------------------------------------ */
  return (
    <div className="admin-container d-flex">
      {/* ------------- SIDEBAR / DASHBOARD ------------- */}
      <aside className="sidebar">
        <nav>
          <ul>
            <li>
              <a href="#dashboard">Dashboard</a>
            </li>
            <li>
              <a href="#presupuestos">Presupuestos</a>
            </li>
            <li>
              <a
                href="#grafico"
                onClick={e => {
                  e.preventDefault();
                  fetchGrafico();
                  setMostrarGrafico(true);
                }}
              >
                Resumen Financiero
              </a>
            </li>
            <li>
              <Link to="/settingsestandar">Configuración</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* ------------- CONTENIDO PRINCIPAL ------------- */}
      <div className="flex-grow-1 p-3">
        <h2 className="mb-3">Gestión de Fondos</h2>
        <p className="text-muted">Registro y consulta de tus presupuestos.</p>

        {/* Presupuestos */}
        <div id="presupuestos" className="d-flex flex-wrap gap-3 mb-4">
          {budget.map(pto => (
            <div key={pto.id} className="card" style={{ width: "18rem" }}>
              <div className="card-body">
                <FaPiggyBank className="icono" />
                <h5 className="card-title">{pto.nombre}</h5>
                <h6 className="card-subtitle mb-2 text-muted">ID: {pto.id}</h6>
                <h1 className="card-text">${pto.monto_total.toLocaleString("es-CL")}</h1>
                <a
                  className="card-link"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    fetchMovimientos(pto.id);
                    setPresupuestoActivo(pto.id);
                    setMostrarMovimientos(true);
                  }}
                >
                  Ver Movimientos
                </a>
                <br />
                <a
                  className="card-link"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setGasto({ descripcion: "", monto: "", id_presupuesto: pto.id });
                    setShowGastoModal(true);
                  }}
                >
                  Agregar Gasto
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Enlaces rápidos */}
        <div className="mb-4 d-flex gap-3">
          <Link to="/estandar/nuevo-ingreso">Agregar Ingreso</Link>
          <Link to="/estandar/nuevo-gasto">Agregar Gasto</Link>
          <Link to="/estandar/transacciones">Ver Mis Transacciones</Link>
        </div>
      </div>

      {/* ------------- MODAL MOVIMIENTOS ------------- */}
      {mostrarMovimientos && (
        <div className="modal-overlay" onClick={() => setMostrarMovimientos(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: "600px" }}>
            <h2>Movimientos (Presupuesto {presupuestoActivo})</h2>
            {movimientos.length ? (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Descripción</th>
                    <th>Monto</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {movimientos.map(m => (
                    <tr key={m.id}>
                      <td>{m.tipo}</td>
                      <td>{m.destinatario}</td>
                      <td>${m.monto.toLocaleString("es-CL")}</td>
                      <td>{new Date(m.fecha).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No hay movimientos.</p>
            )}
          </div>
        </div>
      )}

      {/* ------------- MODAL GASTO ------------- */}
      {showGastoModal && (
        <div className="modal-overlay" onClick={() => setShowGastoModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: "400px" }}>
            <h3>Agregar Gasto</h3>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleAddGasto();
              }}
            >
              <input
                className="form-control mb-2"
                placeholder="Descripción"
                value={gasto.descripcion}
                onChange={e => setGasto({ ...gasto, descripcion: e.target.value })}
                required
              />
              <input
                className="form-control mb-3"
                placeholder="Monto"
                type="number"
                min="0.01"
                step="0.01"
                value={gasto.monto}
                onChange={e => setGasto({ ...gasto, monto: e.target.value })}
                required
              />
              <button className="btn btn-danger me-2" type="submit">
                Registrar Gasto
              </button>
              <button className="btn btn-secondary" type="button" onClick={() => setShowGastoModal(false)}>
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ------------- MODAL GRÁFICO ------------- */}
      {mostrarGrafico && (
        <div className="modal-overlay" onClick={() => setMostrarGrafico(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: "700px" }}>
            <h2>Resumen Financiero</h2>
            {graficoData ? <Bar data={graficoData} /> : <p>Cargando gráfico…</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default PrincipalEstandar;
