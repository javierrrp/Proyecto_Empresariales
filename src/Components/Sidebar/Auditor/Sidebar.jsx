// src/Components/Admin/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../Admin/Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li><a href="#dashboard">Dashboard</a></li>
          <li><a href="#presupuestos">Presupuestos</a></li>
          <li><a href="/settingsauditor">Configuración</a></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;