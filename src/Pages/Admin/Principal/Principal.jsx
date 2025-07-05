import React, { useEffect, useState } from "react";
import { supabase } from '../../../supabase.js';
import { useUser } from '../../../Context/UserContext.jsx';
import { FaPiggyBank, FaTrash } from "react-icons/fa";
import Swal from 'sweetalert2';
import "./Principal.css";

const PrincipalAdmin = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.toLocaleString("es-CL", { month: "long" }).toLowerCase();

  const [budget, setBudget] = useState([]);
  const { user } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [MostrarMovimientos, setMostrarMovimientos] = useState(false);
  const [presupuestosList, setPresupuestosList] = useState([]);
  const [presupuestoActivo, setPresupuestoActivo] = useState(null);

  const [nombre, setNombre] = useState('');
  const [anio, setAnio] = useState(currentYear);
  const [periodo, setPeriodo] = useState('');
  const [mes, setMes] = useState(currentMonth);

  const [showGastoModal, setShowGastoModal] = useState(false);
  const [gasto, setGasto] = useState({ descripcion: "", monto: "", id_presupuesto: "" });

  const [showIngresoModal, setShowIngresoModal] = useState(false);
  const [ingreso, setIngreso] = useState({ descripcion: "", monto: "", id_presupuesto: "" });

  const [showEditarModal, setShowEditarModal] = useState(false);
  const [presupuestoEditar, setPresupuestoEditar] = useState(null);

  const [usuarios, setUsuarios] = useState([]);
  const [idUsuarioSeleccionado, setIdUsuarioSeleccionado] = useState('');

  const GetBudget = async () => {
    const { data: presupuestos, error } = await supabase
      .from('presupuestos')
      .select('*');
    if (error) {
      console.log('Error al obtener presupuestos:', error);
    } else {
      setBudget(presupuestos);
    }
  };

  const getUsuarios = async () => {
  const { data, error } = await supabase.from('usuarios').select('id, nombre, rol');
  if (error) {
    console.log('Error al obtener usuarios:', error);
  } else {
    // Filtrar solo usuarios con nivel 2 (estándar)
    const usuariosEstandar = data.filter(usuario => usuario.rol === 'estandar');
    setUsuarios(usuariosEstandar);
  }
};

  const AddBudget = async () => {
    if (!nombre || !periodo || !idUsuarioSeleccionado) {
      Swal.fire("Campos incompletos", "Completa todos los campos obligatorios.", "warning");
      return;
    }
    try {
      const { error } = await supabase.from('presupuestos').insert([
        { nombre, anio, periodo, mes, id_usuario: idUsuarioSeleccionado, monto_total: 0 }
      ]);
      if(error) throw error;

      Swal.fire("Presupuesto creado correctamente!", "", "success");
      setShowModal(false);
      setNombre('');
      setAnio(currentYear);
      setPeriodo('');
      setMes(currentMonth);
      setIdUsuarioSeleccionado('');
      GetBudget();
    } catch (err) {
      console.log("Error al registrar:", err.message);
      Swal.fire("Error", "No se pudo agregar el presupuesto.", "error");
    }
  };

  const handleMostrarMovs = async (id_presupuesto) => {
    const { data, error } = await supabase
      .from('transacciones')
      .select('*')
      .eq('id_presupuesto', id_presupuesto)
      .order('fecha', { ascending: false });

    if (error) {
      console.error('Error al obtener movimientos:', error);
    } else {
      setPresupuestosList(data);
      setPresupuestoActivo(id_presupuesto);
      setMostrarMovimientos(true);
    }
  };

  const cerrarMovs = () => {
    setMostrarMovimientos(false);
    setPresupuestosList([]);
    setPresupuestoActivo(null);
  };

  const handleAddGasto = async () => {
    const { descripcion, monto, id_presupuesto } = gasto;

    if (!descripcion || !monto || !id_presupuesto) {
      Swal.fire("Campos incompletos", "Completa todos los campos.", "warning");
      return;
    }
    if (parseFloat(monto) <= 0) {
      Swal.fire("Monto inválido", "El monto debe ser mayor a 0.", "warning");
      return;
    }

    const { data: presupuesto, error } = await supabase
      .from('presupuestos')
      .select('monto_total')
      .eq('id', id_presupuesto)
      .single();

    if (error) {
      Swal.fire("Error", "No se pudo obtener el presupuesto.", "error");
      return;
    }

    if (presupuesto.monto_total < parseFloat(monto)) {
      Swal.fire("Saldo insuficiente", "No hay suficiente saldo en el presupuesto.", "warning");
      return;
    }

    const { error: insertError } = await supabase.from('transacciones').insert([{
      tipo: 'gasto',
      monto: parseFloat(monto),
      origen: 'manual',
      destinatario: descripcion,
      fecha: new Date().toISOString(),
      id_presupuesto: parseInt(id_presupuesto),
    }]);

    if(insertError) {
      Swal.fire("Error", "No se pudo registrar el gasto.", "error");
      return;
    }

    const { error: updateError } = await supabase
      .from('presupuestos')
      .update({ monto_total: presupuesto.monto_total - parseFloat(monto) })
      .eq('id', id_presupuesto);

    if(updateError) {
      Swal.fire("Error", "No se pudo actualizar el presupuesto.", "error");
      return;
    }

    Swal.fire("Gasto registrado correctamente", "", "success");
    setGasto({ descripcion: "", monto: "", id_presupuesto: "" });
    setShowGastoModal(false);
    GetBudget();
  };

  const handleAddIngreso = async () => {
    const { descripcion, monto, id_presupuesto } = ingreso;

    if (!descripcion || !monto || !id_presupuesto) {
      Swal.fire("Campos incompletos", "Completa todos los campos.", "warning");
      return;
    }
    if (parseFloat(monto) <= 0) {
      Swal.fire("Monto inválido", "El monto debe ser mayor a 0.", "warning");
      return;
    }

    const { data: presupuesto, error } = await supabase
      .from('presupuestos')
      .select('monto_total')
      .eq('id', id_presupuesto)
      .single();

    if (error) {
      Swal.fire("Error", "No se pudo obtener el presupuesto.", "error");
      return;
    }

    const { error: insertError } = await supabase.from('transacciones').insert([{
      tipo: 'ingreso',
      monto: parseFloat(monto),
      origen: 'manual',
      destinatario: descripcion,
      fecha: new Date().toISOString(),
      id_presupuesto: parseInt(id_presupuesto),
    }]);

    if(insertError) {
      Swal.fire("Error", "No se pudo registrar el ingreso.", "error");
      return;
    }

    const { error: updateError } = await supabase
      .from('presupuestos')
      .update({ monto_total: presupuesto.monto_total + parseFloat(monto) })
      .eq('id', id_presupuesto);

    if(updateError) {
      Swal.fire("Error", "No se pudo actualizar el presupuesto.", "error");
      return;
    }

    Swal.fire("Ingreso registrado correctamente", "", "success");
    setIngreso({ descripcion: "", monto: "", id_presupuesto: "" });
    setShowIngresoModal(false);
    GetBudget();
  };

  const handleEliminarMovimiento = async (id_movimiento) => {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: "No podrás revertir esta acción",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    const { error } = await supabase
      .from('transacciones')
      .delete()
      .eq('id', id_movimiento);

    if (error) {
      Swal.fire('Error', 'No se pudo eliminar el movimiento', 'error');
    } else {
      Swal.fire('Eliminado', 'El movimiento fue eliminado.', 'success');
      // Refrescar movimientos después de eliminar
      handleMostrarMovs(presupuestoActivo);
      GetBudget();
    }
  }
};

  const handleEditarPresupuesto = async () => {
    const { id, nombre, periodo, mes, anio } = presupuestoEditar;

    if (!nombre || !periodo) {
      Swal.fire("Campos incompletos", "Completa todos los campos obligatorios.", "warning");
      return;
    }

    const { error } = await supabase
      .from('presupuestos')
      .update({ nombre, periodo, mes, anio })
      .eq('id', id);

    if (error) {
      Swal.fire("Error", "No se pudo actualizar el presupuesto", "error");
    } else {
      Swal.fire("Presupuesto actualizado", "", "success");
      setShowEditarModal(false);
      setPresupuestoEditar(null);
      GetBudget();
    }
  };

