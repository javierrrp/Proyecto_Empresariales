// src/Components/Admin/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../Admin/Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li><a href="/auditor">Presupuestos</a></li>
          <li><a href="/auditor/settingsauditor">Configuración</a></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;