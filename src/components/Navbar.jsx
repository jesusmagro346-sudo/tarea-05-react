import "./Navbar.css"
function Navbar({seccion, cambiarSeccion}){
    const opciones = ["Inicio", "Noticias", "Perros", "Criaturas"]
    return (
        <nav className="navbar">
            <div>
                <span>📦</span>APIs
            </div>
            <div className="nav-link">
                {
                    opciones.map((opcion) => (
                        <button key={opcion}
                        className={seccion === opcion ? 
                            "seleccionado" : ""}
                            onClick={() => cambiarSeccion(opcion)}>
                                {opcion}
                            </button>
                    ))
                }
            </div>
        </nav>
    )
}

export default Navbar