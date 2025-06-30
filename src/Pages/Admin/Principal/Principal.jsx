import React, { useEffect, useState } from "react";
import { supabase } from '../../../supabase.js'
import { useUser } from '../../../Context/UserContext.jsx';
import { FaPiggyBank } from "react-icons/fa";
import Swal from 'sweetalert2'
import "./Principal.css";

const PrincipalAdmin = () => {
    
    const today        = new Date();
    const currentYear  = today.getFullYear();
    const currentMonth = today
    .toLocaleString("es-CL", { month: "long" })            
    .toLowerCase();

    const [budget, setBudget] = useState([]);
    const { user } = useUser();
    const [showModal, setShowModal] = useState(false);

    const [nombre, setNombre] = useState('');
    const [anio, setAnio] = useState(currentYear);
    const [periodo, setPeriodo] = useState('');
    const [mes,  setMes]  = useState(currentMonth);



    
    
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

    const AddBudget = async () => {
        const { error } = await supabase.from('presupuestos').insert([
            { nombre, anio, periodo, mes, id_usuario: user.id }
        ]);

        if (error) {
            console.log("Error al registrar:", error);
            Swal.fire("Error", "No se pudo agregar el presupuesto.", "error");
            return;
        }

        Swal.fire({
        title: "Presupuesto creado correctamente!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
        });

        setShowModal(false);
        setNombre('');
        setAnio('');
        setPeriodo('');
        setMes('');
        GetBudget();
    };

    useEffect(() => {
        if (user) {
            GetBudget();
        }
    }, [user]);

    return (
        <div>
        <button type="button" className="btn btn-info" onClick={() => setShowModal(true)}>
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
                        <input type="text" className="form-control" value={nombre} onChange={e => setNombre(e.target.value)}/>
                        </div>
                        
                        <div className="mb-3">
                        <label>Periodo:</label>
                        <select className="form-control" value={periodo} onChange={e => setPeriodo(e.target.value)}>
                            <option value="anual">Anual</option>
                            <option value="mensual">Mensual</option>

                        </select>
                        </div>
    
                    <button className="btn btn-link" onClick={async (e) => {
                        e.preventDefault();
                        await AddBudget();
                        await GetBudget();
                    }}>Crear</button>
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