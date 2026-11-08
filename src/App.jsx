import Navbar from "./components/Navbar"
import { useState } from "react";
import "./App.css";
import Noticias from "./components/Noticias";
import Perros from "./components/Perros";
import Criaturas from "./components/Criaturas";

function App(){
  const [seccion, setSeccion] = useState("Inicio");
  return(
    <div className="app">
      <Navbar seccion={seccion} cambiarSeccion = {setSeccion}/>
      <main className="contenido">
        {seccion === "Inicio" && (
          <div className="bienvenido">
            <h1>Bienvenido a la galería de APIs</h1>
            <p>Aquí encontrará una diversidad de APIs gratuitos de diversos temas.</p>
          </div>
          )}
          {seccion === "Noticias" && <Noticias />}
          {seccion === "Perros" && <Perros/>/*(
          <div className="bienvenido">
            <h1>Sección Perros</h1>
            <p>Próximamente encontrará imágenes del mejor amigo del hombre.</p>
          </div>
          )*/}
          {seccion === "Criaturas" && <Criaturas/>}
      </main>
    </div>
  );
}

export default App