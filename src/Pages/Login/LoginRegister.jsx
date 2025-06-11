import { useState } from 'react';
import './LoginRegister.css';
import { FaUser, FaLock } from 'react-icons/fa';


const LoginRegister = () => {

    const [action, setAction] = useState('');

    const registerLink = () => {
        setAction(' active')
    }

    const loginLink = () => {
        setAction('')
    }
    return (
        <div className='container-general'>
            <div className={`wrapper${action}`} >

                <div className='form-box login'>
                    <form action="">
                        <h1>Login</h1>
                        <div className='input-box'>
                            <input type="text" 
                            placeholder='Username' required />
                            <FaUser className='icon'/>
                        </div>
                        <div className='input-box'>
                            <input type="password"
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
                            <input type="text" 
                            placeholder='Username' required />
                            <FaUser className='icon'/>
                        </div>
                        <div className='input-box'>
                            <input type="email" 
                            placeholder='Email' required />
                            <FaUser className='icon'/>
                        </div>
                        <div className='input-box'>
                            <input type="password"
                            placeholder='Password' required />
                            <FaLock className='icon'/>
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