const handleEliminarPresupuesto = async (id_presupuesto) => {
  const confirm = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el presupuesto y todas sus transacciones asociadas.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33'
  });

  if (confirm.isConfirmed) {
    const { error: transError } = await supabase
      .from('transacciones')
      .delete()
      .eq('id_presupuesto', id_presupuesto);

    const { error } = await supabase
      .from('presupuestos')
      .delete()
      .eq('id', id_presupuesto);

    if (error || transError) {
      Swal.fire("Error", "No se pudo eliminar el presupuesto", "error");
    } else {
      Swal.fire("Eliminado", "Presupuesto eliminado correctamente", "success");
      GetBudget();
    }
  }
};

  useEffect(() => {
    if (user) {
      GetBudget();
      getUsuarios();
    }
  }, [user]);

  return (
    <div>
      <button className="btn btn-info mb-3" onClick={() => setShowModal(true)}>Crear Presupuesto</button>

      <div className="presupuestos d-flex flex-wrap gap-3">
        {budget.map((budgets, index) => (
          <div className="card" key={index} style={{ width: '18rem' }}>
            <div className="card-body">
              <FaPiggyBank className="icono" />
              <h5 className="card-title">{budgets.nombre}</h5>
              <h6 className="card-subtitle mb-2 text-body-secondary">
                ID Cuenta: {budgets.id} | Usuario: {
                  usuarios.find(u => u.id === budgets.id_usuario)?.nombre || budgets.id_usuario
                }
              </h6>
              <h1 className="card-text">${budgets.monto_total.toLocaleString('es-CL')}</h1>
              <a onClick={() => handleMostrarMovs(budgets.id)} className="card-link" style={{ cursor: 'pointer' }}>Ver Movimientos</a><br />
              <a onClick={() => {
                setGasto({ descripcion: "", monto: "", id_presupuesto: budgets.id });
                setShowGastoModal(true);
              }} className="card-link" style={{ cursor: 'pointer' }}>Agregar Gasto</a><br />
              <a onClick={() => {
                setIngreso({ descripcion: "", monto: "", id_presupuesto: budgets.id });
                setShowIngresoModal(true);
              }} className="card-link" style={{ cursor: 'pointer' }}>Agregar Ingreso</a><br />
              <a onClick={() => {
                setPresupuestoEditar(budgets);
                setShowEditarModal(true);
              }} className="card-link" style={{ cursor: 'pointer' }}>Editar Cuenta</a>
              <div style={{ position: "absolute", top: "8px", right: "8px" }}>
                <button
                  onClick={() => handleEliminarPresupuesto(budgets.id)}
                  className="btn btn-danger btn-sm"
                  style={{ borderRadius: "4px" }}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Crear Presupuesto */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Crear Presupuesto</h2>
            <form onSubmit={e => { e.preventDefault(); AddBudget(); }}>
              <input
                className="form-control mb-2"
                placeholder="Nombre"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                required
              />

              <select
                className="form-control mb-2"
                value={periodo}
                onChange={e => setPeriodo(e.target.value)}
                required
              >
                <option value="">Seleccionar periodo</option>
                <option value="anual">Anual</option>
                <option value="mensual">Mensual</option>
              </select>

              <select
                className="form-control mb-2"
                value={idUsuarioSeleccionado}
                onChange={e => setIdUsuarioSeleccionado(e.target.value)}
                required
              >
                <option value="">Asignar a usuario</option>
                {usuarios.map(usuario => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nombre} (ID: {usuario.id})
                  </option>
                ))}
              </select>

              <button className="btn btn-success me-2" type="submit">Crear</button>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Movimientos */}
      {MostrarMovimientos && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <h2>Movimientos Presupuesto ID {presupuestoActivo}</h2>
            <button className="btn btn-danger mb-3" onClick={cerrarMovs}>Cerrar</button>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Descripción</th>
                  <th>Monto</th>
                  <th>Fecha</th>
                  <th></th> {/* columna para botón eliminar */}
                </tr>
              </thead>
              <tbody>
                {presupuestosList.length > 0 ? presupuestosList.map((mov, idx) => (
                  <tr key={idx}>
                    <td>{mov.tipo}</td>
                    <td>{mov.destinatario}</td>
                    <td>${mov.monto.toLocaleString('es-CL')}</td>
                    <td>{new Date(mov.fecha).toLocaleString('es-CL')}</td>
                    <td>
                      <button 
                        className="btn btn-danger btn-sm" 
                        onClick={() => handleEliminarMovimiento(mov.id)} 
                        title="Eliminar movimiento"
                        style={{ minWidth: '40px' }}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="5">No hay movimientos</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* Modal Agregar Gasto */}
      {showGastoModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <h2>Agregar Gasto</h2>
            <form onSubmit={e => { e.preventDefault(); handleAddGasto(); }}>
              <input
                className="form-control mb-2"
                placeholder="Descripción"
                value={gasto.descripcion}
                onChange={e => setGasto({ ...gasto, descripcion: e.target.value })}
                required
              />
              <input
                type="number"
                className="form-control mb-2"
                placeholder="Monto"
                value={gasto.monto}
                onChange={e => setGasto({ ...gasto, monto: e.target.value })}
                min="0.01"
                step="0.01"
                required
              />
              <button className="btn btn-danger me-2" type="submit">Agregar</button>
              <button className="btn btn-secondary" onClick={() => setShowGastoModal(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Agregar Ingreso */}
      {showIngresoModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <h2>Agregar Ingreso</h2>
            <form onSubmit={e => { e.preventDefault(); handleAddIngreso(); }}>
              <input
                className="form-control mb-2"
                placeholder="Descripción"
                value={ingreso.descripcion}
                onChange={e => setIngreso({ ...ingreso, descripcion: e.target.value })}
                required
              />
              <input
                type="number"
                className="form-control mb-2"
                placeholder="Monto"
                value={ingreso.monto}
                onChange={e => setIngreso({ ...ingreso, monto: e.target.value })}
                min="0.01"
                step="0.01"
                required
              />
              <button className="btn btn-success me-2" type="submit">Agregar</button>
              <button className="btn btn-secondary" onClick={() => setShowIngresoModal(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Presupuesto */}
      {showEditarModal && presupuestoEditar && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <h2>Editar Presupuesto</h2>
            <form onSubmit={e => { e.preventDefault(); handleEditarPresupuesto(); }}>
              <input
                className="form-control mb-2"
                placeholder="Nombre"
                value={presupuestoEditar.nombre}
                onChange={e => setPresupuestoEditar({ ...presupuestoEditar, nombre: e.target.value })}
                required
              />
              <select
                className="form-control mb-2"
                value={presupuestoEditar.periodo}
                onChange={e => setPresupuestoEditar({ ...presupuestoEditar, periodo: e.target.value })}
                required
              >
                <option value="anual">Anual</option>
                <option value="mensual">Mensual</option>
              </select>
              <input
                type="number"
                className="form-control mb-2"
                placeholder="Año"
                value={presupuestoEditar.anio}
                onChange={e => setPresupuestoEditar({ ...presupuestoEditar, anio: parseInt(e.target.value) || currentYear })}
                required
              />
              <input
                className="form-control mb-3"
                placeholder="Mes"
                value={presupuestoEditar.mes}
                onChange={e => setPresupuestoEditar({ ...presupuestoEditar, mes: e.target.value })}
              />
              <button className="btn btn-primary me-2" type="submit">Guardar</button>
              <button className="btn btn-secondary" onClick={() => setShowEditarModal(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrincipalAdmin;
