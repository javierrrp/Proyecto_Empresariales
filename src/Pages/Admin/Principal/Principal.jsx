import React, { useEffect, useState } from "react";
import { supabase } from '../../../supabase.js'
import { useUser } from '../../../Context/UserContext.jsx';
import { FaPiggyBank } from "react-icons/fa";
import "./Principal.css";

const PrincipalAdmin = () => {

    const [budget, setBudget] = useState([]);
    const { user } = useUser();
    const [showModal, setShowModal] = useState(false);
    
    useEffect(() => {
        const GetBudget = async () => {
            
            const { data: presupuestos, error } = await supabase
                .from('presupuestos')
                .select('*')
                .eq('id_usuario', user.id)
    
            if (error || presupuestos.length === 0) {
                console.log('Error');
            } else {
                const userData = presupuestos;
                setBudget(userData);    
            }
        };
        GetBudget();
        
    }, [user]);
    return (
        <div>
        <button type="button" class="btn btn-info" onClick={() => setShowModal(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="40" height="40">
            <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/>
            </svg>
            Crear Presupuesto </button>
             {showModal && (
                <div className="modal-overlay">
                    
                    <div className="modal-content">
                    <button
                        type="button"
                        className="btn-close position-absolute top-0 end-0 m-3"
                        aria-label="Cerrar"
                        onClick={() => setShowModal(false)}
                    ></button>
                    <h2>Crear Presupuesto</h2>
                    <form>
                        <div className="mb-3">
                        <label>Nombre:</label>
                        <input type="text" className="form-control" />
                        </div>
                        <div className="mb-3">
                        <label>Año:</label>
                        <input type="text" className="form-control" />
                        </div>
                        <div className="mb-3">
                        <label>Periodo:</label>
                        <input type="text" className="form-control" />
                        </div>
                        <div className="mb-3">
                        <label>Mes:</label>
                        <select className="form-control">
                            <option value="enero">Enero</option>
                            <option value="febrero">Febrero</option>
                            <option value="marzo">Marzo</option>
                            <option value="abril">Abril</option>
                            <option value="mayo">Mayo</option>
                            <option value="junio">Junio</option>
                            <option value="julio">Julio</option>
                            <option value="agosto">Agosto</option>
                            <option value="septiembre">Septiembre</option>
                            <option value="octubre">Octubre</option>
                            <option value="noviembre">Noviembre</option>
                            <option value="diciembre">Diciembre</option>
                        </select>
                        </div>
                    <button type="submit" className="btn btn-link">Crear</button>
                    </form>
                    </div>
                </div>
            )}

        <div style={{ display: 'flex'}}>
           
            
            <div className="presupuestos"> 

                {budget.map((budgets, index) => (
                    <div className="card" key={index} style={{ width: '18rem' }}>
                        <div className="card-body">
                            <FaPiggyBank className="icono" />
                            <h5 className="card-title">{budgets ? budgets.nombre : 'Cargando'}</h5>
                            <h6 className="card-subtitle mb-2 text-body-secondary">{budgets ? budgets.id : 'Cargando'}</h6>
                            <h1 className="card-text">${budgets ? budgets.monto_total : 'Cargando'}</h1>
                            <a href="#" className="card-link">Ver Movimientos</a>
                        </div>
                    </div>
                ))} 
            </div>
        </div>
        </div>
    )
}

export default PrincipalAdmin;