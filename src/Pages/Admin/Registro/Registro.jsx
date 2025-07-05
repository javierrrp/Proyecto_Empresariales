import { useState, useEffect } from "react";
import { supabase } from "../../../supabase";
import Swal from 'sweetalert2'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Registro.css';

function Registro() {
  const [idEditando, setIdEditando] = useState(null);
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("");
  const [username, setUsername] = useState("");
  const [empleadosList, setEmpleadosList] = useState([]);

  const getEmpleados = () => {
    supabase
      .from('usuarios')
      .select('*')
      .then(({ data, error }) => {
        if (error) console.log('Error');
        else{ 
        
        const ordenados = [...data].sort((a, b) =>
          a.nombre.localeCompare(b.apellidos, 'es', { sensitivity: 'base' })
        );
        setEmpleadosList(ordenados);
        }
      });
  };

  useEffect(() => {
    getEmpleados();
  }, []);

  const limpiar = () => {
    setIdEditando(null);
    setNombre("");
    setApellidos("");
    setEmail("");
    setPassword("");
    setRol("");
    setUsername("");
  };

  const guardar = async () => {
    if (!nombre || !apellidos || !email || !password || !rol || !username) {
                Swal.fire("Campos incompletos", "Completa todos los campos obligatorios.", "warning");
                return;
    }
    try {
        if (idEditando === null) {
          // Insertar nuevo usuario
          const { error } = await supabase.from('usuarios').insert([
            { nombre, apellidos, email, password, rol, username }
          ]);
          if (error) console.log("Error al registrar:", error);
        } else {
          // Actualizar usuario existente
          const { error } = await supabase
            .from('usuarios')
            .update({ nombre, apellidos, email, password, rol, username })
            .eq('id', idEditando);
          if (error) throw error;
        }

        Swal.fire({
            title: "Usuario editado/agregado correctamente!",
            icon: "success",
            draggable: true
        });
        getEmpleados();
        limpiar();
      } catch(err) {
        console.log("Error al registrar:", err.message);
        Swal.fire("Error", "No se pudo agregar/actualizar el usuario.", "error");
      }
  };
  const editarEmpleado = (id) => {
    const emp = empleadosList.find(u => u.id === id);
    if (!emp) return;
    setIdEditando(id);
    setNombre(emp.nombre);
    setApellidos(emp.apellidos);
    setEmail(emp.email);
    setPassword(""); // evitar mostrar la original
    setRol(emp.rol);
    setUsername(emp.username);
  };

  const deletEmpleado = async (id) => {
    const { error } = await supabase.from('usuarios').delete().eq('id', id);
    if (error) console.log('Error al eliminar:', error);
    else

    Swal.fire({
        title: "Estas seguro/a?",
        text: "Esta accion es irreversible",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, borrar!"
        }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
            title: "Borrado!",
            text: "El empleado a sido borrado exitosamente",
            icon: "success"
            });
        getEmpleados();
        } 
    });
  };

  return (
    <div className="container">
      <div className="card text-center">
        <div className="card-header">Gestión de Usuarios</div>
        <div className="card-body">
          <div className="input-group mb-3">
            <span className="input-group-text">Nombre:</span>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="form-control" />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text">Apellidos:</span>
            <input type="text" value={apellidos} onChange={(e) => setApellidos(e.target.value)} className="form-control" />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text">Username:</span>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control" />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text">Email:</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text">Contraseña:</span>
            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text">Rol:</span>
            <select className="form-select" value={rol} onChange={(e) => setRol(e.target.value)}>
              <option value="">Seleccione un rol</option>
              <option value="admin">Administrador</option>
              <option value="auditor">Auditor</option>
              <option value="estandar">Estandar</option>
            </select>
          </div>
        </div>

        <div className="card-footer text-body-secondary">
          <button className="btn btn-success me-2" onClick={guardar}>
            {idEditando === null ? 'Registrar' : 'Guardar Cambios'}
          </button>
          {idEditando !== null && (
            <button className="btn btn-secondary" onClick={limpiar}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Apellidos</th>
            <th>Nombre</th>
            <th>Username</th>
            <th>Email</th>
            <th>Contraseña</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleadosList.map((val) => (
            <tr key={val.id}>
              <th scope="row">{val.id}</th>
              <td>{val.apellidos}</td>
              <td>{val.nombre}</td>
              <td>{val.username}</td>
              <td>{val.email}</td>
              <td>{val.password}</td>
              <td>{val.rol}</td>
              <td>
                <div className="btn-group" role="group">
                  <button type="button" className="btn btn-warning" onClick={() => editarEmpleado(val.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16" fill="currentColor" className="me-1">
                      <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z" />
                    </svg>
                  </button>
                  <button type="button" className="btn btn-danger" onClick={() => deletEmpleado(val.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" fill="currentColor">
                      <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Registro;