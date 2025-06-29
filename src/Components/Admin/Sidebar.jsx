// src/Components/Admin/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../Admin/Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li><Link to="/admin">Dashboard</Link></li>
          <li><Link to="/admin/registrar">Gestión usuarios</Link></li>
          <li><Link to="/admin/settingsadmin">Configuración</Link></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
