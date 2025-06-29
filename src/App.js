import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar.jsx';

import LoginRegister from './Pages/Dashboard/Login/LoginRegister.jsx';
import Home from './Pages/Dashboard/Home/Home.jsx';

import PrincipalAdmin from './Pages/Admin/Principal/Principal.jsx';
import Registro from './Pages/Admin/Registro/Registro.jsx';
import Settings from './Pages/Admin/Configuracion/Settings.jsx';

<<<<<<< Updated upstream
=======
import PrincipalAuditor from './Pages/Auditor/Principal/Principal.jsx';
import SettingsAuditor from './Pages/Auditor/Configuracion/Settings.jsx';

import PrincipalEstandar from './Pages/Estandar/Principal/Principal.jsx';
import SettingsEstandar from './Pages/Estandar/Configuracion/Settings.jsx';

import AdminLayout from './Layout/AdminLayout.jsx';
import AuditorLayout from './Layout/AuditorLayout.jsx';

>>>>>>> Stashed changes
function App() {
  return (
<Router>
      <Navbar />
      <Routes>
<<<<<<< Updated upstream
        <Route path='/'        element={<Home />} />
        <Route path='/login'   element={<LoginRegister />} />
        <Route path='/admin'   element={<PrincipalAdmin />} />
        <Route path='/auditor' element={<PrincipalAuditor/>}/>
        <Route path='/estandar' element={<PrincipalEstandar/>}/>
=======
        {/* Rutas públicas */}
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LoginRegister />} />

        {/* Admin */}
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<PrincipalAdmin />} />
          <Route path='registrar' element={<Registro />} />
          <Route path='settingsadmin' element={<Settings />} />
        </Route>

        {/* Auditor */}
        <Route path='/auditor' element={<AuditorLayout />}>
        <Route index element={<PrincipalAuditor />} />
        <Route path='settingsauditor' element={<SettingsAuditor />} />
      </Route>


        {/* Estandar */}
        <Route path='/estandar' element={<PrincipalEstandar />} />
        <Route path='/settingsestandar' element={<SettingsEstandar />} />
>>>>>>> Stashed changes
      </Routes>
    </Router>
  );
}

export default App;
