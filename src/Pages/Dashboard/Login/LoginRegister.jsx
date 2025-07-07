import { useState } from 'react';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { supabase } from '../../../supabase.js'
import { useUser } from '../../../Context/UserContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './LoginRegister.css'


const LoginRegister = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rol, setRol] = useState('');
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();
    const { setUser } = useUser();


    const [action, setAction] = useState('');

    let EyeIcon;
    if (showPassword) {
    EyeIcon = FaEyeSlash;
    } else {
    EyeIcon = FaEye;
    }





    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data: userData, error, status } = await supabase
                .from('usuarios')
                .select('*')
                .eq('username', username)
                .maybeSingle();   // ← devuelve {…} | null

            if (error && status !== 406) {
                Swal.fire('Error', `Problema al consultar la BD: ${error.message}`, 'error');
                return;
            }

            if (!userData) {
                Swal.fire("Error", "Usuario no encontrado", "error");
                return;
            }

            

            if (userData.password !== password) {
                Swal.fire("Error", "Contraseña incorrecta", "error");
                return;
            }


            alert('Inicio de sesión exitoso. Bienvenido ' + userData.nombre);
            setUser(userData);

            if (userData.rol === 'admin') {
                navigate('/admin');
            } else if (userData.rol === 'auditor') {
                navigate('/auditor');
            } else if (userData.rol === 'estandar') {
                navigate('/estandar');
            } else {
                setMensaje('Rol no reconocido');
            }
        } catch (err) {
            Swal.fire('Error', `Excepción inesperada: ${err.message}`, 'error');
        }
    };




    return (
        <div className='container-general'>
            <div className={`wrapper${action}`} >

                <div className='form-box login'>
                    <form onSubmit={handleLogin}>
                        <h1>Login</h1>
                        <div className='input-box'>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                            placeholder='Username' required />
                            <FaUser className='icon'/>
                        </div>
                         <div className='input-box'>
                            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password'
                                required
                            />
                            <FaLock className='icon' />
                            <EyeIcon
                                className="icon eye-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{marginRight:'20px'}}
                            />
                        </div>

                        <div className='remember-forgot'>
                            <label><input type='checkbox' />Remember me</label>
                            <a href="#">Forgot password?</a>
                        </div>

                        <button type='submit'>Login</button>

                       
                    </form>
                </div>

            </div>


            
        </div>
    )
}


export default LoginRegister;