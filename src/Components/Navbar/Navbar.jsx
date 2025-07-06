import './Navbar.css';
import { useUser } from '../../Context/UserContext';
import { useNavigate, NavLink } from 'react-router-dom';
import logo from '../Images/logo.png';

/**
 * Responsive top‑navigation bar.
 *
 * ▸ Muestra enlaces públicos (Home, About, Servicios, Opiniones).
 * ▸ Redirige “Home” y el logo a la ruta apropiada según el rol del usuario.
 * ▸ Saludo y botón de cierre de sesión cuando el usuario está autenticado.
 */
const Navbar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  // Definir la ruta de inicio según el rol del usuario
  let homePath = '/';
  if (user?.role === 'admin') {
    homePath = '/admin';
  } else if (user?.role === 'auditor') {
    homePath = '/auditor';
  }

  // Cerrar sesión y volver a la pantalla pública
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" role="navigation">
      <div className="container-fluid">
        {/* Brand / Logo */}
        <NavLink to={homePath} className="navbar-brand">
          <img src={logo} alt="BizBudget Logo" height="40" />
        </NavLink>

        {/* Toggler para vista móvil */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbar-collapse-main"
          aria-controls="navbar-collapse-main"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navbar-collapse-main">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-lg-3">
            <li className="nav-item">
              <NavLink to={homePath} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/about" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>About</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/services" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Servicios</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/opiniones" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Opiniones</NavLink>
            </li>

            {/* Usuario logueado */}
            {user && (
              <li className="nav-item d-flex align-items-center gap-2">
                <span className="nav-link text-white mb-0">Hola, {user.username}</span>
                <button className="btn btn-danger btn-sm" onClick={handleLogout}>Cerrar sesión</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
