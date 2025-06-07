import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Navbar from './Components/Navbar/Navbar.jsx';

import Home from './Pages/Home/Home.jsx';


function App() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <Home />
    </>
  );
}

export default App;
