import React from 'react';
import { Link } from 'react-router-dom';
import '../Admin/Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
        <li><a href="/estandar">Dashboard</a></li>
        <li><a href="#presupuestos">Presupuestos</a></li>
        <li><a href="/estandar/settingsestandar">Configuración</a></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
