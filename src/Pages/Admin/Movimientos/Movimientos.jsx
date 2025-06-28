import { useState, useEffect } from "react";
import { supabase } from "../../../supabase";
import Swal from 'sweetalert2'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Movimientos.css';

function Movimientos() {
  const [id, setId] = useState("");
  const [tipo, setTipo] = useState("");
  const [monto, setMonto] = useState("");
  const [origen, setOrigen] = useState("");
  const [destinatario, setDestinatario] = useState("");
  const [fecha, setFecha] = useState("");
  const [presupuestosList, setPresupuestosList] = useState([]);

  const getTransacciones = () => {
    supabase
      .from('transacciones')
      .select('*')
      .then(({ data, error }) => {
        if (error) console.log('Error');
        else{ 
        setPresupuestosList(data);
        }
      });
  };

  useEffect(() => {
    getTransacciones();
  }, []);





  return (
    <div style={{ display: 'flex'}}>
      <aside className="sidebar">
        <nav>
          <ul>
            <li><a href="#dashboard">Dashboard</a></li>
            <li><a href="/admin">Presupuestos</a></li>
            <li><a href="/movimientos">Movimientos</a></li>
            <li><a href="/registrar">Gestion usuarios</a></li>
            <li><a href="/settingsadmin">Configuración</a></li>
          </ul>
        </nav>
      </aside>
      
      <div className="container" style={{ flex: 1 }}>
        <table className="table table-striped mt-4">
          <thead>
            <tr>
              <th>#</th>
              <th>Tipo</th>
              <th>Monto</th>
              <th>Origen</th>
              <th>Destinatario</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {presupuestosList.map((pre) => (
              <tr key={pre.id}>
                <th scope="row">{pre.id}</th>
                <td>{pre.tipo}</td>
                <td>{pre.monto}</td>
                <td>{pre.origen}</td>
                <td>{pre.destinatario}</td>
                <td>{pre.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


export default Movimientos;
