import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabase.js";
import { useUser } from "../../../Context/UserContext.jsx";
import { FaPiggyBank, FaTrash, FaPencilAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import "./Principal.css";

/**
 * Componente principal para la vista de presupuestos.
 * Unifica la versión de administrador (gestiona todos los presupuestos)
 * y la versión estándar (gestiona solo los propios presupuestos).
 */
const PrincipalAdmin = () => {
  /* ------------------------------------------------------------------ */
  /* 🗓  FECHA ACTUAL                                                   */
  /* ------------------------------------------------------------------ */
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today
    .toLocaleString("es-CL", { month: "long" })
    .toLowerCase();

  /* ------------------------------------------------------------------ */
  /* 🗄️  ESTADOS GENERALES                                             */
  /* ------------------------------------------------------------------ */
  const [budget, setBudget] = useState([]);
  const { user } = useUser();
  const isAdmin = user?.rol === "admin";

  /* Modal Crear Presupuesto */
  const [showModal, setShowModal] = useState(false);
  const [nombre, setNombre] = useState("");
  const [anio, setAnio] = useState(currentYear);
  const [periodo, setPeriodo] = useState("");
  const [mes, setMes] = useState(currentMonth);

  /* Lista de usuarios (solo para admin) */
  const [usuarios, setUsuarios] = useState([]);
  const [idUsuarioSeleccionado, setIdUsuarioSeleccionado] = useState("");

  /* Modals de movimientos, gasto, ingreso y edición */
  const [mostrarMovimientos, setMostrarMovimientos] = useState(false);
  const [movimientos, setMovimientos] = useState([]);
  const [presupuestoActivo, setPresupuestoActivo] = useState(null);

  const [showGastoModal, setShowGastoModal] = useState(false);
  const [gasto, setGasto] = useState({ descripcion: "", monto: "", id_presupuesto: "" });

  const [showIngresoModal, setShowIngresoModal] = useState(false);
  const [ingreso, setIngreso] = useState({ descripcion: "", monto: "", id_presupuesto: "" });

  const [showEditarModal, setShowEditarModal] = useState(false);
  const [presupuestoEditar, setPresupuestoEditar] = useState(null);

  /* ------------------------------------------------------------------ */
  /* 📡  SUPABASE QUERIES                                              */
  /* ------------------------------------------------------------------ */
  /** Obtiene todos los presupuestos según rol */
  const fetchBudgets = async () => {
    const query = supabase.from("presupuestos").select("*");
    if (!isAdmin) query.or(`id_usuario.eq.${user.id},id_usuario.is.null`);
    const { data, error } = await query;
    if (error) return console.error("Error al obtener presupuestos:", error);
    setBudget(data);
  };

  /** Carga usuarios (solo admin) */
  const fetchUsuarios = async () => {
    if (!isAdmin) return;
    const { data, error } = await supabase.from("usuarios").select("id,nombre,rol");
    if (error) return console.error("Error al obtener usuarios:", error);
    setUsuarios(data.filter(u => u.rol === "estandar"));
  };

  /** Obtiene movimientos de un presupuesto */
  const fetchMovimientos = async id_presupuesto => {
    const { data, error } = await supabase
      .from("transacciones")
      .select("*")
      .eq("id_presupuesto", id_presupuesto)
      .order("fecha", { ascending: false });

    if (error) return console.error("Error al obtener movimientos:", error);
    setMovimientos(data);
  };

  /* ------------------------------------------------------------------ */
  /* ➕  CRUD PRESUPUESTOS                                              */
  /* ------------------------------------------------------------------ */
  const handleAddBudget = async () => {
    // Validaciones
    if (!nombre || !periodo || (isAdmin && !idUsuarioSeleccionado)) {
      return Swal.fire("Campos incompletos", "Completa todos los campos.", "warning");
    }

    const payload = {
      nombre,
      anio,
      periodo,
      mes,
      monto_total: 0,
      id_usuario: isAdmin ? idUsuarioSeleccionado : user.id,
    };

    const { error } = await supabase.from("presupuestos").insert([payload]);

    if (error) {
      console.error("Error al crear presupuesto", error);
      return Swal.fire("Error", "No se pudo crear el presupuesto.", "error");
    }

    Swal.fire("Presupuesto creado correctamente", "", "success");
    /* Reset */
    setShowModal(false);
    setNombre("");
    setPeriodo("");
    setIdUsuarioSeleccionado("");
    fetchBudgets();
  };

  const handleUpdateBudget = async () => {
    const { id, nombre: n, periodo: p, mes: m, anio: a } = presupuestoEditar;
    if (!n || !p) return Swal.fire("Campos incompletos", "Completa todos los campos.", "warning");

    const { error } = await supabase
      .from("presupuestos")
      .update({ nombre: n, periodo: p, mes: m, anio: a })
      .eq("id", id);

    if (error) return Swal.fire("Error", "No se pudo actualizar", "error");
    Swal.fire("Presupuesto actualizado", "", "success");
    setShowEditarModal(false);
    setPresupuestoEditar(null);
    fetchBudgets();
  };

  const handleDeleteBudget = async id_presupuesto => {
    const { isConfirmed } = await Swal.fire({
      title: "¿Eliminar presupuesto?",
      text: "Se eliminarán sus transacciones asociadas.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Sí, eliminar",
    });
    if (!isConfirmed) return;

    const { error: transError } = await supabase.from("transacciones").delete().eq("id_presupuesto", id_presupuesto);
    const { error } = await supabase.from("presupuestos").delete().eq("id", id_presupuesto);

    if (error || transError) return Swal.fire("Error", "No se pudo eliminar", "error");
    Swal.fire("Eliminado", "Presupuesto eliminado correctamente", "success");
    fetchBudgets();
  };

  /* ------------------------------------------------------------------ */
  /* 💸  GASTOS & INGRESOS                                             */
  /* ------------------------------------------------------------------ */
  const registrarTransaccion = async (tipo, datos) => {
    const { descripcion, monto, id_presupuesto } = datos;
    if (!descripcion || !monto || !id_presupuesto) {
      return Swal.fire("Campos incompletos", "Completa todos los campos.", "warning");
    }
    if (parseFloat(monto) <= 0) {
      return Swal.fire("Monto inválido", "El monto debe ser mayor a 0.", "warning");
    }

    // Traer presupuesto actual
    const { data: presup, error: errPres } = await supabase
      .from("presupuestos")
      .select("monto_total")
      .eq("id", id_presupuesto)
      .single();

    if (errPres) return Swal.fire("Error", "No se pudo obtener el presupuesto", "error");

    if (tipo === "gasto" && presup.monto_total < parseFloat(monto)) {
      return Swal.fire("Saldo insuficiente", "No hay suficiente saldo.", "warning");
    }

    // Inserta transacción
    const { error: insertError } = await supabase.from("transacciones").insert([
      {
        tipo,
        monto: parseFloat(monto),
        origen: "manual",
        destinatario: descripcion,
        fecha: new Date().toISOString(),
        id_presupuesto: parseInt(id_presupuesto),
      },
    ]);
    if (insertError) return Swal.fire("Error", "No se pudo registrar", "error");

    // Actualiza monto_total
    const nuevoTotal = tipo === "gasto" ? presup.monto_total - parseFloat(monto) : presup.monto_total + parseFloat(monto);
    const { error: updErr } = await supabase
      .from("presupuestos")
      .update({ monto_total: nuevoTotal })
      .eq("id", id_presupuesto);
    if (updErr) return Swal.fire("Error", "No se pudo actualizar el presupuesto", "error");

    Swal.fire(`${tipo === "gasto" ? "Gasto" : "Ingreso"} registrado`, "", "success");
    setGasto({ descripcion: "", monto: "", id_presupuesto: "" });
    setIngreso({ descripcion: "", monto: "", id_presupuesto: "" });
    setShowGastoModal(false);
    setShowIngresoModal(false);
    fetchBudgets();
  };

  /* ------------------------------------------------------------------ */
  /* 📡  USE EFFECT                                                    */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (user) {
      fetchBudgets();
      fetchUsuarios();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  /* ------------------------------------------------------------------ */
  /* 🖥️  RENDER                                                        */
  /* ------------------------------------------------------------------ */
  return (
    <div className="principal-admin container py-3">
      {/* BOTÓN CREAR */}
      <button className="btn btn-info mb-3 d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20" height="20">
          <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
        </svg>
        Crear Presupuesto
      </button>

      {/* LISTA DE PRESUPUESTOS */}
      <div className="d-flex flex-wrap gap-3">
        {budget.map(b => (
          <div key={b.id} className="card position-relative" style={{ width: "18rem" }}>
            <div className="card-body">
              <FaPiggyBank className="icono" />
              <h5 className="card-title">{b.nombre}</h5>
              <h6 className="card-subtitle mb-2 text-muted">
                ID Cuenta: {b.id}
                {isAdmin && (
                  <>
                    {" | Usuario: "}
                    {usuarios.find(u => u.id === b.id_usuario)?.nombre || b.id_usuario}
                  </>
                )}
              </h6>
              <h1 className="card-text">${b.monto_total.toLocaleString("es-CL")}</h1>
              <a className="card-link" style={{ cursor: "pointer" }} onClick={() => {
                fetchMovimientos(b.id);
                setPresupuestoActivo(b.id);
                setMostrarMovimientos(true);
              }}>
                Ver Movimientos
              </a>
              {isAdmin && (
                <>
                  <br />
                  <a
                    className="card-link"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setGasto({ descripcion: "", monto: "", id_presupuesto: b.id });
                      setShowGastoModal(true);
                    }}
                  >
                    Agregar Gasto
                  </a>
                  <br />
                  <a
                    className="card-link"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setIngreso({ descripcion: "", monto: "", id_presupuesto: b.id });
                      setShowIngresoModal(true);
                    }}
                  >
                    Agregar Ingreso
                  </a>
                  <br />
                  <div style={{ position: "absolute", top: "8px", left: "13rem" }}>
                    <button className="btn btn-warning btn-sm" onClick={() => {
                    setPresupuestoEditar(b);
                    setShowEditarModal(true);
                  }}>
                      <FaPencilAlt />
                    </button>
                  </div>
                  <div style={{ position: "absolute", top: "8px", right: "8px" }}>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteBudget(b.id)}>
                      <FaTrash />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* MODAL CREAR PRESUPUESTO                                          */}
      {/* ---------------------------------------------------------------- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Crear Presupuesto</h2>
            <form onSubmit={e => { e.preventDefault(); handleAddBudget(); }}>
              <input className="form-control mb-2" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />

              <select className="form-control mb-2" value={periodo} onChange={e => setPeriodo(e.target.value)} required>
                <option value="">Seleccionar periodo</option>
                <option value="anual">Anual</option>
                <option value="mensual">Mensual</option>
              </select>

              {isAdmin && (
                <select className="form-control mb-2" value={idUsuarioSeleccionado} onChange={e => setIdUsuarioSeleccionado(e.target.value)} required>
                  <option value="">Asignar a usuario</option>
                  {usuarios.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.nombre} (ID: {u.id})
                    </option>
                  ))}
                </select>
              )}

              <button className="btn btn-success me-2" type="submit">
                Crear
              </button>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)} type="button">
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* MODAL MOVIMIENTOS                                                */}
      {/* ---------------------------------------------------------------- */}
      {mostrarMovimientos && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "600px" }}>
            <h2>Movimientos Presupuesto ID {presupuestoActivo}</h2>
            <button className="btn-close position-absolute top-0 end-0 m-3" onClick={() => setMostrarMovimientos(false)}></button>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Descripción</th>
                  <th>Monto</th>
                  <th>Fecha</th>
                  {isAdmin && <th></th>}
                </tr>
              </thead>
              <tbody>
                {movimientos.length ? (
                  movimientos.map(mov => (
                    <tr key={mov.id}>
                      <td>{mov.tipo}</td>
                      <td>{mov.destinatario}</td>
                      <td>${mov.monto.toLocaleString("es-CL")}</td>
                      <td>{new Date(mov.fecha).toLocaleString("es-CL")}</td>
                      {isAdmin && (
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            title="Eliminar movimiento"
                            onClick={async () => {
                              const { isConfirmed } = await Swal.fire({
                                title: "¿Eliminar movimiento?",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#d33",
                                cancelButtonText: "Cancelar",
                                confirmButtonText: "Sí, eliminar",
                              });
                              if (!isConfirmed) return;
                              const { error } = await supabase.from("transacciones").delete().eq("id", mov.id);
                              if (error) return Swal.fire("Error", "No se pudo eliminar", "error");
                              Swal.fire("Eliminado", "Movimiento eliminado", "success");
                              fetchMovimientos(presupuestoActivo);
                              fetchBudgets();
                            }}
                          >
                            🗑️
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={isAdmin ? 5 : 4}>No hay movimientos</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* MODAL AGREGAR GASTO                                             */}
      {/* ---------------------------------------------------------------- */}
      {showGastoModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "400px" }}>
            <h2>Agregar Gasto</h2>
            <form onSubmit={e => { e.preventDefault(); registrarTransaccion("gasto", gasto); }}>
              <input className="form-control mb-2" placeholder="Descripción" value={gasto.descripcion} onChange={e => setGasto({ ...gasto, descripcion: e.target.value })} required />
              <input type="number" className="form-control mb-2" placeholder="Monto" value={gasto.monto} onChange={e => setGasto({ ...gasto, monto: e.target.value })} min="0.01" step="0.01" required />
              <button className="btn btn-danger me-2" type="submit">
                Agregar
              </button>
              <button className="btn btn-secondary" onClick={() => setShowGastoModal(false)} type="button">
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* MODAL AGREGAR INGRESO                                           */}
      {/* ---------------------------------------------------------------- */}
      {showIngresoModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "400px" }}>
            <h2>Agregar Ingreso</h2>
            <form onSubmit={e => { e.preventDefault(); registrarTransaccion("ingreso", ingreso); }}>
              <input className="form-control mb-2" placeholder="Descripción" value={ingreso.descripcion} onChange={e => setIngreso({ ...ingreso, descripcion: e.target.value })} required />
              <input type="number" className="form-control mb-2" placeholder="Monto" value={ingreso.monto} onChange={e => setIngreso({ ...ingreso, monto: e.target.value })} min="0.01" step="0.01" required />
              <button className="btn btn-success me-2" type="submit">
                Agregar
              </button>
              <button className="btn btn-secondary" onClick={() => setShowIngresoModal(false)} type="button">
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* MODAL EDITAR PRESUPUESTO                                        */}
      {/* ---------------------------------------------------------------- */}
      {showEditarModal && presupuestoEditar && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "400px" }}>
            <h2>Editar Presupuesto</h2>
            <form onSubmit={e => { e.preventDefault(); handleUpdateBudget(); }}>
              <input className="form-control mb-2" placeholder="Nombre" value={presupuestoEditar.nombre} onChange={e => setPresupuestoEditar({ ...presupuestoEditar, nombre: e.target.value })} required />
              <select className="form-control mb-2" value={presupuestoEditar.periodo} onChange={e => setPresupuestoEditar({ ...presupuestoEditar, periodo: e.target.value })} required>
                <option value="anual">Anual</option>
                <option value="mensual">Mensual</option>
              </select>
              <input type="number" className="form-control mb-2" placeholder="Año" value={presupuestoEditar.anio} onChange={e => setPresupuestoEditar({ ...presupuestoEditar, anio: parseInt(e.target.value) || currentYear })} required />
              <input className="form-control mb-3" placeholder="Mes" value={presupuestoEditar.mes} onChange={e => setPresupuestoEditar({ ...presupuestoEditar, mes: e.target.value })} />
              <button className="btn btn-primary me-2" type="submit">
                Guardar
              </button>
              <button className="btn btn-secondary" onClick={() => setShowEditarModal(false)} type="button">
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrincipalAdmin;
