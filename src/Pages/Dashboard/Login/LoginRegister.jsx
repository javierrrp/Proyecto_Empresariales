import { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { supabase } from '../../../supabase.js'
import { useUser } from '../../../Context/UserContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import './LoginRegister.css'


const LoginRegister = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState('');
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();
    const { setUser } = useUser();


    const [action, setAction] = useState('');

    const registerLink = () => {
        setAction(' active')
    }

    const loginLink = () => {
        setAction('')
    }



    const handleLogin = async (e) => {
        e.preventDefault();

        const { data: usuarios, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('username', username)
            .eq('password', password)

        if (error || usuarios.length === 0) {
            setMensaje('Error: Credenciales inválidas');
        } else {
            const userData = usuarios[0];
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
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                            placeholder='Password' required />
                            <FaLock className='icon'/>
                        </div>

                        <div className='remember-forgot'>
                            <label><input type='checkbox' />Remember me</label>
                            <a href="#">Forgot password?</a>
                        </div>

                        <button type='submit'>Login</button>

                        <div className='register-link'>
                           <p>No tienes una cuenta? <a href='#'
                            onClick={registerLink}>Registrarse</a></p>
                        </div>
                    </form>
                </div>

                 <div className='form-box register'>
                    <form action="">
                        <h1>Registration</h1>
                        <div className='input-box'>
                            <input type="text" value={username}
                            placeholder='Username' required />
                            <FaUser className='icon'/>
                        </div>
                        <div className='input-box'>
                            <input type="email" value={email} 
                            placeholder='Email' required />
                            <FaUser className='icon'/>
                        </div>
                        <div className='input-box'>
                            <input type="password" value={password}
                            placeholder='Password' required />
                            <FaLock className='icon'/>
                        </div>

                    
                        <div className='role-select'>
                            <label htmlFor='role'>Seleccione tipo de usuario</label>
                            <select name='role' id='role'>
                                <option value=''>Seleccione un rol</option>
                                <option value='admin'>Administrador</option>
                                <option value='standard'>Estandar</option>
                                <option value='auditor'>Auditor</option>
                            </select>
                        </div>

                        <div className='remember-forgot'>
                            <label><input type='checkbox' />Acepto los terminos y condiciones</label>
                            <a href="#">Forgot password?</a>
                        </div>


                        <button type='submit'>Registrarse</button>

                        <div className='register-link'>
                            <p>Ya tienes una cuenta? <a href='#'
                            onClick={loginLink}>Login</a></p>
                        </div>
                    </form>
                </div>
            </div>


            
        </div>
    )
}


export default LoginRegister;