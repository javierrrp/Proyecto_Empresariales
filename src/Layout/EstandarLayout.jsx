import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Components/Estandar/Sidebar';

const EstandarLayout = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default EstandarLayout;
