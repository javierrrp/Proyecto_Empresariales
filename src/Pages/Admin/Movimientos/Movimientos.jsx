import { useState, useEffect } from "react";
import { supabase } from "../../../supabase";
import * as XLSX from "xlsx";
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


  const resumenFinanciero = presupuestosList.reduce(
    (acc, item) => {
      if (item.tipo.toLowerCase() === "ingreso") {
        acc.ingresos += Number(item.monto);
      } else if (item.tipo.toLowerCase() === "egreso") {
        acc.egresos += Number(item.monto);
      }
      return acc;
    },
    { ingresos: 0, egresos: 0 }
  );
  resumenFinanciero.balance = resumenFinanciero.ingresos - resumenFinanciero.egresos;

  const exportar_excel = () => {
    const wb = XLSX.utils.book_new();

    // Hoja 1: Movimientos (todos los datos)
    // Convierte array de objetos a hoja
    const wsMovimientos = XLSX.utils.json_to_sheet(presupuestosList);
    XLSX.utils.book_append_sheet(wb, wsMovimientos, "Movimientos");

    // Hoja 2: Resumen financiero
    const resumenData = [
      ["Resumen Movimientos"],
      ["Ingresos", resumenFinanciero.ingresos],
      ["Egresos", resumenFinanciero.egresos],
      ["Balance", resumenFinanciero.balance],
    ];
    const wsResumen = XLSX.utils.aoa_to_sheet(resumenData);
    XLSX.utils.book_append_sheet(wb, wsResumen, "Resumen");

    XLSX.writeFile(wb, "movimientos.xlsx");
  };




  return (
    <div style={{ display: 'flex'}}>
    
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
              <th>Hora</th>
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
                <td>{new Date(pre.fecha).toLocaleDateString()}</td>
                <td>{new Date(pre.fecha).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={exportar_excel}>Exportar Datos</button>
    </div>
  );
}


export default Movimientos;
