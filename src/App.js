import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar.jsx';


import LoginRegister from './Pages/Login/LoginRegister.jsx';
import Home from './Pages/Home/Home.jsx';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LoginRegister />} />
      </Routes>
    </Router>
  );
}

export default App;
