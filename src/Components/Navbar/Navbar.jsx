import './Navbar.css';
import { useUser } from '../../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import logo from '../Images/logo.png'


const Navbar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/');
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" role="navigation">
      <div className="container-fluid">
      <a className="navbar-brand" href="#"><img src={logo} alt="Logo" height="40" /></a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbar-collapse-main"
          aria-controls="navbar-collapse-main"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbar-collapse-main">
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <a className="nav-link active" aria-current="page" href="/home">Home</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">About</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Servicios</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Opiniones</a>
          </li>
          {user && (
            <li className='nav-item d-flex align-items-center gap-2'>
              <span className="nav-link text-white mb-0">Bienvenido, {user.username}</span>
              <button className='btn btn-danger btn-sm' onClick={handleLogout}>Cerrar Sesión</button>
            </li>
          )}
        </ul>

        </div>
      </div>
    </nav>
  )
}

export default Navbar;
