import React, { use, useEffect, useState } from "react";
import { supabase } from '../../../supabase.js'
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
        <div style={{ display: 'flex'}}>
             <aside className="sidebar">
                <nav>
                    <ul>
                        <li><a href="#dashboard">Dashboard</a></li>
                        <li><a href="#presupuestos">Presupuestos</a></li>
                        <li><a href="/movimientos">Movimientos</a></li>
                        <li><a href="/registrar">Gestion usuarios</a></li>
                        <li><a href="/settingsadmin">Configuración</a></li>
                    </ul>
                </nav>
            </aside>
            
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