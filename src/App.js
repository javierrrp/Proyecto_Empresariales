import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar.jsx';


import LoginRegister from './Pages/Dashboard/Login/LoginRegister.jsx';
import Home from './Pages/Dashboard/Home/Home.jsx';

import PrincipalAdmin from './Pages/Admin/Principal/Principal.jsx';
import Registro from './Pages/Admin/Registro/Registro.jsx';
import Settings from './Pages/Admin/Configuracion/Settings.jsx';
import Movimientos from './Pages/Admin/Movimientos/Movimientos.jsx';

import PrincipalAuditor from './Pages/Auditor/Principal/Principal.jsx';
import SettingsAuditor from './Pages/Auditor/Configuracion/Settings.jsx';


import PrincipalEstandar from './Pages/Estandar/Principal/Principal.jsx';
import SettingsEstandar from './Pages/Estandar/Configuracion/Settings.jsx';




function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LoginRegister />} />
        <Route path='/admin' element={<PrincipalAdmin />} />
          <Route path='/registrar' element={<Registro />} />
          <Route path='/settingsadmin' element={<Settings />} />
          <Route path='/movimientos' element={<Movimientos />} />
        
        <Route path='/auditor' element={<PrincipalAuditor/>}/>
          <Route path='/settingsauditor' element={<SettingsAuditor />} />
        <Route path='/estandar' element={<PrincipalEstandar/>}/>
          <Route path='/settingsestandar' element={<SettingsEstandar />} />


      </Routes>
    </Router>
  );
}

export default App;
