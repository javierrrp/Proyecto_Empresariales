import gestionimg from './gestion.png';
import control from './control.png';
import informe from './informe.png';
import candadito from './candadito.png';


const Services = () => {

    return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{fontFamily: 'Georgia'}}>Servicios</h1>
        <div style={{display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem", width: "600px", marginLeft: 0 }}>
            <img src={gestionimg}  width={150}/> 
            <p>Te ayudamos a planificar tus finanzas mensuales estableciendo límites de gasto por categoría (comida, transporte, ocio, etc.).
                 Visualiza tus ingresos y egresos de forma clara y toma mejores decisiones económicas.
            </p>
        </div>

         <div style={{display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem", width: "600px", marginLeft: 'auto' }}>
            <img src={control}  width={150}/> 
            <p>
                Si tienes un negocio, podrás registrar ventas, gastos operativos y flujos de caja de forma ordenada.
                Obtén reportes financieros automáticos que te permiten identificar áreas de mejora y oportunidades de ahorro.
            </p>
        </div>

        <div style={{display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem", width: "600px", marginLeft: 0 }}>
            <img src={informe}  width={150}/> 
            <p>
                Generamos gráficos e informes interactivos que te permiten analizar tu comportamiento financiero con claridad. 
                Puedes visualizar tendencias, comparar periodos y hacer ajustes estratégicos en tus hábitos de consumo o inversión.
            </p>
        </div>
        
        <div style={{display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem", width: "600px", marginLeft: 'auto' }}>
            <img src={candadito}  width={150}/> 
            <p>
                Toda tu información financiera está protegida con los más altos estándares de seguridad. 
                Tus datos son tuyos y siempre tendrás el control total sobre lo que compartes o eliminas.
            </p>
        </div>
        
    </div>
    )



}

export default Services;