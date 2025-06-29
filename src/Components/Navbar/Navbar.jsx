import './Navbar.css';
import { useUser } from '../../Context/UserContext';
import { useNavigate } from 'react-router-dom';



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
        <a className="navbar-brand" href="#"><img src="#" alt="Logo" /></a>
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
            {user && (
              <li className='nav-item'>
                <div className='nav-link'>
                  <button className='btn btn-danger' onClick={handleLogout}>Cerrar Sesion</button>
                </div>
              </li>
            )}
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">About</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Servicios</a>
            </li>
            {user && (
              <li className='nav-item'>
                <span className="nav-link" style={{color: 'white' }}>Hola! {user.username}</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;
