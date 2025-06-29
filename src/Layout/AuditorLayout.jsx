import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Components/Auditor/Sidebar.jsx';

const AuditorLayout = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AuditorLayout;
