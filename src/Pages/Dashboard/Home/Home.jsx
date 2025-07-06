import React from 'react';

import './Home.css';

const Home = () => {
    return (
        <div>
            {/* Hero Section */}
            <div id='home'>
                <div className="landing-text">
                    <h1>BizBudget</h1>
                    <h3>Comodidad con sus ingresos</h3>
                    <a href='/login' className="btn btn-light">Empieza ya</a>
                </div>
            </div>

            {/* About Section */}
            <div className='padding'>
                <div className='container'>
                    <div className="row">
                        {/* Placeholder for future hero/illustration */}
                        <div className='col-sm-6'></div>

                        <div className='col-sm-6 text-center'>
                            <h2>¿Qué es BizBudget?</h2>
                            <p className="lead">
                                La gestión y el control de presupuestos representan un desafío constante para las empresas, 
                                especialmente cuando manejan múltiples áreas, proyectos o departamentos.
                            </p>
                            <p className="lead">
                                Para ello les presentamos <strong>BizBudget</strong>, una aplicación de gestión de presupuestos cómoda y fácil de usar. 
                                El objetivo de BizBudget es ser una herramienta que permita al usuario gestionar, registrar, consultar y analizar 
                                presupuestos de forma eficiente, minimizando errores humanos y optimizando los tiempos de gestión.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
