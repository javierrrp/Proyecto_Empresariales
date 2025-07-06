import React, { useEffect, useState } from "react";
import { supabase } from '../../../supabase.js';
import { useUser } from '../../../Context/UserContext.jsx';
import { FaPiggyBank } from "react-icons/fa";
import Swal from 'sweetalert2';
import "./Principal.css";

const PrincipalEstandar = () => {
  const today = new Date();
  const currentYear = today.getFullYear();

  const [budget, setBudget] = useState([]);
  const { user } = useUser();
  const [MostrarMovimientos, setMostrarMovimientos] = useState(false);
  const [presupuestosList, setPresupuestosList] = useState([]);
  const [presupuestoActivo, setPresupuestoActivo] = useState(null);

  const [showGastoModal, setShowGastoModal] = useState(false);
  const [gasto, setGasto] = useState({ descripcion: "", monto: "", id_presupuesto: "" });

  const GetBudget = async () => {
    const { data: presupuestos, error } = await supabase
      .from('presupuestos')
      .select('*')
      .eq('id_usuario', user.id);
    if (error) {
      console.log('Error al obtener presupuestos:', error);
    } else {
      setBudget(presupuestos);
    }
  };

  const handleMostrarMovs = async (id_presupuesto) => {
    const { data, error } = await supabase
      .from('transacciones')
      .select('*')
      .eq('id_presupuesto', id_presupuesto);

    if (error) {
      console.error('Error al obtener movimientos:', error);
    } else {
      setPresupuestosList(data);
      setPresupuestoActivo(id_presupuesto);
      setMostrarMovimientos(true);
    }
  };

  const cerrarMovs = () => setMostrarMovimientos(false);

  const handleAddGasto = async () => {
    const { descripcion, monto, id_presupuesto } = gasto;

    if (!descripcion || !monto || !id_presupuesto) {
      Swal.fire("Campos incompletos", "Completa todos los campos.", "warning");
      return;
    }

    const { data: presupuesto } = await supabase
      .from('presupuestos')
      .select('monto_total')
      .eq('id', id_presupuesto)
      .single();

    if (presupuesto.monto_total < parseFloat(monto)) {
      Swal.fire("Saldo insuficiente", "No hay suficiente saldo en el presupuesto.", "warning");
      return;
    }

    await supabase.from('transacciones').insert([{
      tipo: 'gasto',
      monto: parseFloat(monto),
      origen: 'manual',
      destinatario: descripcion,
      fecha: new Date().toISOString(),
      id_presupuesto: parseInt(id_presupuesto),
    }]);

    await supabase
      .from('presupuestos')
      .update({ monto_total: presupuesto.monto_total - parseFloat(monto) })
      .eq('id', id_presupuesto);

    Swal.fire("Gasto registrado correctamente", "", "success");
    setGasto({ descripcion: "", monto: "", id_presupuesto: "" });
    setShowGastoModal(false);
    GetBudget();
  };

  useEffect(() => {
    if (user) GetBudget();
  }, [user]);

  return (
    <div>
      {/* Lista de presupuestos */}
      <div className="presupuestos">
        {budget.map((budgets, index) => (
          <div className="card" key={index} style={{ width: '18rem' }}>
            <div className="card-body">
              <FaPiggyBank className="icono" />
              <h5 className="card-title">{budgets.nombre}</h5>
              <h6 className="card-subtitle mb-2 text-body-secondary">ID de Cuenta: {budgets.id}</h6>
              <h1 className="card-text">${budgets.monto_total}</h1>
              <a onClick={() => handleMostrarMovs(budgets.id)} className="card-link">Ver Movimientos</a><br />
              <a onClick={() => {
                setGasto({ ...gasto, id_presupuesto: budgets.id });
                setShowGastoModal(true);
              }} className="card-link">Agregar Gasto</a><br />
            </div>
          </div>
        ))}
      </div>

      {/* Modal de movimientos */}
      {MostrarMovimientos && (
        <div className="modal-overlay" onClick={cerrarMovs}>
          <div className="modal-content">
            <h2>Movimientos</h2>
            {presupuestosList.length === 0 ? <p>No hay movimientos.</p> :
              <ul className="list-group">
                {presupuestosList.map(mov => (
                  <li key={mov.id} className="list-group-item d-flex justify-content-between">
                    <span>{mov.tipo}</span>
                    <span>${mov.monto}</span>
                    <span>{mov.destinatario}</span>
                    <span>{new Date(mov.fecha).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>}
          </div>
        </div>
      )}

      {/* Modal de gasto */}
      {showGastoModal && (
        <div className="modal-overlay" onClick={() => setShowGastoModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Agregar Gasto</h3>
            <form onSubmit={e => { e.preventDefault(); handleAddGasto(); }}>
              <input className="form-control" placeholder="Descripción"
                value={gasto.descripcion}
                onChange={e => setGasto({ ...gasto, descripcion: e.target.value })} />
              <input className="form-control" placeholder="Monto"
                type="number"
                value={gasto.monto}
                onChange={e => setGasto({ ...gasto, monto: e.target.value })} />
              <br />
              <button className="btn btn-danger" type="submit">Registrar Gasto</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrincipalEstandar;