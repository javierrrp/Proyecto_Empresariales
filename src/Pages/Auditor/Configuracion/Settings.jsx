import React from "react";
import "./Settings.css";

const SettingsAuditor = () => (
  <main className="settings-wrapper">
    <aside className="sidebar">
      <nav>
        <ul>
          <li><a href="#dashboard">Dashboard</a></li>
          <li><a href="/admin">Presupuestos</a></li>
          <li><a href="/settingsauditor">Movimientos</a></li>
          <li><a href="/registrar">Gestión usuarios</a></li>
          <li><a href="/settings">Configuración</a></li>
        </ul>
      </nav>
    </aside>

    <section className="interfaz">
      {/* Cuenta */}
      <div className="config-section">
        <h3>Cuenta</h3>
        <button className="btn btn-secondary mb-2">Cambiar contraseña</button>
        <button className="btn btn-outline-secondary">Activar 2FA</button>
      </div>

      {/* Notificaciones */}
      <div className="config-section">
        <h3>Notificaciones</h3>
        <button className="btn btn-outline-info">Configurar alertas</button>
      </div>


      {/* Apariencia */}
      <div className="config-section">
        <h3>Apariencia</h3>
        <button className="btn btn-outline-primary">Tema claro / oscuro</button>
      </div>

    </section>
  </main>
);

export default SettingsAuditor;
